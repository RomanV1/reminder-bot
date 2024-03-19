import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { IContext } from '../../interfaces/context.interface';
import { ReminderService } from '../../reminder/reminder.service';
import { IReminder } from '../../interfaces/remind.interface';

@Scene('get-reminders')
export class GetRemindersScene {
    constructor(private readonly reminderService: ReminderService) {}

    @SceneEnter()
    async enter(@Ctx() ctx: IContext) {
        const reminders: IReminder[] = await this.reminderService.getReminders(ctx.from.id);
        if (!reminders) {
            await ctx.reply('You have no reminders');
            return;
        }

        for (let i = 0; i < reminders.length; i++) {
            await ctx.replyWithHTML(
                `✉️ <b>Message</b>: ${reminders[i].message} \n📆 <b>Date</b>: ${reminders[i].date}`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Change',
                                    callback_data: `change:${i}`,
                                },
                                {
                                    text: 'Delete',
                                    callback_data: `delete:${i}`,
                                },
                            ],
                        ],
                    },
                },
            );
        }
    }

    @Action(/change:\d+/)
    async change(@Ctx() ctx: IContext) {
        if (!('data' in ctx.callbackQuery)) return;
        const index: number = +ctx.callbackQuery.data.split(':')[1];

        await ctx.editMessageText('What do you want to change?', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Message',
                            callback_data: `message:${index}`,
                        },
                        {
                            text: 'Date',
                            callback_data: `date:${index}`,
                        },
                    ],
                ],
            },
        });
    }

    @Action(/message:\d+/)
    async onMessage(@Ctx() ctx: IContext) {
        await ctx.scene.enter('change-reminder-message');
    }

    @Action(/date:\d+/)
    async onDate(@Ctx() ctx: IContext) {
        await ctx.scene.enter('change-reminder-date');
    }

    @Action(/delete:\d+/)
    async delete(@Ctx() ctx: IContext) {
        await ctx.scene.enter('delete-reminder');
    }

    @Action('leave')
    async leave(@Ctx() ctx: IContext) {
        await ctx.reply('Choose an action from the keyboard below');
        await ctx.scene.leave();
    }
}
