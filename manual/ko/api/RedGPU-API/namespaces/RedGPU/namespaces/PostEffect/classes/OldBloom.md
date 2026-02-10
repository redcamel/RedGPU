[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / OldBloom

# Class: OldBloom

Defined in: [src/postEffect/effects/oldBloom/OldBloom.ts:28](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/effects/oldBloom/OldBloom.ts#L28)

올드 블룸(Old Bloom) 후처리 이펙트입니다.


임계값, 가우시안 블러, 블렌드 단계를 거쳐 밝은 영역에 부드러운 빛 번짐 효과를 만듭니다.

* ### Example
```typescript
const effect = new RedGPU.PostEffect.OldBloom(redGPUContext);
effect.threshold = 180;        // 밝기 임계값
effect.gaussianBlurSize = 48;  // 블러 강도
effect.exposure = 1.2;         // 노출
effect.bloomStrength = 1.5;    // 블룸 강도
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/oldBloom/"></iframe>

## Extends

- [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

## Constructors

### Constructor

> **new OldBloom**(`redGPUContext`): `OldBloom`

Defined in: [src/postEffect/effects/oldBloom/OldBloom.ts:77](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/effects/oldBloom/OldBloom.ts#L77)

OldBloom 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`OldBloom`

#### Overrides

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`constructor`](../namespaces/Core/classes/AMultiPassPostEffect.md#constructor)

## Accessors

### bloomStrength

#### Get Signature

> **get** **bloomStrength**(): `number`

Defined in: [src/postEffect/effects/oldBloom/OldBloom.ts:150](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/effects/oldBloom/OldBloom.ts#L150)

블룸 강도를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **bloomStrength**(`value`): `void`

Defined in: [src/postEffect/effects/oldBloom/OldBloom.ts:158](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/effects/oldBloom/OldBloom.ts#L158)

블룸 강도를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### exposure

#### Get Signature

> **get** **exposure**(): `number`

Defined in: [src/postEffect/effects/oldBloom/OldBloom.ts:133](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/effects/oldBloom/OldBloom.ts#L133)

노출 값을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **exposure**(`value`): `void`

Defined in: [src/postEffect/effects/oldBloom/OldBloom.ts:141](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/effects/oldBloom/OldBloom.ts#L141)

노출 값을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### gaussianBlurSize

#### Get Signature

> **get** **gaussianBlurSize**(): `number`

Defined in: [src/postEffect/effects/oldBloom/OldBloom.ts:116](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/effects/oldBloom/OldBloom.ts#L116)

블러 강도를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **gaussianBlurSize**(`value`): `void`

Defined in: [src/postEffect/effects/oldBloom/OldBloom.ts:124](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/effects/oldBloom/OldBloom.ts#L124)

블러 강도를 설정합니다.


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:203](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L203)

출력 텍스처 뷰를 반환합니다.


##### Returns

`GPUTextureView`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/AMultiPassPostEffect.md#outputtextureview)

***

### passList

#### Get Signature

> **get** **passList**(): [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)[]

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:57](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/AMultiPassPostEffect.ts#L57)

내부 패스 리스트를 반환합니다.


##### Returns

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)[]

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`passList`](../namespaces/Core/classes/AMultiPassPostEffect.md#passlist)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:117](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L117)

RedGPU 컨텍스트를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/AMultiPassPostEffect.md#redgpucontext)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:133](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L133)

셰이더 정보를 반환합니다. (MSAA 상태에 따라 다름)


##### Returns

`any`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L125)

스토리지 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#storageinfo)

***

### systemUuniformsInfo

#### Get Signature

> **get** **systemUuniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:159](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L159)

시스템 유니폼 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`systemUuniformsInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#systemuuniformsinfo)

***

### threshold

#### Get Signature

> **get** **threshold**(): `number`

Defined in: [src/postEffect/effects/oldBloom/OldBloom.ts:99](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/effects/oldBloom/OldBloom.ts#L99)

밝기 임계값을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **threshold**(`value`): `void`

Defined in: [src/postEffect/effects/oldBloom/OldBloom.ts:107](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/effects/oldBloom/OldBloom.ts#L107)

밝기 임계값을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:143](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L143)

유니폼 버퍼를 반환합니다.


##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/AMultiPassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:151](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L151)

유니폼 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#uniformsinfo)

***

### useDepthTexture

#### Get Signature

> **get** **useDepthTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L101)

깊이 텍스처 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **useDepthTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:109](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L109)

깊이 텍스처 사용 여부를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`useDepthTexture`](../namespaces/Core/classes/AMultiPassPostEffect.md#usedepthtexture)

***

### useGBufferNormalTexture

#### Get Signature

> **get** **useGBufferNormalTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:77](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L77)

G-Buffer Normal 텍스처 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **useGBufferNormalTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:85](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L85)

G-Buffer Normal 텍스처 사용 여부를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`useGBufferNormalTexture`](../namespaces/Core/classes/AMultiPassPostEffect.md#usegbuffernormaltexture)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:48](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/AMultiPassPostEffect.ts#L48)

비디오 메모리 사용량을 반환합니다.


##### Returns

`number`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/AMultiPassPostEffect.md#videomemorysize)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:167](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L167)

Workgroup Size X


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_X**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:171](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L171)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_X`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_x)

***

### WORK\_SIZE\_Y

#### Get Signature

> **get** **WORK\_SIZE\_Y**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:179](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L179)

Workgroup Size Y


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Y**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:183](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L183)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_Y`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_y)

***

### WORK\_SIZE\_Z

#### Get Signature

> **get** **WORK\_SIZE\_Z**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:191](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L191)

Workgroup Size Z


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Z**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:195](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_z)

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:65](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/AMultiPassPostEffect.ts#L65)

모든 패스를 초기화합니다.


#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`clear`](../namespaces/Core/classes/AMultiPassPostEffect.md#clear)

***

### execute()

> **execute**(`view`, `gpuDevice`, `width`, `height`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:289](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L289)

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

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`execute`](../namespaces/Core/classes/AMultiPassPostEffect.md#execute)

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`, `bindGroupLayout?`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L236)

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

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`init`](../namespaces/Core/classes/AMultiPassPostEffect.md#init)

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): `ASinglePassPostEffectResult`

Defined in: [src/postEffect/effects/oldBloom/OldBloom.ts:183](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/effects/oldBloom/OldBloom.ts#L183)

올드 블룸 효과를 렌더링합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D 인스턴스
| `width` | `number` | 너비
| `height` | `number` | 높이
| `sourceTextureInfo` | `ASinglePassPostEffectResult` | 소스 텍스처 정보

#### Returns

`ASinglePassPostEffectResult`

렌더링 결과


#### Overrides

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`render`](../namespaces/Core/classes/AMultiPassPostEffect.md#render)

***

### update()

> **update**(`deltaTime`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:352](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L352)

이펙트 상태를 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 델타 타임

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`update`](../namespaces/Core/classes/AMultiPassPostEffect.md#update)

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:366](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/postEffect/core/ASinglePassPostEffect.ts#L366)

유니폼 값을 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 키
| `value` | `number` \| `boolean` \| `number`[] | 유니폼 값

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/AMultiPassPostEffect.md#updateuniform)
