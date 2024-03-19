import { Action, Ctx, Hears, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { IContext } from '../../interfaces/context.interface';
import { keyboard } from '../keyboard/keyboard';
import { ReminderService } from '../../reminder/reminder.service';
import { ReminderExceptions } from '../../utils/reminderExceptions';
import { Logger } from '@nestjs/common';

@Scene('create-reminder')
export class CreateReminderScene {
    private readonly logger = new Logger(CreateReminderScene.name);

    constructor(private readonly reminderService: ReminderService) {}

    @SceneEnter()
    async enter(@Ctx() ctx: IContext) {
        await ctx.reply('Please enter the text of the reminder', keyboard.LEAVE);
    }

    @Hears(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
    async onDate(@Message('text') date: string, @Ctx() ctx: IContext) {
        try {
            const remindMessage: string = await this.reminderService.getReminderMessage(ctx.from.id);
            await this.reminderService.setReminder(ctx.from.id, { message: remindMessage, date });
        } catch (err) {
            if (err instanceof ReminderExceptions) {
                await ctx.reply(err.message);
                return;
            }
            await ctx.reply('An error occurred while creating the reminder');
            this.logger.error(err);
        }

        await ctx.reply('The reminder has been created');
        await ctx.scene.leave();
    }

    @On('text')
    async onText(@Message('text') message: string, @Ctx() ctx: IContext) {
        try {
            await this.reminderService.setReminderMessage(ctx.from.id, message);
        } catch (err) {
            this.logger.error(err);
        }

        await ctx.reply(
            'Please enter the date and time of the reminder. For example: 2021-12-31 23:59',
            keyboard.LEAVE,
        );
    }

    @Action('leave')
    async leave(@Ctx() ctx: IContext) {
        await ctx.reply('Choose an action from the keyboard below');
        await ctx.scene.leave();
    }
}
