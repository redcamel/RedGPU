[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreIBL](../README.md) / BRDFGenerator

# Class: BRDFGenerator

Defined in: [src/resources/texture/ibl/core/brdf/BRDFGenerator.ts:13](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/texture/ibl/core/brdf/BRDFGenerator.ts#L13)


Class that generates BRDF LUT (Look-Up Table).


Pre-bakes a 2D BRDF integration texture for the Split Sum Approximation technique.

## Constructors

### Constructor

> **new BRDFGenerator**(`redGPUContext`): `BRDFGenerator`

Defined in: [src/resources/texture/ibl/core/brdf/BRDFGenerator.ts:27](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/texture/ibl/core/brdf/BRDFGenerator.ts#L27)


Creates a BRDFGenerator instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`BRDFGenerator`

## Accessors

### brdfLUTTexture

#### Get Signature

> **get** **brdfLUTTexture**(): `GPUTexture`

Defined in: [src/resources/texture/ibl/core/brdf/BRDFGenerator.ts:40](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/texture/ibl/core/brdf/BRDFGenerator.ts#L40)


Returns the BRDF LUT texture.
   *
   * ### Example
   * ```typescript
   * const brdfLUT = redGPUContext.resourceManager.brdfGenerator.brdfLUTTexture;
   * ```

##### Returns

`GPUTexture`
