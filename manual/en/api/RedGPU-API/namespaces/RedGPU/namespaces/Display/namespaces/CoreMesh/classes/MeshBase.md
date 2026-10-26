[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreMesh](../README.md) / MeshBase

# Class: MeshBase

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L32)

Base class defining common rendering states and matrix transformations for Mesh and other display objects.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## See

- [World to local example](https://redcamel.github.io/RedGPU/examples/3d/coordinateTransformation/worldToLocal/)
 - [Screen to world example](https://redcamel.github.io/RedGPU/examples/3d/coordinateTransformation/screenToWorld/)

## Extends

- [`Object3DContainer`](Object3DContainer.md)

## Extended by

- [`Mesh`](../../../classes/Mesh.md)

## Constructors



***

### Constructor

> **new MeshBase**(`redGPUContext`): `MeshBase`

Defined in: [src/display/mesh/core/MeshBase.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L104)

Creates a MeshBase instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`MeshBase`

#### Overrides

[`Object3DContainer`](Object3DContainer.md).[`constructor`](Object3DContainer.md#constructor)

## Properties



***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L42)

GLTF morph, skin, and clip animation information.

#### animationsList

> **animationsList**: [`ClipAnimState`](../../../../../classes/ClipAnimState.md)[]

#### jointBuffer

> **jointBuffer**: [`IndexBuffer`](../../../../Resource/classes/IndexBuffer.md)

#### morphInfo

> **morphInfo**: `MorphInfo_GLTF`

#### skinInfo

> **skinInfo**: `ParsedSkinInfo_GLTF`

#### weightBuffer

> **weightBuffer**: [`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md)

***

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L74)

Whether the opacity needs to be updated.

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L64)

Whether the render pipeline needs to be updated.

***

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L69)

Whether the transform matrix needs to be updated.

***

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L59)

GLTFLoader instance information that loaded this object.

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L37)

GPU vertex render information object.

***

***

### localMatrix

> **localMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L84)

Local transformation matrix relative to the parent.

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L79)

Model matrix with world transformation applied.

#### Overrides

[`Object3DContainer`](Object3DContainer.md).[`modelMatrix`](Object3DContainer.md#modelmatrix)

***

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L89)

Normal model matrix used for normal vector transformation.

## Accessors



***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L121)

Gets or sets the name of the currently applied vertex shader module.

##### Returns

`string`

Current vertex shader module name

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:125](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L125)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

***

***

### depthStencilState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthStencilState**(): [`DepthStencilState`](../../../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:149](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L149)

Returns the depth/stencil rendering state (`DepthStencilState`) of the object.

##### Returns

[`DepthStencilState`](../../../../RenderState/classes/DepthStencilState.md)

DepthStencilState instance

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:161](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L161)

Returns the WebGPU device associated with the current instance.

##### Returns

`GPUDevice`

GPUDevice instance

***

***

### primitiveState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **primitiveState**(): [`PrimitiveState`](../../../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:137](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L137)

Returns the primitive rendering state (`PrimitiveState`) of the object.

##### Returns

[`PrimitiveState`](../../../../RenderState/classes/PrimitiveState.md)

PrimitiveState instance

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:173](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L173)

Returns the RedGPUContext associated with the current instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext instance

***

## Methods



***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:245](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L245)

Returns the 2D screen coordinates of this object based on the specified view.

#### Example
```typescript
const screenPos = mesh.getScreenPoint(view3D);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | Reference View3D instance |

#### Returns

\[`number`, `number`\]

Screen coordinates `[x, y]`

***

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:225](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L225)

Converts this object's local space coordinates to world space coordinates.

#### Example
```typescript
const worldPos = mesh.localToWorld(0, 1, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Local X coordinate |
| `y` | `number` | Local Y coordinate |
| `z` | `number` | Local Z coordinate |

#### Returns

\[`number`, `number`, `number`\]

Converted world coordinates `[x, y, z]`

***

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:199](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L199)

Converts world space coordinates to this object's local space coordinates.

#### Example
```typescript
const localPos = mesh.worldToLocal(10, 5, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | World X coordinate |
| `y` | `number` | World Y coordinate |
| `z` | `number` | World Z coordinate |

#### Returns

\[`number`, `number`, `number`\]

Converted local coordinates `[x, y, z]`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### children

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **children**(): [`Mesh`](../../../classes/Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L46)

Returns the array of child objects.

##### Returns

[`Mesh`](../../../classes/Mesh.md)[]

Array of child Meshes (`Mesh[]`)

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`children`](Object3DContainer.md#children)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`instanceId`](Object3DContainer.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

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

[`Object3DContainer`](Object3DContainer.md).[`name`](Object3DContainer.md#name)

***

***

### numChildren

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L58)

Returns the number of registered child objects.

##### Returns

`number`

Number of child objects

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`numChildren`](Object3DContainer.md#numchildren)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`uuid`](Object3DContainer.md#uuid)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### addChild()

> **addChild**(`child`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L89)

Appends a child object to the end of the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | Child object to add |

#### Returns

[`Mesh`](../../../classes/Mesh.md)

Added child object (`null` on failure)

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`addChild`](Object3DContainer.md#addchild)

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `MeshBase`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L115)

Inserts a child object at the specified index position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | Child object to add |
| `index` | `number` | Index position to insert at |

#### Returns

`MeshBase`

Current container instance

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`addChildAt`](Object3DContainer.md#addchildat)

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L73)

Checks whether the specified object is a child of this container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | Child object to check |

#### Returns

`boolean`

Whether the child is contained

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`contains`](Object3DContainer.md#contains)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:322](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L322)

Destroys all child objects in the container and removes them.

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`destroy`](Object3DContainer.md#destroy)

***

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L143)

Returns the child object at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index position to retrieve |

#### Returns

[`Mesh`](../../../classes/Mesh.md)

Child object at the index (`undefined` if out of bounds)

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`getChildAt`](Object3DContainer.md#getchildat)

***

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L163)

Returns the index of the specified child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | Child object to find the index of |

#### Returns

`number`

Index of the child object (`-1` if not found)

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`getChildIndex`](Object3DContainer.md#getchildindex)

***

***

### removeAllChildren()

> **removeAllChildren**(): `MeshBase`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L309)

Removes all child objects from the container.

#### Returns

`MeshBase`

Current container instance

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`removeAllChildren`](Object3DContainer.md#removeallchildren)

***

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L265)

Removes the specified child object from the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | Child object to remove |

#### Returns

[`Mesh`](../../../classes/Mesh.md)

Removed child object

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`removeChild`](Object3DContainer.md#removechild)

***

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:290](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L290)

Removes the child object at the specified index from the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the child object to remove |

#### Returns

[`Mesh`](../../../classes/Mesh.md)

Removed child object

#### Throws

Throws Error if no child exists at the provided index

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`removeChildAt`](Object3DContainer.md#removechildat)

***

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L184)

Changes the index position of a child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | Child object to reposition |
| `index` | `number` | New index to assign |

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`setChildIndex`](Object3DContainer.md#setchildindex)

***

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L213)

Swaps the order (indices) of two child objects within the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](../../../classes/Mesh.md) | First child object |
| `child2` | [`Mesh`](../../../classes/Mesh.md) | Second child object |

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`swapChildren`](Object3DContainer.md#swapchildren)

***

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:239](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L239)

Swaps the child objects at the two specified indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | First index |
| `index2` | `number` | Second index |

#### Returns

`void`

#### Inherited from

[`Object3DContainer`](Object3DContainer.md).[`swapChildrenAt`](Object3DContainer.md#swapchildrenat)

***

</details>
