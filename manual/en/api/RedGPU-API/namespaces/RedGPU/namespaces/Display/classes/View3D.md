[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / View3D

# Class: View3D

Defined in: [src/display/view/View3D.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L57)

View class for 3D rendering.

Represents a rendering unit that draws a 3D scene, owning `Scene`, `Camera`, `IBL`, `SkyBox`, `PostEffectManager`, `ToneMappingManager`, etc.

***

### Example
```typescript
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.ObitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
redGPUContext.addView(view);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/view/singleView/" style="width:100%; height:500px;"></iframe>

## See

- [singleView Example](https://redcamel.github.io/RedGPU/examples/3d/view/singleView/)
 - [multiView Example](https://redcamel.github.io/RedGPU/examples/3d/view/multiView/)

## Extends

- [`AView`](../namespaces/CoreView/classes/AView.md)

## Extended by

- [`View2D`](View2D.md)

## Constructors



***

### Constructor

> **new View3D**(`redGPUContext`, `scene`, `camera`, `name?`): `View3D`

Defined in: [src/display/view/View3D.ts:111](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L111)

Creates a `View3D` instance.

#### Example
```typescript
const view = new RedGPU.Display.View3D(redGPUContext, scene, camera, 'Main3DView');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `scene` | [`Scene`](Scene.md) | Scene to render in the view |
| `camera` | [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md) | Camera or controller to use in the view |
| `name?` | `string` | View name (optional) |

#### Returns

`View3D`

#### Overrides

[`AView`](../namespaces/CoreView/classes/AView.md).[`constructor`](../namespaces/CoreView/classes/AView.md#constructor)

## Properties



## Accessors



***

### basicRenderBundleEncoderDescriptor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **basicRenderBundleEncoderDescriptor**(): `GPURenderBundleEncoderDescriptor`

Defined in: [src/display/view/View3D.ts:311](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L311)

Returns the basic render bundle encoder descriptor.

##### Returns

`GPURenderBundleEncoderDescriptor`

`GPURenderBundleEncoderDescriptor` object

***

***

### clusterLightManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **clusterLightManager**(): [`ClusterLightManager`](../../Light/namespaces/Core/namespaces/ClusterLight/classes/ClusterLightManager.md)

Defined in: [src/display/view/View3D.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L148)

Returns the cluster light manager.

##### Returns

[`ClusterLightManager`](../../Light/namespaces/Core/namespaces/ClusterLight/classes/ClusterLightManager.md)

`ClusterLightManager` instance

***

***

### currentCascadeIndex

#### Get Signature

> **get** **currentCascadeIndex**(): `number`

Defined in: [src/display/view/View3D.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L184)

Returns or sets the CSM cascade index (0 to 3) currently being rendered.

##### Returns

`number`

Current cascade index or `undefined`

#### Set Signature

> **set** **currentCascadeIndex**(`value`): `void`

Defined in: [src/display/view/View3D.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L188)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### hierarchicalZBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hierarchicalZBuffer**(): `HierarchicalZBuffer`

Defined in: [src/display/view/View3D.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L136)

Returns the Hierarchical Z-Buffer (HZB) global pyramid instance.

##### Returns

`HierarchicalZBuffer`

`HierarchicalZBuffer` instance

***

***

### ibl

#### Get Signature

> **get** **ibl**(): [`IBL`](../../Resource/classes/IBL.md)

Defined in: [src/display/view/View3D.ts:227](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L227)

Returns or sets the Image-Based Lighting (IBL) object.

##### Returns

[`IBL`](../../Resource/classes/IBL.md)

`IBL` instance

#### Set Signature

> **set** **ibl**(`value`): `void`

Defined in: [src/display/view/View3D.ts:243](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L243)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`IBL`](../../Resource/classes/IBL.md) |

##### Returns

`void`

***

***

### noneJitterProjectionViewMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **noneJitterProjectionViewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/View3D.ts:333](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L333)

Returns the projection view matrix without jitter.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

Projection view matrix (`mat4`)

***

***

### postEffectManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **postEffectManager**(): [`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)

Defined in: [src/display/view/View3D.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L239)

Returns the post-effect manager.

##### Returns

[`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)

`PostEffectManager` instance

***

***

### prevNoneJitterProjectionViewMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prevNoneJitterProjectionViewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/View3D.ts:345](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L345)

Returns the projection view matrix without jitter from the previous frame.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

Previous frame projection view matrix (`mat4`)

***

***

### renderViewStateData

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderViewStateData**(): [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md)

Defined in: [src/display/view/View3D.ts:267](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L267)

Returns the view rendering state data.

##### Returns

[`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md)

`RenderViewStateData` instance

***

***

### skyAtmosphere

#### Get Signature

> **get** **skyAtmosphere**(): [`SkyAtmosphere`](SkyAtmosphere.md)

Defined in: [src/display/view/View3D.ts:291](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L291)

Returns or sets the `SkyAtmosphere` object.

##### Returns

[`SkyAtmosphere`](SkyAtmosphere.md)

`SkyAtmosphere` instance

#### Set Signature

> **set** **skyAtmosphere**(`value`): `void`

Defined in: [src/display/view/View3D.ts:321](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L321)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`SkyAtmosphere`](SkyAtmosphere.md) |

