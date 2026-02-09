[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / Geometry

# Class: Geometry

Defined in: [src/geometry/Geometry.ts:24](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/geometry/Geometry.ts#L24)

정점 버퍼(VertexBuffer)와 인덱스 버퍼(IndexBuffer)를 관리하며, GPU 렌더링에 필요한 정보를 제공하는 클래스입니다.


정점 데이터와 인덱스 데이터를 결합하여 하나의 지오메트리 단위를 형성하며, GPU 파이프라인에 필요한 레이아웃 정보와 객체의 AABB(경계 상자) 정보를 캡슐화합니다.


* ### Example
```typescript
const geometry = new RedGPU.Geometry(redGPUContext, vertexBuffer, indexBuffer);
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
```

## Extends

- [`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md)

## Constructors

### Constructor

> **new Geometry**(`redGPUContext`, `vertexBuffer`, `indexBuffer?`): `Geometry`

Defined in: [src/geometry/Geometry.ts:60](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/geometry/Geometry.ts#L60)

Geometry 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `vertexBuffer` | [`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md) | 정점 버퍼
| `indexBuffer?` | [`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md) | 인덱스 버퍼 (선택)

#### Returns

`Geometry`

#### Overrides

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`constructor`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#constructor)

## Properties

### gpuRenderInfo

> **gpuRenderInfo**: [`GeometryGPURenderInfo`](../namespaces/Primitive/namespaces/Core/classes/GeometryGPURenderInfo.md)

Defined in: [src/geometry/Geometry.ts:29](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/geometry/Geometry.ts#L29)

GPU 파이프라인에 필요한 레이아웃 정보


## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L57)

캐시 키를 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L65)

캐시 키를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`cacheKey`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#cachekey)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#gpudevice)

***

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md)

Defined in: [src/geometry/Geometry.ts:87](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/geometry/Geometry.ts#L87)

인덱스 버퍼를 반환합니다.


##### Returns

[`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L81)

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L90)

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`name`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`uuid`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#uuid)

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md)

Defined in: [src/geometry/Geometry.ts:79](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/geometry/Geometry.ts#L79)

정점 버퍼를 반환합니다.


##### Returns

[`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md)

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../namespaces/Bound/classes/AABB.md)

Defined in: [src/geometry/Geometry.ts:99](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/geometry/Geometry.ts#L99)

정점 버퍼 기준 AABB(경계 상자) 정보를 반환합니다. 최초 접근 시 계산 후 캐싱됩니다.


##### Returns

[`AABB`](../namespaces/Bound/classes/AABB.md)

AABB 정보


## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L125)

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`__addDirtyPipelineListener`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L152)

등록된 더티 리스너들을 실행합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`__fireListenerList`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/resources/core/ResourceBase.ts#L137)

더티 파이프라인 리스너를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)
