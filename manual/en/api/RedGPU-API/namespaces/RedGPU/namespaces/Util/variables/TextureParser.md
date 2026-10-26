[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / TextureParser

# Variable: TextureParser

> `const` **TextureParser**: `object`

Defined in: [src/utils/texture/textureParser/TextureParser.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L18)

Utility collection for parsing various texture sources (16-bit PNG, SVG, `ImageBitmap`, KTX2) and creating `GPUTexture` instances.

## Type Declaration

## Other

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `parseImageData()` | (`buffer`, `flipY?`) => `Promise`\<`ParsedImageData`\> | Parses pixel data and resolution information by inspecting the magic number of the binary buffer. **Throws** [KO] 버퍼가 비어 있거나 지원하지 않는 포맷인 경우 `Error`가 발생합니다. Throws `Error` if the buffer is empty or in an unsupported format. | [src/utils/texture/textureParser/TextureParser.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L46) |

## Texture

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-convertsvgtoimagebitmap"></a> `convertSvgToImageBitmap()` | (`src`, `premultiplyAlpha`) => `Promise`\<`ImageBitmap`\> | Loads an SVG image from the given source, renders it to a canvas, and converts it into an `ImageBitmap`. | [src/utils/texture/textureParser/TextureParser.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L25) |
| <a id="property-creategputexturefromktx2"></a> `createGPUTextureFromKTX2()` | (`options`) => `Promise`\<`GPUTexture`\> | Parses and transcodes a KTX2 container or binary data to create a WebGPU `GPUTexture`. **Throws** [KO] KTX2 파일 로드 또는 Basis 트랜스코더 초기화에 실패한 경우 `Error`가 발생합니다. Throws `Error` if KTX2 file loading or Basis transcoder initialization fails. | [src/utils/texture/textureParser/TextureParser.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L28) |
| <a id="property-imagebitmaptogputexture"></a> `imageBitmapToGPUTexture()` | (`gpuDevice`, `imageBitmaps`, `textureDescriptor`, `usePremultiplyAlpha`) => `GPUTexture` | Creates a `GPUTexture` from an array of `ImageBitmap` objects and copies the image data into each layer. | [src/utils/texture/textureParser/TextureParser.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L27) |
| <a id="property-loadimagetoimagebitmap"></a> `loadImageToImageBitmap()` | (`src`, `colorSpaceConversion`, `premultiplyAlpha`) => `Promise`\<`ImageBitmap`\> | Fetches an image from the specified URL and creates an `ImageBitmap`. **Throws** [KO] 이미지 네트워크 요청이 실패한 경우 `Error`가 발생합니다. Throws `Error` if fetching the image fails. | [src/utils/texture/textureParser/TextureParser.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L23) |
| <a id="property-parse16bitpngbuffer"></a> `parse16BitPngBuffer()` | (`buffer`, `flipY`) => `Promise`\<`ParsedImageData`\> | Decodes a 16-bit PNG binary buffer and extracts `Uint16Array` pixel data and resolution. | [src/utils/texture/textureParser/TextureParser.ts:20](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L20) |
| <a id="property-parse16bitpngbuffertogputexture"></a> `parse16BitPngBufferToGPUTexture()` | (`redGPUContext`, `buffer`, `format`, `flipY`) => `Promise`\<\{ `gpuTexture`: `GPUTexture`; `height`: `number`; `width`: `number`; \}\> | Decodes a 16-bit PNG buffer, creates a `GPUTexture` of the specified format, and uploads the pixel data. | [src/utils/texture/textureParser/TextureParser.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/texture/textureParser/TextureParser.ts#L21) |
