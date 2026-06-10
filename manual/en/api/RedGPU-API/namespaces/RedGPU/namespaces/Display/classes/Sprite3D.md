[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / Sprite3D

# Class: Sprite3D

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:26](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L26)

2D sprite object that always faces the camera in 3D space.

A class that inherits from Mesh and provides billboard functionality. A billboard is a flat object placed in 3D space but always facing the camera, useful for displaying UI elements, particles, text, icons, etc., in a 3D scene.

### Example
```typescript
const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
scene.addChild(sprite);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/sprite/sprite3D/"></iframe>

Below is a list of additional sample examples to help understand the structure and operation of Sprite3D.

## See

 - [Sprite3D Basic example](https://redcamel.github.io/RedGPU/examples/3d/sprite/sprite3D/)
 - [Sprite3D Comparison (World vs Pixel)](https://redcamel.github.io/RedGPU/examples/3d/sprite/sprite3DCompare/)
 - [Sprite3D MouseEvent example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/sprite3D/)

## Extends

- [`Mesh`](Mesh.md)

## Constructors

### Constructor

> **new Sprite3D**(`redGPUContext`, `material?`, `geometry?`): `Sprite3D`

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:89](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L89)

Creates a new Sprite3D instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU rendering context |
| `material?` | `any` | Material to apply to the sprite (optional) |
| `geometry?` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) | Geometry of the sprite (default: new Plane instance) |

#### Returns

`Sprite3D`

#### Inherited from

[`Mesh`](Mesh.md).[`constructor`](Mesh.md#constructor)

## Properties

### \_renderRatioX

> **\_renderRatioX**: `number`

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:36](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L36)

X-axis rendering ratio

***

### \_renderRatioY

> **\_renderRatioY**: `number`

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:41](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L41)

Y-axis rendering ratio

***

### useBillboard

> **useBillboard**: `boolean`

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:31](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L31)

Whether to use billboard mode (if true, always faces the camera)

***

### pixelSize

#### Get Signature

> **get** **pixelSize**(): `number`

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:153](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L153)

Returns the fixed pixel size value (in px).

##### Returns

`number`

#### Set Signature

> **set** **pixelSize**(`value`): `void`

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:164](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L164)

Sets the fixed pixel size value (in px). Only applied when usePixelSize is true.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Pixel size to set |

##### Returns

`void`

***

### usePixelSize

#### Get Signature

> **get** **usePixelSize**(): `boolean`

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:124](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L124)

Returns whether to use fixed pixel size mode.

##### Returns

`boolean`

#### Set Signature

> **set** **usePixelSize**(`value`): `void`

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:135](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L135)

Sets whether to use fixed pixel size mode. If true, it is rendered at the size set in pixelSize regardless of distance.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use |

##### Returns

`void`

***

### worldSize

#### Get Signature

> **get** **worldSize**(): `number`

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:103](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L103)

Returns the vertical size of the sprite in world space (Unit).

##### Returns

`number`

#### Set Signature

> **set** **worldSize**(`value`): `void`

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:114](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L114)

Sets the vertical size of the sprite in world space (Unit). The horizontal size is automatically adjusted based on the texture's aspect ratio.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | World size to set |

##### Returns

`void`

***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:217](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L217)

Creates a custom vertex shader module dedicated to Sprite3D.

Supports billboard functionality and creates a shader that dynamically calculates vertex positions based on camera direction.

#### Returns

`GPUShaderModule`

Created GPU shader module

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:361](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L361)

#### Inherited from

[`Mesh`](Mesh.md).[`_geometry`](Mesh.md#_geometry)

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:335](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L335)

#### Inherited from

[`Mesh`](Mesh.md).[`_material`](Mesh.md#_material)

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L32)

#### animationsList

> **animationsList**: `GLTFParsedSingleClip`[]

#### jointBuffer

> **jointBuffer**: [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

#### morphInfo

> **morphInfo**: `MorphInfo_GLTF`

#### skinInfo

> **skinInfo**: `ParsedSkinInfo_GLTF`

#### weightBuffer

> **weightBuffer**: [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

#### Inherited from

[`Mesh`](Mesh.md).[`animationInfo`](Mesh.md#animationinfo)

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:86](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L86)

Whether to cast shadows

#### Inherited from

[`Mesh`](Mesh.md).[`castShadow`](Mesh.md#castshadow)

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:91](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L91)

Whether LOD info needs update

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyLOD`](Mesh.md#dirtylod)

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:48](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L48)

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyOpacity`](Mesh.md#dirtyopacity)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:46](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L46)

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyPipeline`](Mesh.md#dirtypipeline)

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:47](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L47)

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyTransform`](Mesh.md#dirtytransform)

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:42](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L42)

#### Inherited from

[`Mesh`](Mesh.md).[`disableJitter`](Mesh.md#disablejitter)

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:45](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L45)

#### Inherited from

[`Mesh`](Mesh.md).[`gltfLoaderInfo`](Mesh.md#gltfloaderinfo)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:31](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L31)

#### Inherited from

[`Mesh`](Mesh.md).[`gpuRenderInfo`](Mesh.md#gpurenderinfo)

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:44](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L44)

#### Inherited from

[`Mesh`](Mesh.md).[`isInstanceofMesh`](Mesh.md#isinstanceofmesh)

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:50](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L50)

#### Inherited from

[`Mesh`](Mesh.md).[`localMatrix`](Mesh.md#localmatrix)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:49](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L49)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

[`Mesh`](Mesh.md).[`modelMatrix`](Mesh.md#modelmatrix)

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:51](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L51)

#### Inherited from

[`Mesh`](Mesh.md).[`normalModelMatrix`](Mesh.md#normalmodelmatrix)

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:96](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L96)

Whether it passed frustum culling

#### Inherited from

[`Mesh`](Mesh.md).[`passFrustumCulling`](Mesh.md#passfrustumculling)

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:41](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L41)

#### Inherited from

[`Mesh`](Mesh.md).[`receiveShadow`](Mesh.md#receiveshadow)

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:43](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L43)

#### Inherited from

[`Mesh`](Mesh.md).[`useDisplacementTexture`](Mesh.md#usedisplacementtexture)

## Accessors

### boundingAABB

#### Get Signature

> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:750](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L750)

Returns the AABB (Axis-Aligned Bounding Box) information.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Mesh`](Mesh.md).[`boundingAABB`](Mesh.md#boundingaabb)

***

### boundingOBB

#### Get Signature

> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:737](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L737)

