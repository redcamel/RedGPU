[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Camera](../../../README.md) / [Core](../README.md) / AController

# Abstract Class: AController

Defined in: [src/camera/core/AController.ts:29](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L29)

카메라 컨트롤러의 추상 클래스입니다.


PerspectiveCamera, OrthographicCamera 등 다양한 카메라 타입을 제어하는 공통 인터페이스를 제공합니다.


::: warning
이 클래스는 시스템 내부적으로 사용되는 추상 클래스입니다.<br/>직접적인 인스턴스 생성은 불가능하며, 필요한 경우 이를 상속받아 구현하십시오.

:::

## Extended by

- [`FreeController`](../../../classes/FreeController.md)
- [`FollowController`](../../../classes/FollowController.md)
- [`OrbitController`](../../../classes/OrbitController.md)
- [`IsometricController`](../../../classes/IsometricController.md)

## Constructors

### Constructor

> **new AController**(`redGPUContext`, `initInfo`): `AController`

Defined in: [src/camera/core/AController.ts:79](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L79)

AController 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트
| `initInfo` | `controllerInit` | 컨트롤러 초기화 정보

#### Returns

`AController`

## Accessors

### camera

#### Get Signature

> **get** **camera**(): [`PerspectiveCamera`](../../../classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../classes/OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:138](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L138)

이 컨트롤러가 제어하는 카메라를 반환합니다.


##### Returns

[`PerspectiveCamera`](../../../classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../classes/OrthographicCamera.md)

제어 중인 카메라 (PerspectiveCamera 또는 OrthographicCamera)


***

### hoveredView

#### Get Signature

> **get** **hoveredView**(): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:187](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L187)

**`Internal`**

현재 마우스가 호버링 중인 View를 반환합니다.


##### Returns

[`View3D`](../../../../Display/classes/View3D.md)

호버링 중인 View 또는 null


***

### isKeyboardActiveController

#### Get Signature

> **get** **isKeyboardActiveController**(): `boolean`

Defined in: [src/camera/core/AController.ts:233](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L233)

**`Internal`**

현재 컨트롤러가 키보드 입력을 처리 중인지 여부를 반환합니다.


##### Returns

`boolean`

키보드 활성 컨트롤러 여부


***

### keyboardActiveView

#### Get Signature

> **get** **keyboardActiveView**(): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:200](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L200)

**`Internal`**

키보드 입력이 활성화된 View를 반환합니다.


##### Returns

[`View3D`](../../../../Display/classes/View3D.md)

키보드 활성 View 또는 null


#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:213](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L213)

**`Internal`**

키보드 입력이 활성화된 View를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`View3D`](../../../../Display/classes/View3D.md) | 설정할 View 또는 null

##### Returns

`void`

***

### keyboardProcessedThisFrame

#### Get Signature

> **get** **keyboardProcessedThisFrame**(): `boolean`

Defined in: [src/camera/core/AController.ts:246](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L246)

**`Internal`**

이번 프레임에서 키보드 입력이 이미 처리되었는지 여부를 반환합니다.


##### Returns

`boolean`

처리 여부


#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:259](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L259)

**`Internal`**

이번 프레임에서 키보드 입력이 처리되었는지 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 설정할 처리 여부

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/core/AController.ts:101](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L101)

컨트롤러의 이름을 반환합니다.


##### Returns

`string`

컨트롤러 이름


#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/core/AController.ts:114](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L114)

컨트롤러의 이름을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 이름

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/camera/core/AController.ts:126](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L126)

RedGPU 컨텍스트를 반환합니다.


##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPU 컨텍스트


***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L150)

카메라의 현재 월드 X 좌표를 가져옵니다.


##### Returns

`number`

X 좌표


***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/core/AController.ts:162](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L162)

카메라의 현재 월드 Y 좌표를 가져옵니다.


##### Returns

`number`

Y 좌표


***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/core/AController.ts:174](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L174)

카메라의 현재 월드 Z 좌표를 가져옵니다.


##### Returns

`number`

Z 좌표


## Methods

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:323](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L323)

키보드 입력이 있는지 체크하고 활성 View를 설정합니다.


#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `string`\> |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 현재 View
| `keyNameMapper` | `T` | 키 매핑 객체

#### Returns

`boolean`

키보드 입력 처리가 가능하면 true, 아니면 false


***

### destroy()

> **destroy**(): `void`

Defined in: [src/camera/core/AController.ts:267](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L267)

컨트롤러를 제거하고 이벤트 리스너를 해제합니다.


#### Returns

`void`

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:407](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L407)

**`Internal`**

입력 이벤트가 발생한 View를 찾습니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` | 마우스 또는 터치 이벤트

#### Returns

[`View3D`](../../../../Display/classes/View3D.md)

해당 View 또는 null


***

### getCanvasEventPoint()

> **getCanvasEventPoint**(`e`, `redGPUContext`): `object`

Defined in: [src/camera/core/AController.ts:370](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L370)

**`Internal`**

캔버스 상의 이벤트 좌표를 가져옵니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` \| `WheelEvent` | 마우스, 터치 또는 휠 이벤트
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`object`

{x, y} 좌표 객체


| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/camera/core/AController.ts:390](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L390) |
| `y` | `number` | [src/camera/core/AController.ts:391](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L391) |

***

### update()

> **update**(`view`, `time`, `updateAnimation`): `void`

Defined in: [src/camera/core/AController.ts:294](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/core/AController.ts#L294)

컨트롤러 상태를 업데이트합니다. 파생 클래스에서 구현해야 합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 현재 View
| `time` | `number` | 현재 시간 (ms)
| `updateAnimation` | (`deltaTime`) => `void` | 애니메이션 업데이트 콜백 (deltaTime 전달)

#### Returns

`void`
