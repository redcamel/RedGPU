[**RedGPU API v4.1.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / Geometry

# Class: Geometry

Defined in: [src/geometry/Geometry.ts:24](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/geometry/Geometry.ts#L24)

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

Defined in: [src/geometry/Geometry.ts:60](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/geometry/Geometry.ts#L60)

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

Defined in: [src/geometry/Geometry.ts:29](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/geometry/Geometry.ts#L29)

GPU 파이프라인에 필요한 레이아웃 정보

## Accessors

### indexBuffer

#### Get Signature

> **get** **indexBuffer**(): [`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md)

Defined in: [src/geometry/Geometry.ts:87](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/geometry/Geometry.ts#L87)

인덱스 버퍼를 반환합니다.

##### Returns

[`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md)

***

### vertexBuffer

#### Get Signature

> **get** **vertexBuffer**(): [`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md)

Defined in: [src/geometry/Geometry.ts:79](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/geometry/Geometry.ts#L79)

정점 버퍼를 반환합니다.

##### Returns

[`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md)

***

### volume

#### Get Signature

> **get** **volume**(): [`AABB`](../namespaces/Bound/classes/AABB.md)

Defined in: [src/geometry/Geometry.ts:99](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/geometry/Geometry.ts#L99)

정점 버퍼 기준 AABB(경계 상자) 정보를 반환합니다. 최초 접근 시 계산 후 캐싱됩니다.

##### Returns

[`AABB`](../namespaces/Bound/classes/AABB.md)

AABB 정보

## Methods


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`antialiasingManager`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#antialiasingmanager)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L53)

캐시 키를 반환합니다.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L61)

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

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`commandEncoderManager`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L77)

연관된 GPU 디바이스를 반환합니다.

##### Returns

`GPUDevice`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`name`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:69](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L69)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L45)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`revision`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#revision)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`uuid`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#uuid)

***

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L89)

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

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L101)

리소스 업데이트 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L116)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`notifyUpdate`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#notifyupdate)


</details>
