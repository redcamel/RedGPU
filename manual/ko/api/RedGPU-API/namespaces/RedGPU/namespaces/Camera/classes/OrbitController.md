[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / OrbitController

# Class: OrbitController

Defined in: [src/camera/controller/OrbitController.ts:34](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L34)

특정 지점을 중심으로 회전하는 궤도형 카메라 컨트롤러입니다.


제품 모델링 뷰어나 3D 객체 관찰용으로 주로 사용되며, 중심점을 기준으로 줌, 회전, 팬(Pan) 동작을 통해 대상을 다각도에서 살펴볼 수 있습니다.


### Example
```typescript
const controller = new RedGPU.OrbitController(redGPUContext);
controller.centerX = 0;
controller.centerY = 0;
controller.centerZ = 0;
controller.distance = 20;
controller.tilt = -30;
controller.pan = 45;
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/orbitController/" style="width:100%; height:500px;"></iframe>

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors

### Constructor

> **new OrbitController**(`redGPUContext`): `OrbitController`

Defined in: [src/camera/controller/OrbitController.ts:71](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L71)

OrbitController 인스턴스를 생성합니다.


### Example
```typescript
const controller = new RedGPU.OrbitController(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`OrbitController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors

### camera

#### Get Signature

> **get** **camera**(): [`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:138](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L138)

이 컨트롤러가 제어하는 카메라를 반환합니다.


##### Returns

[`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

제어 중인 카메라 (PerspectiveCamera 또는 OrthographicCamera)


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`camera`](../namespaces/Core/classes/AController.md#camera)

***

### centerX

#### Get Signature

> **get** **centerX**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:105](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L105)

회전 중심의 X축 좌표를 가져옵니다.


##### Returns

`number`

중심점 X축 좌표


#### Set Signature

> **set** **centerX**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:117](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L117)

회전 중심의 X축 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 중심점 X축 좌표

##### Returns

`void`

***

### centerY

#### Get Signature

> **get** **centerY**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:129](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L129)

회전 중심의 Y축 좌표를 가져옵니다.


##### Returns

`number`

중심점 Y축 좌표


#### Set Signature

> **set** **centerY**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:141](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L141)

회전 중심의 Y축 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 중심점 Y축 좌표

##### Returns

`void`

***

### centerZ

#### Get Signature

> **get** **centerZ**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:153](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L153)

회전 중심의 Z축 좌표를 가져옵니다.


##### Returns

`number`

중심점 Z축 좌표


#### Set Signature

> **set** **centerZ**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:165](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L165)

회전 중심의 Z축 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 중심점 Z축 좌표

##### Returns

`void`

***

### distance

#### Get Signature

> **get** **distance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:178](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L178)

중심점으로부터 카메라까지의 거리를 가져옵니다.


##### Returns

`number`

거리 값


#### Set Signature

> **set** **distance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:190](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L190)

중심점으로부터 카메라까지의 거리를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 거리 값 (0 이상)

##### Returns

`void`

***

### distanceInterpolation

#### Get Signature

> **get** **distanceInterpolation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:228](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L228)

거리 보간 계수를 가져옵니다.


##### Returns

`number`

거리 보간 계수 (0.01 ~ 1)


#### Set Signature

> **set** **distanceInterpolation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:240](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L240)

거리 보간 계수를 설정합니다. 낮을수록 부드러운 줌 이동


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

Defined in: [src/camera/core/AController.ts:187](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L187)

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

Defined in: [src/camera/core/AController.ts:233](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L233)

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

Defined in: [src/camera/core/AController.ts:200](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L200)

**`Internal`**

키보드 입력이 활성화된 View를 반환합니다.


##### Returns

[`View3D`](../../Display/classes/View3D.md)

키보드 활성 View 또는 null


#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:213](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L213)

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

Defined in: [src/camera/core/AController.ts:246](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L246)

**`Internal`**

이번 프레임에서 키보드 입력이 이미 처리되었는지 여부를 반환합니다.


##### Returns

`boolean`

처리 여부


#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:259](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L259)

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

### maxDistance

#### Get Signature

> **get** **maxDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:278](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L278)

최대 줌 거리를 가져옵니다.


##### Returns

`number`

최대 거리


#### Set Signature

> **set** **maxDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:290](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L290)

최대 줌 거리를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 최대 거리 (0.1 이상)

##### Returns

`void`

***

### maxTilt

#### Get Signature

> **get** **maxTilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:429](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L429)

최대 틸트 각도를 가져옵니다.


##### Returns

`number`

최대 틸트 각도


#### Set Signature

> **set** **maxTilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:441](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L441)

최대 틸트 각도를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 최대 틸트 각도 (-90 ~ 90)

##### Returns

`void`

***

### minDistance

#### Get Signature

> **get** **minDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:253](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L253)

최소 줌 거리를 가져옵니다.


##### Returns

`number`

최소 거리


#### Set Signature

> **set** **minDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:265](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L265)

최소 줌 거리를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 최소 거리 (0.1 이상)

##### Returns

`void`

***

### minTilt

#### Get Signature

> **get** **minTilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:404](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L404)

최소 틸트 각도를 가져옵니다.


##### Returns

`number`

최소 틸트 각도


#### Set Signature

> **set** **minTilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:416](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L416)

최소 틸트 각도를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 최소 틸트 각도 (-90 ~ 90)

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/core/AController.ts:101](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L101)

컨트롤러의 이름을 반환합니다.


##### Returns

`string`

컨트롤러 이름


#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/core/AController.ts:114](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L114)

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

Defined in: [src/camera/controller/OrbitController.ts:355](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L355)

카메라의 팬(가로 회전) 각도를 가져옵니다. (단위: 도)


##### Returns

`number`

팬 각도 값


#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:367](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L367)

카메라의 팬(가로 회전) 각도를 설정합니다. (단위: 도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 팬 각도 값

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/camera/core/AController.ts:126](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L126)

RedGPU 컨텍스트를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPU 컨텍스트


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

### rotationInterpolation

#### Get Signature

> **get** **rotationInterpolation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:329](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L329)

회전 보간 계수를 가져옵니다.


##### Returns

`number`

회전 보간 계수 (0.01 ~ 1)


#### Set Signature

> **set** **rotationInterpolation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:341](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L341)

회전 보간 계수를 설정합니다. 낮을수록 부드러운 회전


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 보간 계수 (0.01 ~ 1)

##### Returns

`void`

***

### speedDistance

#### Get Signature

> **get** **speedDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:203](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L203)

거리 조절 속도를 가져옵니다.


##### Returns

`number`

거리 변화 속도


#### Set Signature

> **set** **speedDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:215](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L215)

거리 조절 속도를 설정합니다. 높을수록 빠른 줌 속도


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 거리 변화 속도 (0.01 이상)

##### Returns

`void`

***

### speedRotation

#### Get Signature

> **get** **speedRotation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:304](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L304)

회전 속도를 가져옵니다.


##### Returns

`number`

회전 속도 값


#### Set Signature

> **set** **speedRotation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:316](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L316)

회전 속도를 설정합니다. 높을수록 빠른 회전 속도


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전 속도 값 (0.01 이상)

##### Returns

`void`

***

### tilt

#### Get Signature

> **get** **tilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:379](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L379)

카메라의 틸트(세로 회전) 각도를 가져옵니다. (단위: 도, 범위: -90 ~ 90)


##### Returns

`number`

틸트 각도 값


#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:391](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L391)

카메라의 틸트(세로 회전) 각도를 설정합니다. (단위: 도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 틸트 각도 값 (-90 ~ 90 범위로 제한됨)

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L150)

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

Defined in: [src/camera/core/AController.ts:162](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L162)

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

Defined in: [src/camera/core/AController.ts:174](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L174)

카메라의 현재 월드 Z 좌표를 가져옵니다.


##### Returns

`number`

Z 좌표


#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

## Methods

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:323](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L323)

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

Defined in: [src/camera/core/AController.ts:267](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L267)

컨트롤러를 제거하고 이벤트 리스너를 해제합니다.


#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:407](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L407)

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

### fitMeshToScreenCenter()

> **fitMeshToScreenCenter**(`mesh`, `view`): `void`

Defined in: [src/camera/controller/OrbitController.ts:474](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L474)

메쉬가 화면 중앙에 꽉 차도록 카메라 거리를 자동으로 조절합니다.


### Example
```typescript
controller.fitMeshToScreenCenter(mesh, view);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | 화면에 맞출 대상 메쉬
| `view` | [`View3D`](../../Display/classes/View3D.md) | 현재 뷰 인스턴스

#### Returns

`void`

***

### getCanvasEventPoint()

> **getCanvasEventPoint**(`e`, `redGPUContext`): `object`

Defined in: [src/camera/core/AController.ts:370](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L370)

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
| `x` | `number` | [src/camera/core/AController.ts:390](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L390) |
| `y` | `number` | [src/camera/core/AController.ts:391](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/core/AController.ts#L391) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/OrbitController.ts:542](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/controller/OrbitController.ts#L542)

매 프레임마다 오빗 카메라를 업데이트합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 카메라가 속한 3D 뷰
| `time` | `number` | 현재 시간 (ms)

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)
