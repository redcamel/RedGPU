[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SpriteSheet3D

# Class: SpriteSheet3D

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:25](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L25)


3D sprite sheet animation class.


Provides sprite sheet animation with billboard effects in 3D space. Creates natural visual effects by placing 2D sprites like characters or particles in 3D space while always facing the camera. Rendering ratios are automatically adjusted according to the texture's aspect ratio.

### Example
```typescript
const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, info);
scene.addChild(spriteSheet);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/sprite/spriteSheet3D/"></iframe>


An example comparing World Size and Pixel Size modes.
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/sprite/spriteSheet3DCompare/"></iframe>

## See


Below is a list of additional sample examples to help understand the structure and operation of SpriteSheet3D.
 - [SpriteSheet3D Comparison (World vs Pixel)](https://redcamel.github.io/RedGPU/examples/3d/sprite/spriteSheet3DCompare/)
 - [SpriteSheet3D MouseEvent example](https://redcamel.github.io/RedGPU/examples/3d/mouseEvent/spriteSheet3D/)

## Extends

- [`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md)

## Constructors

### Constructor

> **new SpriteSheet3D**(`redGPUContext`, `spriteSheetInfo`): `SpriteSheet3D`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:87](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L87)


Creates a new SpriteSheet3D instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU rendering context |
| `spriteSheetInfo` | [`SpriteSheetInfo`](SpriteSheetInfo.md) | Sprite sheet info object (including texture, segment info, and animation settings) |

#### Returns

`SpriteSheet3D`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`constructor`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#constructor)

## Properties

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:374](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L374)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`_geometry`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#_geometry)

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:349](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L349)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`_material`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#_material)

***

### \_renderRatioX

> **\_renderRatioX**: `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:29](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L29)

X축 렌더링 비율

***

### \_renderRatioY

> **\_renderRatioY**: `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:31](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L31)

Y축 렌더링 비율

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:33](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L33)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`animationInfo`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#animationinfo)

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:93](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L93)


Whether to cast shadows

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`castShadow`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#castshadow)

***

### currentIndex

> **currentIndex**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:24](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L24)

현재 프레임 인덱스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`currentIndex`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#currentindex)

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:98](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L98)


Whether LOD info needs update

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`dirtyLOD`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#dirtylod)

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:49](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L49)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`dirtyOpacity`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#dirtyopacity)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:47](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L47)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`dirtyPipeline`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#dirtypipeline)

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:48](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L48)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`dirtyTransform`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#dirtytransform)

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L45)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`disableJitter`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#disablejitter)

***

### displacementTexture

> **displacementTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/display/mesh/Mesh.ts:88](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L88)


Displacement texture of the mesh

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`displacementTexture`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#displacementtexture)

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:46](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L46)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`gltfLoaderInfo`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#gltfloaderinfo)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L32)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`gpuRenderInfo`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#gpurenderinfo)

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:51](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L51)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`localMatrix`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#localmatrix)

***

### meshType

> **meshType**: `string`

Defined in: [src/display/mesh/Mesh.ts:46](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L46)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`meshType`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#meshtype)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:50](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L50)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`modelMatrix`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#modelmatrix)

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:52](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L52)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`normalModelMatrix`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#normalmodelmatrix)

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:103](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L103)


Whether it passed frustum culling

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`passFrustumCulling`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#passfrustumculling)

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:44](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L44)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`receiveShadow`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#receiveshadow)

***

### segmentH

> **segmentH**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:20](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L20)

세그먼트 높이

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`segmentH`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#segmenth)

***

### segmentW

> **segmentW**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:18](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L18)

세그먼트 너비

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`segmentW`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#segmentw)

***

### totalFrame

> **totalFrame**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:22](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L22)

총 프레임 수

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`totalFrame`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#totalframe)

***

### useBillboard

> **useBillboard**: `boolean`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:27](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L27)

빌보드 모드 사용 여부

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:47](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L47)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`useDisplacementTexture`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#usedisplacementtexture)

## Accessors

### boundingAABB

#### Get Signature

> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:783](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L783)


Returns the AABB (Axis-Aligned Bounding Box) information.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`boundingAABB`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#boundingaabb)

***

### boundingOBB

#### Get Signature

> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:770](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L770)


Returns the OBB (Oriented Bounding Box) information.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`boundingOBB`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#boundingobb)

***

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:42](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L42)

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 객체 배열

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`children`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#children)

***

### combinedBoundingAABB

#### Get Signature

> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:796](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L796)


Returns the combined AABB information including child objects.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`combinedBoundingAABB`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#combinedboundingaabb)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`currentShaderModuleName`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#currentshadermodulename)

***

### depthStencilState

