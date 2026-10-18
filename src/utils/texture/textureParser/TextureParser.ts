import parse16BitPngBuffer, {
    parse16BitPngBufferToGPUTexture,
    ParsedImageData
} from "./parse16BitPngBuffer/parse16BitPngBuffer";

import loadImageToImageBitmap from "./imageBitmap/loadImageToImageBitmap";
import convertSvgToImageBitmap from "./imageBitmap/convertSvgToImageBitmap";
import imageBitmapToGPUTexture from "./imageBitmap/imageBitmapToGPUTexture";
import {createGPUTextureFromKTX2} from "./createGPUTextureFromKTX2";


export const TextureParser = {

    parse16BitPngBuffer,
    parse16BitPngBufferToGPUTexture,

    loadImageToImageBitmap,

    convertSvgToImageBitmap,

    imageBitmapToGPUTexture,
    createGPUTextureFromKTX2,
    async parseImageData(buffer: ArrayBuffer, flipY: boolean = false): Promise<ParsedImageData> {
        if (!buffer || buffer.byteLength < 4) {
            throw new Error('[TextureParser] Invalid or empty binary buffer provided.');
        }
        const view = new DataView(buffer);
        const magic = view.getUint32(0);

        if (magic === 0x89504E47) {
            const parsed = await this.parse16BitPngBuffer(buffer, flipY);
            if (!parsed) {
                throw new Error('[TextureParser] Failed to parse 16-bit PNG buffer.');
            }
            return parsed;
        }


        const hexMagic = '0x' + magic.toString(16).padStart(8, '0').toUpperCase();
        throw new Error(`[TextureParser ❌] Unsupported texture binary format (Magic Number: ${hexMagic}).`);
    }
};

export default TextureParser;
