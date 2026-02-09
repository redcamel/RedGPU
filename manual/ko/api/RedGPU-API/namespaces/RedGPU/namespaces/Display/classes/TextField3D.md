[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / TextField3D

# Class: TextField3D

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:11](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L11)

3D 공간에서 텍스트를 표현하는 클래스입니다.


내부적으로 Plane 지오메트리를 사용하며, 텍스트 렌더링 결과를 텍스처로 출력하여 화면에 표시합니다. Billboard 기능을 지원하며, 텍스트 크기에 따라 transform을 자동으로 갱신합니다.


geometry와 material은 고정되어 있으며 외부에서 변경할 수 없습니다.


### Example
```typescript
const textField = new RedGPU.Display.TextField3D(redGPUContext, "Hello RedGPU!");
scene.addChild(textField);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/textField/textField3D/"></iframe>

월드 사이즈와 픽셀 사이즈 모드를 비교하는 예제입니다.

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/textField/textField3DCompare/"></iframe>

아래는 TextField3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.


## See

 - [TextField3D Comparison (World vs Pixel)](https://redcamel.github.io/RedGPU/examples/3d/textField/textField3DCompare/)
 - [TextField3D MouseEvent example](https://redcamel.github.io/RedGPU/examples/3d/mouseEvent/textField3D/)

## Extends

- [`ATextField`](../namespaces/CoreTextField/classes/ATextField.md)

## Constructors

### Constructor

> **new TextField3D**(`redGPUContext`, `text?`): `TextField3D`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:67](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L67)

새로운 TextField3D 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `text?` | `string` | 초기 텍스트 문자열

#### Returns

`TextField3D`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`constructor`](../namespaces/CoreTextField/classes/ATextField.md#constructor)

## Properties

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:374](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L374)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`_geometry`](../namespaces/CoreTextField/classes/ATextField.md#_geometry)

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:349](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L349)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`_material`](../namespaces/CoreTextField/classes/ATextField.md#_material)

***

### \_renderRatioX

> **\_renderRatioX**: `number`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:14](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L14)

***

### \_renderRatioY

> **\_renderRatioY**: `number`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:15](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L15)

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:33](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L33)

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

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`animationInfo`](../namespaces/CoreTextField/classes/ATextField.md#animationinfo)

***

### background

> **background**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:18](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L18)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`background`](../namespaces/CoreTextField/classes/ATextField.md#background)

***

### border

> **border**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:25](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L25)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`border`](../namespaces/CoreTextField/classes/ATextField.md#border)

***

### borderRadius

> **borderRadius**: `string` \| `number`

Defined in: [src/display/textFileds/core/ATextField.ts:26](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L26)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`borderRadius`](../namespaces/CoreTextField/classes/ATextField.md#borderradius)

***

### boxShadow

> **boxShadow**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:27](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L27)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boxShadow`](../namespaces/CoreTextField/classes/ATextField.md#boxshadow)

***

### boxSizing

> **boxSizing**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:28](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L28)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boxSizing`](../namespaces/CoreTextField/classes/ATextField.md#boxsizing)

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:93](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L93)

그림자 캐스팅 여부


#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`castShadow`](../namespaces/CoreTextField/classes/ATextField.md#castshadow)

***

### color

> **color**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:17](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L17)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`color`](../namespaces/CoreTextField/classes/ATextField.md#color)

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:98](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L98)

LOD 정보 변경 필요 여부


#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyLOD`](../namespaces/CoreTextField/classes/ATextField.md#dirtylod)

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:49](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L49)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyOpacity`](../namespaces/CoreTextField/classes/ATextField.md#dirtyopacity)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:47](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L47)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyPipeline`](../namespaces/CoreTextField/classes/ATextField.md#dirtypipeline)

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:48](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L48)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyTransform`](../namespaces/CoreTextField/classes/ATextField.md#dirtytransform)

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L45)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`disableJitter`](../namespaces/CoreTextField/classes/ATextField.md#disablejitter)

***

### displacementTexture

> **displacementTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/display/mesh/Mesh.ts:88](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L88)

메시의 디스플레이스먼트 텍스처


#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`displacementTexture`](../namespaces/CoreTextField/classes/ATextField.md#displacementtexture)

***

### filter

> **filter**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:29](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L29)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`filter`](../namespaces/CoreTextField/classes/ATextField.md#filter)

***

### fontFamily

> **fontFamily**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:14](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L14)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontFamily`](../namespaces/CoreTextField/classes/ATextField.md#fontfamily)

***

### fontSize

> **fontSize**: `number`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:13](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L13)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontSize`](../namespaces/CoreTextField/classes/ATextField.md#fontsize)

***

### fontStyle

> **fontStyle**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:16](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L16)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontStyle`](../namespaces/CoreTextField/classes/ATextField.md#fontstyle)

***

### fontWeight

> **fontWeight**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:15](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L15)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontWeight`](../namespaces/CoreTextField/classes/ATextField.md#fontweight)

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:46](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L46)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`gltfLoaderInfo`](../namespaces/CoreTextField/classes/ATextField.md#gltfloaderinfo)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L32)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`gpuRenderInfo`](../namespaces/CoreTextField/classes/ATextField.md#gpurenderinfo)

***

### letterSpacing

> **letterSpacing**: `number`

Defined in: [src/display/textFileds/core/ATextField.ts:20](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L20)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`letterSpacing`](../namespaces/CoreTextField/classes/ATextField.md#letterspacing)

***

### lineHeight

> **lineHeight**: `number`

Defined in: [src/display/textFileds/core/ATextField.ts:24](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L24)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`lineHeight`](../namespaces/CoreTextField/classes/ATextField.md#lineheight)

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:51](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L51)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`localMatrix`](../namespaces/CoreTextField/classes/ATextField.md#localmatrix)

***

### meshType

> **meshType**: `string`

Defined in: [src/display/mesh/Mesh.ts:46](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L46)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`meshType`](../namespaces/CoreTextField/classes/ATextField.md#meshtype)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:50](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L50)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`modelMatrix`](../namespaces/CoreTextField/classes/ATextField.md#modelmatrix)

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:52](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L52)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`normalModelMatrix`](../namespaces/CoreTextField/classes/ATextField.md#normalmodelmatrix)

***

### padding

> **padding**: `number`

Defined in: [src/display/textFileds/core/ATextField.ts:19](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L19)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`padding`](../namespaces/CoreTextField/classes/ATextField.md#padding)

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:103](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L103)

프러스텀 컬링 통과 여부


#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`passFrustumCulling`](../namespaces/CoreTextField/classes/ATextField.md#passfrustumculling)

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:44](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L44)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`receiveShadow`](../namespaces/CoreTextField/classes/ATextField.md#receiveshadow)

***

### textAlign

> **textAlign**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:23](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L23)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`textAlign`](../namespaces/CoreTextField/classes/ATextField.md#textalign)

***

### useBillboard

> **useBillboard**: `boolean`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:12](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L12)

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:47](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L47)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`useDisplacementTexture`](../namespaces/CoreTextField/classes/ATextField.md#usedisplacementtexture)

***

### verticalAlign

> **verticalAlign**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:22](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L22)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`verticalAlign`](../namespaces/CoreTextField/classes/ATextField.md#verticalalign)

***

### wordBreak

> **wordBreak**: `string`

Defined in: [src/display/textFileds/core/ATextField.ts:21](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L21)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`wordBreak`](../namespaces/CoreTextField/classes/ATextField.md#wordbreak)

## Accessors

### boundingAABB

#### Get Signature

> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:783](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L783)

AABB(Axis-Aligned Bounding Box) 정보를 반환합니다.


##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boundingAABB`](../namespaces/CoreTextField/classes/ATextField.md#boundingaabb)

***

### boundingOBB

#### Get Signature

> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:770](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L770)

