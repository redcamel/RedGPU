[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreIBL](../README.md) / IrradianceGenerator

# Class: IrradianceGenerator

Defined in: [src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts:21](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts#L21)


Class that generates an Irradiance map.


Extracts low-frequency lighting information from a cubemap to bake an Irradiance map for diffuse lighting.

## Constructors

### Constructor

> **new IrradianceGenerator**(`redGPUContext`): `IrradianceGenerator`

Defined in: [src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts:35](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts#L35)


Creates an IrradianceGenerator instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`IrradianceGenerator`

## Methods

### generate()

> **generate**(`sourceCubeTexture`, `size`): `Promise`\<[`IBLCubeTexture`](IBLCubeTexture.md)\>

Defined in: [src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts:66](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts#L66)


Generates and returns an Irradiance map from the source cube texture.

### Example
```typescript
const irradianceMap = await redGPUContext.resourceManager.irradianceGenerator.generate(sourceCubeTexture, 64);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sourceCubeTexture` | `GPUTexture` | `undefined` | Source environment map (Cube) |
| `size` | `number` | `32` | Size of the generated Irradiance map (default: 32) |

#### Returns

`Promise`\<[`IBLCubeTexture`](IBLCubeTexture.md)\>


Generated Irradiance IBLCubeTexture
