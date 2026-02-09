[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / Line2D

# Class: Line2D

Defined in: [src/display/line/Line2D.ts:32](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line2D.ts#L32)

**`Experimental`**

2D 공간에서 선(라인)을 표현하는 클래스입니다.


2D 평면상에서 여러 점을 연결하여 선을 그릴 수 있습니다. geometry와 material은 생성 시 자동으로 할당되며, 이후 변경이 불가능합니다.


* ### Example
```typescript
const line = new RedGPU.Display.Line2D(redGPUContext);
line.addPoint(0, 0);
line.addPoint(100, 100);
scene.addChild(line);
```

## Extends

- [`Line3D`](Line3D.md)

## Constructors

### Constructor

> **new Line2D**(`redGPUContext`, `type`, `baseColor`): `Line2D`

Defined in: [src/display/line/Line2D.ts:46](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line2D.ts#L46)

**`Experimental`**

Line2D 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPU 컨텍스트
| `type` | [`LINE_TYPE`](../type-aliases/LINE_TYPE.md) | `LINE_TYPE.LINEAR` | 라인 타입 (기본값: LINE_TYPE.LINEAR)
| `baseColor` | `string` | `'#fff'` | 기본 색상 (기본값: #fff)

#### Returns

`Line2D`

#### Overrides

[`Line3D`](Line3D.md).[`constructor`](Line3D.md#constructor)

## Properties

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:374](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L374)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`_geometry`](Line3D.md#_geometry)

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:349](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L349)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`_material`](Line3D.md#_material)

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:33](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L33)

**`Experimental`**

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

[`Line3D`](Line3D.md).[`animationInfo`](Line3D.md#animationinfo)

***

### baseColor

> **baseColor**: `any`

Defined in: [src/display/line/Line3D.ts:60](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L60)

**`Experimental`**

기본 색상


#### Inherited from

[`Line3D`](Line3D.md).[`baseColor`](Line3D.md#basecolor)

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:93](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L93)

**`Experimental`**

그림자 캐스팅 여부


#### Inherited from

[`Line3D`](Line3D.md).[`castShadow`](Line3D.md#castshadow)

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:98](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L98)

**`Experimental`**

LOD 정보 변경 필요 여부


#### Inherited from

[`Line3D`](Line3D.md).[`dirtyLOD`](Line3D.md#dirtylod)

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:49](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L49)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`dirtyOpacity`](Line3D.md#dirtyopacity)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:47](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L47)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`dirtyPipeline`](Line3D.md#dirtypipeline)

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:48](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L48)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`dirtyTransform`](Line3D.md#dirtytransform)

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L45)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`disableJitter`](Line3D.md#disablejitter)

***

### displacementTexture

> **displacementTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/display/mesh/Mesh.ts:88](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L88)

**`Experimental`**

메시의 디스플레이스먼트 텍스처


#### Inherited from

[`Line3D`](Line3D.md).[`displacementTexture`](Line3D.md#displacementtexture)

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:46](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L46)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`gltfLoaderInfo`](Line3D.md#gltfloaderinfo)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L32)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`gpuRenderInfo`](Line3D.md#gpurenderinfo)

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:51](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L51)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`localMatrix`](Line3D.md#localmatrix)

***

### meshType

> **meshType**: `string`

Defined in: [src/display/mesh/Mesh.ts:46](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L46)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`meshType`](Line3D.md#meshtype)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:50](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L50)

**`Experimental`**

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

[`Line3D`](Line3D.md).[`modelMatrix`](Line3D.md#modelmatrix)

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:52](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L52)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`normalModelMatrix`](Line3D.md#normalmodelmatrix)

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:103](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L103)

**`Experimental`**

프러스텀 컬링 통과 여부


#### Inherited from

[`Line3D`](Line3D.md).[`passFrustumCulling`](Line3D.md#passfrustumculling)

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:44](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L44)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`receiveShadow`](Line3D.md#receiveshadow)

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:47](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L47)

**`Experimental`**

#### Inherited from

[`Line3D`](Line3D.md).[`useDisplacementTexture`](Line3D.md#usedisplacementtexture)

## Accessors

### boundingAABB

#### Get Signature

> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:783](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L783)