#### Get Signature

> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:92](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L92)

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`depthStencilState`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#depthstencilstate)

***

### drawDebugger

#### Get Signature

> **get** **drawDebugger**(): `DrawDebuggerMesh`

Defined in: [src/display/mesh/Mesh.ts:345](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L345)


Returns the debug mesh object.

##### Returns

`DrawDebuggerMesh`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`drawDebugger`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#drawdebugger)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`enableDebugger`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#enabledebugger)

***

### events

#### Get Signature

> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:448](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L448)


Returns the registered events.

##### Returns

`any`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`events`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#events)

***

### frameRate

#### Get Signature

> **get** **frameRate**(): `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:138](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L138)

애니메이션 프레임 레이트를 반환합니다.

##### Returns

`number`

초당 프레임 수 (FPS)

#### Set Signature

> **set** **frameRate**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:146](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L146)

애니메이션 프레임 레이트를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 초당 프레임 수 (음수인 경우 0으로 설정) |

##### Returns

`void`

#### Inherited from

[`SpriteSheet2D`](SpriteSheet2D.md).[`frameRate`](SpriteSheet2D.md#framerate)

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:233](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L233)


Returns the geometry. SpriteSheet3D is fixed with Plane.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)


Current geometry

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:247](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L247)


SpriteSheet3D cannot change geometry.

##### Throws


Throws error when attempting to change geometry

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) | Geometry to set |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`geometry`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#geometry)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`gpuDevice`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#gpudevice)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`ignoreFrustumCulling`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#ignorefrustumculling)

***

### LODManager

#### Get Signature

> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:317](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L317)


Returns the LOD (Level of Detail) manager.

##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)


LODManager instance

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`LODManager`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#lodmanager)

***

### loop

#### Get Signature

> **get** **loop**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:122](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L122)

반복 재생 여부를 반환합니다.

##### Returns

`boolean`

반복 재생 활성화 여부

#### Set Signature

> **set** **loop**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:130](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L130)

반복 재생 여부를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 반복 재생 활성화 여부 |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`loop`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#loop)

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:258](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L258)


Returns the material.

##### Returns

`any`


Current material

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:272](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L272)


SpriteSheet3D cannot change material.

##### Throws


Throws error when attempting to change material

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | Material to set |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`material`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#material)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`name`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#name)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`numChildren`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#numchildren)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`opacity`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#opacity)

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:484](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L484)


Returns the set parent object.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:495](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L495)


Sets the parent object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) | Parent container |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`parent`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#parent)

***

### pickingId

#### Get Signature

> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:440](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L440)


Returns the picking ID.

##### Returns

`number`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pickingId`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pickingid)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pivotX`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pivotx)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pivotY`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pivoty)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pivotZ`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pivotz)

***

### pixelSize

#### Get Signature

> **get** **pixelSize**(): `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:140](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L140)


Returns the fixed pixel size value (in px).

##### Returns

`number`

#### Set Signature

> **set** **pixelSize**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:151](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L151)


Sets the fixed pixel size value (in px). Only applied when usePixelSize is true.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Pixel size to set |

##### Returns

`void`

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`position`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#position)

***

### primitiveState

#### Get Signature

> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:88](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L88)

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`primitiveState`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#primitivestate)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:109](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L109)

Retrieves the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

The RedGPUContext instance.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`redGPUContext`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#redgpucontext)

***

### rotation

#### Get Signature

> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:762](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L762)


Returns the current rotation values. [x, y, z] (degrees)

##### Returns

`Float32Array`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`rotation`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#rotation)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`rotationX`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#rotationx)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`rotationY`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#rotationy)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`rotationZ`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#rotationz)

***

### scale

#### Get Signature

> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:694](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L694)


Returns the current scale. [x, y, z]

##### Returns

`Float32Array`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`scale`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#scale)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`scaleX`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#scalex)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`scaleY`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#scaley)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`scaleZ`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#scalez)

***

### spriteSheetInfo

#### Get Signature

> **get** **spriteSheetInfo**(): [`SpriteSheetInfo`](SpriteSheetInfo.md)

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:193](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L193)

스프라이트 시트 정보를 반환합니다.

##### Returns

[`SpriteSheetInfo`](SpriteSheetInfo.md)

현재 스프라이트 시트 정보

#### Set Signature

> **set** **spriteSheetInfo**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:201](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L201)

