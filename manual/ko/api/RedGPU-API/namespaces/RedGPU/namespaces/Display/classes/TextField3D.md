[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / TextField3D

# Class: TextField3D

Defined in: [src/display/textFields/textField3D/TextField3D.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L35)

3D 공간에 배치되는 텍스트 필드 클래스입니다.

텍스트 텍스처 종횡비에 맞춰 가로·세로 비율(`renderRatioX`, `renderRatioY`)이 자동 산출되며, 빌보드 회전(`useBillboard`)과 크기 모드(`usePixelSize`: `worldSize` 또는 `pixelSize`)가 서로 독립적으로 동작합니다.

***

### Example
```typescript
const textField = new RedGPU.Display.TextField3D(redGPUContext, "Hello RedGPU!");
scene.addChild(textField);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/textField/textField3D/" style="width:100%; height:500px;"></iframe>

월드 사이즈와 픽셀 사이즈 모드를 비교하는 예제입니다.

## See

- [TextField3D Basic Example](https://redcamel.github.io/RedGPU/examples/3d/textField/textField3D/)
 - [TextField3D Comparison (World vs Pixel)](https://redcamel.github.io/RedGPU/examples/3d/textField/textField3DCompare/)
 - [TextField3D MouseEvent Example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/textField3D/)

## Extends

- [`ATextField`](../namespaces/CoreTextField/classes/ATextField.md)

## Constructors



***

### Constructor

> **new TextField3D**(`redGPUContext`, `text?`): `TextField3D`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L60)

TextField3D 인스턴스를 생성합니다.

#### Example
```typescript
const textField = new RedGPU.Display.TextField3D(redGPUContext, "Hello 3D!");
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `text?` | `string` | 초기 표시할 텍스트 문자열 (선택) |

#### Returns

`TextField3D`

#### Overrides

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`constructor`](../namespaces/CoreTextField/classes/ATextField.md#constructor)

## Properties



## Accessors



***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/textFields/textField3D/TextField3D.ts:197](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L197)

내부 고정 `Plane` 지오메트리를 반환합니다. 외부에서 변경할 수 없습니다.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

지오메트리 인스턴스

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L201)

지오메트리를 가져오거나 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) |

##### Returns

`void`

Geometry 또는 Primitive 인스턴스

#### Overrides

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`geometry`](../namespaces/CoreTextField/classes/ATextField.md#geometry)

***

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L213)

내부 고정 머티리얼을 반환합니다. 외부에서 변경할 수 없습니다.

##### Returns

`any`

머티리얼 인스턴스

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L217)

머티리얼을 가져오거나 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `any` |

##### Returns

`void`

설정된 머티리얼 인스턴스

#### Overrides

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`material`](../namespaces/CoreTextField/classes/ATextField.md#material)

***

***

### pixelSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelSize**(): `number`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:161](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L161)

스타일(`fontSize`, `padding` 등)에 의해 결정된 텍스트 컨테이너의 세로 픽셀 크기(px 단위)를 반환합니다.

##### Returns

`number`

세로 픽셀 크기 (단위: px)

***

***

### renderRatioX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderRatioX**(): `number`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L173)

텍스트 텍스처 종횡비와 현재 크기 모드에 따라 산출된 가로 렌더링 스케일 비율을 반환합니다.

##### Returns

`number`

가로 렌더링 비율

***

***

### renderRatioY

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderRatioY**(): `number`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:185](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L185)

현재 크기 모드에 따라 산출된 세로 렌더링 스케일 비율을 반환합니다.

##### Returns

`number`

세로 렌더링 비율

***

***

### useBillboard

#### Get Signature

> **get** **useBillboard**(): `boolean`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L92)

카메라를 항상 정면으로 바라보는 빌보드 모드 사용 여부를 반환하거나 설정합니다. (기본값: `true`)

##### Returns

`boolean`

빌보드 모드 활성화 여부

#### Set Signature

> **set** **useBillboard**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:96](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L96)

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

Defined in: [src/display/textFields/textField3D/TextField3D.ts:130](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L130)