Returns the OBB (Oriented Bounding Box) information.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

#### Inherited from

[`Mesh`](Mesh.md).[`boundingOBB`](Mesh.md#boundingobb)

***

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:44](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L44)

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 객체 배열

#### Inherited from

[`Mesh`](Mesh.md).[`children`](Mesh.md#children)

***

### combinedBoundingAABB

#### Get Signature

> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:763](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L763)

Returns the combined AABB information including child objects.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Mesh`](Mesh.md).[`combinedBoundingAABB`](Mesh.md#combinedboundingaabb)

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:67](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L67)

##### Returns

`string`

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:71](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L71)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`currentShaderModuleName`](Mesh.md#currentshadermodulename)

***

### depthStencilState

#### Get Signature

> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:80](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L80)

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

#### Inherited from

[`Mesh`](Mesh.md).[`depthStencilState`](Mesh.md#depthstencilstate)

***

### drawDebugger

#### Get Signature

> **get** **drawDebugger**(): [`DrawDebuggerMesh`](../namespaces/drawDebugger/classes/DrawDebuggerMesh.md)

Defined in: [src/display/mesh/Mesh.ts:331](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L331)

Returns the debug mesh object.

##### Returns

[`DrawDebuggerMesh`](../namespaces/drawDebugger/classes/DrawDebuggerMesh.md)

#### Inherited from

[`Mesh`](Mesh.md).[`drawDebugger`](Mesh.md#drawdebugger)

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:311](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L311)

Returns whether the debugger is enabled.

##### Returns

`boolean`

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:322](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L322)

Sets whether the debugger is enabled.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to enable |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`enableDebugger`](Mesh.md#enabledebugger)

***

### events

#### Get Signature

> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:435](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L435)

Returns the registered events.

##### Returns

`any`

#### Inherited from

[`Mesh`](Mesh.md).[`events`](Mesh.md#events)

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:366](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L366)

Returns the geometry.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:377](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L377)

Sets the geometry.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) | Geometry to set |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`geometry`](Mesh.md#geometry)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:88](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L88)

Retrieves the GPU device associated with the current instance.

##### Returns

`GPUDevice`

The GPU device.

#### Inherited from

[`Mesh`](Mesh.md).[`gpuDevice`](Mesh.md#gpudevice)

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:408](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L408)

Returns whether to ignore frustum culling.

##### Returns

`boolean`

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:419](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L419)

Sets whether to ignore frustum culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to ignore |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`ignoreFrustumCulling`](Mesh.md#ignorefrustumculling)

***

### LODManager

#### Get Signature

> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:303](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L303)

Returns the LOD (Level of Detail) manager.

##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager instance

#### Inherited from

[`Mesh`](Mesh.md).[`LODManager`](Mesh.md#lodmanager)

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/mesh/Mesh.ts:340](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L340)

Returns the material.

##### Returns

`any`

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:351](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L351)

Sets the material.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | Material to set |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`material`](Mesh.md#material)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/BaseObject.ts#L71)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`name`](Mesh.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:52](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L52)

자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 수

#### Inherited from

[`Mesh`](Mesh.md).[`numChildren`](Mesh.md#numchildren)

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:387](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L387)

Returns the opacity of the mesh. (0~1)

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:398](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L398)

Sets the opacity of the mesh. (0~1)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Opacity value |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`opacity`](Mesh.md#opacity)

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:451](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L451)

Returns the set parent object.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:462](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L462)

Sets the parent object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) | Parent container |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`parent`](Mesh.md#parent)

***

### pickingId

#### Get Signature

> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:427](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L427)

Returns the picking ID.

##### Returns

`number`

#### Inherited from

[`Mesh`](Mesh.md).[`pickingId`](Mesh.md#pickingid)

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:470](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L470)

Returns the pivot X coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:481](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L481)

Sets the pivot X coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X coordinate |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotX`](Mesh.md#pivotx)

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:490](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L490)

