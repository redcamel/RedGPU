[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / loadAndCreateBitmapImage

# Function: loadAndCreateBitmapImage()

> **loadAndCreateBitmapImage**(`src`, `colorSpaceConversion`, `premultiplyAlpha`): `Promise`\<`ImageBitmap`\>

Defined in: [src/utils/texture/loadAndCreateBitmapImage.ts:24](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/utils/texture/loadAndCreateBitmapImage.ts#L24)

이미지 URL에서 ImageBitmap을 생성합니다.


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

ImageBitmap을 반환하는 Promise

