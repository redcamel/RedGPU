[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreSpriteSheet](../README.md) / ASpriteSheet

# Class: ASpriteSheet

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:16](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L16)

스프라이트 시트 애니메이션을 처리하는 추상 기본 클래스입니다.


ASpriteSheet는 2D/3D 스프라이트 애니메이션을 위한 공통 기능을 제공합니다. 하나의 텍스처에 여러 프레임이 격자 형태로 배열된 스프라이트 시트를 시간에 따라 순차적으로 표시하여 애니메이션 효과를 만듭니다.


::: warning
이 클래스는 시스템 내부적으로 사용되는 추상 클래스입니다.<br/>직접 인스턴스를 생성하지 마십시오.

:::

## Extends

- [`Mesh`](../../../classes/Mesh.md)

## Extended by

- [`SpriteSheet3D`](../../../classes/SpriteSheet3D.md)

## Constructors

### Constructor

> **new ASpriteSheet**(`redGPUContext`, `spriteSheetInfo`, `setRenderSize`): `ASpriteSheet`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:97](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L97)

ASpriteSheet 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPU 렌더링 컨텍스트
| `spriteSheetInfo` | [`SpriteSheetInfo`](../../../classes/SpriteSheetInfo.md) | 스프라이트 시트 정보 객체
| `setRenderSize` | (`texture`, `segmentW`, `segmentH`) => `void` | 렌더링 크기 설정 콜백 함수

#### Returns

`ASpriteSheet`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`constructor`](../../../classes/Mesh.md#constructor)

## Properties

### \_geometry

> **\_geometry**: [`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:374](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L374)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`_geometry`](../../../classes/Mesh.md#_geometry)

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:349](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L349)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`_material`](../../../classes/Mesh.md#_material)

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:33](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L33)

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

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:93](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L93)

그림자 캐스팅 여부


#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`castShadow`](../../../classes/Mesh.md#castshadow)

***

### createCustomMeshVertexShaderModule()?

> `optional` **createCustomMeshVertexShaderModule**: () => `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:108](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L108)

커스텀 버텍스 셰이더 모듈 생성 함수


#### Returns

`GPUShaderModule`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`createCustomMeshVertexShaderModule`](../../../classes/Mesh.md#createcustommeshvertexshadermodule)

***

### currentIndex

> **currentIndex**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:24](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L24)

현재 프레임 인덱스

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:98](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L98)

LOD 정보 변경 필요 여부


#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`dirtyLOD`](../../../classes/Mesh.md#dirtylod)

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:49](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L49)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`dirtyOpacity`](../../../classes/Mesh.md#dirtyopacity)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:47](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L47)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`dirtyPipeline`](../../../classes/Mesh.md#dirtypipeline)

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:48](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L48)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`dirtyTransform`](../../../classes/Mesh.md#dirtytransform)

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L45)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`disableJitter`](../../../classes/Mesh.md#disablejitter)

***

### displacementTexture

> **displacementTexture**: [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/display/mesh/Mesh.ts:88](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L88)

메시의 디스플레이스먼트 텍스처


#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`displacementTexture`](../../../classes/Mesh.md#displacementtexture)

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:46](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L46)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`gltfLoaderInfo`](../../../classes/Mesh.md#gltfloaderinfo)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../../CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L32)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`gpuRenderInfo`](../../../classes/Mesh.md#gpurenderinfo)

***

### localMatrix

> **localMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:51](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L51)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`localMatrix`](../../../classes/Mesh.md#localmatrix)

***

### meshType

> **meshType**: `string`

Defined in: [src/display/mesh/Mesh.ts:46](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L46)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`meshType`](../../../classes/Mesh.md#meshtype)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:50](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L50)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`modelMatrix`](../../../classes/Mesh.md#modelmatrix)

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:52](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L52)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`normalModelMatrix`](../../../classes/Mesh.md#normalmodelmatrix)

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:103](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L103)

프러스텀 컬링 통과 여부


#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`passFrustumCulling`](../../../classes/Mesh.md#passfrustumculling)

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:44](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L44)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`receiveShadow`](../../../classes/Mesh.md#receiveshadow)

***

### segmentH

> **segmentH**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:20](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L20)

세그먼트 높이

***

### segmentW

> **segmentW**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:18](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L18)

세그먼트 너비

***

### totalFrame

> **totalFrame**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:22](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L22)

