[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / AView

# Abstract Class: AView

Defined in: [src/display/view/core/AView.ts:29](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L29)


Abstract base class that serves as a common foundation for View3D and View2D.


Plays a key role in RedGPU's view system, including Scene, Camera, PickingManager, debugging tools (Grid, Axis), and post-effects (TAA, FXAA).

::: warning

This class is an abstract class used internally by the system.<br/>Do not create instances directly.
:::

## Extends

- [`ViewTransform`](ViewTransform.md)

## Extended by

- [`View3D`](../../../classes/View3D.md)

## Constructors

### Constructor

> **new AView**(`redGPUContext`, `scene`, `camera`, `name?`): `AView`

Defined in: [src/display/view/core/AView.ts:102](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L102)


AView constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md) | RedGPUContext instance |
| `scene` | [`Scene`](../../../classes/Scene.md) | Scene instance |
| `camera` | [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md) | AController or Camera2D instance |
| `name?` | `string` | Optional name |

#### Returns

`AView`

#### Overrides

[`ViewTransform`](ViewTransform.md).[`constructor`](ViewTransform.md#constructor)

## Properties

### onResize()

> **onResize**: (`width`, `height`) => `void` = `null`

Defined in: [src/display/view/core/ViewTransform.ts:32](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L32)

뷰 크기 변경 시 호출되는 콜백입니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`onResize`](ViewTransform.md#onresize)

## Accessors

### aspect

#### Get Signature

> **get** **aspect**(): `number`

Defined in: [src/display/view/core/ViewTransform.ts:243](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L243)

현재 뷰의 종횡비(가로/세로)를 반환합니다.

##### Returns

`number`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`aspect`](ViewTransform.md#aspect)

***

### axis

#### Get Signature

> **get** **axis**(): `DrawDebuggerAxis`

Defined in: [src/display/view/core/AView.ts:249](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L249)


Returns the axis object for debugging.

##### Returns

`DrawDebuggerAxis`

#### Set Signature

> **set** **axis**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:260](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L260)


Sets the axis for debugging.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` \| `DrawDebuggerAxis` | boolean or DrawDebuggerAxis instance |

##### Returns

`void`

***

### camera

#### Get Signature

> **get** **camera**(): [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md)

Defined in: [src/display/view/core/ViewTransform.ts:124](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L124)

현재 연결된 카메라를 반환합니다.

##### Returns

[`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md)

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:133](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L133)

카메라를 설정합니다. 허용되는 타입은 PerspectiveCamera, OrthographicCamera, AController, Camera2D 입니다.
잘못된 타입이 들어오면 오류를 발생시킵니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md) |  |

##### Returns

`void`

#### Inherited from

[`View2D`](../../../classes/View2D.md).[`camera`](../../../classes/View2D.md#camera)

***

### distanceCulling

#### Get Signature

> **get** **distanceCulling**(): `number`

Defined in: [src/display/view/core/AView.ts:202](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L202)


Returns the threshold distance for distance-based culling.

##### Returns

`number`

#### Set Signature

> **set** **distanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:213](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L213)


Sets the threshold distance for distance-based culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Distance value |

##### Returns

`void`

***

### frustumPlanes

#### Get Signature

> **get** **frustumPlanes**(): `number`[][]

Defined in: [src/display/view/core/ViewTransform.ts:252](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L252)

현재 프로젝션 및 카메라 모델 행렬을 기반으로 뷰 프러스텀 평면을 계산하여 반환합니다.
AController 인스턴스 사용 시 내부 카메라의 modelMatrix를 사용합니다.

##### Returns

`number`[][]

프러스텀 평면 배열

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`frustumPlanes`](ViewTransform.md#frustumplanes)

***

### fxaa

#### Get Signature

> **get** **fxaa**(): [`FXAA`](../../../../Antialiasing/classes/FXAA.md)

Defined in: [src/display/view/core/AView.ts:277](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L277)


Returns the FXAA post-effect object.

##### Returns

[`FXAA`](../../../../Antialiasing/classes/FXAA.md)

***

### grid

#### Get Signature

> **get** **grid**(): `DrawDebuggerGrid`

Defined in: [src/display/view/core/AView.ts:221](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L221)


Returns the grid object for debugging.

##### Returns

`DrawDebuggerGrid`

#### Set Signature

> **set** **grid**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:232](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L232)


