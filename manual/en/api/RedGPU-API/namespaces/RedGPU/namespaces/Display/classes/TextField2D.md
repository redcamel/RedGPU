[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / TextField2D

# Class: TextField2D

Defined in: [src/display/textFields/textField2D/TextField2D.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/textField2D/TextField2D.ts#L36)

2D text field class that converts HTML/SVG-based text into a texture and displays it in 2D space.

Width and height in pixels are automatically determined by the rendered text size, and `geometry` and `material` are fixed and cannot be changed externally.

***

### Example
```typescript
const textField = new RedGPU.Display.TextField2D(redGPUContext);
textField.text = "Hello 2D Text!";
scene.addChild(textField);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/2d/textField2D/basic/" style="width:100%; height:500px;"></iframe>

## See

- [TextField2D Basic Example](https://redcamel.github.io/RedGPU/examples/2d/textField2D/basic/)
 - [TextField2D MouseEvent Example](https://redcamel.github.io/RedGPU/examples/2d/interaction/mouseEvent/textField2D/)

## Extends

- `BaseTextField2D`

## Constructors



***

### Constructor

> **new TextField2D**(`redGPUContext`, `useSmoothing?`): `TextField2D`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/textField2D/TextField2D.ts#L57)

Creates a TextField2D instance.

#### Example
```typescript
const textField = new RedGPU.Display.TextField2D(redGPUContext, true);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `useSmoothing?` | `boolean` | `true` | Whether to use texture smoothing (linear filtering) (default: `true`) |

#### Returns

`TextField2D`

#### Overrides

`BaseTextField2D.constructor`

## Properties



## Accessors



***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/textFields/textField2D/TextField2D.ts:128](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/textField2D/TextField2D.ts#L128)

Returns the fixed Plane geometry. Cannot be changed externally.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Geometry instance

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:132](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/textField2D/TextField2D.ts#L132)

Gets or sets the geometry.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) |

##### Returns

`void`

Geometry or Primitive instance

#### Overrides

`BaseTextField2D.geometry`

***

***

### height

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **height**(): `number`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/textField2D/TextField2D.ts#L116)

Returns the pixel height of the rendered text area.

##### Returns

`number`

Height (in pixels)

***

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:144](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/textField2D/TextField2D.ts#L144)

Returns the fixed internal material. Cannot be changed externally.

##### Returns

`any`

Material instance

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/textField2D/TextField2D.ts#L148)

Gets or sets the material.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `any` |

##### Returns

`void`

Configured material instance

#### Overrides

`BaseTextField2D.material`

***

***

### useSmoothing

#### Get Signature

> **get** **useSmoothing**(): `boolean`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/textField2D/TextField2D.ts#L78)

Returns or sets whether texture smoothing is used. Applies `LINEAR` filter if `true`, or `NEAREST` filter if `false`.

##### Returns

`boolean`

Whether smoothing is enabled

#### Set Signature

> **set** **useSmoothing**(`value`): `void`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/textField2D/TextField2D.ts#L82)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### width

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **width**(): `number`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/textField2D/TextField2D.ts#L104)

Returns the pixel width of the rendered text area.

##### Returns

`number`

Width (in pixels)

***

## Methods



***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/textFields/textField2D/TextField2D.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/textField2D/TextField2D.ts#L160)

Creates a custom vertex shader module dedicated to TextField2D.

#### Returns

`GPUShaderModule`

Created `GPUShaderModule` instance

#### Overrides

`BaseTextField2D.createCustomMeshVertexShaderModule`

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:301](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L301)

#### Inherited from

`BaseTextField2D._geometry`

***

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:279](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L279)

#### Inherited from

`BaseTextField2D._material`

***

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L42)

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

`BaseTextField2D.animationInfo`

***

***

### background

> **background**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L48)

Background style (CSS `background` value)

#### Inherited from

`BaseTextField2D.background`

***

***

### border

> **border**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:83](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L83)