OBB(Oriented Bounding Box) 정보를 반환합니다.


##### Returns

[`OBB`](../../Bound/classes/OBB.md)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boundingOBB`](../namespaces/CoreTextField/classes/ATextField.md#boundingobb)

***

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:42](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L42)

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 객체 배열

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`children`](../namespaces/CoreTextField/classes/ATextField.md#children)

***

### combinedBoundingAABB

#### Get Signature

> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:796](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L796)

자식 객체들을 포함한 통합 AABB 정보를 반환합니다.


##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`combinedBoundingAABB`](../namespaces/CoreTextField/classes/ATextField.md#combinedboundingaabb)

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L79)

##### Returns

`string`

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:83](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L83)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`currentShaderModuleName`](../namespaces/CoreTextField/classes/ATextField.md#currentshadermodulename)

***

### depthStencilState

#### Get Signature

> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:92](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L92)

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`depthStencilState`](../namespaces/CoreTextField/classes/ATextField.md#depthstencilstate)

***

### drawDebugger

#### Get Signature

> **get** **drawDebugger**(): `DrawDebuggerMesh`

Defined in: [src/display/mesh/Mesh.ts:345](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L345)

디버그 메시 객체를 반환합니다.


##### Returns

`DrawDebuggerMesh`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`drawDebugger`](../namespaces/CoreTextField/classes/ATextField.md#drawdebugger)

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:325](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L325)

디버거 활성화 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:336](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L336)

디버거 활성화 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 활성화 여부

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`enableDebugger`](../namespaces/CoreTextField/classes/ATextField.md#enabledebugger)

***

### events

#### Get Signature

> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:448](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L448)

등록된 이벤트들을 반환합니다.


##### Returns

`any`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`events`](../namespaces/CoreTextField/classes/ATextField.md#events)

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:199](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L199)

텍스트가 출력되는 지오메트리를 반환합니다. Plane으로 고정됩니다.


##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

현재 지오메트리


#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:210](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L210)

geometry는 외부에서 변경할 수 없습니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) | 설정하려는 지오메트리

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`geometry`](../namespaces/CoreTextField/classes/ATextField.md#geometry)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:100](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L100)

Retrieves the GPU device associated with the current instance.

##### Returns

`GPUDevice`

The GPU device.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`gpuDevice`](../namespaces/CoreTextField/classes/ATextField.md#gpudevice)

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:421](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L421)

프러스텀 컬링 무시 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:432](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L432)

프러스텀 컬링 무시 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 무시 여부

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`ignoreFrustumCulling`](../namespaces/CoreTextField/classes/ATextField.md#ignorefrustumculling)

***

### LODManager

#### Get Signature

> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:317](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L317)

LOD(Level of Detail) 매니저를 반환합니다.


##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager 인스턴스


#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`LODManager`](../namespaces/CoreTextField/classes/ATextField.md#lodmanager)

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:221](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L221)

텍스처를 관리하는 내부 머티리얼을 반환합니다.


##### Returns

`any`

머티리얼 객체


#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:232](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L232)

material은 외부에서 변경할 수 없습니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | 설정하려는 머티리얼

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`material`](../namespaces/CoreTextField/classes/ATextField.md#material)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/display/mesh/Mesh.ts:456](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L456)

메시의 이름을 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:468](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L468)

메시의 이름을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 메시 이름

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`name`](../namespaces/CoreTextField/classes/ATextField.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:50](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L50)

자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 수

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`numChildren`](../namespaces/CoreTextField/classes/ATextField.md#numchildren)

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:400](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L400)

메시의 투명도를 반환합니다. (0~1)


##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:411](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L411)

메시의 투명도를 설정합니다. (0~1)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 투명도 값

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`opacity`](../namespaces/CoreTextField/classes/ATextField.md#opacity)

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:484](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L484)

설정된 부모 객체를 반환합니다.


##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:495](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L495)

부모 객체를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) | 부모 컨테이너

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`parent`](../namespaces/CoreTextField/classes/ATextField.md#parent)

***

### pickingId

#### Get Signature

> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:440](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L440)

피킹 ID를 반환합니다.


##### Returns

`number`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`pickingId`](../namespaces/CoreTextField/classes/ATextField.md#pickingid)

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:503](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L503)

피벗 X 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:514](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L514)

피벗 X 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 좌표

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`pivotX`](../namespaces/CoreTextField/classes/ATextField.md#pivotx)

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:523](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L523)

피벗 Y 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:534](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L534)

피벗 Y 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 좌표

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`pivotY`](../namespaces/CoreTextField/classes/ATextField.md#pivoty)

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:543](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L543)

피벗 Z 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:554](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L554)

피벗 Z 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 좌표

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`pivotZ`](../namespaces/CoreTextField/classes/ATextField.md#pivotz)

***

### pixelSize

#### Get Signature

> **get** **pixelSize**(): `number`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:126](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L126)

실제 렌더링된 물리 픽셀 크기(높이)를 반환합니다.


##### Returns

`number`

***

### position

#### Get Signature

> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:626](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L626)

현재 위치를 반환합니다. [x, y, z]


##### Returns

`Float32Array`

위치 배열


#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`position`](../namespaces/CoreTextField/classes/ATextField.md#position)

***

### primitiveState

#### Get Signature

> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:88](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L88)

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`primitiveState`](../namespaces/CoreTextField/classes/ATextField.md#primitivestate)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:109](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L109)

Retrieves the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

The RedGPUContext instance.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`redGPUContext`](../namespaces/CoreTextField/classes/ATextField.md#redgpucontext)

***

### rotation

#### Get Signature

> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:762](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L762)

현재 회전값을 반환합니다. [x, y, z] (도)


##### Returns

`Float32Array`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`rotation`](../namespaces/CoreTextField/classes/ATextField.md#rotation)

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:702](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L702)

X축 회전값을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:713](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L713)

X축 회전값을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`rotationX`](../namespaces/CoreTextField/classes/ATextField.md#rotationx)

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:722](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L722)

Y축 회전값을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:733](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L733)

Y축 회전값을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`rotationY`](../namespaces/CoreTextField/classes/ATextField.md#rotationy)

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:742](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L742)

Z축 회전값을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:753](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L753)

Z축 회전값을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`rotationZ`](../namespaces/CoreTextField/classes/ATextField.md#rotationz)

***

### scale

#### Get Signature

> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:694](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L694)

현재 스케일을 반환합니다. [x, y, z]


##### Returns

`Float32Array`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`scale`](../namespaces/CoreTextField/classes/ATextField.md#scale)

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:634](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L634)

X축 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:645](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L645)

X축 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`scaleX`](../namespaces/CoreTextField/classes/ATextField.md#scalex)

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:654](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L654)

Y축 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:665](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L665)

Y축 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`scaleY`](../namespaces/CoreTextField/classes/ATextField.md#scaley)

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:674](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L674)

Z축 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:685](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L685)

Z축 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`scaleZ`](../namespaces/CoreTextField/classes/ATextField.md#scalez)

***

### text

#### Get Signature

> **get** **text**(): `string`

Defined in: [src/display/textFileds/core/ATextField.ts:113](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L113)

##### Returns

`string`

#### Set Signature

> **set** **text**(`text`): `void`

Defined in: [src/display/textFileds/core/ATextField.ts:117](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/core/ATextField.ts#L117)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`text`](../namespaces/CoreTextField/classes/ATextField.md#text)

***

### usePixelSize

#### Get Signature

> **get** **usePixelSize**(): `boolean`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:118](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L118)

고정 픽셀 크기(Pixel Size) 모드 사용 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **usePixelSize**(`value`): `void`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:137](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L137)

고정 픽셀 크기(Pixel Size) 모드 사용 여부를 설정합니다. true일 경우 거리에 상관없이 렌더링된 물리 픽셀 크기로 표시됩니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 사용 여부

##### Returns

`void`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:75](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L75)

Retrieves the UUID of the object.

##### Returns

`string`

The UUID of the object.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`uuid`](../namespaces/CoreTextField/classes/ATextField.md#uuid)

***

### vertexStateBuffers

#### Get Signature

> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:476](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L476)

버텍스 상태 버퍼 레이아웃을 반환합니다.


##### Returns

`GPUVertexBufferLayout`[]

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`vertexStateBuffers`](../namespaces/CoreTextField/classes/ATextField.md#vertexstatebuffers)

***

### worldSize

#### Get Signature

> **get** **worldSize**(): `number`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:97](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L97)

월드 공간에서의 텍스트 세로 크기(Unit 단위)를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **worldSize**(`value`): `void`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:108](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L108)

월드 공간에서의 텍스트 세로 크기(Unit 단위)를 설정합니다. 가로 크기는 텍스트 길이에 따라 자동으로 조절됩니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 월드 크기

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:563](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L563)

X 위치 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:574](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L574)

X 위치 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 좌표

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`x`](../namespaces/CoreTextField/classes/ATextField.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:583](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L583)

Y 위치 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:594](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L594)

Y 위치 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 좌표

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`y`](../namespaces/CoreTextField/classes/ATextField.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:603](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L603)

Z 위치 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:614](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L614)

Z 위치 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 좌표

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`z`](../namespaces/CoreTextField/classes/ATextField.md#z)

## Methods

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList?`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:130](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L130)

