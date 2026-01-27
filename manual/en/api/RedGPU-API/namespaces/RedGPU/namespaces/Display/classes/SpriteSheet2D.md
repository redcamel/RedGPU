[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SpriteSheet2D

# Class: SpriteSheet2D

Defined in: [src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts:45](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts#L45)


2D sprite sheet animation class.


A class for animating characters or objects in 2D games. It creates smooth 2D animations by sequentially displaying multiple frames arranged in a grid within a single texture over time. Rendering size is automatically adjusted according to the segment size of the texture.

* ### Example
```typescript
const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
const spriteSheet = new RedGPU.Display.SpriteSheet2D(redGPUContext, info);
scene.addChild(spriteSheet);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/sprite/spriteSheet3D/"></iframe>


Below is a list of additional sample examples to help understand the structure and operation of SpriteSheet2D.

## See

[SpriteSheet2D MouseEvent example](https://redcamel.github.io/RedGPU/examples/2d/mouseEvent/spriteSheet2D/)

## Extends

- `BaseSpriteSheet2D`

## Constructors

### Constructor

> **new SpriteSheet2D**(`redGPUContext`, `spriteSheetInfo`): `SpriteSheet2D`

Defined in: [src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts:68](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts#L68)


Creates a new SpriteSheet2D instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPU rendering context |
| `spriteSheetInfo` | [`SpriteSheetInfo`](SpriteSheetInfo.md) | Sprite sheet info object (including texture, segment info, and animation settings) |

#### Returns

`SpriteSheet2D`

#### Overrides

`BaseSpriteSheet2D.constructor`

## Properties

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:373](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L373)

#### Inherited from

`BaseSpriteSheet2D._geometry`

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:348](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L348)

#### Inherited from

`BaseSpriteSheet2D._material`

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:33](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L33)

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

`BaseSpriteSheet2D.animationInfo`

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:92](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L92)


Whether to cast shadows

#### Inherited from

`BaseSpriteSheet2D.castShadow`

***

### currentIndex

> **currentIndex**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:24](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L24)

현재 프레임 인덱스

#### Inherited from

`BaseSpriteSheet2D.currentIndex`

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:97](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L97)


Whether LOD info needs update

#### Inherited from

`BaseSpriteSheet2D.dirtyLOD`

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:49](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L49)

#### Inherited from

`BaseSpriteSheet2D.dirtyOpacity`

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:47](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L47)

#### Inherited from

`BaseSpriteSheet2D.dirtyPipeline`

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:48](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L48)

#### Inherited from

`BaseSpriteSheet2D.dirtyTransform`

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:44](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L44)

#### Inherited from

`BaseSpriteSheet2D.disableJitter`

***

### displacementTexture

> **displacementTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/display/mesh/Mesh.ts:87](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L87)


Displacement texture of the mesh

#### Inherited from

`BaseSpriteSheet2D.displacementTexture`

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:46](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L46)

#### Inherited from

`BaseSpriteSheet2D.gltfLoaderInfo`

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L32)

#### Inherited from

`BaseSpriteSheet2D.gpuRenderInfo`

***

### localMatrix

> **localMatrix**: [`mat4`](../../../type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:51](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L51)

#### Inherited from

`BaseSpriteSheet2D.localMatrix`

***

### meshType

> **meshType**: `string`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L45)

#### Inherited from

`BaseSpriteSheet2D.meshType`

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:50](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L50)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

`BaseSpriteSheet2D.modelMatrix`

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../../type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:52](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L52)

#### Inherited from

`BaseSpriteSheet2D.normalModelMatrix`

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:102](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L102)


Whether it passed frustum culling

#### Inherited from

`BaseSpriteSheet2D.passFrustumCulling`

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:43](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L43)

#### Inherited from

`BaseSpriteSheet2D.receiveShadow`

***

### rotation

> **rotation**: `number` & `Float32Array`\<`ArrayBufferLike`\>

Defined in: [src/display/mesh/core/mixInMesh2D.ts:51](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/mixInMesh2D.ts#L51)

#### Inherited from

`BaseSpriteSheet2D.rotation`

***

### rotationZ

> **rotationZ**: `number`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:6](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/mixInMesh2D.ts#L6)

#### Inherited from

`BaseSpriteSheet2D.rotationZ`

***

### segmentH

> **segmentH**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:20](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L20)

세그먼트 높이

#### Inherited from

`BaseSpriteSheet2D.segmentH`

***

### segmentW

> **segmentW**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:18](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L18)

세그먼트 너비

#### Inherited from

`BaseSpriteSheet2D.segmentW`

***

### totalFrame

> **totalFrame**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:22](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L22)

총 프레임 수

#### Inherited from

`BaseSpriteSheet2D.totalFrame`

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:46](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L46)

#### Inherited from

`BaseSpriteSheet2D.useDisplacementTexture`

## Accessors

### blendMode

#### Get Signature

> **get** **blendMode**(): `string`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:22](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/mixInMesh2D.ts#L22)

##### Returns

`string`

#### Set Signature

> **set** **blendMode**(`value`): `void`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:30](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/mixInMesh2D.ts#L30)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| [`BLEND_MODE`](../../Material/type-aliases/BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.blendMode`

***

### boundingAABB

#### Get Signature

> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:782](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L782)


Returns the AABB (Axis-Aligned Bounding Box) information.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

`BaseSpriteSheet2D.boundingAABB`

***

### boundingOBB

#### Get Signature

> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:769](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L769)


