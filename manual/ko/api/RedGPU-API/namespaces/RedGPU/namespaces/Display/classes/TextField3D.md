[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / TextField3D

# Class: TextField3D

Defined in: [src/display/textFields/textField3D/TextField3D.ts:17](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L17)

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

아래는 TextField3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.

## See

 - [TextField3D Basic Example](https://redcamel.github.io/RedGPU/examples/3d/textField/textField3D/)
 - [TextField3D Comparison (World vs Pixel)](https://redcamel.github.io/RedGPU/examples/3d/textField/textField3DCompare/)
 - [TextField3D MouseEvent Example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/textField3D/)

## Extends

- [`ATextField`](../namespaces/CoreTextField/classes/ATextField.md)

## Constructors

### Constructor

> **new TextField3D**(`redGPUContext`, `text?`): `TextField3D`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:98](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L98)

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

### \_renderRatioX

> **\_renderRatioX**: `number`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:32](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L32)

X축 렌더링 비율

***

### \_renderRatioY

> **\_renderRatioY**: `number`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:37](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L37)

Y축 렌더링 비율

***

### useBillboard

> **useBillboard**: `boolean`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:22](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L22)

빌보드 모드 사용 여부 (true일 경우 항상 카메라를 향함)

***

### pixelSize

#### Get Signature

> **get** **pixelSize**(): `number`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:185](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L185)

실제 렌더링된 물리 픽셀 크기(높이)를 반환합니다. (px 단위)

##### Returns

`number`

***

### usePixelSize

#### Get Signature

> **get** **usePixelSize**(): `boolean`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:149](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L149)

고정 픽셀 크기(Pixel Size) 모드 사용 여부를 반환합니다.

##### Returns

`boolean`

#### Set Signature

> **set** **usePixelSize**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:160](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L160)

고정 픽셀 크기(Pixel Size) 모드 사용 여부를 설정합니다. true일 경우 거리에 상관없이 렌더링된 물리 픽셀 크기(pixelSize)로 표시됩니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 사용 여부

##### Returns

`void`

***

### worldSize

#### Get Signature

> **get** **worldSize**(): `number`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:128](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L128)

월드 공간에서의 텍스트 세로 크기(Unit 단위)를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **worldSize**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:139](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L139)

월드 공간에서의 텍스트 세로 크기(Unit 단위)를 설정합니다. 가로 크기는 텍스트 길이에 따라 자동으로 조절됩니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 월드 크기

##### Returns

`void`

***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:251](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L251)

TextField3D 전용 버텍스 셰이더 모듈을 생성합니다.

#### Returns

`GPUShaderModule`

생성된 GPU 셰이더 모듈

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:361](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L361)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`_geometry`](../namespaces/CoreTextField/classes/ATextField.md#_geometry)

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:335](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L335)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`_material`](../namespaces/CoreTextField/classes/ATextField.md#_material)

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L32)

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

Defined in: [src/display/textFields/core/ATextField.ts:46](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L46)

배경 스타일 (CSS background 값)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`background`](../namespaces/CoreTextField/classes/ATextField.md#background)

***

### border

> **border**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:81](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L81)

테두리 설정 (CSS border 값)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`border`](../namespaces/CoreTextField/classes/ATextField.md#border)

***

### borderRadius

> **borderRadius**: `string` \| `number`

Defined in: [src/display/textFields/core/ATextField.ts:86](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L86)

테두리 둥글기 크기 (픽셀 단위 또는 CSS 값)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`borderRadius`](../namespaces/CoreTextField/classes/ATextField.md#borderradius)

***

### boxShadow

> **boxShadow**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:91](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L91)

그림자 설정 (CSS box-shadow 값)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boxShadow`](../namespaces/CoreTextField/classes/ATextField.md#boxshadow)

***

### boxSizing

> **boxSizing**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:96](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L96)

박스 크기 기준 설정 (예: 'border-box', 'content-box')

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boxSizing`](../namespaces/CoreTextField/classes/ATextField.md#boxsizing)

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:86](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L86)

그림자 캐스팅 여부

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`castShadow`](../namespaces/CoreTextField/classes/ATextField.md#castshadow)

***

### color

> **color**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:41](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L41)

