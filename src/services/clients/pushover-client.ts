import Bottleneck from "bottleneck";
import axios from 'axios';
import { PushoverMessage } from '../notifiers/pushover-notifier';

const pushoverLimiter = new Bottleneck({
  maxConcurrent: 1,
});

export class PushoverClient {
  public async push(msg: PushoverMessage): Promise<void> {
    const data = {
      token: process.env.PUSHOVER_TOKEN,
      user: process.env.PUSHOVER_USER,
      ...msg,
    };

    pushoverLimiter.schedule(() => axios.post('https://api.pushover.net/1/messages.json', data))
      .catch(e => console.error(e));
  }
}
