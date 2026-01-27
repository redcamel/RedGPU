[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / loadAndCreateBitmapImage

# Function: loadAndCreateBitmapImage()

> **loadAndCreateBitmapImage**(`src`, `colorSpaceConversion`, `premultiplyAlpha`): `Promise`\<`ImageBitmap`\>

Defined in: [src/utils/texture/loadAndCreateBitmapImage.ts:24](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/utils/texture/loadAndCreateBitmapImage.ts#L24)


Loads an image and creates an ImageBitmap.

* ### Example
```typescript
const bitmap = await RedGPU.Util.loadAndCreateBitmapImage('path/to/image.png');
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `src` | `string` | `undefined` | Image source URL |
| `colorSpaceConversion` | `ColorSpaceConversion` | `'none'` | Color space conversion option (Default: 'none') |
| `premultiplyAlpha` | `PremultiplyAlpha` | `'premultiply'` | Premultiply alpha option (Default: 'premultiply') |

## Returns

`Promise`\<`ImageBitmap`\>


Promise returning an ImageBitmap