Border style (CSS `border` value)

#### Inherited from

`BaseTextField2D.border`

***

***

### borderRadius

> **borderRadius**: `string` \| `number`

Defined in: [src/display/textFields/core/ATextField.ts:88](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L88)

Border radius (in pixels or CSS value)

#### Inherited from

`BaseTextField2D.borderRadius`

***

***

### boxShadow

> **boxShadow**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L93)

Box shadow style (CSS `box-shadow` value)

#### Inherited from

`BaseTextField2D.boxShadow`

***

***

### boxSizing

> **boxSizing**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L98)

Box sizing model (e.g., `'border-box'`, `'content-box'`)

#### Inherited from

`BaseTextField2D.boxSizing`

***

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L99)

Whether to cast shadows

#### Inherited from

`BaseTextField2D.castShadow`

***

***

### color

> **color**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:43](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L43)

Text color (CSS color value)

#### Inherited from

`BaseTextField2D.color`

***

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L104)

Whether LOD info needs update

#### Inherited from

`BaseTextField2D.dirtyLOD`

***

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L74)

Whether the opacity needs to be updated.

#### Inherited from

`BaseTextField2D.dirtyOpacity`

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L64)

Whether the render pipeline needs to be updated.

#### Inherited from

`BaseTextField2D.dirtyPipeline`

***

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L69)

Whether the transform matrix needs to be updated.

#### Inherited from

`BaseTextField2D.dirtyTransform`

***

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L50)

Whether to disable TAA jitter

#### Inherited from

`BaseTextField2D.disableJitter`

***

***

### filter

> **filter**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:103](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L103)

Graphical filter effect (CSS `filter` value)

#### Inherited from

`BaseTextField2D.filter`

***

***

### fontFamily

> **fontFamily**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L28)

Font family

#### Inherited from

`BaseTextField2D.fontFamily`

***

***

### fontSize

> **fontSize**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L23)

Font size (in pixels)

#### Inherited from

`BaseTextField2D.fontSize`

***

***

### fontStyle

> **fontStyle**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L38)

Font style (e.g., `'normal'`, `'italic'`)

#### Inherited from

`BaseTextField2D.fontStyle`

***

***

### fontWeight

> **fontWeight**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:33](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L33)

Font weight (e.g., `'normal'`, `'bold'`, `'100'`~`'900'`)

#### Inherited from

`BaseTextField2D.fontWeight`

***

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L59)

GLTFLoader instance information that loaded this object.

#### Inherited from

`BaseTextField2D.gltfLoaderInfo`

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L37)

GPU vertex render information object.

#### Inherited from

`BaseTextField2D.gpuRenderInfo`

***

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L60)

Identifier to determine if it is a Mesh instance

#### Inherited from

`BaseTextField2D.isInstanceofMesh`

***

***

### letterSpacing

> **letterSpacing**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L58)

Letter spacing (in pixels)

#### Inherited from

`BaseTextField2D.letterSpacing`

***

***

### lineHeight

> **lineHeight**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L78)

Line height multiplier

#### Inherited from

`BaseTextField2D.lineHeight`

***

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L84)

Local transformation matrix relative to the parent.

#### Inherited from

`BaseTextField2D.localMatrix`

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L79)

Model matrix with world transformation applied.

#### Inherited from

`BaseTextField2D.modelMatrix`

***

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L89)

Normal model matrix used for normal vector transformation.

#### Inherited from

`BaseTextField2D.normalModelMatrix`

***

***

### padding

> **padding**: `number`

Defined in: [src/display/textFields/core/ATextField.ts:53](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L53)

Padding size (in pixels)

#### Inherited from

`BaseTextField2D.padding`

***

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L109)

Whether it passed frustum culling

#### Inherited from

`BaseTextField2D.passFrustumCulling`

***

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L45)

Whether to receive shadows

#### Inherited from

`BaseTextField2D.receiveShadow`

***

***

### rotation

