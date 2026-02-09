[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreIBL](../README.md) / IrradianceGenerator

# Class: IrradianceGenerator

Defined in: [src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts:21](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts#L21)

Irradiance 맵을 생성하는 클래스입니다.


큐브맵으로부터 저주파 조명 정보를 추출하여 난반사(Diffuse) 라이팅에 사용할 Irradiance 맵을 베이킹합니다.


## Constructors

### Constructor

> **new IrradianceGenerator**(`redGPUContext`): `IrradianceGenerator`

Defined in: [src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts:35](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts#L35)

IrradianceGenerator 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`IrradianceGenerator`

## Methods

### generate()

> **generate**(`sourceCubeTexture`, `size`): `Promise`\<[`IBLCubeTexture`](IBLCubeTexture.md)\>

Defined in: [src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts:66](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/texture/ibl/core/irradiance/IrradianceGenerator.ts#L66)

소스 큐브 텍스처로부터 Irradiance 맵을 생성하여 반환합니다.


### Example
```typescript
const irradianceMap = await redGPUContext.resourceManager.irradianceGenerator.generate(sourceCubeTexture, 64);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sourceCubeTexture` | `GPUTexture` | `undefined` | 소스 환경맵 (큐브)
| `size` | `number` | `32` | 생성될 Irradiance 맵의 크기 (기본값: 32)

#### Returns

`Promise`\<[`IBLCubeTexture`](IBLCubeTexture.md)\>

생성된 Irradiance IBLCubeTexture