Returns the OBB (Oriented Bounding Box) information.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

#### Inherited from

`BaseSpriteSheet2D.boundingOBB`

***

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:42](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L42)

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 객체 배열

#### Inherited from

`BaseSpriteSheet2D.children`

***

### combinedBoundingAABB

#### Get Signature

> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:795](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L795)


Returns the combined AABB information including child objects.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

`BaseSpriteSheet2D.combinedBoundingAABB`

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L79)

##### Returns

`string`

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:83](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L83)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.currentShaderModuleName`

***

### depthStencilState

#### Get Signature

> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:92](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L92)

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

#### Inherited from

`BaseSpriteSheet2D.depthStencilState`

***

### drawDebugger

#### Get Signature

> **get** **drawDebugger**(): `DrawDebuggerMesh`

Defined in: [src/display/mesh/Mesh.ts:344](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L344)


Returns the debug mesh object.

##### Returns

`DrawDebuggerMesh`

#### Inherited from

`BaseSpriteSheet2D.drawDebugger`

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:324](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L324)


Returns whether the debugger is enabled.

##### Returns

`boolean`

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:335](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L335)


Sets whether the debugger is enabled.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to enable |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.enableDebugger`

***

### events

#### Get Signature

> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:447](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L447)


Returns the registered events.

##### Returns

`any`

#### Inherited from

`BaseSpriteSheet2D.events`

***

### frameRate

#### Get Signature

> **get** **frameRate**(): `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:138](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L138)

애니메이션 프레임 레이트를 반환합니다.

##### Returns

`number`

초당 프레임 수 (FPS)

#### Set Signature

> **set** **frameRate**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:146](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L146)

애니메이션 프레임 레이트를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 초당 프레임 수 (음수인 경우 0으로 설정) |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.frameRate`

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts:121](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts#L121)

지오메트리를 반환합니다.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

현재 지오메트리 (고정된 Plane)

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts:130](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts#L130)

SpriteSheet2D는 지오메트리를 변경할 수 없습니다

##### Throws

SpriteSheet2D는 지오메트리를 변경할 수 없습니다

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) | 설정하려는 지오메트리 |

##### Returns

`void`

#### Overrides

`BaseSpriteSheet2D.geometry`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:100](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L100)

Retrieves the GPU device associated with the current instance.

##### Returns

`GPUDevice`

The GPU device.

#### Inherited from

`BaseSpriteSheet2D.gpuDevice`

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts:107](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts#L107)

스프라이트 시트 세그먼트의 높이를 반환합니다.
텍스처 전체 높이를 세그먼트 수로 나눈 값입니다.

##### Returns

`number`

세그먼트 높이 (픽셀 단위)

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:420](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L420)