Sets the grid for debugging.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` \| `DrawDebuggerGrid` | boolean or DrawDebuggerGrid instance |

##### Returns

`void`

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:190](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L190)

뷰의 높이 값을 반환합니다 (픽셀 또는 퍼센트 문자열).

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:198](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L198)

뷰의 높이를 설정합니다. 내부적으로 setSize를 호출합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` |  |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`height`](ViewTransform.md#height)

***

### inverseProjectionMatrix

#### Get Signature

> **get** **inverseProjectionMatrix**(): [`mat4`](../../../../../type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:347](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L347)

현재 프로젝션 행렬의 역행렬을 반환합니다.

##### Returns

[`mat4`](../../../../../type-aliases/mat4.md)

역행렬 (계산 실패 시 null)

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`inverseProjectionMatrix`](ViewTransform.md#inverseprojectionmatrix)

***

### jitterOffset

#### Get Signature

> **get** **jitterOffset**(): \[`number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:355](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L355)

현재 적용된 지터 오프셋 [offsetX, offsetY]를 반환합니다.

##### Returns

\[`number`, `number`\]

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`jitterOffset`](ViewTransform.md#jitteroffset)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/display/view/core/AView.ts:113](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L113)


Returns the name of the view.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:125](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L125)


Sets the name of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name string to set |

##### Returns

`void`

***

### noneJitterProjectionMatrix

#### Get Signature

> **get** **noneJitterProjectionMatrix**(): [`mat4`](../../../../../type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:275](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L275)

지터가 적용되지 않은 원본 프로젝션 행렬을 계산하여 반환합니다.
Orthographic, Camera2D, Perspective 각각의 방식으로 행렬을 구성합니다.

##### Returns

[`mat4`](../../../../../type-aliases/mat4.md)

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`noneJitterProjectionMatrix`](ViewTransform.md#nonejitterprojectionmatrix)

***

### pickingManager

#### Get Signature

> **get** **pickingManager**(): `PickingManager`

Defined in: [src/display/view/core/AView.ts:156](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L156)


Returns the PickingManager for mouse coordinate-based object selection.

##### Returns

`PickingManager`

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:206](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L206)

픽셀 단위 사각형 배열을 반환합니다. [x, y, width, height]

##### Returns

\[`number`, `number`, `number`, `number`\]

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`pixelRectArray`](ViewTransform.md#pixelrectarray)

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:214](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L214)

픽셀 단위 사각형을 객체 형태로 반환합니다.

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:219](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L219) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:218](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L218) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:216](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L216) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:217](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L217) |

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`pixelRectObject`](ViewTransform.md#pixelrectobject)

***

### projectionMatrix

#### Get Signature

> **get** **projectionMatrix**(): [`mat4`](../../../../../type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:322](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L322)

현재 프로젝션 행렬(지터 적용 여부를 반영)을 반환합니다.
TAA 사용 시 PerspectiveCamera에 한해 지터 오프셋을 적용합니다.

##### Returns

[`mat4`](../../../../../type-aliases/mat4.md)

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`projectionMatrix`](ViewTransform.md#projectionmatrix)

***

### rawCamera

#### Get Signature

> **get** **rawCamera**(): [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md)

Defined in: [src/display/view/core/ViewTransform.ts:265](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L265)

내부에 연결된 실제 카메라 인스턴스(PerspectiveCamera 또는 Camera2D)를 반환합니다.
AController가 연결된 경우 내부 camera를 반환합니다.

##### Returns

[`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md)

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`rawCamera`](ViewTransform.md#rawcamera)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/display/view/core/ViewTransform.ts:116](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L116)

연결된 RedGPUContext 반환 (읽기 전용).

##### Returns

[`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md)

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`redGPUContext`](ViewTransform.md#redgpucontext)

***

### scene

#### Get Signature

> **get** **scene**(): [`Scene`](../../../classes/Scene.md)

Defined in: [src/display/view/core/AView.ts:133](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L133)


Returns the Scene object connected to the current view.

##### Returns

[`Scene`](../../../classes/Scene.md)

#### Set Signature

> **set** **scene**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:147](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L147)


Sets the Scene for the view.

##### Throws


Throws error if not a Scene instance

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Scene`](../../../classes/Scene.md) | Scene instance |

##### Returns

`void`

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:230](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L230)

