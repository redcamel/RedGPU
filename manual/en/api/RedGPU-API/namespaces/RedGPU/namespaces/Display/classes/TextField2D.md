[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / TextField2D

# Class: TextField2D

Defined in: [src/display/textFields/textField2D/TextField2D.ts:44](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/textField2D/TextField2D.ts#L44)

Class that represents text in 2D space.

Internally uses Plane geometry and displays text rendering results as a texture. Texture filtering is automatically adjusted based on text size and smoothing settings.

Geometry and material are fixed and cannot be changed externally.

### Example
```typescript
const textField = new RedGPU.Display.TextField2D(redGPUContext);
textField.text = "Hello 2D Text!";
scene.addChild(textField);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/2d/textField2D/basic/"></iframe>

Below is a list of additional sample examples to help understand the structure and operation of TextField2D.

## See

 - [TextField2D Basic Example](https://redcamel.github.io/RedGPU/examples/2d/textField2D/basic/)
 - [TextField2D MouseEvent Example](https://redcamel.github.io/RedGPU/examples/2d/interaction/mouseEvent/textField2D/)

## Extends

- `BaseTextField2D`

## Constructors

### Constructor

> **new TextField2D**(`redGPUContext`, `useSmoothing?`): `TextField2D`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:71](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/textField2D/TextField2D.ts#L71)

Creates a new TextField2D instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `useSmoothing` | `boolean` | `true` | Whether to apply smoothing to texture filtering (default: true) |

#### Returns

`TextField2D`

#### Overrides

`BaseTextField2D.constructor`

## Properties

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/textFields/textField2D/TextField2D.ts:137](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/textField2D/TextField2D.ts#L137)

Returns the geometry where the text is displayed. Fixed with Plane.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Current geometry

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:148](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/textField2D/TextField2D.ts#L148)

TextField2D cannot change geometry.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) | Geometry to set |

##### Returns

`void`

#### Overrides

`BaseTextField2D.geometry`

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:126](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/textField2D/TextField2D.ts#L126)

Returns the height of the text rendering result (in pixels).

##### Returns

`number`

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:159](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/textField2D/TextField2D.ts#L159)

Returns the material used for the text.

##### Returns

`any`

Current material

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:170](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/textField2D/TextField2D.ts#L170)

TextField2D cannot change material.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | Material to set |

##### Returns

`void`

#### Overrides

`BaseTextField2D.material`

***

### useSmoothing

#### Get Signature

> **get** **useSmoothing**(): `boolean`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:89](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/textField2D/TextField2D.ts#L89)

Returns whether to use smoothing for texture filtering.

##### Returns

`boolean`

#### Set Signature

> **set** **useSmoothing**(`value`): `void`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:100](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/textField2D/TextField2D.ts#L100)

Sets smoothing for texture filtering. If true, uses LINEAR filter; if false, uses NEAREST filter.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use |

##### Returns

`void`

***

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:118](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/textField2D/TextField2D.ts#L118)

Returns the width of the text rendering result (in pixels).

##### Returns

`number`

***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:181](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/textField2D/TextField2D.ts#L181)

Creates a vertex shader module dedicated to TextField2D.

#### Returns

`GPUShaderModule`

Created GPU shader module

#### Overrides

`BaseTextField2D.createCustomMeshVertexShaderModule`

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:387](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L387)

#### Inherited from

`BaseTextField2D._geometry`

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:360](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L360)

#### Inherited from

`BaseTextField2D._material`

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L32)

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

`BaseTextField2D.animationInfo`

***

### background

> **background**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L46)

Background style (CSS background value)

#### Inherited from

`BaseTextField2D.background`

***

### border

> **border**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:81](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L81)

Border setting (CSS border value)

#### Inherited from

`BaseTextField2D.border`

***

### borderRadius

> **borderRadius**: `string` \| `number`

Defined in: [src/display/textFields/core/ATextField.ts:86](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L86)

Border radius (in pixels or CSS value)

#### Inherited from

`BaseTextField2D.borderRadius`

***

### boxShadow

> **boxShadow**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:91](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L91)

Box shadow setting (CSS box-shadow value)

#### Inherited from

`BaseTextField2D.boxShadow`

***

### boxSizing

> **boxSizing**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:96](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L96)

Box sizing method (e.g., 'border-box', 'content-box')

#### Inherited from

`BaseTextField2D.boxSizing`

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:87](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L87)

Whether to cast shadows

#### Inherited from

`BaseTextField2D.castShadow`

***

### color

> **color**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:41](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L41)

Text color (CSS color value)

#### Inherited from

`BaseTextField2D.color`

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:92](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L92)

Whether LOD info needs update

#### Inherited from

`BaseTextField2D.dirtyLOD`

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:48](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L48)

#### Inherited from

`BaseTextField2D.dirtyOpacity`

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L46)

#### Inherited from

`BaseTextField2D.dirtyPipeline`

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:47](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L47)

#### Inherited from

`BaseTextField2D.dirtyTransform`

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:43](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L43)

#### Inherited from

`BaseTextField2D.disableJitter`

***

### filter

> **filter**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:101](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L101)

Filter effect (CSS filter value)

#### Inherited from

`BaseTextField2D.filter`

***

### fontFamily

> **fontFamily**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:26](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L26)

Font family

#### Inherited from

`BaseTextField2D.fontFamily`

***

### fontSize

> **fontSize**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:21](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L21)

Font size (in pixels or CSS units)

#### Inherited from

`BaseTextField2D.fontSize`

***

### fontStyle

> **fontStyle**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:36](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L36)

Font style (e.g., 'italic', 'normal')

#### Inherited from

`BaseTextField2D.fontStyle`

***

### fontWeight

> **fontWeight**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:31](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L31)

Font weight (e.g., 'bold', 'normal', '100'~'900')

#### Inherited from

`BaseTextField2D.fontWeight`

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:45](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L45)

#### Inherited from

`BaseTextField2D.gltfLoaderInfo`

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:31](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L31)

#### Inherited from

`BaseTextField2D.gpuRenderInfo`

***

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

`BaseTextField2D.instanceId`

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L45)

#### Inherited from

`BaseTextField2D.isInstanceofMesh`

***

### letterSpacing

> **letterSpacing**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:56](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L56)

Letter spacing (in pixels)

#### Inherited from

`BaseTextField2D.letterSpacing`

***

### lineHeight

> **lineHeight**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L76)

Line height multiplier or size

#### Inherited from

`BaseTextField2D.lineHeight`

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:50](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L50)

#### Inherited from

`BaseTextField2D.localMatrix`

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:49](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L49)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

`BaseTextField2D.modelMatrix`

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:51](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L51)

#### Inherited from

`BaseTextField2D.normalModelMatrix`

***

### padding

> **padding**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:51](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L51)

Padding size (in pixels)

#### Inherited from

`BaseTextField2D.padding`

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:97](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L97)

Whether it passed frustum culling

#### Inherited from

`BaseTextField2D.passFrustumCulling`

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:42](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L42)

#### Inherited from

`BaseTextField2D.receiveShadow`

***

### rotation

> **rotation**: `number` & `Float32Array`\<`ArrayBufferLike`\>

Defined in: [src/display/mesh/core/mixInMesh2D.ts:51](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/mixInMesh2D.ts#L51)

#### Inherited from

`BaseTextField2D.rotation`

***

### rotationZ

> **rotationZ**: `number`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:6](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/mixInMesh2D.ts#L6)

#### Inherited from

`BaseTextField2D.rotationZ`

***

### textAlign

> **textAlign**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:71](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L71)

Text alignment (e.g., 'center', 'left', 'right')

#### Inherited from

`BaseTextField2D.textAlign`

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:44](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L44)

#### Inherited from

`BaseTextField2D.useDisplacementTexture`

***

### verticalAlign

> **verticalAlign**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:66](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L66)

Vertical alignment (e.g., 'middle', 'top', 'bottom')

#### Inherited from

`BaseTextField2D.verticalAlign`

***

### wordBreak

> **wordBreak**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:61](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L61)

Word break style (e.g., 'break-all', 'keep-all')

#### Inherited from

`BaseTextField2D.wordBreak`

## Accessors

### blendMode

#### Get Signature

> **get** **blendMode**(): `string`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:22](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/mixInMesh2D.ts#L22)

##### Returns

`string`

#### Set Signature

> **set** **blendMode**(`value`): `void`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:30](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/mixInMesh2D.ts#L30)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| [`BLEND_MODE`](../../Material/type-aliases/BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.blendMode`

***

### boundingAABB

#### Get Signature

> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:811](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L811)

Returns the AABB (Axis-Aligned Bounding Box) information.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

`BaseTextField2D.boundingAABB`

***

### boundingOBB

#### Get Signature

> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:798](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L798)

