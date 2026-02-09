[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreIBL](../README.md) / BRDFGenerator

# Class: BRDFGenerator

Defined in: [src/resources/texture/ibl/core/brdf/BRDFGenerator.ts:13](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/brdf/BRDFGenerator.ts#L13)

BRDF LUT(Look-Up Table)를 생성하는 클래스입니다.


Split Sum Approximation 기법을 위해 2D BRDF 통합 텍스처를 사전 베이킹합니다.


## Constructors

### Constructor

> **new BRDFGenerator**(`redGPUContext`): `BRDFGenerator`

Defined in: [src/resources/texture/ibl/core/brdf/BRDFGenerator.ts:27](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/brdf/BRDFGenerator.ts#L27)

BRDFGenerator 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`BRDFGenerator`

## Accessors

### brdfLUTTexture

#### Get Signature

> **get** **brdfLUTTexture**(): `GPUTexture`

Defined in: [src/resources/texture/ibl/core/brdf/BRDFGenerator.ts:40](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/resources/texture/ibl/core/brdf/BRDFGenerator.ts#L40)

BRDF LUT 텍스처를 반환합니다.

   *
   * ### Example
   * ```typescript
   * const brdfLUT = redGPUContext.resourceManager.brdfGenerator.brdfLUTTexture;
   * ```

##### Returns

`GPUTexture`
