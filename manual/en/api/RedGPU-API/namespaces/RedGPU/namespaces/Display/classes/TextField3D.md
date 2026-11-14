[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / TextField3D

# Class: TextField3D

Defined in: [src/display/textFields/textField3D/TextField3D.ts:35](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L35)

Text field class placed in 3D space.

Automatically calculates horizontal and vertical ratios (`renderRatioX`, `renderRatioY`) from the text texture aspect ratio, with billboard orientation (`useBillboard`) and size mode (`usePixelSize`: `worldSize` or `pixelSize`) operating independently.

***

### Example
```typescript
const textField = new RedGPU.Display.TextField3D(redGPUContext, "Hello RedGPU!");
scene.addChild(textField);
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/3d/textField/textField3D/" />

An example comparing World Size and Pixel Size modes.
<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/3d/textField/textField3DCompare/" />

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

Defined in: [src/display/textFields/textField3D/TextField3D.ts:60](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L60)

Creates a TextField3D instance.

#### Example
```typescript
const textField = new RedGPU.Display.TextField3D(redGPUContext, "Hello 3D!");
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `text?` | `string` | Initial text string to display (optional) |

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

Defined in: [src/display/textFields/textField3D/TextField3D.ts:196](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L196)

Returns the internal fixed `Plane` geometry. Cannot be changed externally.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Geometry instance

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:200](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L200)

Gets or sets the geometry.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) |

##### Returns

`void`

Geometry or Primitive instance

#### Overrides

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`geometry`](../namespaces/CoreTextField/classes/ATextField.md#geometry)

***

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:212](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L212)

Returns the internal fixed material. Cannot be changed externally.

##### Returns

`any`

Material instance

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:216](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L216)

Gets or sets the material.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `any` |

##### Returns

`void`

Configured material instance

#### Overrides

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`material`](../namespaces/CoreTextField/classes/ATextField.md#material)

***

***

### pixelSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelSize**(): `number`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:160](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L160)

Returns the vertical pixel size (in px) of the text container determined by styles (`fontSize`, `padding`, etc.).

##### Returns

`number`

Vertical pixel size (unit: px)

***

***

### renderRatioX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderRatioX**(): `number`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:172](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L172)

Returns the horizontal rendering scale ratio calculated from the text texture aspect ratio and current size mode.

##### Returns

`number`

Horizontal rendering ratio

***

***

### renderRatioY

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderRatioY**(): `number`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:184](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L184)

Returns the vertical rendering scale ratio calculated from the current size mode.

##### Returns

`number`

Vertical rendering ratio

***

***

### useBillboard

#### Get Signature

> **get** **useBillboard**(): `boolean`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:91](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L91)

Returns or sets whether billboard mode (always facing the camera) is enabled. (Default: `true`)

##### Returns

`boolean`

Whether billboard mode is enabled

#### Set Signature

> **set** **useBillboard**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:95](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L95)

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

Defined in: [src/display/textFields/textField3D/TextField3D.ts:129](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L129)

Returns or sets whether to display at the text container's pixel height (`pixelSize`) regardless of camera distance. (Default: `false`)

##### Returns

`boolean`

Whether fixed pixel size mode is enabled

#### Set Signature

> **set** **usePixelSize**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:133](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L133)

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

Defined in: [src/display/textFields/textField3D/TextField3D.ts:111](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L111)

Returns or sets the vertical size in world units when in world size mode (`usePixelSize: false`). (Default: `1`)

##### Returns

`number`

Vertical size in world space

#### Set Signature

> **set** **worldSize**(`value`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:115](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L115)

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

Defined in: [src/display/textFields/textField3D/TextField3D.ts:240](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L240)

Creates the custom vertex shader module dedicated to `TextField3D`.

#### Returns

`GPUShaderModule`

Created `GPUShaderModule` instance

#### Overrides

