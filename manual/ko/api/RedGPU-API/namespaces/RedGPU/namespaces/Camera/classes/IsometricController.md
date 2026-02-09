[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / IsometricController

# Class: IsometricController

Defined in: [src/camera/controller/IsometricController.ts:26](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L26)

등각 투영(Isometric) 시점을 제공하는 카메라 컨트롤러입니다.


거리감 없는 직교 투영을 사용하여 전략 시뮬레이션이나 타일 기반 게임에서 주로 사용되는 고정된 각도의 쿼터뷰(Quarter View)를 구현합니다.


* ### Example
```typescript
const controller = new RedGPU.IsometricController(redGPUContext);
controller.viewHeight = 15;
controller.zoom = 1;
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:500px;"></iframe>

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors

### Constructor

> **new IsometricController**(`redGPUContext`): `IsometricController`

Defined in: [src/camera/controller/IsometricController.ts:64](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L64)

IsometricController 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`IsometricController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors

### camera

#### Get Signature

> **get** **camera**(): [`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:138](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L138)

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

Defined in: [src/camera/core/AController.ts:187](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L187)

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

Defined in: [src/camera/core/AController.ts:233](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L233)

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

Defined in: [src/camera/core/AController.ts:200](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L200)

**`Internal`**

키보드 입력이 활성화된 View를 반환합니다.


##### Returns

[`View3D`](../../Display/classes/View3D.md)

키보드 활성 View 또는 null


#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:213](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L213)

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

Defined in: [src/camera/core/AController.ts:246](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L246)

**`Internal`**

이번 프레임에서 키보드 입력이 이미 처리되었는지 여부를 반환합니다.


##### Returns

`boolean`

처리 여부


#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:259](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L259)

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

Defined in: [src/camera/controller/IsometricController.ts:156](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L156)

키 매핑 설정

##### Returns

`object`

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `moveDown` | `string` | `'s'` | [src/camera/controller/IsometricController.ts:49](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L49) |
| `moveLeft` | `string` | `'a'` | [src/camera/controller/IsometricController.ts:50](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L50) |
| `moveRight` | `string` | `'d'` | [src/camera/controller/IsometricController.ts:51](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L51) |
| `moveUp` | `string` | `'w'` | [src/camera/controller/IsometricController.ts:48](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L48) |

***

### maxZoom

#### Get Signature

> **get** **maxZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:128](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L128)

최대 줌

##### Returns

`number`

#### Set Signature

> **set** **maxZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:129](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L129)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minZoom

#### Get Signature

> **get** **minZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:124](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L124)

최소 줌

##### Returns

`number`

#### Set Signature

> **set** **minZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:125](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L125)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### mouseMoveSpeed

#### Get Signature

> **get** **mouseMoveSpeed**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:148](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L148)

마우스 이동 속도

##### Returns

`number`

#### Set Signature

> **set** **mouseMoveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:149](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L149)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### mouseMoveSpeedInterpolation

#### Get Signature

> **get** **mouseMoveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:152](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L152)

마우스 이동 보간 계수

##### Returns

`number`

#### Set Signature

> **set** **mouseMoveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:153](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L153)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### moveSpeed

#### Get Signature

> **get** **moveSpeed**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:140](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L140)

이동 속도

##### Returns

`number`

#### Set Signature

> **set** **moveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:141](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L141)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### moveSpeedInterpolation

#### Get Signature

> **get** **moveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:144](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L144)

이동 보간 계수

##### Returns

`number`

#### Set Signature

> **set** **moveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:145](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L145)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/core/AController.ts:101](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L101)

컨트롤러의 이름을 반환합니다.


##### Returns

`string`

컨트롤러 이름


#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/core/AController.ts:114](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L114)

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

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/camera/core/AController.ts:126](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L126)

RedGPU 컨텍스트를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPU 컨텍스트


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

### speedZoom

#### Get Signature

> **get** **speedZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:120](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L120)

줌 속도

##### Returns

`number`

#### Set Signature

> **set** **speedZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:121](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L121)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### targetX

#### Get Signature

> **get** **targetX**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:159](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L159)

타겟 X 위치

##### Returns

`number`

***

### targetY

#### Get Signature

> **get** **targetY**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:161](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L161)

타겟 Y 위치

##### Returns

`number`

***

### targetZ

#### Get Signature

> **get** **targetZ**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:163](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L163)

타겟 Z 위치

##### Returns

`number`

***

### viewHeight

#### Get Signature

> **get** **viewHeight**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:132](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L132)

뷰 높이

##### Returns

`number`

#### Set Signature

> **set** **viewHeight**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:133](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L133)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### viewHeightInterpolation

#### Get Signature

> **get** **viewHeightInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:136](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L136)

뷰 높이 보간 계수

##### Returns

`number`

#### Set Signature

> **set** **viewHeightInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:137](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L137)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L150)

카메라의 현재 월드 X 좌표를 가져옵니다.


##### Returns

`number`

X 좌표


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`x`](../namespaces/Core/classes/AController.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/core/AController.ts:162](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L162)

카메라의 현재 월드 Y 좌표를 가져옵니다.


##### Returns

`number`

Y 좌표


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`y`](../namespaces/Core/classes/AController.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/core/AController.ts:174](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L174)

카메라의 현재 월드 Z 좌표를 가져옵니다.


##### Returns

`number`

Z 좌표


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

***

### zoom

#### Get Signature

> **get** **zoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:104](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L104)

줌 레벨을 가져옵니다.


##### Returns

`number`

줌 레벨

#### Set Signature

> **set** **zoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:110](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L110)

줌 레벨을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 줌 레벨

##### Returns

`void`

***

### zoomInterpolation

#### Get Signature

> **get** **zoomInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:116](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L116)

줌 보간 계수

##### Returns

`number`

#### Set Signature

> **set** **zoomInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:117](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L117)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:323](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L323)

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

Defined in: [src/camera/core/AController.ts:267](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L267)

컨트롤러를 제거하고 이벤트 리스너를 해제합니다.


#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:407](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L407)

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

Defined in: [src/camera/core/AController.ts:370](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L370)

**`Internal`**

캔버스 상의 이벤트 좌표를 가져옵니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` \| `WheelEvent` | 마우스, 터치 또는 휠 이벤트
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`object`

{x, y} 좌표 객체


| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/camera/core/AController.ts:390](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L390) |
| `y` | `number` | [src/camera/core/AController.ts:391](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L391) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

### setMoveDownKey()

> **setMoveDownKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:168](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L168)

하향 이동 키 설정

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setMoveLeftKey()

> **setMoveLeftKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:170](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L170)

좌측 이동 키 설정

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setMoveRightKey()

> **setMoveRightKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:172](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L172)

우측 이동 키 설정

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setMoveUpKey()

> **setMoveUpKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:166](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L166)

상향 이동 키 설정

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/IsometricController.ts:180](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/IsometricController.ts#L180)

매 프레임마다 카메라를 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 3D 뷰
| `time` | `number` | 현재 시간

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)
