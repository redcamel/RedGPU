[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / View3D

# Class: View3D

Defined in: [src/display/view/View3D.ts:58](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L58)

View class for 3D rendering.

Represents a unit of rendering that draws a 3D scene, owning a Scene, Camera, IBL, SkyBox, PostEffectManager, ToneMappingManager, etc.

### Example
```typescript
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.ObitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
redGPUContext.addView(view);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/view/singleView/" ></iframe>

## See

 - [singleView Example](https://redcamel.github.io/RedGPU/examples/3d/view/singleView/)
 - [multiView Example](https://redcamel.github.io/RedGPU/examples/3d/view/multiView/)

## Extends

- [`AView`](../namespaces/CoreView/classes/AView.md)

## Extended by

- [`View2D`](View2D.md)

## Constructors

### Constructor

> **new View3D**(`redGPUContext`, `scene`, `camera`, `name?`): `View3D`

Defined in: [src/display/view/View3D.ts:98](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L98)

Creates a new View3D instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `scene` | [`Scene`](Scene.md) | Scene to render in the view |
| `camera` | [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md) | Camera controller to use in the view |
| `name?` | `string` | Optional name of the view |

#### Returns

`View3D`

#### Overrides

[`AView`](../namespaces/CoreView/classes/AView.md).[`constructor`](../namespaces/CoreView/classes/AView.md#constructor)

## Properties

### basicRenderBundleEncoderDescriptor

#### Get Signature

> **get** **basicRenderBundleEncoderDescriptor**(): `GPURenderBundleEncoderDescriptor`

Defined in: [src/display/view/View3D.ts:240](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L240)

Returns the basic render bundle encoder descriptor.

##### Returns

`GPURenderBundleEncoderDescriptor`

***

### clusterLightManager

#### Get Signature

> **get** **clusterLightManager**(): `ClusterLightManager`

Defined in: [src/display/view/View3D.ts:115](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L115)

Returns the cluster light manager.

##### Returns

`ClusterLightManager`

***

### ibl

#### Get Signature

> **get** **ibl**(): [`IBL`](../../Resource/classes/IBL.md)

Defined in: [src/display/view/View3D.ts:155](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L155)

Returns the currently configured IBL (Image-Based Lighting) object.

##### Returns

[`IBL`](../../Resource/classes/IBL.md)

#### Set Signature

> **set** **ibl**(`value`): `void`

Defined in: [src/display/view/View3D.ts:166](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L166)

Sets the IBL (Image-Based Lighting) object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`IBL`](../../Resource/classes/IBL.md) | IBL instance to set |

##### Returns

`void`

***

### noneJitterProjectionViewMatrix

#### Get Signature

> **get** **noneJitterProjectionViewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/View3D.ts:254](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L254)

Returns the projection view matrix with jitter excluded.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

***

### postEffectManager

#### Get Signature

> **get** **postEffectManager**(): [`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)

Defined in: [src/display/view/View3D.ts:174](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L174)

Returns the post effect manager.

##### Returns

[`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)

***

### prevNoneJitterProjectionViewMatrix

#### Get Signature

> **get** **prevNoneJitterProjectionViewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/View3D.ts:262](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L262)

Returns the projection view matrix from the previous frame with jitter excluded.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

***

### renderViewStateData

#### Get Signature

> **get** **renderViewStateData**(): [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md)

Defined in: [src/display/view/View3D.ts:190](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L190)

Returns the rendering state data for tracking.

##### Returns

[`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md)

***

### skyAtmosphere

#### Get Signature

> **get** **skyAtmosphere**(): [`SkyAtmosphere`](SkyAtmosphere.md)

Defined in: [src/display/view/View3D.ts:221](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L221)

Returns the sky atmosphere object.

##### Returns

[`SkyAtmosphere`](SkyAtmosphere.md)

#### Set Signature

> **set** **skyAtmosphere**(`value`): `void`

Defined in: [src/display/view/View3D.ts:232](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L232)

Sets the sky atmosphere object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SkyAtmosphere`](SkyAtmosphere.md) | Sky atmosphere instance to set |

##### Returns

`void`

***

### skybox

#### Get Signature

> **get** **skybox**(): [`SkyBox`](SkyBox.md)

Defined in: [src/display/view/View3D.ts:198](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L198)

Returns the skybox object.

##### Returns

[`SkyBox`](SkyBox.md)

#### Set Signature

> **set** **skybox**(`value`): `void`

Defined in: [src/display/view/View3D.ts:209](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L209)

Sets the skybox object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SkyBox`](SkyBox.md) | Skybox instance to set |

##### Returns

`void`

***

### systemUniform\_Vertex\_StructInfo

