[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreTextField](../README.md) / ATextField

# Class: ATextField

Defined in: [src/display/textFileds/core/ATextField.ts:12](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L12)


Abstract base class for text field objects.


Includes common logic for converting text to bitmap textures using HTML/SVG and using them as diffuse textures for meshes.

::: warning

This class is an abstract class used internally by the system.<br/>Do not create instances directly.
:::

## Extends

- [`Mesh`](../../../classes/Mesh.md)

## Extended by

- [`TextField3D`](../../../classes/TextField3D.md)

## Constructors

### Constructor

> **new ATextField**(`redGPUContext`, `imgOnload`, `mode3dYn`): `ATextField`

Defined in: [src/display/textFileds/core/ATextField.ts:83](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L83)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` |
| `imgOnload` | `Function` | `undefined` |
| `mode3dYn` | `boolean` | `true` |

#### Returns

`ATextField`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`constructor`](../../../classes/Mesh.md#constructor)

## Properties

### \_geometry

> **\_geometry**: [`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:374](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L374)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`_geometry`](../../../classes/Mesh.md#_geometry)

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:349](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L349)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`_material`](../../../classes/Mesh.md#_material)

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:33](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L33)

#### animationsList

> **animationsList**: `GLTFParsedSingleClip`[]

#### jointBuffer

> **jointBuffer**: [`IndexBuffer`](../../../../Resource/classes/IndexBuffer.md)

#### morphInfo

> **morphInfo**: `MorphInfo_GLTF`

#### skinInfo

> **skinInfo**: `ParsedSkinInfo_GLTF`

#### weightBuffer

> **weightBuffer**: [`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`animationInfo`](../../../classes/Mesh.md#animationinfo)

***

### background

> **background**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:18](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L18)

***

### border

> **border**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:25](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L25)

***

### borderRadius

> **borderRadius**: `string` \| `number`

Defined in: [src/display/textFileds/core/ATextField.ts:26](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L26)

***

### boxShadow

> **boxShadow**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:27](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L27)

***

### boxSizing

> **boxSizing**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:28](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L28)

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:93](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L93)


Whether to cast shadows

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`castShadow`](../../../classes/Mesh.md#castshadow)

***

### color

> **color**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:17](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L17)

***

### createCustomMeshVertexShaderModule()?

> `optional` **createCustomMeshVertexShaderModule**: () => `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:108](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L108)


Function to create custom vertex shader module

#### Returns

`GPUShaderModule`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`createCustomMeshVertexShaderModule`](../../../classes/Mesh.md#createcustommeshvertexshadermodule)

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:98](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L98)


Whether LOD info needs update

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`dirtyLOD`](../../../classes/Mesh.md#dirtylod)

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:49](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L49)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`dirtyOpacity`](../../../classes/Mesh.md#dirtyopacity)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:47](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L47)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`dirtyPipeline`](../../../classes/Mesh.md#dirtypipeline)

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:48](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L48)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`dirtyTransform`](../../../classes/Mesh.md#dirtytransform)

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L45)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`disableJitter`](../../../classes/Mesh.md#disablejitter)

***

### displacementTexture

> **displacementTexture**: [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/display/mesh/Mesh.ts:88](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L88)


Displacement texture of the mesh

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`displacementTexture`](../../../classes/Mesh.md#displacementtexture)

***

### filter

> **filter**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:29](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L29)

***

### fontFamily

> **fontFamily**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:14](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L14)

***

### fontSize

> **fontSize**: `number`

Defined in: [src/display/textFileds/core/ATextField.ts:13](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L13)

***

### fontStyle

> **fontStyle**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:16](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L16)

***

### fontWeight

> **fontWeight**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:15](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L15)

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:46](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L46)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`gltfLoaderInfo`](../../../classes/Mesh.md#gltfloaderinfo)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../../CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L32)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`gpuRenderInfo`](../../../classes/Mesh.md#gpurenderinfo)

***

### letterSpacing

> **letterSpacing**: `number`

Defined in: [src/display/textFileds/core/ATextField.ts:20](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L20)

***

### lineHeight

> **lineHeight**: `number`

Defined in: [src/display/textFileds/core/ATextField.ts:24](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L24)

***

### localMatrix

> **localMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:51](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L51)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`localMatrix`](../../../classes/Mesh.md#localmatrix)

***

### meshType

> **meshType**: `string`

Defined in: [src/display/mesh/Mesh.ts:46](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L46)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`meshType`](../../../classes/Mesh.md#meshtype)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:50](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L50)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`modelMatrix`](../../../classes/Mesh.md#modelmatrix)

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:52](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L52)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`normalModelMatrix`](../../../classes/Mesh.md#normalmodelmatrix)

***

### padding

> **padding**: `number`

Defined in: [src/display/textFileds/core/ATextField.ts:19](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L19)

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:103](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L103)