총 프레임 수

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:47](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L47)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`useDisplacementTexture`](../../../classes/Mesh.md#usedisplacementtexture)

## Accessors

### boundingAABB

#### Get Signature

> **get** **boundingAABB**(): [`AABB`](../../../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:783](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L783)

AABB(Axis-Aligned Bounding Box) 정보를 반환합니다.


##### Returns

[`AABB`](../../../../Bound/classes/AABB.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`boundingAABB`](../../../classes/Mesh.md#boundingaabb)

***

### boundingOBB

#### Get Signature

> **get** **boundingOBB**(): [`OBB`](../../../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:770](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L770)

OBB(Oriented Bounding Box) 정보를 반환합니다.


##### Returns

[`OBB`](../../../../Bound/classes/OBB.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`boundingOBB`](../../../classes/Mesh.md#boundingobb)

***

### children

#### Get Signature

> **get** **children**(): [`Mesh`](../../../classes/Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:42](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L42)

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

Defined in: [src/display/mesh/Mesh.ts:796](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L796)

자식 객체들을 포함한 통합 AABB 정보를 반환합니다.


##### Returns

[`AABB`](../../../../Bound/classes/AABB.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`combinedBoundingAABB`](../../../classes/Mesh.md#combinedboundingaabb)

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L79)

##### Returns

`string`

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:83](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L83)

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

Defined in: [src/display/mesh/core/MeshBase.ts:92](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L92)

##### Returns

[`DepthStencilState`](../../../../RenderState/classes/DepthStencilState.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`depthStencilState`](../../../classes/Mesh.md#depthstencilstate)

***

### drawDebugger

#### Get Signature

> **get** **drawDebugger**(): `DrawDebuggerMesh`

Defined in: [src/display/mesh/Mesh.ts:345](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L345)

디버그 메시 객체를 반환합니다.


##### Returns

`DrawDebuggerMesh`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`drawDebugger`](../../../classes/Mesh.md#drawdebugger)

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:325](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L325)

디버거 활성화 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:336](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L336)

디버거 활성화 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 활성화 여부

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`enableDebugger`](../../../classes/Mesh.md#enabledebugger)

***

### events

#### Get Signature

> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:448](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L448)

등록된 이벤트들을 반환합니다.


##### Returns

`any`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`events`](../../../classes/Mesh.md#events)

***

### frameRate

#### Get Signature

> **get** **frameRate**(): `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:138](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L138)

애니메이션 프레임 레이트를 반환합니다.

##### Returns

`number`

초당 프레임 수 (FPS)

#### Set Signature

> **set** **frameRate**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:146](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L146)

애니메이션 프레임 레이트를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 초당 프레임 수 (음수인 경우 0으로 설정) |

##### Returns

`void`

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:159](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L159)

지오메트리를 반환합니다.

##### Returns

[`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

현재 지오메트리

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:168](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L168)

지오메트리 설정을 시도합니다.

##### Throws

ASpriteSheet는 지오메트리를 변경할 수 없습니다

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md) | 설정하려는 지오메트리 |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`geometry`](../../../classes/Mesh.md#geometry)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:100](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L100)

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

Defined in: [src/display/mesh/Mesh.ts:421](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L421)

프러스텀 컬링 무시 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:432](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L432)

프러스텀 컬링 무시 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 무시 여부

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`ignoreFrustumCulling`](../../../classes/Mesh.md#ignorefrustumculling)

***

### LODManager

#### Get Signature

> **get** **LODManager**(): [`LODManager`](../../CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:317](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L317)

LOD(Level of Detail) 매니저를 반환합니다.


##### Returns

[`LODManager`](../../CoreMesh/classes/LODManager.md)

LODManager 인스턴스


#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`LODManager`](../../../classes/Mesh.md#lodmanager)

***

### loop

#### Get Signature

> **get** **loop**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:122](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L122)

반복 재생 여부를 반환합니다.

##### Returns

`boolean`

반복 재생 활성화 여부

#### Set Signature

> **set** **loop**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:130](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L130)

반복 재생 여부를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 반복 재생 활성화 여부 |

##### Returns

`void`

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:176](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L176)

머티리얼을 반환합니다.

##### Returns

`any`

현재 머티리얼

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:185](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L185)

머티리얼 설정을 시도합니다.

##### Throws

ASpriteSheet는 머티리얼을 변경할 수 없습니다

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | 설정하려는 머티리얼 |

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`material`](../../../classes/Mesh.md#material)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/display/mesh/Mesh.ts:456](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L456)

메시의 이름을 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:468](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L468)

메시의 이름을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 메시 이름

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`name`](../../../classes/Mesh.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:50](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L50)

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

Defined in: [src/display/mesh/Mesh.ts:400](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L400)

메시의 투명도를 반환합니다. (0~1)


##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:411](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L411)

메시의 투명도를 설정합니다. (0~1)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 투명도 값

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`opacity`](../../../classes/Mesh.md#opacity)

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:484](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L484)