#### Get Signature

> **get** **systemUniform\_Vertex\_StructInfo**(): `any`

Defined in: [src/display/view/View3D.ts:131](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L131)

Returns the system vertex globalStruct structure information.

##### Returns

`any`

***

### systemUniform\_Vertex\_UniformBindGroup

#### Get Signature

> **get** **systemUniform\_Vertex\_UniformBindGroup**(): `GPUBindGroup`

Defined in: [src/display/view/View3D.ts:139](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L139)

Returns the system vertex globalStruct bind group.

##### Returns

`GPUBindGroup`

***

### systemUniform\_Vertex\_UniformBuffer

#### Get Signature

> **get** **systemUniform\_Vertex\_UniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/view/View3D.ts:147](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L147)

Returns the system vertex globalStruct buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

***

### toneMappingManager

#### Get Signature

> **get** **toneMappingManager**(): [`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)

Defined in: [src/display/view/View3D.ts:182](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L182)

Returns the tone mapping manager.

##### Returns

[`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)

***

### viewRenderTextureManager

#### Get Signature

> **get** **viewRenderTextureManager**(): [`ViewRenderTextureManager`](../namespaces/CoreView/classes/ViewRenderTextureManager.md)

Defined in: [src/display/view/View3D.ts:123](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L123)

Returns the view render texture manager.

##### Returns

[`ViewRenderTextureManager`](../namespaces/CoreView/classes/ViewRenderTextureManager.md)

***

### update()

> **update**(`shadowRender?`, `calcPointLightCluster?`, `renderPath1ResultTextureView?`): `void`

Defined in: [src/display/view/View3D.ts:279](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/View3D.ts#L279)

Updates view and lighting data every frame.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `shadowRender` | `boolean` | `false` | Whether it is a shadow map generation render pass |
| `calcPointLightCluster` | `boolean` | `false` | Whether to calculate point light cluster |
| `renderPath1ResultTextureView?` | `GPUTextureView` | `undefined` | Render path 1 stage result texture view |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`instanceId`](../namespaces/CoreView/classes/AView.md#instanceid)

***

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/display/view/core/ViewTransform.ts:31](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L31)

Callback function called when the view size changes

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<[`ViewTransform`](../namespaces/CoreView/classes/ViewTransform.md)\> |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`onResize`](../namespaces/CoreView/classes/AView.md#onresize)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`antialiasingManager`](../namespaces/CoreView/classes/AView.md#antialiasingmanager)

***

### aspect

#### Get Signature

> **get** **aspect**(): `number`

Defined in: [src/display/view/core/ViewTransform.ts:232](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L232)

Returns the aspect ratio (width/height) of the current view.

##### Returns

`number`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`aspect`](../namespaces/CoreView/classes/AView.md#aspect)

***

### axis

#### Get Signature

> **get** **axis**(): [`DrawDebuggerAxis`](../namespaces/drawDebugger/classes/DrawDebuggerAxis.md)

Defined in: [src/display/view/core/AView.ts:226](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L226)

Returns the axis object for debugging.

##### Returns

[`DrawDebuggerAxis`](../namespaces/drawDebugger/classes/DrawDebuggerAxis.md)

#### Set Signature

> **set** **axis**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:237](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L237)

Sets the axis for debugging.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerAxis`](../namespaces/drawDebugger/classes/DrawDebuggerAxis.md) | boolean or DrawDebuggerAxis instance |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`axis`](../namespaces/CoreView/classes/AView.md#axis)

***

### camera

#### Get Signature

> **get** **camera**(): [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md)

Defined in: [src/display/view/core/ViewTransform.ts:99](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L99)

Returns the currently connected camera.

##### Returns

[`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md)

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:113](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L113)

Sets the camera. Must be one of PerspectiveCamera, OrthographicCamera, AController, or Camera2D.

##### Throws

Throws error if camera type is not supported

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md) | Camera instance to connect |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`camera`](../namespaces/CoreView/classes/AView.md#camera)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`commandEncoderManager`](../namespaces/CoreView/classes/AView.md#commandencodermanager)

***

### distanceCulling

#### Get Signature

> **get** **distanceCulling**(): `number`

Defined in: [src/display/view/core/AView.ts:179](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L179)

Returns the threshold distance for distance-based culling.

##### Returns

`number`

#### Set Signature

> **set** **distanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:190](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L190)