Whether it passed frustum culling

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`passFrustumCulling`](../../../classes/Mesh.md#passfrustumculling)

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:44](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L44)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`receiveShadow`](../../../classes/Mesh.md#receiveshadow)

***

### textAlign

> **textAlign**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:23](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L23)

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:47](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L47)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`useDisplacementTexture`](../../../classes/Mesh.md#usedisplacementtexture)

***

### verticalAlign

> **verticalAlign**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:22](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L22)

***

### wordBreak

> **wordBreak**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:21](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L21)

## Accessors

### boundingAABB

#### Get Signature

> **get** **boundingAABB**(): [`AABB`](../../../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:783](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L783)


Returns the AABB (Axis-Aligned Bounding Box) information.

##### Returns

[`AABB`](../../../../Bound/classes/AABB.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`boundingAABB`](../../../classes/Mesh.md#boundingaabb)

***

### boundingOBB

#### Get Signature

> **get** **boundingOBB**(): [`OBB`](../../../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:770](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L770)


Returns the OBB (Oriented Bounding Box) information.

##### Returns

[`OBB`](../../../../Bound/classes/OBB.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`boundingOBB`](../../../classes/Mesh.md#boundingobb)

***

### children

#### Get Signature

> **get** **children**(): [`Mesh`](../../../classes/Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:42](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L42)

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](../../../classes/Mesh.md)[]

자식 객체 배열

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`children`](../../../classes/Mesh.md#children)

***

### combinedBoundingAABB

#### Get Signature

> **get** **combinedBoundingAABB**(): [`AABB`](../../../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:796](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L796)


Returns the combined AABB information including child objects.

##### Returns

[`AABB`](../../../../Bound/classes/AABB.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`combinedBoundingAABB`](../../../classes/Mesh.md#combinedboundingaabb)

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L79)

##### Returns

`string`

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:83](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L83)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`currentShaderModuleName`](../../../classes/Mesh.md#currentshadermodulename)

***

### depthStencilState

#### Get Signature

> **get** **depthStencilState**(): [`DepthStencilState`](../../../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:92](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L92)

##### Returns

[`DepthStencilState`](../../../../RenderState/classes/DepthStencilState.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`depthStencilState`](../../../classes/Mesh.md#depthstencilstate)

***

### drawDebugger

#### Get Signature

> **get** **drawDebugger**(): `DrawDebuggerMesh`

Defined in: [src/display/mesh/Mesh.ts:345](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L345)


Returns the debug mesh object.

##### Returns

`DrawDebuggerMesh`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`drawDebugger`](../../../classes/Mesh.md#drawdebugger)

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:325](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L325)


Returns whether the debugger is enabled.

##### Returns

`boolean`

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:336](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L336)


Sets whether the debugger is enabled.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to enable |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`enableDebugger`](../../../classes/Mesh.md#enabledebugger)

***

### events

#### Get Signature

> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:448](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L448)


Returns the registered events.

##### Returns

`any`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`events`](../../../classes/Mesh.md#events)

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:379](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L379)


Returns the geometry.

##### Returns