Returns whether to ignore frustum culling.

##### Returns

`boolean`

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:431](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L431)


Sets whether to ignore frustum culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to ignore |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.ignoreFrustumCulling`

***

### LODManager

#### Get Signature

> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:316](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L316)


Returns the LOD (Level of Detail) manager.

##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)


LODManager instance

#### Inherited from

`BaseSpriteSheet2D.LODManager`

***

### loop

#### Get Signature

> **get** **loop**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:122](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L122)

반복 재생 여부를 반환합니다.

##### Returns

`boolean`

반복 재생 활성화 여부

#### Set Signature

> **set** **loop**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:130](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L130)

반복 재생 여부를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 반복 재생 활성화 여부 |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.loop`

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts:138](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts#L138)

머티리얼을 반환합니다.

##### Returns

`any`

현재 머티리얼 (BitmapMaterial)

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts:147](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts#L147)

SpriteSheet2D는 머티리얼을 변경할 수 없습니다

##### Throws

SpriteSheet2D는 머티리얼을 변경할 수 없습니다

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | 설정하려는 머티리얼 |

##### Returns

`void`

#### Overrides

`BaseSpriteSheet2D.material`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/display/mesh/Mesh.ts:455](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L455)


Returns the name of the mesh.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:467](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L467)


Sets the name of the mesh.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Mesh name |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.name`

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:50](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L50)

자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 수

#### Inherited from

`BaseSpriteSheet2D.numChildren`

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:399](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L399)


Returns the opacity of the mesh. (0~1)

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:410](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L410)


Sets the opacity of the mesh. (0~1)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Opacity value |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.opacity`

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:483](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L483)


Returns the set parent object.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:494](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L494)


Sets the parent object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) | Parent container |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.parent`

***

### pickingId

#### Get Signature

> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:439](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L439)


Returns the picking ID.

##### Returns

`number`

#### Inherited from

`BaseSpriteSheet2D.pickingId`

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:502](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L502)


Returns the pivot X coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:513](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L513)


Sets the pivot X coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X coordinate |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.pivotX`

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:522](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L522)


Returns the pivot Y coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:533](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L533)


Sets the pivot Y coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y coordinate |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.pivotY`

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:542](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L542)


Returns the pivot Z coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:553](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L553)


Sets the pivot Z coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.pivotZ`

***

### position

#### Get Signature

> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:625](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L625)


Returns the current position. [x, y, z]

##### Returns

`Float32Array`


Position array

#### Inherited from

`BaseSpriteSheet2D.position`

***

### primitiveState

#### Get Signature

> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:88](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L88)

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

#### Inherited from

`BaseSpriteSheet2D.primitiveState`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:109](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L109)

Retrieves the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

The RedGPUContext instance.

#### Inherited from

`BaseSpriteSheet2D.redGPUContext`

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:701](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L701)


Returns the X-axis rotation value. (degrees)

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:712](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L712)


Sets the X-axis rotation value. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.rotationX`

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:721](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L721)


Returns the Y-axis rotation value. (degrees)

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:732](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L732)


Sets the Y-axis rotation value. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.rotationY`

***

### scale

#### Get Signature

> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:693](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L693)


Returns the current scale. [x, y, z]

##### Returns

`Float32Array`

#### Inherited from

`BaseSpriteSheet2D.scale`

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:633](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L633)


Returns the X-axis scale.

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:644](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L644)


Sets the X-axis scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.scaleX`

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:653](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L653)


Returns the Y-axis scale.

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:664](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L664)


Sets the Y-axis scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.scaleY`

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:673](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L673)


Returns the Z-axis scale.

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:684](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L684)