> **rotation**: `number` & `Float32Array`\<`ArrayBufferLike`\>

Defined in: [src/display/mesh/core/mixInMesh2D.ts:106](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/mixInMesh2D.ts#L106)

#### Inherited from

`BaseTextField2D.rotation`

***

***

### rotationZ

> **rotationZ**: `number`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:16](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/mixInMesh2D.ts#L16)

Z-axis rotation value (in degrees)

#### Inherited from

`BaseTextField2D.rotationZ`

***

***

### textAlign

> **textAlign**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L73)

Horizontal text alignment (e.g., `'center'`, `'left'`, `'right'`)

#### Inherited from

`BaseTextField2D.textAlign`

***

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:55](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L55)

Whether to use displacement texture

#### Inherited from

`BaseTextField2D.useDisplacementTexture`

***

***

### verticalAlign

> **verticalAlign**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L68)

Vertical alignment (e.g., `'middle'`, `'top'`, `'bottom'`)

#### Inherited from

`BaseTextField2D.verticalAlign`

***

***

### wordBreak

> **wordBreak**: `string`

Defined in: [src/display/textFields/core/ATextField.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L63)

Word break behavior (e.g., `'keep-all'`, `'break-all'`)

#### Inherited from

`BaseTextField2D.wordBreak`

***

### blendMode

#### Get Signature

> **get** **blendMode**(): `string`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/mixInMesh2D.ts#L73)

Gets or sets the blend mode of the 2D object.

##### Returns

`string`

Currently applied blend mode key string

#### Set Signature

> **set** **blendMode**(`value`): `void`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:81](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/mixInMesh2D.ts#L81)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"NORMAL"` \| `"SUBTRACT"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| [`BLEND_MODE`](../../Material/type-aliases/BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.blendMode`

***

***

### boundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:751](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L751)

Returns the AABB (Axis-Aligned Bounding Box) information. (Zero-GC in-place reuse)

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

Calculated AABB instance

#### Inherited from

`BaseTextField2D.boundingAABB`

***

***

### boundingOBB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:736](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L736)

Returns the OBB (Oriented Bounding Box) information.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

Calculated OBB instance

#### Inherited from

`BaseTextField2D.boundingOBB`

***

***

### children

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L46)

Returns the array of child objects.

##### Returns

[`Mesh`](Mesh.md)[]

Array of child Meshes (`Mesh[]`)

#### Inherited from

`BaseTextField2D.children`

***

***

### combinedBoundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:771](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L771)

Returns the combined AABB information including child objects.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

Combined AABB instance

#### Inherited from

`BaseTextField2D.combinedBoundingAABB`

***

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L121)

Gets or sets the name of the currently applied vertex shader module.

##### Returns

`string`

Current vertex shader module name

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:125](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L125)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.currentShaderModuleName`

***

***

### depthStencilState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:149](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L149)

Returns the depth/stencil rendering state (`DepthStencilState`) of the object.

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

DepthStencilState instance

#### Inherited from

`BaseTextField2D.depthStencilState`

***

***

### drawBufferManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawBufferManager**(): `DrawBufferManager`

Defined in: [src/display/mesh/Mesh.ts:234](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L234)

Returns the draw buffer manager.

##### Returns

`DrawBufferManager`

DrawBufferManager instance or `null`

#### Inherited from

`BaseTextField2D.drawBufferManager`

***

***

### drawCommandSlot

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawCommandSlot**(): `DrawCommandSlot`

Defined in: [src/display/mesh/Mesh.ts:222](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L222)

Returns the draw command slot.

##### Returns

`DrawCommandSlot`

DrawCommandSlot instance or `null`

#### Inherited from

`BaseTextField2D.drawCommandSlot`

***

***

### drawDebugger

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

Defined in: [src/display/mesh/Mesh.ts:275](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L275)

Returns the debug mesh object.

##### Returns

[`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

DrawDebuggerMesh instance

#### Inherited from

`BaseTextField2D.drawDebugger`

