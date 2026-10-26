[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / AView

# Abstract Class: AView

Defined in: [src/display/view/core/AView.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L30)

`View3D` 및 `View2D`의 공통 기반이 되는 추상 클래스입니다.

`Scene`, `Camera`, `PickingManager`, 디버깅 도구(`Grid`, `Axis`), 안티앨리어싱(`TAA`, `FXAA`) 등 뷰포트 공통 기능을 관리합니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`ViewTransform`](ViewTransform.md)

## Extended by

- [`View3D`](../../../classes/View3D.md)

## Constructors



***

### Constructor

> `protected` **new AView**(`redGPUContext`, `scene`, `camera`, `name?`): `AView`

Defined in: [src/display/view/core/AView.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L59)

`AView` 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `scene` | [`Scene`](../../../classes/Scene.md) | 렌더링할 Scene 인스턴스 |
| `camera` | [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md) | 뷰에서 사용할 카메라 또는 컨트롤러 인스턴스 |
| `name?` | `string` | 뷰 이름 (선택) |

#### Returns

`AView`

#### Overrides

[`ViewTransform`](ViewTransform.md).[`constructor`](ViewTransform.md#constructor)

## Properties



## Accessors



***

### axis

#### Get Signature

> **get** **axis**(): [`DrawDebuggerAxis`](../../DrawDebugger/classes/DrawDebuggerAxis.md)

Defined in: [src/display/view/core/AView.ts:185](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L185)

디버깅용 축(`DrawDebuggerAxis`) 객체를 반환하거나 설정합니다. (`boolean` 전달 시 자동 생성/해제)

##### Returns

[`DrawDebuggerAxis`](../../DrawDebugger/classes/DrawDebuggerAxis.md)

`DrawDebuggerAxis` 인스턴스

#### Set Signature

> **set** **axis**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:189](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L189)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerAxis`](../../DrawDebugger/classes/DrawDebuggerAxis.md) |

##### Returns

`void`

***

***

### distanceCulling

#### Get Signature

> **get** **distanceCulling**(): `number`

Defined in: [src/display/view/core/AView.ts:144](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L144)

거리 기반 컬링의 기준 거리를 반환하거나 설정합니다.

##### Returns

`number`

기준 거리

#### Set Signature

> **set** **distanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L148)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### fxaa

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **fxaa**(): [`FXAA`](../../../../Antialiasing/classes/FXAA.md)

Defined in: [src/display/view/core/AView.ts:210](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L210)

FXAA 안티앨리어싱 객체를 반환합니다.

##### Returns

[`FXAA`](../../../../Antialiasing/classes/FXAA.md)

`FXAA` 인스턴스

***

***

### grid

#### Get Signature

> **get** **grid**(): [`DrawDebuggerGrid`](../../DrawDebugger/classes/DrawDebuggerGrid.md)

Defined in: [src/display/view/core/AView.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L160)

디버깅용 그리드(`DrawDebuggerGrid`) 객체를 반환하거나 설정합니다. (`boolean` 전달 시 자동 생성/해제)

##### Returns

[`DrawDebuggerGrid`](../../DrawDebugger/classes/DrawDebuggerGrid.md)

`DrawDebuggerGrid` 인스턴스

#### Set Signature

> **set** **grid**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:164](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L164)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerGrid`](../../DrawDebugger/classes/DrawDebuggerGrid.md) |

##### Returns

`void`

***

***

### pickingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingManager**(): [`PickingManager`](../../../../Picking/classes/PickingManager.md)

Defined in: [src/display/view/core/AView.ts:100](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L100)

마우스 좌표 기반 객체 선택을 관리하는 `PickingManager`를 반환합니다.

##### Returns

[`PickingManager`](../../../../Picking/classes/PickingManager.md)

`PickingManager` 인스턴스

***

***

### scene

#### Get Signature

> **get** **scene**(): [`Scene`](../../../classes/Scene.md)

Defined in: [src/display/view/core/AView.ts:83](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L83)

현재 뷰에 연결된 `Scene` 객체를 반환하거나 설정합니다.

##### Throws

`Scene` 인스턴스가 아닌 값을 설정할 경우 예외 발생

##### Returns

[`Scene`](../../../classes/Scene.md)

`Scene` 인스턴스

#### Set Signature

