'use server';

import { revalidateTag, unstable_cache } from 'next/cache';
import { connectToDatabase } from '@/database';
import BlogPost, { IBlogPost } from '../models/blog-post.model';
import { ISite } from '../models/site.model';
import { auth } from '@clerk/nextjs/server';
import User from '@/database/models/user.model';
import { utapi } from '@/server/uploadthing';
import { getBlurDataURL } from '../lib/utils';
import { replaceExamples, replaceTweets } from '../lib/remark-plugins';
import { serialize } from 'next-mdx-remote/serialize';

export async function getPostsForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '')
    : null;

  try {
    await connectToDatabase();

    return await unstable_cache(
      async () => {
        return BlogPost.find({
          site: subdomain ? { subdomain } : { customDomain: domain },
          published: true,
        }).sort({ createdAt: 'desc' });
      },
      [`${domain}-posts`],
      {
        revalidate: 900,
        tags: [`${domain}-posts`],
      }
    )();
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function getPostData(domain: string, slug: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '')
    : null;
  try {
    await connectToDatabase();

    return await unstable_cache(
      async () => {
        const data = await BlogPost.findOne({
          site: subdomain ? { subdomain } : { customDomain: domain },
          slug,
          published: true,
        })
          .populate({
            path: 'user',
            model: User,
          })
          .populate({
            path: 'user',
            model: User,
          });

        if (!data) return null;

        const [mdxSource, adjacentPosts] = await Promise.all([
          getMdxSource(data.content!),
          BlogPost.find({
            site: subdomain ? { subdomain } : { customDomain: domain },
            published: true,
            _id: { $not: data._id },
          }),
        ]);

        return {
          ...data,
          mdxSource,
          adjacentPosts,
        };
      },
      [`${domain}-${slug}`],
      {
        revalidate: 900, // 15 minutes
        tags: [`${domain}-${slug}`],
      }
    )();
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

async function getMdxSource(postContents: string) {
  // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
  // https://mdxjs.com/docs/what-is-mdx/#markdown
  const content =
    postContents?.replaceAll(/<(https?:\/\/\S+)>/g, '[$1]($1)') ?? '';
  // Serialize the content string into MDX
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [replaceTweets, () => replaceExamples()],
    },
  });

  return mdxSource;
}

export const getSiteFromPostId = async (postId: string) => {
  try {
    await connectToDatabase();
    const post = await BlogPost.findOne({
      _id: postId,
    });
    return JSON.parse(JSON.stringify(post.site));
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export const createPost = async (_: FormData, site: Partial<ISite>) => {
  const { userId } = auth();
  if (!userId) {
    return {
      error: 'Not authenticated',
    };
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const response = await BlogPost.create({
      site: site._id,
      user: user._id,
    });

    await revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`
    );
    site.customDomain && (await revalidateTag(`${site.customDomain}-posts`));

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

// creating a separate function for this because we're not using FormData
export const updatePost = async (data: Partial<IBlogPost>) => {
  const { userId } = auth();
  if (!userId) {
    return {
      error: 'Not authenticated',
    };
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return {
        error: 'User Not Found',
      };
    }

    const post = await BlogPost.findById(data._id);
    if (!post || post.user !== user._id.toString()) {
      return {
        error: 'Post not found',
      };
    }

    const response = await BlogPost.findByIdAndUpdate(
      data._id,
      {
        title: data.title,
        description: data.description,
        content: data.content,
      },
      { new: true }
    );

    await revalidateTag(
      `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`
    );
    await revalidateTag(
      `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`
    );

    // if the site has a custom domain, we need to revalidate those tags too
    post.site?.customDomain &&
      (await revalidateTag(`${post.site?.customDomain}-posts`),
      await revalidateTag(`${post.site?.customDomain}-${post.slug}`));

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updatePostMetadata = async (
  formData: FormData,
  post: Partial<IBlogPost> & {
    site: Partial<ISite>;
  },
  key: string
) => {
  const value = formData.get(key) as string;

  const { userId } = auth();
  if (!userId) {
    return {
      error: 'Not authenticated',
    };
  }

  try {
    await connectToDatabase();
    let response;
    if (key === 'image') {
      const file = formData.get('image') as File;

      const { data } = await utapi.uploadFiles(file);
      if (!data) {
        return {
          error: 'Error uploading file',
        };
      }
      const blurhash = await getBlurDataURL(data.url);

      response = await BlogPost.findByIdAndUpdate(
        post._id,
        {
          image: data.url,
          imageBlurhash: blurhash,
        },
        { new: true }
      );
    } else {
      response = await BlogPost.findByIdAndUpdate(
        post._id,
        {
          [key]: key === 'published' ? value === 'true' : value,
        },
        { new: true }
      );
    }

    await revalidateTag(
      `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`
    );
    await revalidateTag(
      `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`
    );

    // if the site has a custom domain, we need to revalidate those tags too
    post.site?.customDomain &&
      (await revalidateTag(`${post.site?.customDomain}-posts`),
      await revalidateTag(`${post.site?.customDomain}-${post.slug}`));

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    if (error.code === 'P2002') {
      return {
        error: `This slug is already in use`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const deletePost = async (_: FormData, post: Partial<IBlogPost>) => {
  const { userId } = auth();
  if (!userId) {
    return {
      error: 'Not authenticated',
    };
  }

  try {
    await connectToDatabase();

    const response = await BlogPost.findByIdAndDelete(post._id);

    return JSON.parse(JSON.stringify(response));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
