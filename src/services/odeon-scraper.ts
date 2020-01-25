import { Page } from 'puppeteer';
import { addHours, parse } from 'date-fns';
import { Movie, Scraper } from './movie-transformer-service';
import { PuppeteerClient } from './puppeteer-client';

/**
 * TODO: Expand to include showing times
 * TODO: Expand to take location dynamically
 */
export class OdeonScraper implements Scraper {
  readonly source = 'Odeon';
  private readonly puppeteerClient: PuppeteerClient;

  constructor(puppeteerClient: PuppeteerClient) {
    this.puppeteerClient = puppeteerClient;
  }

  public async scrape(): Promise<Movie[]> {

    const allFilms = await this.puppeteerClient.runOnPage(async (page) => {
      await page.goto('https://www.odeon.co.uk/cinemas/glasgow_quay/120/');
      await page.click('[href=\\#ind-week]');
      const byWeek = await this.parseFilms(page, 'WEEK');
      await page.click('[href=\\#ind-future]');
      await page
        .waitForSelector('.futureview > .tab-content > .tab-pane > div');
      const advanceDates = await this.parseFilms(page, 'FUTURE');

      return this.mergeShowingsTogether([
        ...byWeek,
        ...advanceDates,
      ]);
    });

    return this.convertOdeonMoviesToMovies(allFilms);
  }

  private convertOdeonMoviesToMovies(allFilms: OdeonMovie[]): Movie[] {
    return allFilms.map(i => {
      return {
        title: i.title,
        dates: i.dates.map(date => {
          /**
           * FIXME: This is a bit ugly but I don't actually care about the times yet, so to make sure the dates are
           * correct, just add one hour in case of DST
           */
          return addHours(parse(date.slice(-6), 'dd MMM', new Date()), 1);
        }),
      };
    });
  }

  private mergeShowingsTogether(fullList: OdeonMovie[]): OdeonMovie[] {
    return fullList.reduce((acc, film) => {
      const existingFilm = acc.find(i => i.title === film.title);

      if (existingFilm) {
        existingFilm.dates = [...existingFilm.dates, ...film.dates];
      } else {
        acc.push(film);
      }
      return acc;

    }, [] as OdeonMovie[]);
  }

  private async parseFilms(page: Page, type: string): Promise<OdeonMovie[]> {
    const className = type.toLowerCase();

    await page
      .waitForSelector(`.${className}view > .tab-content > .tab-pane > div > #ind-film-list-${type}`);

    return await page.evaluate((type) => {
      const filmList: OdeonMovie[] = [];
      const allFilmDetails = document.querySelectorAll(`.film-detail.${type}`);

      allFilmDetails.forEach(filmDetailDiv => {
        const title = filmDetailDiv.querySelector('.presentation-info > h4 > a').textContent;

        const dateDivs = filmDetailDiv.querySelectorAll('.times > .presentation-info');

        const dates: string[] = [];
        dateDivs.forEach(dateDiv => {
          // dates.push(dateDiv.textContent);
          dates.push(dateDiv.textContent);
        });

        filmList.push({
          title,
          dates,
        });
      });
      return Promise.resolve(filmList);
    }, type);
  }
}

export interface OdeonMovie {
  title: string;
  dates: string[];
}
