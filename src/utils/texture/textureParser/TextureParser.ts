import parse16BitPngBuffer, {parse16BitPngBufferToGPUTexture, ParsedImageData} from "./parse16BitPngBuffer";
import loadImageToImageBitmap from "./imageBitmap/loadImageToImageBitmap";
import convertSvgToImageBitmap from "./imageBitmap/convertSvgToImageBitmap";
import imageBitmapToGPUTexture from "./imageBitmap/imageBitmapToGPUTexture";
import RedGPUContext from "../../../context/RedGPUContext";

export {ParsedImageData};

/**
 * [KO] 다양한 이미지 및 바이너리 텍스처 데이터의 파싱을 통합 관리하는 처리기 객체입니다.
 * [EN] Integrated parser object managing parsing of various image and binary texture data.
 *
 * * ### Example
 * ```typescript
 * const parsed = await TextureParser.parseImageData(arrayBuffer);
 * ```
 * @category Texture
 */
export const TextureParser = {
    /**
     * [KO] 16비트 PNG 바이너리 버퍼를 파싱하여 Uint16Array 픽셀 데이터를 반환합니다.
     * [EN] Parses 16-bit PNG binary buffer and returns Uint16Array pixel data.
     */
    parse16BitPngBuffer: (buffer: ArrayBuffer, flipY: boolean = false): Promise<ParsedImageData | null> => {
        return parse16BitPngBuffer(buffer, flipY);
    },

    /**
     * [KO] 16비트 PNG 데이터를 GPUTexture(r16float / r16unorm)로 바로 업로드합니다.
     * [EN] Directly uploads 16-bit PNG data to GPUTexture (r16float / r16unorm).
     */
    parse16BitPngBufferToGPUTexture: (
        redGPUContext: RedGPUContext,
        buffer: ArrayBuffer,
        format: GPUTextureFormat = 'rgba16float',
        flipY: boolean = false
    ) => {
        return parse16BitPngBufferToGPUTexture(redGPUContext, buffer, format, flipY);
    },

    /**
     * [KO] 일반 2D 이미지 URL로부터 ImageBitmap을 로드하고 생성합니다.
     * [EN] Loads and creates ImageBitmap from general 2D image URL.
     */
    loadImageToImageBitmap,

    /**
     * [KO] SVG 이미지 소스/URL을 ImageBitmap으로 변환합니다.
     * [EN] Converts SVG image source/URL to ImageBitmap.
     */
    convertSvgToImageBitmap,

    /**
     * [KO] ImageBitmap을 WebGPU GPUTexture로 변환 및 업로드합니다.
     * [EN] Converts and uploads ImageBitmap to WebGPU GPUTexture.
     */
    imageBitmapToGPUTexture,

    /**
     * [KO] 바이너리 헤더의 Magic Number를 분석하여 포맷을 자동 감지 후 이미지 데이터 정보(ParsedImageData)를 파싱하여 반환합니다. 지원되지 않는 포맷일 경우 명시적 에러를 발생시킵니다.
     * [EN] Analyzes binary header Magic Number to auto-detect format and parses image data info (ParsedImageData). Throws explicit error for unsupported formats.
     */
    async parseImageData(buffer: ArrayBuffer, flipY: boolean = false): Promise<ParsedImageData> {
        if (!buffer || buffer.byteLength < 4) {
            throw new Error('[TextureParser] Invalid or empty binary buffer provided.');
        }
        const view = new DataView(buffer);
        const magic = view.getUint32(0);

        // PNG Magic Number: 0x89504E47 (\x89PNG)
        if (magic === 0x89504E47) {
            const parsed = await this.parse16BitPngBuffer(buffer, flipY);
            if (!parsed) {
                throw new Error('[TextureParser] Failed to parse 16-bit PNG buffer.');
            }
            return parsed;
        }

        // KTX2 Magic Number: 0xAB4B5458 («KTX) - 향후 확장
        // HDR Magic Number: 0x233F5241 (#?RA) - 향후 확장

        const hexMagic = '0x' + magic.toString(16).padStart(8, '0').toUpperCase();
        throw new Error(`[TextureParser ❌] Unsupported texture binary format (Magic Number: ${hexMagic}).`);
    }
};

export default TextureParser;
