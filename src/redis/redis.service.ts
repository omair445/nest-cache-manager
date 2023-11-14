// src/redis/redis.service.ts

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private redisClient: Redis;
    constructor() {
        this.redisClient = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT) | 6379 ,
        });
    }

    async setValue(
        key: string,
        value: string,
        ttlSeconds = 60 * 60 * 60 * 60 * 60,
    ): Promise<void> {
        await this.redisClient.set(key, value);
        await this.redisClient.expire(key, ttlSeconds);
    }

    async getValue(key: string): Promise<string | null> {
        return this.redisClient.get(key);
    }

    async deleteKey(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}
