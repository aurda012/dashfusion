import { PageProps } from '@/modules/movies/types/languages';
import { TvSerieDetails } from '@/modules/movies/components/tv-series-details/tv-serie-details';
import { getTvSeriesPagesIds } from '@/modules/movies/utils/seo/get-tv-series-pages-ids';

export type TvSeriePageProps = PageProps & {
  params: { id: string };
};

export async function generateStaticParams({
  params: { lang },
}: TvSeriePageProps) {
  const tvSeriesIds = await getTvSeriesPagesIds(lang);

  return tvSeriesIds.map((id) => ({ id }));
}

const TvSeriePage = ({ params }: TvSeriePageProps) => {
  return <TvSerieDetails id={Number(params.id)} language={params.lang} />;
};

export default TvSeriePage;
