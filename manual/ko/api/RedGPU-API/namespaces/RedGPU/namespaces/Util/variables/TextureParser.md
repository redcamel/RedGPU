[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / TextureParser

# Variable: TextureParser

> `const` **TextureParser**: `object`

Defined in: [src/utils/texture/textureParser/TextureParser.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L18)

16비트 PNG, SVG, `ImageBitmap`, KTX2 등 다양한 텍스처 소스 파싱 및 `GPUTexture` 생성 유틸리티 모음입니다.

## Type Declaration

## Other

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `parseImageData()` | (`buffer`, `flipY?`) => `Promise`\<`ParsedImageData`\> | 바이너리 버퍼의 매직 넘버를 판별하여 픽셀 데이터와 해상도 정보를 파싱합니다. | [src/utils/texture/textureParser/TextureParser.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L46) |

## Texture

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-convertsvgtoimagebitmap"></a> `convertSvgToImageBitmap()` | (`src`, `premultiplyAlpha`) => `Promise`\<`ImageBitmap`\> | SVG 이미지 경로를 로드하여 캔버스에 렌더링한 뒤 `ImageBitmap`으로 변환합니다. | [src/utils/texture/textureParser/TextureParser.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L25) |
| <a id="property-creategputexturefromktx2"></a> `createGPUTextureFromKTX2()` | (`options`) => `Promise`\<`GPUTexture`\> | KTX2 컨테이너 또는 바이너리 데이터를 파싱 및 트랜스코딩하여 WebGPU `GPUTexture`를 생성합니다. | [src/utils/texture/textureParser/TextureParser.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L28) |
| <a id="property-imagebitmaptogputexture"></a> `imageBitmapToGPUTexture()` | (`gpuDevice`, `imageBitmaps`, `textureDescriptor`, `usePremultiplyAlpha`) => `GPUTexture` | `ImageBitmap` 배열을 기반으로 `GPUTexture`를 생성하고 각 레이어에 이미지 데이터를 복사합니다. | [src/utils/texture/textureParser/TextureParser.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L27) |
| <a id="property-loadimagetoimagebitmap"></a> `loadImageToImageBitmap()` | (`src`, `colorSpaceConversion`, `premultiplyAlpha`) => `Promise`\<`ImageBitmap`\> | 지정된 URL의 이미지를 `fetch`로 로드하여 `ImageBitmap`으로 생성합니다. | [src/utils/texture/textureParser/TextureParser.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L23) |
| <a id="property-parse16bitpngbuffer"></a> `parse16BitPngBuffer()` | (`buffer`, `flipY`) => `Promise`\<`ParsedImageData`\> | 16비트 PNG 바이너리 버퍼를 디코딩하여 `Uint16Array` 픽셀 데이터와 해상도를 추출합니다. | [src/utils/texture/textureParser/TextureParser.ts:20](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L20) |
| <a id="property-parse16bitpngbuffertogputexture"></a> `parse16BitPngBufferToGPUTexture()` | (`redGPUContext`, `buffer`, `format`, `flipY`) => `Promise`\<\{ `gpuTexture`: `GPUTexture`; `height`: `number`; `width`: `number`; \}\> | 16비트 PNG 버퍼를 디코딩하여 지정된 포맷의 `GPUTexture`를 생성하고 픽셀 데이터를 업로드합니다. | [src/utils/texture/textureParser/TextureParser.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L21) |
