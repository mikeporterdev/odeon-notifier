import { MovieTransformerService } from '../movie-transformer-service';
import { OdeonSearcher } from '../odeon-searcher';
import { anything, capture, instance, mock, resetCalls, verify, when } from 'ts-mockito';
import { RedisClient } from '../clients/redis-client';
import { MovieNotifier } from '../movie-notifier';

describe('Movie Transformer Service', () => {
  let movieTransformerService: MovieTransformerService;
  const mockedScraper = mock(OdeonSearcher);
  const mockedRedis = mock(RedisClient);
  const mockedMovieNotifier = mock(MovieNotifier);

  beforeEach(() => {
    resetCalls(mockedScraper);
    when(mockedScraper.source).thenReturn('Odeon');
    resetCalls(mockedRedis);
    resetCalls(mockedMovieNotifier);
    movieTransformerService = new MovieTransformerService([instance(mockedScraper)], instance(mockedRedis), instance(mockedMovieNotifier));
  });

  it('should scrape all given scrapers', async () => {
    const film = { title: 'TestFilm', dates: [new Date()] };
    when(mockedScraper.getMovies()).thenResolve([film]);
    when(mockedRedis.exists('film:Odeon:TestFilm')).thenResolve(false);
    when(mockedMovieNotifier.pushMovies(anything())).thenResolve();
    await movieTransformerService.searchForMovies();

    verify(mockedScraper.getMovies()).once();
    verify(mockedRedis.set('film:Odeon:TestFilm', JSON.stringify(film))).once();
    const [firstArg] = capture(mockedMovieNotifier.pushMovies).last();
    expect(firstArg.length).toBe(1);
    expect(firstArg[0].title).toBe('TestFilm');
  });

  it('should not send notification if already in cache', async () => {
    const film = { title: 'TestFilm', dates: [new Date()] };
    when(mockedScraper.getMovies()).thenResolve([film]);
    when(mockedRedis.exists('film:Odeon:TestFilm')).thenResolve(true);
    await movieTransformerService.searchForMovies();

    verify(mockedMovieNotifier.pushMovies(anything())).never();
  });
});
