import { OdeonScraper } from './services/odeon-scraper';
import { MovieTransformerService } from './services/movie-transformer-service';
import { RedisClient } from './services/redis-client';
import { MovieNotifier } from './services/movie-notifier';
import { PushoverClient } from './services/notifiers/pushover-client';
import { PuppeteerClient } from './services/puppeteer-client';

const scrapers = [new OdeonScraper(new PuppeteerClient())];
const movieTransformerService = new MovieTransformerService(scrapers, new RedisClient(), new MovieNotifier(new PushoverClient()));

export default movieTransformerService;
