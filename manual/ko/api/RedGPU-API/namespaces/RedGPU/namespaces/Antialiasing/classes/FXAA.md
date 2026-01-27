[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / FXAA

# Class: FXAA

Defined in: [src/antialiasing/fxaa/FXAA.ts:26](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/antialiasing/fxaa/FXAA.ts#L26)

FXAA(Fast Approximate Anti-Aliasing) 후처리 이펙트입니다.


화면의 픽셀 정보를 분석하여 엣지 부분을 부드럽게 처리하는 저비용 안티앨리어싱 기법입니다.


::: warning
이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.

:::

* ### Example
```typescript
// AntialiasingManager를 통해 FXAA 설정 (Configure FXAA via AntialiasingManager)
redGPUContext.antialiasingManager.useFXAA = true;
```

## Extends

- [`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors

### Constructor

> **new FXAA**(`redGPUContext`): `FXAA`

Defined in: [src/antialiasing/fxaa/FXAA.ts:54](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/antialiasing/fxaa/FXAA.ts#L54)

FXAA 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`FXAA`

#### Overrides

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Accessors

### edgeThreshold

#### Get Signature

> **get** **edgeThreshold**(): `number`

Defined in: [src/antialiasing/fxaa/FXAA.ts:217](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/antialiasing/fxaa/FXAA.ts#L217)

엣지 임계값을 반환합니다.


##### Returns

`number`

엣지 임계값


#### Set Signature

> **set** **edgeThreshold**(`value`): `void`

Defined in: [src/antialiasing/fxaa/FXAA.ts:229](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/antialiasing/fxaa/FXAA.ts#L229)

엣지 임계값을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 엣지 임계값 (0.0001 ~ 0.25)

##### Returns

`void`

***

### edgeThresholdMin

#### Get Signature

> **get** **edgeThresholdMin**(): `number`

Defined in: [src/antialiasing/fxaa/FXAA.ts:243](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/antialiasing/fxaa/FXAA.ts#L243)

최소 엣지 임계값을 반환합니다.


##### Returns

`number`

최소 엣지 임계값


#### Set Signature

> **set** **edgeThresholdMin**(`value`): `void`

Defined in: [src/antialiasing/fxaa/FXAA.ts:255](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/antialiasing/fxaa/FXAA.ts#L255)

최소 엣지 임계값을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 최소 엣지 임계값 (0.00001 ~ 0.1)

##### Returns

`void`

***

### outputTextureView

#### Get Signature

> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:203](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L203)

출력 텍스처 뷰를 반환합니다.


##### Returns

`GPUTextureView`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:117](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L117)

RedGPU 컨텍스트를 반환합니다.


##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

***

### shaderInfo

#### Get Signature

> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:133](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L133)

셰이더 정보를 반환합니다. (MSAA 상태에 따라 다름)


##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

***

### storageInfo

#### Get Signature

> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:125](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L125)

스토리지 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

***

### subpix

#### Get Signature

> **get** **subpix**(): `number`

Defined in: [src/antialiasing/fxaa/FXAA.ts:191](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/antialiasing/fxaa/FXAA.ts#L191)

서브픽셀 품질 값을 반환합니다.


##### Returns

`number`

서브픽셀 품질


#### Set Signature

> **set** **subpix**(`value`): `void`

Defined in: [src/antialiasing/fxaa/FXAA.ts:203](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/antialiasing/fxaa/FXAA.ts#L203)

서브픽셀 품질 값을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 서브픽셀 품질 (0.0 ~ 1.0)

##### Returns

`void`

***

### systemUuniformsInfo

#### Get Signature

> **get** **systemUuniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:159](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L159)

시스템 유니폼 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUuniformsInfo`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#systemuuniformsinfo)

***

### uniformBuffer

#### Get Signature

> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:143](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L143)

유니폼 버퍼를 반환합니다.


##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

***

### uniformsInfo

#### Get Signature

> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:151](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L151)

유니폼 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

***

### useDepthTexture

#### Get Signature

> **get** **useDepthTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L101)

깊이 텍스처 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **useDepthTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:109](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L109)

깊이 텍스처 사용 여부를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`BrightnessContrast`](../../PostEffect/classes/BrightnessContrast.md).[`useDepthTexture`](../../PostEffect/classes/BrightnessContrast.md#usedepthtexture)

***

### useGBufferNormalTexture

#### Get Signature

> **get** **useGBufferNormalTexture**(): `boolean`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:77](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L77)

G-Buffer Normal 텍스처 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **useGBufferNormalTexture**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:85](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L85)

G-Buffer Normal 텍스처 사용 여부를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`BrightnessContrast`](../../PostEffect/classes/BrightnessContrast.md).[`useGBufferNormalTexture`](../../PostEffect/classes/BrightnessContrast.md#usegbuffernormaltexture)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L93)

비디오 메모리 사용량을 반환합니다.


##### Returns

`number`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

### WORK\_SIZE\_X

#### Get Signature

> **get** **WORK\_SIZE\_X**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:167](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L167)

Workgroup Size X


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_X**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:171](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L171)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`BrightnessContrast`](../../PostEffect/classes/BrightnessContrast.md).[`WORK_SIZE_X`](../../PostEffect/classes/BrightnessContrast.md#work_size_x)

***

### WORK\_SIZE\_Y

#### Get Signature

> **get** **WORK\_SIZE\_Y**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:179](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L179)

Workgroup Size Y


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Y**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:183](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L183)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`BrightnessContrast`](../../PostEffect/classes/BrightnessContrast.md).[`WORK_SIZE_Y`](../../PostEffect/classes/BrightnessContrast.md#work_size_y)

***

### WORK\_SIZE\_Z

#### Get Signature

> **get** **WORK\_SIZE\_Z**(): `number`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:191](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L191)

Workgroup Size Z


##### Returns

`number`

#### Set Signature

> **set** **WORK\_SIZE\_Z**(`value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:195](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`BrightnessContrast`](../../PostEffect/classes/BrightnessContrast.md).[`WORK_SIZE_Z`](../../PostEffect/classes/BrightnessContrast.md#work_size_z)

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:211](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L211)

이펙트를 초기화(해제)합니다.


#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

### execute()

> **execute**(`view`, `gpuDevice`, `width`, `height`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:289](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L289)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`execute`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#execute)

***

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`, `bindGroupLayout?`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L236)

이펙트를 초기화합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPU 컨텍스트
| `name` | `string` | 이펙트 이름
| `computeCodes` | \{ `msaa`: `string`; `nonMsaa`: `string`; \} | MSAA 및 Non-MSAA용 컴퓨트 셰이더 코드
| `computeCodes.msaa` | `string` | - |
| `computeCodes.nonMsaa?` | `string` | - |
| `bindGroupLayout?` | `GPUBindGroupLayout` | 바인드 그룹 레이아웃 (선택)

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`init`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#init)

***

### render()

> **render**(`view`, `width`, `height`, ...`sourceTextureInfo`): `ASinglePassPostEffectResult`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:322](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L322)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`render`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#render)

***

### update()

> **update**(`deltaTime`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:352](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L352)

이펙트 상태를 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 델타 타임

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`update`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#update)

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:366](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/postEffect/core/ASinglePassPostEffect.ts#L366)

유니폼 값을 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 키
| `value` | `number` \| `boolean` \| `number`[] | 유니폼 값

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`updateUniform`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#updateuniform)
