[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreTextField](../README.md) / ATextField

# Class: ATextField

Defined in: [src/display/textFields/core/ATextField.ts:16](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L16)

텍스트 필드 객체의 추상 베이스 클래스입니다.

HTML/SVG를 이용하여 텍스트를 비트맵 텍스처로 변환하고, 이를 메시의 디퓨즈 텍스처로 사용하는 공통 로직을 포함합니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## See

 - [TextField2D Basic Example](https://redcamel.github.io/RedGPU/examples/2d/textField2D/basic/)
 - [TextField2D MouseEvent Example](https://redcamel.github.io/RedGPU/examples/2d/interaction/mouseEvent/textField2D/)
 - [TextField3D Basic Example](https://redcamel.github.io/RedGPU/examples/3d/textField/textField3D/)
 - [TextField3D Compare (World vs Pixel)](https://redcamel.github.io/RedGPU/examples/3d/textField/textField3DCompare/)
 - [TextField3D MouseEvent Example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/textField3D/)

## Extends

- [`Mesh`](../../../classes/Mesh.md)

## Extended by

- [`TextField3D`](../../../classes/TextField3D.md)

## Constructors

### Constructor

> **new ATextField**(`redGPUContext`, `imgOnload`, `mode3dYn?`): `ATextField`

Defined in: [src/display/textFields/core/ATextField.ts:175](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L175)

ATextField 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` | RedGPU 렌더링 컨텍스트
| `imgOnload` | `Function` | `undefined` | 이미지 생성 완료 후 가로/세로 해상도 동기화를 위한 콜백 함수
| `mode3dYn` | `boolean` | `true` | 3D 공간용 텍스처(선형 필터 적용)로 생성할지 여부

#### Returns

`ATextField`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`constructor`](../../../classes/Mesh.md#constructor)

## Properties

### background

> **background**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:46](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L46)

배경 스타일 (CSS background 값)

***

### border

> **border**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:81](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L81)

테두리 설정 (CSS border 값)

***

### borderRadius

> **borderRadius**: `string` \| `number`

Defined in: [src/display/textFields/core/ATextField.ts:86](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L86)

테두리 둥글기 크기 (픽셀 단위 또는 CSS 값)

***

### boxShadow

> **boxShadow**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:91](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L91)

그림자 설정 (CSS box-shadow 값)

***

### boxSizing

> **boxSizing**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:96](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L96)

박스 크기 기준 설정 (예: 'border-box', 'content-box')

***

### color

> **color**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:41](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L41)

글자 색상 (CSS 색상 값)

***

### filter

> **filter**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:101](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L101)

필터 효과 (CSS filter 값)

***

### fontFamily

> **fontFamily**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:26](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L26)

글꼴 패밀리

***

### fontSize

> **fontSize**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:21](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L21)

글자 크기 (픽셀 단위 또는 CSS 단위)

***

### fontStyle

> **fontStyle**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:36](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L36)

글자 스타일 (예: 'italic', 'normal')

***

### fontWeight

> **fontWeight**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:31](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L31)

글자 굵기 (예: 'bold', 'normal', '100'~'900')

***

### letterSpacing

> **letterSpacing**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:56](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L56)

자간 설정 (픽셀 단위)

***

### lineHeight

> **lineHeight**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:76](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L76)

줄 높이 배수 또는 크기

***

### padding

> **padding**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:51](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L51)

패딩 크기 (픽셀 단위)

***

### textAlign

> **textAlign**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:71](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L71)

텍스트 정렬 방식 (예: 'center', 'left', 'right')

***

### verticalAlign

> **verticalAlign**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:66](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L66)

수직 정렬 방식 (예: 'middle', 'top', 'bottom')

***

### wordBreak

> **wordBreak**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:61](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L61)

줄바꿈 방식 (예: 'break-all', 'keep-all')

## Accessors

### text

#### Get Signature

> **get** **text**(): `string`

Defined in: [src/display/textFields/core/ATextField.ts:209](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L209)

표시할 텍스트를 반환합니다.

##### Returns

`string`

#### Set Signature

> **set** **text**(`text`): `void`

Defined in: [src/display/textFields/core/ATextField.ts:220](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L220)

표시할 텍스트를 설정합니다. 줄바꿈(`\n` 또는 `<br/>`)을 인식하여 처리합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | 표시할 텍스트 문자열

##### Returns

`void`

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:361](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L361)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`_geometry`](../../../classes/Mesh.md#_geometry)

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:335](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L335)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`_material`](../../../classes/Mesh.md#_material)

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L32)

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

Defined in: [src/display/mesh/Mesh.ts:86](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L86)

그림자 캐스팅 여부

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`castShadow`](../../../classes/Mesh.md#castshadow)

***

### createCustomMeshVertexShaderModule?

> `optional` **createCustomMeshVertexShaderModule?**: () => `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:101](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L101)

커스텀 버텍스 셰이더 모듈 생성 함수

#### Returns

`GPUShaderModule`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`createCustomMeshVertexShaderModule`](../../../classes/Mesh.md#createcustommeshvertexshadermodule)

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:91](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L91)

LOD 정보 변경 필요 여부

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`dirtyLOD`](../../../classes/Mesh.md#dirtylod)

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:48](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L48)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`dirtyOpacity`](../../../classes/Mesh.md#dirtyopacity)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:46](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L46)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`dirtyPipeline`](../../../classes/Mesh.md#dirtypipeline)

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:47](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L47)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`dirtyTransform`](../../../classes/Mesh.md#dirtytransform)

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:42](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L42)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`disableJitter`](../../../classes/Mesh.md#disablejitter)

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:45](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L45)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`gltfLoaderInfo`](../../../classes/Mesh.md#gltfloaderinfo)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../../CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:31](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L31)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`gpuRenderInfo`](../../../classes/Mesh.md#gpurenderinfo)

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:44](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L44)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`isInstanceofMesh`](../../../classes/Mesh.md#isinstanceofmesh)

***

### localMatrix

> **localMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:50](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L50)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`localMatrix`](../../../classes/Mesh.md#localmatrix)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:49](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L49)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`modelMatrix`](../../../classes/Mesh.md#modelmatrix)

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:51](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L51)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`normalModelMatrix`](../../../classes/Mesh.md#normalmodelmatrix)

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:96](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L96)

