import { PushoverClient } from './notifiers/pushover-client';
import { Movie } from './movie-transformer-service';

export class MovieNotifier {
  private readonly pushoverClient;

  constructor(pushoverClient: PushoverClient) {
    this.pushoverClient = pushoverClient;
  }

  public async pushMovies(movies: Movie[]): Promise<void> {
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

    await Promise.all(messages.map(message => this.pushoverClient.push({ message, title: 'New movies uploaded to Odeon Glasgow Quay!' })));

    console.log('Notifications sent!');
  }
}