Fires the dirty listeners list.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Indicates whether to reset the dirty listeners list after firing. |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`__fireListenerList`](../namespaces/CoreTextField/classes/ATextField.md#__firelistenerlist)

***

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:69](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L69)

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`addChild`](../namespaces/CoreTextField/classes/ATextField.md#addchild)

***

### addChildAt()

> **addChildAt**(`child`, `index`): `TextField3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:87](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L87)

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`TextField3D`

현재 컨테이너

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`addChildAt`](../namespaces/CoreTextField/classes/ATextField.md#addchildat)

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:897](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L897)

이벤트 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | 이벤트 이름
| `callback` | `Function` | 콜백 함수

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`addListener`](../namespaces/CoreTextField/classes/ATextField.md#addlistener)

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1007](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L1007)

**`Experimental`**

메시를 복제합니다.


#### Returns

[`Mesh`](Mesh.md)

복제된 Mesh 인스턴스


#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`clone`](../namespaces/CoreTextField/classes/ATextField.md#clone)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:59](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L59)

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`contains`](../namespaces/CoreTextField/classes/ATextField.md#contains)

***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:243](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L243)

TextField3D 전용 버텍스 셰이더 모듈을 생성합니다.


#### Returns

`GPUShaderModule`

생성된 GPU 셰이더 모듈


***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1711](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L1711)

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

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`createMeshVertexShaderModuleBASIC`](../namespaces/CoreTextField/classes/ATextField.md#createmeshvertexshadermodulebasic)

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:109](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L109)

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getChildAt`](../namespaces/CoreTextField/classes/ATextField.md#getchildat)

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:123](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L123)

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getChildIndex`](../namespaces/CoreTextField/classes/ATextField.md#getchildindex)

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:879](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L879)

부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.


#### Returns

`number`

통합 투명도 값


#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getCombinedOpacity`](../namespaces/CoreTextField/classes/ATextField.md#getcombinedopacity)

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L121)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](View3D.md) |

