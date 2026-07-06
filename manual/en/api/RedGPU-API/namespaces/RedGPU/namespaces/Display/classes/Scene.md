[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / Scene

# Class: Scene

Defined in: [src/display/scene/Scene.ts:26](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/scene/Scene.ts#L26)

Root container class that defines the space of a scene to be rendered in a View.

Manages light configurations (LightManager), shadows (ShadowManager), physics engine (physicsEngine), and background color settings. It hierarchically contains all visual 3D/2D objects in the scene graph and serves as the root of the rendering process, mounted inside View3D or View2D.

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

Defined in: [src/display/scene/Scene.ts:64](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/scene/Scene.ts#L64)

Creates an instance of Scene.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name?` | `string` | Name of the scene (optional) |

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

Defined in: [src/display/scene/Scene.ts:101](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/scene/Scene.ts#L101)

Gets or sets the background color (ColorRGBA) instance of the scene. Must be assigned a valid ColorRGBA instance.

##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

#### Set Signature

> **set** **backgroundColor**(`value`): `void`

Defined in: [src/display/scene/Scene.ts:105](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/scene/Scene.ts#L105)

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

Defined in: [src/display/scene/Scene.ts:73](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/scene/Scene.ts#L73)

Gets the LightManager instance that manages all lights within the scene.

##### Returns

[`LightManager`](../../Light/namespaces/Core/classes/LightManager.md)

***

### physicsEngine

#### Get Signature

> **get** **physicsEngine**(): [`IPhysicsEngine`](../../Physics/interfaces/IPhysicsEngine.md)

Defined in: [src/display/scene/Scene.ts:89](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/scene/Scene.ts#L89)

Gets or sets the physics simulation engine plugin running and bound to the scene.

##### Returns

[`IPhysicsEngine`](../../Physics/interfaces/IPhysicsEngine.md)

#### Set Signature

> **set** **physicsEngine**(`value`): `void`

Defined in: [src/display/scene/Scene.ts:93](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/scene/Scene.ts#L93)

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

Defined in: [src/display/scene/Scene.ts:81](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/scene/Scene.ts#L81)

Gets the ShadowManager instance that controls all shadow computations within the scene.

##### Returns

[`ShadowManager`](../../Shadow/classes/ShadowManager.md)

***

### useBackgroundColor

#### Get Signature

> **get** **useBackgroundColor**(): `boolean`

Defined in: [src/display/scene/Scene.ts:114](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/scene/Scene.ts#L114)

Gets or sets whether to apply the scene background color. When true, clearing is performed with the specified backgroundColor value.

##### Returns

`boolean`

#### Set Signature

> **set** **useBackgroundColor**(`value`): `void`

Defined in: [src/display/scene/Scene.ts:118](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/scene/Scene.ts#L118)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`instanceId`](../namespaces/CoreMesh/classes/Object3DContainer.md#instanceid)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:26](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L26)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`modelMatrix`](../namespaces/CoreMesh/classes/Object3DContainer.md#modelmatrix)

## Accessors

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:44](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L44)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`name`](../namespaces/CoreMesh/classes/Object3DContainer.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:52](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L52)

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

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`uuid`](../namespaces/CoreMesh/classes/Object3DContainer.md#uuid)

## Methods

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:71](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L71)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L89)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:61](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L61)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:111](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L111)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:125](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L125)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:234](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L234)

모든 자식 객체를 제거합니다.

#### Returns

`Scene`

현재 컨테이너

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`removeAllChildren`](../namespaces/CoreMesh/classes/Object3DContainer.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:203](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L203)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:219](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L219)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:140](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L140)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L163)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:183](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/mesh/core/Object3DContainer.ts#L183)

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
