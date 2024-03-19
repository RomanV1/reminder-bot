import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from '../db/redisOptions';
import { ReminderCron } from './reminder.cron';

@Module({
    imports: [CacheModule.registerAsync(RedisOptions)],
    providers: [ReminderService, ReminderCron],
    exports: [ReminderService],
})
export class ReminderModule {}
