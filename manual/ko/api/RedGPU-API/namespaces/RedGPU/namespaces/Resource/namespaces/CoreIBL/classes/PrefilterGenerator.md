[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreIBL](../README.md) / PrefilterGenerator

# Class: PrefilterGenerator

Defined in: [src/resources/texture/ibl/core/prefilter/PrefilterGenerator.ts:21](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/texture/ibl/core/prefilter/PrefilterGenerator.ts#L21)

Prefilter 맵을 생성하는 클래스입니다.


큐브맵으로부터 거칠기(Roughness) 단계별로 필터링된 반사광 정보를 추출하여 큐브맵의 밉맵에 저장합니다.


## Constructors

### Constructor

> **new PrefilterGenerator**(`redGPUContext`): `PrefilterGenerator`

Defined in: [src/resources/texture/ibl/core/prefilter/PrefilterGenerator.ts:35](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/texture/ibl/core/prefilter/PrefilterGenerator.ts#L35)

PrefilterGenerator 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`PrefilterGenerator`

## Methods

### generate()

> **generate**(`sourceCubeTexture`, `size?`): `Promise`\<[`IBLCubeTexture`](IBLCubeTexture.md)\>

Defined in: [src/resources/texture/ibl/core/prefilter/PrefilterGenerator.ts:65](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/resources/texture/ibl/core/prefilter/PrefilterGenerator.ts#L65)

소스 큐브 텍스처로부터 프리필터링된 큐브맵을 생성하여 반환합니다.


### Example
```typescript
const prefilteredMap = await redGPUContext.resourceManager.prefilterGenerator.generate(sourceCubeTexture, 512);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sourceCubeTexture` | `GPUTexture` | `undefined` | 소스 환경맵 (큐브)
| `size` | `number` | `512` | 생성될 큐브맵의 한 면 크기 (기본값: 512)

#### Returns

`Promise`\<[`IBLCubeTexture`](IBLCubeTexture.md)\>

생성된 Prefilter IBLCubeTexture

