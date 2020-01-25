import { addHours, parse } from 'date-fns';
import { Movie, MovieSearcher } from './movie-transformer-service';
import { OdeonMovie, OdeonScraper } from './odeon-scraper';

/**
 * TODO: Expand to include showing times
 * TODO: Expand to take location dynamically
 */
export class OdeonSearcher implements MovieSearcher {
  readonly source = 'Odeon';
  private odeonScraper: OdeonScraper;

  constructor(odeonScraper: OdeonScraper) {
    this.odeonScraper = odeonScraper;
  }

  public async getMovies(): Promise<Movie[]> {
    const allShowings = await this.odeonScraper.getMovies();
    const allMovies = this.mergeShowingsTogether(allShowings);
    return this.convertOdeonMoviesToMovies(allMovies);
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
}