Returns the OBB (Oriented Bounding Box) information.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

#### Inherited from

`BaseTextField2D.boundingOBB`

***

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:44](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L44)

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 객체 배열

#### Inherited from

`BaseTextField2D.children`

***

### combinedBoundingAABB

#### Get Signature

> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:824](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L824)

Returns the combined AABB information including child objects.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

`BaseTextField2D.combinedBoundingAABB`

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:67](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L67)

##### Returns

`string`

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:71](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L71)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.currentShaderModuleName`

***

### depthStencilState

#### Get Signature

> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:80](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L80)

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

#### Inherited from

`BaseTextField2D.depthStencilState`

***

### drawDebugger

#### Get Signature

> **get** **drawDebugger**(): [`DrawDebuggerMesh`](../namespaces/drawDebugger/classes/DrawDebuggerMesh.md)

Defined in: [src/display/mesh/Mesh.ts:356](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L356)

Returns the debug mesh object.

##### Returns

[`DrawDebuggerMesh`](../namespaces/drawDebugger/classes/DrawDebuggerMesh.md)

#### Inherited from

`BaseTextField2D.drawDebugger`

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:336](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L336)

Returns whether the debugger is enabled.

##### Returns

`boolean`

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:347](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L347)

Sets whether the debugger is enabled.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to enable |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.enableDebugger`