`ATextField.createCustomMeshVertexShaderModule`

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/textFields/textField3D/TextField3D.ts:228](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/textField3D/TextField3D.ts#L228)

Updates the text texture and renders the text field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Render state data of the current view |

#### Returns

`void`

#### Overrides

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`render`](../namespaces/CoreTextField/classes/ATextField.md#render)

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:302](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L302)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`_geometry`](../namespaces/CoreTextField/classes/ATextField.md#_geometry)

***

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:280](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L280)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`_material`](../namespaces/CoreTextField/classes/ATextField.md#_material)

***

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:42](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L42)

GLTF morph, skin, and clip animation information.

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

Defined in: [src/display/textFields/core/ATextField.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L48)

Background style (CSS `background` value)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`background`](../namespaces/CoreTextField/classes/ATextField.md#background)

***

***

### border

> **border**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:83](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L83)

Border style (CSS `border` value)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`border`](../namespaces/CoreTextField/classes/ATextField.md#border)

***

***

### borderRadius

> **borderRadius**: `string` \| `number`

Defined in: [src/display/textFields/core/ATextField.ts:88](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L88)

Border radius (in pixels or CSS value)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`borderRadius`](../namespaces/CoreTextField/classes/ATextField.md#borderradius)

***

***

### boxShadow

> **boxShadow**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:93](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L93)

Box shadow style (CSS `box-shadow` value)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boxShadow`](../namespaces/CoreTextField/classes/ATextField.md#boxshadow)

***

***

### boxSizing

> **boxSizing**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:98](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L98)

Box sizing model (e.g., `'border-box'`, `'content-box'`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boxSizing`](../namespaces/CoreTextField/classes/ATextField.md#boxsizing)

***

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:99](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L99)

Whether to cast shadows

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`castShadow`](../namespaces/CoreTextField/classes/ATextField.md#castshadow)

***

***

### color

> **color**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:43](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L43)

Text color (CSS color value)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`color`](../namespaces/CoreTextField/classes/ATextField.md#color)

***

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:104](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L104)

Whether LOD info needs update

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyLOD`](../namespaces/CoreTextField/classes/ATextField.md#dirtylod)

***

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:74](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L74)

Whether the opacity needs to be updated.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyOpacity`](../namespaces/CoreTextField/classes/ATextField.md#dirtyopacity)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:64](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L64)

Whether the render pipeline needs to be updated.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyPipeline`](../namespaces/CoreTextField/classes/ATextField.md#dirtypipeline)

***

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:69](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L69)

Whether the transform matrix needs to be updated.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`dirtyTransform`](../namespaces/CoreTextField/classes/ATextField.md#dirtytransform)

***

***

### filter

> **filter**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:103](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L103)

Graphical filter effect (CSS `filter` value)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`filter`](../namespaces/CoreTextField/classes/ATextField.md#filter)

***

***

### fontFamily

> **fontFamily**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:28](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L28)

Font family

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontFamily`](../namespaces/CoreTextField/classes/ATextField.md#fontfamily)

***

***

### fontSize

> **fontSize**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:23](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L23)

Font size (in pixels)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontSize`](../namespaces/CoreTextField/classes/ATextField.md#fontsize)

***

***

### fontStyle

> **fontStyle**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:38](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L38)

Font style (e.g., `'normal'`, `'italic'`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontStyle`](../namespaces/CoreTextField/classes/ATextField.md#fontstyle)

***

***

### fontWeight

> **fontWeight**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:33](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L33)

Font weight (e.g., `'normal'`, `'bold'`, `'100'`~`'900'`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`fontWeight`](../namespaces/CoreTextField/classes/ATextField.md#fontweight)

***

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:59](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L59)

GLTFLoader instance information that loaded this object.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`gltfLoaderInfo`](../namespaces/CoreTextField/classes/ATextField.md#gltfloaderinfo)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:37](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L37)

GPU vertex render information object.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`gpuRenderInfo`](../namespaces/CoreTextField/classes/ATextField.md#gpurenderinfo)

***

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:60](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L60)