프러스텀 컬링 통과 여부

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`passFrustumCulling`](../../../classes/Mesh.md#passfrustumculling)

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:41](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L41)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`receiveShadow`](../../../classes/Mesh.md#receiveshadow)

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:43](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L43)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`useDisplacementTexture`](../../../classes/Mesh.md#usedisplacementtexture)

***

### boundingAABB

#### Get Signature

> **get** **boundingAABB**(): [`AABB`](../../../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:750](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L750)

AABB(Axis-Aligned Bounding Box) 정보를 반환합니다.

##### Returns

[`AABB`](../../../../Bound/classes/AABB.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`boundingAABB`](../../../classes/Mesh.md#boundingaabb)

***

### boundingOBB

#### Get Signature

> **get** **boundingOBB**(): [`OBB`](../../../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:737](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L737)

OBB(Oriented Bounding Box) 정보를 반환합니다.

##### Returns

[`OBB`](../../../../Bound/classes/OBB.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`boundingOBB`](../../../classes/Mesh.md#boundingobb)

***

### children

#### Get Signature

> **get** **children**(): [`Mesh`](../../../classes/Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:44](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L44)

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

Defined in: [src/display/mesh/Mesh.ts:763](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L763)

자식 객체들을 포함한 통합 AABB 정보를 반환합니다.

##### Returns

[`AABB`](../../../../Bound/classes/AABB.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`combinedBoundingAABB`](../../../classes/Mesh.md#combinedboundingaabb)

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:67](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L67)

##### Returns

`string`

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:71](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L71)

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

Defined in: [src/display/mesh/core/MeshBase.ts:80](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L80)

##### Returns

[`DepthStencilState`](../../../../RenderState/classes/DepthStencilState.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`depthStencilState`](../../../classes/Mesh.md#depthstencilstate)

***

### drawDebugger

#### Get Signature

> **get** **drawDebugger**(): [`DrawDebuggerMesh`](../../drawDebugger/classes/DrawDebuggerMesh.md)

Defined in: [src/display/mesh/Mesh.ts:331](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L331)

디버그 메시 객체를 반환합니다.

##### Returns

[`DrawDebuggerMesh`](../../drawDebugger/classes/DrawDebuggerMesh.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`drawDebugger`](../../../classes/Mesh.md#drawdebugger)

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:311](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L311)

디버거 활성화 여부를 반환합니다.

##### Returns

`boolean`

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:322](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L322)

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

Defined in: [src/display/mesh/Mesh.ts:435](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L435)

등록된 이벤트들을 반환합니다.

##### Returns

`any`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`events`](../../../classes/Mesh.md#events)

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:366](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L366)

지오메트리를 반환합니다.

##### Returns

[`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:377](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L377)

지오메트리를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md) | 설정할 지오메트리

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`geometry`](../../../classes/Mesh.md#geometry)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:88](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L88)

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

Defined in: [src/display/mesh/Mesh.ts:408](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L408)

프러스텀 컬링 무시 여부를 반환합니다.

##### Returns

`boolean`

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:419](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L419)

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

Defined in: [src/display/mesh/Mesh.ts:303](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L303)

LOD(Level of Detail) 매니저를 반환합니다.

##### Returns

[`LODManager`](../../CoreMesh/classes/LODManager.md)

LODManager 인스턴스

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`LODManager`](../../../classes/Mesh.md#lodmanager)

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/mesh/Mesh.ts:340](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L340)

머티리얼을 반환합니다.

##### Returns

`any`

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:351](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L351)

머티리얼을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | 설정할 머티리얼

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`material`](../../../classes/Mesh.md#material)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`name`](../../../classes/Mesh.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:52](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L52)

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

Defined in: [src/display/mesh/Mesh.ts:387](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L387)

메시의 투명도를 반환합니다. (0~1)

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:398](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L398)

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

Defined in: [src/display/mesh/Mesh.ts:451](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L451)

설정된 부모 객체를 반환합니다.

##### Returns

[`Object3DContainer`](../../CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:462](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L462)

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

Defined in: [src/display/mesh/Mesh.ts:427](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L427)

피킹 ID를 반환합니다.

##### Returns

`number`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`pickingId`](../../../classes/Mesh.md#pickingid)

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:470](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L470)

피벗 X 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:481](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L481)

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

Defined in: [src/display/mesh/Mesh.ts:490](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L490)

피벗 Y 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:501](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L501)

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

Defined in: [src/display/mesh/Mesh.ts:510](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L510)

피벗 Z 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:521](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L521)

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

Defined in: [src/display/mesh/Mesh.ts:593](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L593)

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

Defined in: [src/display/mesh/core/MeshBase.ts:76](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L76)

##### Returns

[`PrimitiveState`](../../../../RenderState/classes/PrimitiveState.md)

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`primitiveState`](../../../classes/Mesh.md#primitivestate)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:97](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L97)

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

Defined in: [src/display/mesh/Mesh.ts:729](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L729)

현재 회전값을 반환합니다. [x, y, z] (도)

##### Returns

`Float32Array`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`rotation`](../../../classes/Mesh.md#rotation)

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:669](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L669)

X축 회전값을 반환합니다. (도)

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:680](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L680)

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

Defined in: [src/display/mesh/Mesh.ts:689](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L689)

Y축 회전값을 반환합니다. (도)

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:700](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L700)

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

Defined in: [src/display/mesh/Mesh.ts:709](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L709)

Z축 회전값을 반환합니다. (도)

##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:720](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L720)

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

Defined in: [src/display/mesh/Mesh.ts:661](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L661)

현재 스케일을 반환합니다. [x, y, z]

##### Returns

`Float32Array`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`scale`](../../../classes/Mesh.md#scale)

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:601](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L601)

X축 스케일을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:612](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L612)

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

Defined in: [src/display/mesh/Mesh.ts:621](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L621)

Y축 스케일을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:632](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L632)

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

Defined in: [src/display/mesh/Mesh.ts:641](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L641)

Z축 스케일을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:652](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L652)

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

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`uuid`](../../../classes/Mesh.md#uuid)

***

### vertexStateBuffers

#### Get Signature

> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:443](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L443)

버텍스 상태 버퍼 레이아웃을 반환합니다.

##### Returns

`GPUVertexBufferLayout`[]

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`vertexStateBuffers`](../../../classes/Mesh.md#vertexstatebuffers)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:530](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L530)

X 위치 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:541](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L541)

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

Defined in: [src/display/mesh/Mesh.ts:550](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L550)

Y 위치 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:561](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L561)

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

Defined in: [src/display/mesh/Mesh.ts:570](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L570)

Z 위치 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:581](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L581)

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

### addChild()

> **addChild**(`child`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:71](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L71)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L89)

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

Defined in: [src/display/mesh/Mesh.ts:864](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L864)

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

Defined in: [src/display/mesh/Mesh.ts:974](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L974)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:61](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L61)

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

Defined in: [src/display/mesh/Mesh.ts:1681](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L1681)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:111](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L111)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:125](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L125)

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

Defined in: [src/display/mesh/Mesh.ts:846](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L846)

부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.

#### Returns

`number`

통합 투명도 값

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`getCombinedOpacity`](../../../classes/Mesh.md#getcombinedopacity)

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:109](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L109)

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

Defined in: [src/display/mesh/Mesh.ts:1667](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L1667)

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`initGPURenderInfos`](../../../classes/Mesh.md#initgpurenderinfos)

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:105](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L105)

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

Defined in: [src/display/mesh/Mesh.ts:882](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L882)

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

### removeAllChildren()

> **removeAllChildren**(): `ATextField`

Defined in: [src/display/mesh/core/Object3DContainer.ts:234](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L234)

모든 자식 객체를 제거합니다.

#### Returns

`ATextField`

현재 컨테이너

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`removeAllChildren`](../../../classes/Mesh.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:203](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L203)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:219](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L219)

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

Defined in: [src/display/textFields/core/ATextField.ts:238](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/textFields/core/ATextField.ts#L238)

매 프레임마다 텍스트 필드를 렌더링하고, 필요 시 비트맵 텍스처를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) | 현재 렌더링 상태 데이터

#### Returns

`void`

#### Inherited from

[`Mesh`](../../../classes/Mesh.md).[`render`](../../../classes/Mesh.md#render)

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:792](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L792)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:140](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L140)

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

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:774](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L774)

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

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:828](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L828)

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

Defined in: [src/display/mesh/Mesh.ts:933](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L933)

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

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:810](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L810)

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

Defined in: [src/display/mesh/Mesh.ts:956](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L956)

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

Defined in: [src/display/mesh/Mesh.ts:910](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/Mesh.ts#L910)

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

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L163)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:183](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/Object3DContainer.ts#L183)

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

Defined in: [src/display/mesh/core/MeshBase.ts:101](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/mesh/core/MeshBase.ts#L101)

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


</details>
