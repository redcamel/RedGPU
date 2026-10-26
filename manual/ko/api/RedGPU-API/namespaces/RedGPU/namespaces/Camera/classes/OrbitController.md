[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / OrbitController

# Class: OrbitController

Defined in: [src/camera/controller/OrbitController.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L30)

지정된 중심점을 기준으로 궤도 회전 및 줌을 수행하는 카메라 컨트롤러 클래스입니다.

***

### Example
```typescript
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.centerX = 0;
controller.centerY = 0;
controller.centerZ = 0;
controller.distance = 20;
controller.tilt = -30;
controller.pan = 45;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/orbitController/" style="width:100%; height:500px;"></iframe>

## See

[OrbitController example](https://redcamel.github.io/RedGPU/examples/3d/controller/orbitController/)

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors



***

### Constructor

> **new OrbitController**(`redGPUContext`): `OrbitController`

Defined in: [src/camera/controller/OrbitController.ts:62](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L62)

OrbitController 인스턴스를 생성합니다.

#### Example
```typescript
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`OrbitController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors



***

### centerX

#### Get Signature

> **get** **centerX**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:95](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L95)

회전 중심점의 X축 좌표를 가져오거나 설정합니다.

##### Returns

`number`

중심점 X축 좌표 (기본값: `0`)

#### Set Signature

> **set** **centerX**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L99)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### centerY

#### Get Signature

> **get** **centerY**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:112](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L112)

회전 중심점의 Y축 좌표를 가져오거나 설정합니다.

##### Returns

`number`

중심점 Y축 좌표 (기본값: `0`)

#### Set Signature

> **set** **centerY**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L116)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### centerZ

#### Get Signature

> **get** **centerZ**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:129](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L129)

회전 중심점의 Z축 좌표를 가져오거나 설정합니다.

##### Returns

`number`

중심점 Z축 좌표 (기본값: `0`)

#### Set Signature

> **set** **centerZ**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:133](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L133)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### distance

#### Get Signature

> **get** **distance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L146)

중심점으로부터 카메라까지의 목표 거리를 가져오거나 설정합니다. (`0` 이상)

##### Returns

`number`

목표 거리 (기본값: `15`)

#### Set Signature

> **set** **distance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L150)

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

Defined in: [src/camera/controller/OrbitController.ts:180](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L180)

줌 거리 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)

##### Returns

`number`

거리 보간 계수 (기본값: `0.02`)

#### Set Signature

> **set** **distanceInterpolation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L184)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxDistance

#### Get Signature

> **get** **maxDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:214](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L214)

최대 줌 거리를 가져오거나 설정합니다. (`0.1` 이상)

##### Returns

`number`

최대 거리 (기본값: `Infinity`)

#### Set Signature

> **set** **maxDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:218](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L218)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxTilt

#### Get Signature

> **get** **maxTilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:316](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L316)

최대 틸트(Tilt) 제한 각도를 가져오거나 설정합니다. (`-90` ~ `90`)

##### Returns

`number`

최대 틸트 각도 (기본값: `90`)

#### Set Signature

> **set** **maxTilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:320](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L320)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minDistance

#### Get Signature

> **get** **minDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:197](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L197)

최소 줌 거리를 가져오거나 설정합니다. (`0.1` 이상)

##### Returns

`number`

최소 거리 (기본값: `0.1`)

#### Set Signature

> **set** **minDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:201](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L201)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minTilt

#### Get Signature

> **get** **minTilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:299](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L299)

최소 틸트(Tilt) 제한 각도를 가져오거나 설정합니다. (`-90` ~ `90`)

##### Returns

`number`

최소 틸트 각도 (기본값: `-90`)

#### Set Signature

> **set** **minTilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:303](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L303)

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

Defined in: [src/camera/controller/OrbitController.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L265)

카메라의 수평 회전(Pan) 목표 각도를 가져오거나 설정합니다. (단위: 도)

##### Returns

`number`

팬 각도 (기본값: `0`)

#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:269](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L269)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rotationInterpolation

#### Get Signature

> **get** **rotationInterpolation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:248](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L248)

회전 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)

##### Returns

`number`

회전 보간 계수 (기본값: `0.02`)

#### Set Signature

> **set** **rotationInterpolation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:252](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L252)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### speedDistance

#### Get Signature

> **get** **speedDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:163](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L163)

줌 거리 조절 속도를 가져오거나 설정합니다. (`0.01` 이상)

##### Returns

`number`

거리 조절 속도 (기본값: `1.5`)

#### Set Signature

> **set** **speedDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:167](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L167)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### speedRotation

#### Get Signature

> **get** **speedRotation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:231](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L231)

회전 속도를 가져오거나 설정합니다. (`0.01` 이상)

##### Returns

`number`

회전 속도 (기본값: `3`)

#### Set Signature

> **set** **speedRotation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:235](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L235)

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

Defined in: [src/camera/controller/OrbitController.ts:282](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L282)

카메라의 수직 회전(Tilt) 목표 각도를 가져오거나 설정합니다. (단위: 도, 범위: `-90` ~ `90`)

##### Returns

`number`

틸트 각도 (기본값: `-35`)

#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:286](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L286)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/OrbitController.ts:336](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/OrbitController.ts#L336)

매 프레임 궤도 카메라의 상태를 갱신합니다.

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
