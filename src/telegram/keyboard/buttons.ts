import { Markup } from 'telegraf';

export const button = {
    LEAVE: Markup.button.callback('Leave', 'leave'),
    YES: Markup.button.callback('Yes', 'yes'),
    NO: Markup.button.callback('No', 'no'),
};