##### Returns

`void`

***

***

### skybox

#### Get Signature

> **get** **skybox**(): [`SkyBox`](SkyBox.md)

Defined in: [src/display/view/View3D.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L279)

Returns or sets the skybox object.

##### Returns

[`SkyBox`](SkyBox.md)

`SkyBox` instance

#### Set Signature

> **set** **skybox**(`value`): `void`

Defined in: [src/display/view/View3D.ts:295](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L295)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`SkyBox`](SkyBox.md) |

##### Returns

`void`

***

***

### systemUniform\_Vertex\_StructInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **systemUniform\_Vertex\_StructInfo**(): `any`

Defined in: [src/display/view/View3D.ts:172](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L172)

Returns the structure information of the system vertex uniform.

##### Returns

`any`

System uniform structure information

***

***

### systemUniform\_Vertex\_UniformBindGroup

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **systemUniform\_Vertex\_UniformBindGroup**(): `GPUBindGroup`

Defined in: [src/display/view/View3D.ts:200](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L200)

Returns the system vertex uniform bind group. Returns the corresponding cascade bind group during cascade rendering.

##### Returns

`GPUBindGroup`

System uniform `GPUBindGroup`

***

***

### systemUniform\_Vertex\_UniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **systemUniform\_Vertex\_UniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/view/View3D.ts:215](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L215)

Returns the system vertex uniform buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

`UniformBuffer` instance

***

***

### toneMappingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **toneMappingManager**(): [`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)

Defined in: [src/display/view/View3D.ts:255](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L255)

Returns the tone mapping manager.

##### Returns

[`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)

`ToneMappingManager` instance

***

***

### viewRenderTextureManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewRenderTextureManager**(): [`ViewRenderTextureManager`](../namespaces/CoreView/classes/ViewRenderTextureManager.md)

Defined in: [src/display/view/View3D.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L160)

Returns the view render texture manager.

##### Returns

[`ViewRenderTextureManager`](../namespaces/CoreView/classes/ViewRenderTextureManager.md)

`ViewRenderTextureManager` instance

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/view/View3D.ts:368](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L368)

Destroys all GPU resources and sub-managers associated with the view.

#### Returns

`void`

#### Overrides

[`AView`](../namespaces/CoreView/classes/AView.md).[`destroy`](../namespaces/CoreView/classes/AView.md#destroy)

***

***

### getCascadeUniformBindGroup()

> **getCascadeUniformBindGroup**(`cascadeIndex`): `GPUBindGroup`

Defined in: [src/display/view/View3D.ts:360](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L360)

Returns the system vertex uniform bind group corresponding to the specified cascade index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cascadeIndex` | `number` | Cascade index (0 to 3) |

#### Returns

`GPUBindGroup`

System uniform `GPUBindGroup`

***

***

### update()

> **update**(`renderPath1ResultTextureView?`, `renderPath1DepthTextureView?`): `void`

Defined in: [src/display/view/View3D.ts:422](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L422)

Updates the view's system uniform and bind group state every frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderPath1ResultTextureView?` | `GPUTextureView` | Render path 1 result texture view (optional) |
| `renderPath1DepthTextureView?` | `GPUTextureView` | Render path 1 depth result texture view (optional) |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/display/view/core/ViewTransform.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L28)