카메라 거리와 무관하게 텍스트 컨테이너의 픽셀 높이(`pixelSize`)로 표시할지 여부를 반환하거나 설정합니다. (기본값: `false`)

##### Returns

`boolean`

고정 픽셀 크기 모드 활성화 여부

#### Set Signature

> **set** **usePixelSize**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:134](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L134)

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

Defined in: [src/display/textFields/textField3D/TextField3D.ts:112](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L112)

월드 단위 크기 모드(`usePixelSize: false`)에서 기준 세로 크기(Unit 단위)를 반환하거나 설정합니다. (기본값: `1`)

##### Returns

`number`

월드 공간 기준 세로 크기

#### Set Signature

> **set** **worldSize**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L116)

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

Defined in: [src/display/textFields/textField3D/TextField3D.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L241)

`TextField3D` 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.

#### Returns

`GPUShaderModule`

생성된 `GPUShaderModule` 인스턴스

#### Overrides

`ATextField.createCustomMeshVertexShaderModule`

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:229](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/textField3D/TextField3D.ts#L229)

텍스트 텍스처를 갱신하고 텍스트 필드를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 현재 뷰의 렌더링 상태 데이터 |

#### Returns

`void`

#### Overrides

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`render`](../namespaces/CoreTextField/classes/ATextField.md#render)

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:301](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L301)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`_geometry`](../namespaces/CoreTextField/classes/ATextField.md#_geometry)

***

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L279)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`_material`](../namespaces/CoreTextField/classes/ATextField.md#_material)

***

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L42)

GLTF 모프, 스킨 및 클립 애니메이션 정보입니다.

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

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`animationInfo`](../namespaces/CoreTextField/classes/ATextField.md#animationinfo)

***

***

### background

> **background**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L48)

배경 스타일 (CSS `background` 값)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`background`](../namespaces/CoreTextField/classes/ATextField.md#background)

***

***

### border

> **border**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L83)

테두리 스타일 (CSS `border` 값)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`border`](../namespaces/CoreTextField/classes/ATextField.md#border)

***

***

### borderRadius

> **borderRadius**: `string` \| `number`

Defined in: [src/display/textFields/core/ATextField.ts:88](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L88)

테두리 모서리 반경 (픽셀 단위 또는 CSS 값)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`borderRadius`](../namespaces/CoreTextField/classes/ATextField.md#borderradius)

***

***

### boxShadow

> **boxShadow**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L93)

박스 그림자 스타일 (CSS `box-shadow` 값)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boxShadow`](../namespaces/CoreTextField/classes/ATextField.md#boxshadow)

***

***

### boxSizing

> **boxSizing**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:98](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L98)

박스 크기 산정 기준 (예: `'border-box'`, `'content-box'`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boxSizing`](../namespaces/CoreTextField/classes/ATextField.md#boxsizing)

***

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:99](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L99)

그림자 캐스팅 여부

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`castShadow`](../namespaces/CoreTextField/classes/ATextField.md#castshadow)

***

***

### color

> **color**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:43](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L43)

글자 색상 (CSS 색상 값)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`color`](../namespaces/CoreTextField/classes/ATextField.md#color)

***

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L104)

LOD 정보 변경 필요 여부

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyLOD`](../namespaces/CoreTextField/classes/ATextField.md#dirtylod)

***

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L74)

불투명도(Opacity) 갱신이 필요한지 여부입니다.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyOpacity`](../namespaces/CoreTextField/classes/ATextField.md#dirtyopacity)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L64)

렌더 파이프라인 갱신이 필요한지 여부입니다.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyPipeline`](../namespaces/CoreTextField/classes/ATextField.md#dirtypipeline)

***

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L69)

트랜스폼 행렬 갱신이 필요한지 여부입니다.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyTransform`](../namespaces/CoreTextField/classes/ATextField.md#dirtytransform)

***

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L50)

TAA 지터(Jitter) 비활성화 여부

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`disableJitter`](../namespaces/CoreTextField/classes/ATextField.md#disablejitter)

***

***

### filter

> **filter**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L103)

