import { RedisClient } from './clients/redis-client';
import { MovieNotifier } from './movie-notifier';
import { filterAsync } from '../util/arrays';

export class MovieTransformerService {
  private readonly scrapers: MovieSearcher[];
  private readonly redisClient: RedisClient;
  private readonly movieNotifier: MovieNotifier;

  constructor(scrapers: MovieSearcher[], redisClient: RedisClient, movieNotifier: MovieNotifier) {
    this.scrapers = scrapers;
    this.redisClient = redisClient;
    this.movieNotifier = movieNotifier;
  }

  private async scrapeAll(): Promise<ScraperResult[]> {
    return await Promise.all(this.scrapers.map(async scraper => {
      return {
        source: scraper.source,
        movies: await scraper.getMovies(),
      };
    }));
  }

  public async searchForMovies(): Promise<void> {
    const scraperResults = await this.scrapeAll();

    await Promise.all(scraperResults.map(async scraperResult => {
      const filteredCategories = scraperResult.movies
        .filter(film => !film.title.includes('Autism Friendly'))
        .filter(film => !film.title.includes('Dubbed'));


      const moviesNotInCache = await filterAsync(filteredCategories, async movie => {
        return (!!process.env.DISABLE_FILM_CACHE || !await this.redisClient.exists(`film:${scraperResult.source}:${movie.title}`));
      });

      if (moviesNotInCache?.length) {
        console.log(`Found ${moviesNotInCache.length} new films, sending notifications!`);
        await this.movieNotifier.pushMovies(moviesNotInCache)
          .then(() => {
            moviesNotInCache.forEach(movie => {
              this.redisClient.set(`film:${scraperResult.source}:${movie.title}`, JSON.stringify(movie));
            });
          });
      }
    }));
  }
}

export interface MovieSearcher {
  getMovies: () => Promise<Movie[]>
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
