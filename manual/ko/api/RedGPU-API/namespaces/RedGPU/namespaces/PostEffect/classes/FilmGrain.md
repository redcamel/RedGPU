[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / FilmGrain

# Class: FilmGrain

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:55](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L55)

필름 그레인(Film Grain) 후처리 이펙트입니다.


다양한 프리셋과 강도, 색상, 스케일, 채도 등 세부 조절이 가능합니다.

* ### Example
```typescript
const effect = new RedGPU.PostEffect.FilmGrain(redGPUContext);
effect.filmGrainIntensity = 0.08;
effect.filmGrainScale = 5.0;
effect.coloredGrain = 0.7;
effect.applyPreset(RedGPU.PostEffect.FilmGrain.VINTAGE);
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/filmGrain/"></iframe>

## Extends

- [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors

### Constructor

> **new FilmGrain**(`redGPUContext`): `FilmGrain`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:117](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L117)

FilmGrain 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`FilmGrain`

#### Overrides

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Properties

### HEAVY

> `static` **HEAVY**: `object`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:70](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L70)

강한 그레인 프리셋


#### coloredGrain

> **coloredGrain**: `number` = `0.7`

#### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.12`

#### filmGrainResponse

> **filmGrainResponse**: `number` = `0.6`

#### filmGrainScale

> **filmGrainScale**: `number` = `4.0`

#### grainSaturation

> **grainSaturation**: `number` = `0.8`

***

### MEDIUM

> `static` **MEDIUM**: `object`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:65](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L65)

중간 강도 프리셋


#### coloredGrain

> **coloredGrain**: `number` = `0.5`

#### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.05`

#### filmGrainResponse

> **filmGrainResponse**: `number` = `0.8`

#### filmGrainScale

> **filmGrainScale**: `number` = `3.0`

#### grainSaturation

> **grainSaturation**: `number` = `0.6`

***

### SUBTLE

> `static` **SUBTLE**: `object`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:60](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L60)

미세한 그레인 프리셋


#### coloredGrain

> **coloredGrain**: `number` = `0.3`

#### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.02`

#### filmGrainResponse

> **filmGrainResponse**: `number` = `0.9`

#### filmGrainScale

> **filmGrainScale**: `number` = `2.5`

#### grainSaturation

> **grainSaturation**: `number` = `0.4`

***

### VINTAGE

> `static` **VINTAGE**: `object`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:75](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L75)

빈티지 프리셋


#### coloredGrain

> **coloredGrain**: `number` = `0.9`

#### filmGrainIntensity

> **filmGrainIntensity**: `number` = `0.08`

#### filmGrainResponse

> **filmGrainResponse**: `number` = `0.7`

#### filmGrainScale

> **filmGrainScale**: `number` = `5.0`

#### grainSaturation

> **grainSaturation**: `number` = `1.0`

## Accessors

### coloredGrain

#### Get Signature

> **get** **coloredGrain**(): `number`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:183](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L183)

컬러 그레인 비율을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **coloredGrain**(`value`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:191](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L191)

컬러 그레인 비율을 설정합니다. (0 ~ 1)


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### filmGrainIntensity

#### Get Signature

> **get** **filmGrainIntensity**(): `number`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:132](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L132)

그레인 강도를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **filmGrainIntensity**(`value`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:140](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L140)

그레인 강도를 설정합니다. (0 ~ 1)


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### filmGrainResponse

#### Get Signature

> **get** **filmGrainResponse**(): `number`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:149](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L149)

밝기 반응도를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **filmGrainResponse**(`value`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:157](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L157)

밝기 반응도를 설정합니다. (0 ~ 2)


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### filmGrainScale

#### Get Signature

> **get** **filmGrainScale**(): `number`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:166](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L166)

그레인 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **filmGrainScale**(`value`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:174](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L174)

그레인 스케일을 설정합니다. (0.1 ~ 20)


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### grainSaturation

#### Get Signature

> **get** **grainSaturation**(): `number`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:200](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L200)

그레인 채도를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **grainSaturation**(`value`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:208](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L208)

그레인 채도를 설정합니다. (0 ~ 2)


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### outputTextureView

#### Get Signature

> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:203](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L203)

출력 텍스처 뷰를 반환합니다.


##### Returns

`GPUTextureView`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:117](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L117)

RedGPU 컨텍스트를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:133](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L133)

셰이더 정보를 반환합니다. (MSAA 상태에 따라 다름)


##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L125)

스토리지 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

***

### systemUuniformsInfo

#### Get Signature

> **get** **systemUuniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:159](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L159)

시스템 유니폼 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUuniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#systemuuniformsinfo)

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:143](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L143)

