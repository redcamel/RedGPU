[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / OrthographicCamera

# Class: OrthographicCamera

Defined in: [src/camera/camera/OrthographicCamera.ts:23](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L23)

직교 투영을 사용하는 카메라입니다.


이 투영 모드에서는 객체의 크기가 카메라로부터의 거리에 관계없이 일정하게 유지됩니다. 주로 2D 뷰포트나 설계도면 같은 정투영 뷰를 구현할 때 사용됩니다.


### Example
```typescript
const camera = new RedGPU.OrthographicCamera();
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

Defined in: [src/camera/camera/OrthographicCamera.ts:87](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L87)

OrthographicCamera 인스턴스를 생성합니다.


### Example
```typescript
const camera = new RedGPU.OrthographicCamera();
```

#### Returns

`OrthographicCamera`

#### Overrides

[`PerspectiveCamera`](PerspectiveCamera.md).[`constructor`](PerspectiveCamera.md#constructor)

## Accessors

### bottom

#### Get Signature

> **get** **bottom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:126](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L126)

투영 하단 값을 반환합니다.


##### Returns

`number`

투영 하단 값


#### Set Signature

> **set** **bottom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:138](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L138)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:245](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L245)

원평면(far) 거리를 반환합니다.


##### Returns

`number`

원평면 거리


#### Set Signature

> **set** **farClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:257](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L257)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:195](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L195)

시야각(FOV)을 반환합니다. (도)


##### Returns

`number`

시야각


#### Set Signature

> **set** **fieldOfView**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:207](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L207)

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

Defined in: [src/camera/camera/OrthographicCamera.ts:151](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L151)

투영 좌측 값을 반환합니다.


##### Returns

`number`

투영 좌측 값


#### Set Signature

> **set** **left**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:163](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L163)

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

Defined in: [src/camera/camera/OrthographicCamera.ts:251](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L251)

최대 줌 레벨을 반환합니다.


##### Returns

`number`

최대 줌 레벨


#### Set Signature

> **set** **maxZoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:263](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L263)

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

Defined in: [src/camera/camera/OrthographicCamera.ts:226](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L226)

최소 줌 레벨을 반환합니다.


##### Returns

`number`

최소 줌 레벨


#### Set Signature

> **set** **minZoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:238](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L238)

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

> **get** **modelMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/camera/camera/PerspectiveCamera.ts:295](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L295)

모델 행렬을 반환합니다.


##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

모델 행렬


#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`modelMatrix`](PerspectiveCamera.md#modelmatrix)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/camera/OrthographicCamera.ts:276](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L276)

카메라 이름을 반환합니다.


##### Returns

`string`

카메라 이름


#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:289](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L289)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:220](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L220)

근평면(near) 거리를 반환합니다.


##### Returns

`number`

근평면 거리


#### Set Signature

> **set** **nearClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:232](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L232)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:382](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L382)

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

Defined in: [src/camera/camera/OrthographicCamera.ts:176](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L176)

투영 우측 값을 반환합니다.


##### Returns

`number`

투영 우측 값


#### Set Signature

> **set** **right**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:188](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L188)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:123](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L123)

X축 회전값을 반환합니다. (라디안)


##### Returns

`number`

X축 회전값


#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:135](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L135)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:147](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L147)

Y축 회전값을 반환합니다. (라디안)


##### Returns

`number`

Y축 회전값


#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:159](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L159)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:171](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L171)

Z축 회전값을 반환합니다. (라디안)


##### Returns

`number`

Z축 회전값


#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:183](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L183)

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

Defined in: [src/camera/camera/OrthographicCamera.ts:101](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L101)

투영 상단 값을 반환합니다.


##### Returns

`number`

투영 상단 값


#### Set Signature

> **set** **top**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:113](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L113)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:307](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L307)

X 좌표를 반환합니다.


##### Returns

`number`

X 좌표


#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:319](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L319)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:332](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L332)

Y 좌표를 반환합니다.


##### Returns

`number`

Y 좌표


#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:344](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L344)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:357](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L357)

Z 좌표를 반환합니다.


##### Returns

`number`

Z 좌표


#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:369](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L369)

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

Defined in: [src/camera/camera/OrthographicCamera.ts:201](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L201)

줌 레벨을 반환합니다.


##### Returns

`number`

줌 레벨


#### Set Signature

> **set** **zoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:213](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L213)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:436](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L436)

카메라가 특정 좌표를 바라보도록 회전시킵니다.


### Example
```typescript
camera.lookAt(0, 0, 0);
```

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:406](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L406)

카메라 위치를 설정합니다.


### Example
```typescript
camera.setPosition(10, 5, 20);
camera.setPosition([10, 5, 20]);
```

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

Defined in: [src/camera/camera/OrthographicCamera.ts:306](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/OrthographicCamera.ts#L306)

줌을 설정합니다.


### Example
```typescript
camera.setZoom(2.0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `zoom` | `number` | 줌 레벨 (0.1 ~ 10)

#### Returns

`void`