Identifier to determine if it is a Mesh instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`isInstanceofMesh`](../namespaces/CoreTextField/classes/ATextField.md#isinstanceofmesh)

***

***

### letterSpacing

> **letterSpacing**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:58](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L58)

Letter spacing (in pixels)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`letterSpacing`](../namespaces/CoreTextField/classes/ATextField.md#letterspacing)

***

***

### lineHeight

> **lineHeight**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:78](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L78)

Line height multiplier

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`lineHeight`](../namespaces/CoreTextField/classes/ATextField.md#lineheight)

***

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:84](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L84)

Local transformation matrix relative to the parent.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`localMatrix`](../namespaces/CoreTextField/classes/ATextField.md#localmatrix)

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L79)

Model matrix with world transformation applied.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`modelMatrix`](../namespaces/CoreTextField/classes/ATextField.md#modelmatrix)

***

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:89](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L89)

Normal model matrix used for normal vector transformation.

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`normalModelMatrix`](../namespaces/CoreTextField/classes/ATextField.md#normalmodelmatrix)

***

***

### padding

> **padding**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:53](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L53)

Padding size (in pixels)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`padding`](../namespaces/CoreTextField/classes/ATextField.md#padding)

***

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:109](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L109)

Whether it passed frustum culling

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`passFrustumCulling`](../namespaces/CoreTextField/classes/ATextField.md#passfrustumculling)

***

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L45)

Whether to receive shadows

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`receiveShadow`](../namespaces/CoreTextField/classes/ATextField.md#receiveshadow)

***

***

### textAlign

> **textAlign**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:73](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L73)

Horizontal text alignment (e.g., `'center'`, `'left'`, `'right'`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`textAlign`](../namespaces/CoreTextField/classes/ATextField.md#textalign)

***

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:55](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L55)

Whether to use displacement texture

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`useDisplacementTexture`](../namespaces/CoreTextField/classes/ATextField.md#usedisplacementtexture)

***

***

### verticalAlign

> **verticalAlign**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L68)

Vertical alignment (e.g., `'middle'`, `'top'`, `'bottom'`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`verticalAlign`](../namespaces/CoreTextField/classes/ATextField.md#verticalalign)

***

***

### wordBreak

> **wordBreak**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L63)

Word break behavior (e.g., `'keep-all'`, `'break-all'`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`wordBreak`](../namespaces/CoreTextField/classes/ATextField.md#wordbreak)

***

### boundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:752](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L752)

Returns the AABB (Axis-Aligned Bounding Box) information. (Zero-GC in-place reuse)

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

Calculated AABB instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boundingAABB`](../namespaces/CoreTextField/classes/ATextField.md#boundingaabb)

***

***

### boundingOBB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:737](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L737)

Returns the OBB (Oriented Bounding Box) information.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

Calculated OBB instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`boundingOBB`](../namespaces/CoreTextField/classes/ATextField.md#boundingobb)

***

***

### children

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:46](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L46)

Returns the array of child objects.

##### Returns

[`Mesh`](Mesh.md)[]

Array of child Meshes (`Mesh[]`)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`children`](../namespaces/CoreTextField/classes/ATextField.md#children)

***

***

### combinedBoundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:772](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L772)

Returns the combined AABB information including child objects.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

Combined AABB instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`combinedBoundingAABB`](../namespaces/CoreTextField/classes/ATextField.md#combinedboundingaabb)

***

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L121)

Gets or sets the name of the currently applied vertex shader module.

##### Returns

`string`

Current vertex shader module name

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:125](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L125)

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

Defined in: [src/display/mesh/core/MeshBase.ts:149](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L149)

Returns the depth/stencil rendering state (`DepthStencilState`) of the object.

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

DepthStencilState instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`depthStencilState`](../namespaces/CoreTextField/classes/ATextField.md#depthstencilstate)

***

***

### drawBufferManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawBufferManager**(): `DrawBufferManager`

Defined in: [src/display/mesh/Mesh.ts:235](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L235)

Returns the draw buffer manager.

##### Returns

`DrawBufferManager`

DrawBufferManager instance or `null`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`drawBufferManager`](../namespaces/CoreTextField/classes/ATextField.md#drawbuffermanager)

***

***

### drawCommandSlot

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawCommandSlot**(): `DrawCommandSlot`

Defined in: [src/display/mesh/Mesh.ts:223](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L223)

Returns the draw command slot.

##### Returns

`DrawCommandSlot`

DrawCommandSlot instance or `null`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`drawCommandSlot`](../namespaces/CoreTextField/classes/ATextField.md#drawcommandslot)

***

***

### drawDebugger

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

Defined in: [src/display/mesh/Mesh.ts:276](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L276)

Returns the debug mesh object.

##### Returns

[`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

DrawDebuggerMesh instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`drawDebugger`](../namespaces/CoreTextField/classes/ATextField.md#drawdebugger)

***

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:259](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L259)

