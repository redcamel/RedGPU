[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / Scene

# Class: Scene

Defined in: [src/display/scene/Scene.ts:26](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/scene/Scene.ts#L26)

View에서 렌더링할 장면(Scene) 공간을 정의하는 루트 컨테이너 클래스입니다.

조명(LightManager), 그림자(ShadowManager), 물리 엔진(physicsEngine) 및 배경색 설정을 관리하며, 씬 그래프 내의 모든 시각적 3D/2D 오브젝트들을 계층적으로 포함하고 렌더링 흐름의 루트 역할을 수행합니다. View3D 또는 View2D에 장착되어 사용됩니다.

### Example
```typescript
const scene = new RedGPU.Display.Scene();
scene.useBackgroundColor = true;
scene.backgroundColor.setColorByRGBA(25, 25, 25, 1);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/scene/" ></iframe>

## Extends

- [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

## Constructors

### Constructor

> **new Scene**(`name?`): `Scene`

Defined in: [src/display/scene/Scene.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/scene/Scene.ts#L64)

Scene 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name?` | `string` | Scene의 이름 (선택적)

#### Returns

`Scene`

#### Example

```typescript
const scene = new RedGPU.Display.Scene('MainScene');
```

#### Overrides

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`constructor`](../namespaces/CoreMesh/classes/Object3DContainer.md#constructor)

## Properties

### backgroundColor

#### Get Signature

> **get** **backgroundColor**(): [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/display/scene/Scene.ts:101](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/scene/Scene.ts#L101)

씬 배경색(ColorRGBA) 인스턴스를 가져오거나 설정합니다. 반드시 ColorRGBA 인스턴스를 대입해야 합니다.

##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

#### Set Signature

> **set** **backgroundColor**(`value`): `void`

Defined in: [src/display/scene/Scene.ts:105](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/scene/Scene.ts#L105)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`ColorRGBA`](../../Color/classes/ColorRGBA.md) |

##### Returns

`void`

***

### lightManager

#### Get Signature

> **get** **lightManager**(): [`LightManager`](../../Light/namespaces/Core/classes/LightManager.md)

Defined in: [src/display/scene/Scene.ts:73](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/scene/Scene.ts#L73)

씬 내의 모든 조명을 통합 관리하는 LightManager 인스턴스를 가져옵니다.

##### Returns

[`LightManager`](../../Light/namespaces/Core/classes/LightManager.md)

***

### physicsEngine

#### Get Signature

> **get** **physicsEngine**(): [`IPhysicsEngine`](../../Physics/interfaces/IPhysicsEngine.md)

Defined in: [src/display/scene/Scene.ts:89](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/scene/Scene.ts#L89)

씬에 바인딩되어 실행 중인 물리 시뮬레이션 엔진 플러그인을 가져오거나 설정합니다.

##### Returns

[`IPhysicsEngine`](../../Physics/interfaces/IPhysicsEngine.md)

#### Set Signature

> **set** **physicsEngine**(`value`): `void`

Defined in: [src/display/scene/Scene.ts:93](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/scene/Scene.ts#L93)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`IPhysicsEngine`](../../Physics/interfaces/IPhysicsEngine.md) |

##### Returns

`void`

***

### shadowManager

#### Get Signature

> **get** **shadowManager**(): [`ShadowManager`](../../Shadow/classes/ShadowManager.md)

Defined in: [src/display/scene/Scene.ts:81](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/scene/Scene.ts#L81)

씬 내의 모든 그림자 연산을 통합 제어하는 ShadowManager 인스턴스를 가져옵니다.

##### Returns

[`ShadowManager`](../../Shadow/classes/ShadowManager.md)

***

### useBackgroundColor

#### Get Signature

> **get** **useBackgroundColor**(): `boolean`

Defined in: [src/display/scene/Scene.ts:114](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/scene/Scene.ts#L114)

씬 배경색 사용 여부를 가져오거나 설정합니다. true일 때 지정된 backgroundColor 수치로 지우기가 수행됩니다.

##### Returns

`boolean`

#### Set Signature

> **set** **useBackgroundColor**(`value`): `void`

Defined in: [src/display/scene/Scene.ts:118](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/scene/Scene.ts#L118)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`instanceId`](../namespaces/CoreMesh/classes/Object3DContainer.md#instanceid)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:26](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L26)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`modelMatrix`](../namespaces/CoreMesh/classes/Object3DContainer.md#modelmatrix)

## Accessors

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:44](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L44)

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 객체 배열

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`children`](../namespaces/CoreMesh/classes/Object3DContainer.md#children)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`name`](../namespaces/CoreMesh/classes/Object3DContainer.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L52)

자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 수

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`numChildren`](../namespaces/CoreMesh/classes/Object3DContainer.md#numchildren)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`uuid`](../namespaces/CoreMesh/classes/Object3DContainer.md#uuid)

## Methods

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:71](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L71)

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`addChild`](../namespaces/CoreMesh/classes/Object3DContainer.md#addchild)

***

### addChildAt()

> **addChildAt**(`child`, `index`): `Scene`

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L89)

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`Scene`

현재 컨테이너

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`addChildAt`](../namespaces/CoreMesh/classes/Object3DContainer.md#addchildat)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:61](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L61)

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`contains`](../namespaces/CoreMesh/classes/Object3DContainer.md#contains)

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:111](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L111)

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`getChildAt`](../namespaces/CoreMesh/classes/Object3DContainer.md#getchildat)

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:125](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L125)

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`getChildIndex`](../namespaces/CoreMesh/classes/Object3DContainer.md#getchildindex)

***

### removeAllChildren()

> **removeAllChildren**(): `Scene`

Defined in: [src/display/mesh/core/Object3DContainer.ts:234](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L234)

모든 자식 객체를 제거합니다.

#### Returns

`Scene`

현재 컨테이너

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`removeAllChildren`](../namespaces/CoreMesh/classes/Object3DContainer.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:203](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L203)

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`removeChild`](../namespaces/CoreMesh/classes/Object3DContainer.md#removechild)

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:219](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L219)

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`removeChildAt`](../namespaces/CoreMesh/classes/Object3DContainer.md#removechildat)

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:140](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L140)

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`setChildIndex`](../namespaces/CoreMesh/classes/Object3DContainer.md#setchildindex)

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L163)

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`swapChildren`](../namespaces/CoreMesh/classes/Object3DContainer.md#swapchildren)

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:183](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L183)

두 인덱스의 자식 객체 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`swapChildrenAt`](../namespaces/CoreMesh/classes/Object3DContainer.md#swapchildrenat)


</details>
