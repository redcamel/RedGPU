[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / Scene

# Class: Scene

Defined in: [src/display/scene/Scene.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L26)

Root container class that defines the scene space to be rendered in a View.

Integrates and manages lighting (LightManager), shadows (ShadowManager), wind (WindManager), physics engine (IPhysicsEngine), terrain (Landscape), water bodies (Lake), and the 3D display object hierarchy.

***

### Example
```typescript
const scene = new RedGPU.Display.Scene();
scene.useBackgroundColor = true;
scene.backgroundColor.setColorByHEX('#111111');
```

## Extends

- [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

## Constructors



***

### Constructor

> **new Scene**(): `Scene`

Defined in: [src/display/scene/Scene.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L42)

Creates a Scene instance.

#### Returns

`Scene`

#### Overrides

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`constructor`](../namespaces/CoreMesh/classes/Object3DContainer.md#constructor)

## Properties



## Accessors



***

### backgroundColor

#### Get Signature

> **get** **backgroundColor**(): [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/display/scene/Scene.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L106)

Gets or sets the ColorRGBA instance representing the background color of the scene.

##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Background color (ColorRGBA) instance

#### Set Signature

> **set** **backgroundColor**(`value`): `void`

Defined in: [src/display/scene/Scene.ts:110](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L110)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`ColorRGBA`](../../Color/classes/ColorRGBA.md) |

##### Returns

`void`

***

***

### landscape

#### Get Signature

> **get** **landscape**(): [`Landscape`](../../Landscape/classes/Landscape.md)

Defined in: [src/display/scene/Scene.ts:139](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L139)

Gets or sets the Landscape terrain object bound to the scene. Passing `null` unbinds the terrain.

##### Returns

[`Landscape`](../../Landscape/classes/Landscape.md)

Bound Landscape instance or `null`

#### Set Signature

> **set** **landscape**(`val`): `void`

Defined in: [src/display/scene/Scene.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L143)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | [`Landscape`](../../Landscape/classes/Landscape.md) |

##### Returns

`void`

***

***

### lightManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lightManager**(): [`LightManager`](../../Light/classes/LightManager.md)

Defined in: [src/display/scene/Scene.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L54)

Returns the LightManager instance that manages the lights of the scene.

##### Returns

[`LightManager`](../../Light/classes/LightManager.md)

LightManager instance

***

***

### physicsEngine

#### Get Signature

> **get** **physicsEngine**(): [`IPhysicsEngine`](../../Physics/interfaces/IPhysicsEngine.md)

Defined in: [src/display/scene/Scene.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L90)

Gets or sets the physics engine instance applied to the scene.

##### Returns

[`IPhysicsEngine`](../../Physics/interfaces/IPhysicsEngine.md)

Physics engine (IPhysicsEngine) instance

#### Set Signature

> **set** **physicsEngine**(`value`): `void`

Defined in: [src/display/scene/Scene.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L94)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`IPhysicsEngine`](../../Physics/interfaces/IPhysicsEngine.md) |

##### Returns

`void`

***

***

### shadowManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowManager**(): [`ShadowManager`](../../Shadow/classes/ShadowManager.md)

Defined in: [src/display/scene/Scene.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L66)

Returns the ShadowManager instance that manages the shadows of the scene.

##### Returns

[`ShadowManager`](../../Shadow/classes/ShadowManager.md)

ShadowManager instance

***

***

### useBackgroundColor

#### Get Signature

> **get** **useBackgroundColor**(): `boolean`

Defined in: [src/display/scene/Scene.ts:123](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L123)

Gets or sets whether to use the background color of the scene.

##### Returns

`boolean`

Whether background color is used

#### Set Signature

> **set** **useBackgroundColor**(`value`): `void`

Defined in: [src/display/scene/Scene.ts:127](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L127)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### waterChildren

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **waterChildren**(): [`Lake`](../../Water/classes/Lake.md)[]

Defined in: [src/display/scene/Scene.ts:158](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L158)

Returns the list of Lake objects bound to the scene.

##### Returns

[`Lake`](../../Water/classes/Lake.md)[]

Array of registered Lake instances

***

***

### windManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **windManager**(): [`WindManager`](../../Wind/classes/WindManager.md)

Defined in: [src/display/scene/Scene.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L78)

Returns the WindManager instance governing the scene's atmospheric wind physics.

##### Returns

[`WindManager`](../../Wind/classes/WindManager.md)

WindManager instance