Gets or sets whether the debugger is enabled.

##### Returns

`boolean`

Whether the debugger is enabled

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:263](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L263)

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

Defined in: [src/display/mesh/Mesh.ts:448](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L448)

Gets or sets whether real-time wave interaction with water (Lake) is enabled.

##### Returns

`boolean`

Whether water wave interaction is enabled

#### Set Signature

> **set** **enableWaterInteraction**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:452](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L452)

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

Defined in: [src/display/mesh/Mesh.ts:408](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L408)

Returns the registered event map object.

##### Returns

`any`

Registered events object

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`events`](../namespaces/CoreTextField/classes/ATextField.md#events)

***

***

### globalVertexSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalVertexSlotIndex**(): `number`

Defined in: [src/display/mesh/Mesh.ts:211](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L211)

Returns the global buffer slot index.

##### Returns

`number`

Global vertex slot index

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`globalVertexSlotIndex`](../namespaces/CoreTextField/classes/ATextField.md#globalvertexslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:161](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L161)

Returns the WebGPU device associated with the current instance.

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`gpuDevice`](../namespaces/CoreTextField/classes/ATextField.md#gpudevice)

***

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:348](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L348)

Gets or sets whether to ignore frustum culling.

##### Returns

`boolean`

Whether frustum culling is ignored

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:352](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L352)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`instanceId`](../namespaces/CoreTextField/classes/ATextField.md#instanceid)

***

***

### LODManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:247](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L247)

Returns the LOD (Level of Detail) manager.

##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`LODManager`](../namespaces/CoreTextField/classes/ATextField.md#lodmanager)

***

***

### minScreenSpaceSize

#### Get Signature

> **get** **minScreenSpaceSize**(): `number`

Defined in: [src/display/mesh/Mesh.ts:380](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L380)

Gets or sets the minimum size ratio threshold for screen space size culling.

##### Returns

`number`

Screen space size ratio threshold

#### Set Signature

> **set** **minScreenSpaceSize**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:384](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L384)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L70)

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

Defined in: [src/display/mesh/core/Object3DContainer.ts:58](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L58)

Returns the number of registered child objects.

##### Returns

`number`

Number of child objects

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`numChildren`](../namespaces/CoreTextField/classes/ATextField.md#numchildren)

***

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:330](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L330)

Gets or sets the opacity of the mesh (0~1).

##### Returns

`number`

Opacity value (0~1)

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:334](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L334)

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

Defined in: [src/display/mesh/Mesh.ts:432](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L432)

Gets or sets the parent container object.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Parent Object3DContainer instance

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:436](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L436)

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

Defined in: [src/display/mesh/Mesh.ts:396](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L396)

Returns the picking ID.

##### Returns

`number`

Picking identifier value

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`pickingId`](../namespaces/CoreTextField/classes/ATextField.md#pickingid)

***

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:497](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L497)

Gets or sets the pivot X coordinate.

##### Returns

`number`

Pivot X coordinate

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:501](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L501)

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

Defined in: [src/display/mesh/Mesh.ts:514](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L514)

Gets or sets the pivot Y coordinate.

##### Returns

`number`

