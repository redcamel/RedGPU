[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / OrthographicCamera

# Class: OrthographicCamera

Defined in: [src/camera/camera/OrthographicCamera.ts:23](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L23)

직교 투영을 사용하는 카메라입니다.


이 투영 모드에서는 객체의 크기가 카메라로부터의 거리에 관계없이 일정하게 유지됩니다. 주로 2D 뷰포트나 설계도면 같은 정투영 뷰를 구현할 때 사용됩니다.


* ### Example
```typescript
const camera = new RedGPU.Camera.OrthographicCamera();
camera.top = 10;
camera.bottom = -10;
camera.left = -20;
camera.right = 20;
```

## Extends

- [`PerspectiveCamera`](PerspectiveCamera.md)

## Constructors

### Constructor

> **new OrthographicCamera**(): `OrthographicCamera`

Defined in: [src/camera/camera/OrthographicCamera.ts:82](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L82)

OrthographicCamera 인스턴스를 생성합니다.


#### Returns

`OrthographicCamera`

#### Overrides

[`PerspectiveCamera`](PerspectiveCamera.md).[`constructor`](PerspectiveCamera.md#constructor)

## Accessors

### bottom

#### Get Signature

> **get** **bottom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:121](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L121)

투영 하단 값을 반환합니다.


##### Returns

`number`

투영 하단 값


#### Set Signature

> **set** **bottom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:133](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L133)

투영 하단 값을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 하단 값

##### Returns

`void`

***

### farClipping

#### Get Signature

> **get** **farClipping**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:240](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L240)

원평면(far) 거리를 반환합니다.


##### Returns

`number`

원평면 거리


#### Set Signature

> **set** **farClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:252](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L252)

원평면(far) 거리를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 원평면 거리

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`farClipping`](PerspectiveCamera.md#farclipping)

***

### fieldOfView

#### Get Signature

> **get** **fieldOfView**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:190](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L190)

시야각(FOV)을 반환합니다. (도)


##### Returns

`number`

시야각


#### Set Signature

> **set** **fieldOfView**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:202](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L202)

시야각(FOV)을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 시야각

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`fieldOfView`](PerspectiveCamera.md#fieldofview)

***

### left

#### Get Signature

> **get** **left**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:146](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L146)

투영 좌측 값을 반환합니다.


##### Returns

`number`

투영 좌측 값


#### Set Signature

> **set** **left**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:158](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L158)

투영 좌측 값을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 좌측 값

##### Returns

`void`

***

### maxZoom

#### Get Signature

> **get** **maxZoom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:246](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L246)

최대 줌 레벨을 반환합니다.


##### Returns

`number`

최대 줌 레벨


#### Set Signature

> **set** **maxZoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:258](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L258)

최대 줌 레벨을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 최대 줌 (0.01 이상)

##### Returns

`void`

***

### minZoom

#### Get Signature

> **get** **minZoom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:221](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L221)

최소 줌 레벨을 반환합니다.


##### Returns

`number`

최소 줌 레벨


#### Set Signature

> **set** **minZoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:233](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L233)

최소 줌 레벨을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 최소 줌 (0.01 이상)

##### Returns

`void`

***

### modelMatrix

#### Get Signature

> **get** **modelMatrix**(): [`mat4`](../../../type-aliases/mat4.md)

Defined in: [src/camera/camera/PerspectiveCamera.ts:290](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L290)

모델 행렬을 반환합니다.


##### Returns

[`mat4`](../../../type-aliases/mat4.md)

모델 행렬


#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`modelMatrix`](PerspectiveCamera.md#modelmatrix)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/camera/OrthographicCamera.ts:271](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L271)

카메라 이름을 반환합니다.


##### Returns

`string`

카메라 이름


#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:284](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L284)

카메라 이름을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 이름

##### Returns

`void`

#### Overrides

[`PerspectiveCamera`](PerspectiveCamera.md).[`name`](PerspectiveCamera.md#name)

***

### nearClipping

#### Get Signature

> **get** **nearClipping**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:215](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L215)

