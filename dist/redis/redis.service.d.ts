export declare class RedisService {
    private redisClient;
    constructor();
    setValue(key: string, value: string, ttlSeconds?: number): Promise<void>;
    getValue(key: string): Promise<string | null>;
    deleteKey(key: string): Promise<void>;
}
//# sourceMappingURL=redis.service.d.ts.map