import { Movie } from './movie-transformer-service';
import { Notifier } from './notifiers/notifiers';

export class MovieNotifier {
  private readonly notifiers: Notifier[];

  constructor(notifiers: Notifier[]) {
    this.notifiers = notifiers;
  }

  public async pushMovies(movies: Movie[]): Promise<void> {
    await Promise.all(this.notifiers
      .map(notifier => notifier.notify(movies)));

    console.log('Notifications sent!');
  }
}
