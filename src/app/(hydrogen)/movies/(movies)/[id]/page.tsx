import { getMoviesPagesIds } from '@/modules/movies/utils/seo/get-movies-pages-ids';

import { MovieDetails } from '@/modules/movies/components/movie-details/movie-details';
import { PageProps } from '@/modules/movies/types/languages';

type MoviePageProps = {
  params: { id: string };
} & PageProps;

export async function generateStaticParams({
  params: { lang },
}: MoviePageProps) {
  const moviesIds = await getMoviesPagesIds(lang);

  return moviesIds.map((id) => ({ id }));
}

const MoviePage = ({ params }: MoviePageProps) => {
  const { id, lang } = params;

  return <MovieDetails id={Number(id)} language={lang} />;
};

export default MoviePage;
