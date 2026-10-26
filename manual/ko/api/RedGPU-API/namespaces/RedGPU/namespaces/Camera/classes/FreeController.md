[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / FreeController

# Class: FreeController

Defined in: [src/camera/controller/FreeController.ts:85](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L85)

키보드와 마우스 입력을 사용하여 3D 공간을 자유롭게 탐색하는 1인칭 시점 카메라 컨트롤러 클래스입니다.

***

### Example
```typescript
const controller = new RedGPU.Camera.FreeController(redGPUContext);
controller.x = 0;
controller.y = 5;
controller.z = 20;
controller.pan = 0;
controller.tilt = -15;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/freeController/" style="width:100%; height:500px;"></iframe>

## See

[FreeController example](https://redcamel.github.io/RedGPU/examples/3d/controller/freeController/)

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors



***

### Constructor

> **new FreeController**(`redGPUContext`): `FreeController`

Defined in: [src/camera/controller/FreeController.ts:133](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L133)

FreeController 인스턴스를 생성합니다.

#### Example
```typescript
const controller = new RedGPU.Camera.FreeController(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`FreeController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors



***

### keyNameMapper

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **keyNameMapper**(): `KeyNameMapper`

Defined in: [src/camera/controller/FreeController.ts:339](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L339)

현재 설정된 키보드 키 매핑 객체의 복사본을 반환합니다.

##### Returns

`KeyNameMapper`

키 매핑 설정 객체 (`KeyNameMapper`)

***

***

### maxAcceleration

#### Get Signature

> **get** **maxAcceleration**(): `number`

Defined in: [src/camera/controller/FreeController.ts:323](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L323)

최대 이동 가속도 배율을 가져오거나 설정합니다.

##### Returns

`number`

최대 가속도 배율 (기본값: `1`)

#### Set Signature

> **set** **maxAcceleration**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:327](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L327)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mouseSensitivity

#### Get Signature

> **get** **mouseSensitivity**(): `number`

Defined in: [src/camera/controller/FreeController.ts:238](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L238)

마우스 드래그 회전 감도를 가져오거나 설정합니다. (`0.01` 이상)

##### Returns

`number`

마우스 회전 감도 (기본값: `0.15`)

#### Set Signature

> **set** **mouseSensitivity**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:242](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L242)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### moveSpeed

#### Get Signature

> **get** **moveSpeed**(): `number`

Defined in: [src/camera/controller/FreeController.ts:255](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L255)

키보드 이동 속도를 가져오거나 설정합니다. (`0.01` 이상)

##### Returns

`number`

이동 속도 (기본값: `20`)

#### Set Signature

> **set** **moveSpeed**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:259](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L259)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### moveSpeedInterpolation

#### Get Signature

> **get** **moveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/FreeController.ts:272](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L272)

이동 위치 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)

##### Returns

`number`

이동 보간 계수 (기본값: `0.01`)

#### Set Signature

> **set** **moveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:276](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L276)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### pan

#### Get Signature

> **get** **pan**(): `number`

Defined in: [src/camera/controller/FreeController.ts:204](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L204)

카메라의 수평 회전(Pan) 목표 각도를 가져오거나 설정합니다. (단위: 도)

##### Returns

`number`

팬 각도 (기본값: `0`)

#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L208)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rotationSpeed

#### Get Signature

> **get** **rotationSpeed**(): `number`

Defined in: [src/camera/controller/FreeController.ts:289](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L289)

키보드 회전 속도를 가져오거나 설정합니다. (`0.01` 이상)

##### Returns

`number`

회전 속도 (기본값: `100`)

#### Set Signature

> **set** **rotationSpeed**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:293](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L293)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rotationSpeedInterpolation

#### Get Signature

> **get** **rotationSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/FreeController.ts:306](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L306)

회전 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)

##### Returns

`number`

회전 보간 계수 (기본값: `0.01`)

#### Set Signature

> **set** **rotationSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:310](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L310)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### tilt

#### Get Signature

> **get** **tilt**(): `number`

Defined in: [src/camera/controller/FreeController.ts:221](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L221)

카메라의 수직 회전(Tilt) 목표 각도를 가져오거나 설정합니다. (단위: 도, 범위: `-89.9` ~ `89.9`)

##### Returns

`number`

틸트 각도 (기본값: `0`)

#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:225](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L225)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/controller/FreeController.ts:153](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L153)

카메라의 목표 X축 위치를 가져오거나 설정합니다.

##### Returns

`number`

X축 위치 (기본값: `0`)

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:157](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L157)

제어 중인 카메라의 월드 X 좌표를 반환합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

카메라 월드 X 좌표

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`x`](../namespaces/Core/classes/AController.md#x)

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/controller/FreeController.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L170)

카메라의 목표 Y축 위치를 가져오거나 설정합니다.

##### Returns

`number`

Y축 위치 (기본값: `0`)

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:174](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L174)

제어 중인 카메라의 월드 Y 좌표를 반환합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

카메라 월드 Y 좌표

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`y`](../namespaces/Core/classes/AController.md#y)

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/controller/FreeController.ts:187](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L187)

카메라의 목표 Z축 위치를 가져오거나 설정합니다.

##### Returns

`number`

Z축 위치 (기본값: `0`)

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:191](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L191)

제어 중인 카메라의 월드 Z 좌표를 반환합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

카메라 월드 Z 좌표

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

## Methods



***

### setMoveBackKey()

> **setMoveBackKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:363](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L363)

후진 이동 키를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 할당할 키 이름 (예: `'s'`) |

#### Returns

`void`

***

***

### setMoveDownKey()

> **setMoveDownKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:411](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L411)

하향 이동 키를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 할당할 키 이름 (예: `'q'`) |

#### Returns

`void`

***

***

### setMoveForwardKey()

> **setMoveForwardKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:351](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L351)

전진 이동 키를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 할당할 키 이름 (예: `'w'`) |

#### Returns

`void`

***

***

### setMoveLeftKey()

> **setMoveLeftKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:375](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L375)

좌측 이동 키를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 할당할 키 이름 (예: `'a'`) |

#### Returns

`void`

***

***

### setMoveRightKey()

> **setMoveRightKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:387](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L387)

우측 이동 키를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 할당할 키 이름 (예: `'d'`) |

#### Returns

`void`

***

***

### setMoveUpKey()

> **setMoveUpKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:399](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L399)

상향 이동 키를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 할당할 키 이름 (예: `'e'`) |

#### Returns

`void`

***

***

### setTurnDownKey()

> **setTurnDownKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:459](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L459)

하향 회전 키를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 할당할 키 이름 (예: `'f'`) |

#### Returns

`void`

***

***

### setTurnLeftKey()

> **setTurnLeftKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:423](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L423)

좌회전 키를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 할당할 키 이름 (예: `'z'`) |

#### Returns

`void`

***

***

### setTurnRightKey()

> **setTurnRightKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:435](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L435)

우회전 키를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 할당할 키 이름 (예: `'c'`) |

#### Returns

`void`

***

***

### setTurnUpKey()

> **setTurnUpKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:447](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L447)

상향 회전 키를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 할당할 키 이름 (예: `'r'`) |

#### Returns

`void`

***

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/FreeController.ts:474](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L474)

매 프레임 자유 시점 카메라의 상태를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 컨트롤러가 연결된 `View3D` 인스턴스 |
| `time` | `number` | 현재 경과 시간 (ms) |

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`antialiasingManager`](../namespaces/Core/classes/AController.md#antialiasingmanager)

***

***

### camera

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **camera**(): [`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L86)

컨트롤러가 제어 중인 카메라 인스턴스를 반환합니다.

##### Returns

[`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

제어 중인 `PerspectiveCamera` 또는 `OrthographicCamera` 인스턴스

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`camera`](../namespaces/Core/classes/AController.md#camera)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`commandEncoderManager`](../namespaces/Core/classes/AController.md#commandencodermanager)

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

[`AController`](../namespaces/Core/classes/AController.md).[`gpuDevice`](../namespaces/Core/classes/AController.md#gpudevice)

***

***

### hoveredView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hoveredView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:134](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L134)

현재 포인터가 호버링 중인 `View3D` 인스턴스를 반환합니다.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

호버링 중인 `View3D` 또는 `null`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`hoveredView`](../namespaces/Core/classes/AController.md#hoveredview)

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

[`AController`](../namespaces/Core/classes/AController.md).[`instanceId`](../namespaces/Core/classes/AController.md#instanceid)

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

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`isKeyboardActiveController`](../namespaces/Core/classes/AController.md#iskeyboardactivecontroller)

***

***

### keyboardActiveView

#### Get Signature

> **get** **keyboardActiveView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L146)

키보드 입력 포커스를 보유한 전역 활성 `View3D`를 가져오거나 설정합니다.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

키보드 활성 `View3D` 또는 `null`

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L150)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`View3D`](../../Display/classes/View3D.md) |

##### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`keyboardActiveView`](../namespaces/Core/classes/AController.md#keyboardactiveview)

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

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`keyboardProcessedThisFrame`](../namespaces/Core/classes/AController.md#keyboardprocessedthisframe)

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

[`AController`](../namespaces/Core/classes/AController.md).[`name`](../namespaces/Core/classes/AController.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`resourceManager`](../namespaces/Core/classes/AController.md#resourcemanager)

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

[`AController`](../namespaces/Core/classes/AController.md).[`uuid`](../namespaces/Core/classes/AController.md#uuid)

***

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

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
| `view` | [`View3D`](../../Display/classes/View3D.md) | 키보드 입력을 검사할 `View3D` 인스턴스 |
| `keyNameMapper` | `T` | 동작 이름과 키 이름을 매핑한 객체 (`Record<string, string>`) |

#### Returns

`boolean`

현재 뷰에서 키보드 입력을 처리할 수 있으면 `true`, 아니면 `false`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`checkKeyboardInput`](../namespaces/Core/classes/AController.md#checkkeyboardinput)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/camera/core/AController.ts:191](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L191)

컨트롤러에 등록된 캔버스 및 윈도우 이벤트 리스너를 모두 해제하고 내부 참조를 정리합니다.

#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:332](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L332)

입력 이벤트가 발생한 픽셀 좌표가 속한 `View3D` 인스턴스를 탐색하여 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` | 마우스 또는 터치 이벤트 (`MouseEvent` \| `TouchEvent`) |

#### Returns

[`View3D`](../../Display/classes/View3D.md)

이벤트가 발생한 `View3D` 인스턴스 또는 `null`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`findTargetViewByInputEvent`](../namespaces/Core/classes/AController.md#findtargetviewbyinputevent)

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
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |

#### Returns

`object`

캔버스 기준 `{ x, y }` 좌표 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L48) |
| `y` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L48) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

</details>