***

### events

#### Get Signature

> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:496](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L496)

Returns the registered events.

##### Returns

`any`

#### Inherited from

`BaseTextField2D.events`

***

### globalVertexSlotIndex

#### Get Signature

> **get** **globalVertexSlotIndex**(): `number`

Defined in: [src/display/mesh/Mesh.ts:317](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L317)

Returns the global buffer slot index.

##### Returns

`number`

#### Inherited from

`BaseTextField2D.globalVertexSlotIndex`

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:88](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L88)

Retrieves the GPU device associated with the current instance.

##### Returns

`GPUDevice`

The GPU device.

#### Inherited from

`BaseTextField2D.gpuDevice`

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:435](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L435)

Returns whether to ignore frustum culling.

##### Returns

`boolean`

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:446](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L446)

Sets whether to ignore frustum culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to ignore |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.ignoreFrustumCulling`

***

### LODManager

#### Get Signature

> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:328](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L328)

Returns the LOD (Level of Detail) manager.

##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager instance

#### Inherited from

`BaseTextField2D.LODManager`

***

### minScreenSpaceSize

#### Get Signature

> **get** **minScreenSpaceSize**(): `number`

Defined in: [src/display/mesh/Mesh.ts:471](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L471)

Returns the minimum size ratio threshold for screen space size culling.

##### Returns

`number`

#### Set Signature

> **set** **minScreenSpaceSize**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:480](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L480)

Sets the minimum size ratio threshold for screen space size culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Size ratio threshold |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.minScreenSpaceSize`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.name`

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L52)

자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 수

#### Inherited from

`BaseTextField2D.numChildren`

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:414](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L414)

Returns the opacity of the mesh. (0~1)

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:425](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L425)

Sets the opacity of the mesh. (0~1)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Opacity value |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.opacity`

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:512](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L512)