Pivot Y coordinate

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:518](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L518)

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

Defined in: [src/display/mesh/Mesh.ts:531](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L531)

Gets or sets the pivot Z coordinate.

##### Returns

`number`

Pivot Z coordinate

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:535](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L535)

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

Defined in: [src/display/mesh/Mesh.ts:599](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L599)

Returns the current position. [x, y, z]

##### Returns

`Float32Array`

Position array

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`position`](../namespaces/CoreTextField/classes/ATextField.md#position)

***

***

### primitiveState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:137](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L137)

Returns the primitive rendering state (`PrimitiveState`) of the object.

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

PrimitiveState instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`primitiveState`](../namespaces/CoreTextField/classes/ATextField.md#primitivestate)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:173](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L173)

Returns the RedGPUContext associated with the current instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`redGPUContext`](../namespaces/CoreTextField/classes/ATextField.md#redgpucontext)

***

***

### rotation

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:725](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L725)

Returns the current rotation values. [x, y, z] (degrees)

##### Returns

`Float32Array`

Rotation values array (degrees)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`rotation`](../namespaces/CoreTextField/classes/ATextField.md#rotation)

***

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:674](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L674)

Gets or sets the X-axis rotation value (degrees).

##### Returns

`number`

X-axis rotation value (degrees)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:678](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L678)

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

Defined in: [src/display/mesh/Mesh.ts:691](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L691)

Gets or sets the Y-axis rotation value (degrees).

##### Returns

`number`

Y-axis rotation value (degrees)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:695](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L695)

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

Defined in: [src/display/mesh/Mesh.ts:708](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L708)

Gets or sets the Z-axis rotation value (degrees).

##### Returns

`number`

Z-axis rotation value (degrees)

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:712](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L712)

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

Defined in: [src/display/mesh/Mesh.ts:662](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L662)

Returns the current scale. [x, y, z]

##### Returns

`Float32Array`

Scale array

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`scale`](../namespaces/CoreTextField/classes/ATextField.md#scale)

***

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:611](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L611)

Gets or sets the X-axis scale.

##### Returns

`number`

X-axis scale value

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:615](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L615)

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

Defined in: [src/display/mesh/Mesh.ts:628](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L628)

Gets or sets the Y-axis scale.

##### Returns

`number`

Y-axis scale value

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:632](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L632)

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

Defined in: [src/display/mesh/Mesh.ts:645](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L645)

Gets or sets the Z-axis scale.

##### Returns

`number`

Z-axis scale value

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:649](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L649)

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

Defined in: [src/display/textFields/core/ATextField.ts:210](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L210)

Returns or sets the text string to display. Processes `<br/>` tags as line breaks.

##### Returns

`string`

Currently set text string

#### Set Signature

> **set** **text**(`text`): `void`

Defined in: [src/display/textFields/core/ATextField.ts:214](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L214)

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

Defined in: [src/display/mesh/Mesh.ts:364](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L364)

Gets or sets whether to use screen space size culling.

##### Returns

`boolean`

Whether screen space size culling is used

#### Set Signature

> **set** **useScreenSpaceSizeCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:368](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L368)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`uuid`](../namespaces/CoreTextField/classes/ATextField.md#uuid)

***

***

### vertexStateBuffers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:420](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L420)

Returns the array of vertex state buffer layouts.

##### Returns

`GPUVertexBufferLayout`[]

Array of GPUVertexBufferLayout

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`vertexStateBuffers`](../namespaces/CoreTextField/classes/ATextField.md#vertexstatebuffers)

***

***

### waterWaveStrength

#### Get Signature

> **get** **waterWaveStrength**(): `number`

Defined in: [src/display/mesh/Mesh.ts:473](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L473)

Gets or sets the wave generation strength multiplier (default: 1.0).

##### Returns

`number`

Water wave generation strength multiplier

#### Set Signature

> **set** **waterWaveStrength**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:477](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L477)

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

Defined in: [src/display/mesh/Mesh.ts:548](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L548)

