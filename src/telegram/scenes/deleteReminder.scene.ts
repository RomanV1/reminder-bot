import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { IContext } from '../../interfaces/context.interface';
import { ReminderService } from '../../reminder/reminder.service';
import { ReminderExceptions } from '../../utils/reminderExceptions';
import { Logger } from '@nestjs/common';

@Scene('delete-reminder')
export class DeleteReminderScene {
    private readonly logger = new Logger(DeleteReminderScene.name);

    constructor(private readonly reminderService: ReminderService) {}

    @SceneEnter()
    async enter(@Ctx() ctx: IContext) {
        if (!('data' in ctx.callbackQuery)) return;
        const index: number = +ctx.callbackQuery.data.split(':')[1];

        await ctx.editMessageText('Are you sure you want to delete the reminder?', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Yes',
                            callback_data: `yes:${index}`,
                        },
                        {
                            text: 'No',
                            callback_data: `no`,
                        },
                    ],
                ],
            },
        });
    }

    @Action(/yes:\d+/)
    async change(@Ctx() ctx: IContext) {
        if (!('data' in ctx.callbackQuery)) return;
        const index: number = +ctx.callbackQuery.data.split(':')[1];

        try {
            await this.reminderService.deleteRemind(ctx.from.id, index);
        } catch (err) {
            if (err instanceof ReminderExceptions) {
                await ctx.reply(err.message);
                return;
            }
            await ctx.reply('An error occurred while deleting the reminder');
            this.logger.error(err);
        }

        await ctx.reply('The reminder has been deleted');
    }

    @Action('no')
    async delete(@Ctx() ctx: IContext) {
        await ctx.reply('Choose an action from the keyboard below');
        await ctx.scene.leave();
    }
}