***

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:258](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L258)

Gets or sets whether the debugger is enabled.

##### Returns

`boolean`

Whether the debugger is enabled

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:262](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L262)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.enableDebugger`

***

***

### enableWaterInteraction

#### Get Signature

> **get** **enableWaterInteraction**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:447](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L447)

Gets or sets whether real-time wave interaction with water (Lake) is enabled.

##### Returns

`boolean`

Whether water wave interaction is enabled

#### Set Signature

> **set** **enableWaterInteraction**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:451](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L451)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.enableWaterInteraction`

***

***

### events

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:407](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L407)

Returns the registered event map object.

##### Returns

`any`

Registered events object

#### Inherited from

`BaseTextField2D.events`

***

***

### globalVertexSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalVertexSlotIndex**(): `number`

Defined in: [src/display/mesh/Mesh.ts:210](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L210)

Returns the global buffer slot index.

##### Returns

`number`

Global vertex slot index

#### Inherited from

`BaseTextField2D.globalVertexSlotIndex`

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:161](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L161)

Returns the WebGPU device associated with the current instance.

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

`BaseTextField2D.gpuDevice`

***

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:347](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L347)

Gets or sets whether to ignore frustum culling.

##### Returns

`boolean`

Whether frustum culling is ignored

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:351](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L351)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.ignoreFrustumCulling`

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

`BaseTextField2D.instanceId`

***

***

### LODManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:246](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L246)

Returns the LOD (Level of Detail) manager.

##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager instance

#### Inherited from

`BaseTextField2D.LODManager`

***

***

### minScreenSpaceSize

#### Get Signature

> **get** **minScreenSpaceSize**(): `number`

Defined in: [src/display/mesh/Mesh.ts:379](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L379)

Gets or sets the minimum size ratio threshold for screen space size culling.

##### Returns

`number`

Screen space size ratio threshold

#### Set Signature

> **set** **minScreenSpaceSize**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:383](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L383)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.minScreenSpaceSize`

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.name`

***

***

### numChildren

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L58)

Returns the number of registered child objects.

##### Returns

`number`

Number of child objects

#### Inherited from

`BaseTextField2D.numChildren`

***

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:329](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L329)

Gets or sets the opacity of the mesh (0~1).

##### Returns

`number`

Opacity value (0~1)

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:333](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L333)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.opacity`

***

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:431](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L431)

Gets or sets the parent container object.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Parent Object3DContainer instance

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:435](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L435)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.parent`

***

***

### pickingId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:395](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L395)

Returns the picking ID.

##### Returns

`number`

Picking identifier value

#### Inherited from

`BaseTextField2D.pickingId`

***

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:496](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L496)

Gets or sets the pivot X coordinate.

##### Returns

`number`

Pivot X coordinate

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:500](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L500)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.pivotX`

***

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:513](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L513)

Gets or sets the pivot Y coordinate.

##### Returns

`number`

Pivot Y coordinate

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:517](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L517)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.pivotY`

***

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:530](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L530)

Gets or sets the pivot Z coordinate.

##### Returns

`number`

Pivot Z coordinate

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:534](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L534)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.pivotZ`

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:598](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L598)

Returns the current position. [x, y, z]

##### Returns

`Float32Array`

Position array

#### Inherited from

`BaseTextField2D.position`

***

***

### primitiveState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:137](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L137)

Returns the primitive rendering state (`PrimitiveState`) of the object.

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

PrimitiveState instance

#### Inherited from

`BaseTextField2D.primitiveState`

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:173](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L173)

Returns the RedGPUContext associated with the current instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

`BaseTextField2D.redGPUContext`

***

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:673](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L673)

Gets or sets the X-axis rotation value (degrees).

##### Returns

`number`

X-axis rotation value (degrees)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:677](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L677)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.rotationX`

***

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:690](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L690)

Gets or sets the Y-axis rotation value (degrees).

##### Returns

`number`

Y-axis rotation value (degrees)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:694](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L694)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.rotationY`

