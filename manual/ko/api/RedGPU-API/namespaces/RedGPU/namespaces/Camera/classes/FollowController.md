[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / FollowController

# Class: FollowController

Defined in: [src/camera/controller/FollowController.ts:31](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L31)

특정 타겟 메시를 추적하는 카메라 컨트롤러입니다.


3인칭 게임의 캐릭터 카메라처럼 타겟의 뒤를 쫓거나 주변을 회전하며 관찰하는 데 사용됩니다. 타겟의 이동과 회전을 부드럽게 따라가며, 거리와 높이, 각도를 조절하여 다양한 연출이 가능합니다.


* ### Example
```typescript
const followController = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
followController.distance = 15;
followController.height = 8;
followController.pan = 45;
followController.tilt = 30;
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/followController/"></iframe>

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors

### Constructor

> **new FollowController**(`redGPUContext`, `targetMesh`): `FollowController`

Defined in: [src/camera/controller/FollowController.ts:147](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L147)

FollowController 생성자


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPU 컨텍스트
| `targetMesh` | [`Mesh`](../../Display/classes/Mesh.md) | 따라갈 대상 메시

#### Returns

`FollowController`

#### Throws

targetMesh가 null이거나 undefined일 경우 에러 발생


#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors

### camera

#### Get Signature

> **get** **camera**(): [`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:135](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L135)

이 컨트롤러가 제어하는 카메라를 반환합니다.


##### Returns

[`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

제어 중인 카메라 (PerspectiveCamera 또는 OrthographicCamera)


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`camera`](../namespaces/Core/classes/AController.md#camera)

***

### distance

#### Get Signature

> **get** **distance**(): `number`

Defined in: [src/camera/controller/FollowController.ts:170](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L170)

타겟으로부터의 카메라 거리를 가져옵니다.


##### Returns

`number`

목표 거리 (0.1 이상)


#### Set Signature

> **set** **distance**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:182](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L182)

타겟으로부터의 카메라 거리를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 거리 (0.1 이상)

##### Returns

`void`

***

### distanceInterpolation

#### Get Signature

> **get** **distanceInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:195](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L195)

거리 값의 보간 계수를 가져옵니다.


##### Returns

`number`

거리 보간 계수 (0.01 ~ 1)


#### Set Signature

> **set** **distanceInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:207](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L207)

거리 값의 보간 계수를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 보간 계수 (0.01 ~ 1)

##### Returns

`void`

***

### followTargetRotation

#### Get Signature

> **get** **followTargetRotation**(): `boolean`

Defined in: [src/camera/controller/FollowController.ts:395](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L395)

타겟 메시의 회전을 따를지 여부를 가져옵니다.


##### Returns

`boolean`

true일 경우 타겟의 회전을 따름


#### Set Signature

> **set** **followTargetRotation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:407](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L407)

타겟 메시의 회전을 따를지 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | true일 경우 타겟의 회전을 따름

##### Returns

`void`

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/camera/controller/FollowController.ts:220](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L220)

타겟으로부터의 카메라 높이를 가져옵니다.


##### Returns

`number`

목표 높이


#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:232](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L232)

타겟으로부터의 카메라 높이를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 높이

##### Returns

`void`

***

### heightInterpolation

#### Get Signature

> **get** **heightInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:245](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L245)

높이 값의 보간 계수를 가져옵니다.


##### Returns

`number`

높이 보간 계수 (0.01 ~ 1)


#### Set Signature

> **set** **heightInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:257](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L257)

높이 값의 보간 계수를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 보간 계수 (0.01 ~ 1)

##### Returns

`void`

***

### hoveredView

#### Get Signature

> **get** **hoveredView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:149](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L149)

**`Internal`**

현재 마우스가 호버링 중인 View를 반환합니다.


##### Returns

[`View3D`](../../Display/classes/View3D.md)

호버링 중인 View 또는 null


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`hoveredView`](../namespaces/Core/classes/AController.md#hoveredview)

***

### interpolation

#### Get Signature

> **get** **interpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:370](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L370)

전체 카메라 위치의 보간 계수를 가져옵니다.


##### Returns

`number`

보간 계수 (0.01 ~ 1)


#### Set Signature

> **set** **interpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:382](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L382)

전체 카메라 위치의 보간 계수를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 보간 계수 (0.01 ~ 1)

##### Returns

`void`

***

### isKeyboardActiveController

#### Get Signature

> **get** **isKeyboardActiveController**(): `boolean`

Defined in: [src/camera/core/AController.ts:195](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L195)

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

Defined in: [src/camera/core/AController.ts:162](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L162)

**`Internal`**

키보드 입력이 활성화된 View를 반환합니다.


##### Returns

[`View3D`](../../Display/classes/View3D.md)

키보드 활성 View 또는 null


#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:175](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L175)

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

Defined in: [src/camera/core/AController.ts:208](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L208)

**`Internal`**

이번 프레임에서 키보드 입력이 이미 처리되었는지 여부를 반환합니다.


##### Returns

`boolean`

처리 여부


#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:221](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L221)

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

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/core/AController.ts:98](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L98)

컨트롤러의 이름을 반환합니다.


##### Returns

`string`

컨트롤러 이름


#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/core/AController.ts:111](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L111)

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

Defined in: [src/camera/controller/FollowController.ts:270](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L270)

타겟을 중심으로 한 카메라의 가로 회전(팬) 각도를 가져옵니다.


##### Returns

`number`

팬 각도 (도 단위)


#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:282](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L282)

타겟을 중심으로 한 카메라의 가로 회전(팬) 각도를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 팬 각도 (도 단위)

##### Returns

`void`

***

### panInterpolation

#### Get Signature

> **get** **panInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:295](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L295)

팬 값의 보간 계수를 가져옵니다.


##### Returns

`number`

팬 보간 계수 (0.01 ~ 1)


#### Set Signature

> **set** **panInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:307](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L307)

팬 값의 보간 계수를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 보간 계수 (0.01 ~ 1)

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/camera/core/AController.ts:123](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L123)

RedGPU 컨텍스트를 반환합니다.


##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

RedGPU 컨텍스트


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

### targetMesh

#### Get Signature

> **get** **targetMesh**(): [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/camera/controller/FollowController.ts:494](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L494)

따라갈 대상 메시를 가져옵니다.


##### Returns

[`Mesh`](../../Display/classes/Mesh.md)

현재 타겟 메시


#### Set Signature

> **set** **targetMesh**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:509](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L509)

따라갈 대상 메시를 설정합니다.


##### Throws

value가 null이거나 undefined일 경우 에러 발생


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Mesh`](../../Display/classes/Mesh.md) | 설정할 타겟 메시

