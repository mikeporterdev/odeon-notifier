import Bottleneck from 'bottleneck';
import axios from 'axios';
import { Notifier } from './notifiers';
import { Movie } from '../movie-transformer-service';
import { checkEnvironmentVariable } from '../../util/check-environment-variable';

const pushoverLimiter = new Bottleneck({
  maxConcurrentStreams: 1,
});

export class PushoverClient implements Notifier {
  private async push(msg: PushoverMessage): Promise<void> {
    const data = {
      token: process.env.PUSHOVER_TOKEN,
      user: process.env.PUSHOVER_USER,
      ...msg,
    };

    pushoverLimiter.schedule(() => axios.post('https://api.pushover.net/1/messages.json', data))
      .catch(e => console.error(e));
  }

  public async notify(movies: Movie[]): Promise<void> {
    let dateMessage;

    const messages = movies.reduce((acc, movie) => {
      if (movie.dates.length === 1) {
        dateMessage = `Showing on ${movie.dates[0].toDateString()}!`;
      } else {
        const dates = movie.dates.sort((d1, d2) => d1 < d2 ? -1 : d1 > d2 ? 1 : 0);
        dateMessage = `Showing between ${dates[0].toDateString()} and ${dates[dates.length - 1].toDateString()}!`;
      }

      const message = `${movie.title} - ${dateMessage}\n`;
      if ((acc[acc.length - 1] + message).length > 1000) {
        acc.push(message);
        return acc;
      } else {
        acc[acc.length - 1] = acc[acc.length - 1] + message;
      }

      return acc;
    }, [''] as string[]);

    await Promise.all(messages.map(message => this.push({
      message,
      title: 'New movies uploaded to Odeon Glasgow Quay!',
    })));
  }

  isEnabled(): boolean {
    const envVarsPresent = checkEnvironmentVariable('PUSHOVER_USER') && checkEnvironmentVariable('PUSHOVER_TOKEN');

    if (envVarsPresent) {
      console.log('Pushover Enabled');
    } else {
      console.log('Pushover not enabled');
    }

    return envVarsPresent;
  }
}

export interface PushoverMessage {
  title: string;
  message: string;
}
