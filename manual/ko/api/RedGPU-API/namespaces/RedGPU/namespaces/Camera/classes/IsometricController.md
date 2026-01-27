[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / IsometricController

# Class: IsometricController

Defined in: [src/camera/controller/IsometricController.ts:27](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L27)

등각 투영(Isometric) 시점을 제공하는 카메라 컨트롤러입니다.


거리감 없는 직교 투영을 사용하여 전략 시뮬레이션이나 타일 기반 게임에서 주로 사용되는 고정된 각도의 쿼터뷰(Quarter View)를 구현합니다.


* ### Example
```typescript
const controller = new RedGPU.Camera.IsometricController(redGPUContext);
controller.viewHeight = 15;
controller.zoom = 1;
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/isometricController/"></iframe>

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors

### Constructor

> **new IsometricController**(`redGPUContext`): `IsometricController`

Defined in: [src/camera/controller/IsometricController.ts:66](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L66)

IsometricController 생성자


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`IsometricController`

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

### keyNameMapper

#### Get Signature

> **get** **keyNameMapper**(): `object`

Defined in: [src/camera/controller/IsometricController.ts:398](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L398)

현재 키 매핑 설정을 가져옵니다.


##### Returns

`object`

키 매핑 객체의 복사본


| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `moveDown` | `string` | `'s'` | [src/camera/controller/IsometricController.ts:50](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L50) |
| `moveLeft` | `string` | `'a'` | [src/camera/controller/IsometricController.ts:51](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L51) |
| `moveRight` | `string` | `'d'` | [src/camera/controller/IsometricController.ts:52](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L52) |
| `moveUp` | `string` | `'w'` | [src/camera/controller/IsometricController.ts:49](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L49) |

***

### maxZoom

#### Get Signature

> **get** **maxZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:219](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L219)

최대 줌 레벨을 가져옵니다.


##### Returns

`number`

최대 줌 레벨


#### Set Signature

> **set** **maxZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:231](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L231)

최대 줌 레벨을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 최대 줌 레벨 (0.01 이상)

##### Returns

`void`

***

### minZoom

#### Get Signature

> **get** **minZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:193](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L193)

최소 줌 레벨을 가져옵니다.


##### Returns

`number`

최소 줌 레벨


#### Set Signature

> **set** **minZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:205](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L205)

최소 줌 레벨을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 최소 줌 레벨 (0.01 이상)

##### Returns

`void`

***

### mouseMoveSpeed

#### Get Signature

> **get** **mouseMoveSpeed**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:347](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L347)

마우스 이동 속도를 가져옵니다.


##### Returns

`number`

마우스 이동 속도


#### Set Signature

> **set** **mouseMoveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:359](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L359)

마우스 이동 속도를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 마우스 이동 속도 (0.01 이상)

##### Returns

`void`

***

### mouseMoveSpeedInterpolation

#### Get Signature

> **get** **mouseMoveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:372](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L372)

마우스 이동 보간 계수를 가져옵니다.


##### Returns

`number`

마우스 이동 보간 계수 (0.01 ~ 1)


#### Set Signature

> **set** **mouseMoveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:384](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L384)

마우스 이동 보간 계수를 설정합니다. 낮을수록 부드러운 움직임


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 보간 계수 (0.01 ~ 1)

##### Returns

`void`

***

### moveSpeed

#### Get Signature

> **get** **moveSpeed**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:297](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L297)

키보드 이동 속도를 가져옵니다.


##### Returns

`number`

이동 속도


#### Set Signature

> **set** **moveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:309](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L309)

키보드 이동 속도를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 이동 속도 (0.01 이상)

##### Returns

`void`

***

### moveSpeedInterpolation

#### Get Signature

> **get** **moveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:322](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L322)

키보드 이동 보간 계수를 가져옵니다.


##### Returns

`number`

이동 보간 계수 (0.01 ~ 1)


#### Set Signature

> **set** **moveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:334](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L334)

키보드 이동 보간 계수를 설정합니다. 낮을수록 부드러운 움직임


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 보간 계수 (0.01 ~ 1)

##### Returns

`void`

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

### speedZoom

#### Get Signature

> **get** **speedZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:168](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L168)

줌 속도를 가져옵니다.


##### Returns

`number`

줌 속도


#### Set Signature

> **set** **speedZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:180](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L180)

줌 속도를 설정합니다. 높을수록 빠른 줌 속도


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 줌 속도 (0.01 이상)

##### Returns

`void`

***

### viewHeight

#### Get Signature

> **get** **viewHeight**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:246](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L246)

직교 투영 카메라의 뷰 높이를 가져옵니다.


##### Returns

`number`

뷰 높이


#### Set Signature

> **set** **viewHeight**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:258](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L258)

직교 투영 카메라의 뷰 높이를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 뷰 높이 (0.1 이상)

##### Returns

`void`

***

### viewHeightInterpolation

#### Get Signature

> **get** **viewHeightInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:271](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L271)

뷰 높이 보간 계수를 가져옵니다.


##### Returns

`number`

뷰 높이 보간 계수 (0.01 ~ 1)


#### Set Signature

> **set** **viewHeightInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:283](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L283)

뷰 높이 보간 계수를 설정합니다. 낮을수록 부드러운 변화


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 보간 계수 (0.01 ~ 1)

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:411](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L411)

타겟의 X축 위치를 가져옵니다.


##### Returns

`number`

X축 좌표


***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:423](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L423)

타겟의 Y축 위치를 가져옵니다.


##### Returns

`number`

Y축 좌표


***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:435](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L435)

타겟의 Z축 위치를 가져옵니다.


##### Returns

`number`

Z축 좌표


***

### zoom

#### Get Signature

> **get** **zoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:117](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L117)

줌 레벨을 가져옵니다.


##### Returns

`number`

줌 레벨 (기본값: 1)


#### Set Signature

> **set** **zoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:129](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L129)

줌 레벨을 설정합니다. minZoom ~ maxZoom 범위로 제한됩니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 줌 레벨 값

##### Returns

`void`

***

### zoomInterpolation

#### Get Signature

> **get** **zoomInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:143](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L143)

줌 보간 계수를 가져옵니다.


##### Returns

`number`

줌 보간 계수 (0.01 ~ 1)


#### Set Signature

> **set** **zoomInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:155](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L155)

줌 보간 계수를 설정합니다. 낮을수록 부드러운 줌 이동


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

### setMoveDownKey()

> **setMoveDownKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:459](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L459)

하향 이동 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름

#### Returns

`void`

***

### setMoveLeftKey()

> **setMoveLeftKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:471](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L471)

좌측 이동 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름

#### Returns

`void`

***

### setMoveRightKey()

> **setMoveRightKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:483](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L483)

우측 이동 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름

#### Returns

`void`

***

### setMoveUpKey()

> **setMoveUpKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:447](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L447)

상향 이동 키를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 키 이름

#### Returns

`void`

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/IsometricController.ts:499](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/camera/controller/IsometricController.ts#L499)

매 프레임마다 아이소메트릭 카메라를 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 카메라가 속한 3D 뷰
| `time` | `number` | 현재 시간 (ms)

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)