Callback function invoked when the view size changes

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<[`ViewTransform`](../namespaces/CoreView/classes/ViewTransform.md)\> |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`onResize`](../namespaces/CoreView/classes/AView.md#onresize)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`antialiasingManager`](../namespaces/CoreView/classes/AView.md#antialiasingmanager)

***

***

### aspect

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **aspect**(): `number`

Defined in: [src/display/view/core/ViewTransform.ts:196](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L196)

Returns the aspect ratio (width / height) of the viewport.

##### Returns

`number`

Viewport aspect ratio

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`aspect`](../namespaces/CoreView/classes/AView.md#aspect)

***

***

### axis

#### Get Signature

> **get** **axis**(): [`DrawDebuggerAxis`](../namespaces/DrawDebugger/classes/DrawDebuggerAxis.md)

Defined in: [src/display/view/core/AView.ts:185](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L185)

Returns or sets the debugging axis (`DrawDebuggerAxis`) object. (Automatically creates/clears when a `boolean` is passed)

##### Returns

[`DrawDebuggerAxis`](../namespaces/DrawDebugger/classes/DrawDebuggerAxis.md)

`DrawDebuggerAxis` instance

#### Set Signature

> **set** **axis**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:189](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L189)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerAxis`](../namespaces/DrawDebugger/classes/DrawDebuggerAxis.md) |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`axis`](../namespaces/CoreView/classes/AView.md#axis)

***

***

### camera

#### Get Signature

> **get** **camera**(): [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md)

Defined in: [src/display/view/core/ViewTransform.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L65)

Gets or sets the camera or controller connected to the current view.

##### Returns

[`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md)

Connected camera or controller instance

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L69)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md) |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`camera`](../namespaces/CoreView/classes/AView.md#camera)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`commandEncoderManager`](../namespaces/CoreView/classes/AView.md#commandencodermanager)

***

***

### distanceCulling

#### Get Signature

> **get** **distanceCulling**(): `number`

Defined in: [src/display/view/core/AView.ts:144](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L144)

Returns or sets the threshold distance for distance-based culling.

##### Returns

`number`

Threshold distance

#### Set Signature

> **set** **distanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L148)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`distanceCulling`](../namespaces/CoreView/classes/AView.md#distanceculling)

***

***

### frustumPlanes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frustumPlanes**(): `number`[][]

Defined in: [src/display/view/core/ViewTransform.ts:208](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L208)

Returns the array of 6 view frustum planes calculated from the current projection and view matrices.

##### Returns

`number`[][]

Frustum planes array

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`frustumPlanes`](../namespaces/CoreView/classes/AView.md#frustumplanes)

***

***

### frustumPlanesFlat

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frustumPlanesFlat**(): `Float32Array`

Defined in: [src/display/view/core/ViewTransform.ts:221](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L221)

Returns the 1D flattened frustum planes buffer (`Float32Array(24)`) calculated from the current projection and view matrices.

##### Returns

`Float32Array`

1D frustum planes buffer of 24 floats

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`frustumPlanesFlat`](../namespaces/CoreView/classes/AView.md#frustumplanesflat)

***

***

### fxaa

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **fxaa**(): [`FXAA`](../../Antialiasing/classes/FXAA.md)

Defined in: [src/display/view/core/AView.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L210)

Returns the FXAA anti-aliasing object.

##### Returns

[`FXAA`](../../Antialiasing/classes/FXAA.md)

`FXAA` instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`fxaa`](../namespaces/CoreView/classes/AView.md#fxaa)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`gpuDevice`](../namespaces/CoreView/classes/AView.md#gpudevice)

***

***

### grid

#### Get Signature

> **get** **grid**(): [`DrawDebuggerGrid`](../namespaces/DrawDebugger/classes/DrawDebuggerGrid.md)

Defined in: [src/display/view/core/AView.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L160)

Returns or sets the debugging grid (`DrawDebuggerGrid`) object. (Automatically creates/clears when a `boolean` is passed)

##### Returns

[`DrawDebuggerGrid`](../namespaces/DrawDebugger/classes/DrawDebuggerGrid.md)

`DrawDebuggerGrid` instance

#### Set Signature

> **set** **grid**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:164](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L164)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerGrid`](../namespaces/DrawDebugger/classes/DrawDebuggerGrid.md) |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`grid`](../namespaces/CoreView/classes/AView.md#grid)

***

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:134](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L134)

Gets or sets the height (pixels or percentage string) of the view.

##### Returns

`string` \| `number`

Height of the view

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:138](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L138)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`height`](../namespaces/CoreView/classes/AView.md#height)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`instanceId`](../namespaces/CoreView/classes/AView.md#instanceid)

***

***

### inverseProjectionMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **inverseProjectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:321](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L321)

Computes and returns the inverse of the current projection matrix.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

Inverse projection matrix

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`inverseProjectionMatrix`](../namespaces/CoreView/classes/AView.md#inverseprojectionmatrix)

***

***

### jitterOffset

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **jitterOffset**(): \[`number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:333](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L333)

