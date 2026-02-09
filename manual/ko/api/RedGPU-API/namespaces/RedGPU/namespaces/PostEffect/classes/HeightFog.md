[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / HeightFog

# Class: HeightFog

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:31](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L31)

높이 기반 안개(Height Fog) 후처리 이펙트입니다.


안개 타입, 밀도, 시작 높이, 두께, 감쇠율, 색상 등 다양한 파라미터를 지원합니다.

* ### Example
```typescript
const effect = new RedGPU.PostEffect.HeightFog(redGPUContext);
effect.fogType = RedGPU.PostEffect.HeightFog.EXPONENTIAL_SQUARED;
effect.density = 0.5;
effect.baseHeight = 10.0;
effect.thickness = 80.0;
effect.falloff = 0.2;
effect.fogColor.setRGB(180, 200, 255);
view.postEffectManager.addEffect(effect);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/postEffect/fog/heightFog/"></iframe>

## Extends

- [`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors

### Constructor

> **new HeightFog**(`redGPUContext`): `HeightFog`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:86](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L86)

HeightFog 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`HeightFog`

#### Overrides

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Properties

### EXPONENTIAL

> `static` **EXPONENTIAL**: `number` = `0`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:36](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L36)

지수 안개 타입


***

### EXPONENTIAL\_SQUARED

> `static` **EXPONENTIAL\_SQUARED**: `number` = `1`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:41](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L41)

지수제곱 안개 타입


## Accessors

### baseHeight

#### Get Signature

> **get** **baseHeight**(): `number`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:153](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L153)

안개 시작 높이를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **baseHeight**(`value`): `void`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:161](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L161)

안개 시작 높이를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### density

#### Get Signature

> **get** **density**(): `number`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:127](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L127)

안개 밀도를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **density**(`value`): `void`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:135](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L135)

안개 밀도를 설정합니다. (0 ~ 5)


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### falloff

#### Get Signature

> **get** **falloff**(): `number`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:200](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L200)

높이별 감쇠율을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **falloff**(`value`): `void`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:208](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L208)

높이별 감쇠율을 설정합니다. (0.001 ~ 2)


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### fogColor

#### Get Signature

> **get** **fogColor**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:145](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L145)

안개 색상을 반환합니다.


##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

***

### fogType

#### Get Signature

> **get** **fogType**(): `number`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:109](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L109)

안개 타입을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **fogType**(`value`): `void`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:117](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L117)

안개 타입을 설정합니다. (0 또는 1)


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxHeight

#### Get Signature

> **get** **maxHeight**(): `number`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:173](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L173)

안개 최대 높이를 반환합니다. (baseHeight + thickness)


##### Returns

`number`

***

### outputTextureView

#### Get Signature

> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:203](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L203)

출력 텍스처 뷰를 반환합니다.


##### Returns

`GPUTextureView`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:117](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L117)

RedGPU 컨텍스트를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:133](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L133)

셰이더 정보를 반환합니다. (MSAA 상태에 따라 다름)


##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L125)

스토리지 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

***

### systemUuniformsInfo

#### Get Signature

> **get** **systemUuniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:159](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L159)

시스템 유니폼 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUuniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#systemuuniformsinfo)

***

### thickness

#### Get Signature

> **get** **thickness**(): `number`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:181](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L181)

안개 레이어 두께를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **thickness**(`value`): `void`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:189](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L189)

안개 레이어 두께를 설정합니다. (최소 0.1)


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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:143](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L143)

유니폼 버퍼를 반환합니다.


##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:151](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L151)

유니폼 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

***

### useDepthTexture

#### Get Signature

> **get** **useDepthTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L101)

깊이 텍스처 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **useDepthTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:109](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L109)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:77](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L77)

G-Buffer Normal 텍스처 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **useGBufferNormalTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:85](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L85)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L93)

비디오 메모리 사용량을 반환합니다.


##### Returns

`number`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:167](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L167)

Workgroup Size X


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_X**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:171](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L171)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:179](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L179)

Workgroup Size Y


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Y**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:183](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L183)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:191](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L191)

Workgroup Size Z


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Z**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:195](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Z`](../namespaces/Core/classes/ASinglePassPostEffect.md#work_size_z)

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:211](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L211)

이펙트를 초기화(해제)합니다.


#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

### execute()

> **execute**(`view`, `gpuDevice`, `width`, `height`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:289](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L289)

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

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L236)

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

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): `ASinglePassPostEffectResult`

Defined in: [src/postEffect/effects/fog/heightFog/HeightFog.ts:234](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/effects/fog/heightFog/HeightFog.ts#L234)

안개 효과를 렌더링합니다.


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

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`render`](../namespaces/Core/classes/ASinglePassPostEffect.md#render)

***

### update()

> **update**(`deltaTime`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:352](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L352)

이펙트 상태를 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 델타 타임

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../namespaces/Core/classes/ASinglePassPostEffect.md).[`update`](../namespaces/Core/classes/ASinglePassPostEffect.md#update)

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:366](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/postEffect/core/ASinglePassPostEffect.ts#L366)

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
