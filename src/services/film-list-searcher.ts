import { Movie, MovieSearcher } from './movie-transformer-service';
import { FilmListClient } from './clients/film-list-client';
import { parse } from 'date-fns';

export class FilmListSearcher implements MovieSearcher {
  constructor(private readonly filmListClient: FilmListClient) {}

  readonly source = 'FilmList';

  async getMovies(): Promise<Movie[]> {
    const thisWeeksShowings = await this.filmListClient.getThisWeeksShowings();

    const formattedMovies = thisWeeksShowings.map(showing => {
      const formattedDates = showing.dates.map(date => {
        const trimmedDate = date.substring(4);
        const parsedDate = parse(trimmedDate, 'dd MMM', new Date());
        return parsedDate;
      })

      return {
        title: showing.title,
        dates: formattedDates,
      }
    })

    return formattedMovies;
  }

}