Returns the set parent object.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:523](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L523)

Sets the parent object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) | Parent container |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.parent`

***

### pickingId

#### Get Signature

> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:488](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L488)

Returns the picking ID.

##### Returns

`number`

#### Inherited from

`BaseTextField2D.pickingId`

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:531](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L531)

Returns the pivot X coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:542](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L542)

Sets the pivot X coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X coordinate |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.pivotX`

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:551](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L551)

Returns the pivot Y coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:562](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L562)

Sets the pivot Y coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y coordinate |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.pivotY`

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:571](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L571)

Returns the pivot Z coordinate.

##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:582](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L582)

Sets the pivot Z coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.pivotZ`

***

### position

#### Get Signature

> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:654](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L654)

Returns the current position. [x, y, z]

##### Returns

`Float32Array`

Position array

#### Inherited from

`BaseTextField2D.position`

***

### primitiveState

#### Get Signature

> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L76)

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

#### Inherited from

`BaseTextField2D.primitiveState`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:97](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L97)

Retrieves the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

The RedGPUContext instance.

#### Inherited from

`BaseTextField2D.redGPUContext`

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:730](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L730)

Returns the X-axis rotation value. (degrees)

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:741](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L741)

Sets the X-axis rotation value. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.rotationX`

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:750](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L750)

Returns the Y-axis rotation value. (degrees)

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:761](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L761)

Sets the Y-axis rotation value. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.rotationY`

***

### scale

#### Get Signature

> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:722](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L722)

Returns the current scale. [x, y, z]

##### Returns

`Float32Array`

#### Inherited from

`BaseTextField2D.scale`

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:662](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L662)

Returns the X-axis scale.

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:673](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L673)

Sets the X-axis scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.scaleX`

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:682](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L682)

Returns the Y-axis scale.

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:693](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L693)

Sets the Y-axis scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.scaleY`

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:702](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L702)

Returns the Z-axis scale.

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:713](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L713)

Sets the Z-axis scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Scale value |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.scaleZ`

***

### text

#### Get Signature

> **get** **text**(): `string`

Defined in: [src/display/textFields/core/ATextField.ts:209](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L209)

Returns the text to display.

##### Returns

`string`

#### Set Signature

> **set** **text**(`text`): `void`

Defined in: [src/display/textFields/core/ATextField.ts:220](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L220)

Sets the text to display. Recognizes and handles line breaks (`\n` or `<br/>`).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | Text string to display |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.text`

***

### useScreenSpaceSizeCulling

#### Get Signature

> **get** **useScreenSpaceSizeCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:454](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L454)

Returns whether to use screen space size culling.

##### Returns

`boolean`

#### Set Signature

> **set** **useScreenSpaceSizeCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:463](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L463)

Sets whether to use screen space size culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.useScreenSpaceSizeCulling`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

`BaseTextField2D.uuid`

***

### vertexStateBuffers

#### Get Signature

> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:504](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L504)

Returns the vertex state buffer layouts.

##### Returns

`GPUVertexBufferLayout`[]

#### Inherited from

`BaseTextField2D.vertexStateBuffers`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:591](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L591)

Returns the X position coordinate.

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:602](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L602)

Sets the X position coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X coordinate |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.x`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:611](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L611)

Returns the Y position coordinate.

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:622](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L622)

Sets the Y position coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y coordinate |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.y`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:631](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L631)

Returns the Z position coordinate.

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:642](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L642)

Sets the Z position coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.z`

## Methods

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:71](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L71)

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

`BaseTextField2D.addChild`

***

### addChildAt()

