import parse16BitPngBuffer, { parse16BitPngBufferToGPUTexture, ParsedImageData } from "./parse16BitPngBuffer/parse16BitPngBuffer";
import loadImageToImageBitmap from "./imageBitmap/loadImageToImageBitmap";
import convertSvgToImageBitmap from "./imageBitmap/convertSvgToImageBitmap";
import { createGPUTextureFromKTX2 } from "./createGPUTextureFromKTX2";
/**
 * [KO] 16비트 PNG, SVG, `ImageBitmap`, KTX2 등 다양한 텍스처 소스 파싱 및 `GPUTexture` 생성 유틸리티 모음입니다.
 * [EN] Utility collection for parsing various texture sources (16-bit PNG, SVG, `ImageBitmap`, KTX2) and creating `GPUTexture` instances.
 *
 * @category Texture
 */
export declare const TextureParser: {
    parse16BitPngBuffer: typeof parse16BitPngBuffer;
    parse16BitPngBufferToGPUTexture: typeof parse16BitPngBufferToGPUTexture;
    loadImageToImageBitmap: typeof loadImageToImageBitmap;
    convertSvgToImageBitmap: typeof convertSvgToImageBitmap;
    imageBitmapToGPUTexture: (gpuDevice: GPUDevice, imageBitmaps: ImageBitmap[], textureDescriptor: GPUTextureDescriptor, usePremultiplyAlpha?: boolean) => GPUTexture;
    createGPUTextureFromKTX2: typeof createGPUTextureFromKTX2;
    /**
     * [KO] 바이너리 버퍼의 매직 넘버를 판별하여 픽셀 데이터와 해상도 정보를 파싱합니다.
     * [EN] Parses pixel data and resolution information by inspecting the magic number of the binary buffer.
     *
     * @param buffer -
     * [KO] 파싱할 이미지 바이너리 `ArrayBuffer`
     * [EN] Image binary `ArrayBuffer` to parse
     * @param flipY -
     * [KO] Y축 상하 반전 여부 (기본값: `false`)
     * [EN] Whether to flip the image vertically along the Y-axis (default: `false`)
     * @returns
     * [KO] 파싱된 이미지 데이터(`ParsedImageData`)를 반환하는 `Promise`
     * [EN] `Promise` resolving to the parsed image data (`ParsedImageData`)
     * @throws
     * [KO] 버퍼가 비어 있거나 지원하지 않는 포맷인 경우 `Error`가 발생합니다.
     * [EN] Throws `Error` if the buffer is empty or in an unsupported format.
     */
    parseImageData(buffer: ArrayBuffer, flipY?: boolean): Promise<ParsedImageData>;
};
export default TextureParser;
