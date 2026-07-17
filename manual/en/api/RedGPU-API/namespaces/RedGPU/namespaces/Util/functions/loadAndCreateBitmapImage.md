[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / loadAndCreateBitmapImage

# Function: loadAndCreateBitmapImage()

> **loadAndCreateBitmapImage**(`src`, `colorSpaceConversion?`, `premultiplyAlpha?`): `Promise`\<`ImageBitmap`\>

Defined in: [src/utils/texture/loadAndCreateBitmapImage.ts:16](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/utils/texture/loadAndCreateBitmapImage.ts#L16)

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