그래픽 필터 효과 (CSS `filter` 값)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`filter`](../namespaces/CoreTextField/classes/ATextField.md#filter)

***

***

### fontFamily

> **fontFamily**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L28)

글꼴 패밀리

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontFamily`](../namespaces/CoreTextField/classes/ATextField.md#fontfamily)

***

***

### fontSize

> **fontSize**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L23)

글자 크기 (픽셀 단위)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontSize`](../namespaces/CoreTextField/classes/ATextField.md#fontsize)

***

***

### fontStyle

> **fontStyle**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:38](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L38)

글자 스타일 (예: `'normal'`, `'italic'`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontStyle`](../namespaces/CoreTextField/classes/ATextField.md#fontstyle)

***

***

### fontWeight

> **fontWeight**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:33](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L33)

글자 굵기 (예: `'normal'`, `'bold'`, `'100'`~`'900'`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontWeight`](../namespaces/CoreTextField/classes/ATextField.md#fontweight)

***

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:59](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L59)

이 객체를 로드한 GLTFLoader 인스턴스 정보입니다.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`gltfLoaderInfo`](../namespaces/CoreTextField/classes/ATextField.md#gltfloaderinfo)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L37)

GPU 버텍스 렌더링 정보 객체입니다.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`gpuRenderInfo`](../namespaces/CoreTextField/classes/ATextField.md#gpurenderinfo)

***

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L60)

Mesh 인스턴스 여부 판별 식별자

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`isInstanceofMesh`](../namespaces/CoreTextField/classes/ATextField.md#isinstanceofmesh)

***

***

### letterSpacing

> **letterSpacing**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:58](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L58)

자간 크기 (픽셀 단위)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`letterSpacing`](../namespaces/CoreTextField/classes/ATextField.md#letterspacing)

***

***

### lineHeight

> **lineHeight**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L78)

줄 높이 배수

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`lineHeight`](../namespaces/CoreTextField/classes/ATextField.md#lineheight)

***

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L84)

부모 기준 로컬 변환 행렬입니다.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`localMatrix`](../namespaces/CoreTextField/classes/ATextField.md#localmatrix)

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L79)

월드 변환이 적용된 모델 행렬입니다.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`modelMatrix`](../namespaces/CoreTextField/classes/ATextField.md#modelmatrix)

***

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L89)

법선 벡터 변환에 사용되는 노멀 모델 행렬입니다.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`normalModelMatrix`](../namespaces/CoreTextField/classes/ATextField.md#normalmodelmatrix)

***

***

### padding

> **padding**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:53](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L53)

내부 여백 크기 (픽셀 단위)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`padding`](../namespaces/CoreTextField/classes/ATextField.md#padding)

***

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:109](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L109)

프러스텀 컬링 통과 여부

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`passFrustumCulling`](../namespaces/CoreTextField/classes/ATextField.md#passfrustumculling)

***

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L45)

그림자 수신 여부

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`receiveShadow`](../namespaces/CoreTextField/classes/ATextField.md#receiveshadow)

***

***

### textAlign

> **textAlign**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L73)

수평 텍스트 정렬 방식 (예: `'center'`, `'left'`, `'right'`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`textAlign`](../namespaces/CoreTextField/classes/ATextField.md#textalign)

***

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:55](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L55)

변위 텍스처(Displacement Texture) 사용 여부

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`useDisplacementTexture`](../namespaces/CoreTextField/classes/ATextField.md#usedisplacementtexture)

***

***

### verticalAlign

> **verticalAlign**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L68)

수직 정렬 방식 (예: `'middle'`, `'top'`, `'bottom'`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`verticalAlign`](../namespaces/CoreTextField/classes/ATextField.md#verticalalign)

***

***

### wordBreak

> **wordBreak**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L63)

