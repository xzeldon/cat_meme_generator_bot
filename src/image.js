import { createReadStream } from 'fs';
import { createRequire } from 'module';
import { gmToBuffer } from './utils.js';
const require = createRequire(import.meta.url);
/**
 * @type {import('gm')}
 */
export const gm = require('gm').subClass({ imageMagick: true });

export const generateTextOnImage = async (image, text) => {
    let result = gm(image)
        .out('-scale', '500!x500!')
        .font('./assets/impact.ttf')
        .pointSize(36)
        .draw(`gravity south \ fill black  text 0,12 '${text}' \ fill white  text 3,15 '${text}'`);


    result = await gmToBuffer(result);
    return result;
};