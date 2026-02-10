[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreIBL](../README.md) / EquirectangularToCubeGenerator

# Class: EquirectangularToCubeGenerator

Defined in: [src/resources/texture/ibl/core/utils/EquirectangularToCubeGenerator.ts:18](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/texture/ibl/core/utils/EquirectangularToCubeGenerator.ts#L18)


Class that converts an Equirectangular (2D) texture to a CubeMap.

## Constructors

### Constructor

> **new EquirectangularToCubeGenerator**(`redGPUContext`): `EquirectangularToCubeGenerator`

Defined in: [src/resources/texture/ibl/core/utils/EquirectangularToCubeGenerator.ts:32](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/texture/ibl/core/utils/EquirectangularToCubeGenerator.ts#L32)


Creates an EquirectangularToCubeGenerator instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`EquirectangularToCubeGenerator`

## Methods

### generate()

> **generate**(`sourceTexture`, `size?`): `Promise`\<[`IBLCubeTexture`](IBLCubeTexture.md)\>

Defined in: [src/resources/texture/ibl/core/utils/EquirectangularToCubeGenerator.ts:61](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/texture/ibl/core/utils/EquirectangularToCubeGenerator.ts#L61)


Converts a 2D Equirectangular texture to a cubemap and returns it.

### Example
```typescript
const cubeMap = await redGPUContext.resourceManager.equirectangularToCubeGenerator.generate(hdrTexture, 1024);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sourceTexture` | `GPUTexture` | `undefined` | Source 2D HDR texture |
| `size` | `number` | `512` | Size of one side of the generated cubemap (default: 512) |

#### Returns

`Promise`\<[`IBLCubeTexture`](IBLCubeTexture.md)\>


Generated IBLCubeTexture
