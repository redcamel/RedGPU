[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SpriteSheet3D

# Class: SpriteSheet3D

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L35)

Class that displays sprite sheet animations in 3D space.

Automatically calculates horizontal and vertical ratios (`renderRatioX`, `renderRatioY`) from the aspect ratio of a single frame segment, with billboard orientation (`useBillboard`) and size mode (`usePixelSize`: `worldSize` or `pixelSize`) operating independently.

***

### Example
```typescript
const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, info);
scene.addChild(spriteSheet);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/sprite/spriteSheet3D/" style="width:100%; height:500px;"></iframe>

## See

- [SpriteSheet3D Basic Example](https://redcamel.github.io/RedGPU/examples/3d/sprite/spriteSheet3D/)
 - [SpriteSheet3D Comparison (World vs Pixel)](https://redcamel.github.io/RedGPU/examples/3d/sprite/spriteSheet3DCompare/)
 - [SpriteSheet3D MouseEvent Example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/spriteSheet3D/)

## Extends

- [`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md)

## Constructors



***

### Constructor

> **new SpriteSheet3D**(`redGPUContext`, `spriteSheetInfo`): `SpriteSheet3D`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:62](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L62)

Creates a SpriteSheet3D instance.

#### Example
```typescript
const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, info);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `spriteSheetInfo` | [`SpriteSheetInfo`](SpriteSheetInfo.md) | Sprite sheet definition (`SpriteSheetInfo`) instance |

#### Returns

`SpriteSheet3D`

#### Overrides

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`constructor`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#constructor)

## Properties



## Accessors



***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:209](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L209)

Returns the internal fixed `Plane` geometry. Cannot be changed externally.

##### Throws

Throws an error if a new geometry is assigned.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Geometry instance

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L213)

Returns the current geometry. Attempting to change the geometry throws an error.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) |

##### Returns

`void`

Geometry instance

#### Overrides

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`geometry`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#geometry)

***

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:228](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L228)

Returns the internal fixed material. Cannot be changed externally.

##### Throws

Throws an error if a new material is assigned.

##### Returns

`any`

Material instance

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:232](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L232)

Returns the current material. Attempting to change the material throws an error.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `any` |

##### Returns

`void`

Material instance

#### Overrides

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`material`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#material)

***

***

### pixelSize

#### Get Signature

> **get** **pixelSize**(): `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:132](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L132)

Returns or sets the vertical pixel size (in px; defaults to single segment height if unspecified) in fixed pixel size mode (`usePixelSize: true`).

##### Returns

`number`

Vertical pixel size (unit: px)

#### Set Signature

> **set** **pixelSize**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L136)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### renderRatioX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderRatioX**(): `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:182](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L182)

Returns the horizontal rendering scale ratio calculated from the segment aspect ratio and current size mode.

##### Returns

`number`

Horizontal rendering ratio

***

***

### renderRatioY

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderRatioY**(): `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:194](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L194)

Returns the vertical rendering scale ratio calculated from the current size mode.

##### Returns

`number`

Vertical rendering ratio

***

***

### useBillboard

#### Get Signature

> **get** **useBillboard**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:94](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L94)

Returns or sets whether billboard mode (always facing the camera) is enabled. (Default: `true`)

##### Returns

`boolean`

Whether billboard mode is enabled

#### Set Signature

> **set** **useBillboard**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L98)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### usePixelSize

#### Get Signature

> **get** **usePixelSize**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:156](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L156)

Returns or sets whether screen-fixed pixel size (`pixelSize`) mode is enabled regardless of camera distance. (Default: `false`)

##### Returns

`boolean`

Whether fixed pixel size mode is enabled

#### Set Signature

> **set** **usePixelSize**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L160)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### worldSize

#### Get Signature

> **get** **worldSize**(): `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:114](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L114)

Returns or sets the vertical size in world units when in world size mode (`usePixelSize: false`). (Default: `1`)

##### Returns

`number`

Vertical size in world space

#### Set Signature

> **set** **worldSize**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:118](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L118)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:256](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L256)