#### Returns

\[`number`, `number`\]

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getScreenPoint`](../namespaces/CoreTextField/classes/ATextField.md#getscreenpoint)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1697](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L1697)

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`initGPURenderInfos`](../namespaces/CoreTextField/classes/ATextField.md#initgpurenderinfos)

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:117](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L117)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`localToWorld`](../namespaces/CoreTextField/classes/ATextField.md#localtoworld)

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:915](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L915)

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

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`lookAt`](../namespaces/CoreTextField/classes/ATextField.md#lookat)

***

### removeAllChildren()

> **removeAllChildren**(): `TextField3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:232](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L232)

모든 자식 객체를 제거합니다.

#### Returns

`TextField3D`

현재 컨테이너

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`removeAllChildren`](../namespaces/CoreTextField/classes/ATextField.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:201](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L201)

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`removeChild`](../namespaces/CoreTextField/classes/ATextField.md#removechild)

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:217](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L217)

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`removeChildAt`](../namespaces/CoreTextField/classes/ATextField.md#removechildat)

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/textFileds/textField3D/TextField3D.ts:188](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/textFileds/textField3D/TextField3D.ts#L188)

프레임마다 텍스트 필드를 렌더링합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 현재 렌더링 상태 데이터

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`render`](../namespaces/CoreTextField/classes/ATextField.md#render)

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:825](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L825)

