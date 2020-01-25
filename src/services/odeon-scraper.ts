import { PuppeteerClient } from './clients/puppeteer-client';
import { Page } from 'puppeteer';

export class OdeonScraper {
  private readonly puppeteerClient: PuppeteerClient;

  constructor(puppeteerClient: PuppeteerClient) {
    this.puppeteerClient = puppeteerClient;
  }

  public async getMovies(): Promise<OdeonMovie[]> {
    return await this.puppeteerClient.runOnPage(async (page) => {
      await page.goto('https://www.odeon.co.uk/cinemas/glasgow_quay/120/');
      await page.click('[href=\\#ind-week]');
      const byWeek = await this.parseFilms(page, 'WEEK');
      await page.click('[href=\\#ind-future]');
      await page
        .waitForSelector('.futureview > .tab-content > .tab-pane > div');
      const advanceDates = await this.parseFilms(page, 'FUTURE');

      return [
        ...byWeek,
        ...advanceDates,
      ];
    });
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