설정된 부모 객체를 반환합니다.


##### Returns

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:495](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L495)

부모 객체를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md) | 부모 컨테이너

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`parent`](../../../classes/Mesh.md#parent)

***

### pickingId

#### Get Signature

> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:440](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L440)

피킹 ID를 반환합니다.


##### Returns

`number`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`pickingId`](../../../classes/Mesh.md#pickingid)

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:503](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L503)

피벗 X 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:514](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L514)

피벗 X 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`pivotX`](../../../classes/Mesh.md#pivotx)

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:523](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L523)

피벗 Y 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:534](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L534)

피벗 Y 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`pivotY`](../../../classes/Mesh.md#pivoty)

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:543](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L543)

피벗 Z 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:554](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L554)

피벗 Z 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`pivotZ`](../../../classes/Mesh.md#pivotz)

***

### position

#### Get Signature

> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:626](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L626)

현재 위치를 반환합니다. [x, y, z]


##### Returns

`Float32Array`

위치 배열


#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`position`](../../../classes/Mesh.md#position)

***

### primitiveState

#### Get Signature

> **get** **primitiveState**(): [`PrimitiveState`](../../../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:88](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L88)

##### Returns

[`PrimitiveState`](../../../../RenderState/classes/PrimitiveState.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`primitiveState`](../../../classes/Mesh.md#primitivestate)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:109](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L109)

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

Defined in: [src/display/mesh/Mesh.ts:762](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L762)

현재 회전값을 반환합니다. [x, y, z] (도)


##### Returns

`Float32Array`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`rotation`](../../../classes/Mesh.md#rotation)

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:702](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L702)

X축 회전값을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:713](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L713)

X축 회전값을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`rotationX`](../../../classes/Mesh.md#rotationx)

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:722](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L722)

Y축 회전값을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:733](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L733)

Y축 회전값을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`rotationY`](../../../classes/Mesh.md#rotationy)

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:742](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L742)

Z축 회전값을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:753](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L753)

Z축 회전값을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`rotationZ`](../../../classes/Mesh.md#rotationz)

***

### scale

#### Get Signature

> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:694](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L694)

현재 스케일을 반환합니다. [x, y, z]


##### Returns

`Float32Array`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`scale`](../../../classes/Mesh.md#scale)

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:634](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L634)

X축 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:645](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L645)

X축 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`scaleX`](../../../classes/Mesh.md#scalex)

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:654](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L654)

Y축 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:665](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L665)

Y축 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`scaleY`](../../../classes/Mesh.md#scaley)

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:674](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L674)

Z축 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:685](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L685)

Z축 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`scaleZ`](../../../classes/Mesh.md#scalez)

***

### spriteSheetInfo

#### Get Signature

> **get** **spriteSheetInfo**(): [`SpriteSheetInfo`](../../../classes/SpriteSheetInfo.md)

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:193](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L193)

스프라이트 시트 정보를 반환합니다.

##### Returns

[`SpriteSheetInfo`](../../../classes/SpriteSheetInfo.md)

현재 스프라이트 시트 정보

#### Set Signature

> **set** **spriteSheetInfo**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:201](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L201)

스프라이트 시트 정보를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpriteSheetInfo`](../../../classes/SpriteSheetInfo.md) | 새로운 스프라이트 시트 정보 |

##### Returns

`void`

***

### state

#### Get Signature

> **get** **state**(): `string`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:114](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L114)

현재 애니메이션 상태를 반환합니다.

##### Returns

`string`

'play', 'pause', 'stop' 중 하나

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:75](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L75)

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

Defined in: [src/display/mesh/Mesh.ts:476](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L476)

버텍스 상태 버퍼 레이아웃을 반환합니다.


##### Returns

`GPUVertexBufferLayout`[]

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`vertexStateBuffers`](../../../classes/Mesh.md#vertexstatebuffers)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:563](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L563)

X 위치 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:574](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L574)

X 위치 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`x`](../../../classes/Mesh.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:583](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L583)

Y 위치 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:594](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L594)

Y 위치 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`y`](../../../classes/Mesh.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:603](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L603)

Z 위치 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:614](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L614)

Z 위치 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`z`](../../../classes/Mesh.md#z)

## Methods

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList?`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:130](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L130)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:69](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L69)

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

> **addChildAt**(`child`, `index`): `ASpriteSheet`

Defined in: [src/display/mesh/core/Object3DContainer.ts:87](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L87)

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](../../../classes/Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`ASpriteSheet`

현재 컨테이너

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`addChildAt`](../../../classes/Mesh.md#addchildat)

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:897](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L897)