## Methods



***

### addWater()

> **addWater**(`water`): `void`

Defined in: [src/display/scene/Scene.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L170)

Registers a Lake object to the scene water list and adds it as a child node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `water` | [`Lake`](../../Water/classes/Lake.md) | Lake instance to register |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/scene/Scene.ts:207](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L207)

Releases and destroys the scene and its internal managed resources.

#### Returns

`void`

#### Overrides

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`destroy`](../namespaces/CoreMesh/classes/Object3DContainer.md#destroy)

***

***

### removeWater()

> **removeWater**(`water`): `void`

Defined in: [src/display/scene/Scene.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/scene/Scene.ts#L188)

Removes a Lake object from the scene.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `water` | [`Lake`](../../Water/classes/Lake.md) | Lake instance to remove |

#### Returns

`void`

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L27)

Model matrix representing the world transformation of the object.

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`modelMatrix`](../namespaces/CoreMesh/classes/Object3DContainer.md#modelmatrix)

***

### children

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L46)

Returns the array of child objects.

##### Returns

[`Mesh`](Mesh.md)[]

Array of child Meshes (`Mesh[]`)

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`children`](../namespaces/CoreMesh/classes/Object3DContainer.md#children)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`instanceId`](../namespaces/CoreMesh/classes/Object3DContainer.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

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

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`name`](../namespaces/CoreMesh/classes/Object3DContainer.md#name)

***

***

### numChildren

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:58](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L58)

Returns the number of registered child objects.

##### Returns

`number`

Number of child objects

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`numChildren`](../namespaces/CoreMesh/classes/Object3DContainer.md#numchildren)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`uuid`](../namespaces/CoreMesh/classes/Object3DContainer.md#uuid)

***

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L89)

Appends a child object to the end of the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |

#### Returns

[`Mesh`](Mesh.md)

Added child object (`null` on failure)

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`addChild`](../namespaces/CoreMesh/classes/Object3DContainer.md#addchild)

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `Scene`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L115)

Inserts a child object at the specified index position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |
| `index` | `number` | Index position to insert at |

#### Returns

`Scene`

Current container instance

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`addChildAt`](../namespaces/CoreMesh/classes/Object3DContainer.md#addchildat)

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L73)

Checks whether the specified object is a child of this container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to check |

#### Returns

`boolean`

Whether the child is contained

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`contains`](../namespaces/CoreMesh/classes/Object3DContainer.md#contains)

***

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L143)

Returns the child object at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index position to retrieve |

#### Returns

[`Mesh`](Mesh.md)

Child object at the index (`undefined` if out of bounds)

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`getChildAt`](../namespaces/CoreMesh/classes/Object3DContainer.md#getchildat)

***

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L163)

Returns the index of the specified child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to find the index of |

#### Returns

`number`

Index of the child object (`-1` if not found)

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`getChildIndex`](../namespaces/CoreMesh/classes/Object3DContainer.md#getchildindex)

***

***

### removeAllChildren()

> **removeAllChildren**(): `Scene`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L309)

Removes all child objects from the container.

#### Returns

`Scene`

Current container instance

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`removeAllChildren`](../namespaces/CoreMesh/classes/Object3DContainer.md#removeallchildren)

***

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L265)

Removes the specified child object from the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to remove |

#### Returns

[`Mesh`](Mesh.md)

Removed child object

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`removeChild`](../namespaces/CoreMesh/classes/Object3DContainer.md#removechild)

***

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:290](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L290)

Removes the child object at the specified index from the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the child object to remove |

#### Returns

[`Mesh`](Mesh.md)

Removed child object

#### Throws

Throws Error if no child exists at the provided index

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`removeChildAt`](../namespaces/CoreMesh/classes/Object3DContainer.md#removechildat)

***

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L184)

Changes the index position of a child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to reposition |
| `index` | `number` | New index to assign |

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`setChildIndex`](../namespaces/CoreMesh/classes/Object3DContainer.md#setchildindex)

***

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L213)

Swaps the order (indices) of two child objects within the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | First child object |
| `child2` | [`Mesh`](Mesh.md) | Second child object |

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`swapChildren`](../namespaces/CoreMesh/classes/Object3DContainer.md#swapchildren)

***

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L239)

Swaps the child objects at the two specified indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | First index |
| `index2` | `number` | Second index |

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md).[`swapChildrenAt`](../namespaces/CoreMesh/classes/Object3DContainer.md#swapchildrenat)

</details>
