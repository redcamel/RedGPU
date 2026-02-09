[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / ViewTransform

# Class: ViewTransform

Defined in: [src/display/view/core/ViewTransform.ts:27](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L27)

View3D/View2D의 크기와 위치를 관리하는 클래스입니다.


카메라 타입을 받아 해당 카메라에 맞는 투영 행렬을 생성하고, 화면 내 위치 및 크기(pixel rect) 등을 계산하는 기능을 담당합니다.


::: warning
이 클래스는 시스템 내부적으로 사용되는 기본 클래스입니다.<br/>직접 인스턴스를 생성하지 마십시오.

:::

## Extended by

- [`AView`](AView.md)

## Constructors

### Constructor

> **new ViewTransform**(`redGPUContext`): `ViewTransform`

Defined in: [src/display/view/core/ViewTransform.ts:106](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L106)

ViewTransform 생성자.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | 유효한 RedGPUContext 인스턴스 |

#### Returns

`ViewTransform`

## Properties

### onResize()

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/display/view/core/ViewTransform.ts:32](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L32)

뷰 크기 변경 시 호출되는 콜백입니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<`ViewTransform`\> |

#### Returns

`void`

## Accessors

### aspect

#### Get Signature

> **get** **aspect**(): `number`

Defined in: [src/display/view/core/ViewTransform.ts:243](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L243)

현재 뷰의 종횡비(가로/세로)를 반환합니다.

##### Returns

`number`

***

### camera

#### Get Signature

> **get** **camera**(): [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md)

Defined in: [src/display/view/core/ViewTransform.ts:124](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L124)

현재 연결된 카메라를 반환합니다.

##### Returns

[`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md)

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:133](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L133)

카메라를 설정합니다. 허용되는 타입은 PerspectiveCamera, OrthographicCamera, AController, Camera2D 입니다.
잘못된 타입이 들어오면 오류를 발생시킵니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md) |  |

##### Returns

`void`

***

### frustumPlanes

#### Get Signature

> **get** **frustumPlanes**(): `number`[][]

Defined in: [src/display/view/core/ViewTransform.ts:252](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L252)

현재 프로젝션 및 카메라 모델 행렬을 기반으로 뷰 프러스텀 평면을 계산하여 반환합니다.
AController 인스턴스 사용 시 내부 카메라의 modelMatrix를 사용합니다.

##### Returns

`number`[][]

프러스텀 평면 배열

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:190](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L190)

뷰의 높이 값을 반환합니다 (픽셀 또는 퍼센트 문자열).

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:198](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L198)

뷰의 높이를 설정합니다. 내부적으로 setSize를 호출합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` |  |

##### Returns

`void`

***

### inverseProjectionMatrix

#### Get Signature

> **get** **inverseProjectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:346](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L346)

현재 프로젝션 행렬의 역행렬을 반환합니다.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

역행렬 (계산 실패 시 null)

***

### jitterOffset

#### Get Signature

> **get** **jitterOffset**(): \[`number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:354](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L354)

현재 적용된 지터 오프셋 [offsetX, offsetY]를 반환합니다.

##### Returns

\[`number`, `number`\]

***

### noneJitterProjectionMatrix

#### Get Signature

> **get** **noneJitterProjectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:275](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L275)

지터가 적용되지 않은 원본 프로젝션 행렬을 계산하여 반환합니다.
Orthographic, Camera2D, Perspective 각각의 방식으로 행렬을 구성합니다.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:206](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L206)

픽셀 단위 사각형 배열을 반환합니다. [x, y, width, height]

##### Returns

\[`number`, `number`, `number`, `number`\]

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:214](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L214)

픽셀 단위 사각형을 객체 형태로 반환합니다.

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:219](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L219) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:218](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L218) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:216](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L216) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:217](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L217) |

***

### projectionMatrix

#### Get Signature

> **get** **projectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:321](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L321)

현재 프로젝션 행렬(지터 적용 여부를 반영)을 반환합니다.
TAA 사용 시 PerspectiveCamera에 한해 지터 오프셋을 적용합니다.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

***

### rawCamera

#### Get Signature

> **get** **rawCamera**(): [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md)

Defined in: [src/display/view/core/ViewTransform.ts:265](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L265)

내부에 연결된 실제 카메라 인스턴스(PerspectiveCamera 또는 Camera2D)를 반환합니다.
AController가 연결된 경우 내부 camera를 반환합니다.

##### Returns

[`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/display/view/core/ViewTransform.ts:116](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L116)

연결된 RedGPUContext 반환 (읽기 전용).

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:230](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L230)

스크린 기준 사각형을 반환합니다 (devicePixelRatio로 나눔).

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:235](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L235) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:234](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L234) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:232](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L232) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:233](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L233) |

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:174](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L174)

뷰의 너비 값을 반환합니다 (픽셀 또는 퍼센트 문자열).

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:182](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L182)

뷰의 너비를 설정합니다. 내부적으로 setSize를 호출합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` |  |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:142](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L142)

뷰의 X 위치 값을 반환합니다 (픽셀 또는 퍼센트 문자열).

##### Returns

`string` \| `number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:150](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L150)

뷰의 X 위치를 설정합니다. 내부적으로 setPosition을 호출합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` |  |

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:158](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L158)

뷰의 Y 위치 값을 반환합니다 (픽셀 또는 퍼센트 문자열).

##### Returns

`string` \| `number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:166](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L166)

뷰의 Y 위치를 설정합니다. 내부적으로 setPosition을 호출합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` |  |

##### Returns

`void`

## Methods

### clearJitterOffset()

> **clearJitterOffset**(): `void`

Defined in: [src/display/view/core/ViewTransform.ts:371](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L371)

지터 오프셋을 초기화합니다.

#### Returns

`void`

***

### setJitterOffset()

> **setJitterOffset**(`offsetX`, `offsetY`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:363](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L363)

TAA 적용을 위한 지터 오프셋을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offsetX` | `number` | X축 지터 오프셋 (정규화된 값) |
| `offsetY` | `number` | Y축 지터 오프셋 (정규화된 값) |

#### Returns

`void`

***

### setPosition()

> **setPosition**(`x?`, `y?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:382](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L382)

뷰의 위치를 설정하고 내부 픽셀 사각형을 업데이트합니다.
입력 값은 픽셀 또는 퍼센트 문자열을 허용합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x?` | `string` \| `number` | X 위치 (픽셀 또는 퍼센트) |
| `y?` | `string` \| `number` | Y 위치 (픽셀 또는 퍼센트) |

#### Returns

`void`

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:402](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/display/view/core/ViewTransform.ts#L402)

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
