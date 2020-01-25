import { createClient } from 'redis';

export class RedisClient {
  private readonly redisClient;

  constructor() {
    this.redisClient = createClient({
      host: process.env.REDIS_URL ?? 'localhost',
    });
  }

  public async exists(key: string): Promise<boolean> {
    return !!await this.redisClient.exists(key);
  }

  public async set<T>(key: string, value: T): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value));
  }
}
