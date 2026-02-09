[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / DOF

# Class: DOF

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:30](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L30)

피사계 심도(DOF, Depth of Field) 후처리 이펙트입니다.


CoC(혼란 원) 계산과 블러를 결합해 사실적인 심도 효과를 제공합니다.


다양한 사진/영상 스타일 프리셋 메서드를 지원합니다.

* ### Example
```typescript
const effect = new RedGPU.PostEffect.DOF(redGPUContext);
effect.focusDistance = 10;
effect.aperture = 2.0;
effect.maxCoC = 30;
effect.setCinematic(); // 시네마틱 프리셋 적용
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/lens/dof/"></iframe>

## Extends

- [`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md)

## Constructors

### Constructor

> **new DOF**(`redGPUContext`): `DOF`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:106](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L106)

DOF 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`DOF`

#### Overrides

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`constructor`](../namespaces/Core/classes/AMultiPassPostEffect.md#constructor)

## Accessors

### aperture

#### Get Signature

> **get** **aperture**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:151](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L151)

조리개 값을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **aperture**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:159](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L159)

조리개 값을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### farBlurSize

#### Get Signature

> **get** **farBlurSize**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:237](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L237)

원거리 블러 크기를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **farBlurSize**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:245](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L245)

원거리 블러 크기를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### farPlane

#### Get Signature

> **get** **farPlane**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:202](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L202)

원평면 값을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **farPlane**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:210](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L210)

원평면 값을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### farStrength

#### Get Signature

> **get** **farStrength**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:271](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L271)

원거리 블러 강도를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **farStrength**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:279](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L279)

원거리 블러 강도를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### focusDistance

#### Get Signature

> **get** **focusDistance**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:134](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L134)

초점 거리를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **focusDistance**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:142](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L142)

초점 거리를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxCoC

#### Get Signature

> **get** **maxCoC**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:168](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L168)

최대 CoC 값을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **maxCoC**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:176](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L176)

최대 CoC 값을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### nearBlurSize

#### Get Signature

> **get** **nearBlurSize**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:220](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L220)

근거리 블러 크기를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **nearBlurSize**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:228](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L228)

근거리 블러 크기를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### nearPlane

#### Get Signature

> **get** **nearPlane**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:185](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L185)

근평면 값을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **nearPlane**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:193](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L193)

근평면 값을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### nearStrength

#### Get Signature

> **get** **nearStrength**(): `number`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:254](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L254)

근거리 블러 강도를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **nearStrength**(`value`): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:262](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L262)

근거리 블러 강도를 설정합니다.


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:203](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L203)

출력 텍스처 뷰를 반환합니다.


##### Returns

`GPUTextureView`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/AMultiPassPostEffect.md#outputtextureview)

***

### passList

#### Get Signature

> **get** **passList**(): [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)[]

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:57](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/AMultiPassPostEffect.ts#L57)

내부 패스 리스트를 반환합니다.


##### Returns

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)[]

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`passList`](../namespaces/Core/classes/AMultiPassPostEffect.md#passlist)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:117](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L117)

RedGPU 컨텍스트를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/AMultiPassPostEffect.md#redgpucontext)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:133](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L133)

셰이더 정보를 반환합니다. (MSAA 상태에 따라 다름)


##### Returns

`any`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L125)

스토리지 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#storageinfo)

***

### systemUuniformsInfo

#### Get Signature

> **get** **systemUuniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:159](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L159)

시스템 유니폼 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`systemUuniformsInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#systemuuniformsinfo)

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:143](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L143)

유니폼 버퍼를 반환합니다.


##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/AMultiPassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:151](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L151)

유니폼 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/AMultiPassPostEffect.md#uniformsinfo)

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

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`useDepthTexture`](../namespaces/Core/classes/AMultiPassPostEffect.md#usedepthtexture)

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

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`useGBufferNormalTexture`](../namespaces/Core/classes/AMultiPassPostEffect.md#usegbuffernormaltexture)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:48](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/AMultiPassPostEffect.ts#L48)

비디오 메모리 사용량을 반환합니다.


##### Returns

`number`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/AMultiPassPostEffect.md#videomemorysize)

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

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_X`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_x)

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

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_Y`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_y)

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

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/AMultiPassPostEffect.md#work_size_z)

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:65](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/AMultiPassPostEffect.ts#L65)

모든 패스를 초기화합니다.


#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`clear`](../namespaces/Core/classes/AMultiPassPostEffect.md#clear)

***

### execute()

> **execute**(`view`, `gpuDevice`, `width`, `height`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:289](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L289)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/core/ASinglePassPostEffect.ts#L236)

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

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:402](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L402)

DOF 효과를 렌더링합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D 인스턴스
| `width` | `number` | 너비
| `height` | `number` | 높이
| `sourceTextureInfo` | `ASinglePassPostEffectResult` | 소스 텍스처 정보

#### Returns

`ASinglePassPostEffectResult`

최종 DOF 처리 결과


#### Overrides

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`render`](../namespaces/Core/classes/AMultiPassPostEffect.md#render)

***

### setCinematic()

> **setCinematic**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:302](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L302)

시네마틱 프리셋을 적용합니다. (강한 DOF, 영화같은 느낌)


#### Returns

`void`

***

### setGameDefault()

> **setGameDefault**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:288](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L288)

게임 기본 프리셋을 적용합니다. (균형잡힌 품질/성능)


#### Returns

`void`

***

### setLandscape()

> **setLandscape**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:330](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L330)

풍경 사진 프리셋을 적용합니다. (전체적으로 선명, 약간의 원거리 흐림)


#### Returns

`void`

***

### setMacro()

> **setMacro**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:344](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L344)

매크로 촬영 프리셋을 적용합니다. (극도로 얕은 심도)


#### Returns

`void`

***

### setNightMode()

> **setNightMode**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:372](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L372)

야간 촬영 프리셋을 적용합니다. (저조도 환경)


#### Returns

`void`

***

### setPortrait()

> **setPortrait**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:316](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L316)

인물 사진 프리셋을 적용합니다. (배경 흐림, 인물 포커스)


#### Returns

`void`

***

### setSports()

> **setSports**(): `void`

Defined in: [src/postEffect/effects/lens/dof/DOF.ts:358](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/postEffect/effects/lens/dof/DOF.ts#L358)

액션/스포츠 프리셋을 적용합니다. (빠른 움직임에 적합)


#### Returns

`void`

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

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`update`](../namespaces/Core/classes/AMultiPassPostEffect.md#update)

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

#### Inherited from

[`AMultiPassPostEffect`](../namespaces/Core/classes/AMultiPassPostEffect.md).[`updateUniform`](../namespaces/Core/classes/AMultiPassPostEffect.md#updateuniform)
