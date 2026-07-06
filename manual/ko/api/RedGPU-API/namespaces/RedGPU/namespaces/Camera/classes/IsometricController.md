[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / IsometricController

# Class: IsometricController

Defined in: [src/camera/controller/IsometricController.ts:26](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L26)

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

Defined in: [src/camera/controller/IsometricController.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L64)

IsometricController 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`IsometricController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Properties

### keyNameMapper

#### Get Signature

> **get** **keyNameMapper**(): `object`

Defined in: [src/camera/controller/IsometricController.ts:221](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L221)

키 매핑 설정

##### Returns

`object`

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `moveDown` | `string` | `'s'` | [src/camera/controller/IsometricController.ts:49](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L49) |
| `moveLeft` | `string` | `'a'` | [src/camera/controller/IsometricController.ts:50](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L50) |
| `moveRight` | `string` | `'d'` | [src/camera/controller/IsometricController.ts:51](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L51) |
| `moveUp` | `string` | `'w'` | [src/camera/controller/IsometricController.ts:48](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L48) |

***

### maxZoom

#### Get Signature

> **get** **maxZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:150](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L150)

최대 줌

##### Returns

`number`

#### Set Signature

> **set** **maxZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:154](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L154)

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

Defined in: [src/camera/controller/IsometricController.ts:139](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L139)

최소 줌

##### Returns

`number`

#### Set Signature

> **set** **minZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:143](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L143)

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

Defined in: [src/camera/controller/IsometricController.ts:201](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L201)

마우스 이동 속도

##### Returns

`number`

#### Set Signature

> **set** **mouseMoveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:205](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L205)

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

Defined in: [src/camera/controller/IsometricController.ts:211](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L211)

마우스 이동 보간 계수

##### Returns

`number`

#### Set Signature

> **set** **mouseMoveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:215](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L215)

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

Defined in: [src/camera/controller/IsometricController.ts:181](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L181)

이동 속도

##### Returns

`number`

#### Set Signature

> **set** **moveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:185](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L185)

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

Defined in: [src/camera/controller/IsometricController.ts:191](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L191)

이동 보간 계수

##### Returns

`number`

#### Set Signature

> **set** **moveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:195](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### speedZoom

#### Get Signature

> **get** **speedZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:129](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L129)

줌 속도

##### Returns

`number`

#### Set Signature

> **set** **speedZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:133](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L133)

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

Defined in: [src/camera/controller/IsometricController.ts:226](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L226)

타겟 X 위치

##### Returns

`number`

***

### targetY

#### Get Signature

> **get** **targetY**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:231](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L231)

타겟 Y 위치

##### Returns

`number`

***

### targetZ

#### Get Signature

> **get** **targetZ**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:236](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L236)

타겟 Z 위치

##### Returns

`number`

***

### viewHeight

#### Get Signature

> **get** **viewHeight**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:161](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L161)

뷰 높이

##### Returns

`number`

#### Set Signature

> **set** **viewHeight**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:165](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L165)

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

Defined in: [src/camera/controller/IsometricController.ts:171](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L171)

뷰 높이 보간 계수

##### Returns

`number`

#### Set Signature

> **set** **viewHeightInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:175](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L175)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### zoom

#### Get Signature

> **get** **zoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:104](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L104)

줌 레벨을 가져옵니다.

##### Returns

`number`

줌 레벨

#### Set Signature

> **set** **zoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:113](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L113)

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

Defined in: [src/camera/controller/IsometricController.ts:119](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L119)

줌 보간 계수

##### Returns

`number`

#### Set Signature

> **set** **zoomInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:123](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L123)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods

### setMoveDownKey()

> **setMoveDownKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:246](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L246)

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

Defined in: [src/camera/controller/IsometricController.ts:251](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L251)

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

Defined in: [src/camera/controller/IsometricController.ts:256](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L256)

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

Defined in: [src/camera/controller/IsometricController.ts:241](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L241)

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

Defined in: [src/camera/controller/IsometricController.ts:266](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/IsometricController.ts#L266)

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


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`instanceId`](../namespaces/Core/classes/AController.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`antialiasingManager`](../namespaces/Core/classes/AController.md#antialiasingmanager)

***

### camera

#### Get Signature

> **get** **camera**(): [`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:100](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L100)

이 컨트롤러가 제어하는 카메라를 반환합니다.

##### Returns

[`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

제어 중인 카메라 (PerspectiveCamera 또는 OrthographicCamera)

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`camera`](../namespaces/Core/classes/AController.md#camera)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`commandEncoderManager`](../namespaces/Core/classes/AController.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`gpuDevice`](../namespaces/Core/classes/AController.md#gpudevice)

***

### hoveredView

#### Get Signature

> **get** **hoveredView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L150)

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

Defined in: [src/camera/core/AController.ts:196](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L196)

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

Defined in: [src/camera/core/AController.ts:163](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L163)

**`Internal`**

키보드 입력이 활성화된 View를 반환합니다.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

키보드 활성 View 또는 null

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:176](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L176)

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

Defined in: [src/camera/core/AController.ts:209](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L209)

**`Internal`**

이번 프레임에서 키보드 입력이 이미 처리되었는지 여부를 반환합니다.

##### Returns

`boolean`

처리 여부

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:222](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L222)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`name`](../namespaces/Core/classes/AController.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`resourceManager`](../namespaces/Core/classes/AController.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`uuid`](../namespaces/Core/classes/AController.md#uuid)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/core/AController.ts:112](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L112)

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

Defined in: [src/camera/core/AController.ts:124](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L124)

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

Defined in: [src/camera/core/AController.ts:136](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L136)

카메라의 현재 월드 Z 좌표를 가져옵니다.

##### Returns

`number`

Z 좌표

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

***

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:286](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L286)

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

Defined in: [src/camera/core/AController.ts:230](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L230)

컨트롤러를 제거하고 이벤트 리스너를 해제합니다.

#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:369](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L369)

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

Defined in: [src/camera/core/AController.ts:333](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L333)

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
| `x` | `number` | [src/camera/core/AController.ts:352](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L352) |
| `y` | `number` | [src/camera/core/AController.ts:353](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L353) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***


</details>
