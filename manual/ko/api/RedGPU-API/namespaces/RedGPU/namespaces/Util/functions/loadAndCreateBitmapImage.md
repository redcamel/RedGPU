[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / loadAndCreateBitmapImage

# Function: loadAndCreateBitmapImage()

> **loadAndCreateBitmapImage**(`src`, `colorSpaceConversion?`, `premultiplyAlpha?`): `Promise`\<`ImageBitmap`\>

Defined in: [src/utils/texture/loadAndCreateBitmapImage.ts:16](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/utils/texture/loadAndCreateBitmapImage.ts#L16)

이미지 URL로부터 ImageBitmap을 로드하고 생성합니다.

* ### Example
```typescript
const bitmap = await RedGPU.Util.loadAndCreateBitmapImage('path/to/image.png');
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `src` | `string` | `undefined` | 이미지 소스 URL
| `colorSpaceConversion` | `ColorSpaceConversion` | `'none'` | 색상 공간 변환 옵션 (기본값: 'none')
| `premultiplyAlpha` | `PremultiplyAlpha` | `'premultiply'` | 프리멀티플 알파 옵션 (기본값: 'premultiply')

## Returns

`Promise`\<`ImageBitmap`\>

생성된 ImageBitmap