글자 색상 (CSS 색상 값)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`color`](../namespaces/CoreTextField/classes/ATextField.md#color)

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:91](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L91)

LOD 정보 변경 필요 여부

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyLOD`](../namespaces/CoreTextField/classes/ATextField.md#dirtylod)

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:48](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L48)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyOpacity`](../namespaces/CoreTextField/classes/ATextField.md#dirtyopacity)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:46](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L46)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyPipeline`](../namespaces/CoreTextField/classes/ATextField.md#dirtypipeline)

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:47](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L47)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyTransform`](../namespaces/CoreTextField/classes/ATextField.md#dirtytransform)

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:42](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L42)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`disableJitter`](../namespaces/CoreTextField/classes/ATextField.md#disablejitter)

***

### filter

> **filter**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:101](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L101)

필터 효과 (CSS filter 값)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`filter`](../namespaces/CoreTextField/classes/ATextField.md#filter)

***

### fontFamily

> **fontFamily**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:26](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L26)

글꼴 패밀리

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontFamily`](../namespaces/CoreTextField/classes/ATextField.md#fontfamily)

***

### fontSize

> **fontSize**: `number`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:27](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L27)

글자 크기 (픽셀 단위 또는 CSS 단위)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontSize`](../namespaces/CoreTextField/classes/ATextField.md#fontsize)

***

### fontStyle

> **fontStyle**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:36](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L36)

글자 스타일 (예: 'italic', 'normal')

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontStyle`](../namespaces/CoreTextField/classes/ATextField.md#fontstyle)

***

### fontWeight

> **fontWeight**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:31](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L31)

글자 굵기 (예: 'bold', 'normal', '100'~'900')

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontWeight`](../namespaces/CoreTextField/classes/ATextField.md#fontweight)

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:45](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L45)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`gltfLoaderInfo`](../namespaces/CoreTextField/classes/ATextField.md#gltfloaderinfo)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:31](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L31)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`gpuRenderInfo`](../namespaces/CoreTextField/classes/ATextField.md#gpurenderinfo)

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:44](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L44)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`isInstanceofMesh`](../namespaces/CoreTextField/classes/ATextField.md#isinstanceofmesh)

***

### letterSpacing

> **letterSpacing**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:56](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L56)

자간 설정 (픽셀 단위)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`letterSpacing`](../namespaces/CoreTextField/classes/ATextField.md#letterspacing)

***

### lineHeight

> **lineHeight**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:76](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L76)

줄 높이 배수 또는 크기

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`lineHeight`](../namespaces/CoreTextField/classes/ATextField.md#lineheight)

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:50](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L50)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`localMatrix`](../namespaces/CoreTextField/classes/ATextField.md#localmatrix)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:49](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L49)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`modelMatrix`](../namespaces/CoreTextField/classes/ATextField.md#modelmatrix)

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:51](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L51)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`normalModelMatrix`](../namespaces/CoreTextField/classes/ATextField.md#normalmodelmatrix)

***

### padding

> **padding**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:51](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L51)

패딩 크기 (픽셀 단위)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`padding`](../namespaces/CoreTextField/classes/ATextField.md#padding)

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:96](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L96)

프러스텀 컬링 통과 여부

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`passFrustumCulling`](../namespaces/CoreTextField/classes/ATextField.md#passfrustumculling)

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:41](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L41)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`receiveShadow`](../namespaces/CoreTextField/classes/ATextField.md#receiveshadow)

***

### textAlign

> **textAlign**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:71](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L71)

텍스트 정렬 방식 (예: 'center', 'left', 'right')

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`textAlign`](../namespaces/CoreTextField/classes/ATextField.md#textalign)

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:43](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L43)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`useDisplacementTexture`](../namespaces/CoreTextField/classes/ATextField.md#usedisplacementtexture)

***

### verticalAlign

> **verticalAlign**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:66](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L66)

수직 정렬 방식 (예: 'middle', 'top', 'bottom')

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`verticalAlign`](../namespaces/CoreTextField/classes/ATextField.md#verticalalign)

***

### wordBreak

> **wordBreak**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:61](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L61)

줄바꿈 방식 (예: 'break-all', 'keep-all')

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`wordBreak`](../namespaces/CoreTextField/classes/ATextField.md#wordbreak)

## Accessors

### boundingAABB

#### Get Signature

> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:750](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L750)

AABB(Axis-Aligned Bounding Box) 정보를 반환합니다.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boundingAABB`](../namespaces/CoreTextField/classes/ATextField.md#boundingaabb)

***

### boundingOBB

#### Get Signature

> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:737](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L737)

