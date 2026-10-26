/**
 * [KO] 이미지/SVG를 `ImageBitmap`으로 로드하고 `ImageBitmap`을 `GPUTexture`로 업로드하는 유틸리티를 제공합니다.
 * [EN] Provides utilities to load images/SVGs as `ImageBitmap` and upload `ImageBitmap` to `GPUTexture`.
 * @packageDocumentation
 */
import convertSvgToImageBitmap from "./convertSvgToImageBitmap";
import loadImageToImageBitmap from "./loadImageToImageBitmap";
import imageBitmapToGPUTexture from "./imageBitmapToGPUTexture";

export {
    convertSvgToImageBitmap,
    loadImageToImageBitmap,
    imageBitmapToGPUTexture
};

export default loadImageToImageBitmap;
