import { MovieList } from '@/modules/movies/components/movie-list';
import { PageProps } from '@/modules/movies/types/languages';
import { getDictionary } from '@/modules/movies/utils/dictionaries';
import { Container } from '@/modules/movies/components/container';

const PopularMoviesPage = async ({ params: { lang } }: PageProps) => {
  const dictionary = await getDictionary(lang);

  return (
    <Container>
      <div>
        <h1 className="text-2xl font-bold">
          {dictionary.movie_pages.popular.title}
        </h1>

        <p className="text-muted-foreground">
          {dictionary.movie_pages.popular.description}
        </p>
      </div>

      <MovieList variant="popular" language={lang} />
    </Container>
  );
};

export default PopularMoviesPage;
