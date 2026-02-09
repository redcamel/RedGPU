[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreIBL](../README.md) / EquirectangularToCubeGenerator

# Class: EquirectangularToCubeGenerator

Defined in: [src/resources/texture/ibl/core/utils/EquirectangularToCubeGenerator.ts:18](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/ibl/core/utils/EquirectangularToCubeGenerator.ts#L18)

Equirectangular(2D) 텍스처를 CubeMap으로 변환하는 클래스입니다.


## Constructors

### Constructor

> **new EquirectangularToCubeGenerator**(`redGPUContext`): `EquirectangularToCubeGenerator`

Defined in: [src/resources/texture/ibl/core/utils/EquirectangularToCubeGenerator.ts:32](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/ibl/core/utils/EquirectangularToCubeGenerator.ts#L32)

EquirectangularToCubeGenerator 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`EquirectangularToCubeGenerator`

## Methods

### generate()

> **generate**(`sourceTexture`, `size`): `Promise`\<[`IBLCubeTexture`](IBLCubeTexture.md)\>

Defined in: [src/resources/texture/ibl/core/utils/EquirectangularToCubeGenerator.ts:61](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/ibl/core/utils/EquirectangularToCubeGenerator.ts#L61)

2D Equirectangular 텍스처를 큐브맵으로 변환하여 반환합니다.


### Example
```typescript
const cubeMap = await redGPUContext.resourceManager.equirectangularToCubeGenerator.generate(hdrTexture, 1024);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sourceTexture` | `GPUTexture` | `undefined` | 소스 2D HDR 텍스처
| `size` | `number` | `512` | 생성될 큐브맵의 한 면 크기 (기본값: 512)

#### Returns

`Promise`\<[`IBLCubeTexture`](IBLCubeTexture.md)\>

생성된 IBLCubeTexture