Sets the threshold distance for distance-based culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Distance value |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`distanceCulling`](../namespaces/CoreView/classes/AView.md#distanceculling)

***

### frustumPlanes

#### Get Signature

> **get** **frustumPlanes**(): `number`[][]

Defined in: [src/display/view/core/ViewTransform.ts:243](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L243)

Calculates and returns the view frustum planes based on the current projection and camera view matrices.

##### Returns

`number`[][]

Frustum planes array

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`frustumPlanes`](../namespaces/CoreView/classes/AView.md#frustumplanes)

***

### fxaa

#### Get Signature

> **get** **fxaa**(): [`FXAA`](../../Antialiasing/classes/FXAA.md)

Defined in: [src/display/view/core/AView.ts:257](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L257)

Returns the FXAA post-effect object.

##### Returns

[`FXAA`](../../Antialiasing/classes/FXAA.md)

FXAA instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`fxaa`](../namespaces/CoreView/classes/AView.md#fxaa)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`gpuDevice`](../namespaces/CoreView/classes/AView.md#gpudevice)

***

### grid

#### Get Signature

> **get** **grid**(): [`DrawDebuggerGrid`](../namespaces/drawDebugger/classes/DrawDebuggerGrid.md)

Defined in: [src/display/view/core/AView.ts:198](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L198)

Returns the grid object for debugging.

##### Returns

[`DrawDebuggerGrid`](../namespaces/drawDebugger/classes/DrawDebuggerGrid.md)

#### Set Signature

> **set** **grid**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:209](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L209)

Sets the grid for debugging.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerGrid`](../namespaces/drawDebugger/classes/DrawDebuggerGrid.md) | boolean or DrawDebuggerGrid instance |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`grid`](../namespaces/CoreView/classes/AView.md#grid)

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:179](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L179)

Returns the height value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:190](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L190)

Sets the height of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Height value to set |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`height`](../namespaces/CoreView/classes/AView.md#height)

***

### inverseProjectionMatrix

#### Get Signature

> **get** **inverseProjectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:330](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L330)

Computes and returns the inverse projection matrix.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`inverseProjectionMatrix`](../namespaces/CoreView/classes/AView.md#inverseprojectionmatrix)

***

### jitterOffset

#### Get Signature

> **get** **jitterOffset**(): \[`number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:338](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L338)

Returns the currently configured jitter offset [offsetX, offsetY].

##### Returns

\[`number`, `number`\]

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`jitterOffset`](../namespaces/CoreView/classes/AView.md#jitteroffset)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`name`](../namespaces/CoreView/classes/AView.md#name)

***

### noneJitterProjectionMatrix

#### Get Signature

> **get** **noneJitterProjectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:263](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L263)

Returns the original projection matrix with jitter excluded.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`noneJitterProjectionMatrix`](../namespaces/CoreView/classes/AView.md#nonejitterprojectionmatrix)

***

### pickingManager

#### Get Signature

> **get** **pickingManager**(): [`PickingManager`](../../Picking/classes/PickingManager.md)

Defined in: [src/display/view/core/AView.ts:133](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L133)

Returns the PickingManager for mouse coordinate-based object selection.

##### Returns

[`PickingManager`](../../Picking/classes/PickingManager.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pickingManager`](../namespaces/CoreView/classes/AView.md#pickingmanager)

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:198](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L198)

Returns the rectangle array in pixels. ([x, y, width, height])

##### Returns

\[`number`, `number`, `number`, `number`\]

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pixelRectArray`](../namespaces/CoreView/classes/AView.md#pixelrectarray)

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:206](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L206)

Returns the pixel rectangle in object form. ({ x, y, width, height })

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:211](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L211) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:210](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L210) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:208](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L208) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:209](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L209) |

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pixelRectObject`](../namespaces/CoreView/classes/AView.md#pixelrectobject)

***

### projectionMatrix

#### Get Signature

> **get** **projectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:308](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L308)

Returns the final projection matrix reflecting the jitter offset. (Applied only to PerspectiveCamera when TAA is enabled)

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`projectionMatrix`](../namespaces/CoreView/classes/AView.md#projectionmatrix)

***

### rawCamera

#### Get Signature

> **get** **rawCamera**(): [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md)

Defined in: [src/display/view/core/ViewTransform.ts:255](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L255)

Returns the raw camera instance referenced internally. (Returns internal camera if AController is linked)

##### Returns

[`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`rawCamera`](../namespaces/CoreView/classes/AView.md#rawcamera)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`redGPUContext`](../namespaces/CoreView/classes/AView.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`resourceManager`](../namespaces/CoreView/classes/AView.md#resourcemanager)

***

### scene

#### Get Signature

> **get** **scene**(): [`Scene`](Scene.md)

Defined in: [src/display/view/core/AView.ts:110](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L110)

Returns the Scene object connected to the current view.

##### Returns

[`Scene`](Scene.md)

#### Set Signature

> **set** **scene**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:124](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L124)

Sets the Scene for the view.