***

***

### scale

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:661](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L661)

Returns the current scale. [x, y, z]

##### Returns

`Float32Array`

Scale array

#### Inherited from

`BaseTextField2D.scale`

***

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:610](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L610)

Gets or sets the X-axis scale.

##### Returns

`number`

X-axis scale value

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:614](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L614)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.scaleX`

***

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:627](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L627)

Gets or sets the Y-axis scale.

##### Returns

`number`

Y-axis scale value

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:631](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L631)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.scaleY`

***

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:644](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L644)

Gets or sets the Z-axis scale.

##### Returns

`number`

Z-axis scale value

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:648](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L648)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.scaleZ`

***

***

### text

#### Get Signature

> **get** **text**(): `string`

Defined in: [src/display/textFields/core/ATextField.ts:210](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L210)

Returns or sets the text string to display. Processes `<br/>` tags as line breaks.

##### Returns

`string`

Currently set text string

#### Set Signature

> **set** **text**(`text`): `void`

Defined in: [src/display/textFields/core/ATextField.ts:214](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L214)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.text`

***

***

### useScreenSpaceSizeCulling

#### Get Signature

> **get** **useScreenSpaceSizeCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:363](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L363)

Gets or sets whether to use screen space size culling.

##### Returns

`boolean`

Whether screen space size culling is used

#### Set Signature

> **set** **useScreenSpaceSizeCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:367](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L367)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.useScreenSpaceSizeCulling`

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

`BaseTextField2D.uuid`

***

***

### vertexStateBuffers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:419](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L419)

Returns the array of vertex state buffer layouts.

##### Returns

`GPUVertexBufferLayout`[]

Array of GPUVertexBufferLayout

#### Inherited from

`BaseTextField2D.vertexStateBuffers`

***

***

### waterWaveStrength

#### Get Signature

> **get** **waterWaveStrength**(): `number`

Defined in: [src/display/mesh/Mesh.ts:472](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L472)

Gets or sets the wave generation strength multiplier (default: 1.0).

##### Returns

`number`

Water wave generation strength multiplier

#### Set Signature

> **set** **waterWaveStrength**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:476](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L476)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.waterWaveStrength`

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:547](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L547)

Gets or sets the X position coordinate.

##### Returns

`number`

X position coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:551](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L551)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.x`

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:564](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L564)

Gets or sets the Y position coordinate.

##### Returns

`number`

Y position coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:568](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L568)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.y`

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:581](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L581)

Gets or sets the Z position coordinate.

##### Returns

`number`

Z position coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:585](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L585)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

`BaseTextField2D.z`

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L89)

Appends a child object to the end of the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |

#### Returns

[`Mesh`](Mesh.md)

Added child object (`null` on failure)

#### Inherited from

`BaseTextField2D.addChild`

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `TextField2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L115)

Inserts a child object at the specified index position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |
| `index` | `number` | Index position to insert at |

#### Returns

`TextField2D`

Current container instance

#### Inherited from

`BaseTextField2D.addChildAt`

***

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:888](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L888)

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

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1002](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1002)

**`Experimental`**

Clones the mesh.

#### Returns

[`Mesh`](Mesh.md)

Cloned Mesh instance

#### Inherited from

`BaseTextField2D.clone`

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L73)

Checks whether the specified object is a child of this container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to check |

#### Returns

`boolean`

Whether the child is contained

#### Inherited from

`BaseTextField2D.contains`

***

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1721](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1721)

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

`BaseTextField2D.createMeshVertexShaderModuleBASIC`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/textFields/core/ATextField.ts:244](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L244)

Destroys the text field instance and releases internal DOM elements, textures, and Object URL resources.

#### Returns

`void`

#### Inherited from

`BaseTextField2D.destroy`

***

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L143)

Returns the child object at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index position to retrieve |

#### Returns

[`Mesh`](Mesh.md)

Child object at the index (`undefined` if out of bounds)

#### Inherited from

`BaseTextField2D.getChildAt`

***

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L163)

Returns the index of the specified child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to find the index of |

#### Returns

`number`

Index of the child object (`-1` if not found)

#### Inherited from

`BaseTextField2D.getChildIndex`

***

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:869](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L869)

Calculates and returns the combined opacity considering the parent hierarchy.

#### Returns

`number`

Combined opacity value

#### Inherited from

`BaseTextField2D.getCombinedOpacity`

***

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:245](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L245)

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

`BaseTextField2D.getScreenPoint`

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1687](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1687)

Initializes the mesh's GPU render info (VertexGPURenderInfo) and updates the pipeline.

#### Returns

`void`

#### Inherited from

`BaseTextField2D.initGPURenderInfos`

***

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:225](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L225)

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

`BaseTextField2D.localToWorld`

***

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:907](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L907)

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

***

### removeAllChildren()

> **removeAllChildren**(): `TextField2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L309)