Gets or sets the X position coordinate.

##### Returns

`number`

X position coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:552](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L552)

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

Defined in: [src/display/mesh/Mesh.ts:565](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L565)

Gets or sets the Y position coordinate.

##### Returns

`number`

Y position coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:569](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L569)

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

Defined in: [src/display/mesh/Mesh.ts:582](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L582)

Gets or sets the Z position coordinate.

##### Returns

`number`

Z position coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:586](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L586)

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

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L89)

Appends a child object to the end of the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |

#### Returns

[`Mesh`](Mesh.md)

Added child object (`null` on failure)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`addChild`](../namespaces/CoreTextField/classes/ATextField.md#addchild)

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `TextField3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L115)

Inserts a child object at the specified index position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |
| `index` | `number` | Index position to insert at |

#### Returns

`TextField3D`

Current container instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`addChildAt`](../namespaces/CoreTextField/classes/ATextField.md#addchildat)

***

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:889](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L889)

Adds an event listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | Event name |
| `callback` | `Function` | Callback function |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`addListener`](../namespaces/CoreTextField/classes/ATextField.md#addlistener)

***

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1003](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L1003)

**`Experimental`**

Clones the mesh.

#### Returns

[`Mesh`](Mesh.md)

Cloned Mesh instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`clone`](../namespaces/CoreTextField/classes/ATextField.md#clone)

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:73](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L73)

Checks whether the specified object is a child of this container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to check |

#### Returns

`boolean`

Whether the child is contained

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`contains`](../namespaces/CoreTextField/classes/ATextField.md#contains)

***

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1732](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L1732)

Creates and returns the basic mesh vertex shader module and uniform bind group.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `VERTEX_SHADER_MODULE_NAME` | `any` | Vertex shader module name |
| `SHADER_INFO` | `any` | Parsed WGSL shader info |
| `UNIFORM_STRUCT_BASIC` | `any` | Vertex uniform struct info |
| `vertexModuleSource` | `any` | Vertex shader WGSL source code |

#### Returns

`GPUShaderModule`

Created GPUShaderModule instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`createMeshVertexShaderModuleBASIC`](../namespaces/CoreTextField/classes/ATextField.md#createmeshvertexshadermodulebasic)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/textFields/core/ATextField.ts:244](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/textFields/core/ATextField.ts#L244)

Destroys the text field instance and releases internal DOM elements, textures, and Object URL resources.

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`destroy`](../namespaces/CoreTextField/classes/ATextField.md#destroy)

***

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:143](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L143)

Returns the child object at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index position to retrieve |

#### Returns

[`Mesh`](Mesh.md)

Child object at the index (`undefined` if out of bounds)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getChildAt`](../namespaces/CoreTextField/classes/ATextField.md#getchildat)

***

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L163)

Returns the index of the specified child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to find the index of |

#### Returns

`number`

Index of the child object (`-1` if not found)

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getChildIndex`](../namespaces/CoreTextField/classes/ATextField.md#getchildindex)

***

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:870](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L870)

Calculates and returns the combined opacity considering the parent hierarchy.

#### Returns

`number`

Combined opacity value

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getCombinedOpacity`](../namespaces/CoreTextField/classes/ATextField.md#getcombinedopacity)

***

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:245](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L245)

Returns the 2D screen coordinates of this object based on the specified view.