근평면(near) 거리를 반환합니다.


##### Returns

`number`

근평면 거리


#### Set Signature

> **set** **nearClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:227](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L227)

근평면(near) 거리를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 근평면 거리

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`nearClipping`](PerspectiveCamera.md#nearclipping)

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/camera/camera/PerspectiveCamera.ts:377](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L377)

카메라 위치 (x, y, z)를 반환합니다.


##### Returns

\[`number`, `number`, `number`\]

[x, y, z] 좌표 배열


#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`position`](PerspectiveCamera.md#position)

***

### right

#### Get Signature

> **get** **right**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:171](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L171)

투영 우측 값을 반환합니다.


##### Returns

`number`

투영 우측 값


#### Set Signature

> **set** **right**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:183](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L183)

투영 우측 값을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 우측 값

##### Returns

`void`

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:118](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L118)

X축 회전값을 반환합니다. (라디안)


##### Returns

`number`

X축 회전값


#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:130](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L130)

X축 회전값을 설정합니다. (라디안)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 회전값

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`rotationX`](PerspectiveCamera.md#rotationx)

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:142](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L142)

Y축 회전값을 반환합니다. (라디안)


##### Returns

`number`

Y축 회전값


#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:154](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L154)

Y축 회전값을 설정합니다. (라디안)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 회전값

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`rotationY`](PerspectiveCamera.md#rotationy)

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:166](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L166)

Z축 회전값을 반환합니다. (라디안)


##### Returns

`number`

Z축 회전값


#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:178](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L178)

Z축 회전값을 설정합니다. (라디안)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 회전값

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`rotationZ`](PerspectiveCamera.md#rotationz)

***

### top

#### Get Signature

> **get** **top**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:96](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L96)

투영 상단 값을 반환합니다.


##### Returns

`number`

투영 상단 값


#### Set Signature

> **set** **top**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:108](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L108)

투영 상단 값을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 상단 값

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:302](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L302)

X 좌표를 반환합니다.


##### Returns

`number`

X 좌표


#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:314](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L314)

X 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 X 좌표

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`x`](PerspectiveCamera.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:327](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L327)

Y 좌표를 반환합니다.


##### Returns

`number`

Y 좌표


#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:339](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L339)

Y 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 Y 좌표

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`y`](PerspectiveCamera.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:352](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L352)

Z 좌표를 반환합니다.


##### Returns

`number`

Z 좌표


#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:364](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L364)

Z 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 Z 좌표

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`z`](PerspectiveCamera.md#z)

***

### zoom

#### Get Signature

> **get** **zoom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:196](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L196)

줌 레벨을 반환합니다.


##### Returns

`number`

줌 레벨


#### Set Signature

> **set** **zoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:208](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L208)

줌 레벨을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 줌 레벨 (minZoom ~ maxZoom)

##### Returns

`void`

## Methods

### lookAt()

> **lookAt**(`x`, `y`, `z`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:420](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L420)

카메라가 특정 좌표를 바라보도록 회전시킵니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | 바라볼 대상의 X 좌표
| `y` | `number` | 바라볼 대상의 Y 좌표
| `z` | `number` | 바라볼 대상의 Z 좌표

#### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`lookAt`](PerspectiveCamera.md#lookat)

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:395](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/PerspectiveCamera.ts#L395)

카메라 위치를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X 좌표 또는 [x, y, z] 배열
| `y?` | `number` | Y 좌표 (x가 배열인 경우 무시됨)
| `z?` | `number` | Z 좌표 (x가 배열인 경우 무시됨)

#### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`setPosition`](PerspectiveCamera.md#setposition)

***

### setZoom()

> **setZoom**(`zoom`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:296](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/camera/camera/OrthographicCamera.ts#L296)

줌을 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `zoom` | `number` | 줌 레벨 (0.1 ~ 10)

#### Returns

`void`