Sets the Z-axis scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.scaleZ`

***

### spriteSheetInfo

#### Get Signature

> **get** **spriteSheetInfo**(): [`SpriteSheetInfo`](SpriteSheetInfo.md)

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:193](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L193)

스프라이트 시트 정보를 반환합니다.

##### Returns

[`SpriteSheetInfo`](SpriteSheetInfo.md)

현재 스프라이트 시트 정보

#### Set Signature

> **set** **spriteSheetInfo**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:201](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L201)

스프라이트 시트 정보를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpriteSheetInfo`](SpriteSheetInfo.md) | 새로운 스프라이트 시트 정보 |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.spriteSheetInfo`

***

### state

#### Get Signature

> **get** **state**(): `string`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:114](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L114)

현재 애니메이션 상태를 반환합니다.

##### Returns

`string`

'play', 'pause', 'stop' 중 하나

#### Inherited from

`BaseSpriteSheet2D.state`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:75](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L75)

Retrieves the UUID of the object.

##### Returns

`string`

The UUID of the object.

#### Inherited from

`BaseSpriteSheet2D.uuid`

***

### vertexStateBuffers

#### Get Signature

> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:475](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L475)


Returns the vertex state buffer layouts.

##### Returns

`GPUVertexBufferLayout`[]

#### Inherited from

`BaseSpriteSheet2D.vertexStateBuffers`

***

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts:93](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts#L93)

스프라이트 시트 세그먼트의 너비를 반환합니다.
텍스처 전체 너비를 세그먼트 수로 나눈 값입니다.

##### Returns

`number`

세그먼트 너비 (픽셀 단위)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:562](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L562)


Returns the X position coordinate.

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:573](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L573)


Sets the X position coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X coordinate |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.x`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:582](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L582)


Returns the Y position coordinate.

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:593](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L593)


Sets the Y position coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y coordinate |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.y`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:602](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L602)


Returns the Z position coordinate.

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:613](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L613)


Sets the Z position coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate |

##### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.z`

## Methods

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList?`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:130](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L130)

Fires the dirty listeners list.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Indicates whether to reset the dirty listeners list after firing. |

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.__fireListenerList`

***

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:69](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L69)

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

`BaseSpriteSheet2D.addChild`

***

### addChildAt()

> **addChildAt**(`child`, `index`): `SpriteSheet2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:87](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L87)

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`SpriteSheet2D`

현재 컨테이너

#### Inherited from

`BaseSpriteSheet2D.addChildAt`

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:896](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L896)


Adds an event listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | Event name |
| `callback` | `Function` | Callback function |

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.addListener`

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1006](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L1006)

**`Experimental`**


Clones the mesh.

#### Returns

[`Mesh`](Mesh.md)


Cloned Mesh instance

#### Inherited from

`BaseSpriteSheet2D.clone`

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:59](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L59)

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

`BaseSpriteSheet2D.contains`

***

### createCustomMeshVertexShaderModule()

> `protected` **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts:160](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/spriteSheet2D/SpriteSheet2D.ts#L160)

SpriteSheet2D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.

2D 스프라이트 시트 렌더링에 최적화된 버텍스 셰이더를 생성하며,
UV 좌표 계산과 프레임 인덱싱 로직이 포함되어 있습니다.

#### Returns

`GPUShaderModule`

생성된 버텍스 셰이더 모듈 정보

#### Overrides

`BaseSpriteSheet2D.createCustomMeshVertexShaderModule`

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1676](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L1676)

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

`BaseSpriteSheet2D.createMeshVertexShaderModuleBASIC`

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:109](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L109)

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

`BaseSpriteSheet2D.getChildAt`

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:123](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L123)

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

`BaseSpriteSheet2D.getChildIndex`

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:878](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L878)


Calculates and returns the combined opacity considering the parent hierarchy.

#### Returns

`number`


Combined opacity value

#### Inherited from

`BaseSpriteSheet2D.getCombinedOpacity`

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L121)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](View3D.md) |

#### Returns

\[`number`, `number`\]

#### Inherited from