**`Experimental`**

AABB(Axis-Aligned Bounding Box) 정보를 반환합니다.


##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Line3D`](Line3D.md).[`boundingAABB`](Line3D.md#boundingaabb)

***

### boundingOBB

#### Get Signature

> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:770](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L770)

**`Experimental`**

OBB(Oriented Bounding Box) 정보를 반환합니다.


##### Returns

[`OBB`](../../Bound/classes/OBB.md)

#### Inherited from

[`Line3D`](Line3D.md).[`boundingOBB`](Line3D.md#boundingobb)

***

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:42](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L42)

**`Experimental`**

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 객체 배열

#### Inherited from

[`Line3D`](Line3D.md).[`children`](Line3D.md#children)

***

### combinedBoundingAABB

#### Get Signature

> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:796](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L796)

**`Experimental`**

자식 객체들을 포함한 통합 AABB 정보를 반환합니다.


##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Line3D`](Line3D.md).[`combinedBoundingAABB`](Line3D.md#combinedboundingaabb)

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L79)

**`Experimental`**

##### Returns

`string`

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:83](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L83)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`currentShaderModuleName`](Line3D.md#currentshadermodulename)

***

### depthStencilState

#### Get Signature

> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:92](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L92)

**`Experimental`**

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

#### Inherited from

[`Line3D`](Line3D.md).[`depthStencilState`](Line3D.md#depthstencilstate)

***

### distance

#### Get Signature

> **get** **distance**(): `number`

Defined in: [src/display/line/Line3D.ts:186](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L186)

**`Experimental`**

곡선 단순화 허용 거리를 반환/설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **distance**(`value`): `void`

Defined in: [src/display/line/Line3D.ts:190](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L190)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`distance`](Line3D.md#distance)

***

### drawDebugger

#### Get Signature

> **get** **drawDebugger**(): `DrawDebuggerMesh`

Defined in: [src/display/mesh/Mesh.ts:345](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L345)

**`Experimental`**

디버그 메시 객체를 반환합니다.


##### Returns

`DrawDebuggerMesh`

#### Inherited from

[`Line3D`](Line3D.md).[`drawDebugger`](Line3D.md#drawdebugger)

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:325](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L325)

**`Experimental`**

디버거 활성화 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:336](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L336)

**`Experimental`**

디버거 활성화 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 활성화 여부

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`enableDebugger`](Line3D.md#enabledebugger)

***

### events

#### Get Signature

> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:448](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L448)

**`Experimental`**

등록된 이벤트들을 반환합니다.


##### Returns

`any`

#### Inherited from

[`Line3D`](Line3D.md).[`events`](Line3D.md#events)

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/line/Line2D.ts:54](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line2D.ts#L54)

**`Experimental`**

geometry를 반환합니다. (생성 시 자동 할당, 변경 불가)

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/line/Line2D.ts:61](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line2D.ts#L61)

**`Experimental`**

geometry를 변경할 수 없습니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) |

##### Returns

`void`

#### Overrides

[`Line3D`](Line3D.md).[`geometry`](Line3D.md#geometry)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:100](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L100)

**`Experimental`**

Retrieves the GPU device associated with the current instance.

##### Returns

`GPUDevice`

The GPU device.

#### Inherited from

[`Line3D`](Line3D.md).[`gpuDevice`](Line3D.md#gpudevice)

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:421](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L421)

**`Experimental`**

프러스텀 컬링 무시 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:432](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L432)

**`Experimental`**

