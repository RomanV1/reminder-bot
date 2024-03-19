import { Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import { IContext } from '../interfaces/context.interface';
import { keyboard } from './keyboard/keyboard';
import { UsersService } from '../users/users.service';
import { Logger } from '@nestjs/common';

@Update()
export class TelegramUpdate {
    private readonly logger = new Logger(TelegramUpdate.name);

    constructor(private readonly userService: UsersService) {}

    @Start()
    async start(@Ctx() ctx: IContext): Promise<void> {
        try {
            await this.userService.createUser({
                userId: ctx.from.id,
                username: ctx.from.username,
                name: ctx.from.first_name,
            });
        } catch (err) {
            this.logger.error(err);
        }

        await ctx.reply('Hello! I am a reminder bot. You can create, change, and delete reminders with me.', {
            reply_markup: {
                keyboard: keyboard.MAIN,
                resize_keyboard: true,
            },
        });
    }

    @Hears('⏰ Create a reminder')
    async createReminder(@Ctx() ctx: IContext): Promise<void> {
        try {
            await this.userService.createUser({
                userId: ctx.from.id,
                username: ctx.from.username,
                name: ctx.from.first_name,
            });
        } catch (err) {
            this.logger.error(err);
        }

        await ctx.scene.enter('create-reminder');
    }

    @Hears('📝 Get reminders')
    async getReminder(@Ctx() ctx: IContext): Promise<void> {
        try {
            await this.userService.createUser({
                userId: ctx.from.id,
                username: ctx.from.username,
                name: ctx.from.first_name,
            });
        } catch (err) {
            this.logger.error(err);
        }

        await ctx.scene.enter('get-reminders');
    }

    @On('text')
    async onText(@Ctx() ctx: IContext): Promise<void> {
        try {
            await this.userService.createUser({
                userId: ctx.from.id,
                username: ctx.from.username,
                name: ctx.from.first_name,
            });
        } catch (err) {
            this.logger.error(err);
        }

        await ctx.reply("I don't understand you. Please, use the keyboard below");
    }
}