줄바꿈 기준 (예: `'keep-all'`, `'break-all'`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`wordBreak`](../namespaces/CoreTextField/classes/ATextField.md#wordbreak)

***

### boundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:751](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L751)

AABB(Axis-Aligned Bounding Box) 정보를 반환합니다. (Zero-GC 인플레이스 재사용)

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

계산된 AABB 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boundingAABB`](../namespaces/CoreTextField/classes/ATextField.md#boundingaabb)

***

***

### boundingOBB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:736](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L736)

OBB(Oriented Bounding Box) 정보를 반환합니다.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

계산된 OBB 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boundingOBB`](../namespaces/CoreTextField/classes/ATextField.md#boundingobb)

***

***

### children

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L46)

자식 객체 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 Mesh 배열 (`Mesh[]`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`children`](../namespaces/CoreTextField/classes/ATextField.md#children)

***

***

### combinedBoundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:771](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L771)

자식 객체들을 포함한 통합 AABB 정보를 반환합니다.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

통합된 AABB 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`combinedBoundingAABB`](../namespaces/CoreTextField/classes/ATextField.md#combinedboundingaabb)

***

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L121)

현재 적용된 버텍스 셰이더 모듈의 이름을 가져오거나 설정합니다.

##### Returns

`string`

현재 버텍스 셰이더 모듈 이름

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:125](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L125)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`currentShaderModuleName`](../namespaces/CoreTextField/classes/ATextField.md#currentshadermodulename)

***

***

### depthStencilState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:149](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L149)

객체의 깊이/스텐실 렌더링 상태(`DepthStencilState`)를 반환합니다.

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

DepthStencilState 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`depthStencilState`](../namespaces/CoreTextField/classes/ATextField.md#depthstencilstate)

***

***

### drawBufferManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawBufferManager**(): `DrawBufferManager`

Defined in: [src/display/mesh/Mesh.ts:234](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L234)

드로우 버퍼 매니저를 반환합니다.

##### Returns

`DrawBufferManager`

DrawBufferManager 인스턴스 또는 `null`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`drawBufferManager`](../namespaces/CoreTextField/classes/ATextField.md#drawbuffermanager)

***

***

### drawCommandSlot

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawCommandSlot**(): `DrawCommandSlot`

Defined in: [src/display/mesh/Mesh.ts:222](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L222)

드로우 커맨드 슬롯을 반환합니다.

##### Returns

`DrawCommandSlot`

DrawCommandSlot 인스턴스 또는 `null`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`drawCommandSlot`](../namespaces/CoreTextField/classes/ATextField.md#drawcommandslot)

***

***

### drawDebugger

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

Defined in: [src/display/mesh/Mesh.ts:275](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L275)

디버그 메시 객체를 반환합니다.

##### Returns

[`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

DrawDebuggerMesh 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`drawDebugger`](../namespaces/CoreTextField/classes/ATextField.md#drawdebugger)

***

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:258](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L258)

디버거 활성화 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

디버거 활성화 여부

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:262](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L262)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`enableDebugger`](../namespaces/CoreTextField/classes/ATextField.md#enabledebugger)

***

***

### enableWaterInteraction

#### Get Signature

> **get** **enableWaterInteraction**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:447](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L447)

물(Lake)과의 실시간 파동 인터랙션 활성화 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

물 파동 인터랙션 활성화 여부

#### Set Signature

> **set** **enableWaterInteraction**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:451](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L451)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`enableWaterInteraction`](../namespaces/CoreTextField/classes/ATextField.md#enablewaterinteraction)

***

***

### events

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:407](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L407)

등록된 이벤트 맵 객체를 반환합니다.

##### Returns

`any`

등록된 이벤트 객체

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`events`](../namespaces/CoreTextField/classes/ATextField.md#events)

***

***

### globalVertexSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalVertexSlotIndex**(): `number`

Defined in: [src/display/mesh/Mesh.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L210)

글로벌 버퍼 슬롯 인덱스를 반환합니다.

##### Returns

`number`

글로벌 버텍스 슬롯 인덱스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`globalVertexSlotIndex`](../namespaces/CoreTextField/classes/ATextField.md#globalvertexslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:161](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L161)

현재 인스턴스에 연결된 WebGPU 디바이스를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`gpuDevice`](../namespaces/CoreTextField/classes/ATextField.md#gpudevice)

***

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:347](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L347)

프러스텀 컬링 무시 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

프러스텀 컬링 무시 여부

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:351](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L351)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`ignoreFrustumCulling`](../namespaces/CoreTextField/classes/ATextField.md#ignorefrustumculling)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`instanceId`](../namespaces/CoreTextField/classes/ATextField.md#instanceid)

***

***

### LODManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:246](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L246)

LOD(Level of Detail) 매니저를 반환합니다.

##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`LODManager`](../namespaces/CoreTextField/classes/ATextField.md#lodmanager)

***

***

### minScreenSpaceSize

#### Get Signature

> **get** **minScreenSpaceSize**(): `number`

Defined in: [src/display/mesh/Mesh.ts:379](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L379)

투영 면적 컬링의 화면상 크기 비율 임계값을 가져오거나 설정합니다.

##### Returns

`number`

화면상 크기 비율 임계값

#### Set Signature

> **set** **minScreenSpaceSize**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:383](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L383)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`minScreenSpaceSize`](../namespaces/CoreTextField/classes/ATextField.md#minscreenspacesize)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`name`](../namespaces/CoreTextField/classes/ATextField.md#name)

***

***

### numChildren

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:58](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L58)

등록된 자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 객체 개수

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`numChildren`](../namespaces/CoreTextField/classes/ATextField.md#numchildren)

***

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:329](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L329)

메시의 투명도를 가져오거나 설정합니다 (0~1).

##### Returns

`number`

투명도 값 (0~1)

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:333](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L333)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`opacity`](../namespaces/CoreTextField/classes/ATextField.md#opacity)

***

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:431](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L431)

설정된 부모 컨테이너 객체를 가져오거나 설정합니다.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

부모 Object3DContainer 인스턴스

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:435](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L435)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`parent`](../namespaces/CoreTextField/classes/ATextField.md#parent)

***

***

### pickingId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:395](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L395)

피킹 ID를 반환합니다.

##### Returns

`number`

피킹 식별자 값

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`pickingId`](../namespaces/CoreTextField/classes/ATextField.md#pickingid)

***

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:496](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L496)

피벗 X 좌표를 가져오거나 설정합니다.

##### Returns

`number`

피벗 X 좌표

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:500](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L500)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`pivotX`](../namespaces/CoreTextField/classes/ATextField.md#pivotx)

***

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:513](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L513)

피벗 Y 좌표를 가져오거나 설정합니다.

##### Returns

`number`

피벗 Y 좌표

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:517](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L517)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`pivotY`](../namespaces/CoreTextField/classes/ATextField.md#pivoty)

***

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:530](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L530)

피벗 Z 좌표를 가져오거나 설정합니다.

##### Returns

`number`

피벗 Z 좌표

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:534](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L534)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`pivotZ`](../namespaces/CoreTextField/classes/ATextField.md#pivotz)

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:598](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L598)

현재 위치를 반환합니다. [x, y, z]

##### Returns

`Float32Array`

위치 배열

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`position`](../namespaces/CoreTextField/classes/ATextField.md#position)

***

***

### primitiveState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:137](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L137)

객체의 프리미티브 렌더링 상태(`PrimitiveState`)를 반환합니다.

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

PrimitiveState 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`primitiveState`](../namespaces/CoreTextField/classes/ATextField.md#primitivestate)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L173)

현재 인스턴스에 연결된 RedGPUContext를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`redGPUContext`](../namespaces/CoreTextField/classes/ATextField.md#redgpucontext)

***

***

### rotation

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:724](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L724)

현재 회전값을 반환합니다. [x, y, z] (도)

##### Returns

`Float32Array`

회전값 배열 (도)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`rotation`](../namespaces/CoreTextField/classes/ATextField.md#rotation)

***

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:673](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L673)

X축 회전값을 가져오거나 설정합니다 (도).

##### Returns

`number`

X축 회전값 (도)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:677](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L677)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`rotationX`](../namespaces/CoreTextField/classes/ATextField.md#rotationx)

***

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:690](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L690)

Y축 회전값을 가져오거나 설정합니다 (도).

##### Returns

`number`

Y축 회전값 (도)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:694](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L694)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`rotationY`](../namespaces/CoreTextField/classes/ATextField.md#rotationy)

***

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:707](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L707)

Z축 회전값을 가져오거나 설정합니다 (도).

##### Returns

`number`

Z축 회전값 (도)

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:711](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L711)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`rotationZ`](../namespaces/CoreTextField/classes/ATextField.md#rotationz)

***

***

### scale

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:661](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L661)

현재 스케일을 반환합니다. [x, y, z]

##### Returns

`Float32Array`

스케일 배열

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`scale`](../namespaces/CoreTextField/classes/ATextField.md#scale)

***

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:610](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L610)

X축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

X축 스케일 값

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:614](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L614)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`scaleX`](../namespaces/CoreTextField/classes/ATextField.md#scalex)

***

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:627](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L627)

Y축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

Y축 스케일 값

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:631](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L631)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`scaleY`](../namespaces/CoreTextField/classes/ATextField.md#scaley)

***

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:644](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L644)

Z축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

Z축 스케일 값

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:648](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L648)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`scaleZ`](../namespaces/CoreTextField/classes/ATextField.md#scalez)

***

***

### text

#### Get Signature

> **get** **text**(): `string`

Defined in: [src/display/textFields/core/ATextField.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L210)

표시할 텍스트 문자열을 반환하거나 설정합니다. `<br/>` 태그를 줄바꿈으로 처리합니다.

##### Returns

`string`

현재 설정된 텍스트 문자열

#### Set Signature

> **set** **text**(`text`): `void`

Defined in: [src/display/textFields/core/ATextField.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L214)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

##### Returns

`void`

#### Inherited from

[`TextField2D`](TextField2D.md).[`text`](TextField2D.md#text)

***

***

### useScreenSpaceSizeCulling

#### Get Signature

> **get** **useScreenSpaceSizeCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:363](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L363)

투영 면적 컬링(Screen Space Size Culling) 사용 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

투영 면적 컬링 사용 여부

#### Set Signature

> **set** **useScreenSpaceSizeCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:367](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L367)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`useScreenSpaceSizeCulling`](../namespaces/CoreTextField/classes/ATextField.md#usescreenspacesizeculling)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`uuid`](../namespaces/CoreTextField/classes/ATextField.md#uuid)

***

***

### vertexStateBuffers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:419](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L419)

버텍스 상태 버퍼 레이아웃 배열을 반환합니다.

##### Returns

`GPUVertexBufferLayout`[]

GPUVertexBufferLayout 배열

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`vertexStateBuffers`](../namespaces/CoreTextField/classes/ATextField.md#vertexstatebuffers)

***

***

### waterWaveStrength

#### Get Signature

> **get** **waterWaveStrength**(): `number`

Defined in: [src/display/mesh/Mesh.ts:472](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L472)

물 파동 생성 강도 배율을 가져오거나 설정합니다 (기본값: 1.0).

##### Returns

`number`

물 파동 생성 강도 배율

#### Set Signature

> **set** **waterWaveStrength**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:476](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L476)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`waterWaveStrength`](../namespaces/CoreTextField/classes/ATextField.md#waterwavestrength)

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:547](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L547)

X 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

X 위치 좌표

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:551](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L551)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`x`](../namespaces/CoreTextField/classes/ATextField.md#x)

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:564](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L564)

Y 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Y 위치 좌표

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:568](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L568)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`y`](../namespaces/CoreTextField/classes/ATextField.md#y)

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:581](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L581)

Z 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Z 위치 좌표

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:585](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L585)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`z`](../namespaces/CoreTextField/classes/ATextField.md#z)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L89)

자식 객체를 컨테이너 끝에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 자식 객체 (실패 시 `null`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`addChild`](../namespaces/CoreTextField/classes/ATextField.md#addchild)

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `TextField3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L115)

지정한 인덱스 위치에 자식 객체를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입할 인덱스 위치 |

#### Returns

`TextField3D`

현재 컨테이너 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`addChildAt`](../namespaces/CoreTextField/classes/ATextField.md#addchildat)

***

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:888](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L888)

