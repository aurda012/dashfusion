import Form from '@/modules/blog-generator/components/form';
import {
  getSite,
  updateSite,
} from '@/modules/blog-generator/actions/site.actions';
import DeleteSiteForm from '@/modules/blog-generator/components/form/delete-site-form';

export default async function SiteSettingsIndex({
  params,
}: {
  params: { id: string };
}) {
  const data = await getSite(params.id);
  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Name"
        description="The name of your site. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: 'name',
          type: 'text',
          defaultValue: data?.name!,
          placeholder: 'My Awesome Site',
          maxLength: 32,
        }}
        handleSubmit={updateSite}
      />

      <Form
        title="Description"
        description="The description of your site. This will be used as the meta description on Google as well."
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          name: 'description',
          type: 'text',
          defaultValue: data?.description!,
          placeholder: 'A blog about really interesting things.',
        }}
        handleSubmit={updateSite}
      />

      <DeleteSiteForm siteName={data?.name!} />
    </div>
  );
}
