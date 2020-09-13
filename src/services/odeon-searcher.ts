import { parse } from 'date-fns';
import { Movie, MovieSearcher } from './movie-transformer-service';
import { OdeonApiClient } from './clients/odeon-api-client';
import { OdeonMovie } from '../models/odeon-internal';

/**
 * TODO: Expand to take location dynamically
 */
export class OdeonSearcher implements MovieSearcher {
  readonly source = 'Odeon';

  constructor(private readonly odeonApiClient: OdeonApiClient) {
  }

  public async getMovies(): Promise<Movie[]> {
    const allShowings = await this.odeonApiClient.getOdeonMovies();
    const allMovies = this.mergeShowingsTogether(allShowings);
    return this.convertOdeonMoviesToMovies(allMovies);
  }

  private convertOdeonMoviesToMovies(allFilms: OdeonMovie[]): Movie[] {
    return allFilms.map(i => {
      return {
        title: i.title,
        dates: i.dates.map(date => {
          return parse(date, 'yyyy-MM-dd', new Date())
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