`BaseSpriteSheet2D.getScreenPoint`

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1662](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L1662)

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.initGPURenderInfos`

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:117](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L117)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

`BaseSpriteSheet2D.localToWorld`

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:914](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L914)


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

`BaseSpriteSheet2D.lookAt`

***

### pause()

> **pause**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:227](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L227)

애니메이션을 일시정지합니다.
상태를 'pause'로 변경하고 현재 프레임에서 정지합니다.

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.pause`

***

### play()

> **play**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:217](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L217)

애니메이션을 재생합니다.
상태를 'play'로 변경하고 재생을 시작합니다.

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.play`

***

### removeAllChildren()

> **removeAllChildren**(): `SpriteSheet2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:232](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L232)

모든 자식 객체를 제거합니다.

#### Returns

`SpriteSheet2D`

현재 컨테이너

#### Inherited from

`BaseSpriteSheet2D.removeAllChildren`

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:201](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L201)

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

`BaseSpriteSheet2D.removeChild`

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:217](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L217)

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

`BaseSpriteSheet2D.removeChildAt`

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:249](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L249)

스프라이트 시트를 렌더링합니다.

시간에 따른 프레임 업데이트와 애니메이션 로직을 처리한 후 렌더링을 수행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 렌더링 상태 및 디버그 정보 |

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.render`

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:824](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L824)


Sets shadow casting for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | Whether to cast (default: false) |

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.setCastShadowRecursively`

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:138](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L138)

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.setChildIndex`

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger`): `void`

Defined in: [src/display/mesh/Mesh.ts:806](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L806)


Sets the debugger visibility for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger` | `boolean` | `false` | Whether to enable (default: false) |

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.setEnableDebuggerRecursively`

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:860](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L860)


Sets whether to ignore frustum culling for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | Whether to ignore (default: false) |

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.setIgnoreFrustumCullingRecursively`

***

### setPosition()

#### Call Signature

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:66](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/mixInMesh2D.ts#L66)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y?` | `number` |

##### Returns

`void`

##### Inherited from

`BaseSpriteSheet2D.setPosition`

#### Call Signature

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:965](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L965)


Sets the position.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X coordinate |
| `y?` | `number` | Y coordinate (if omitted, same as x) |
| `z?` | `number` | Z coordinate (if omitted, same as x) |

##### Returns

`void`

##### Inherited from

`BaseSpriteSheet2D.setPosition`

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:842](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L842)


Sets shadow receiving for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | Whether to receive (default: false) |

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.setReceiveShadowRecursively`

***

### setRotation()

#### Call Signature

> **setRotation**(`value`): `void`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:72](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/mixInMesh2D.ts#L72)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

##### Inherited from

`BaseSpriteSheet2D.setRotation`

#### Call Signature

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:988](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L988)


Sets the rotation values. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X-axis rotation |
| `rotationY?` | `number` | Y-axis rotation (if omitted, same as rotationX) |
| `rotationZ?` | `number` | Z-axis rotation (if omitted, same as rotationX) |

##### Returns

`void`

##### Inherited from

`BaseSpriteSheet2D.setRotation`

***

### setScale()

#### Call Signature

> **setScale**(`x`, `y?`): `void`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:60](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/mixInMesh2D.ts#L60)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y?` | `number` |

##### Returns

`void`

##### Inherited from

`BaseSpriteSheet2D.setScale`

#### Call Signature

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:942](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/Mesh.ts#L942)


Sets the scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X-axis scale |
| `y?` | `number` | Y-axis scale (if omitted, same as x) |
| `z?` | `number` | Z-axis scale (if omitted, same as x) |

##### Returns

`void`

##### Inherited from

`BaseSpriteSheet2D.setScale`

***

### stop()

> **stop**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:236](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L236)

애니메이션을 정지합니다.
상태를 'stop'으로 변경하고 첫 번째 프레임으로 되돌립니다.

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.stop`

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:161](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L161)

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.swapChildren`

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:181](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/Object3DContainer.ts#L181)

두 인덱스의 자식 객체 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

`BaseSpriteSheet2D.swapChildrenAt`

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:113](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/display/mesh/core/MeshBase.ts#L113)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

`BaseSpriteSheet2D.worldToLocal`