[`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:390](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L390)


Sets the geometry.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md) | Geometry to set |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`geometry`](../../../classes/Mesh.md#geometry)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:100](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L100)

Retrieves the GPU device associated with the current instance.

##### Returns

`GPUDevice`

The GPU device.

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`gpuDevice`](../../../classes/Mesh.md#gpudevice)

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:421](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L421)


Returns whether to ignore frustum culling.

##### Returns

`boolean`

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:432](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L432)


Sets whether to ignore frustum culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to ignore |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`ignoreFrustumCulling`](../../../classes/Mesh.md#ignorefrustumculling)

***

### LODManager

#### Get Signature

> **get** **LODManager**(): [`LODManager`](../../CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:317](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L317)


Returns the LOD (Level of Detail) manager.

##### Returns

[`LODManager`](../../CoreMesh/classes/LODManager.md)


LODManager instance

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`LODManager`](../../../classes/Mesh.md#lodmanager)

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/mesh/Mesh.ts:354](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L354)


Returns the material.

##### Returns

`any`

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:365](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L365)


Sets the material.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | Material to set |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`material`](../../../classes/Mesh.md#material)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/display/mesh/Mesh.ts:456](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L456)


Returns the name of the mesh.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:468](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L468)


Sets the name of the mesh.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Mesh name |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`name`](../../../classes/Mesh.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:50](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L50)

자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 수

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`numChildren`](../../../classes/Mesh.md#numchildren)

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:400](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L400)


Returns the opacity of the mesh. (0~1)

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:411](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L411)


Sets the opacity of the mesh. (0~1)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Opacity value |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`opacity`](../../../classes/Mesh.md#opacity)

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:484](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L484)


Returns the set parent object.

##### Returns

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:495](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L495)


Sets the parent object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md) | Parent container |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`parent`](../../../classes/Mesh.md#parent)

***

### pickingId

#### Get Signature

> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:440](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L440)


Returns the picking ID.

##### Returns

`number`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`pickingId`](../../../classes/Mesh.md#pickingid)

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:503](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L503)


Returns the pivot X coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:514](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L514)


Sets the pivot X coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X coordinate |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`pivotX`](../../../classes/Mesh.md#pivotx)

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:523](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L523)


Returns the pivot Y coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:534](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L534)


Sets the pivot Y coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y coordinate |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`pivotY`](../../../classes/Mesh.md#pivoty)

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:543](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L543)


Returns the pivot Z coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:554](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L554)


Sets the pivot Z coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`pivotZ`](../../../classes/Mesh.md#pivotz)

***

### position

#### Get Signature

> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:626](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L626)


Returns the current position. [x, y, z]

##### Returns

`Float32Array`


Position array

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`position`](../../../classes/Mesh.md#position)

***

### primitiveState

#### Get Signature

> **get** **primitiveState**(): [`PrimitiveState`](../../../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:88](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L88)

##### Returns

[`PrimitiveState`](../../../../RenderState/classes/PrimitiveState.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`primitiveState`](../../../classes/Mesh.md#primitivestate)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:109](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L109)

Retrieves the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

The RedGPUContext instance.

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`redGPUContext`](../../../classes/Mesh.md#redgpucontext)

***

### rotation

#### Get Signature

> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:762](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L762)


Returns the current rotation values. [x, y, z] (degrees)

##### Returns

`Float32Array`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`rotation`](../../../classes/Mesh.md#rotation)

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:702](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L702)


Returns the X-axis rotation value. (degrees)

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:713](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L713)


Sets the X-axis rotation value. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`rotationX`](../../../classes/Mesh.md#rotationx)

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:722](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L722)


Returns the Y-axis rotation value. (degrees)

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:733](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L733)


Sets the Y-axis rotation value. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`rotationY`](../../../classes/Mesh.md#rotationy)

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:742](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L742)


Returns the Z-axis rotation value. (degrees)

##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:753](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L753)


Sets the Z-axis rotation value. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`rotationZ`](../../../classes/Mesh.md#rotationz)

***

### scale

#### Get Signature

> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:694](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L694)


Returns the current scale. [x, y, z]

##### Returns

`Float32Array`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`scale`](../../../classes/Mesh.md#scale)

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:634](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L634)


Returns the X-axis scale.

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:645](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L645)


Sets the X-axis scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`scaleX`](../../../classes/Mesh.md#scalex)

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:654](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L654)


Returns the Y-axis scale.

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:665](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L665)


Sets the Y-axis scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`scaleY`](../../../classes/Mesh.md#scaley)

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:674](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L674)


Returns the Z-axis scale.

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:685](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L685)


Sets the Z-axis scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`scaleZ`](../../../classes/Mesh.md#scalez)

***

### text

#### Get Signature

> **get** **text**(): `string`

Defined in: [src/display/textFileds/core/ATextField.ts:113](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L113)

##### Returns

`string`

#### Set Signature

> **set** **text**(`text`): `void`

Defined in: [src/display/textFileds/core/ATextField.ts:117](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L117)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

##### Returns

`void`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:75](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L75)

Retrieves the UUID of the object.

##### Returns

`string`

The UUID of the object.

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`uuid`](../../../classes/Mesh.md#uuid)

***

### vertexStateBuffers

#### Get Signature

> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:476](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L476)


Returns the vertex state buffer layouts.

##### Returns

`GPUVertexBufferLayout`[]

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`vertexStateBuffers`](../../../classes/Mesh.md#vertexstatebuffers)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:563](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L563)


Returns the X position coordinate.

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:574](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L574)


Sets the X position coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X coordinate |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`x`](../../../classes/Mesh.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:583](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L583)


Returns the Y position coordinate.

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:594](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L594)


Sets the Y position coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y coordinate |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`y`](../../../classes/Mesh.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:603](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L603)


Returns the Z position coordinate.

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:614](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L614)


Sets the Z position coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`z`](../../../classes/Mesh.md#z)

## Methods

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList?`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:130](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L130)