이벤트 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | 이벤트 이름
| `callback` | `Function` | 콜백 함수

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`addListener`](../../../classes/Mesh.md#addlistener)

***

### clone()

> **clone**(): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1007](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L1007)

**`Experimental`**

메시를 복제합니다.


#### Returns

[`Mesh`](../../../classes/Mesh.md)

복제된 Mesh 인스턴스


#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`clone`](../../../classes/Mesh.md#clone)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:59](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L59)

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

Defined in: [src/display/mesh/Mesh.ts:1711](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L1711)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:109](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L109)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:123](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L123)

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

Defined in: [src/display/mesh/Mesh.ts:879](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L879)

부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.


#### Returns

`number`

통합 투명도 값


#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`getCombinedOpacity`](../../../classes/Mesh.md#getcombinedopacity)

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L121)

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

Defined in: [src/display/mesh/Mesh.ts:1697](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L1697)

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`initGPURenderInfos`](../../../classes/Mesh.md#initgpurenderinfos)

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:117](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L117)

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

Defined in: [src/display/mesh/Mesh.ts:915](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L915)

메시가 특정 좌표를 바라보도록 회전시킵니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | 대상 X 좌표 또는 [x, y, z] 배열
| `targetY?` | `number` | 대상 Y 좌표 (targetX가 배열인 경우 무시됨)
| `targetZ?` | `number` | 대상 Z 좌표 (targetX가 배열인 경우 무시됨)

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`lookAt`](../../../classes/Mesh.md#lookat)

***

### pause()

> **pause**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:227](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L227)

애니메이션을 일시정지합니다.
상태를 'pause'로 변경하고 현재 프레임에서 정지합니다.

#### Returns

`void`

***

### play()

> **play**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:217](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L217)

애니메이션을 재생합니다.
상태를 'play'로 변경하고 재생을 시작합니다.

#### Returns

`void`

***

### removeAllChildren()

> **removeAllChildren**(): `ASpriteSheet`

Defined in: [src/display/mesh/core/Object3DContainer.ts:232](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L232)

모든 자식 객체를 제거합니다.

#### Returns

`ASpriteSheet`

현재 컨테이너

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`removeAllChildren`](../../../classes/Mesh.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:201](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L201)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:217](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L217)

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

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:249](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L249)

스프라이트 시트를 렌더링합니다.

시간에 따른 프레임 업데이트와 애니메이션 로직을 처리한 후 렌더링을 수행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) | 렌더링 상태 및 디버그 정보 |

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`render`](../../../classes/Mesh.md#render)

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:825](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L825)

하위 계층의 모든 객체에 그림자 캐스팅 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 캐스팅 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`setCastShadowRecursively`](../../../classes/Mesh.md#setcastshadowrecursively)

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:138](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L138)

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

Defined in: [src/display/mesh/Mesh.ts:807](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L807)

하위 계층의 모든 객체에 디버거 활성화 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger` | `boolean` | `false` | 활성화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`setEnableDebuggerRecursively`](../../../classes/Mesh.md#setenabledebuggerrecursively)

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:861](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L861)

하위 계층의 모든 객체에 프러스텀 컬링 무시 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 무시 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`setIgnoreFrustumCullingRecursively`](../../../classes/Mesh.md#setignorefrustumcullingrecursively)

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:966](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L966)

위치를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X 좌표
| `y?` | `number` | Y 좌표 (생략 시 x와 동일)
| `z?` | `number` | Z 좌표 (생략 시 x와 동일)

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`setPosition`](../../../classes/Mesh.md#setposition)

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:843](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L843)

하위 계층의 모든 객체에 그림자 수신 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 수신 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`setReceiveShadowRecursively`](../../../classes/Mesh.md#setreceiveshadowrecursively)

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:989](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L989)

회전값을 설정합니다. (도)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X축 회전
| `rotationY?` | `number` | Y축 회전 (생략 시 rotationX와 동일)
| `rotationZ?` | `number` | Z축 회전 (생략 시 rotationX와 동일)

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`setRotation`](../../../classes/Mesh.md#setrotation)

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:943](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L943)

스케일을 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 스케일
| `y?` | `number` | Y축 스케일 (생략 시 x와 동일)
| `z?` | `number` | Z축 스케일 (생략 시 x와 동일)

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`setScale`](../../../classes/Mesh.md#setscale)

***

### stop()

> **stop**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:236](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L236)

애니메이션을 정지합니다.
상태를 'stop'으로 변경하고 첫 번째 프레임으로 되돌립니다.

#### Returns

`void`

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:161](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L161)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:181](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L181)

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

Defined in: [src/display/mesh/core/MeshBase.ts:113](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L113)

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
