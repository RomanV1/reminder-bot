import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IReminder } from '../interfaces/remind.interface';
import { ReminderExceptions } from '../utils/reminderExceptions';

@Injectable()
export class ReminderService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    async getAllReminders(): Promise<Record<string, IReminder[]>> {
        const allData: Record<string, IReminder[]> = {};
        const keys = await this.cache.store.keys();

        for (const key of keys) {
            if (key.startsWith('reminders:')) {
                allData[key] = await this.cache.get(key);
            }
        }
        return allData;
    }

    async getReminders(userId: number): Promise<IReminder[]> {
        return this.cache.get<IReminder[]>(`reminders:${userId}`);
    }

    async setReminder(userId: number, reminder: IReminder): Promise<void> {
        const reminders = (await this.cache.get<IReminder[]>(`reminders:${userId}`)) ?? [];
        if (reminders.length === 10) {
            throw new ReminderExceptions('Too many reminds. Please, delete some of them first.');
        }

        reminders.push(reminder);
        await this.cache.set(`reminders:${userId}`, reminders);
    }

    async setReminderMessage(userId: number, reminderMessage: string): Promise<void> {
        await this.cache.set(`remindMessage:${userId}`, reminderMessage, { ttl: 180 } as any);
    }

    async getReminderMessage(userId: number): Promise<string> {
        const message: string = await this.cache.get<string>(`remindMessage:${userId}`);
        if (!message) {
            throw new ReminderExceptions('Message is undefined. Please, enter the message again.');
        }

        return message;
    }

    async changeReminder(userId: number, index: number, reminder: Partial<IReminder>) {
        const reminders = (await this.cache.get<IReminder[]>(`reminders:${userId}`)) ?? [];
        if (reminders.length === 0) {
            throw new ReminderExceptions('There are no reminds to change');
        }

        reminders[index] = { ...reminders[index], ...reminder };
        await this.cache.set(`reminders:${userId}`, reminders);
    }

    async setIndex(userId: number, index: number): Promise<void> {
        await this.cache.set(`index:${userId}`, index, { ttl: 180 } as any);
    }

    async getIndex(userId: number): Promise<number> {
        const index: number = await this.cache.get<number>(`index:${userId}`);
        if (!index) {
            throw new ReminderExceptions('Index is undefined. Please, enter the message again.');
        }

        return index;
    }

    async deleteRemind(userId: number, index: number) {
        const reminders = (await this.cache.get<IReminder[]>(`reminders:${userId}`)) ?? [];

        if (reminders.length === 0) {
            throw new ReminderExceptions('There are no reminders to delete');
        }

        reminders.splice(index, 1);

        await this.cache.set(`reminders:${userId}`, reminders);
    }
}
