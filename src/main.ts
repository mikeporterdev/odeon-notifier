import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import { addHours, parse } from 'date-fns';
import { install } from 'source-map-support';
import { createClient } from 'redis';
import { pushMovies } from './pushover';
import { CronJob } from 'cron';

install();

export interface Movie {
  title: string;
  dates: Date[];
}

interface PuppeteerMovie {
  title: string;
  dates: string[];
}

const redisClient = createClient();

export class OdeonScraper {

  private browser: Browser;

  public async scrapeOdeon(): Promise<void> {

    const page = await this.checkBrowserRunning();
    await page.goto('https://www.odeon.co.uk/cinemas/glasgow_quay/120/');
    await page.click('[href=\\#ind-week]');
    const byWeek = await this.parseFilms(page, 'WEEK');
    await page.click('[href=\\#ind-future]');
    await page
      .waitForSelector('.futureview > .tab-content > .tab-pane > div');
    const advanceDates = await this.parseFilms(page, 'FUTURE');

    const fullList =
      [
        ...byWeek,
        ...advanceDates,
      ];

    const allFilms = fullList.reduce((acc, film) => {
      const existingFilm = acc.find(i => i.title === film.title);

      if (existingFilm) {
        existingFilm.dates = [...existingFilm.dates, ...film.dates];
      } else {
        acc.push(film);
      }
      return acc;

    }, [] as PuppeteerMovie[]);

    const parseDatesMovies: Movie[] = allFilms.map(i => {
      return {
        title: i.title,
        dates: i.dates.map(date => {
          // I don't actually care about the times, so to make sure the dates are correct, just add one hour in case of DST
          return addHours(parse(date.slice(-6), 'dd MMM', new Date()), 1);
        }),
      };
    });

    const filteredCategories = parseDatesMovies
      .filter(film => !film.title.includes('Autism Friendly'))
      .filter(film => !film.title.includes('Dubbed'));

    const moviesNotInCache = filteredCategories
      .filter(movie => !redisClient.get(`film:${movie.title}`) || process.env.DISABLE_FILM_CACHE);

    moviesNotInCache.forEach(movie => redisClient.set(`film:${movie.title}`, JSON.stringify(movie)));

    if (moviesNotInCache?.length) {
      console.log(`Found ${moviesNotInCache.length} new films, sending notifications!`);
      await pushMovies(moviesNotInCache);
    }
  }


  private async checkBrowserRunning(): Promise<Page> {
    if (!this.browser?.isConnected()) {
      await this.browser?.close();
      this.browser = await puppeteer.launch();
    }

    return await this.browser.newPage();
  }

  private async parseFilms(page: Page, type: string): Promise<PuppeteerMovie[]> {
    let className = type.toLowerCase();
    className = (className.includes('day')) ? 'day' : className;

    await page
      .waitForSelector(`.${className}view > .tab-content > .tab-pane > div > #ind-film-list-${type}`);
    return await page.evaluate((type) => {
      const filmList: PuppeteerMovie[] = [];
      const allFilmDetails = document.querySelectorAll(`.film-detail.${type}`);

      allFilmDetails.forEach(filmDetailDiv => {
        const title = filmDetailDiv.querySelector('.presentation-info > h4 > a').textContent;

        const dateDivs = filmDetailDiv.querySelectorAll('.times > .presentation-info');

        const dates: string[] = [];
        dateDivs.forEach(dateDiv => {
          // dates.push(dateDiv.textContent);
          dates.push(dateDiv.textContent);
        });

        const film = {
          title,
          dates,
        };

        filmList.push(film);
      });
      return Promise.resolve(filmList);
    }, type);
  }
}

const odeonScraper = new OdeonScraper();

new CronJob('0 * * * * *', async () => {
  console.log('Running job');
  await odeonScraper.scrapeOdeon().catch(e => console.error(e));
}, null, true, 'Europe/London');


// Keep process alive
new Promise(() => null);