프러스텀 컬링 무시 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 무시 여부

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`ignoreFrustumCulling`](Line3D.md#ignorefrustumculling)

***

### interleaveData

#### Get Signature

> **get** **interleaveData**(): `number`[]

Defined in: [src/display/line/Line3D.ts:153](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L153)

**`Experimental`**

버텍스 interleave 데이터 배열을 반환합니다.

##### Returns

`number`[]

#### Inherited from

[`Line3D`](Line3D.md).[`interleaveData`](Line3D.md#interleavedata)

***

### LODManager

#### Get Signature

> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:317](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L317)

**`Experimental`**

LOD(Level of Detail) 매니저를 반환합니다.


##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager 인스턴스


#### Inherited from

[`Line3D`](Line3D.md).[`LODManager`](Line3D.md#lodmanager)

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/line/Line2D.ts:68](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line2D.ts#L68)

**`Experimental`**

material을 반환합니다. (생성 시 자동 할당, 변경 불가)

##### Returns

`any`

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/line/Line2D.ts:75](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line2D.ts#L75)

**`Experimental`**

material을 변경할 수 없습니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `any` |

##### Returns

`void`

#### Overrides

[`Line3D`](Line3D.md).[`material`](Line3D.md#material)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/display/mesh/Mesh.ts:456](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L456)

**`Experimental`**

메시의 이름을 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:468](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L468)

**`Experimental`**

메시의 이름을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 메시 이름

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`name`](Line3D.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:50](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L50)

**`Experimental`**

자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 수

#### Inherited from

[`Line3D`](Line3D.md).[`numChildren`](Line3D.md#numchildren)

***

### numPoints

#### Get Signature

> **get** **numPoints**(): `number`

Defined in: [src/display/line/Line3D.ts:199](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L199)

**`Experimental`**

현재 라인의 점 개수를 반환합니다.

##### Returns

`number`

#### Inherited from

[`Line3D`](Line3D.md).[`numPoints`](Line3D.md#numpoints)

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:400](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L400)

**`Experimental`**

메시의 투명도를 반환합니다. (0~1)


##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:411](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L411)

**`Experimental`**

메시의 투명도를 설정합니다. (0~1)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 투명도 값

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`opacity`](Line3D.md#opacity)

***

### originalPoints

#### Get Signature

> **get** **originalPoints**(): `LinePointWithInOut`[]

Defined in: [src/display/line/Line3D.ts:134](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L134)

**`Experimental`**

원본 점(LinePointWithInOut) 배열을 반환합니다.

##### Returns

`LinePointWithInOut`[]

#### Inherited from

[`Line3D`](Line3D.md).[`originalPoints`](Line3D.md#originalpoints)

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:484](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L484)

**`Experimental`**

설정된 부모 객체를 반환합니다.


##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:495](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L495)

**`Experimental`**

부모 객체를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) | 부모 컨테이너

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`parent`](Line3D.md#parent)

***

### pickingId

#### Get Signature

> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:440](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L440)

**`Experimental`**

피킹 ID를 반환합니다.


##### Returns

`number`

#### Inherited from

[`Line3D`](Line3D.md).[`pickingId`](Line3D.md#pickingid)

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:503](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L503)

**`Experimental`**

피벗 X 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:514](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L514)

**`Experimental`**

피벗 X 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 좌표

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`pivotX`](Line3D.md#pivotx)

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:523](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L523)

**`Experimental`**

피벗 Y 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:534](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L534)

**`Experimental`**

피벗 Y 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 좌표

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`pivotY`](Line3D.md#pivoty)

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:543](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L543)

**`Experimental`**

피벗 Z 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:554](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L554)

**`Experimental`**

피벗 Z 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 좌표

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`pivotZ`](Line3D.md#pivotz)

***

### position

#### Get Signature

> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:626](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L626)

**`Experimental`**

현재 위치를 반환합니다. [x, y, z]


##### Returns

`Float32Array`

위치 배열


#### Inherited from

[`Line3D`](Line3D.md).[`position`](Line3D.md#position)

***

### primitiveState

#### Get Signature

> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:88](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L88)

**`Experimental`**

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

#### Inherited from

[`Line3D`](Line3D.md).[`primitiveState`](Line3D.md#primitivestate)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:109](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L109)

**`Experimental`**

Retrieves the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

The RedGPUContext instance.

#### Inherited from

[`Line3D`](Line3D.md).[`redGPUContext`](Line3D.md#redgpucontext)

***

### rotation

#### Get Signature

> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:762](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L762)

**`Experimental`**

현재 회전값을 반환합니다. [x, y, z] (도)


##### Returns

`Float32Array`

#### Inherited from

[`Line3D`](Line3D.md).[`rotation`](Line3D.md#rotation)

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:702](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L702)

**`Experimental`**

X축 회전값을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:713](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L713)