하위 계층의 모든 객체에 그림자 캐스팅 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 캐스팅 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setCastShadowRecursively`](../namespaces/CoreTextField/classes/ATextField.md#setcastshadowrecursively)

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:138](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L138)

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setChildIndex`](../namespaces/CoreTextField/classes/ATextField.md#setchildindex)

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger`): `void`

Defined in: [src/display/mesh/Mesh.ts:807](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L807)

하위 계층의 모든 객체에 디버거 활성화 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger` | `boolean` | `false` | 활성화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setEnableDebuggerRecursively`](../namespaces/CoreTextField/classes/ATextField.md#setenabledebuggerrecursively)

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:861](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L861)

하위 계층의 모든 객체에 프러스텀 컬링 무시 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 무시 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setIgnoreFrustumCullingRecursively`](../namespaces/CoreTextField/classes/ATextField.md#setignorefrustumcullingrecursively)

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:966](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L966)

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

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setPosition`](../namespaces/CoreTextField/classes/ATextField.md#setposition)

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:843](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L843)

하위 계층의 모든 객체에 그림자 수신 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 수신 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setReceiveShadowRecursively`](../namespaces/CoreTextField/classes/ATextField.md#setreceiveshadowrecursively)

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:989](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L989)

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

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setRotation`](../namespaces/CoreTextField/classes/ATextField.md#setrotation)

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:943](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/Mesh.ts#L943)

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

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setScale`](../namespaces/CoreTextField/classes/ATextField.md#setscale)

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:161](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L161)

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`swapChildren`](../namespaces/CoreTextField/classes/ATextField.md#swapchildren)

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:181](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/Object3DContainer.ts#L181)

두 인덱스의 자식 객체 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`swapChildrenAt`](../namespaces/CoreTextField/classes/ATextField.md#swapchildrenat)

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:113](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/mesh/core/MeshBase.ts#L113)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`worldToLocal`](../namespaces/CoreTextField/classes/ATextField.md#worldtolocal)
