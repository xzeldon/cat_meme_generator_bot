import { bot } from "./bot.js";
import { generateImage } from "./utils.js";

export async function sendImage(context) {
    const image = await generateImage(context);

    const attachment = await bot.upload.messagePhoto({
        peer_id: context.senderId,
        source: {
            values: {
                value: Buffer.from(image),
                contentType: `image/jpg`
            }
        }
    });

    return context.send('ДЕРЖИ', { attachment });
}