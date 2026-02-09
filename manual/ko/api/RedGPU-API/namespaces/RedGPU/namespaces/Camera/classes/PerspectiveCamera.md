[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / PerspectiveCamera

# Class: PerspectiveCamera

Defined in: [src/camera/camera/PerspectiveCamera.ts:24](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L24)

원근 투영을 사용하는 카메라입니다.


인간의 눈이나 카메라 렌즈와 유사하게 거리에 따라 물체의 크기가 달라지는 원근감을 제공합니다. 3D 환경에서 깊이감 있는 씬을 렌더링할 때 기본적으로 사용됩니다.


### Example
```typescript
const camera = new RedGPU.PerspectiveCamera();
camera.x = 10;
camera.y = 5;
camera.z = 20;
camera.fieldOfView = 75;
camera.lookAt(0, 0, 0);
```

## Extended by

- [`OrthographicCamera`](OrthographicCamera.md)

## Constructors

### Constructor

> **new PerspectiveCamera**(): `PerspectiveCamera`

Defined in: [src/camera/camera/PerspectiveCamera.ts:112](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L112)

PerspectiveCamera 인스턴스를 생성합니다.


### Example
```typescript
const camera = new RedGPU.PerspectiveCamera();
```

#### Returns

`PerspectiveCamera`

## Accessors

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

***

### modelMatrix

#### Get Signature

> **get** **modelMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/camera/camera/PerspectiveCamera.ts:295](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L295)

모델 행렬을 반환합니다.


##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

모델 행렬


***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/camera/PerspectiveCamera.ts:270](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L270)

카메라 이름을 반환합니다.


##### Returns

`string`

카메라 이름


#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:283](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L283)

카메라 이름을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 이름

##### Returns

`void`

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

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/camera/camera/PerspectiveCamera.ts:382](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/camera/camera/PerspectiveCamera.ts#L382)

카메라 위치 (x, y, z)를 반환합니다.


##### Returns

\[`number`, `number`, `number`\]

[x, y, z] 좌표 배열


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