> **set** **scene**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:87](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L87)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Scene`](../../../classes/Scene.md) |

##### Returns

`void`

***

***

### taa

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **taa**(): [`TAA`](../../../../Antialiasing/classes/TAA.md)

Defined in: [src/display/view/core/AView.ts:225](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L225)

TAA 안티앨리어싱 객체를 반환합니다.

##### Returns

[`TAA`](../../../../Antialiasing/classes/TAA.md)

`TAA` 인스턴스

***

***

### useDistanceCulling

#### Get Signature

> **get** **useDistanceCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:128](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L128)

거리 기반 컬링(Distance Culling) 사용 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

거리 기반 컬링 사용 여부

#### Set Signature

> **set** **useDistanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:132](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L132)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useFrustumCulling

#### Get Signature

> **get** **useFrustumCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:112](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L112)

절두체 컬링(Frustum Culling) 사용 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

절두체 컬링 사용 여부

#### Set Signature

> **set** **useFrustumCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L116)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

## Methods



***

### checkMouseInViewBounds()

> **checkMouseInViewBounds**(): `boolean`

Defined in: [src/display/view/core/AView.ts:261](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L261)

마우스 포인터가 현재 뷰의 픽셀 영역 내에 있는지 확인합니다.

#### Returns

`boolean`

마우스가 뷰 영역 내에 있으면 `true`, 아니면 `false`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/view/core/AView.ts:272](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L272)

뷰와 연결된 모든 리소스(카메라 컨트롤러, 씬, 후처리, 디버거, 피킹 매니저)를 해제합니다.

#### Returns

`void`

***

***

### screenToWorld()

> **screenToWorld**(`screenX`, `screenY`): `number`[]

Defined in: [src/display/view/core/AView.ts:246](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/AView.ts#L246)

화면 좌표를 3D 월드 좌표로 변환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | 화면 X 좌표 (픽셀) |
| `screenY` | `number` | 화면 Y 좌표 (픽셀) |

#### Returns

`number`[]

변환된 월드 좌표 (`[x, y, z]`)

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/display/view/core/ViewTransform.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L28)

뷰 크기 변경 시 호출되는 콜백 함수

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<[`ViewTransform`](ViewTransform.md)\> |

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`onResize`](ViewTransform.md#onresize)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`antialiasingManager`](ViewTransform.md#antialiasingmanager)

***

***

### aspect

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **aspect**(): `number`

Defined in: [src/display/view/core/ViewTransform.ts:196](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L196)

뷰포트의 가로세로 비율(종횡비)을 반환합니다.

##### Returns

`number`

뷰포트 종횡비

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`aspect`](ViewTransform.md#aspect)

***

***

### camera

#### Get Signature

> **get** **camera**(): [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md)

Defined in: [src/display/view/core/ViewTransform.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L65)

현재 뷰에 연결된 카메라 또는 컨트롤러를 반환하거나 설정합니다.

##### Returns

[`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md)

연결된 카메라 또는 컨트롤러 인스턴스

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L69)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md) |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`camera`](ViewTransform.md#camera)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`commandEncoderManager`](ViewTransform.md#commandencodermanager)

***

***

### frustumPlanes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frustumPlanes**(): `number`[][]

Defined in: [src/display/view/core/ViewTransform.ts:208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L208)

현재 투영 행렬과 뷰 행렬을 기반으로 계산된 6개의 뷰 프러스텀 평면 배열을 반환합니다.

##### Returns

`number`[][]

프러스텀 평면 배열

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`frustumPlanes`](ViewTransform.md#frustumplanes)

***

***

### frustumPlanesFlat

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frustumPlanesFlat**(): `Float32Array`

Defined in: [src/display/view/core/ViewTransform.ts:221](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L221)

현재 투영 행렬과 뷰 행렬을 기반으로 계산된 1차원 평탄 프러스텀 평면 버퍼(`Float32Array(24)`)를 반환합니다.

##### Returns

`Float32Array`

24개 float으로 구성된 1차원 프러스텀 평면 버퍼

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`frustumPlanesFlat`](ViewTransform.md#frustumplanesflat)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`gpuDevice`](ViewTransform.md#gpudevice)

***

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:134](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L134)

뷰의 높이(픽셀 또는 백분율 문자열)를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

