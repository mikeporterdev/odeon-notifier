import { MovieNotifier } from '../movie-notifier';
import { Notifier } from '../notifiers/notifiers';
import { instance, mock, verify } from 'ts-mockito';

describe('Movie Notifier', () => {
  let movieNotifier: MovieNotifier;
  const mockNotifier = mock<Notifier>();
  const mockNotifier2 = mock<Notifier>();

  beforeEach(() => {
    movieNotifier = new MovieNotifier([instance(mockNotifier), instance(mockNotifier2)]);
  });

  it('should call all notifiers', async () => {
    let movies = [{ title: 'Test Film', dates: [new Date()] }];
    await movieNotifier.pushMovies(movies);
    verify(mockNotifier.notify(movies)).once();
    verify(mockNotifier2.notify(movies)).once();
  });
});