OBB(Oriented Bounding Box) 정보를 반환합니다.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boundingOBB`](../namespaces/CoreTextField/classes/ATextField.md#boundingobb)

***

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:44](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L44)

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

Defined in: [src/display/mesh/Mesh.ts:763](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L763)

자식 객체들을 포함한 통합 AABB 정보를 반환합니다.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`combinedBoundingAABB`](../namespaces/CoreTextField/classes/ATextField.md#combinedboundingaabb)

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:67](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L67)

##### Returns

`string`

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:71](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L71)

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

Defined in: [src/display/mesh/core/MeshBase.ts:80](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L80)

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`depthStencilState`](../namespaces/CoreTextField/classes/ATextField.md#depthstencilstate)

***

### drawDebugger

#### Get Signature

> **get** **drawDebugger**(): [`DrawDebuggerMesh`](../namespaces/drawDebugger/classes/DrawDebuggerMesh.md)

Defined in: [src/display/mesh/Mesh.ts:331](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L331)

디버그 메시 객체를 반환합니다.

##### Returns

[`DrawDebuggerMesh`](../namespaces/drawDebugger/classes/DrawDebuggerMesh.md)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`drawDebugger`](../namespaces/CoreTextField/classes/ATextField.md#drawdebugger)

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:311](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L311)

디버거 활성화 여부를 반환합니다.

##### Returns

`boolean`

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:322](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L322)

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

Defined in: [src/display/mesh/Mesh.ts:435](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L435)

등록된 이벤트들을 반환합니다.

##### Returns

`any`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`events`](../namespaces/CoreTextField/classes/ATextField.md#events)

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/textFields/textField3D/TextField3D.ts:196](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L196)

텍스트가 출력되는 지오메트리를 반환합니다. Plane으로 고정됩니다.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

현재 지오메트리

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:207](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L207)

TextField3D는 지오메트리를 변경할 수 없습니다.

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

Defined in: [src/display/mesh/core/MeshBase.ts:88](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L88)

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

Defined in: [src/display/mesh/Mesh.ts:408](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L408)

프러스텀 컬링 무시 여부를 반환합니다.

##### Returns

`boolean`

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:419](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L419)

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

Defined in: [src/display/mesh/Mesh.ts:303](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L303)

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

Defined in: [src/display/textFields/textField3D/TextField3D.ts:218](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L218)

텍스처를 관리하는 내부 머티리얼을 반환합니다.

##### Returns

`any`

머티리얼 객체

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:229](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L229)

TextField3D는 머티리얼을 변경할 수 없습니다.

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`name`](../namespaces/CoreTextField/classes/ATextField.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:52](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L52)

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

Defined in: [src/display/mesh/Mesh.ts:387](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L387)

메시의 투명도를 반환합니다. (0~1)

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:398](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L398)

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

Defined in: [src/display/mesh/Mesh.ts:451](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L451)

설정된 부모 객체를 반환합니다.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:462](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L462)

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

Defined in: [src/display/mesh/Mesh.ts:427](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L427)

피킹 ID를 반환합니다.

##### Returns

`number`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`pickingId`](../namespaces/CoreTextField/classes/ATextField.md#pickingid)

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:470](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L470)

피벗 X 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:481](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L481)

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

Defined in: [src/display/mesh/Mesh.ts:490](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L490)

피벗 Y 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:501](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L501)

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

Defined in: [src/display/mesh/Mesh.ts:510](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L510)

피벗 Z 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:521](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L521)

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

### position

#### Get Signature

> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:593](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L593)

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

Defined in: [src/display/mesh/core/MeshBase.ts:76](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L76)

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`primitiveState`](../namespaces/CoreTextField/classes/ATextField.md#primitivestate)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:97](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L97)

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

Defined in: [src/display/mesh/Mesh.ts:729](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L729)

현재 회전값을 반환합니다. [x, y, z] (도)

##### Returns

`Float32Array`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`rotation`](../namespaces/CoreTextField/classes/ATextField.md#rotation)

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:669](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L669)

X축 회전값을 반환합니다. (도)

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:680](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L680)

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

Defined in: [src/display/mesh/Mesh.ts:689](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L689)

Y축 회전값을 반환합니다. (도)

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:700](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L700)

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

Defined in: [src/display/mesh/Mesh.ts:709](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L709)

Z축 회전값을 반환합니다. (도)

##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:720](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L720)

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

Defined in: [src/display/mesh/Mesh.ts:661](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L661)

현재 스케일을 반환합니다. [x, y, z]

##### Returns

`Float32Array`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`scale`](../namespaces/CoreTextField/classes/ATextField.md#scale)

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:601](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L601)

X축 스케일을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:612](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L612)

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

Defined in: [src/display/mesh/Mesh.ts:621](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L621)

Y축 스케일을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:632](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L632)

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

Defined in: [src/display/mesh/Mesh.ts:641](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L641)

Z축 스케일을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:652](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L652)

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

Defined in: [src/display/textFields/core/ATextField.ts:209](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L209)

표시할 텍스트를 반환합니다.

##### Returns

`string`

#### Set Signature

> **set** **text**(`text`): `void`

Defined in: [src/display/textFields/core/ATextField.ts:220](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/core/ATextField.ts#L220)

표시할 텍스트를 설정합니다. 줄바꿈(`\n` 또는 `<br/>`)을 인식하여 처리합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | 표시할 텍스트 문자열

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`text`](../namespaces/CoreTextField/classes/ATextField.md#text)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`uuid`](../namespaces/CoreTextField/classes/ATextField.md#uuid)

***

### vertexStateBuffers

#### Get Signature

> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:443](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L443)

버텍스 상태 버퍼 레이아웃을 반환합니다.

##### Returns

`GPUVertexBufferLayout`[]

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`vertexStateBuffers`](../namespaces/CoreTextField/classes/ATextField.md#vertexstatebuffers)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:530](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L530)

X 위치 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:541](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L541)

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

Defined in: [src/display/mesh/Mesh.ts:550](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L550)

Y 위치 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:561](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L561)

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

Defined in: [src/display/mesh/Mesh.ts:570](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L570)

Z 위치 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:581](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L581)

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

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:71](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L71)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L89)

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

Defined in: [src/display/mesh/Mesh.ts:864](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L864)

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

Defined in: [src/display/mesh/Mesh.ts:974](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L974)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:61](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L61)

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

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1681](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L1681)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:111](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L111)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:125](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L125)

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

Defined in: [src/display/mesh/Mesh.ts:846](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L846)

부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.

#### Returns

`number`

통합 투명도 값

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getCombinedOpacity`](../namespaces/CoreTextField/classes/ATextField.md#getcombinedopacity)

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:109](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L109)

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

Defined in: [src/display/mesh/Mesh.ts:1667](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L1667)

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`initGPURenderInfos`](../namespaces/CoreTextField/classes/ATextField.md#initgpurenderinfos)

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:105](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L105)

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

Defined in: [src/display/mesh/Mesh.ts:882](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L882)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:234](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L234)

모든 자식 객체를 제거합니다.

#### Returns

`TextField3D`

현재 컨테이너

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`removeAllChildren`](../namespaces/CoreTextField/classes/ATextField.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:203](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L203)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:219](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L219)

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

Defined in: [src/display/textFields/textField3D/TextField3D.ts:240](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/textFields/textField3D/TextField3D.ts#L240)

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

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:792](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L792)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:140](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L140)

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

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:774](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L774)

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

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:828](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L828)

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

Defined in: [src/display/mesh/Mesh.ts:933](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L933)

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

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:810](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L810)

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

Defined in: [src/display/mesh/Mesh.ts:956](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L956)

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

Defined in: [src/display/mesh/Mesh.ts:910](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/Mesh.ts#L910)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L163)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:183](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/Object3DContainer.ts#L183)

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

Defined in: [src/display/mesh/core/MeshBase.ts:101](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/display/mesh/core/MeshBase.ts#L101)

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


</details>
