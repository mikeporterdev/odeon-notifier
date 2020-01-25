import { OdeonScraper } from './services/odeon-scraper';
import { MovieTransformerService } from './services/movie-transformer-service';
import { RedisClient } from './services/redis-client';
import { MovieNotifier } from './services/movie-notifier';
import { PuppeteerClient } from './services/puppeteer-client';
import { enabledNotifiers } from './services/notifiers/notifiers';

const scrapers = [new OdeonScraper(new PuppeteerClient())];
const movieTransformerService = new MovieTransformerService(scrapers, new RedisClient(), new MovieNotifier(enabledNotifiers));

export default movieTransformerService;
