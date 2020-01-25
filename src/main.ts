import { CronJob } from 'cron';
import { MovieNotifier } from './services/movie-notifier';
import { PushoverClient } from './services/notifiers/pushover-client';
import { OdeonScraper } from './services/odeon-scraper';
import { RedisClient } from './services/redis-client';
import { install } from 'source-map-support';
import { MovieTransformerService } from './services/movie-transformer-service';
install();

const scrapers = [new OdeonScraper()];

const movieTransformerService = new MovieTransformerService(scrapers, new RedisClient(), new MovieNotifier(new PushoverClient()));

new CronJob(process.env.CRON_SCHEDULE ?? '0 0 * * * *', async () => {
  console.log('Running job');
  await movieTransformerService.searchForMovies().catch(e => console.error(e));
}, null, true, 'Europe/London');

(async (): Promise<void> => {
  await movieTransformerService.searchForMovies().catch(e => console.error(e));
})();

console.log('Started!');

// Keep process alive
new Promise(() => null);
