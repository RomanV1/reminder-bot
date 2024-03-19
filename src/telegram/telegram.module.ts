import { Module } from '@nestjs/common';
import { TelegramUpdate } from './telegram.update';
import { ConfigService } from '@nestjs/config';
import {
    ChangeReminderDateScene,
    ChangeReminderMessageScene,
    CreateReminderScene,
    DeleteReminderScene,
    GetRemindersScene,
} from './scenes';
import { ReminderService } from '../reminder/reminder.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from '../db/redisOptions';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User]), CacheModule.registerAsync(RedisOptions)],
    providers: [
        TelegramUpdate,
        UsersService,
        ConfigService,
        CreateReminderScene,
        GetRemindersScene,
        DeleteReminderScene,
        ChangeReminderDateScene,
        ChangeReminderMessageScene,
        ReminderService,
    ],
})
export class TelegramModule {}
