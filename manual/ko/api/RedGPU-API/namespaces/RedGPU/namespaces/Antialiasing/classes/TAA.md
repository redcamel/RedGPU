[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / TAA

# Class: TAA

Defined in: [src/antialiasing/taa/TAA.ts:35](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/antialiasing/taa/TAA.ts#L35)

TAA(Temporal Anti-Aliasing) 후처리 이펙트입니다.


이전 프레임들의 정보를 누적하여 현재 프레임의 계단 현상을 제거하는 고품질 안티앨리어싱 기법입니다.


::: warning
이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.

:::

* ### Example
```typescript
// AntialiasingManager를 통해 TAA 설정 (Configure TAA via AntialiasingManager)
redGPUContext.antialiasingManager.useTAA = true;
```

## Constructors

### Constructor

> **new TAA**(`redGPUContext`): `TAA`

Defined in: [src/antialiasing/taa/TAA.ts:82](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/antialiasing/taa/TAA.ts#L82)

TAA 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`TAA`

## Accessors

### frameIndex

#### Get Signature

> **get** **frameIndex**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:117](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/antialiasing/taa/TAA.ts#L117)

프레임 인덱스를 반환합니다.


##### Returns

`number`

현재 프레임 인덱스


***

### jitterStrength

#### Get Signature

> **get** **jitterStrength**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:141](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/antialiasing/taa/TAA.ts#L141)

지터링 강도를 반환합니다.


##### Returns

`number`

지터링 강도


#### Set Signature

> **set** **jitterStrength**(`value`): `void`

Defined in: [src/antialiasing/taa/TAA.ts:153](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/antialiasing/taa/TAA.ts#L153)

지터링 강도를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 지터링 강도 (0.0 ~ 1.0)

##### Returns

`void`

***

### prevNoneJitterProjectionCameraMatrix

#### Get Signature

> **get** **prevNoneJitterProjectionCameraMatrix**(): [`mat4`](../../../type-aliases/mat4.md)

Defined in: [src/antialiasing/taa/TAA.ts:105](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/antialiasing/taa/TAA.ts#L105)

이전 프레임의 지터링 없는 프로젝션 카메라 행렬을 반환합니다.


##### Returns

[`mat4`](../../../type-aliases/mat4.md)

4x4 행렬


***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:129](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/antialiasing/taa/TAA.ts#L129)

비디오 메모리 사용량을 반환합니다.


##### Returns

`number`

메모리 사용량 (바이트)


## Methods

### clear()

> **clear**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:229](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/antialiasing/taa/TAA.ts#L229)

TAA 리소스를 초기화합니다.


#### Returns

`void`

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): `ASinglePassPostEffectResult`

Defined in: [src/antialiasing/taa/TAA.ts:179](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/antialiasing/taa/TAA.ts#L179)

TAA 이펙트를 렌더링합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D 인스턴스
| `width` | `number` | 너비
| `height` | `number` | 높이
| `sourceTextureInfo` | `ASinglePassPostEffectResult` | 소스 텍스처 정보

#### Returns

`ASinglePassPostEffectResult`

렌더링 결과 (텍스처 및 뷰)


***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/antialiasing/taa/TAA.ts:257](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/antialiasing/taa/TAA.ts#L257)

유니폼 값을 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 키
| `value` | `number` \| `boolean` \| `number`[] | 유니폼 값

#### Returns

`void`
