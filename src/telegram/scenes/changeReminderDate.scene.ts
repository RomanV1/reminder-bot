import { Ctx, Hears, Message, Scene, SceneEnter } from 'nestjs-telegraf';
import { IContext } from '../../interfaces/context.interface';
import { ReminderService } from '../../reminder/reminder.service';
import { ReminderExceptions } from '../../utils/reminderExceptions';
import { Logger } from '@nestjs/common';

@Scene('change-reminder-date')
export class ChangeReminderDateScene {
    private readonly logger = new Logger(ChangeReminderDateScene.name);
    constructor(private readonly reminderService: ReminderService) {}

    @SceneEnter()
    async enter(@Ctx() ctx: IContext) {
        if (!('data' in ctx.callbackQuery)) return;
        const index: number = +ctx.callbackQuery.data.split(':')[1];
        await this.reminderService.setIndex(ctx.from.id, index);

        await ctx.reply('Please enter the new date and time of the reminder. For example: 2021-12-31 23:59');
    }

    @Hears(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
    async onDate(@Message('text') date: string, @Ctx() ctx: IContext) {
        try {
            const index: number = await this.reminderService.getIndex(ctx.from.id);

            try {
                await this.reminderService.changeReminder(ctx.from.id, index, { date });
            } catch (err) {
                if (err instanceof ReminderExceptions) {
                    await ctx.reply(err.message);
                    return;
                }
                await ctx.reply('An error occurred while changing the reminder');
                this.logger.error(err);
            }

            await ctx.reply('The reminder has been changed');
            await ctx.scene.leave();
        } catch (err) {
            this.logger.error(err);
        }
    }
}