이벤트 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | 이벤트 이름 |
| `callback` | `Function` | 콜백 함수 |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`addListener`](../namespaces/CoreTextField/classes/ATextField.md#addlistener)

***

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1002](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L1002)

**`Experimental`**

메시를 복제합니다.

#### Returns

[`Mesh`](Mesh.md)

복제된 Mesh 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`clone`](../namespaces/CoreTextField/classes/ATextField.md#clone)

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L73)

지정한 객체가 현재 컨테이너의 자식인지 확인합니다.

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

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1721](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L1721)

기본 메시 버텍스 셰이더 모듈과 유니폼 바인드 그룹을 생성하고 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `VERTEX_SHADER_MODULE_NAME` | `any` | 버텍스 셰이더 모듈 이름 |
| `SHADER_INFO` | `any` | 파싱된 WGSL 셰이더 정보 |
| `UNIFORM_STRUCT_BASIC` | `any` | 버텍스 유니폼 구조체 정보 |
| `vertexModuleSource` | `any` | 버텍스 셰이더 WGSL 소스 코드 |

#### Returns

`GPUShaderModule`

생성된 GPUShaderModule 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`createMeshVertexShaderModuleBASIC`](../namespaces/CoreTextField/classes/ATextField.md#createmeshvertexshadermodulebasic)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/textFields/core/ATextField.ts:244](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/textFields/core/ATextField.ts#L244)

텍스트 필드 인스턴스를 파기하고 내부 DOM 엘리먼트, 텍스처 및 Object URL 리소스를 해제합니다.

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`destroy`](../namespaces/CoreTextField/classes/ATextField.md#destroy)

***

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L143)

