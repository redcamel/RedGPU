[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / FollowController

# Class: FollowController

Defined in: [src/camera/controller/FollowController.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L32)

지정된 타겟 메시(Mesh)의 이동과 회전을 부드럽게 추적하는 3인칭 시점 카메라 컨트롤러 클래스입니다.

***

### Example
```typescript
const controller = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
controller.distance = 15;
controller.height = 8;
controller.pan = 45;
controller.tilt = 30;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/followController/" style="width:100%; height:500px;"></iframe>

## See

[FollowController example](https://redcamel.github.io/RedGPU/examples/3d/controller/followController/)

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors



***

### Constructor

> **new FollowController**(`redGPUContext`, `targetMesh`): `FollowController`

Defined in: [src/camera/controller/FollowController.ts:76](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L76)

FollowController 인스턴스를 생성합니다.

#### Example
```typescript
const controller = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `targetMesh` | [`Mesh`](../../Display/classes/Mesh.md) | 추적할 대상 `Mesh` 인스턴스 |

#### Returns

`FollowController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors



***

### distance

#### Get Signature

> **get** **distance**(): `number`

Defined in: [src/camera/controller/FollowController.ts:100](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L100)

타겟 메시로부터 카메라까지의 목표 거리를 가져오거나 설정합니다. (`0.1` 이상)

##### Returns

`number`

목표 거리 (기본값: `5`)

#### Set Signature

> **set** **distance**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L104)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### distanceInterpolation

#### Get Signature

> **get** **distanceInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L117)

거리 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)

##### Returns

`number`

거리 보간 계수 (기본값: `0.02`)

#### Set Signature

> **set** **distanceInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:121](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L121)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### followTargetRotation

#### Get Signature

> **get** **followTargetRotation**(): `boolean`

Defined in: [src/camera/controller/FollowController.ts:253](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L253)

타겟 메시의 회전을 따라 카메라 공전 기준축을 회전시킬지 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

타겟 회전 추적 여부 (기본값: `true`)

#### Set Signature

> **set** **followTargetRotation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:257](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L257)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/camera/controller/FollowController.ts:134](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L134)

타겟 메시로부터 카메라까지의 목표 높이를 가져오거나 설정합니다.

##### Returns

`number`

목표 높이 (기본값: `1`)

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:138](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L138)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### heightInterpolation

#### Get Signature

> **get** **heightInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:151](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L151)

높이 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)

##### Returns

`number`

높이 보간 계수 (기본값: `0.02`)

#### Set Signature

> **set** **heightInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:155](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L155)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### interpolation

#### Get Signature

> **get** **interpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:236](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L236)

카메라 위치 추적의 전체 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)

##### Returns

`number`

위치 보간 계수 (기본값: `0.02`)

#### Set Signature

> **set** **interpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:240](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L240)

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

Defined in: [src/camera/controller/FollowController.ts:168](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L168)

타겟을 중심으로 한 카메라의 수평 회전(Pan) 목표 각도를 가져오거나 설정합니다. (단위: 도)

##### Returns

`number`

팬 각도 (기본값: `0`)

#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L172)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### panInterpolation

#### Get Signature

> **get** **panInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:185](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L185)

팬(Pan) 회전의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)

##### Returns

`number`

팬 보간 계수 (기본값: `0.02`)

#### Set Signature

> **set** **panInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:189](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L189)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### targetMesh

#### Get Signature

> **get** **targetMesh**(): [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/camera/controller/FollowController.ts:320](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L320)

현재 추적 중인 타겟 메시를 가져오거나 설정합니다.

##### Returns

[`Mesh`](../../Display/classes/Mesh.md)

타겟 `Mesh` 인스턴스

#### Set Signature

> **set** **targetMesh**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:324](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L324)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Mesh`](../../Display/classes/Mesh.md) |

##### Returns

`void`

***

***

### targetOffsetX

#### Get Signature

> **get** **targetOffsetX**(): `number`

Defined in: [src/camera/controller/FollowController.ts:269](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L269)

카메라가 바라보는 타겟 지점의 X축 오프셋을 가져오거나 설정합니다.

##### Returns

`number`

X축 오프셋 (기본값: `0`)

#### Set Signature

> **set** **targetOffsetX**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:273](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L273)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### targetOffsetY

#### Get Signature

> **get** **targetOffsetY**(): `number`

Defined in: [src/camera/controller/FollowController.ts:286](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L286)

카메라가 바라보는 타겟 지점의 Y축 오프셋을 가져오거나 설정합니다.

##### Returns

`number`

Y축 오프셋 (기본값: `0`)

#### Set Signature

> **set** **targetOffsetY**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:290](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L290)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### targetOffsetZ

#### Get Signature

> **get** **targetOffsetZ**(): `number`

Defined in: [src/camera/controller/FollowController.ts:303](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L303)

카메라가 바라보는 타겟 지점의 Z축 오프셋을 가져오거나 설정합니다.

##### Returns

`number`

Z축 오프셋 (기본값: `0`)

#### Set Signature

> **set** **targetOffsetZ**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:307](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L307)

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

Defined in: [src/camera/controller/FollowController.ts:202](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L202)

타겟을 중심으로 한 카메라의 수직 회전(Tilt) 목표 각도를 가져오거나 설정합니다. (단위: 도, 범위: `-89` ~ `89`)

##### Returns

`number`

틸트 각도 (기본값: `15`)

#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:206](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L206)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### tiltInterpolation

#### Get Signature

> **get** **tiltInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:219](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L219)

틸트(Tilt) 회전의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)

##### Returns

`number`

틸트 보간 계수 (기본값: `0.02`)

#### Set Signature

> **set** **tiltInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:223](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L223)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### setTargetOffset()

> **setTargetOffset**(`x`, `y?`, `z?`): `void`

Defined in: [src/camera/controller/FollowController.ts:350](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L350)

카메라가 바라보는 타겟 지점의 3축 오프셋을 한 번에 설정합니다.

#### Example
```typescript
controller.setTargetOffset(0, 2, 0);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `x` | `number` | `undefined` | X축 오프셋 |
| `y?` | `number` | `0` | Y축 오프셋 (기본값: `0`) |
| `z?` | `number` | `0` | Z축 오프셋 (기본값: `0`) |

#### Returns

`void`

***

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/FollowController.ts:370](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FollowController.ts#L370)

매 프레임 추적 카메라의 위치와 시선 방향을 갱신합니다.

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

***

### x

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **x**(): `number`

Defined in: [src/camera/core/AController.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L98)

제어 중인 카메라의 월드 X 좌표를 반환합니다.

##### Returns

`number`

카메라 월드 X 좌표

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`x`](../namespaces/Core/classes/AController.md#x)

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

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`y`](../namespaces/Core/classes/AController.md#y)

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

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

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
