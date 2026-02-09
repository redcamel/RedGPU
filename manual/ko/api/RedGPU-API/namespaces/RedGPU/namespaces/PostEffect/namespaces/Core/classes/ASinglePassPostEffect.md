[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / ASinglePassPostEffect

# Abstract Class: ASinglePassPostEffect

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:23](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L23)

단일 패스 후처리 이펙트 추상 클래스입니다.


한 번의 Compute 패스로 동작하는 후처리 이펙트의 기반 클래스입니다.


## Extended by

- [`BrightnessContrast`](../../../classes/BrightnessContrast.md)
- [`ColorBalance`](../../../classes/ColorBalance.md)
- [`ColorTemperatureTint`](../../../classes/ColorTemperatureTint.md)
- [`Grayscale`](../../../classes/Grayscale.md)
- [`HueSaturation`](../../../classes/HueSaturation.md)
- [`Invert`](../../../classes/Invert.md)
- [`Threshold`](../../../classes/Threshold.md)
- [`Vibrance`](../../../classes/Vibrance.md)
- [`BlurX`](../../../classes/BlurX.md)
- [`BlurY`](../../../classes/BlurY.md)
- [`DirectionalBlur`](../../../classes/DirectionalBlur.md)
- [`RadialBlur`](../../../classes/RadialBlur.md)
- [`ZoomBlur`](../../../classes/ZoomBlur.md)
- [`ChromaticAberration`](../../../classes/ChromaticAberration.md)
- [`LensDistortion`](../../../classes/LensDistortion.md)
- [`Vignetting`](../../../classes/Vignetting.md)
- [`Fog`](../../../classes/Fog.md)
- [`HeightFog`](../../../classes/HeightFog.md)
- [`FilmGrain`](../../../classes/FilmGrain.md)
- [`Convolution`](../../../classes/Convolution.md)
- [`FXAA`](../../../../Antialiasing/classes/FXAA.md)
- [`TAASharpen`](../../../../Antialiasing/classes/TAASharpen.md)
- [`AMultiPassPostEffect`](AMultiPassPostEffect.md)

## Constructors

### Constructor

> **new ASinglePassPostEffect**(`redGPUContext`): `ASinglePassPostEffect`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:68](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L68)

ASinglePassPostEffect 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`ASinglePassPostEffect`

## Accessors

### outputTextureView

#### Get Signature

> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:203](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L203)

출력 텍스처 뷰를 반환합니다.


##### Returns

`GPUTextureView`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:117](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L117)

RedGPU 컨텍스트를 반환합니다.


##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:133](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L133)

셰이더 정보를 반환합니다. (MSAA 상태에 따라 다름)


##### Returns

`any`

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L125)

스토리지 정보를 반환합니다.


##### Returns

`any`

***

### systemUuniformsInfo

#### Get Signature

> **get** **systemUuniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:159](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L159)

시스템 유니폼 정보를 반환합니다.


##### Returns

`any`

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:143](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L143)

유니폼 버퍼를 반환합니다.


##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:151](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L151)

유니폼 정보를 반환합니다.


##### Returns

`any`

***

### useDepthTexture

#### Get Signature

> **get** **useDepthTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L101)

깊이 텍스처 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **useDepthTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:109](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L109)

깊이 텍스처 사용 여부를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### useGBufferNormalTexture

#### Get Signature

> **get** **useGBufferNormalTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:77](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L77)

G-Buffer Normal 텍스처 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **useGBufferNormalTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:85](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L85)

G-Buffer Normal 텍스처 사용 여부를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L93)

비디오 메모리 사용량을 반환합니다.


##### Returns

`number`

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:167](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L167)

Workgroup Size X


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_X**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:171](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L171)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### WORK\_SIZE\_Y

#### Get Signature

> **get** **WORK\_SIZE\_Y**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:179](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L179)

Workgroup Size Y


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Y**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:183](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L183)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### WORK\_SIZE\_Z

#### Get Signature

> **get** **WORK\_SIZE\_Z**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:191](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L191)

Workgroup Size Z


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Z**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:195](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:211](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L211)

이펙트를 초기화(해제)합니다.


#### Returns

`void`

***

### execute()

> **execute**(`view`, `gpuDevice`, `width`, `height`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:289](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L289)

이펙트를 실행합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D 인스턴스
| `gpuDevice` | `GPUDevice` | GPU 디바이스
| `width` | `number` | 너비
| `height` | `number` | 높이

#### Returns

`void`

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`, `bindGroupLayout?`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L236)

이펙트를 초기화합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트
| `name` | `string` | 이펙트 이름
| `computeCodes` | \{ `msaa`: `string`; `nonMsaa`: `string`; \} | MSAA 및 Non-MSAA용 컴퓨트 셰이더 코드
| `computeCodes.msaa` | `string` | - |
| `computeCodes.nonMsaa?` | `string` | - |
| `bindGroupLayout?` | `GPUBindGroupLayout` | 바인드 그룹 레이아웃 (선택)

#### Returns

`void`

***

### render()

> **render**(`view`, `width`, `height`, ...`sourceTextureInfo`): `ASinglePassPostEffectResult`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:322](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L322)

이펙트를 렌더링합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D 인스턴스
| `width` | `number` | 너비
| `height` | `number` | 높이
| ...`sourceTextureInfo` | `ASinglePassPostEffectResult`[] | 소스 텍스처 정보 리스트

#### Returns

`ASinglePassPostEffectResult`

렌더링 결과 (텍스처 및 뷰)


***

### update()

> **update**(`deltaTime`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:352](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L352)

이펙트 상태를 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 델타 타임

#### Returns

`void`

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:366](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L366)

유니폼 값을 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 키
| `value` | `number` \| `boolean` \| `number`[] | 유니폼 값

#### Returns

`void`
