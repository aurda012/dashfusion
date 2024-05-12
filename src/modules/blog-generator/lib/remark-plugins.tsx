import Link from 'next/link';
import { visit } from 'unist-util-visit';
import { ReactNode } from 'react';
import Example, { IExample } from '../models/example.model';
import { connectToDatabase } from '@/database';

export function replaceLinks({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  // this is technically not a remark plugin but it
  // replaces internal links with <Link /> component
  // and external links with <a target="_blank" />
  return href?.startsWith('/') || href === '' ? (
    <Link href={href} className="cursor-pointer">
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} ↗
    </a>
  );
}

export function replaceTweets() {
  return (tree: any) =>
    new Promise<void>(async (resolve, reject) => {
      const nodesToChange = new Array();

      visit(tree, 'link', (node: any) => {
        if (
          node.url.match(
            /https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)([^\?])(\?.*)?/g
          )
        ) {
          nodesToChange.push({
            node,
          });
        }
      });
      for (const { node } of nodesToChange) {
        try {
          const regex = /\/status\/(\d+)/gm;
          const matches = regex.exec(node.url);

          if (!matches) throw new Error(`Failed to get tweet: ${node}`);

          const id = matches[1];

          node.type = 'mdxJsxFlowElement';
          node.name = 'Tweet';
          node.attributes = [
            {
              type: 'mdxJsxAttribute',
              name: 'id',
              value: id,
            },
          ];
        } catch (e) {
          console.log('ERROR', e);
          return reject(e);
        }
      }

      resolve();
    });
}

export function replaceExamples() {
  return (tree: any) =>
    new Promise<void>(async (resolve, reject) => {
      const nodesToChange = new Array();

      visit(tree, 'mdxJsxFlowElement', (node: any) => {
        if (node.name == 'Examples') {
          nodesToChange.push({
            node,
          });
        }
      });
      for (const { node } of nodesToChange) {
        try {
          const data = await getExamples(node);
          node.attributes = [
            {
              type: 'mdxJsxAttribute',
              name: 'data',
              value: data,
            },
          ];
        } catch (e) {
          return reject(e);
        }
      }

      resolve();
    });
}

async function getExamples(node: any) {
  const names = node?.attributes[0].value.split(',');

  const data = new Array<IExample | null>();

  try {
    await connectToDatabase();
    for (let i = 0; i < names.length; i++) {
      const results = await Example.findOne({ id: parseInt(names[i]) });
      data.push(results);
    }

    return JSON.stringify(data);
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Failed to get examples: ${error.message}`);
  }
}
