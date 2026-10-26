[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / Geometry

# Class: Geometry

Defined in: [src/geometry/Geometry.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/geometry/Geometry.ts#L21)

정점 버퍼(`VertexBuffer`)와 인덱스 버퍼(`IndexBuffer`)를 결합하여 GPU 렌더링 레이아웃 및 AABB 경계 상자 정보를 관리하는 지오메트리 클래스입니다.

***

### Example
```typescript
const geometry = new RedGPU.Geometry(redGPUContext, vertexBuffer, indexBuffer);
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
```

## Extends

- [`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md)

## Constructors



***

### Constructor

> **new Geometry**(`redGPUContext`, `vertexBuffer`, `indexBuffer?`): `Geometry`

Defined in: [src/geometry/Geometry.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/geometry/Geometry.ts#L45)

Geometry 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `vertexBuffer` | [`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md) | 정점 버퍼 |
| `indexBuffer?` | [`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md) | 인덱스 버퍼 (선택) |

#### Returns

`Geometry`

#### Overrides

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`constructor`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#constructor)

## Properties



***

### gpuRenderInfo

> **gpuRenderInfo**: [`GeometryGPURenderInfo`](../namespaces/Primitive/namespaces/Core/classes/GeometryGPURenderInfo.md)

Defined in: [src/geometry/Geometry.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/geometry/Geometry.ts#L26)

GPU 파이프라인 구성에 필요한 정점 버퍼 레이아웃 정보

## Accessors



***

### indexBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indexBuffer**(): [`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md)

Defined in: [src/geometry/Geometry.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/geometry/Geometry.ts#L80)

인덱스 버퍼를 반환합니다.

##### Returns

[`IndexBuffer`](../namespaces/Resource/classes/IndexBuffer.md)

인덱스 버퍼 인스턴스

***

***

### vertexBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexBuffer**(): [`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md)

Defined in: [src/geometry/Geometry.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/geometry/Geometry.ts#L68)

정점 버퍼를 반환합니다.

##### Returns

[`VertexBuffer`](../namespaces/Resource/classes/VertexBuffer.md)

정점 버퍼 인스턴스

***

***

### volume

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **volume**(): [`AABB`](../namespaces/Bound/classes/AABB.md)

Defined in: [src/geometry/Geometry.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/geometry/Geometry.ts#L92)

정점 버퍼 기준 AABB(축 정렬 경계 상자) 정보를 반환합니다. 최초 접근 시 계산 후 캐싱됩니다.

##### Returns

[`AABB`](../namespaces/Bound/classes/AABB.md)

계산된 AABB 인스턴스

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/geometry/Geometry.ts:103](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/geometry/Geometry.ts#L103)

Geometry 인스턴스를 파기하고 할당된 정점 및 인덱스 GPU 버퍼를 해제합니다.

#### Returns

`void`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`antialiasingManager`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#antialiasingmanager)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L61)

캐시 키를 반환하거나 설정합니다.

##### Returns

`string`

캐시 키 문자열

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`cacheKey`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#cachekey)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`commandEncoderManager`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L89)

연관된 GPUDevice를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`instanceId`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`name`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L77)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

리소스 매니저 키 문자열

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L49)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

리소스 리비전 번호

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`revision`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#revision)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`uuid`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#uuid)

***

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L102)

리소스 변경 시 호출될 파이프라인 더티 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 등록할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`__addDirtyPipelineListener`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L115)

등록된 파이프라인 더티 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L131)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | 알림 실행 후 리스너 목록 초기화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md).[`notifyUpdate`](../namespaces/Resource/namespaces/Core/classes/ResourceBase.md#notifyupdate)

</details>