지정한 인덱스에 위치한 자식 객체를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 인덱스 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 (범위 초과 시 `undefined`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getChildAt`](../namespaces/CoreTextField/classes/ATextField.md#getchildat)

***

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L163)

지정한 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 인덱스를 조회할 자식 객체 |

#### Returns

`number`

자식 객체의 인덱스 (존재하지 않으면 `-1`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getChildIndex`](../namespaces/CoreTextField/classes/ATextField.md#getchildindex)

***

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:869](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L869)

부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.

#### Returns

`number`

통합 투명도 값

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getCombinedOpacity`](../namespaces/CoreTextField/classes/ATextField.md#getcombinedopacity)

***

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:245](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L245)

지정된 뷰를 기준으로 이 객체의 2D 화면 좌표를 반환합니다.

#### Example
```typescript
const screenPos = mesh.getScreenPoint(view3D);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](View3D.md) | 기준이 되는 View3D 인스턴스 |

#### Returns

\[`number`, `number`\]

화면 좌표 `[x, y]`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getScreenPoint`](../namespaces/CoreTextField/classes/ATextField.md#getscreenpoint)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1687](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L1687)

메시의 GPU 렌더링 정보(VertexGPURenderInfo)를 초기화하고 파이프라인을 갱신합니다.

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`initGPURenderInfos`](../namespaces/CoreTextField/classes/ATextField.md#initgpurenderinfos)

***

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:225](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L225)

이 객체의 로컬 공간 좌표를 월드 공간 좌표로 변환합니다.

#### Example
```typescript
const worldPos = mesh.localToWorld(0, 1, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | 로컬 X 좌표 |
| `y` | `number` | 로컬 Y 좌표 |
| `z` | `number` | 로컬 Z 좌표 |

#### Returns

\[`number`, `number`, `number`\]

변환된 월드 좌표 `[x, y, z]`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`localToWorld`](../namespaces/CoreTextField/classes/ATextField.md#localtoworld)

***

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:907](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L907)