스프라이트 시트 정보를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpriteSheetInfo`](SpriteSheetInfo.md) | 새로운 스프라이트 시트 정보 |

##### Returns

`void`

#### Inherited from

[`SpriteSheet2D`](SpriteSheet2D.md).[`spriteSheetInfo`](SpriteSheet2D.md#spritesheetinfo)

***

### state

#### Get Signature

> **get** **state**(): `string`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:114](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L114)

현재 애니메이션 상태를 반환합니다.

##### Returns

`string`

'play', 'pause', 'stop' 중 하나

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`state`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#state)

***

### usePixelSize

#### Get Signature

> **get** **usePixelSize**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:167](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L167)


Returns whether to use fixed pixel size mode.

##### Returns

`boolean`

#### Set Signature

> **set** **usePixelSize**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:178](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L178)


Sets whether to use fixed pixel size mode. If true, it is rendered at the size set in pixelSize regardless of distance.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use |

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`uuid`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#uuid)

***

### vertexStateBuffers

#### Get Signature

> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:476](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L476)


Returns the vertex state buffer layouts.

##### Returns

`GPUVertexBufferLayout`[]

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`vertexStateBuffers`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#vertexstatebuffers)

***

### worldSize

#### Get Signature

> **get** **worldSize**(): `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:119](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L119)


Returns the vertical size of the sprite in world space (Unit).

##### Returns

`number`

#### Set Signature

> **set** **worldSize**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:130](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L130)


Sets the vertical size of the sprite in world space (Unit). The horizontal size is automatically adjusted based on the segment's aspect ratio.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | World size to set |

##### Returns

`void`

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`x`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#x)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`y`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#y)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`z`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#z)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`__fireListenerList`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#__firelistenerlist)

***

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:69](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L69)

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`addChild`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#addchild)

***

### addChildAt()

> **addChildAt**(`child`, `index`): `SpriteSheet3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:87](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L87)

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`SpriteSheet3D`

현재 컨테이너

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`addChildAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#addchildat)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`addListener`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#addlistener)

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1007](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L1007)

**`Experimental`**


Clones the mesh.

#### Returns

[`Mesh`](Mesh.md)


Cloned Mesh instance

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`clone`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#clone)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:59](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L59)

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`contains`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#contains)

***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:287](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L287)


Creates a custom vertex shader module dedicated to SpriteSheet3D.


Creates a shader optimized for billboard effects and sprite sheet rendering in 3D space.

#### Returns

`GPUShaderModule`


Created GPU shader module

#### Inherited from

`ASpriteSheet.createCustomMeshVertexShaderModule`

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`createMeshVertexShaderModuleBASIC`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#createmeshvertexshadermodulebasic)

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:109](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L109)

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`getChildAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#getchildat)

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:123](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L123)

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`getChildIndex`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#getchildindex)

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:879](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L879)


Calculates and returns the combined opacity considering the parent hierarchy.

#### Returns

`number`


Combined opacity value

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`getCombinedOpacity`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#getcombinedopacity)

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/MeshBase.ts#L121)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](View3D.md) |

#### Returns

\[`number`, `number`\]

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`getScreenPoint`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#getscreenpoint)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1697](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/Mesh.ts#L1697)

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`initGPURenderInfos`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#initgpurenderinfos)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`localToWorld`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#localtoworld)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`lookAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#lookat)

***

### pause()

> **pause**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:227](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L227)

애니메이션을 일시정지합니다.
상태를 'pause'로 변경하고 현재 프레임에서 정지합니다.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pause`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pause)

***

### play()

> **play**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:217](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L217)

애니메이션을 재생합니다.
상태를 'play'로 변경하고 재생을 시작합니다.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`play`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#play)

***

### removeAllChildren()

> **removeAllChildren**(): `SpriteSheet3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:232](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L232)

모든 자식 객체를 제거합니다.

#### Returns

`SpriteSheet3D`

현재 컨테이너

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`removeAllChildren`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:201](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L201)

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`removeChild`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#removechild)

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:217](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L217)

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`removeChildAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#removechildat)

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:222](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L222)


Renders the sprite sheet every frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Current render view state data |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`render`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#render)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setCastShadowRecursively`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setcastshadowrecursively)

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:138](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L138)

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setChildIndex`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setchildindex)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setEnableDebuggerRecursively`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setenabledebuggerrecursively)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setIgnoreFrustumCullingRecursively`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setignorefrustumcullingrecursively)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setPosition`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setposition)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setReceiveShadowRecursively`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setreceiveshadowrecursively)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setRotation`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setrotation)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setScale`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setscale)

***

### stop()

> **stop**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:236](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L236)

애니메이션을 정지합니다.
상태를 'stop'으로 변경하고 첫 번째 프레임으로 되돌립니다.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`stop`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#stop)

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:161](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/mesh/core/Object3DContainer.ts#L161)

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`swapChildren`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#swapchildren)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`swapChildrenAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#swapchildrenat)

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

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`worldToLocal`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#worldtolocal)
