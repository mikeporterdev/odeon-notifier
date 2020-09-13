import { CronJob } from 'cron';
import movieTransformerService from './di-container';


import { install } from 'source-map-support';
install();

const work = async (): Promise<void> => {
  console.log('Running job');
  await movieTransformerService.searchForMovies().catch(e => console.error(e));
};

new CronJob(process.env.CRON_SCHEDULE ?? '0 0 * * * *', work, null, true, 'Europe/London');

console.log('Started!');
// Trigger job on startup
work();

// Keep process alive
new Promise(() => null);
