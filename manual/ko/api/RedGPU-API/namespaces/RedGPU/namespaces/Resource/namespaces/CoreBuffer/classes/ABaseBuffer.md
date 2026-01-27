[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreBuffer](../README.md) / ABaseBuffer

# Abstract Class: ABaseBuffer

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:21](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L21)

RedGPU에서 사용하는 모든 버퍼 리소스의 기본 추상 클래스입니다.


::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>상속을 통해 사용하십시오.

:::

## Extends

- [`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md)

## Extended by

- [`IndexBuffer`](../../../classes/IndexBuffer.md)
- [`VertexBuffer`](../../../classes/VertexBuffer.md)
- [`AUniformBaseBuffer`](AUniformBaseBuffer.md)

## Constructors

### Constructor

> `protected` **new ABaseBuffer**(`redGPUContext`, `managedStateKey`, `usage`): `ABaseBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:39](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L39)

ABaseBuffer 인스턴스를 초기화합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `managedStateKey` | `string` | 관리 상태 키
| `usage` | `number` | GPU 버퍼 사용 플래그

#### Returns

`ABaseBuffer`

#### Overrides

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`constructor`](../../Core/classes/ManagementResourceBase.md#constructor)

## Properties

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L23)

***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L22)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L52)

캐시 키를 반환합니다.


##### Returns

`string`

#### Overrides

[`ColorMaterial`](../../../../Material/classes/ColorMaterial.md).[`cacheKey`](../../../../Material/classes/ColorMaterial.md#cachekey)

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L60)

GPUBuffer 객체를 반환합니다.


##### Returns

`GPUBuffer`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`gpuDevice`](../../Core/classes/ManagementResourceBase.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L81)

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L90)

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../../CoreNoiseTexture/classes/ANoiseTexture.md).[`name`](../../CoreNoiseTexture/classes/ANoiseTexture.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`redGPUContext`](../../Core/classes/ManagementResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../../Core/classes/ManagementResourceBase.md#resourcemanagerkey)

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:76](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L76)

버퍼의 크기(byte)를 반환합니다.


##### Returns

`number`

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ManagementResourceBase.ts#L45)

리소스의 관리 상태 정보를 반환합니다.


##### Returns

[`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../../Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

***

### usage

#### Get Signature

> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:68](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L68)

GPUBufferUsageFlags를 반환합니다.


##### Returns

`number`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`uuid`](../../Core/classes/ManagementResourceBase.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L84)

비디오 메모리 사용량(byte)을 반환합니다.


##### Returns

`number`

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L125)

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

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L152)

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

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L137)

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

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L92)

리소스를 파괴합니다.


#### Returns

`void`
