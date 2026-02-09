[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / View3D

# Class: View3D

Defined in: [src/display/view/View3D.ts:60](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L60)


View class for 3D rendering.


Extends AView to handle 3D scene rendering, lighting, shadows, post-effects, and IBL (Image-Based Lighting) processing.

* ### Example
```typescript
// RedGPU.init 콜백 내부 (Inside RedGPU.init callback)
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.RedObitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);

view.grid = true;
redGPUContext.addView(view);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/view/singleView/" ></iframe>


Below is a list of additional sample examples to help understand the structure and operation of View3D.

## See

[Multi View3D example](https://redcamel.github.io/RedGPU/examples/3d/view/multiView/)

## Extends

- [`AView`](../namespaces/CoreView/classes/AView.md)

## Extended by

- [`View2D`](View2D.md)

## Constructors

### Constructor

> **new View3D**(`redGPUContext`, `scene`, `camera`, `name?`): `View3D`

Defined in: [src/display/view/View3D.ts:190](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L190)


Creates a View3D instance.

Initializes all components (lights, post-effects, resource management) needed for 3D rendering.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | WebGPU context for rendering tasks |
| `scene` | [`Scene`](Scene.md) | 3D scene to render |
| `camera` | [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md) | Camera controller (3D or 2D camera) |
| `name?` | `string` | Optional name identifier for the view |

#### Returns

`View3D`

#### Overrides

[`AView`](../namespaces/CoreView/classes/AView.md).[`constructor`](../namespaces/CoreView/classes/AView.md#constructor)

## Properties

### onResize()

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/display/view/core/ViewTransform.ts:32](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L32)

뷰 크기 변경 시 호출되는 콜백입니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<[`ViewTransform`](../namespaces/CoreView/classes/ViewTransform.md)\> |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`onResize`](../namespaces/CoreView/classes/AView.md#onresize)

## Accessors

### aspect

#### Get Signature

> **get** **aspect**(): `number`

Defined in: [src/display/view/core/ViewTransform.ts:243](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L243)

현재 뷰의 종횡비(가로/세로)를 반환합니다.

##### Returns

`number`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`aspect`](../namespaces/CoreView/classes/AView.md#aspect)

***

### axis

#### Get Signature

> **get** **axis**(): `DrawDebuggerAxis`

Defined in: [src/display/view/core/AView.ts:249](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L249)


Returns the axis object for debugging.

##### Returns

`DrawDebuggerAxis`

#### Set Signature

> **set** **axis**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:260](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L260)


Sets the axis for debugging.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` \| `DrawDebuggerAxis` | boolean or DrawDebuggerAxis instance |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`axis`](../namespaces/CoreView/classes/AView.md#axis)

***

### basicRenderBundleEncoderDescriptor

#### Get Signature

> **get** **basicRenderBundleEncoderDescriptor**(): `GPURenderBundleEncoderDescriptor`

Defined in: [src/display/view/View3D.ts:314](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L314)

##### Returns

`GPURenderBundleEncoderDescriptor`

***

### camera

#### Get Signature

> **get** **camera**(): [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md)

Defined in: [src/display/view/core/ViewTransform.ts:124](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L124)

현재 연결된 카메라를 반환합니다.

##### Returns

[`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md)

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:133](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L133)

카메라를 설정합니다. 허용되는 타입은 PerspectiveCamera, OrthographicCamera, AController, Camera2D 입니다.
잘못된 타입이 들어오면 오류를 발생시킵니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md) |  |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`camera`](../namespaces/CoreView/classes/AView.md#camera)

***

### distanceCulling

#### Get Signature

> **get** **distanceCulling**(): `number`

Defined in: [src/display/view/core/AView.ts:202](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L202)


Returns the threshold distance for distance-based culling.

##### Returns

`number`

#### Set Signature

> **set** **distanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:213](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L213)


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

Defined in: [src/display/view/core/ViewTransform.ts:252](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L252)

현재 프로젝션 및 카메라 모델 행렬을 기반으로 뷰 프러스텀 평면을 계산하여 반환합니다.
AController 인스턴스 사용 시 내부 카메라의 modelMatrix를 사용합니다.

##### Returns

`number`[][]

프러스텀 평면 배열

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`frustumPlanes`](../namespaces/CoreView/classes/AView.md#frustumplanes)

***

### fxaa

#### Get Signature

> **get** **fxaa**(): [`FXAA`](../../Antialiasing/classes/FXAA.md)

Defined in: [src/display/view/core/AView.ts:277](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L277)


Returns the FXAA post-effect object.

##### Returns

[`FXAA`](../../Antialiasing/classes/FXAA.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`fxaa`](../namespaces/CoreView/classes/AView.md#fxaa)

***

### grid

#### Get Signature

> **get** **grid**(): `DrawDebuggerGrid`

Defined in: [src/display/view/core/AView.ts:221](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L221)


Returns the grid object for debugging.

##### Returns

`DrawDebuggerGrid`

#### Set Signature

> **set** **grid**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:232](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L232)


Sets the grid for debugging.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` \| `DrawDebuggerGrid` | boolean or DrawDebuggerGrid instance |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`grid`](../namespaces/CoreView/classes/AView.md#grid)

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:190](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L190)

뷰의 높이 값을 반환합니다 (픽셀 또는 퍼센트 문자열).

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:198](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L198)

