[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexBuffer

# Class: VertexBuffer

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L19)

정점(Vertex) 버퍼를 관리하는 클래스입니다.


* ### Example
```typescript
const vertexBuffer = new RedGPU.Resource.VertexBuffer(redGPUContext, data, interleavedStruct);
```

## Extends

- [`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md)

## Constructors

### Constructor

> **new VertexBuffer**(`redGPUContext`, `data`, `interleavedStruct`, `usage`, `cacheKey`): `VertexBuffer`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:71](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L71)

VertexBuffer 인스턴스를 생성합니다.


* ### Example
```typescript
const vertexBuffer = new RedGPU.Resource.VertexBuffer(redGPUContext, data, interleavedStruct, GPUBufferUsage.VERTEX);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `data` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | `undefined` | 버텍스 데이터 (`Array<number>` 또는 `Float32Array`)
| `interleavedStruct` | [`VertexInterleavedStruct`](VertexInterleavedStruct.md) | `undefined` | 버텍스 데이터 구조 정의
| `usage` | `number` | `...` | GPUBufferUsageFlags (기본값: `VERTEX | COPY_DST | STORAGE`)
| `cacheKey` | `string` | `''` | 버퍼 캐시 키 (선택)

#### Returns

`VertexBuffer`

#### Overrides

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`constructor`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#constructor)

## Properties

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L23)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`[GPU_BUFFER_CACHE_KEY]`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpu_buffer_cache_key)

***

### \[GPU\_BUFFER\_DATA\_SYMBOL\]

> **\[GPU\_BUFFER\_DATA\_SYMBOL\]**: `Float32Array`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L24)

버텍스 데이터가 저장되는 내부 버퍼입니다.


***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L22)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`[GPU_BUFFER_SYMBOL]`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpu_buffer_symbol)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L52)

캐시 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`cacheKey`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#cachekey)

***

### data

#### Get Signature

> **get** **data**(): `Float32Array`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:101](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L101)

버텍스 데이터를 반환합니다.


##### Returns

`Float32Array`

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L60)

GPUBuffer 객체를 반환합니다.


##### Returns

`GPUBuffer`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`gpuBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpubuffer)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`gpuDevice`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpudevice)

***

### interleavedStruct

#### Get Signature

> **get** **interleavedStruct**(): [`VertexInterleavedStruct`](VertexInterleavedStruct.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:117](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L117)

버텍스 데이터 구조를 반환합니다.


##### Returns

[`VertexInterleavedStruct`](VertexInterleavedStruct.md)

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

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`name`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`redGPUContext`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`resourceManagerKey`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#resourcemanagerkey)

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:76](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L76)

버퍼의 크기(byte)를 반환합니다.


##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`size`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#size)

***

### stride

#### Get Signature

> **get** **stride**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:109](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L109)

stride(버텍스 당 바이트 수)를 반환합니다.


##### Returns

`number`

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ManagementResourceBase.ts#L45)

리소스의 관리 상태 정보를 반환합니다.


##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`targetResourceManagedState`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#targetresourcemanagedstate)

***

### triangleCount

#### Get Signature

> **get** **triangleCount**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:133](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L133)

삼각형 개수를 반환합니다.


##### Returns

`number`

***

### usage

#### Get Signature

> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:68](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L68)

GPUBufferUsageFlags를 반환합니다.


##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`usage`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#usage)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`uuid`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#uuid)

***

### vertexCount

#### Get Signature

> **get** **vertexCount**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:125](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L125)

버텍스 개수를 반환합니다.


##### Returns

`number`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L84)

비디오 메모리 사용량(byte)을 반환합니다.


##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`videoMemorySize`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#videomemorysize)

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

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`__addDirtyPipelineListener`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#__adddirtypipelinelistener)

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

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`__fireListenerList`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#__firelistenerlist)

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

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`__removeDirtyPipelineListener`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#__removedirtypipelinelistener)

***

### changeData()

> **changeData**(`data`, `interleavedStruct?`): `void`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:153](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L153)

버텍스 버퍼의 데이터를 변경합니다.


* ### Example
```typescript
vertexBuffer.changeData(newData);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | 새로운 버텍스 데이터 (`Array<number>` 또는 `Float32Array`)
| `interleavedStruct?` | [`VertexInterleavedStruct`](VertexInterleavedStruct.md) | 버텍스 데이터 구조 정의 (선택)

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/core/ABaseBuffer.ts#L92)

리소스를 파괴합니다.


#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`destroy`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#destroy)

***

### updateAllData()

> **updateAllData**(`data`): `void`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:216](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L216)

버텍스 버퍼의 전체 데이터를 GPU에 다시 업로드합니다.


* ### Example
```typescript
vertexBuffer.updateAllData(fullData);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | 새로운 버텍스 데이터 (`Array<number>` 또는 `Float32Array`)

#### Returns

`void`

***

### updateData()

> **updateData**(`data`, `offset`): `void`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:197](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L197)

버텍스 버퍼의 일부 데이터를 오프셋부터 업데이트합니다.


* ### Example
```typescript
vertexBuffer.updateData(partialData, 1024);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | `undefined` | 새로운 버텍스 데이터 (`Array<number>` 또는 `Float32Array`)
| `offset` | `number` | `0` | 업데이트 시작 오프셋 (기본값: 0)

#### Returns

`void`
