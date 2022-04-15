import tempy from 'tempy';
import { fetch } from 'undici';
import fsp from 'fs/promises';
import { bot } from './bot.js';
import { generateTextOnImage, gm } from './image.js';
import { PHRASES } from './constants.js';

export function random(min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
}

export async function getImage(url) {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    return Buffer.from(buffer);
}

export async function generateImage(context) {
    const [user] = await bot.api.call("users.get", { user_id: context.senderId, fields: 'photo_400_orig' });

    const [r_avatar, r_cringe, r_govnach, r_cat] = await Promise.all([
        getImage(user.photo_400_orig),
        getImage("https://thispersondoesnotexist.com/image"),
        getImage("https://picsum.photos/400/300"),
        getImage("https://loremflickr.com/400/300")
    ]);

    const [avatar, cringe, govnach, cat] = await Promise.all([
        generateTextOnImage(r_avatar, `${user.first_name} ${user.last_name}`),
        generateTextOnImage(r_cringe, "КАКОЙ КОТ ТЫ СЕГОДНЯ?"),
        generateTextOnImage(r_govnach, "ГОВНАЧ ДУМАЕТ..."),
        generateTextOnImage(r_cat, `${PHRASES[random(0, PHRASES.length - 1)]} кот`)
    ]);

    const avatarImage = tempy.file({ extension: 'jpg' });
    const cringeImage = tempy.file({ extension: 'jpg' });
    const govnachImage = tempy.file({ extension: 'jpg' });

    await Promise.all([
        fsp.writeFile(avatarImage, avatar),
        fsp.writeFile(cringeImage, cringe),
        fsp.writeFile(govnachImage, govnach),
    ]);

    let result = gm(cat).montage(avatarImage).montage(cringeImage).montage(govnachImage).geometry("+0+0");

    result = await gmToBuffer(result);
    return result;
}

export async function gmToBuffer(data) {
    return new Promise((resolve, reject) => {
        data.stream((err, stdout, stderr) => {
            if (err) reject(err);
            const chunks = [];

            stdout.on('data', (chunk) => {
                chunks.push(chunk);
            });

            // these are 'once' because they can and do fire multiple times for multiple errors,
            // but this is a promise so you'll have to deal with them one at a time
            stdout.once('end', () => {
                resolve(Buffer.concat(chunks));
            });

            stderr.once('data', (data) => {
                reject(String(data));
            });
        });
    });
}