Returns the pivot Y coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:501](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L501)

Sets the pivot Y coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y coordinate |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotY`](Mesh.md#pivoty)

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:510](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L510)

Returns the pivot Z coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:521](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L521)

Sets the pivot Z coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotZ`](Mesh.md#pivotz)

***

### position

#### Get Signature

> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:593](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L593)

Returns the current position. [x, y, z]

##### Returns

`Float32Array`

Position array

#### Inherited from

[`Mesh`](Mesh.md).[`position`](Mesh.md#position)

***

### primitiveState

#### Get Signature

> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:76](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L76)

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

#### Inherited from

[`Mesh`](Mesh.md).[`primitiveState`](Mesh.md#primitivestate)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:97](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L97)

Retrieves the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

The RedGPUContext instance.

#### Inherited from

[`Mesh`](Mesh.md).[`redGPUContext`](Mesh.md#redgpucontext)

***

### rotation

#### Get Signature

> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:729](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L729)

Returns the current rotation values. [x, y, z] (degrees)

##### Returns

`Float32Array`

#### Inherited from

[`Mesh`](Mesh.md).[`rotation`](Mesh.md#rotation)

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:669](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L669)

Returns the X-axis rotation value. (degrees)

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:680](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L680)

Sets the X-axis rotation value. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationX`](Mesh.md#rotationx)

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:689](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L689)

Returns the Y-axis rotation value. (degrees)

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:700](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L700)

Sets the Y-axis rotation value. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationY`](Mesh.md#rotationy)

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:709](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L709)

Returns the Z-axis rotation value. (degrees)

##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:720](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L720)

Sets the Z-axis rotation value. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationZ`](Mesh.md#rotationz)

***

### scale

#### Get Signature

> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:661](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L661)

Returns the current scale. [x, y, z]

##### Returns

`Float32Array`

#### Inherited from

[`Mesh`](Mesh.md).[`scale`](Mesh.md#scale)

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:601](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L601)

Returns the X-axis scale.

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:612](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L612)

Sets the X-axis scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleX`](Mesh.md#scalex)

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:621](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L621)

Returns the Y-axis scale.

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:632](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L632)

Sets the Y-axis scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleY`](Mesh.md#scaley)

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:641](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L641)

Returns the Z-axis scale.

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:652](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L652)

Sets the Z-axis scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleZ`](Mesh.md#scalez)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`Mesh`](Mesh.md).[`uuid`](Mesh.md#uuid)

***

### vertexStateBuffers

#### Get Signature

> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:443](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L443)

Returns the vertex state buffer layouts.

##### Returns

`GPUVertexBufferLayout`[]

#### Inherited from

[`Mesh`](Mesh.md).[`vertexStateBuffers`](Mesh.md#vertexstatebuffers)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:530](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L530)

Returns the X position coordinate.

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:541](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L541)

Sets the X position coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X coordinate |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`x`](Mesh.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:550](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L550)

Returns the Y position coordinate.

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:561](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L561)

Sets the Y position coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y coordinate |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`y`](Mesh.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:570](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L570)

Returns the Z position coordinate.

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:581](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L581)

Sets the Z position coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`z`](Mesh.md#z)

## Methods

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:71](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L71)

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

