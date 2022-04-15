import { VK } from 'vk-io';
import dotenv from 'dotenv';
import { HearManager } from '@vk-io/hear';

dotenv.config();

export const bot = new VK({
    token: process.env.TOKEN
});

export const cmd = new HearManager();