[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Primitive](../README.md) / TorusKnot

# Class: TorusKnot

Defined in: [src/primitive/TorusKnot.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/TorusKnot.ts#L22)

TorusKnot(매듭 토러스) 기본 도형 클래스입니다.

***

### Example
```typescript
// p=2, q=3 매듭 토러스 생성
const torusKnot = new RedGPU.Primitive.TorusKnot(redGPUContext, 1, 0.4, 128, 16, 2, 3);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/primitive/torusKnot/" style="width:100%; height:500px;"></iframe>

## See

- [TorusKnot Basic Example](https://redcamel.github.io/RedGPU/examples/3d/primitive/torusKnot/)
 - [Primitives Overview Example](https://redcamel.github.io/RedGPU/examples/3d/primitive/primitives/)

## Extends

- [`Primitive`](../namespaces/Core/classes/Primitive.md)

## Constructors



***

### Constructor

> **new TorusKnot**(`redGPUContext`, `radius?`, `tubeRadius?`, `tubularSegments?`, `radialSegments?`, `windingsAroundAxis?`, `windingsAroundCircle?`): `TorusKnot`

Defined in: [src/primitive/TorusKnot.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/TorusKnot.ts#L54)

TorusKnot 인스턴스를 생성합니다.

#### Example
```typescript
const torusKnot = new RedGPU.Primitive.TorusKnot(redGPUContext, 1, 0.4, 64, 8, 2, 3);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `radius?` | `number` | `1` | 전체 반지름 (기본값: 1) |
| `tubeRadius?` | `number` | `0.4` | 튜브 단면 반지름 (기본값: 0.4) |
| `tubularSegments?` | `number` | `64` | 둘레 방향 세그먼트 수 (기본값: 64, 최소: 3) |
| `radialSegments?` | `number` | `8` | 단면 방향 세그먼트 수 (기본값: 8, 최소: 3) |
| `windingsAroundAxis?` | `number` | `2` | 중심축 기준 회전 횟수 p (기본값: 2) |
| `windingsAroundCircle?` | `number` | `3` | 토러스 내부 원 기준 회전 횟수 q (기본값: 3) |

#### Returns

`TorusKnot`

#### Overrides

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`constructor`](../namespaces/Core/classes/Primitive.md#constructor)

## Accessors



## Methods



***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`antialiasingManager`](../namespaces/Core/classes/Primitive.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`commandEncoderManager`](../namespaces/Core/classes/Primitive.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuDevice`](../namespaces/Core/classes/Primitive.md#gpudevice)

***

***

### gpuRenderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuRenderInfo**(): `object`

Defined in: [src/primitive/core/Primitive.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L83)

GPU 렌더링 파이프라인 구성에 필요한 버퍼 레이아웃 정보를 반환합니다.

##### Returns

`object`

GPU 정점 버퍼 레이아웃 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | [src/primitive/core/Primitive.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L83) |

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`gpuRenderInfo`](../namespaces/Core/classes/Primitive.md#gpurenderinfo)

***

***

### indexBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indexBuffer**(): [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:107](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L107)

인덱스 버퍼를 반환합니다.

##### Returns

[`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

`IndexBuffer` 인스턴스

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`indexBuffer`](../namespaces/Core/classes/Primitive.md#indexbuffer)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`instanceId`](../namespaces/Core/classes/Primitive.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`name`](../namespaces/Core/classes/Primitive.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`redGPUContext`](../namespaces/Core/classes/Primitive.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`resourceManager`](../namespaces/Core/classes/Primitive.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`uuid`](../namespaces/Core/classes/Primitive.md#uuid)

***

***

### vertexBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexBuffer**(): [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

Defined in: [src/primitive/core/Primitive.ts:95](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L95)

정점 버퍼를 반환합니다.

##### Returns

[`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

`VertexBuffer` 인스턴스

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`vertexBuffer`](../namespaces/Core/classes/Primitive.md#vertexbuffer)

***

***

### volume

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **volume**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/primitive/core/Primitive.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L119)

정점 데이터를 기반으로 계산된 로컬 축 정렬 바운딩 박스(AABB)를 반환합니다.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

`AABB` 인스턴스

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`volume`](../namespaces/Core/classes/Primitive.md#volume)

***

***

### primitiveInterleaveStruct

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **primitiveInterleaveStruct**(): [`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

Defined in: [src/primitive/core/Primitive.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L71)

기본 도형에서 공통으로 사용하는 정점 인터리브 구조체를 반환합니다.

##### Returns

[`VertexInterleavedStruct`](../../Resource/classes/VertexInterleavedStruct.md)

정점 인터리브 구조체 (`VertexInterleavedStruct`)

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`primitiveInterleaveStruct`](../namespaces/Core/classes/Primitive.md#primitiveinterleavestruct)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### generateUniqueKey()

> `static` **generateUniqueKey**(`name`, `params`): `string`

Defined in: [src/primitive/core/Primitive.ts:138](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/Primitive.ts#L138)

도형 이름과 생성 파라미터 조합으로부터 캐싱용 고유 키 문자열을 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 기본 도형 타입 이름 |
| `params` | `Record`\<`string`, `any`\> | 도형 생성 파라미터 객체 (`Record<string, any>`) |

#### Returns

`string`

생성된 고유 키 문자열

#### Inherited from

[`Primitive`](../namespaces/Core/classes/Primitive.md).[`generateUniqueKey`](../namespaces/Core/classes/Primitive.md#generateuniquekey)

</details>