뷰의 높이를 설정합니다. 내부적으로 setSize를 호출합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` |  |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`height`](../namespaces/CoreView/classes/AView.md#height)

***

### ibl

#### Get Signature

> **get** **ibl**(): [`IBL`](../../Resource/classes/IBL.md)

Defined in: [src/display/view/View3D.ts:247](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L247)


Returns the IBL (Image-Based Lighting) settings.

##### Returns

[`IBL`](../../Resource/classes/IBL.md)

#### Set Signature

> **set** **ibl**(`value`): `void`

Defined in: [src/display/view/View3D.ts:258](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L258)


Sets the IBL (Image-Based Lighting) settings.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`IBL`](../../Resource/classes/IBL.md) | IBL instance to set |

##### Returns

`void`

***

### inverseProjectionMatrix

#### Get Signature

> **get** **inverseProjectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:346](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L346)

현재 프로젝션 행렬의 역행렬을 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

역행렬 (계산 실패 시 null)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`inverseProjectionMatrix`](../namespaces/CoreView/classes/AView.md#inverseprojectionmatrix)

***

### jitterOffset

#### Get Signature

> **get** **jitterOffset**(): \[`number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:354](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L354)

현재 적용된 지터 오프셋 [offsetX, offsetY]를 반환합니다.

##### Returns

\[`number`, `number`\]

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`jitterOffset`](../namespaces/CoreView/classes/AView.md#jitteroffset)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/display/view/core/AView.ts:113](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L113)


Returns the name of the view.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:125](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L125)


Sets the name of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name string to set |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`name`](../namespaces/CoreView/classes/AView.md#name)

***

### noneJitterProjectionCameraMatrix

#### Get Signature

> **get** **noneJitterProjectionCameraMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/View3D.ts:324](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L324)

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

***

### noneJitterProjectionMatrix

#### Get Signature

> **get** **noneJitterProjectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:275](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L275)

지터가 적용되지 않은 원본 프로젝션 행렬을 계산하여 반환합니다.
Orthographic, Camera2D, Perspective 각각의 방식으로 행렬을 구성합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`noneJitterProjectionMatrix`](../namespaces/CoreView/classes/AView.md#nonejitterprojectionmatrix)

***

### passLightClustersBound

#### Get Signature

> **get** **passLightClustersBound**(): `PassClusterLightBound`

Defined in: [src/display/view/View3D.ts:239](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L239)


Returns the cluster light boundary pass.

##### Returns

`PassClusterLightBound`

***

### pickingManager

#### Get Signature

> **get** **pickingManager**(): [`PickingManager`](../../Picking/classes/PickingManager.md)

Defined in: [src/display/view/core/AView.ts:156](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L156)


Returns the PickingManager for mouse coordinate-based object selection.

##### Returns

[`PickingManager`](../../Picking/classes/PickingManager.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pickingManager`](../namespaces/CoreView/classes/AView.md#pickingmanager)

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:206](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L206)

픽셀 단위 사각형 배열을 반환합니다. [x, y, width, height]

##### Returns

\[`number`, `number`, `number`, `number`\]

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pixelRectArray`](../namespaces/CoreView/classes/AView.md#pixelrectarray)

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:214](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L214)

픽셀 단위 사각형을 객체 형태로 반환합니다.

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:219](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L219) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:218](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L218) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:216](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L216) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:217](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L217) |

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pixelRectObject`](../namespaces/CoreView/classes/AView.md#pixelrectobject)

***

### postEffectManager

#### Get Signature

> **get** **postEffectManager**(): [`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)

Defined in: [src/display/view/View3D.ts:266](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L266)


Returns the post-effect manager.

##### Returns

