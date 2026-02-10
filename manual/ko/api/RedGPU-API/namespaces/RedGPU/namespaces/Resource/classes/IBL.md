[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / IBL

# Class: IBL

Defined in: [src/resources/texture/ibl/IBL.ts:20](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L20)

Image-Based Lighting (IBL)을 관리하는 클래스입니다.


HDR 또는 큐브맵 이미지를 기반으로 주변광(Diffuse)과 반사광(Specular) 환경을 생성하여 사실적인 PBR 라이팅을 구현합니다.


### Example
```typescript
const ibl = new RedGPU.Resource.IBL(redGPUContext, 'path/to/environment.hdr');
view.ibl = ibl;
```

## Constructors

### Constructor

> **new IBL**(`redGPUContext`, `srcInfo`, `environmentSize?`, `prefilterSize?`, `irradianceSize?`): `IBL`

Defined in: [src/resources/texture/ibl/IBL.ts:57](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L57)

IBL 인스턴스를 생성합니다.


### Example
```typescript
const ibl = new RedGPU.Resource.IBL(redGPUContext, 'path/to/environment.hdr', 1024, 512, 64);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `srcInfo` | `string` \| \[`string`, `string`, `string`, `string`, `string`, `string`\] | `undefined` | 환경맵 소스 정보 (HDR URL 또는 6개 이미지 URL 배열)
| `environmentSize` | `number` | `1024` | 환경맵 큐브 크기 (기본값: 1024)
| `prefilterSize` | `number` | `512` | Prefilter 큐브 크기 (기본값: 512)
| `irradianceSize` | `number` | `64` | Irradiance 큐브 크기 (기본값: 64)

#### Returns

`IBL`

## Accessors

### environmentSize

#### Get Signature

> **get** **environmentSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:114](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L114)

환경맵 큐브 크기

##### Returns

`number`

***

### environmentTexture

#### Get Signature

> **get** **environmentTexture**(): [`IBLCubeTexture`](../namespaces/CoreIBL/classes/IBLCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:122](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L122)

환경맵 텍스처를 반환합니다.

##### Returns

[`IBLCubeTexture`](../namespaces/CoreIBL/classes/IBLCubeTexture.md)

***

### irradianceSize

#### Get Signature

> **get** **irradianceSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:118](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L118)

Irradiance 큐브 크기

##### Returns

`number`

***

### irradianceTexture

#### Get Signature

> **get** **irradianceTexture**(): [`IBLCubeTexture`](../namespaces/CoreIBL/classes/IBLCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:120](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L120)

Irradiance 텍스처를 반환합니다.

##### Returns

[`IBLCubeTexture`](../namespaces/CoreIBL/classes/IBLCubeTexture.md)

***

### prefilterSize

#### Get Signature

> **get** **prefilterSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:116](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L116)

Prefilter 큐브 크기

##### Returns

`number`

***

### prefilterTexture

#### Get Signature

> **get** **prefilterTexture**(): [`IBLCubeTexture`](../namespaces/CoreIBL/classes/IBLCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:124](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L124)

IBL (Specular Prefilter) 텍스처를 반환합니다.

##### Returns

[`IBLCubeTexture`](../namespaces/CoreIBL/classes/IBLCubeTexture.md)
