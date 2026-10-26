[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / IsometricController

# Class: IsometricController

Defined in: [src/camera/controller/IsometricController.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L24)

직교 투영(OrthographicCamera)을 사용하여 고정된 각도의 등각 투영(쿼터뷰) 시점을 제공하는 카메라 컨트롤러 클래스입니다.

***

### Example
```typescript
const controller = new RedGPU.Camera.IsometricController(redGPUContext);
controller.viewHeight = 15;
controller.zoom = 1;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:500px;"></iframe>

## See

[IsometricController example](https://redcamel.github.io/RedGPU/examples/3d/controller/isometricController/)

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors



***

### Constructor

> **new IsometricController**(`redGPUContext`): `IsometricController`

Defined in: [src/camera/controller/IsometricController.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L64)

IsometricController 인스턴스를 생성합니다.

#### Example
```typescript
const controller = new RedGPU.Camera.IsometricController(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`IsometricController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors



***

### keyNameMapper

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **keyNameMapper**(): `object`

Defined in: [src/camera/controller/IsometricController.ts:294](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L294)

현재 설정된 키보드 키 매핑 객체의 복사본을 반환합니다.

##### Returns

`object`

키 매핑 설정 객체

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `moveDown` | `string` | `'s'` | [src/camera/controller/IsometricController.ts:43](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L43) |
| `moveLeft` | `string` | `'a'` | [src/camera/controller/IsometricController.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L44) |
| `moveRight` | `string` | `'d'` | [src/camera/controller/IsometricController.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L45) |
| `moveUp` | `string` | `'w'` | [src/camera/controller/IsometricController.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L42) |

***

***

### maxZoom

#### Get Signature

> **get** **maxZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:174](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L174)

최대 줌 배율을 가져오거나 설정합니다. (`0.01` 이상)

##### Returns

`number`

최대 줌 배율 (기본값: `3`)

#### Set Signature

> **set** **maxZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:178](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L178)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minZoom

#### Get Signature

> **get** **minZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:156](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L156)

최소 줌 배율을 가져오거나 설정합니다. (`0.01` 이상)

##### Returns

`number`

최소 줌 배율 (기본값: `0.5`)

#### Set Signature

> **set** **minZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L160)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mouseMoveSpeed

#### Get Signature

> **get** **mouseMoveSpeed**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:260](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L260)

마우스 이동 속도를 가져오거나 설정합니다. (`0.01` 이상)

##### Returns

`number`

마우스 이동 속도 (기본값: `1`)

#### Set Signature

> **set** **mouseMoveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:264](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L264)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mouseMoveSpeedInterpolation

#### Get Signature

> **get** **mouseMoveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L277)

마우스 이동의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)

##### Returns

`number`

마우스 이동 보간 계수 (기본값: `0.02`)

#### Set Signature

> **set** **mouseMoveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:281](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L281)

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

Defined in: [src/camera/controller/IsometricController.ts:226](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L226)

키보드 이동 속도를 가져오거나 설정합니다. (`0.01` 이상)

##### Returns

`number`

이동 속도 (기본값: `20`)

#### Set Signature

> **set** **moveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:230](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L230)

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

Defined in: [src/camera/controller/IsometricController.ts:243](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L243)

위치 이동의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)

##### Returns

`number`

이동 보간 계수 (기본값: `0.02`)

#### Set Signature

> **set** **moveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:247](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L247)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### speedZoom

#### Get Signature

> **get** **speedZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:139](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L139)

마우스 휠 줌 속도를 가져오거나 설정합니다. (`0.01` 이상)

##### Returns

`number`

줌 속도 (기본값: `0.1`)

#### Set Signature

> **set** **speedZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L143)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### targetX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetX**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:306](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L306)

카메라가 바라보는 기준점의 현재 X축 좌표를 반환합니다.

##### Returns

`number`

타겟 X축 좌표

***

***

### targetY

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetY**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:318](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L318)

카메라가 바라보는 기준점의 현재 Y축 좌표를 반환합니다. (항상 `0`)

##### Returns

`number`

타겟 Y축 좌표 (`0`)

***

***

### targetZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetZ**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:330](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L330)

카메라가 바라보는 기준점의 현재 Z축 좌표를 반환합니다.

##### Returns

`number`

타겟 Z축 좌표

***

***

### viewHeight

#### Get Signature

> **get** **viewHeight**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:192](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L192)

직교 투영 뷰의 기준 높이를 가져오거나 설정합니다. (`0.1` 이상)

##### Returns

`number`

뷰 높이 (기본값: `15`)

#### Set Signature

> **set** **viewHeight**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:196](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L196)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### viewHeightInterpolation

#### Get Signature

> **get** **viewHeightInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:209](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L209)

뷰 높이 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)

##### Returns

`number`

뷰 높이 보간 계수 (기본값: `0.02`)

#### Set Signature

> **set** **viewHeightInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L213)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### zoom

#### Get Signature

> **get** **zoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:105](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L105)

목표 줌 배율을 가져오거나 설정합니다. (`minZoom` ~ `maxZoom`)

##### Returns

`number`

목표 줌 배율 (기본값: `1`)

#### Set Signature

> **set** **zoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:109](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L109)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### zoomInterpolation

#### Get Signature

> **get** **zoomInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:122](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L122)

줌 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)

##### Returns

`number`

줌 보간 계수 (기본값: `0.02`)

#### Set Signature

> **set** **zoomInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:126](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L126)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods



***

### setMoveDownKey()

> **setMoveDownKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:354](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L354)

하향 이동 키를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 할당할 키 이름 (예: `'s'`) |

#### Returns

`void`

***

***

### setMoveLeftKey()

> **setMoveLeftKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:366](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L366)

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

Defined in: [src/camera/controller/IsometricController.ts:378](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L378)

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

Defined in: [src/camera/controller/IsometricController.ts:342](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L342)

상향 이동 키를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 할당할 키 이름 (예: `'w'`) |

#### Returns

`void`

***

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/IsometricController.ts:393](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/IsometricController.ts#L393)

매 프레임 등각 투영 카메라의 상태를 갱신합니다.

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

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/camera/core/AController.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L86)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/camera/core/AController.ts:134](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L134)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

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

Defined in: [src/camera/core/AController.ts:167](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L167)

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

Defined in: [src/camera/core/AController.ts:146](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L146)

키보드 입력 포커스를 보유한 전역 활성 `View3D`를 가져오거나 설정합니다.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

키보드 활성 `View3D` 또는 `null`

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L150)

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

Defined in: [src/camera/core/AController.ts:179](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L179)

현재 프레임에서 키보드 입력이 이미 처리되었는지 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

현재 프레임 키보드 입력 처리 완료 여부

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:183](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L183)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

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

[`AController`](../namespaces/Core/classes/AController.md).[`name`](../namespaces/Core/classes/AController.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

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

Defined in: [src/camera/core/AController.ts:98](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L98)

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

Defined in: [src/camera/core/AController.ts:110](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L110)

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

Defined in: [src/camera/core/AController.ts:122](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L122)

제어 중인 카메라의 월드 Z 좌표를 반환합니다.

##### Returns

`number`

카메라 월드 Z 좌표

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

***

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:258](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L258)

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

Defined in: [src/camera/core/AController.ts:191](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L191)

컨트롤러에 등록된 캔버스 및 윈도우 이벤트 리스너를 모두 해제하고 내부 참조를 정리합니다.

#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:332](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L332)

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

Defined in: [src/camera/core/AController.ts:302](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L302)

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
| `x` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L48) |
| `y` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L48) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

</details>