[`Mesh`](Mesh.md).[`addChild`](Mesh.md#addchild)

***

### addChildAt()

> **addChildAt**(`child`, `index`): `Sprite3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L89)

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`Sprite3D`

현재 컨테이너

#### Inherited from

[`Mesh`](Mesh.md).[`addChildAt`](Mesh.md#addchildat)

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:864](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L864)

Adds an event listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | Event name |
| `callback` | `Function` | Callback function |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`addListener`](Mesh.md#addlistener)

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:974](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L974)

**`Experimental`**

Clones the mesh.

#### Returns

[`Mesh`](Mesh.md)

Cloned Mesh instance

#### Inherited from

[`Mesh`](Mesh.md).[`clone`](Mesh.md#clone)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:61](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L61)

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`Mesh`](Mesh.md).[`contains`](Mesh.md#contains)

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1681](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L1681)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `VERTEX_SHADER_MODULE_NAME` | `any` |
| `SHADER_INFO` | `any` |
| `UNIFORM_STRUCT_BASIC` | `any` |
| `vertexModuleSource` | `any` |

#### Returns

`GPUShaderModule`

#### Inherited from

[`Mesh`](Mesh.md).[`createMeshVertexShaderModuleBASIC`](Mesh.md#createmeshvertexshadermodulebasic)

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:111](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L111)

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

[`Mesh`](Mesh.md).[`getChildAt`](Mesh.md#getchildat)

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:125](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L125)

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

[`Mesh`](Mesh.md).[`getChildIndex`](Mesh.md#getchildindex)

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:846](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L846)

Calculates and returns the combined opacity considering the parent hierarchy.

#### Returns

`number`

Combined opacity value

#### Inherited from

[`Mesh`](Mesh.md).[`getCombinedOpacity`](Mesh.md#getcombinedopacity)

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:109](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L109)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](View3D.md) |

#### Returns

\[`number`, `number`\]

#### Inherited from

[`Mesh`](Mesh.md).[`getScreenPoint`](Mesh.md#getscreenpoint)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1667](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L1667)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`initGPURenderInfos`](Mesh.md#initgpurenderinfos)

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:105](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L105)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`Mesh`](Mesh.md).[`localToWorld`](Mesh.md#localtoworld)

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:882](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L882)

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

[`Mesh`](Mesh.md).[`lookAt`](Mesh.md#lookat)

***

### removeAllChildren()

> **removeAllChildren**(): `Sprite3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:234](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L234)

모든 자식 객체를 제거합니다.

#### Returns

`Sprite3D`

현재 컨테이너

#### Inherited from

[`Mesh`](Mesh.md).[`removeAllChildren`](Mesh.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:203](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L203)

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`Mesh`](Mesh.md).[`removeChild`](Mesh.md#removechild)

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:219](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L219)

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`Mesh`](Mesh.md).[`removeChildAt`](Mesh.md#removechildat)

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/sprites/sprite3D/Sprite3D.ts:183](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/sprites/sprite3D/Sprite3D.ts#L183)

Renders the sprite every frame. Automatically syncs physical resolution when texture loading is complete.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Current render view state data |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`render`](Mesh.md#render)

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:792](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L792)

Sets shadow casting for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | Whether to cast (default: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setCastShadowRecursively`](Mesh.md#setcastshadowrecursively)

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:140](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L140)

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setChildIndex`](Mesh.md#setchildindex)

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:774](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L774)

Sets the debugger visibility for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger` | `boolean` | `false` | Whether to enable (default: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setEnableDebuggerRecursively`](Mesh.md#setenabledebuggerrecursively)

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:828](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L828)

Sets whether to ignore frustum culling for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | Whether to ignore (default: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setIgnoreFrustumCullingRecursively`](Mesh.md#setignorefrustumcullingrecursively)

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:933](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L933)

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

[`Mesh`](Mesh.md).[`setPosition`](Mesh.md#setposition)

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:810](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L810)

Sets shadow receiving for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | Whether to receive (default: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setReceiveShadowRecursively`](Mesh.md#setreceiveshadowrecursively)

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:956](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L956)

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

[`Mesh`](Mesh.md).[`setRotation`](Mesh.md#setrotation)

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:910](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/Mesh.ts#L910)

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

[`Mesh`](Mesh.md).[`setScale`](Mesh.md#setscale)

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L163)

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`swapChildren`](Mesh.md#swapchildren)

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:183](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/Object3DContainer.ts#L183)

두 인덱스의 자식 객체 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`swapChildrenAt`](Mesh.md#swapchildrenat)

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:101](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/mesh/core/MeshBase.ts#L101)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`Mesh`](Mesh.md).[`worldToLocal`](Mesh.md#worldtolocal)


</details>
