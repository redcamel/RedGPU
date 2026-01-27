[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / FreeController

# Class: FreeController

Defined in: [src/camera/controller/FreeController.ts:89](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L89)

자유롭게 이동 가능한 1인칭 시점의 카메라 컨트롤러입니다.


FPS 게임이나 3D 에디터의 뷰포트처럼 키보드와 마우스를 사용하여 공간을 자유롭게 비행하듯 탐색할 수 있습니다.


* ### Example
```typescript
const controller = new RedGPU.Camera.FreeController(redGPUContext);
controller.setPosition(10, 5, 20);
controller.pan = 30;
controller.tilt = 10;
controller.setMoveForwardKey('w');
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/freeController/"></iframe>

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors

### Constructor

> **new FreeController**(`redGPUContext`): `FreeController`

Defined in: [src/camera/controller/FreeController.ts:127](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L127)

FreeController의 생성자입니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPU 컨텍스트 객체

#### Returns

`FreeController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors

### camera

#### Get Signature

> **get** **camera**(): [`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:135](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L135)

이 컨트롤러가 제어하는 카메라를 반환합니다.


##### Returns

[`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

제어 중인 카메라 (PerspectiveCamera 또는 OrthographicCamera)


#### Inherited from

[`FollowController`](FollowController.md).[`camera`](FollowController.md#camera)

***

### hoveredView

#### Get Signature

> **get** **hoveredView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:149](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L149)

**`Internal`**

현재 마우스가 호버링 중인 View를 반환합니다.


##### Returns

[`View3D`](../../Display/classes/View3D.md)

호버링 중인 View 또는 null


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`hoveredView`](../namespaces/Core/classes/AController.md#hoveredview)

***

### isKeyboardActiveController

#### Get Signature

> **get** **isKeyboardActiveController**(): `boolean`

Defined in: [src/camera/core/AController.ts:195](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L195)

**`Internal`**

현재 컨트롤러가 키보드 입력을 처리 중인지 여부를 반환합니다.


##### Returns

`boolean`

키보드 활성 컨트롤러 여부


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`isKeyboardActiveController`](../namespaces/Core/classes/AController.md#iskeyboardactivecontroller)

***

### keyboardActiveView

#### Get Signature

> **get** **keyboardActiveView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:162](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L162)

**`Internal`**

키보드 입력이 활성화된 View를 반환합니다.


##### Returns

[`View3D`](../../Display/classes/View3D.md)

키보드 활성 View 또는 null


#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:175](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L175)

**`Internal`**

키보드 입력이 활성화된 View를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`View3D`](../../Display/classes/View3D.md) | 설정할 View 또는 null

##### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`keyboardActiveView`](../namespaces/Core/classes/AController.md#keyboardactiveview)

***

### keyboardProcessedThisFrame

#### Get Signature

> **get** **keyboardProcessedThisFrame**(): `boolean`

Defined in: [src/camera/core/AController.ts:208](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L208)

**`Internal`**

이번 프레임에서 키보드 입력이 이미 처리되었는지 여부를 반환합니다.


##### Returns

`boolean`

처리 여부


#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:221](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L221)

**`Internal`**

이번 프레임에서 키보드 입력이 처리되었는지 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 설정할 처리 여부

##### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`keyboardProcessedThisFrame`](../namespaces/Core/classes/AController.md#keyboardprocessedthisframe)

***

### keyNameMapper

#### Get Signature

> **get** **keyNameMapper**(): `KeyNameMapper`

Defined in: [src/camera/controller/FreeController.ts:409](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L409)

현재 키 매핑 설정을 가져옵니다.


##### Returns

`KeyNameMapper`

키 매핑 객체의 복사본


***

### maxAcceleration

#### Get Signature

> **get** **maxAcceleration**(): `number`

Defined in: [src/camera/controller/FreeController.ts:384](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L384)

최대 가속도를 가져옵니다.


##### Returns

`number`

최대 가속도 값


#### Set Signature

> **set** **maxAcceleration**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:396](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L396)

최대 가속도를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 최대 가속도 값

##### Returns

`void`

***

### moveSpeed

#### Get Signature

> **get** **moveSpeed**(): `number`

Defined in: [src/camera/controller/FreeController.ts:282](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L282)

카메라의 이동 속도를 가져옵니다.


##### Returns

`number`

이동 속도 값


#### Set Signature

> **set** **moveSpeed**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:294](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L294)

카메라의 이동 속도를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 이동 속도 값 (0.01 이상)

##### Returns

`void`

***

### moveSpeedInterpolation

#### Get Signature

> **get** **moveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/FreeController.ts:307](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L307)

이동 보간 정도를 가져옵니다. (0~1 범위에서 작을수록 부드러움)


##### Returns

`number`

이동 보간 정도 값


#### Set Signature

> **set** **moveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:319](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L319)

이동 보간 정도를 설정합니다. (0.01~1 범위, 작을수록 부드러운 이동)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 보간 정도 값

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/core/AController.ts:98](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L98)

컨트롤러의 이름을 반환합니다.


##### Returns

`string`

컨트롤러 이름


#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/core/AController.ts:111](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L111)

컨트롤러의 이름을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 이름

##### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`name`](../namespaces/Core/classes/AController.md#name)

***

### pan

#### Get Signature

> **get** **pan**(): `number`

Defined in: [src/camera/controller/FreeController.ts:228](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L228)

카메라의 좌우 회전 각도(Pan)를 가져옵니다. (단위: 도)


##### Returns

`number`

좌우 회전 각도 값


#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:240](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L240)