#### Example
```typescript
const screenPos = mesh.getScreenPoint(view3D);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](View3D.md) | Reference View3D instance |

#### Returns

\[`number`, `number`\]

Screen coordinates `[x, y]`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`getScreenPoint`](../namespaces/CoreTextField/classes/ATextField.md#getscreenpoint)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1698](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L1698)

Initializes the mesh's GPU render info (VertexGPURenderInfo) and updates the pipeline.

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`initGPURenderInfos`](../namespaces/CoreTextField/classes/ATextField.md#initgpurenderinfos)

***

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:225](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L225)

Converts this object's local space coordinates to world space coordinates.

#### Example
```typescript
const worldPos = mesh.localToWorld(0, 1, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Local X coordinate |
| `y` | `number` | Local Y coordinate |
| `z` | `number` | Local Z coordinate |

#### Returns

\[`number`, `number`, `number`\]

Converted world coordinates `[x, y, z]`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`localToWorld`](../namespaces/CoreTextField/classes/ATextField.md#localtoworld)

***

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:908](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L908)

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

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`lookAt`](../namespaces/CoreTextField/classes/ATextField.md#lookat)

***

***

### removeAllChildren()

> **removeAllChildren**(): `TextField3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L309)

Removes all child objects from the container.

#### Returns

`TextField3D`

Current container instance

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`removeAllChildren`](../namespaces/CoreTextField/classes/ATextField.md#removeallchildren)

***

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:265](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L265)

Removes the specified child object from the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to remove |

#### Returns

[`Mesh`](Mesh.md)

Removed child object

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`removeChild`](../namespaces/CoreTextField/classes/ATextField.md#removechild)

***

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:290](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L290)

Removes the child object at the specified index from the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the child object to remove |

#### Returns

[`Mesh`](Mesh.md)

Removed child object

#### Throws

Throws Error if no child exists at the provided index

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`removeChildAt`](../namespaces/CoreTextField/classes/ATextField.md#removechildat)

***

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:803](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L803)

Sets shadow casting for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | Whether to cast (default: false) |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setCastShadowRecursively`](../namespaces/CoreTextField/classes/ATextField.md#setcastshadowrecursively)

***

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:184](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L184)

Changes the index position of a child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to reposition |
| `index` | `number` | New index to assign |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setChildIndex`](../namespaces/CoreTextField/classes/ATextField.md#setchildindex)

***

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:784](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L784)

Sets the debugger visibility for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger?` | `boolean` | `false` | Whether to enable (default: false) |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setEnableDebuggerRecursively`](../namespaces/CoreTextField/classes/ATextField.md#setenabledebuggerrecursively)

***

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:841](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L841)

Sets whether to ignore frustum culling for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | Whether to ignore (default: false) |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setIgnoreFrustumCullingRecursively`](../namespaces/CoreTextField/classes/ATextField.md#setignorefrustumcullingrecursively)

***

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:960](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L960)

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

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setPosition`](../namespaces/CoreTextField/classes/ATextField.md#setposition)

***

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:822](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L822)

Sets shadow receiving for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | Whether to receive (default: false) |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setReceiveShadowRecursively`](../namespaces/CoreTextField/classes/ATextField.md#setreceiveshadowrecursively)

***

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:984](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L984)

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

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setRotation`](../namespaces/CoreTextField/classes/ATextField.md#setrotation)

***

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:936](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/Mesh.ts#L936)

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

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`setScale`](../namespaces/CoreTextField/classes/ATextField.md#setscale)

***

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:213](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L213)

Swaps the order (indices) of two child objects within the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | First child object |
| `child2` | [`Mesh`](Mesh.md) | Second child object |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`swapChildren`](../namespaces/CoreTextField/classes/ATextField.md#swapchildren)

***

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:239](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/Object3DContainer.ts#L239)

Swaps the child objects at the two specified indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | First index |
| `index2` | `number` | Second index |

#### Returns

`void`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`swapChildrenAt`](../namespaces/CoreTextField/classes/ATextField.md#swapchildrenat)

***

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:199](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/MeshBase.ts#L199)

Converts world space coordinates to this object's local space coordinates.

#### Example
```typescript
const localPos = mesh.worldToLocal(10, 5, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | World X coordinate |
| `y` | `number` | World Y coordinate |
| `z` | `number` | World Z coordinate |

#### Returns

\[`number`, `number`, `number`\]

Converted local coordinates `[x, y, z]`

#### Inherited from

[`ATextField`](../namespaces/CoreTextField/classes/ATextField.md).[`worldToLocal`](../namespaces/CoreTextField/classes/ATextField.md#worldtolocal)

</details>