스크린 기준 사각형을 반환합니다 (devicePixelRatio로 나눔).

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:235](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L235) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:234](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L234) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:232](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L232) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:233](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L233) |

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`screenRectObject`](ViewTransform.md#screenrectobject)

***

### taa

#### Get Signature

> **get** **taa**(): [`TAA`](../../../../Antialiasing/classes/TAA.md)

Defined in: [src/display/view/core/AView.ts:288](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L288)


Returns the TAA post-effect object.

##### Returns

[`TAA`](../../../../Antialiasing/classes/TAA.md)

***

### useDistanceCulling

#### Get Signature

> **get** **useDistanceCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:183](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L183)


Returns whether to use distance-based culling.

##### Returns

`boolean`

#### Set Signature

> **set** **useDistanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:194](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L194)


Sets whether to use distance-based culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use |

##### Returns

`void`

***

### useFrustumCulling

#### Get Signature

> **get** **useFrustumCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:164](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L164)


Returns whether to use frustum culling.

##### Returns

`boolean`

#### Set Signature

> **set** **useFrustumCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:175](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L175)


Sets whether to use frustum culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use |

##### Returns

`void`

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:174](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L174)

뷰의 너비 값을 반환합니다 (픽셀 또는 퍼센트 문자열).

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:182](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L182)

뷰의 너비를 설정합니다. 내부적으로 setSize를 호출합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` |  |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`width`](ViewTransform.md#width)

***

### x

#### Get Signature

> **get** **x**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:142](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L142)

뷰의 X 위치 값을 반환합니다 (픽셀 또는 퍼센트 문자열).

##### Returns

`string` \| `number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:150](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L150)

뷰의 X 위치를 설정합니다. 내부적으로 setPosition을 호출합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` |  |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`x`](ViewTransform.md#x)

***

### y

#### Get Signature

> **get** **y**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:158](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L158)

뷰의 Y 위치 값을 반환합니다 (픽셀 또는 퍼센트 문자열).

##### Returns

`string` \| `number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:166](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L166)

뷰의 Y 위치를 설정합니다. 내부적으로 setPosition을 호출합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` |  |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`y`](ViewTransform.md#y)

## Methods

### checkMouseInViewBounds()

> **checkMouseInViewBounds**(): `boolean`

Defined in: [src/display/view/core/AView.ts:322](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L322)


Checks if the mouse is within the pixel area of the current view.

#### Returns

`boolean`


Whether it is contained

***

### clearJitterOffset()

> **clearJitterOffset**(): `void`

Defined in: [src/display/view/core/ViewTransform.ts:372](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L372)

지터 오프셋을 초기화합니다.

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`clearJitterOffset`](ViewTransform.md#clearjitteroffset)

***

### screenToWorld()

> **screenToWorld**(`screenX`, `screenY`): `number`[]

Defined in: [src/display/view/core/AView.ts:308](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/AView.ts#L308)


Converts screen coordinates to world coordinates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate |
| `screenY` | `number` | Screen Y coordinate |

#### Returns

`number`[]


Converted world coordinates

***

### setJitterOffset()

> **setJitterOffset**(`offsetX`, `offsetY`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:364](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L364)

TAA 적용을 위한 지터 오프셋을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offsetX` | `number` | X축 지터 오프셋 (정규화된 값) |
| `offsetY` | `number` | Y축 지터 오프셋 (정규화된 값) |

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`setJitterOffset`](ViewTransform.md#setjitteroffset)

***

### setPosition()

> **setPosition**(`x?`, `y?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:383](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L383)

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

[`ViewTransform`](ViewTransform.md).[`setPosition`](ViewTransform.md#setposition)

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:404](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/view/core/ViewTransform.ts#L404)

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

[`ViewTransform`](ViewTransform.md).[`setSize`](ViewTransform.md#setsize)
