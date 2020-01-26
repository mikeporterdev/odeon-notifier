import { OdeonMovie, OdeonScraper } from '../odeon-scraper';
import { PuppeteerClient } from '../clients/puppeteer-client';
import { anything, capture, instance, mock, when } from 'ts-mockito';
import { Page } from 'puppeteer';

/**
 * Pretty sure there's no way to test the internals of page.evaluate
 */
describe('Odeon Scraper', () => {
  let odeonScraper: OdeonScraper;
  const mockedPuppeteerClient = mock(PuppeteerClient);
  const pageMock = mock<Page>();


  beforeEach(() => {
    odeonScraper = new OdeonScraper(instance(mockedPuppeteerClient));
  });

  it('should parse filmsf', async () => {
    when(pageMock.evaluate(anything(), 'WEEK')).thenResolve([{
      title: 'Test Film',
      dates: ['SaturdayMar 06'],
    }] as OdeonMovie[]);
    when(pageMock.evaluate(anything(), 'FUTURE')).thenResolve([{
      title: 'Test Film 2',
      dates: ['SaturdayAug 31'],
    }] as OdeonMovie[]);


    await odeonScraper.getMovies();
    const [arg] = capture(mockedPuppeteerClient.runOnPage).last();

    // @ts-ignore
    let parsedFilms = await arg(instance(pageMock));
    expect(parsedFilms.length).toBe(2);
    expect(parsedFilms[0].title).toBe('Test Film');
    expect(parsedFilms[1].title).toBe('Test Film 2');
  });
});
