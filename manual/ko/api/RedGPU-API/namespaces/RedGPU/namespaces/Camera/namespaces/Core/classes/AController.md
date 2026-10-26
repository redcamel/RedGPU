[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Camera](../../../README.md) / [Core](../README.md) / AController

# Abstract Class: AController

Defined in: [src/camera/core/AController.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L32)

마우스, 터치, 키보드 입력을 처리하여 카메라(`PerspectiveCamera` 또는 `OrthographicCamera`)를 제어하는 추상 컨트롤러 클래스입니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`FreeController`](../../../classes/FreeController.md)
- [`FollowController`](../../../classes/FollowController.md)
- [`OrbitController`](../../../classes/OrbitController.md)
- [`IsometricController`](../../../classes/IsometricController.md)

## Constructors



***

### Constructor

> **new AController**(`redGPUContext`, `initInfo`): `AController`

Defined in: [src/camera/core/AController.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L65)

`AController` 인스턴스를 초기화하고 캔버스 입력 이벤트 리스너를 등록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |
| `initInfo` | `controllerInit` | 컨트롤러 입력 콜백 및 초기 카메라 설정 옵션 |

#### Returns

`AController`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### camera

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **camera**(): [`PerspectiveCamera`](../../../classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../classes/OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L86)

컨트롤러가 제어 중인 카메라 인스턴스를 반환합니다.

##### Returns

[`PerspectiveCamera`](../../../classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../classes/OrthographicCamera.md)

제어 중인 `PerspectiveCamera` 또는 `OrthographicCamera` 인스턴스

***

***

### hoveredView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hoveredView**(): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:134](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L134)

현재 포인터가 호버링 중인 `View3D` 인스턴스를 반환합니다.

##### Returns

[`View3D`](../../../../Display/classes/View3D.md)

호버링 중인 `View3D` 또는 `null`

***

***

### isKeyboardActiveController

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isKeyboardActiveController**(): `boolean`

Defined in: [src/camera/core/AController.ts:167](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L167)

이 컨트롤러가 현재 전역 키보드 입력 활성 컨트롤러인지 여부를 반환합니다.

##### Returns

`boolean`

키보드 활성 컨트롤러 여부

***

***

### keyboardActiveView

#### Get Signature

> **get** **keyboardActiveView**(): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L146)

키보드 입력 포커스를 보유한 전역 활성 `View3D`를 가져오거나 설정합니다.

##### Returns

[`View3D`](../../../../Display/classes/View3D.md)

키보드 활성 `View3D` 또는 `null`

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L150)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`View3D`](../../../../Display/classes/View3D.md) |

##### Returns

`void`

***

***

### keyboardProcessedThisFrame

#### Get Signature

> **get** **keyboardProcessedThisFrame**(): `boolean`

Defined in: [src/camera/core/AController.ts:179](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L179)

현재 프레임에서 키보드 입력이 이미 처리되었는지 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

현재 프레임 키보드 입력 처리 완료 여부

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:183](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L183)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### x

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **x**(): `number`

Defined in: [src/camera/core/AController.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L98)

제어 중인 카메라의 월드 X 좌표를 반환합니다.

##### Returns

`number`

카메라 월드 X 좌표

***

***

### y

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **y**(): `number`

Defined in: [src/camera/core/AController.ts:110](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L110)

제어 중인 카메라의 월드 Y 좌표를 반환합니다.

##### Returns

`number`

카메라 월드 Y 좌표

***

***

### z

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **z**(): `number`

Defined in: [src/camera/core/AController.ts:122](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L122)

제어 중인 카메라의 월드 Z 좌표를 반환합니다.

##### Returns

`number`

카메라 월드 Z 좌표

## Methods



***

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:258](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L258)

지정된 키 매핑 테이블의 입력 여부를 검사하고 현재 `View3D`의 키보드 처리 권한을 획득합니다.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t"></a> `T` *extends* `Record`\<`string`, `string`\> |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 키보드 입력을 검사할 `View3D` 인스턴스 |
| `keyNameMapper` | `T` | 동작 이름과 키 이름을 매핑한 객체 (`Record<string, string>`) |

#### Returns

`boolean`

현재 뷰에서 키보드 입력을 처리할 수 있으면 `true`, 아니면 `false`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/camera/core/AController.ts:191](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L191)

컨트롤러에 등록된 캔버스 및 윈도우 이벤트 리스너를 모두 해제하고 내부 참조를 정리합니다.

#### Returns

`void`

***

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:332](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L332)

입력 이벤트가 발생한 픽셀 좌표가 속한 `View3D` 인스턴스를 탐색하여 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` | 마우스 또는 터치 이벤트 (`MouseEvent` \| `TouchEvent`) |

#### Returns

[`View3D`](../../../../Display/classes/View3D.md)

이벤트가 발생한 `View3D` 인스턴스 또는 `null`

***

***

### getCanvasEventPoint()

> **getCanvasEventPoint**(`e`, `redGPUContext`): `object`

Defined in: [src/camera/core/AController.ts:302](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L302)

마우스, 터치, 휠 이벤트로부터 캔버스 기준 로컬 `{ x, y }` 좌표를 계산합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` \| `WheelEvent` | 입력 이벤트 (`MouseEvent` \| `TouchEvent` \| `WheelEvent`) |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |

#### Returns

`object`

캔버스 기준 `{ x, y }` 좌표 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L48) |
| `y` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L48) |

***

***

### update()

> **update**(`view`, `time`, `updateAnimation?`): `void`

Defined in: [src/camera/core/AController.ts:231](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L231)

프레임 경과 시간(`deltaTime`)을 계산하고 중복 뷰 갱신을 방지하며 애니메이션 콜백을 실행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 업데이트할 대상 `View3D` 인스턴스 |
| `time` | `number` | 현재 프레임 타임스탬프 (ms) |
| `updateAnimation?` | (`view`, `deltaTime`) => `void` | 초 단위 `deltaTime`을 전달받아 카메라 상태를 갱신하는 콜백 함수 (선택) |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
