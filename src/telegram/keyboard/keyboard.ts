import { Markup } from 'telegraf';
import { button } from './buttons';

export const keyboard = {
    MAIN: [['⏰ Create a reminder', '📝 Get reminders']],
    LEAVE: Markup.inlineKeyboard([[button.LEAVE]]),
    APPROVE: Markup.inlineKeyboard([[button.YES, button.NO]]),
};
