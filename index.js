import { bot, cmd } from "./src/bot.js";
import { sendImage } from "./src/commands.js";

bot.updates.on('message_new', cmd.middleware);

cmd.hear(/^(?:who|кто|кто я|инфо|ху)$/i, sendImage);

bot.updates.start().catch(console.error).then(() => {
    console.log('started');
});

