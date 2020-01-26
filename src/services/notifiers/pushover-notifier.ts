import { Notifier } from './notifiers';
import { Movie } from '../movie-transformer-service';
import { checkEnvironmentVariable } from '../../util/check-environment-variable';
import { PushoverClient } from '../clients/pushover-client';

export class PushoverNotifier implements Notifier {
  private readonly pushoverClient: PushoverClient;

  constructor(pushoverClient: PushoverClient) {
    this.pushoverClient = pushoverClient;
  }

  public async notify(movies: Movie[]): Promise<void> {
    const messages = movies.reduce((acc, movie) => {
      const dateMessage = this.buildDateMessage(movie);

      const message = `${movie.title} - ${dateMessage}`;
      const currentString = acc[acc.length - 1];
      if ((currentString + message).length > 1000) {
        acc.push(message);
        return acc;
      } else {
        if (acc[acc.length - 1].length === 0) {
          acc[acc.length - 1] = currentString + message;
        } else {
          acc[acc.length - 1] = currentString + '\n' + message;
        }
      }
      return acc;
    }, [''] as string[]);

    await Promise.all(messages.map(message => this.pushoverClient.push({
      message,
      title: 'New movies uploaded to Odeon Glasgow Quay!',
    })));
  }

  private buildDateMessage(movie: Movie): string {
    let dateMessage;
    if (movie.dates.length === 1) {
      dateMessage = `Showing on ${movie.dates[0].toDateString()}!`;
    } else {
      const dates = movie.dates.sort((d1, d2) => d1 < d2 ? -1 : d1 > d2 ? 1 : 0);
      dateMessage = `Showing between ${dates[0].toDateString()} and ${dates[dates.length - 1].toDateString()}!`;
    }
    return dateMessage;
  }

  public isEnabled(): boolean {
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