**`Experimental`**

X축 회전값을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`rotationX`](Line3D.md#rotationx)

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:722](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L722)

**`Experimental`**

Y축 회전값을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:733](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L733)

**`Experimental`**

Y축 회전값을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`rotationY`](Line3D.md#rotationy)

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:742](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L742)

**`Experimental`**

Z축 회전값을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:753](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L753)

**`Experimental`**

Z축 회전값을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`rotationZ`](Line3D.md#rotationz)

***

### scale

#### Get Signature

> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:694](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L694)

**`Experimental`**

현재 스케일을 반환합니다. [x, y, z]


##### Returns

`Float32Array`

#### Inherited from

[`Line3D`](Line3D.md).[`scale`](Line3D.md#scale)

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:634](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L634)

**`Experimental`**

X축 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:645](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L645)

**`Experimental`**

X축 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`scaleX`](Line3D.md#scalex)

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:654](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L654)

**`Experimental`**

Y축 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:665](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L665)

**`Experimental`**

Y축 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`scaleY`](Line3D.md#scaley)

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:674](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L674)

**`Experimental`**

Z축 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:685](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L685)

**`Experimental`**

Z축 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`scaleZ`](Line3D.md#scalez)

***

### tension

#### Get Signature

> **get** **tension**(): `number`

Defined in: [src/display/line/Line3D.ts:160](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L160)

**`Experimental`**

Catmull-Rom 곡선의 텐션 값을 반환/설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **tension**(`value`): `void`

Defined in: [src/display/line/Line3D.ts:164](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L164)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`tension`](Line3D.md#tension)

***

### tolerance

#### Get Signature

> **get** **tolerance**(): `number`

Defined in: [src/display/line/Line3D.ts:173](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L173)

**`Experimental`**

곡선 샘플링 허용 오차를 반환/설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **tolerance**(`value`): `void`

Defined in: [src/display/line/Line3D.ts:177](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L177)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`tolerance`](Line3D.md#tolerance)

***

### type

#### Get Signature

> **get** **type**(): [`LINE_TYPE`](../type-aliases/LINE_TYPE.md)

Defined in: [src/display/line/Line3D.ts:141](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L141)

**`Experimental`**

라인 타입을 반환/설정합니다.

##### Returns

[`LINE_TYPE`](../type-aliases/LINE_TYPE.md)

#### Set Signature

> **set** **type**(`value`): `void`

Defined in: [src/display/line/Line3D.ts:145](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L145)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`LINE_TYPE`](../type-aliases/LINE_TYPE.md) |

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`type`](Line3D.md#type)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:75](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L75)

**`Experimental`**

Retrieves the UUID of the object.

##### Returns

`string`

The UUID of the object.

#### Inherited from

[`Line3D`](Line3D.md).[`uuid`](Line3D.md#uuid)

***

### vertexStateBuffers

#### Get Signature

> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:476](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L476)

**`Experimental`**

버텍스 상태 버퍼 레이아웃을 반환합니다.


##### Returns

`GPUVertexBufferLayout`[]

#### Inherited from

[`Line3D`](Line3D.md).[`vertexStateBuffers`](Line3D.md#vertexstatebuffers)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:563](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L563)

**`Experimental`**

X 위치 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:574](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L574)

**`Experimental`**

X 위치 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 좌표

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`x`](Line3D.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:583](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L583)

**`Experimental`**

Y 위치 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:594](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L594)

**`Experimental`**

Y 위치 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 좌표

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`y`](Line3D.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:603](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L603)

**`Experimental`**

Z 위치 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:614](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L614)

**`Experimental`**

Z 위치 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 좌표

##### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`z`](Line3D.md#z)

## Methods

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList?`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:130](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L130)

**`Experimental`**

Fires the dirty listeners list.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Indicates whether to reset the dirty listeners list after firing. |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`__fireListenerList`](Line3D.md#__firelistenerlist)

***

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:69](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L69)

**`Experimental`**

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

[`Line3D`](Line3D.md).[`addChild`](Line3D.md#addchild)

***

### addChildAt()

> **addChildAt**(`child`, `index`): `Line2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:87](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L87)

