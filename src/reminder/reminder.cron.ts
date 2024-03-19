import { Cron } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { IContext } from '../interfaces/context.interface';
import { Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { IReminder } from '../interfaces/remind.interface';

@Injectable()
export class ReminderCron {
    private readonly logger = new Logger(ReminderCron.name);

    constructor(
        @InjectBot() private readonly bot: Telegraf<IContext>,
        private readonly reminderService: ReminderService,
    ) {}

    @Cron('0 * * * * *')
    async handleReminders() {
        const reminders: Record<string, IReminder[]> = await this.reminderService.getAllReminders();
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
            .getDate()
            .toString()
            .padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}`;

        for (const key in reminders) {
            if (reminders.hasOwnProperty(key)) {
                for (let i = 0; i < reminders[key].length; i++) {
                    if (reminders[key][i].date === formattedDate) {
                        try {
                            await this.bot.telegram.sendMessage(
                                key.split(':')[1],
                                `✉️ New reminder: \n🟢 ${reminders[key][i].message}`,
                            );
                            await this.reminderService.deleteRemind(+key.split(':')[1], i);
                        } catch (err) {
                            this.logger.error(err);
                        }
                    }
                }
            }
        }
    }
}
