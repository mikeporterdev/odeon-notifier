import { Movie } from '../movie-transformer-service';
import { PushoverClient } from './pushover-client';

export interface Notifier {
  isEnabled(): boolean;
  notify(movies: Movie[]): Promise<void>;
}

const notifiers = [
  new PushoverClient(),
];

export const enabledNotifiers = notifiers
  .filter(notifier => notifier.isEnabled());