Fires the dirty listeners list.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Indicates whether to reset the dirty listeners list after firing. |

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`__fireListenerList`](../../../classes/Mesh.md#__firelistenerlist)

***

### addChild()

> **addChild**(`child`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:69](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L69)

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](../../../classes/Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`addChild`](../../../classes/Mesh.md#addchild)

***

### addChildAt()

> **addChildAt**(`child`, `index`): `ATextField`

Defined in: [src/display/mesh/core/Object3DContainer.ts:87](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L87)

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`ATextField`

현재 컨테이너

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`addChildAt`](../../../classes/Mesh.md#addchildat)

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:897](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L897)


Adds an event listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | Event name |
| `callback` | `Function` | Callback function |

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`addListener`](../../../classes/Mesh.md#addlistener)

***

### clone()

> **clone**(): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1007](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L1007)

**`Experimental`**


Clones the mesh.

#### Returns

[`Mesh`](../../../classes/Mesh.md)


Cloned Mesh instance

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`clone`](../../../classes/Mesh.md#clone)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:59](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L59)

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`contains`](../../../classes/Mesh.md#contains)

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1711](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L1711)

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

[`Mesh`](../../../classes/Mesh.md).[`createMeshVertexShaderModuleBASIC`](../../../classes/Mesh.md#createmeshvertexshadermodulebasic)

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:109](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L109)

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](../../../classes/Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`getChildAt`](../../../classes/Mesh.md#getchildat)

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:123](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L123)

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`getChildIndex`](../../../classes/Mesh.md#getchildindex)

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:879](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L879)


Calculates and returns the combined opacity considering the parent hierarchy.

#### Returns

`number`


Combined opacity value

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`getCombinedOpacity`](../../../classes/Mesh.md#getcombinedopacity)

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L121)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) |

#### Returns

\[`number`, `number`\]

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`getScreenPoint`](../../../classes/Mesh.md#getscreenpoint)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1697](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L1697)

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`initGPURenderInfos`](../../../classes/Mesh.md#initgpurenderinfos)

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:117](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L117)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`localToWorld`](../../../classes/Mesh.md#localtoworld)

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:915](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L915)


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

[`Mesh`](../../../classes/Mesh.md).[`lookAt`](../../../classes/Mesh.md#lookat)

***

### removeAllChildren()

> **removeAllChildren**(): `ATextField`

Defined in: [src/display/mesh/core/Object3DContainer.ts:232](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L232)

모든 자식 객체를 제거합니다.

#### Returns

`ATextField`

현재 컨테이너

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`removeAllChildren`](../../../classes/Mesh.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:201](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L201)

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](../../../classes/Mesh.md)

제거된 객체

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`removeChild`](../../../classes/Mesh.md#removechild)

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:217](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L217)

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](../../../classes/Mesh.md)

제거된 객체

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`removeChildAt`](../../../classes/Mesh.md#removechildat)

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/textFileds/core/ATextField.ts:128](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/textFileds/core/ATextField.ts#L128)


Renders the mesh.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) | Render view state data |

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`render`](../../../classes/Mesh.md#render)

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:825](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L825)


Sets shadow casting for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | Whether to cast (default: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`setCastShadowRecursively`](../../../classes/Mesh.md#setcastshadowrecursively)

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:138](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L138)

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`setChildIndex`](../../../classes/Mesh.md#setchildindex)

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger`): `void`

Defined in: [src/display/mesh/Mesh.ts:807](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L807)


Sets the debugger visibility for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger` | `boolean` | `false` | Whether to enable (default: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`setEnableDebuggerRecursively`](../../../classes/Mesh.md#setenabledebuggerrecursively)

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:861](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L861)


Sets whether to ignore frustum culling for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | Whether to ignore (default: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`setIgnoreFrustumCullingRecursively`](../../../classes/Mesh.md#setignorefrustumcullingrecursively)

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:966](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L966)


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

[`Mesh`](../../../classes/Mesh.md).[`setPosition`](../../../classes/Mesh.md#setposition)

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:843](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L843)


Sets shadow receiving for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | Whether to receive (default: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`setReceiveShadowRecursively`](../../../classes/Mesh.md#setreceiveshadowrecursively)

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:989](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L989)


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

[`Mesh`](../../../classes/Mesh.md).[`setRotation`](../../../classes/Mesh.md#setrotation)

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:943](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L943)


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

[`Mesh`](../../../classes/Mesh.md).[`setScale`](../../../classes/Mesh.md#setscale)

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:161](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L161)

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](../../../classes/Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](../../../classes/Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`swapChildren`](../../../classes/Mesh.md#swapchildren)

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:181](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L181)

두 인덱스의 자식 객체 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`swapChildrenAt`](../../../classes/Mesh.md#swapchildrenat)

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:113](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L113)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`worldToLocal`](../../../classes/Mesh.md#worldtolocal)
