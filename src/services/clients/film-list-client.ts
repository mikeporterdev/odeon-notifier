import axios from 'axios';
import { JSDOM } from 'jsdom';

export class FilmListClient {
  private readonly cinemaCode = '13662-odeon-dundee';
  private readonly url = 'https://film.list.co.uk/cinema/';

  public async getThisWeeksShowings() {
    const page = await axios.get(`${this.url}${this.cinemaCode}`);
    const html = page.data;

    const jsdom = new JSDOM(html);
    const  { document } = jsdom.window;
    const events = [...document.querySelectorAll('.byEvent')];
    return events.map((event)=> this.parseEvent(event));
  }

  private parseEvent(event: Element): FilmListResponse {
    const title = event.querySelector('h4 > a').textContent;
    const dates = [...event.querySelectorAll('h5')].map(h5 => h5.textContent);
    return { title, dates: dates  }
  }
}

export interface FilmListResponse {
  title: string;
  dates: string[]
}