Returns the currently applied pixel jitter offset (`[offsetX, offsetY]`).

##### Returns

\[`number`, `number`\]

Jitter offset tuple

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`jitterOffset`](../namespaces/CoreView/classes/AView.md#jitteroffset)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

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

[`AView`](../namespaces/CoreView/classes/AView.md).[`name`](../namespaces/CoreView/classes/AView.md#name)

***

***

### noneJitterProjectionMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **noneJitterProjectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:246](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L246)

Returns the original projection matrix without TAA jitter applied.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

Projection matrix without jitter

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`noneJitterProjectionMatrix`](../namespaces/CoreView/classes/AView.md#nonejitterprojectionmatrix)

***

***

### pickingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingManager**(): [`PickingManager`](../../Picking/classes/PickingManager.md)

Defined in: [src/display/view/core/AView.ts:100](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L100)

Returns the `PickingManager` that manages mouse coordinate-based object selection.

##### Returns

[`PickingManager`](../../Picking/classes/PickingManager.md)

`PickingManager` instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pickingManager`](../namespaces/CoreView/classes/AView.md#pickingmanager)

***

***

### pixelRectArray

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L150)

Returns the rectangle array in physical pixels (`[x, y, width, height]`).

##### Returns

\[`number`, `number`, `number`, `number`\]

Physical pixel rectangle array

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pixelRectArray`](../namespaces/CoreView/classes/AView.md#pixelrectarray)

***

***

### pixelRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:162](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L162)

Returns the rectangle information object in physical pixels (`{ x, y, width, height }`).

##### Returns

`object`

Physical pixel rectangle object

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:167](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L167) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L166) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:164](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L164) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:165](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L165) |

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pixelRectObject`](../namespaces/CoreView/classes/AView.md#pixelrectobject)

***

***

### projectionMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **projectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:295](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L295)

Returns the final projection matrix reflecting the jitter offset depending on whether TAA is enabled.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

Final projection matrix

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`projectionMatrix`](../namespaces/CoreView/classes/AView.md#projectionmatrix)

***

***

### rawCamera

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rawCamera**(): [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md)

Defined in: [src/display/view/core/ViewTransform.ts:234](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L234)

Returns the raw camera instance used for actual rendering. (Returns the controlled camera if an `AController` is connected)

##### Returns

[`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md)