Creates the custom vertex shader module dedicated to `SpriteSheet3D`.

#### Returns

`GPUShaderModule`

Created `GPUShaderModule` instance

#### Overrides

`ASpriteSheet.createCustomMeshVertexShaderModule`

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:244](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L244)

Updates the current frame state and renders the sprite sheet.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Render state data of the current view |

#### Returns

`void`

#### Overrides

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`render`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#render)

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:301](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L301)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`_geometry`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#_geometry)

***

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:279](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L279)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`_material`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#_material)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`animationInfo`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#animationinfo)

***

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L99)

Whether to cast shadows

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`castShadow`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#castshadow)

***

***

### currentIndex

> **currentIndex**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:39](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L39)

Current frame index

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`currentIndex`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#currentindex)

***

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L104)

Whether LOD info needs update

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`dirtyLOD`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#dirtylod)

***

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L74)

Whether the opacity needs to be updated.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`dirtyOpacity`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#dirtyopacity)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L64)

Whether the render pipeline needs to be updated.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`dirtyPipeline`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#dirtypipeline)

***

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L69)

Whether the transform matrix needs to be updated.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`dirtyTransform`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#dirtytransform)

***

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L50)

Whether to disable TAA jitter

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`disableJitter`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#disablejitter)

***

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L59)

GLTFLoader instance information that loaded this object.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`gltfLoaderInfo`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#gltfloaderinfo)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L37)

GPU vertex render information object.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`gpuRenderInfo`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#gpurenderinfo)

***

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L60)

Identifier to determine if it is a Mesh instance

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`isInstanceofMesh`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#isinstanceofmesh)

***

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L84)

Local transformation matrix relative to the parent.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`localMatrix`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#localmatrix)

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L79)

Model matrix with world transformation applied.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`modelMatrix`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#modelmatrix)

***

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L89)

Normal model matrix used for normal vector transformation.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`normalModelMatrix`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#normalmodelmatrix)

***

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L109)

Whether it passed frustum culling

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`passFrustumCulling`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#passfrustumculling)

***

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L45)

Whether to receive shadows

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`receiveShadow`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#receiveshadow)

***

***

### segmentH

> **segmentH**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L29)

Number of vertical segments

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`segmentH`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#segmenth)

***

***

### segmentW

> **segmentW**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L24)

Number of horizontal segments

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`segmentW`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#segmentw)

***

***

### totalFrame

> **totalFrame**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:34](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L34)

Total number of frames

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`totalFrame`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#totalframe)

***

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:55](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L55)

Whether to use displacement texture

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`useDisplacementTexture`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#usedisplacementtexture)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`boundingAABB`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#boundingaabb)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`boundingOBB`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#boundingobb)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`children`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#children)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`combinedBoundingAABB`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#combinedboundingaabb)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`currentShaderModuleName`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#currentshadermodulename)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`depthStencilState`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#depthstencilstate)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`drawBufferManager`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#drawbuffermanager)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`drawCommandSlot`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#drawcommandslot)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`drawDebugger`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#drawdebugger)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`enableDebugger`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#enabledebugger)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`enableWaterInteraction`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#enablewaterinteraction)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`events`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#events)

***

***

### frameRate

#### Get Signature

