[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / Line2D

# Class: Line2D

Defined in: [src/display/line/Line2D.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line2D.ts#L31)

Class that renders straight lines or curves (Bezier, Catmull-Rom) by connecting points on a 2D plane.

`geometry` and `material` are automatically assigned internally upon instantiation and cannot be changed.

***

### Example
```typescript
const line = new RedGPU.Display.Line2D(redGPUContext);
line.addPoint(0, 0);
line.addPoint(100, 100);
scene.addChild(line);
```

## See

[Line2D Linear example](https://redcamel.github.io/RedGPU/examples/2d/line2D/linear/)

## Extends

- [`Line3D`](Line3D.md)

## Constructors



***

### Constructor

> **new Line2D**(`redGPUContext`, `type?`, `baseColor?`): `Line2D`

Defined in: [src/display/line/Line2D.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line2D.ts#L51)

Creates a `Line2D` instance.

#### Example
```typescript
const line = new RedGPU.Display.Line2D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR, '#ffffff');
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` instance |
| `type?` | [`LINE_TYPE`](../type-aliases/LINE_TYPE.md) | `LINE_TYPE.LINEAR` | Line interpolation type (default: `LINE_TYPE.LINEAR`) |
| `baseColor?` | `string` | `'#fff'` | Base line color (HEX string, default: `'#fff'`) |

#### Returns

`Line2D`

#### Overrides

[`Line3D`](Line3D.md).[`constructor`](Line3D.md#constructor)

## Properties



## Accessors



***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/line/Line2D.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line2D.ts#L64)

Returns the geometry automatically assigned to the line. Cannot be modified externally.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Line geometry object

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/line/Line2D.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line2D.ts#L68)

Returns the geometry automatically assigned to the line. Cannot be modified externally.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) |

##### Returns

`void`

Line geometry object

#### Overrides

[`Line3D`](Line3D.md).[`geometry`](Line3D.md#geometry)

***

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/line/Line2D.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line2D.ts#L80)

Returns the dedicated material (`LineMaterial`) automatically assigned to the line. Cannot be modified externally.

##### Returns

`any`

Line material object

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/line/Line2D.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line2D.ts#L84)

Returns the dedicated material (`LineMaterial`) automatically assigned to the line. Cannot be modified externally.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `any` |

##### Returns

`void`

Line material object

#### Overrides

[`Line3D`](Line3D.md).[`material`](Line3D.md#material)

***

## Methods



***

### addPoint()

> **addPoint**(`x?`, `y?`, `color?`, `colorAlpha?`, `inX?`, `inY?`, `outX?`, `outY?`): `void`

Defined in: [src/display/line/Line2D.ts:137](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line2D.ts#L137)

Appends a new point to the end of the 2D plane path.

#### Example
```typescript
line.addPoint(100, 50, '#ff0000', 1.0);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `x?` | `number` | `0` | X coordinate (default: `0`) |
| `y?` | `number` | `0` | Y coordinate (default: `0`) |
| `color?` | `string` | `...` | Point color HEX string (default: `this.baseColor`) |
| `colorAlpha?` | `number` | `1` | Color opacity (`0` to `1`, default: `1`) |
| `inX?` | `number` | `0` | In-tangent control point X coordinate (default: `0`) |
| `inY?` | `number` | `0` | In-tangent control point Y coordinate (default: `0`) |
| `outX?` | `number` | `0` | Out-tangent control point X coordinate (default: `0`) |
| `outY?` | `number` | `0` | Out-tangent control point Y coordinate (default: `0`) |

#### Returns

`void`

#### Overrides

[`Line3D`](Line3D.md).[`addPoint`](Line3D.md#addpoint)

***

***

### addPointAt()

> **addPointAt**(`index`, `x?`, `y?`, `color?`, `colorAlpha?`, `inX?`, `inY?`, `outX?`, `outY?`): `void`

Defined in: [src/display/line/Line2D.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line2D.ts#L184)

Inserts a point at the specified index in the 2D plane path.

#### Example
```typescript
line.addPointAt(1, 50, 50, '#00ff00', 1.0);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `index` | `number` | `undefined` | Index at which to insert the point |
| `x?` | `number` | `0` | X coordinate (default: `0`) |
| `y?` | `number` | `0` | Y coordinate (default: `0`) |
| `color?` | `string` | `...` | Point color HEX string (default: `this.baseColor`) |
| `colorAlpha?` | `number` | `1` | Color opacity (`0` to `1`, default: `1`) |
| `inX?` | `number` | `0` | In-tangent control point X coordinate (default: `0`) |
| `inY?` | `number` | `0` | In-tangent control point Y coordinate (default: `0`) |
| `outX?` | `number` | `0` | Out-tangent control point X coordinate (default: `0`) |
| `outY?` | `number` | `0` | Out-tangent control point Y coordinate (default: `0`) |

#### Returns

`void`

#### Overrides

[`Line3D`](Line3D.md).[`addPointAt`](Line3D.md#addpointat)

***

***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/line/Line2D.ts:96](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line2D.ts#L96)

Creates a custom vertex shader module dedicated to `Line2D`.

#### Returns

`GPUShaderModule`

Created `GPUShaderModule` instance

#### Overrides

[`Line3D`](Line3D.md).[`createCustomMeshVertexShaderModule`](Line3D.md#createcustommeshvertexshadermodule)

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:301](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L301)

#### Inherited from

[`Line3D`](Line3D.md).[`_geometry`](Line3D.md#_geometry)

***

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:279](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L279)

#### Inherited from

[`Line3D`](Line3D.md).[`_material`](Line3D.md#_material)

***

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L42)

GLTF morph, skin, and clip animation information.

#### animationsList

> **animationsList**: [`ClipAnimState`](../../../classes/ClipAnimState.md)[]

#### jointBuffer

> **jointBuffer**: [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

#### morphInfo

> **morphInfo**: `MorphInfo_GLTF`

#### skinInfo

> **skinInfo**: `ParsedSkinInfo_GLTF`

#### weightBuffer

> **weightBuffer**: [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

#### Inherited from

[`Line3D`](Line3D.md).[`animationInfo`](Line3D.md#animationinfo)

***

***

### baseColor

> **baseColor**: `any`

Defined in: [src/display/line/Line3D.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L52)

Base line color (HEX string)

#### Inherited from

[`Line3D`](Line3D.md).[`baseColor`](Line3D.md#basecolor)

***

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L99)

Whether to cast shadows

#### Inherited from

[`Line3D`](Line3D.md).[`castShadow`](Line3D.md#castshadow)

***

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L104)

Whether LOD info needs update

#### Inherited from

[`Line3D`](Line3D.md).[`dirtyLOD`](Line3D.md#dirtylod)

***

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L74)

Whether the opacity needs to be updated.

#### Inherited from

[`Line3D`](Line3D.md).[`dirtyOpacity`](Line3D.md#dirtyopacity)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L64)

Whether the render pipeline needs to be updated.

#### Inherited from

[`Line3D`](Line3D.md).[`dirtyPipeline`](Line3D.md#dirtypipeline)

***

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L69)

Whether the transform matrix needs to be updated.

#### Inherited from

[`Line3D`](Line3D.md).[`dirtyTransform`](Line3D.md#dirtytransform)

***

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L50)

Whether to disable TAA jitter

#### Inherited from

[`Line3D`](Line3D.md).[`disableJitter`](Line3D.md#disablejitter)

***

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L59)

GLTFLoader instance information that loaded this object.

#### Inherited from

[`Line3D`](Line3D.md).[`gltfLoaderInfo`](Line3D.md#gltfloaderinfo)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L37)

GPU vertex render information object.

#### Inherited from

[`Line3D`](Line3D.md).[`gpuRenderInfo`](Line3D.md#gpurenderinfo)

***

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L60)

Identifier to determine if it is a Mesh instance

#### Inherited from

[`Line3D`](Line3D.md).[`isInstanceofMesh`](Line3D.md#isinstanceofmesh)

***

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L84)

Local transformation matrix relative to the parent.

#### Inherited from

[`Line3D`](Line3D.md).[`localMatrix`](Line3D.md#localmatrix)

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L79)

Model matrix with world transformation applied.

#### Inherited from

[`Line3D`](Line3D.md).[`modelMatrix`](Line3D.md#modelmatrix)

***

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L89)

Normal model matrix used for normal vector transformation.

#### Inherited from

[`Line3D`](Line3D.md).[`normalModelMatrix`](Line3D.md#normalmodelmatrix)

***

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L109)

Whether it passed frustum culling

#### Inherited from

[`Line3D`](Line3D.md).[`passFrustumCulling`](Line3D.md#passfrustumculling)

***

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L45)

Whether to receive shadows

#### Inherited from

[`Line3D`](Line3D.md).[`receiveShadow`](Line3D.md#receiveshadow)

***

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:55](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L55)

Whether to use displacement texture

#### Inherited from

[`Line3D`](Line3D.md).[`useDisplacementTexture`](Line3D.md#usedisplacementtexture)

***

### boundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:751](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L751)

Returns the AABB (Axis-Aligned Bounding Box) information. (Zero-GC in-place reuse)

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

Calculated AABB instance

#### Inherited from

[`Line3D`](Line3D.md).[`boundingAABB`](Line3D.md#boundingaabb)

***

***

### boundingOBB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:736](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L736)

Returns the OBB (Oriented Bounding Box) information.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

Calculated OBB instance

#### Inherited from

[`Line3D`](Line3D.md).[`boundingOBB`](Line3D.md#boundingobb)

***

***

### children

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L46)

Returns the array of child objects.

##### Returns

[`Mesh`](Mesh.md)[]

Array of child Meshes (`Mesh[]`)

#### Inherited from

[`Line3D`](Line3D.md).[`children`](Line3D.md#children)

***

***

### combinedBoundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:771](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L771)

Returns the combined AABB information including child objects.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

Combined AABB instance

#### Inherited from

[`Line3D`](Line3D.md).[`combinedBoundingAABB`](Line3D.md#combinedboundingaabb)

***

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

#### Inherited from

[`Line3D`](Line3D.md).[`currentShaderModuleName`](Line3D.md#currentshadermodulename)

***

***

### depthStencilState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:149](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L149)

Returns the depth/stencil rendering state (`DepthStencilState`) of the object.

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

DepthStencilState instance

#### Inherited from

[`Line3D`](Line3D.md).[`depthStencilState`](Line3D.md#depthstencilstate)

***

***

### distance

#### Get Signature

> **get** **distance**(): `number`

Defined in: [src/display/line/Line3D.ts:186](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L186)

Returns or sets the distance threshold for curve point simplification. (default: `0.01`, positive number)

##### Returns

`number`

Curve simplification distance threshold

#### Set Signature

> **set** **distance**(`value`): `void`

Defined in: [src/display/line/Line3D.ts:190](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L190)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`distance`](Line3D.md#distance)

***

***

### drawBufferManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawBufferManager**(): `DrawBufferManager`

Defined in: [src/display/mesh/Mesh.ts:234](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L234)

Returns the draw buffer manager.

##### Returns

`DrawBufferManager`

DrawBufferManager instance or `null`

#### Inherited from

[`Line3D`](Line3D.md).[`drawBufferManager`](Line3D.md#drawbuffermanager)

***

***

### drawCommandSlot

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawCommandSlot**(): `DrawCommandSlot`

Defined in: [src/display/mesh/Mesh.ts:222](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L222)

Returns the draw command slot.

##### Returns

`DrawCommandSlot`

DrawCommandSlot instance or `null`

#### Inherited from

[`Line3D`](Line3D.md).[`drawCommandSlot`](Line3D.md#drawcommandslot)

***

***

### drawDebugger

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

Defined in: [src/display/mesh/Mesh.ts:275](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L275)

Returns the debug mesh object.

##### Returns

[`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

DrawDebuggerMesh instance

#### Inherited from

[`Line3D`](Line3D.md).[`drawDebugger`](Line3D.md#drawdebugger)

***

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:258](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L258)

Gets or sets whether the debugger is enabled.

##### Returns

`boolean`

Whether the debugger is enabled

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:262](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L262)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`enableDebugger`](Line3D.md#enabledebugger)

***

***

### enableWaterInteraction

#### Get Signature

> **get** **enableWaterInteraction**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:447](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L447)

Gets or sets whether real-time wave interaction with water (Lake) is enabled.

##### Returns

`boolean`

Whether water wave interaction is enabled

#### Set Signature

> **set** **enableWaterInteraction**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:451](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L451)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`enableWaterInteraction`](Line3D.md#enablewaterinteraction)

***

***

### events

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:407](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L407)

Returns the registered event map object.

##### Returns

`any`

Registered events object

#### Inherited from

[`Line3D`](Line3D.md).[`events`](Line3D.md#events)

***

***

### globalVertexSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalVertexSlotIndex**(): `number`

Defined in: [src/display/mesh/Mesh.ts:210](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L210)

Returns the global buffer slot index.

##### Returns

`number`

Global vertex slot index

#### Inherited from

[`Line3D`](Line3D.md).[`globalVertexSlotIndex`](Line3D.md#globalvertexslotindex)

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

#### Inherited from

[`Line3D`](Line3D.md).[`gpuDevice`](Line3D.md#gpudevice)

***

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:347](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L347)

Gets or sets whether to ignore frustum culling.

##### Returns

`boolean`

Whether frustum culling is ignored

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:351](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L351)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`ignoreFrustumCulling`](Line3D.md#ignorefrustumculling)

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

[`Line3D`](Line3D.md).[`instanceId`](Line3D.md#instanceid)

***

***

### interleaveData

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **interleaveData**(): `number`[]

Defined in: [src/display/line/Line3D.ts:138](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L138)

Returns the number array of vertex positions and colors serialized in interleaved format.

##### Returns

`number`[]

Interleaved vertex data array (`number[]`)

#### Inherited from

[`Line3D`](Line3D.md).[`interleaveData`](Line3D.md#interleavedata)

***

***

### LODManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:246](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L246)

Returns the LOD (Level of Detail) manager.

##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager instance

#### Inherited from

[`Line3D`](Line3D.md).[`LODManager`](Line3D.md#lodmanager)

***

***

### minScreenSpaceSize

#### Get Signature

> **get** **minScreenSpaceSize**(): `number`

Defined in: [src/display/mesh/Mesh.ts:379](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L379)

Gets or sets the minimum size ratio threshold for screen space size culling.

##### Returns

`number`

Screen space size ratio threshold

#### Set Signature

> **set** **minScreenSpaceSize**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:383](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L383)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`minScreenSpaceSize`](Line3D.md#minscreenspacesize)

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

[`Line3D`](Line3D.md).[`name`](Line3D.md#name)

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

[`Line3D`](Line3D.md).[`numChildren`](Line3D.md#numchildren)

***

***

### numPoints

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numPoints**(): `number`

Defined in: [src/display/line/Line3D.ts:204](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L204)

Returns the number of original points registered in the line.

##### Returns

`number`

Number of original points

#### Inherited from

[`Line3D`](Line3D.md).[`numPoints`](Line3D.md#numpoints)

***

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:329](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L329)

Gets or sets the opacity of the mesh (0~1).

##### Returns

`number`

Opacity value (0~1)

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:333](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L333)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`opacity`](Line3D.md#opacity)

***

***

### originalPoints

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **originalPoints**(): `LinePointWithInOut`[]

Defined in: [src/display/line/Line3D.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L109)

Returns the array of original points (`LinePointWithInOut`) including in/out tangent control points.

##### Returns

`LinePointWithInOut`[]

Array of `LinePointWithInOut`

#### Inherited from

[`Line3D`](Line3D.md).[`originalPoints`](Line3D.md#originalpoints)

***

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:431](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L431)

Gets or sets the parent container object.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Parent Object3DContainer instance

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:435](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L435)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`parent`](Line3D.md#parent)

***

***

### pickingId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:395](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L395)

Returns the picking ID.

##### Returns

`number`

Picking identifier value

#### Inherited from

[`Line3D`](Line3D.md).[`pickingId`](Line3D.md#pickingid)

***

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:496](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L496)

Gets or sets the pivot X coordinate.

##### Returns

`number`

Pivot X coordinate

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:500](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L500)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`pivotX`](Line3D.md#pivotx)

***

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:513](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L513)

Gets or sets the pivot Y coordinate.

##### Returns

`number`

Pivot Y coordinate

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:517](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L517)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`pivotY`](Line3D.md#pivoty)

***

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:530](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L530)

Gets or sets the pivot Z coordinate.

##### Returns

`number`

Pivot Z coordinate

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:534](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L534)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`pivotZ`](Line3D.md#pivotz)

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:598](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L598)

Returns the current position. [x, y, z]

##### Returns

`Float32Array`

Position array

#### Inherited from

[`Line3D`](Line3D.md).[`position`](Line3D.md#position)

***

***

### primitiveState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:137](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L137)

Returns the primitive rendering state (`PrimitiveState`) of the object.

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

PrimitiveState instance

#### Inherited from

[`Line3D`](Line3D.md).[`primitiveState`](Line3D.md#primitivestate)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:173](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L173)

Returns the RedGPUContext associated with the current instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`Line3D`](Line3D.md).[`redGPUContext`](Line3D.md#redgpucontext)

***

***

### rotation

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:724](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L724)

Returns the current rotation values. [x, y, z] (degrees)

##### Returns

`Float32Array`

Rotation values array (degrees)

#### Inherited from

[`Line3D`](Line3D.md).[`rotation`](Line3D.md#rotation)

***

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:673](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L673)

Gets or sets the X-axis rotation value (degrees).

##### Returns

`number`

X-axis rotation value (degrees)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:677](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L677)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`rotationX`](Line3D.md#rotationx)

***

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:690](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L690)

Gets or sets the Y-axis rotation value (degrees).

##### Returns

`number`

Y-axis rotation value (degrees)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:694](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L694)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`rotationY`](Line3D.md#rotationy)

***

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:707](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L707)

Gets or sets the Z-axis rotation value (degrees).

##### Returns

`number`

Z-axis rotation value (degrees)

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:711](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L711)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`rotationZ`](Line3D.md#rotationz)

***

***

### scale

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:661](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L661)

Returns the current scale. [x, y, z]

##### Returns

`Float32Array`

Scale array

#### Inherited from

[`Line3D`](Line3D.md).[`scale`](Line3D.md#scale)

***

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:610](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L610)

Gets or sets the X-axis scale.

##### Returns

`number`

X-axis scale value

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:614](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L614)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`scaleX`](Line3D.md#scalex)

***

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:627](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L627)

Gets or sets the Y-axis scale.

##### Returns

`number`

Y-axis scale value

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:631](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L631)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`scaleY`](Line3D.md#scaley)

***

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:644](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L644)

Gets or sets the Z-axis scale.

##### Returns

`number`

Z-axis scale value

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:648](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L648)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`scaleZ`](Line3D.md#scalez)

***

***

### tension

#### Get Signature

> **get** **tension**(): `number`

Defined in: [src/display/line/Line3D.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L150)

Returns or sets the tension value for `LINE_TYPE.CATMULL_ROM` curves. (default: `1`, positive number)

##### Returns

`number`

Catmull-Rom curve tension value

#### Set Signature

> **set** **tension**(`value`): `void`

Defined in: [src/display/line/Line3D.ts:154](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L154)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`tension`](Line3D.md#tension)

***

***

### tolerance

#### Get Signature

> **get** **tolerance**(): `number`

Defined in: [src/display/line/Line3D.ts:168](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L168)

Returns or sets the flatness tolerance for Bezier curve subdivision sampling. (default: `0.01`, positive number)

##### Returns

`number`

Curve sampling tolerance

#### Set Signature

> **set** **tolerance**(`value`): `void`

Defined in: [src/display/line/Line3D.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L172)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`tolerance`](Line3D.md#tolerance)

***

***

### type

#### Get Signature

> **get** **type**(): [`LINE_TYPE`](../type-aliases/LINE_TYPE.md)

Defined in: [src/display/line/Line3D.ts:121](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L121)

Returns or sets the curve interpolation type (`LINE_TYPE`) of the line.

##### Returns

[`LINE_TYPE`](../type-aliases/LINE_TYPE.md)

Currently set `LINE_TYPE` value

#### Set Signature

> **set** **type**(`value`): `void`

Defined in: [src/display/line/Line3D.ts:125](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L125)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`LINE_TYPE`](../type-aliases/LINE_TYPE.md) |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`type`](Line3D.md#type)

***

***

### useScreenSpaceSizeCulling

#### Get Signature

> **get** **useScreenSpaceSizeCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:363](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L363)

Gets or sets whether to use screen space size culling.

##### Returns

`boolean`

Whether screen space size culling is used

#### Set Signature

> **set** **useScreenSpaceSizeCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:367](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L367)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`useScreenSpaceSizeCulling`](Line3D.md#usescreenspacesizeculling)

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

[`Line3D`](Line3D.md).[`uuid`](Line3D.md#uuid)

***

***

### vertexStateBuffers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:419](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L419)

Returns the array of vertex state buffer layouts.

##### Returns

`GPUVertexBufferLayout`[]

Array of GPUVertexBufferLayout

#### Inherited from

[`Line3D`](Line3D.md).[`vertexStateBuffers`](Line3D.md#vertexstatebuffers)

***

***

### waterWaveStrength

#### Get Signature

> **get** **waterWaveStrength**(): `number`

Defined in: [src/display/mesh/Mesh.ts:472](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L472)

Gets or sets the wave generation strength multiplier (default: 1.0).

##### Returns

`number`

Water wave generation strength multiplier

#### Set Signature

> **set** **waterWaveStrength**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:476](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L476)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`waterWaveStrength`](Line3D.md#waterwavestrength)

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:547](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L547)

Gets or sets the X position coordinate.

##### Returns

`number`

X position coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:551](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L551)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`x`](Line3D.md#x)

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:564](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L564)

Gets or sets the Y position coordinate.

##### Returns

`number`

Y position coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:568](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L568)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`y`](Line3D.md#y)

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:581](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L581)

Gets or sets the Z position coordinate.

##### Returns

`number`

Z position coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:585](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L585)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`z`](Line3D.md#z)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L89)

Appends a child object to the end of the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |

#### Returns

[`Mesh`](Mesh.md)

Added child object (`null` on failure)

#### Inherited from

[`Line3D`](Line3D.md).[`addChild`](Line3D.md#addchild)

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `Line2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L115)

Inserts a child object at the specified index position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |
| `index` | `number` | Index position to insert at |

#### Returns

`Line2D`

Current container instance

#### Inherited from

[`Line3D`](Line3D.md).[`addChildAt`](Line3D.md#addchildat)

***

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:888](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L888)

Adds an event listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | Event name |
| `callback` | `Function` | Callback function |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`addListener`](Line3D.md#addlistener)

***

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1002](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1002)

**`Experimental`**

Clones the mesh.

#### Returns

[`Mesh`](Mesh.md)

Cloned Mesh instance

#### Inherited from

[`Line3D`](Line3D.md).[`clone`](Line3D.md#clone)

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L73)

Checks whether the specified object is a child of this container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to check |

#### Returns

`boolean`

Whether the child is contained

#### Inherited from

[`Line3D`](Line3D.md).[`contains`](Line3D.md#contains)

***

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1721](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1721)

Creates and returns the basic mesh vertex shader module and uniform bind group.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `VERTEX_SHADER_MODULE_NAME` | `any` | Vertex shader module name |
| `SHADER_INFO` | `any` | Parsed WGSL shader info |
| `UNIFORM_STRUCT_BASIC` | `any` | Vertex uniform struct info |
| `vertexModuleSource` | `any` | Vertex shader WGSL source code |

#### Returns

`GPUShaderModule`

Created GPUShaderModule instance

#### Inherited from

[`Line3D`](Line3D.md).[`createMeshVertexShaderModuleBASIC`](Line3D.md#createmeshvertexshadermodulebasic)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1740](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1740)

Destroys the Mesh instance and immediately releases the allocated draw command slots, global buffer slots, and resources.

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`destroy`](Line3D.md#destroy)

***

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L143)

Returns the child object at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index position to retrieve |

#### Returns

[`Mesh`](Mesh.md)

Child object at the index (`undefined` if out of bounds)

#### Inherited from

[`Line3D`](Line3D.md).[`getChildAt`](Line3D.md#getchildat)

***

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L163)

Returns the index of the specified child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to find the index of |

#### Returns

`number`

Index of the child object (`-1` if not found)

#### Inherited from

[`Line3D`](Line3D.md).[`getChildIndex`](Line3D.md#getchildindex)

***

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:869](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L869)

Calculates and returns the combined opacity considering the parent hierarchy.

#### Returns

`number`

Combined opacity value

#### Inherited from

[`Line3D`](Line3D.md).[`getCombinedOpacity`](Line3D.md#getcombinedopacity)

***

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
| `view` | [`View3D`](View3D.md) | Reference View3D instance |

#### Returns

\[`number`, `number`\]

Screen coordinates `[x, y]`

#### Inherited from

[`Line3D`](Line3D.md).[`getScreenPoint`](Line3D.md#getscreenpoint)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1687](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1687)

Initializes the mesh's GPU render info (VertexGPURenderInfo) and updates the pipeline.

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`initGPURenderInfos`](Line3D.md#initgpurenderinfos)

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

#### Inherited from

[`Line3D`](Line3D.md).[`localToWorld`](Line3D.md#localtoworld)

***

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:907](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L907)

Rotates the mesh to look at a specific coordinate.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | Target X coordinate or [x, y, z] array |
| `targetY?` | `number` | Target Y coordinate (ignored if targetX is an array) |
| `targetZ?` | `number` | Target Z coordinate (ignored if targetX is an array) |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`lookAt`](Line3D.md#lookat)

***

***

### removeAllChildren()

> **removeAllChildren**(): `Line2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L309)

Removes all child objects from the container.

#### Returns

`Line2D`

Current container instance

#### Inherited from

[`Line3D`](Line3D.md).[`removeAllChildren`](Line3D.md#removeallchildren)

***

***

### removeAllPoint()

> **removeAllPoint**(): `void`

Defined in: [src/display/line/Line3D.ts:403](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L403)

Removes all points registered in the line.

#### Example
```typescript
line.removeAllPoint();
```

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`removeAllPoint`](Line3D.md#removeallpoint)

***

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L265)

Removes the specified child object from the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to remove |

#### Returns

[`Mesh`](Mesh.md)

Removed child object

#### Inherited from

[`Line3D`](Line3D.md).[`removeChild`](Line3D.md#removechild)

***

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:290](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L290)

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

[`Line3D`](Line3D.md).[`removeChildAt`](Line3D.md#removechildat)

***

***

### removePointAt()

> **removePointAt**(`index`): `void`

Defined in: [src/display/line/Line3D.ts:387](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/Line3D.ts#L387)

Removes the point at the specified index.

#### Example
```typescript
line.removePointAt(0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the point to remove (unsigned integer) |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`removePointAt`](Line3D.md#removepointat)

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/mesh/Mesh.ts:1022](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1022)

Renders the mesh.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Render view state data |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`render`](Line3D.md#render)

***

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:802](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L802)

Sets shadow casting for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | Whether to cast (default: false) |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setCastShadowRecursively`](Line3D.md#setcastshadowrecursively)

***

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L184)

Changes the index position of a child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to reposition |
| `index` | `number` | New index to assign |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setChildIndex`](Line3D.md#setchildindex)

***

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:783](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L783)

Sets the debugger visibility for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger?` | `boolean` | `false` | Whether to enable (default: false) |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setEnableDebuggerRecursively`](Line3D.md#setenabledebuggerrecursively)

***

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:840](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L840)

Sets whether to ignore frustum culling for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | Whether to ignore (default: false) |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setIgnoreFrustumCullingRecursively`](Line3D.md#setignorefrustumcullingrecursively)

***

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:959](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L959)

Sets the position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X coordinate |
| `y?` | `number` | Y coordinate (if omitted, same as x) |
| `z?` | `number` | Z coordinate (if omitted, same as x) |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setPosition`](Line3D.md#setposition)

***

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:821](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L821)

Sets shadow receiving for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | Whether to receive (default: false) |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setReceiveShadowRecursively`](Line3D.md#setreceiveshadowrecursively)

***

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:983](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L983)

Sets the rotation values. (degrees)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X-axis rotation |
| `rotationY?` | `number` | Y-axis rotation (if omitted, same as rotationX) |
| `rotationZ?` | `number` | Z-axis rotation (if omitted, same as rotationX) |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setRotation`](Line3D.md#setrotation)

***

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:935](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L935)

Sets the scale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X-axis scale |
| `y?` | `number` | Y-axis scale (if omitted, same as x) |
| `z?` | `number` | Z-axis scale (if omitted, same as x) |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setScale`](Line3D.md#setscale)

***

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L213)

Swaps the order (indices) of two child objects within the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | First child object |
| `child2` | [`Mesh`](Mesh.md) | Second child object |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`swapChildren`](Line3D.md#swapchildren)

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

[`Line3D`](Line3D.md).[`swapChildrenAt`](Line3D.md#swapchildrenat)

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

#### Inherited from

[`Line3D`](Line3D.md).[`worldToLocal`](Line3D.md#worldtolocal)

</details>
