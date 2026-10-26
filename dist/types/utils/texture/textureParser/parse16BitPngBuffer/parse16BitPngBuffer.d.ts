import RedGPUContext from "../../../../context/RedGPUContext";
/**
 * [KO] 파싱된 이미지의 픽셀 버퍼 및 해상도 정보를 담는 인터페이스입니다.
 * [EN] Interface representing parsed image pixel buffer and resolution information.
 *
 * @category Texture
 */
export interface ParsedImageData {
    /**
     * [KO] 디코딩된 픽셀 데이터 배열
     * [EN] Decoded pixel data array
     */
    pixels: Uint16Array | Float32Array | Uint8Array | Uint8ClampedArray;
    /**
     * [KO] 이미지 가로 픽셀 크기
     * [EN] Image width in pixels
     */
    width: number;
    /**
     * [KO] 이미지 세로 픽셀 크기
     * [EN] Image height in pixels
     */
    height: number;
}
/**
 * [KO] 16비트 PNG 바이너리 버퍼를 디코딩하여 `Uint16Array` 픽셀 데이터와 해상도를 추출합니다.
 * [EN] Decodes a 16-bit PNG binary buffer and extracts `Uint16Array` pixel data and resolution.
 *
 * @param buffer -
 * [KO] 16비트 PNG 파일의 `ArrayBuffer`
 * [EN] `ArrayBuffer` of the 16-bit PNG file
 * @param flipY -
 * [KO] Y축 상하 반전 여부 (기본값: `false`)
 * [EN] Whether to flip vertically along the Y-axis (default: `false`)
 * @returns
 * [KO] 디코딩 성공 시 `ParsedImageData`, 16비트 PNG가 아니거나 실패 시 `null`을 반환하는 `Promise`
 * [EN] `Promise` resolving to `ParsedImageData` on success, or `null` if not a 16-bit PNG or decoding fails
 * @category Texture
 */
export declare function parse16BitPngBuffer(buffer: ArrayBuffer, flipY?: boolean): Promise<ParsedImageData | null>;
/**
 * [KO] 16비트 PNG 버퍼를 디코딩하여 지정된 포맷의 `GPUTexture`를 생성하고 픽셀 데이터를 업로드합니다.
 * [EN] Decodes a 16-bit PNG buffer, creates a `GPUTexture` of the specified format, and uploads the pixel data.
 *
 * @param redGPUContext -
 * [KO] RedGPUContext 인스턴스
 * [EN] RedGPUContext instance
 * @param buffer -
 * [KO] 16비트 PNG 파일의 `ArrayBuffer`
 * [EN] `ArrayBuffer` of the 16-bit PNG file
 * @param format -
 * [KO] 생성할 `GPUTexture` 포맷 (기본값: `'r16unorm'`)
 * [EN] `GPUTexture` format to create (default: `'r16unorm'`)
 * @param flipY -
 * [KO] Y축 상하 반전 여부 (기본값: `false`)
 * [EN] Whether to flip vertically along the Y-axis (default: `false`)
 * @returns
 * [KO] 생성된 `GPUTexture` 및 해상도 정보를 담은 객체 또는 실패 시 `null`을 반환하는 `Promise`
 * [EN] `Promise` resolving to an object containing the created `GPUTexture` and dimensions, or `null` on failure
 * @category Texture
 */
export declare function parse16BitPngBufferToGPUTexture(redGPUContext: RedGPUContext, buffer: ArrayBuffer, format?: GPUTextureFormat, flipY?: boolean): Promise<{
    gpuTexture: GPUTexture;
    width: number;
    height: number;
} | null>;
export default parse16BitPngBuffer;
