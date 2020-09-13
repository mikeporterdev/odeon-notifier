import { OdeonSearcher } from '../odeon-searcher';
import { instance, mock, when } from 'ts-mockito';
import { OdeonApiClient } from '../clients/odeon-api-client';

describe('Odeon Searcher', () => {
  let odeonSearcher: OdeonSearcher;
  const mockedOdeonScraper = mock(OdeonApiClient);

  beforeEach(() => {
    odeonSearcher = new OdeonSearcher(instance(mockedOdeonScraper));
  });

  it('should parse odeon movies into our format', async () => {
    when(mockedOdeonScraper.getOdeonMovies()).thenResolve([{
      title: 'Test Film',
      dates: ['2020-02-06', '2020-02-07'],
    }]);

    const movies = await odeonSearcher.getMovies();
    expect(movies.length).toBe(1);
    expect(movies[0].title).toBe('Test Film');
    expect(movies[0].dates[0].toDateString()).toBe('Thu Feb 06 2020');
    expect(movies[0].dates[1].toDateString()).toBe('Fri Feb 07 2020');
  });
});
