import { RedisClient } from './redis-client';
import { MovieNotifier } from './movie-notifier';

export class MovieTransformerService {
  private readonly scrapers: Scraper[];
  private readonly redisClient: RedisClient;
  private readonly movieNotifier: MovieNotifier;

  constructor(scrapers: Scraper[], redisClient: RedisClient, movieNotifier: MovieNotifier) {
    this.scrapers = scrapers;
    this.redisClient = redisClient;
    this.movieNotifier = movieNotifier;
  }

  private async scrapeAll(): Promise<ScraperResult[]> {
    return await Promise.all(this.scrapers.map(async scraper => {
      return {
        source: scraper.source,
        movies: await scraper.scrape(),
      };
    }));
  }

  public async searchForMovies(): Promise<void> {
    const scraperResults = await this.scrapeAll();

    await Promise.all(scraperResults.map(async scraperResult => {
      const filteredCategories = scraperResult.movies
        .filter(film => !film.title.includes('Autism Friendly'))
        .filter(film => !film.title.includes('Dubbed'));

      const moviesNotInCache = filteredCategories
        .filter(movie => !this.redisClient.exists(`film:${scraperResult.source}:${movie.title}`) || process.env.DISABLE_FILM_CACHE);

      moviesNotInCache.forEach(movie => this.redisClient.set(`film:${scraperResult.source}:${movie.title}`, JSON.stringify(movie)));

      if (moviesNotInCache?.length) {
        console.log(`Found ${moviesNotInCache.length} new films, sending notifications!`);
        await this.movieNotifier.pushMovies(moviesNotInCache);
      }
    }));
  }
}

export interface Scraper {
  scrape: () => Promise<Movie[]>
  source: string;
}

interface ScraperResult {
  source: string;
  movies: Movie[];
}


export interface Movie {
  title: string;
  dates: Date[];
}
