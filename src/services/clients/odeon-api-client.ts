import axios from 'axios';
import { add, eachDayOfInterval, format } from 'date-fns';
import { uniqBy } from 'lodash';
import { OdeonMovie } from '../../models/odeon-internal';
import { ShowingsResponse } from '../../models/odeon-api';

export class OdeonApiClient {
  private readonly siteId = '044'; //Hardcoded Dundee site
  private readonly getMoviesUri = 'https://vwc.odeon.co.uk/WSVistaWebClient/ocapi/v1/browsing/master-data/showtimes/business-date';
  private readonly daysToLook = 30;


  public async getShowings(date: string, authToken: string): Promise<ShowingsResponse> {
    return (await axios.get(`${this.getMoviesUri}/${date}?siteIds=${this.siteId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })).data;
  }

  private async getAuthToken(): Promise<string> {
    const message = await axios.get(`https://beta.odeon.co.uk/cinemas/glasgow-quay/`);
    const re = new RegExp(/authToken":"([^"]+)"/)
    const regExpExecArray = re.exec(message.data);
    return regExpExecArray[1];
  }

  public async getAllShowings(): Promise<ShowingsResponse[]> {
    const dateRange = eachDayOfInterval({ start: new Date(), end: add(new Date(), { days: this.daysToLook }) });

    const authToken = await this.getAuthToken()

    return await Promise.all(dateRange.map(date => this.getShowings(format(date, 'yyyy-MM-dd'), authToken)));
  }

  public async getOdeonMovies(): Promise<OdeonMovie[]> {
    const allDays = await this.getAllShowings();

    const movies = allDays.flatMap(value => value.relatedData.films).map(film => {
      return {
        title: film.title.text, id: film.id,
      };
    });

    const uniqueMovies = uniqBy(movies, (movie) => movie.id);

    const allShowtimes = allDays.flatMap(dayShowings => dayShowings.showtimes);

    return uniqueMovies.map(movie => {
      const showingsForThisMovie = allShowtimes.filter(i => i.filmId === movie.id);

      return {
        title: movie.title,
        dates: [...new Set(showingsForThisMovie.map(showing => showing.schedule.businessDate))],
      }
    })
  }
}