뷰의 높이

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:138](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L138)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`height`](ViewTransform.md#height)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`instanceId`](ViewTransform.md#instanceid)

***

***

### inverseProjectionMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **inverseProjectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:321](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L321)

현재 투영 행렬의 역행렬을 계산하여 반환합니다.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

역투영 행렬

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`inverseProjectionMatrix`](ViewTransform.md#inverseprojectionmatrix)

***

***

### jitterOffset

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **jitterOffset**(): \[`number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:333](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L333)

현재 적용된 픽셀 지터 오프셋(`[offsetX, offsetY]`)을 반환합니다.

##### Returns

\[`number`, `number`\]

지터 오프셋 튜플

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`jitterOffset`](ViewTransform.md#jitteroffset)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

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

[`ViewTransform`](ViewTransform.md).[`name`](ViewTransform.md#name)

***

***

### noneJitterProjectionMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **noneJitterProjectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:246](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L246)

TAA 지터(Jitter)가 적용되지 않은 원본 투영 행렬을 반환합니다.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

지터가 배제된 투영 행렬

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`noneJitterProjectionMatrix`](ViewTransform.md#nonejitterprojectionmatrix)

***

***

### pixelRectArray

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L150)

물리 픽셀 단위의 사각형 배열(`[x, y, width, height]`)을 반환합니다.

##### Returns

\[`number`, `number`, `number`, `number`\]

물리 픽셀 사각형 배열

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`pixelRectArray`](ViewTransform.md#pixelrectarray)

***

***

### pixelRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:162](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L162)

물리 픽셀 단위의 사각형 정보 객체(`{ x, y, width, height }`)를 반환합니다.

##### Returns

`object`

물리 픽셀 사각형 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:167](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L167) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:166](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L166) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:164](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L164) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:165](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L165) |

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`pixelRectObject`](ViewTransform.md#pixelrectobject)

***

***

### projectionMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **projectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:295](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L295)

TAA 활성화 여부에 따라 지터 오프셋이 반영된 최종 투영 행렬을 반환합니다.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

최종 투영 행렬

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`projectionMatrix`](ViewTransform.md#projectionmatrix)

***

***

### rawCamera

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rawCamera**(): [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md)

Defined in: [src/display/view/core/ViewTransform.ts:234](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L234)

실제 렌더링에 사용되는 내부 카메라 인스턴스를 반환합니다. (`AController`가 연결된 경우 제어 대상 카메라 반환)

##### Returns

[`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md)

내부 카메라 인스턴스

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`rawCamera`](ViewTransform.md#rawcamera)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`redGPUContext`](ViewTransform.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`resourceManager`](ViewTransform.md#resourcemanager)

***

***

### screenRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **screenRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:179](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L179)

`devicePixelRatio`가 반영된 CSS 스크린 기준 사각형 정보 객체를 반환합니다.

##### Returns

`object`

스크린 기준 사각형 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L184) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:183](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L183) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:181](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L181) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:182](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L182) |

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`screenRectObject`](ViewTransform.md#screenrectobject)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`uuid`](ViewTransform.md#uuid)

***

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:118](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L118)

뷰의 너비(픽셀 또는 백분율 문자열)를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

뷰의 너비

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:122](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L122)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`width`](ViewTransform.md#width)

***

***

### x

#### Get Signature

> **get** **x**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L86)

뷰의 X 좌표(픽셀 또는 백분율 문자열)를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

뷰의 X 좌표

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L90)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`x`](ViewTransform.md#x)

***

***

### y

#### Get Signature

> **get** **y**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L102)

뷰의 Y 좌표(픽셀 또는 백분율 문자열)를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

뷰의 Y 좌표

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:106](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L106)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`y`](ViewTransform.md#y)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### clearJitterOffset()

> **clearJitterOffset**(): `void`

Defined in: [src/display/view/core/ViewTransform.ts:357](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L357)

지터 오프셋을 `[0, 0]`으로 초기화합니다.

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`clearJitterOffset`](ViewTransform.md#clearjitteroffset)

***

***

### setJitterOffset()

> **setJitterOffset**(`offsetX`, `offsetY`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:348](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L348)

TAA 연산을 위한 서브픽셀 지터 오프셋을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offsetX` | `number` | X축 지터 오프셋 |
| `offsetY` | `number` | Y축 지터 오프셋 |

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`setJitterOffset`](ViewTransform.md#setjitteroffset)

***

***

### setPosition()

> **setPosition**(`x?`, `y?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:380](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L380)

뷰의 위치(X, Y)를 설정하고 물리 픽셀 영역 좌표를 갱신합니다.

#### Example
```typescript
// 픽셀 또는 퍼센트 단위로 뷰 위치 지정
view.setPosition(100, '50%');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x?` | `string` \| `number` | X 좌표 (픽셀 수치 또는 백분율 문자열) |
| `y?` | `string` \| `number` | Y 좌표 (픽셀 수치 또는 백분율 문자열) |

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`setPosition`](ViewTransform.md#setposition)

***

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:411](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L411)

뷰의 크기(너비, 높이)를 설정하고 물리 픽셀 영역을 갱신하며, `onResize` 콜백이 등록되어 있으면 호출합니다.

#### Example
```typescript
// 픽셀 또는 퍼센트 단위로 뷰 크기 지정
view.setSize('100%', '100%');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w?` | `string` \| `number` | 너비 (픽셀 수치 또는 백분율 문자열) |
| `h?` | `string` \| `number` | 높이 (픽셀 수치 또는 백분율 문자열) |

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`setSize`](ViewTransform.md#setsize)

</details>
