[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / loadAndCreateBitmapImage

# Function: loadAndCreateBitmapImage()

> **loadAndCreateBitmapImage**(`src`, `colorSpaceConversion`, `premultiplyAlpha`): `Promise`\<`ImageBitmap`\>

Defined in: [src/utils/texture/loadAndCreateBitmapImage.ts:24](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/utils/texture/loadAndCreateBitmapImage.ts#L24)


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
