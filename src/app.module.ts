import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramModule } from './telegram/telegram.module';
import { ReminderModule } from './reminder/reminder.module';
import { session } from 'telegraf';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot(),
        ScheduleModule.forRoot(),
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                token: configService.get<string>('BOT_TOKEN'),
                middlewares: [session()],
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                entities: ['dist/**/*.entity.js'],
                migrations: ['dist/db/migration/*.js'],
            }),
        }),
        TelegramModule,
        ReminderModule,
    ],
})
export class AppModule {}
