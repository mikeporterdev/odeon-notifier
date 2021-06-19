import { MovieTransformerService } from './services/movie-transformer-service';
import { RedisClient } from './services/clients/redis-client';
import { MovieNotifier } from './services/movie-notifier';
import { PushoverNotifier } from './services/notifiers/pushover-notifier';
import { PushoverClient } from './services/clients/pushover-client';
import { FilmListSearcher } from './services/film-list-searcher';
import { FilmListClient } from './services/clients/film-list-client';

const notifiers = [
  new PushoverNotifier(new PushoverClient()),
];

const enabledNotifiers = notifiers
  .filter(notifier => notifier.isEnabled());

const scrapers = [new FilmListSearcher(new FilmListClient())];
const movieTransformerService = new MovieTransformerService(scrapers, new RedisClient(), new MovieNotifier(enabledNotifiers));

export default movieTransformerService;