[`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)

***

### projectionMatrix

#### Get Signature

> **get** **projectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:321](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L321)

현재 프로젝션 행렬(지터 적용 여부를 반영)을 반환합니다.
TAA 사용 시 PerspectiveCamera에 한해 지터 오프셋을 적용합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`projectionMatrix`](../namespaces/CoreView/classes/AView.md#projectionmatrix)

***

### rawCamera

#### Get Signature

> **get** **rawCamera**(): [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md)

Defined in: [src/display/view/core/ViewTransform.ts:265](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L265)

내부에 연결된 실제 카메라 인스턴스(PerspectiveCamera 또는 Camera2D)를 반환합니다.
AController가 연결된 경우 내부 camera를 반환합니다.

##### Returns

[`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`rawCamera`](../namespaces/CoreView/classes/AView.md#rawcamera)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/view/core/ViewTransform.ts:116](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L116)

연결된 RedGPUContext 반환 (읽기 전용).

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`redGPUContext`](../namespaces/CoreView/classes/AView.md#redgpucontext)

***

### renderViewStateData

#### Get Signature

> **get** **renderViewStateData**(): [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md)

Defined in: [src/display/view/View3D.ts:283](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L283)


Returns the render state data.

##### Returns

[`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md)

***

### scene

#### Get Signature

> **get** **scene**(): [`Scene`](Scene.md)

Defined in: [src/display/view/core/AView.ts:133](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L133)


Returns the Scene object connected to the current view.

##### Returns

[`Scene`](Scene.md)

#### Set Signature

> **set** **scene**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:147](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L147)


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

Defined in: [src/display/view/core/ViewTransform.ts:230](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L230)

스크린 기준 사각형을 반환합니다 (devicePixelRatio로 나눔).

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:235](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L235) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:234](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L234) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:232](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L232) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:233](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L233) |

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`screenRectObject`](../namespaces/CoreView/classes/AView.md#screenrectobject)

***

### skybox

#### Get Signature

> **get** **skybox**(): [`SkyBox`](SkyBox.md)

Defined in: [src/display/view/View3D.ts:291](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L291)


Returns the skybox.

##### Returns

[`SkyBox`](SkyBox.md)

#### Set Signature

> **set** **skybox**(`value`): `void`

Defined in: [src/display/view/View3D.ts:304](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L304)


Sets the skybox.

Manages resource states of previous textures and replaces them with new ones.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SkyBox`](SkyBox.md) | SkyBox instance to set |

##### Returns

`void`

***

### systemUniform\_Vertex\_StructInfo

#### Get Signature

> **get** **systemUniform\_Vertex\_StructInfo**(): `any`

Defined in: [src/display/view/View3D.ts:215](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L215)


Returns system uniform structure information for vertex shaders.

##### Returns

`any`

***

### systemUniform\_Vertex\_UniformBindGroup

#### Get Signature

> **get** **systemUniform\_Vertex\_UniformBindGroup**(): `GPUBindGroup`

Defined in: [src/display/view/View3D.ts:223](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L223)


Returns the GPU bind group for vertex shader system uniforms.

##### Returns

`GPUBindGroup`

***

### systemUniform\_Vertex\_UniformBuffer

#### Get Signature

> **get** **systemUniform\_Vertex\_UniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/view/View3D.ts:231](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L231)


Returns the UniformBuffer instance for vertex shader system uniforms.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

***

### taa

#### Get Signature

> **get** **taa**(): [`TAA`](../../Antialiasing/classes/TAA.md)

Defined in: [src/display/view/core/AView.ts:288](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L288)


Returns the TAA post-effect object.

##### Returns

[`TAA`](../../Antialiasing/classes/TAA.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`taa`](../namespaces/CoreView/classes/AView.md#taa)

***

### toneMappingManager

#### Get Signature

> **get** **toneMappingManager**(): [`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)

Defined in: [src/display/view/View3D.ts:275](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L275)


Returns the tone mapping manager.

##### Returns

[`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)

***

### useDistanceCulling

#### Get Signature

> **get** **useDistanceCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:183](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L183)


Returns whether to use distance-based culling.

##### Returns

`boolean`

#### Set Signature

> **set** **useDistanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:194](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L194)


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

Defined in: [src/display/view/core/AView.ts:164](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L164)


Returns whether to use frustum culling.

##### Returns

`boolean`

#### Set Signature

> **set** **useFrustumCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:175](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L175)


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

### viewRenderTextureManager

#### Get Signature

> **get** **viewRenderTextureManager**(): [`ViewRenderTextureManager`](../namespaces/CoreView/classes/ViewRenderTextureManager.md)