카메라의 좌우 회전 각도(Pan)를 설정합니다. (단위: 도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 좌우 회전 각도 값

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/camera/core/AController.ts:123](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L123)

RedGPU 컨텍스트를 반환합니다.


##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

RedGPU 컨텍스트


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

### rotationSpeed

#### Get Signature

> **get** **rotationSpeed**(): `number`

Defined in: [src/camera/controller/FreeController.ts:333](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L333)

카메라의 회전 속도를 가져옵니다.


##### Returns

`number`

회전 속도 값


#### Set Signature

> **set** **rotationSpeed**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:345](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L345)

카메라의 회전 속도를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 회전 속도 값 (0.01 이상)

##### Returns

`void`

***

### rotationSpeedInterpolation

#### Get Signature

> **get** **rotationSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/FreeController.ts:358](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L358)

회전 보간 정도를 가져옵니다. (0~1 범위에서 작을수록 부드러움)


##### Returns

`number`

회전 보간 정도 값


#### Set Signature

> **set** **rotationSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:370](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L370)

회전 보간 정도를 설정합니다. (0.01~1 범위, 작을수록 부드러운 회전)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 보간 정도 값

##### Returns

`void`

***

### tilt

#### Get Signature

> **get** **tilt**(): `number`

Defined in: [src/camera/controller/FreeController.ts:254](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L254)

카메라의 상하 회전 각도(Tilt)를 가져옵니다. (단위: 도, 범위: -90 ~ 90)


##### Returns

`number`

상하 회전 각도 값


#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:266](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L266)

카메라의 상하 회전 각도(Tilt)를 설정합니다. (단위: 도, 범위: -90 ~ 90)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 상하 회전 각도 값

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/controller/FreeController.ts:149](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L149)

카메라의 X축 위치를 가져옵니다.


##### Returns

`number`

카메라의 X축 위치 값


#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:161](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L161)

카메라의 X축 위치를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 X축 위치 값 (숫자)

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/controller/FreeController.ts:175](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L175)

카메라의 Y축 위치를 가져옵니다.


##### Returns

`number`

카메라의 Y축 위치 값


#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:187](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L187)

카메라의 Y축 위치를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 Y축 위치 값 (숫자)

##### Returns

`void`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/controller/FreeController.ts:201](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L201)

카메라의 Z축 위치를 가져옵니다.


##### Returns

`number`

카메라의 Z축 위치 값


#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:213](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L213)

카메라의 Z축 위치를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 Z축 위치 값 (숫자)

##### Returns

`void`

## Methods

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:283](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L283)

키보드 입력이 있는지 체크하고 활성 View를 설정합니다.


#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `string`\> |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 현재 View
| `keyNameMapper` | `T` | 키 매핑 객체

#### Returns

`boolean`

키보드 입력 처리가 가능하면 true, 아니면 false


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`checkKeyboardInput`](../namespaces/Core/classes/AController.md#checkkeyboardinput)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/camera/core/AController.ts:229](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L229)

컨트롤러를 제거하고 이벤트 리스너를 해제합니다.


#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:367](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L367)

**`Internal`**

입력 이벤트가 발생한 View를 찾습니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` | 마우스 또는 터치 이벤트

#### Returns

[`View3D`](../../Display/classes/View3D.md)

해당 View 또는 null


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`findTargetViewByInputEvent`](../namespaces/Core/classes/AController.md#findtargetviewbyinputevent)

***

### getCanvasEventPoint()

> **getCanvasEventPoint**(`e`, `redGPUContext`): `object`

Defined in: [src/camera/core/AController.ts:330](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L330)

**`Internal`**

캔버스 상의 이벤트 좌표를 가져옵니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` \| `WheelEvent` | 마우스, 터치 또는 휠 이벤트
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`object`

{x, y} 좌표 객체


| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/camera/core/AController.ts:350](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L350) |
| `y` | `number` | [src/camera/core/AController.ts:351](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/core/AController.ts#L351) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

### setMoveBackKey()

> **setMoveBackKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:433](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L433)

후진 이동 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름 (예: 's')

#### Returns

`void`

***

### setMoveDownKey()

> **setMoveDownKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:481](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L481)

하향 이동 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름 (예: 'g')

#### Returns

`void`

***

### setMoveForwardKey()

> **setMoveForwardKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:421](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L421)

전진 이동 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름 (예: 'w')

#### Returns

`void`

***

### setMoveLeftKey()

> **setMoveLeftKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:445](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L445)

좌측 이동 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름 (예: 'a')

#### Returns

`void`

***

### setMoveRightKey()

> **setMoveRightKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:457](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L457)

우측 이동 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름 (예: 'd')

#### Returns

`void`

***

### setMoveUpKey()

> **setMoveUpKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:469](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L469)

상향 이동 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름 (예: 't')

#### Returns

`void`

***

### setTurnDownKey()

> **setTurnDownKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:529](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L529)

하향 회전 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름 (예: 'f')

#### Returns

`void`

***

### setTurnLeftKey()

> **setTurnLeftKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:493](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L493)

좌회전 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름 (예: 'q')

#### Returns

`void`

***

### setTurnRightKey()

> **setTurnRightKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:505](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L505)

우회전 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름 (예: 'e')

#### Returns

`void`

***

### setTurnUpKey()

> **setTurnUpKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:517](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L517)

상향 회전 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름 (예: 'r')

#### Returns

`void`

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/FreeController.ts:545](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/controller/FreeController.ts#L545)

매 프레임마다 카메라 컨트롤러를 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 3D 뷰 객체
| `time` | `number` | 현재 경과 시간 (밀리초)

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)