##### Returns

`void`

***

### targetOffsetX

#### Get Signature

> **get** **targetOffsetX**(): `number`

Defined in: [src/camera/controller/FollowController.ts:419](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L419)

타겟으로부터의 카메라 X축 오프셋을 가져옵니다.


##### Returns

`number`

X축 오프셋


#### Set Signature

> **set** **targetOffsetX**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:431](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L431)

타겟으로부터의 카메라 X축 오프셋을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X축 오프셋

##### Returns

`void`

***

### targetOffsetY

#### Get Signature

> **get** **targetOffsetY**(): `number`

Defined in: [src/camera/controller/FollowController.ts:444](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L444)

타겟으로부터의 카메라 Y축 오프셋을 가져옵니다.


##### Returns

`number`

Y축 오프셋


#### Set Signature

> **set** **targetOffsetY**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:456](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L456)

타겟으로부터의 카메라 Y축 오프셋을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y축 오프셋

##### Returns

`void`

***

### targetOffsetZ

#### Get Signature

> **get** **targetOffsetZ**(): `number`

Defined in: [src/camera/controller/FollowController.ts:469](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L469)

타겟으로부터의 카메라 Z축 오프셋을 가져옵니다.


##### Returns

`number`

Z축 오프셋


#### Set Signature

> **set** **targetOffsetZ**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:481](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L481)

타겟으로부터의 카메라 Z축 오프셋을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z축 오프셋

##### Returns

`void`

***

### tilt

#### Get Signature

> **get** **tilt**(): `number`

Defined in: [src/camera/controller/FollowController.ts:320](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L320)

타겟을 중심으로 한 카메라의 세로 회전(틸트) 각도를 가져옵니다.


##### Returns

`number`

틸트 각도 (도 단위, -89 ~ 89)


#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:332](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L332)

타겟을 중심으로 한 카메라의 세로 회전(틸트) 각도를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 틸트 각도 (도 단위)

##### Returns

`void`

***

### tiltInterpolation

#### Get Signature

> **get** **tiltInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:345](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L345)

틸트 값의 보간 계수를 가져옵니다.


##### Returns

`number`

틸트 보간 계수 (0.01 ~ 1)


#### Set Signature

> **set** **tiltInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:357](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L357)

틸트 값의 보간 계수를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 보간 계수 (0.01 ~ 1)

##### Returns

`void`

## Methods

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:283](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L283)

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

Defined in: [src/camera/core/AController.ts:229](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L229)

컨트롤러를 제거하고 이벤트 리스너를 해제합니다.


#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:367](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L367)

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

Defined in: [src/camera/core/AController.ts:330](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L330)

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
| `x` | `number` | [src/camera/core/AController.ts:350](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L350) |
| `y` | `number` | [src/camera/core/AController.ts:351](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/core/AController.ts#L351) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

### setTargetOffset()

> **setTargetOffset**(`x`, `y`, `z`): `void`

Defined in: [src/camera/controller/FollowController.ts:530](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L530)

카메라의 타겟 오프셋을 한 번에 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `x` | `number` | `undefined` | X축 오프셋
| `y` | `number` | `0` | Y축 오프셋 (기본값: 0)
| `z` | `number` | `0` | Z축 오프셋 (기본값: 0)

#### Returns

`void`

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/FollowController.ts:550](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/FollowController.ts#L550)

매 프레임마다 카메라의 위치와 방향을 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 카메라가 속한 3D 뷰
| `time` | `number` | 현재 시간 (ms)

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)
