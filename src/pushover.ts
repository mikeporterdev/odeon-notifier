import axios from 'axios';
import { Movie } from './main';
import Bottleneck from 'bottleneck';

const pushoverLimiter = new Bottleneck({
  maxConcurrentStreams: 1,
});

export async function pushMovies(movies: Movie[]): Promise<void> {
  let dateMessage;

  const messages = movies.reduce((acc, movie) => {
    if (movie.dates.length === 1) {
      dateMessage = `Showing on ${movie.dates[0].toDateString()}!`;
    } else {
      const dates = movie.dates.sort((d1, d2) => d1 < d2 ? -1 : d1 > d2 ? 1 : 0);
      dateMessage = `Showing between ${dates[0].toDateString()} and ${dates[dates.length - 1].toDateString()}!`;
    }

    const message = `${movie.title} - ${dateMessage}\n`;
    if ((acc[acc.length - 1] + message).length > 1000) {
      acc.push(message);
      return acc;
    } else {
      acc[acc.length - 1] = acc[acc.length - 1] + message;
    }

    return acc;
  }, [''] as string[]);

  await Promise.all(messages.map(message => push({ message, title: 'New movies uploaded to Odeon Glasgow Quay!' })));

  console.log('Notifications sent!');
}

async function push(msg: PushoverMessage): Promise<void> {
  const data = {
    token: process.env.PUSHOVER_TOKEN,
    user: process.env.PUSHOVER_USER,
    ...msg,
  };

  pushoverLimiter.schedule(() => axios.post('https://api.pushover.net/1/messages.json', data))
    .catch(e => console.error(e))
}

interface PushoverMessage {
  title: string;
  message: string;
  url?: string;
}

