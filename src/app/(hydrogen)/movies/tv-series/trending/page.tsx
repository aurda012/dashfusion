import { TvSeriesList } from '@/modules/movies/components/tv-series-list';
import { PageProps } from '@/modules/movies/types/languages';
import { Container } from '@/modules/movies/components/container';

const DiscoverTvSeriesPage = async ({ params: { lang } }: PageProps) => {
  return (
    <Container>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trending</h1>
          <p className="text-muted-foreground">
            These are the shows everyone is talking about right now.
          </p>
        </div>
      </div>

      <TvSeriesList variant="trending" />
    </Container>
  );
};

export default DiscoverTvSeriesPage;