메시가 특정 좌표를 바라보도록 회전시킵니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | 대상 X 좌표 또는 [x, y, z] 배열 |
| `targetY?` | `number` | 대상 Y 좌표 (targetX가 배열인 경우 무시됨) |
| `targetZ?` | `number` | 대상 Z 좌표 (targetX가 배열인 경우 무시됨) |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`lookAt`](../namespaces/CoreTextField/classes/ATextField.md#lookat)

***

***

### removeAllChildren()

> **removeAllChildren**(): `TextField3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L309)

컨테이너의 모든 자식 객체를 제거합니다.

#### Returns

`TextField3D`

현재 컨테이너 인스턴스

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`removeAllChildren`](../namespaces/CoreTextField/classes/ATextField.md#removeallchildren)

***

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L265)

지정한 자식 객체를 컨테이너에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 자식 객체

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`removeChild`](../namespaces/CoreTextField/classes/ATextField.md#removechild)

***

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:290](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L290)

지정한 인덱스의 자식 객체를 컨테이너에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 자식 객체의 인덱스 |

#### Returns

[`Mesh`](Mesh.md)

제거된 자식 객체

#### Throws

해당 인덱스에 자식 객체가 존재하지 않을 경우 Error 발생

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`removeChildAt`](../namespaces/CoreTextField/classes/ATextField.md#removechildat)

***

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:802](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L802)

하위 계층의 모든 객체에 그림자 캐스팅 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | 캐스팅 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setCastShadowRecursively`](../namespaces/CoreTextField/classes/ATextField.md#setcastshadowrecursively)

***

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L184)