> **get** **frameRate**(): `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L131)

Returns or sets the frame rate (FPS). Negative values are clamped to `0`.

##### Returns

`number`

Frames per second (FPS)

#### Set Signature

> **set** **frameRate**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:135](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L135)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`frameRate`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#framerate)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`globalVertexSlotIndex`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#globalvertexslotindex)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`gpuDevice`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#gpudevice)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`ignoreFrustumCulling`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#ignorefrustumculling)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`instanceId`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#instanceid)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`LODManager`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#lodmanager)

***

***

### loop

#### Get Signature

> **get** **loop**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L115)

Returns or sets whether the animation loops.

##### Returns

`boolean`

Whether playback loops

#### Set Signature

> **set** **loop**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:119](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L119)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`loop`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#loop)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`minScreenSpaceSize`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#minscreenspacesize)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`name`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#name)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`numChildren`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#numchildren)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`opacity`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#opacity)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`parent`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#parent)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pickingId`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pickingid)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pivotX`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pivotx)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pivotY`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pivoty)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pivotZ`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pivotz)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`position`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#position)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`primitiveState`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#primitivestate)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`redGPUContext`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#redgpucontext)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`rotation`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#rotation)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`rotationX`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#rotationx)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`rotationY`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#rotationy)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`rotationZ`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#rotationz)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`scale`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#scale)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`scaleX`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#scalex)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`scaleY`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#scaley)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`scaleZ`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#scalez)

***

***

### spriteSheetInfo

#### Get Signature

> **get** **spriteSheetInfo**(): [`SpriteSheetInfo`](SpriteSheetInfo.md)

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L184)

Returns or sets the applied sprite sheet information.

##### Returns

[`SpriteSheetInfo`](SpriteSheetInfo.md)

SpriteSheetInfo instance

#### Set Signature

> **set** **spriteSheetInfo**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L188)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`SpriteSheetInfo`](SpriteSheetInfo.md) |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`spriteSheetInfo`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#spritesheetinfo)

***

***

### state

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **state**(): `string`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:103](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L103)

Returns the current animation playback state.

##### Returns

`string`

Playback state string (`'play'`, `'pause'`, `'stop'`)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`state`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#state)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`useScreenSpaceSizeCulling`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#usescreenspacesizeculling)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`uuid`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#uuid)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`vertexStateBuffers`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#vertexstatebuffers)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`waterWaveStrength`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#waterwavestrength)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`x`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#x)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`y`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#y)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`z`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#z)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`addChild`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#addchild)

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `SpriteSheet3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L115)

Inserts a child object at the specified index position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |
| `index` | `number` | Index position to insert at |

#### Returns

`SpriteSheet3D`

Current container instance

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`addChildAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#addchildat)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`addListener`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#addlistener)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`clone`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#clone)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`contains`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#contains)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`createMeshVertexShaderModuleBASIC`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#createmeshvertexshadermodulebasic)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1740](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1740)

Destroys the Mesh instance and immediately releases the allocated draw command slots, global buffer slots, and resources.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`destroy`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#destroy)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`getChildAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#getchildat)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`getChildIndex`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#getchildindex)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`getCombinedOpacity`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#getcombinedopacity)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`getScreenPoint`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#getscreenpoint)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1687](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1687)

Initializes the mesh's GPU render info (VertexGPURenderInfo) and updates the pipeline.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`initGPURenderInfos`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#initgpurenderinfos)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`localToWorld`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#localtoworld)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`lookAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#lookat)

***

***

### pause()

> **pause**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:214](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L214)

Pauses the animation at the current frame and changes the state to `'pause'`.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pause`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pause)

***

***

### play()

> **play**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:204](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L204)

Starts animation playback and changes the state to `'play'`.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`play`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#play)

***

***

### removeAllChildren()

> **removeAllChildren**(): `SpriteSheet3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L309)

Removes all child objects from the container.

#### Returns

`SpriteSheet3D`

Current container instance

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`removeAllChildren`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#removeallchildren)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`removeChild`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#removechild)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`removeChildAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#removechildat)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setCastShadowRecursively`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setcastshadowrecursively)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setChildIndex`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setchildindex)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setEnableDebuggerRecursively`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setenabledebuggerrecursively)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setIgnoreFrustumCullingRecursively`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setignorefrustumcullingrecursively)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setPosition`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setposition)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setReceiveShadowRecursively`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setreceiveshadowrecursively)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setRotation`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setrotation)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setScale`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setscale)

***

***

### stop()

> **stop**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:223](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L223)

Stops the animation, resets to the first frame (`0`), and changes the state to `'stop'`.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`stop`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#stop)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`swapChildren`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#swapchildren)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`swapChildrenAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#swapchildrenat)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`worldToLocal`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#worldtolocal)

</details>