유니폼 버퍼를 반환합니다.


##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:151](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L151)

유니폼 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

***

### useDepthTexture

#### Get Signature

> **get** **useDepthTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L101)

깊이 텍스처 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **useDepthTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:109](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L109)

깊이 텍스처 사용 여부를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`useDepthTexture`](../namespaces/Core/classes/ASinglePassPostEffect.md#usedepthtexture)

***

### useGBufferNormalTexture

#### Get Signature

> **get** **useGBufferNormalTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:77](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L77)

G-Buffer Normal 텍스처 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **useGBufferNormalTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:85](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L85)

G-Buffer Normal 텍스처 사용 여부를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`useGBufferNormalTexture`](../namespaces/Core/classes/ASinglePassPostEffect.md#usegbuffernormaltexture)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L93)

비디오 메모리 사용량을 반환합니다.


##### Returns

`number`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:167](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L167)

Workgroup Size X


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_X**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:171](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L171)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_X`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_x)

***

### WORK\_SIZE\_Y

#### Get Signature

> **get** **WORK\_SIZE\_Y**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:179](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L179)

Workgroup Size Y


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Y**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:183](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L183)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Y`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_y)

***

### WORK\_SIZE\_Z

#### Get Signature

> **get** **WORK\_SIZE\_Z**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:191](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L191)

Workgroup Size Z


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Z**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:195](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_z)

## Methods

### applyPreset()

> **applyPreset**(`preset`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:221](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L221)

프리셋을 적용합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `preset` | \{ `coloredGrain`: `number`; `filmGrainIntensity`: `number`; `filmGrainResponse`: `number`; `filmGrainScale`: `number`; `grainSaturation`: `number`; \} \| \{ `coloredGrain`: `number`; `filmGrainIntensity`: `number`; `filmGrainResponse`: `number`; `filmGrainScale`: `number`; `grainSaturation`: `number`; \} \| \{ `coloredGrain`: `number`; `filmGrainIntensity`: `number`; `filmGrainResponse`: `number`; `filmGrainScale`: `number`; `grainSaturation`: `number`; \} \| \{ `coloredGrain`: `number`; `filmGrainIntensity`: `number`; `filmGrainResponse`: `number`; `filmGrainScale`: `number`; `grainSaturation`: `number`; \} | 적용할 프리셋 객체

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:211](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L211)

이펙트를 초기화(해제)합니다.


#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

### execute()

> **execute**(`view`, `gpuDevice`, `width`, `height`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:289](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L289)

이펙트를 실행합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D 인스턴스
| `gpuDevice` | `GPUDevice` | GPU 디바이스
| `width` | `number` | 너비
| `height` | `number` | 높이

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`execute`](../namespaces/Core/classes/ASinglePassPostEffect.md#execute)

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`, `bindGroupLayout?`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L236)

이펙트를 초기화합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트
| `name` | `string` | 이펙트 이름
| `computeCodes` | \{ `msaa`: `string`; `nonMsaa`: `string`; \} | MSAA 및 Non-MSAA용 컴퓨트 셰이더 코드
| `computeCodes.msaa` | `string` | - |
| `computeCodes.nonMsaa?` | `string` | - |
| `bindGroupLayout?` | `GPUBindGroupLayout` | 바인드 그룹 레이아웃 (선택)

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`init`](../namespaces/Core/classes/ASinglePassPostEffect.md#init)

***

### render()

> **render**(`view`, `width`, `height`, ...`sourceTextureInfo`): `ASinglePassPostEffectResult`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:322](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L322)

이펙트를 렌더링합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D 인스턴스
| `width` | `number` | 너비
| `height` | `number` | 높이
| ...`sourceTextureInfo` | `ASinglePassPostEffectResult`[] | 소스 텍스처 정보 리스트

#### Returns

`ASinglePassPostEffectResult`

렌더링 결과 (텍스처 및 뷰)


#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`render`](../namespaces/Core/classes/ASinglePassPostEffect.md#render)

***

### update()

> **update**(`deltaTime`): `void`

Defined in: [src/postEffect/effects/filmGrain/FilmGrain.ts:238](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/effects/filmGrain/FilmGrain.ts#L238)

시간을 업데이트합니다. (애니메이션용)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 델타 타임

#### Returns

`void`

#### Overrides

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`update`](../namespaces/Core/classes/ASinglePassPostEffect.md#update)

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:366](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/postEffect/core/ASinglePassPostEffect.ts#L366)

유니폼 값을 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 키
| `value` | `number` \| `boolean` \| `number`[] | 유니폼 값

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/ASinglePassPostEffect.md#updateuniform)