Defined in: [src/display/view/View3D.ts:207](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L207)


Returns the ViewRenderTextureManager instance.

##### Returns

[`ViewRenderTextureManager`](../namespaces/CoreView/classes/ViewRenderTextureManager.md)

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:174](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L174)

뷰의 너비 값을 반환합니다 (픽셀 또는 퍼센트 문자열).

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:182](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L182)

뷰의 너비를 설정합니다. 내부적으로 setSize를 호출합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` |  |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`width`](../namespaces/CoreView/classes/AView.md#width)

***

### x

#### Get Signature

> **get** **x**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:142](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L142)

뷰의 X 위치 값을 반환합니다 (픽셀 또는 퍼센트 문자열).

##### Returns

`string` \| `number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:150](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L150)

뷰의 X 위치를 설정합니다. 내부적으로 setPosition을 호출합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` |  |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`x`](../namespaces/CoreView/classes/AView.md#x)

***

### y

#### Get Signature

> **get** **y**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:158](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L158)

뷰의 Y 위치 값을 반환합니다 (픽셀 또는 퍼센트 문자열).

##### Returns

`string` \| `number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:166](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L166)

뷰의 Y 위치를 설정합니다. 내부적으로 setPosition을 호출합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` |  |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`y`](../namespaces/CoreView/classes/AView.md#y)

## Methods

### checkMouseInViewBounds()

> **checkMouseInViewBounds**(): `boolean`

Defined in: [src/display/view/core/AView.ts:322](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L322)


Checks if the mouse is within the pixel area of the current view.

#### Returns

`boolean`


Whether it is contained

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`checkMouseInViewBounds`](../namespaces/CoreView/classes/AView.md#checkmouseinviewbounds)

***

### clearJitterOffset()

> **clearJitterOffset**(): `void`

Defined in: [src/display/view/core/ViewTransform.ts:371](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L371)

지터 오프셋을 초기화합니다.

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`clearJitterOffset`](../namespaces/CoreView/classes/AView.md#clearjitteroffset)

***

### screenToWorld()

> **screenToWorld**(`screenX`, `screenY`): `number`[]

Defined in: [src/display/view/core/AView.ts:308](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/AView.ts#L308)


Converts screen coordinates to world coordinates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate |
| `screenY` | `number` | Screen Y coordinate |

#### Returns

`number`[]


Converted world coordinates

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`screenToWorld`](../namespaces/CoreView/classes/AView.md#screentoworld)

***

### setJitterOffset()

> **setJitterOffset**(`offsetX`, `offsetY`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:363](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L363)

TAA 적용을 위한 지터 오프셋을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offsetX` | `number` | X축 지터 오프셋 (정규화된 값) |
| `offsetY` | `number` | Y축 지터 오프셋 (정규화된 값) |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setJitterOffset`](../namespaces/CoreView/classes/AView.md#setjitteroffset)

***

### setPosition()

> **setPosition**(`x?`, `y?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:382](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L382)

뷰의 위치를 설정하고 내부 픽셀 사각형을 업데이트합니다.
입력 값은 픽셀 또는 퍼센트 문자열을 허용합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x?` | `string` \| `number` | X 위치 (픽셀 또는 퍼센트) |
| `y?` | `string` \| `number` | Y 위치 (픽셀 또는 퍼센트) |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setPosition`](../namespaces/CoreView/classes/AView.md#setposition)

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:402](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/core/ViewTransform.ts#L402)

뷰의 크기를 설정하고 내부 픽셀 사각형을 업데이트합니다.
입력 값은 픽셀 또는 퍼센트 문자열을 허용합니다.
onResize 콜백이 설정되어 있으면 호출합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w?` | `string` \| `number` | 너비 (픽셀 또는 퍼센트) |
| `h?` | `string` \| `number` | 높이 (픽셀 또는 퍼센트) |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setSize`](../namespaces/CoreView/classes/AView.md#setsize)

***

### update()

> **update**(`shadowRender`, `calcPointLightCluster`, `renderPath1ResultTextureView?`): `void`

Defined in: [src/display/view/View3D.ts:344](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/display/view/View3D.ts#L344)


Updates the view and prepares for rendering.

Handles uniform data updates, bind group creation, and cluster light calculations.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `shadowRender` | `boolean` | `false` | Whether to render shadows (default: false) |
| `calcPointLightCluster` | `boolean` | `false` | Whether to calculate point light clusters (default: false) |
| `renderPath1ResultTextureView?` | `GPUTextureView` | `undefined` | Render pass 1 result texture view (optional) |

#### Returns

`void`