##### Throws

Throws error if not a Scene instance

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Scene`](Scene.md) | Scene instance |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`scene`](../namespaces/CoreView/classes/AView.md#scene)

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:219](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L219)

Returns the screen-relative rectangle object scaled by dividing by devicePixelRatio.

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:224](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L224) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:223](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L223) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:221](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L221) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:222](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L222) |

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`screenRectObject`](../namespaces/CoreView/classes/AView.md#screenrectobject)

***

### taa

#### Get Signature

> **get** **taa**(): [`TAA`](../../Antialiasing/classes/TAA.md)

Defined in: [src/display/view/core/AView.ts:271](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L271)

Returns the TAA post-effect object.

##### Returns

[`TAA`](../../Antialiasing/classes/TAA.md)

TAA instance

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`taa`](../namespaces/CoreView/classes/AView.md#taa)

***

### useDistanceCulling

#### Get Signature

> **get** **useDistanceCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:160](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L160)

Returns whether to use distance-based culling.

##### Returns

`boolean`

#### Set Signature

> **set** **useDistanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:171](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L171)

Sets whether to use distance-based culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`useDistanceCulling`](../namespaces/CoreView/classes/AView.md#usedistanceculling)

***

### useFrustumCulling

#### Get Signature

> **get** **useFrustumCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:141](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L141)

Returns whether to use frustum culling.

##### Returns

`boolean`

#### Set Signature

> **set** **useFrustumCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:152](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L152)

Sets whether to use frustum culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`useFrustumCulling`](../namespaces/CoreView/classes/AView.md#usefrustumculling)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`uuid`](../namespaces/CoreView/classes/AView.md#uuid)

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:160](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L160)

Returns the width value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:171](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L171)

Sets the width of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Width value to set |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`width`](../namespaces/CoreView/classes/AView.md#width)

***

### x

#### Get Signature

> **get** **x**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:122](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L122)

Returns the X position value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:133](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L133)

Sets the X position of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | X position value to set |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`x`](../namespaces/CoreView/classes/AView.md#x)

***

### y

#### Get Signature

> **get** **y**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:141](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L141)

Returns the Y position value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:152](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L152)

Sets the Y position of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Y position value to set |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`y`](../namespaces/CoreView/classes/AView.md#y)

## Methods

### checkMouseInViewBounds()

> **checkMouseInViewBounds**(): `boolean`

Defined in: [src/display/view/core/AView.ts:305](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L305)

Checks if the mouse pointer is within the pixel area of the current view.

#### Returns

`boolean`

True if the mouse is inside the view bounds, otherwise false

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`checkMouseInViewBounds`](../namespaces/CoreView/classes/AView.md#checkmouseinviewbounds)

***

### clearJitterOffset()

> **clearJitterOffset**(): `void`

Defined in: [src/display/view/core/ViewTransform.ts:361](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L361)

Clears and resets the jitter offset to 0.

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`clearJitterOffset`](../namespaces/CoreView/classes/AView.md#clearjitteroffset)

***

### screenToWorld()

> **screenToWorld**(`screenX`, `screenY`): `number`[]

Defined in: [src/display/view/core/AView.ts:291](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/AView.ts#L291)

Converts screen coordinates to world coordinates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate |
| `screenY` | `number` | Screen Y coordinate |

#### Returns

`number`[]

Converted world coordinates (3D vector array)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`screenToWorld`](../namespaces/CoreView/classes/AView.md#screentoworld)

***

### setJitterOffset()

> **setJitterOffset**(`offsetX`, `offsetY`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:352](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L352)

Sets the render pixel jitter offset for TAA calculations.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offsetX` | `number` | X-axis jitter offset value |
| `offsetY` | `number` | Y-axis jitter offset value |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setJitterOffset`](../namespaces/CoreView/classes/AView.md#setjitteroffset)

***

### setPosition()

> **setPosition**(`x?`, `y?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:376](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L376)

Sets the position (X, Y) of the view and updates physical pixel rectangle values considering DPI.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `string` \| `number` | X position to set (pixel number or percentage string, default: current X) |
| `y` | `string` \| `number` | Y position to set (pixel number or percentage string, default: current Y) |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setPosition`](../namespaces/CoreView/classes/AView.md#setposition)

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:399](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/display/view/core/ViewTransform.ts#L399)

Sets the size (width, height) of the view and updates internal physical pixel rectangle values. Triggers onResize callback if registered.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | `string` \| `number` | Width to set (pixel number or percentage string, default: current width) |
| `h` | `string` \| `number` | Height to set (pixel number or percentage string, default: current height) |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setSize`](../namespaces/CoreView/classes/AView.md#setsize)

***


</details>
