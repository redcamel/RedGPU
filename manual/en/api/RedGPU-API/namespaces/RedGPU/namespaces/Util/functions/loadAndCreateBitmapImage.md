[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / loadAndCreateBitmapImage

# Function: loadAndCreateBitmapImage()

> **loadAndCreateBitmapImage**(`src`, `colorSpaceConversion?`, `premultiplyAlpha?`): `Promise`\<`ImageBitmap`\>

Defined in: [src/utils/texture/loadAndCreateBitmapImage.ts:16](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/utils/texture/loadAndCreateBitmapImage.ts#L16)

Loads and creates an ImageBitmap from an image URL.

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

Created ImageBitmap
