[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / calculateTextureByteSize

# Function: calculateTextureByteSize()

> **calculateTextureByteSize**(`texture`): `number`

Defined in: [src/utils/texture/calculateTextureByteSize.ts:18](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/utils/texture/calculateTextureByteSize.ts#L18)


Calculates the byte size of a GPUTexture.

* ### Example
```typescript
const byteSize = RedGPU.Util.calculateTextureByteSize(gpuTexture);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | `GPUTexture` | GPUTexture object to calculate byte size for |

## Returns

`number`


Calculated total byte size
