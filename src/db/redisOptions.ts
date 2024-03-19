import { CacheModuleAsyncOptions, CacheStore } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
            socket: {
                host: configService.get('REDIS_HOST'),
                port: +configService.get('REDIS_PORT'),
            },
        });
        return {
            store: store as unknown as CacheStore,
            ttl: 0,
        };
    },
};