자식 객체의 인덱스 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 위치를 변경할 자식 객체 |
| `index` | `number` | 새로 지정할 인덱스 |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setChildIndex`](../namespaces/CoreTextField/classes/ATextField.md#setchildindex)

***

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:783](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L783)

하위 계층의 모든 객체에 디버거 활성화 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger?` | `boolean` | `false` | 활성화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setEnableDebuggerRecursively`](../namespaces/CoreTextField/classes/ATextField.md#setenabledebuggerrecursively)

***

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:840](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L840)

하위 계층의 모든 객체에 프러스텀 컬링 무시 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | 무시 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setIgnoreFrustumCullingRecursively`](../namespaces/CoreTextField/classes/ATextField.md#setignorefrustumcullingrecursively)

***

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:959](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L959)

위치를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X 좌표 |
| `y?` | `number` | Y 좌표 (생략 시 x와 동일) |
| `z?` | `number` | Z 좌표 (생략 시 x와 동일) |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setPosition`](../namespaces/CoreTextField/classes/ATextField.md#setposition)

***

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:821](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L821)

하위 계층의 모든 객체에 그림자 수신 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | 수신 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setReceiveShadowRecursively`](../namespaces/CoreTextField/classes/ATextField.md#setreceiveshadowrecursively)

***

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:983](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L983)

회전값을 설정합니다. (도)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X축 회전 |
| `rotationY?` | `number` | Y축 회전 (생략 시 rotationX와 동일) |
| `rotationZ?` | `number` | Z축 회전 (생략 시 rotationX와 동일) |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setRotation`](../namespaces/CoreTextField/classes/ATextField.md#setrotation)

***

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:935](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L935)

스케일을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 스케일 |
| `y?` | `number` | Y축 스케일 (생략 시 x와 동일) |
| `z?` | `number` | Z축 스케일 (생략 시 x와 동일) |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setScale`](../namespaces/CoreTextField/classes/ATextField.md#setscale)

***

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L213)

두 자식 객체의 배열 내 순서(인덱스)를 서로 맞바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 자식 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 자식 객체 |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`swapChildren`](../namespaces/CoreTextField/classes/ATextField.md#swapchildren)

***

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L239)

지정된 두 인덱스에 있는 자식 객체들의 위치를 서로 맞바꿉니다.

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

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:199](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L199)

월드 공간 좌표를 이 객체의 로컬 공간 좌표로 변환합니다.

#### Example
```typescript
const localPos = mesh.worldToLocal(10, 5, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | 월드 X 좌표 |
| `y` | `number` | 월드 Y 좌표 |
| `z` | `number` | 월드 Z 좌표 |

#### Returns

\[`number`, `number`, `number`\]

변환된 로컬 좌표 `[x, y, z]`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`worldToLocal`](../namespaces/CoreTextField/classes/ATextField.md#worldtolocal)

</details>
