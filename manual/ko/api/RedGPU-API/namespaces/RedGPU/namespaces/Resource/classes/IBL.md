[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / IBL

# Class: IBL

Defined in: [src/resources/texture/ibl/IBL.ts:27](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/texture/ibl/IBL.ts#L27)

Image-Based Lighting (IBL)을 관리하는 클래스입니다.


HDR 또는 큐브맵 이미지를 기반으로 주변광(Ambient)과 반사광(Specular) 환경을 생성하여 보다 사실적인 렌더링을 가능하게 합니다.


* ### Example
```typescript
const ibl = new RedGPU.Resource.IBL(redGPUContext, 'path/to/environment.hdr');
view.ibl = ibl;
```

## Constructors

### Constructor

> **new IBL**(`redGPUContext`, `srcInfo`, `envCubeSize`, `iblCubeSize`): `IBL`

Defined in: [src/resources/texture/ibl/IBL.ts:55](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/texture/ibl/IBL.ts#L55)

IBL 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `srcInfo` | `string` \| \[`string`, `string`, `string`, `string`, `string`, `string`\] | `undefined` | 환경맵 소스 정보 (HDR URL 또는 6개 이미지 URL 배열)
| `envCubeSize` | `number` | `1024` | 환경맵 큐브 크기 (기본값: 1024)
| `iblCubeSize` | `number` | `512` | IBL 큐브 크기 (기본값: 512)

#### Returns

`IBL`

## Accessors

### envCubeSize

#### Get Signature

> **get** **envCubeSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:90](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/texture/ibl/IBL.ts#L90)

환경맵 큐브 크기

##### Returns

`number`

***

### environmentTexture

#### Get Signature

> **get** **environmentTexture**(): `IBLCubeTexture`

Defined in: [src/resources/texture/ibl/IBL.ts:105](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/texture/ibl/IBL.ts#L105)

환경맵 텍스처를 반환합니다.

##### Returns

`IBLCubeTexture`

***

### iblCubeSize

#### Get Signature

> **get** **iblCubeSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:95](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/texture/ibl/IBL.ts#L95)

IBL 큐브 크기

##### Returns

`number`

***

### iblTexture

#### Get Signature

> **get** **iblTexture**(): `IBLCubeTexture`

Defined in: [src/resources/texture/ibl/IBL.ts:110](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/texture/ibl/IBL.ts#L110)

IBL 텍스처를 반환합니다.

##### Returns

`IBLCubeTexture`

***

### irradianceTexture

#### Get Signature

> **get** **irradianceTexture**(): `IBLCubeTexture`

Defined in: [src/resources/texture/ibl/IBL.ts:100](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/resources/texture/ibl/IBL.ts#L100)

Irradiance 텍스처를 반환합니다.

##### Returns

`IBLCubeTexture`
