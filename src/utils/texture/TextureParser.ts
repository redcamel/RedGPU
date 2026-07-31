import parse16BitPngBuffer, {parse16BitPngBufferToGPUTexture, Parsed16BitPng} from "./parse16BitPngBuffer";
import loadAndCreateBitmapImage from "./loadAndCreateBitmapImage";
import RedGPUContext from "../../context/RedGPUContext";

/**
 * [KO] 다양한 이미지 및 바이너리 텍스처 데이터의 파싱을 통합 관리하는 처리기 객체입니다.
 * [EN] Integrated parser object managing parsing of various image and binary texture data.
 *
 * * ### Example
 * ```typescript
 * const parsed = await TextureParser.parse16BitPngBuffer(arrayBuffer);
 * ```
 * @category Texture
 */
export const TextureParser = {
    /**
     * [KO] 16비트 PNG 바이너리 버퍼를 파싱하여 Uint16Array 픽셀 데이터를 반환합니다.
     * [EN] Parses 16-bit PNG binary buffer and returns Uint16Array pixel data.
     */
    parse16BitPngBuffer: (buffer: ArrayBuffer, flipY: boolean = false): Promise<Parsed16BitPng | null> => {
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
     * [KO] 일반 2D 이미지 URL로부터 ImageBitmap을 생성합니다.
     * [EN] Creates ImageBitmap from general 2D image URL.
     */
    loadAndCreateBitmapImage,

    /**
     * [KO] 바이너리 헤더의 Magic Number를 분석하여 포맷을 자동 감지 후 알맞은 파서를 호출합니다.
     * [EN] Analyzes binary header Magic Number to auto-detect format and invoke appropriate parser.
     */
    async parseAuto(buffer: ArrayBuffer, flipY: boolean = false) {
        if (!buffer || buffer.byteLength < 4) return null;
        const view = new DataView(buffer);
        const magic = view.getUint32(0);

        // PNG Magic Number: 0x89504E47 (\x89PNG)
        if (magic === 0x89504E47) {
            return this.parse16BitPngBuffer(buffer, flipY);
        }

        // KTX2 Magic Number: 0xAB4B5458 («KTX) - 향후 확장
        // HDR Magic Number: 0x233F5241 (#?RA) - 향후 확장

        return null;
    }
};

export default TextureParser;