> **addChildAt**(`child`, `index`): `TextField2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L89)

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`TextField2D`

현재 컨테이너

#### Inherited from

`BaseTextField2D.addChildAt`

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:936](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L936)

Adds an event listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | Event name |
| `callback` | `Function` | Callback function |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.addListener`

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1046](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L1046)

**`Experimental`**

Clones the mesh.

#### Returns

[`Mesh`](Mesh.md)

Cloned Mesh instance

#### Inherited from

`BaseTextField2D.clone`

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:61](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L61)

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

`BaseTextField2D.contains`

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1818](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L1818)

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

`BaseTextField2D.createMeshVertexShaderModuleBASIC`

***

### dispose()

> **dispose**(): `void`

Defined in: [src/display/mesh/Mesh.ts:832](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L832)

Disposes of the resources.

#### Returns

`void`

#### Inherited from

`BaseTextField2D.dispose`

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:111](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L111)

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

`BaseTextField2D.getChildAt`

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:125](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L125)

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

`BaseTextField2D.getChildIndex`

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:918](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L918)

Calculates and returns the combined opacity considering the parent hierarchy.

#### Returns

`number`

Combined opacity value

#### Inherited from

`BaseTextField2D.getCombinedOpacity`

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:109](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L109)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](View3D.md) |

#### Returns

\[`number`, `number`\]

#### Inherited from

`BaseTextField2D.getScreenPoint`

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1804](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L1804)

#### Returns

`void`

#### Inherited from

`BaseTextField2D.initGPURenderInfos`

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:105](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L105)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

`BaseTextField2D.localToWorld`

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:954](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L954)

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

`BaseTextField2D.lookAt`

***

### removeAllChildren()

> **removeAllChildren**(): `TextField2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:234](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L234)

모든 자식 객체를 제거합니다.

#### Returns

`TextField2D`

현재 컨테이너

#### Inherited from

`BaseTextField2D.removeAllChildren`

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:203](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L203)

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

`BaseTextField2D.removeChild`

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:219](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L219)

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

`BaseTextField2D.removeChildAt`

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/textFields/core/ATextField.ts:238](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/textFields/core/ATextField.ts#L238)

Renders the text field every frame, updating the bitmap texture if needed.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Current render view state data |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.render`

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:864](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L864)

Sets shadow casting for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | Whether to cast (default: false) |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.setCastShadowRecursively`

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:140](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L140)

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.setChildIndex`

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:846](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L846)

Sets the debugger visibility for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger` | `boolean` | `false` | Whether to enable (default: false) |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.setEnableDebuggerRecursively`

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:900](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L900)

Sets whether to ignore frustum culling for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | Whether to ignore (default: false) |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.setIgnoreFrustumCullingRecursively`

***

### setPosition()

#### Call Signature

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:66](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/mixInMesh2D.ts#L66)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y?` | `number` |

##### Returns

`void`

##### Inherited from

`BaseTextField2D.setPosition`

#### Call Signature

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:1005](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L1005)

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

`BaseTextField2D.setPosition`

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:882](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L882)

Sets shadow receiving for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | Whether to receive (default: false) |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.setReceiveShadowRecursively`

***

### setRotation()

#### Call Signature

> **setRotation**(`value`): `void`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:72](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/mixInMesh2D.ts#L72)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

##### Inherited from

`BaseTextField2D.setRotation`

#### Call Signature

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:1028](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L1028)

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

`BaseTextField2D.setRotation`

***

### setScale()

#### Call Signature

> **setScale**(`x`, `y?`): `void`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:60](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/mixInMesh2D.ts#L60)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y?` | `number` |

##### Returns

`void`

##### Inherited from

`BaseTextField2D.setScale`

#### Call Signature

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:982](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/Mesh.ts#L982)

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

`BaseTextField2D.setScale`

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L163)

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.swapChildren`

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:183](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/Object3DContainer.ts#L183)

두 인덱스의 자식 객체 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.swapChildrenAt`

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:101](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/mesh/core/MeshBase.ts#L101)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

`BaseTextField2D.worldToLocal`


</details>
