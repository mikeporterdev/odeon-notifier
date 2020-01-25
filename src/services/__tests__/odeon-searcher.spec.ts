import { OdeonSearcher } from '../odeon-searcher';
import { instance, mock, when } from 'ts-mockito';
import { OdeonScraper } from '../odeon-scraper';

describe('Odeon Searcher', () => {
  let odeonSearcher: OdeonSearcher;
  const mockedOdeonScraper = mock(OdeonScraper);

  beforeEach(() => {
    odeonSearcher = new OdeonSearcher(instance(mockedOdeonScraper));
  });

  it('should parse odeon movies into our format', async () => {
    when(mockedOdeonScraper.getMovies()).thenResolve([{
      title: 'Test Film',
      dates: ['Thursday06 Feb', 'Friday07 Feb'],
    }]);

    const movies = await odeonSearcher.getMovies();
    expect(movies.length).toBe(1);
    expect(movies[0].title).toBe('Test Film');
    expect(movies[0].dates[0].toDateString()).toBe('Thu Feb 06 2020');
    expect(movies[0].dates[1].toDateString()).toBe('Fri Feb 07 2020');
  });

  it('should handle DST', async () => {
    when(mockedOdeonScraper.getMovies()).thenResolve([{
      title: 'Test Film',
      dates: ['Thursday07 May', 'Friday08 May'],
    }]);

    const movies = await odeonSearcher.getMovies();
    expect(movies.length).toBe(1);
    expect(movies[0].title).toBe('Test Film');
    expect(movies[0].dates[0].toDateString()).toBe('Thu May 07 2020');
    expect(movies[0].dates[1].toDateString()).toBe('Fri May 08 2020');
  });
});