**`Experimental`**

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`Line2D`

현재 컨테이너

#### Inherited from

[`Line3D`](Line3D.md).[`addChildAt`](Line3D.md#addchildat)

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:897](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L897)

**`Experimental`**

이벤트 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | 이벤트 이름
| `callback` | `Function` | 콜백 함수

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`addListener`](Line3D.md#addlistener)

***

### addPoint()

> **addPoint**(`x`, `y`, `color`, `colorAlpha`, `inX`, `inY`, `outX`, `outY`): `void`

Defined in: [src/display/line/Line2D.ts:99](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line2D.ts#L99)

**`Experimental`**

2D 평면상에 점을 추가합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `x` | `number` | `0` | X 좌표 |
| `y` | `number` | `0` | Y 좌표 |
| `color` | `string` | `...` | 점 색상 (기본값: baseColor) |
| `colorAlpha` | `number` | `1` | 알파값 (기본값: 1) |
| `inX` | `number` | `0` | in tangent X (기본값: 0) |
| `inY` | `number` | `0` | in tangent Y (기본값: 0) |
| `outX` | `number` | `0` | out tangent X (기본값: 0) |
| `outY` | `number` | `0` | out tangent Y (기본값: 0) |

#### Returns

`void`

#### Overrides

[`Line3D`](Line3D.md).[`addPoint`](Line3D.md#addpoint)

***

### addPointAt()

> **addPointAt**(`index`, `x`, `y`, `color`, `colorAlpha`, `inX`, `inY`, `outX`, `outY`): `void`

Defined in: [src/display/line/Line2D.ts:121](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line2D.ts#L121)

**`Experimental`**

2D 평면상에 지정한 위치에 점을 추가합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `index` | `number` | `undefined` | 추가할 위치 인덱스 |
| `x` | `number` | `0` | X 좌표 |
| `y` | `number` | `0` | Y 좌표 |
| `color` | `string` | `...` | 점 색상 (기본값: baseColor) |
| `colorAlpha` | `number` | `1` | 알파값 (기본값: 1) |
| `inX` | `number` | `0` | in tangent X (기본값: 0) |
| `inY` | `number` | `0` | in tangent Y (기본값: 0) |
| `outX` | `number` | `0` | out tangent X (기본값: 0) |
| `outY` | `number` | `0` | out tangent Y (기본값: 0) |

#### Returns

`void`

#### Overrides

[`Line3D`](Line3D.md).[`addPointAt`](Line3D.md#addpointat)

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1007](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L1007)

**`Experimental`**

메시를 복제합니다.


#### Returns

[`Mesh`](Mesh.md)

복제된 Mesh 인스턴스


#### Inherited from

[`Line3D`](Line3D.md).[`clone`](Line3D.md#clone)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:59](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L59)

**`Experimental`**

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`Line3D`](Line3D.md).[`contains`](Line3D.md#contains)

***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/line/Line2D.ts:83](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line2D.ts#L83)

**`Experimental`**

커스텀 버텍스 셰이더 모듈을 생성합니다.

#### Returns

`GPUShaderModule`

생성된 셰이더 모듈

#### Overrides

[`Line3D`](Line3D.md).[`createCustomMeshVertexShaderModule`](Line3D.md#createcustommeshvertexshadermodule)

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1711](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L1711)

**`Experimental`**

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

[`Line3D`](Line3D.md).[`createMeshVertexShaderModuleBASIC`](Line3D.md#createmeshvertexshadermodulebasic)

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:109](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L109)

**`Experimental`**

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

[`Line3D`](Line3D.md).[`getChildAt`](Line3D.md#getchildat)

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:123](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L123)

**`Experimental`**

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

[`Line3D`](Line3D.md).[`getChildIndex`](Line3D.md#getchildindex)

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:879](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L879)

**`Experimental`**

부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.


#### Returns

`number`

통합 투명도 값


#### Inherited from

[`Line3D`](Line3D.md).[`getCombinedOpacity`](Line3D.md#getcombinedopacity)

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L121)

**`Experimental`**

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](View3D.md) |

#### Returns

\[`number`, `number`\]

#### Inherited from

[`Line3D`](Line3D.md).[`getScreenPoint`](Line3D.md#getscreenpoint)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1697](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L1697)

**`Experimental`**

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`initGPURenderInfos`](Line3D.md#initgpurenderinfos)

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:117](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L117)

**`Experimental`**

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`Line3D`](Line3D.md).[`localToWorld`](Line3D.md#localtoworld)

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:915](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L915)

**`Experimental`**

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

[`Line3D`](Line3D.md).[`lookAt`](Line3D.md#lookat)

***

### removeAllChildren()

> **removeAllChildren**(): `Line2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:232](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L232)

**`Experimental`**

모든 자식 객체를 제거합니다.

#### Returns

`Line2D`

현재 컨테이너

#### Inherited from

[`Line3D`](Line3D.md).[`removeAllChildren`](Line3D.md#removeallchildren)

***

### removeAllPoint()

> **removeAllPoint**(): `void`

Defined in: [src/display/line/Line3D.ts:313](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L313)

**`Experimental`**

모든 점을 삭제합니다.

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`removeAllPoint`](Line3D.md#removeallpoint)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:201](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L201)

**`Experimental`**

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`Line3D`](Line3D.md).[`removeChild`](Line3D.md#removechild)

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:217](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L217)

**`Experimental`**

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`Line3D`](Line3D.md).[`removeChildAt`](Line3D.md#removechildat)

***

### removePointAt()

> **removePointAt**(`index`): `void`

Defined in: [src/display/line/Line3D.ts:303](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/line/Line3D.ts#L303)

**`Experimental`**

지정한 위치의 점을 삭제합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 삭제할 위치 인덱스 |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`removePointAt`](Line3D.md#removepointat)

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/mesh/Mesh.ts:1029](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L1029)

**`Experimental`**

메시를 렌더링합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 렌더 상태 데이터

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`render`](Line3D.md#render)

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:825](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L825)

**`Experimental`**

하위 계층의 모든 객체에 그림자 캐스팅 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 캐스팅 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setCastShadowRecursively`](Line3D.md#setcastshadowrecursively)

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:138](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L138)

**`Experimental`**

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setChildIndex`](Line3D.md#setchildindex)

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger`): `void`

Defined in: [src/display/mesh/Mesh.ts:807](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L807)

**`Experimental`**

하위 계층의 모든 객체에 디버거 활성화 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger` | `boolean` | `false` | 활성화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setEnableDebuggerRecursively`](Line3D.md#setenabledebuggerrecursively)

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:861](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L861)

**`Experimental`**

하위 계층의 모든 객체에 프러스텀 컬링 무시 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 무시 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setIgnoreFrustumCullingRecursively`](Line3D.md#setignorefrustumcullingrecursively)

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:966](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L966)

**`Experimental`**

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

[`Line3D`](Line3D.md).[`setPosition`](Line3D.md#setposition)

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:843](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L843)

**`Experimental`**

하위 계층의 모든 객체에 그림자 수신 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 수신 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`setReceiveShadowRecursively`](Line3D.md#setreceiveshadowrecursively)

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:989](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L989)

**`Experimental`**

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

[`Line3D`](Line3D.md).[`setRotation`](Line3D.md#setrotation)

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:943](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/Mesh.ts#L943)

**`Experimental`**

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

[`Line3D`](Line3D.md).[`setScale`](Line3D.md#setscale)

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:161](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L161)

**`Experimental`**

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`swapChildren`](Line3D.md#swapchildren)

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:181](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/Object3DContainer.ts#L181)

**`Experimental`**

두 인덱스의 자식 객체 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

[`Line3D`](Line3D.md).[`swapChildrenAt`](Line3D.md#swapchildrenat)

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:113](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/mesh/core/MeshBase.ts#L113)

**`Experimental`**

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`Line3D`](Line3D.md).[`worldToLocal`](Line3D.md#worldtolocal)
