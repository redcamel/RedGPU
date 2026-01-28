[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreNoiseTexture](../README.md) / ANoiseTexture

# Abstract Class: ANoiseTexture

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:37](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L37)

**`Experimental`**

노이즈 텍스처의 기반이 되는 추상 클래스입니다.


이 클래스는 컴퓨트 셰이더를 사용하여 실시간으로 노이즈 패턴을 생성하는 기능을 제공합니다.


## Extends

- [`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md)

## Extended by

- [`SimplexTexture`](../../../classes/SimplexTexture.md)
- [`VoronoiTexture`](../../../classes/VoronoiTexture.md)

## Constructors

### Constructor

> **new ANoiseTexture**(`redGPUContext`, `width`, `height`, `define`): `ANoiseTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:68](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L68)

**`Experimental`**

ANoiseTexture 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `width` | `number` | `1024` | 텍스처 너비
| `height` | `number` | `1024` | 텍스처 높이
| `define` | `NoiseDefine` | `undefined` | 노이즈 정의 객체

#### Returns

`ANoiseTexture`

#### Overrides

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`constructor`](../../Core/classes/ManagementResourceBase.md#constructor)

## Properties

### mipLevelCount

> **mipLevelCount**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:38](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L38)

**`Experimental`**

***

### src

> **src**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:40](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L40)

**`Experimental`**

***

### useMipmap

> **useMipmap**: `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:39](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L39)

**`Experimental`**

## Accessors

### animationSpeed

#### Get Signature

> **get** **animationSpeed**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:99](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L99)

**`Experimental`**

애니메이션 속도를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationSpeed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:104](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L104)

**`Experimental`**

애니메이션 속도를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### animationX

#### Get Signature

> **get** **animationX**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:111](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L111)

**`Experimental`**

X축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationX**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:116](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L116)

**`Experimental`**

X축 애니메이션 값을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### animationY

#### Get Signature

> **get** **animationY**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:123](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L123)

**`Experimental`**

Y축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationY**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:128](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L128)

**`Experimental`**

Y축 애니메이션 값을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/core/ResourceBase.ts#L57)

**`Experimental`**

캐시 키를 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/core/ResourceBase.ts#L65)

**`Experimental`**

캐시 키를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ColorMaterial`](../../../../Material/classes/ColorMaterial.md).[`cacheKey`](../../../../Material/classes/ColorMaterial.md#cachekey)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/core/ResourceBase.ts#L106)

**`Experimental`**

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`gpuDevice`](../../Core/classes/ManagementResourceBase.md#gpudevice)

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:140](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L140)

**`Experimental`**

GPUTexture 객체를 반환합니다.

##### Returns

`GPUTexture`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/core/ResourceBase.ts#L81)

**`Experimental`**

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/core/ResourceBase.ts#L90)

**`Experimental`**

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`name`](../../Core/classes/ManagementResourceBase.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/core/ResourceBase.ts#L114)

**`Experimental`**

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`redGPUContext`](../../Core/classes/ManagementResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:94](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L94)

**`Experimental`**

리소스 매니저 키

##### Returns

`string`

#### Overrides

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../../Core/classes/ManagementResourceBase.md#resourcemanagerkey)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/core/ManagementResourceBase.ts#L45)

**`Experimental`**

리소스의 관리 상태 정보를 반환합니다.


##### Returns

[`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../../Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

***

### time

#### Get Signature

> **get** **time**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:145](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L145)

**`Experimental`**

현재 시간을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **time**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:150](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L150)

**`Experimental`**

현재 시간을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### uniformInfo

#### Get Signature

> **get** **uniformInfo**(): `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:135](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L135)

**`Experimental`**

유니폼 정보를 반환합니다.

##### Returns

`any`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/core/ResourceBase.ts#L98)

**`Experimental`**

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`uuid`](../../Core/classes/ManagementResourceBase.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:89](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L89)

**`Experimental`**

비디오 메모리 사용량(byte)

##### Returns

`number`

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/core/ResourceBase.ts#L125)

**`Experimental`**

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__addDirtyPipelineListener`](../../Core/classes/ManagementResourceBase.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/core/ResourceBase.ts#L152)

**`Experimental`**

등록된 더티 리스너들을 실행합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__fireListenerList`](../../Core/classes/ManagementResourceBase.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/core/ResourceBase.ts#L137)

**`Experimental`**

더티 파이프라인 리스너를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__removeDirtyPipelineListener`](../../Core/classes/ManagementResourceBase.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:183](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L183)

**`Experimental`**

리소스를 파괴합니다.

#### Returns

`void`

***

### render()

> **render**(`time`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:177](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L177)

**`Experimental`**

지정된 시간으로 노이즈를 렌더링합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `time` | `number` |

#### Returns

`void`

***

### updateUniform()

> **updateUniform**(`name`, `value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:157](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L157)

**`Experimental`**

개별 유니폼 파라미터를 업데이트합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `value` | `any` |

#### Returns

`void`

***

### updateUniforms()

> **updateUniforms**(`uniforms`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:166](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L166)

**`Experimental`**

여러 유니폼 파라미터를 일괄 업데이트합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `uniforms` | `Record`\<`string`, `any`\> |

#### Returns

`void`