Raw camera instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`rawCamera`](../namespaces/CoreView/classes/AView.md#rawcamera)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`redGPUContext`](../namespaces/CoreView/classes/AView.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`resourceManager`](../namespaces/CoreView/classes/AView.md#resourcemanager)

***

***

### scene

#### Get Signature

> **get** **scene**(): [`Scene`](Scene.md)

Defined in: [src/display/view/core/AView.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L83)

Returns or sets the `Scene` object connected to the current view.

##### Throws

Throws an error if the value is not a `Scene` instance

##### Returns

[`Scene`](Scene.md)

`Scene` instance

#### Set Signature

> **set** **scene**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:87](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L87)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Scene`](Scene.md) |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`scene`](../namespaces/CoreView/classes/AView.md#scene)

***

***

### screenRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **screenRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:179](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L179)

Returns the CSS screen-relative rectangle information object scaled by `devicePixelRatio`.

##### Returns

`object`

Screen-relative rectangle object

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L184) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:183](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L183) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:181](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L181) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:182](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L182) |

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`screenRectObject`](../namespaces/CoreView/classes/AView.md#screenrectobject)

***

***

### taa

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **taa**(): [`TAA`](../../Antialiasing/classes/TAA.md)

Defined in: [src/display/view/core/AView.ts:225](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L225)

Returns the TAA anti-aliasing object.

##### Returns

[`TAA`](../../Antialiasing/classes/TAA.md)

`TAA` instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`taa`](../namespaces/CoreView/classes/AView.md#taa)

***

***

### useDistanceCulling

#### Get Signature

> **get** **useDistanceCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:128](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L128)

Returns or sets whether distance-based culling is enabled.

##### Returns

`boolean`

Whether distance-based culling is enabled

#### Set Signature

> **set** **useDistanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:132](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L132)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`useDistanceCulling`](../namespaces/CoreView/classes/AView.md#usedistanceculling)

***

***

### useFrustumCulling

#### Get Signature

> **get** **useFrustumCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:112](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L112)

Returns or sets whether frustum culling is enabled.

##### Returns

`boolean`

Whether frustum culling is enabled

#### Set Signature

> **set** **useFrustumCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L116)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`useFrustumCulling`](../namespaces/CoreView/classes/AView.md#usefrustumculling)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`uuid`](../namespaces/CoreView/classes/AView.md#uuid)

***

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:118](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L118)

Gets or sets the width (pixels or percentage string) of the view.

##### Returns

`string` \| `number`

Width of the view

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:122](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L122)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`width`](../namespaces/CoreView/classes/AView.md#width)

***

***

### x

#### Get Signature

> **get** **x**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L86)

Gets or sets the X coordinate (pixels or percentage string) of the view.

##### Returns

`string` \| `number`

X coordinate of the view

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L90)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`x`](../namespaces/CoreView/classes/AView.md#x)

***

***

### y

#### Get Signature

> **get** **y**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L102)

Gets or sets the Y coordinate (pixels or percentage string) of the view.

##### Returns

`string` \| `number`

Y coordinate of the view

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L106)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`y`](../namespaces/CoreView/classes/AView.md#y)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### checkMouseInViewBounds()

> **checkMouseInViewBounds**(): `boolean`

Defined in: [src/display/view/core/AView.ts:261](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L261)

Checks if the mouse pointer is within the pixel bounds of the current view.

#### Returns

`boolean`

`true` if the mouse is inside the view bounds, otherwise `false`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`checkMouseInViewBounds`](../namespaces/CoreView/classes/AView.md#checkmouseinviewbounds)

***

***

### clearJitterOffset()

> **clearJitterOffset**(): `void`

Defined in: [src/display/view/core/ViewTransform.ts:357](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L357)

Resets the jitter offset to `[0, 0]`.

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`clearJitterOffset`](../namespaces/CoreView/classes/AView.md#clearjitteroffset)

***

***

### screenToWorld()

> **screenToWorld**(`screenX`, `screenY`): `number`[]

Defined in: [src/display/view/core/AView.ts:246](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L246)

Converts screen coordinates to 3D world coordinates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate (pixels) |
| `screenY` | `number` | Screen Y coordinate (pixels) |

#### Returns

`number`[]

Converted world coordinates (`[x, y, z]`)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`screenToWorld`](../namespaces/CoreView/classes/AView.md#screentoworld)

***

***

### setJitterOffset()

> **setJitterOffset**(`offsetX`, `offsetY`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:348](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L348)

Sets the sub-pixel jitter offset for TAA calculations.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offsetX` | `number` | X-axis jitter offset |
| `offsetY` | `number` | Y-axis jitter offset |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setJitterOffset`](../namespaces/CoreView/classes/AView.md#setjitteroffset)

***

***

### setPosition()

> **setPosition**(`x?`, `y?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:380](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L380)

Sets the position (X, Y) of the view and updates the physical pixel rectangle coordinates.

#### Example
```typescript
// Set view position in pixels or percentage
view.setPosition(100, '50%');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x?` | `string` \| `number` | X coordinate (pixel number or percentage string) |
| `y?` | `string` \| `number` | Y coordinate (pixel number or percentage string) |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setPosition`](../namespaces/CoreView/classes/AView.md#setposition)

***

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:411](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L411)

Sets the size (width, height) of the view, updates the physical pixel rectangle, and invokes the `onResize` callback if registered.

#### Example
```typescript
// Set view size in pixels or percentage
view.setSize('100%', '100%');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w?` | `string` \| `number` | Width (pixel number or percentage string) |
| `h?` | `string` \| `number` | Height (pixel number or percentage string) |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setSize`](../namespaces/CoreView/classes/AView.md#setsize)

***

</details>
