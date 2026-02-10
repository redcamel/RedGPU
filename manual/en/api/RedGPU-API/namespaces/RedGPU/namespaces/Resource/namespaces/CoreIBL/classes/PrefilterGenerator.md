[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreIBL](../README.md) / PrefilterGenerator

# Class: PrefilterGenerator

Defined in: [src/resources/texture/ibl/core/prefilter/PrefilterGenerator.ts:21](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/core/prefilter/PrefilterGenerator.ts#L21)


Class that generates a Prefilter map.


Extracts filtered reflection information for each roughness level from a cubemap and stores it in the cubemap's mipmaps.

## Constructors

### Constructor

> **new PrefilterGenerator**(`redGPUContext`): `PrefilterGenerator`

Defined in: [src/resources/texture/ibl/core/prefilter/PrefilterGenerator.ts:35](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/core/prefilter/PrefilterGenerator.ts#L35)


Creates a PrefilterGenerator instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`PrefilterGenerator`

## Methods

### generate()

> **generate**(`sourceCubeTexture`, `size?`): `Promise`\<[`IBLCubeTexture`](IBLCubeTexture.md)\>

Defined in: [src/resources/texture/ibl/core/prefilter/PrefilterGenerator.ts:65](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/core/prefilter/PrefilterGenerator.ts#L65)


Generates and returns a pre-filtered cubemap from the source cube texture.

### Example
```typescript
const prefilteredMap = await redGPUContext.resourceManager.prefilterGenerator.generate(sourceCubeTexture, 512);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sourceCubeTexture` | `GPUTexture` | `undefined` | Source environment map (Cube) |
| `size` | `number` | `512` | Size of one side of the generated cubemap (default: 512) |

#### Returns

`Promise`\<[`IBLCubeTexture`](IBLCubeTexture.md)\>


Generated Prefilter IBLCubeTexture
