import { OdeonSearcher } from './services/odeon-searcher';
import { MovieTransformerService } from './services/movie-transformer-service';
import { RedisClient } from './services/clients/redis-client';
import { MovieNotifier } from './services/movie-notifier';
import { PuppeteerClient } from './services/clients/puppeteer-client';
import { OdeonScraper } from './services/odeon-scraper';
import { PushoverNotifier } from './services/notifiers/pushover-notifier';
import { PushoverClient } from './services/clients/pushover-client';

const notifiers = [
  new PushoverNotifier(new PushoverClient()),
];

const enabledNotifiers = notifiers
  .filter(notifier => notifier.isEnabled());

const scrapers = [new OdeonSearcher(new OdeonScraper(new PuppeteerClient()))];
const movieTransformerService = new MovieTransformerService(scrapers, new RedisClient(), new MovieNotifier(enabledNotifiers));

export default movieTransformerService;