Removes all child objects from the container.

#### Returns

`TextField2D`

Current container instance

#### Inherited from

`BaseTextField2D.removeAllChildren`

***

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L265)

Removes the specified child object from the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to remove |

#### Returns

[`Mesh`](Mesh.md)

Removed child object

#### Inherited from

`BaseTextField2D.removeChild`

***

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:290](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L290)

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

`BaseTextField2D.removeChildAt`

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/textFields/core/ATextField.ts:234](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/textFields/core/ATextField.ts#L234)

Updates the text texture state and renders the text field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | View rendering state data |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.render`

***

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:802](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L802)

Sets shadow casting for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | Whether to cast (default: false) |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.setCastShadowRecursively`

***

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L184)

Changes the index position of a child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to reposition |
| `index` | `number` | New index to assign |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.setChildIndex`

***

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:783](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L783)

Sets the debugger visibility for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger?` | `boolean` | `false` | Whether to enable (default: false) |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.setEnableDebuggerRecursively`

***

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:840](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L840)

Sets whether to ignore frustum culling for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | Whether to ignore (default: false) |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.setIgnoreFrustumCullingRecursively`

***

***

### setPosition()

Sets the X and Y position of the 2D object. If `y` is omitted, it is set to the same value as `x`.

#### Param

**x**

X-axis coordinate

#### Param

**y**

Y-axis coordinate (defaults to `x` if omitted)

#### Call Signature

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/mixInMesh2D.ts#L143)

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

Defined in: [src/display/mesh/Mesh.ts:959](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L959)

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

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:821](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L821)

Sets shadow receiving for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | Whether to receive (default: false) |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.setReceiveShadowRecursively`

***

***

### setRotation()

Sets the rotation angle (in degrees) of the 2D object.

#### Param

**value**

Rotation angle (in degrees)

#### Call Signature

> **setRotation**(`value`): `void`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:157](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/mixInMesh2D.ts#L157)

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

Defined in: [src/display/mesh/Mesh.ts:983](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L983)

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

***

### setScale()

Sets the X and Y scale of the 2D object. If `y` is omitted, it is set to the same value as `x`.

#### Param

**x**

X-axis scale

#### Param

**y**

Y-axis scale (defaults to `x` if omitted)

#### Call Signature

> **setScale**(`x`, `y?`): `void`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:126](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/mixInMesh2D.ts#L126)

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

Defined in: [src/display/mesh/Mesh.ts:935](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L935)

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

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L213)

Swaps the order (indices) of two child objects within the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | First child object |
| `child2` | [`Mesh`](Mesh.md) | Second child object |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.swapChildren`

***

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:239](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L239)

Swaps the child objects at the two specified indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | First index |
| `index2` | `number` | Second index |

#### Returns

`void`

#### Inherited from

`BaseTextField2D.swapChildrenAt`

***

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:199](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L199)

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

`BaseTextField2D.worldToLocal`

</details>
