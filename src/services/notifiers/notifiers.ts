import { Movie } from '../movie-transformer-service';

export interface Notifier {
  isEnabled(): boolean;
  notify(movies: Movie[]): Promise<void>;
}

