[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / Camera2D

# Class: Camera2D

Defined in: [src/camera/camera/Camera2D.ts:20](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/camera/camera/Camera2D.ts#L20)

2D 환경에서 객체를 관찰하는 카메라입니다.


평면적인 2D 좌표계를 기반으로 위치를 제어하며, UI나 2D 게임 요소의 렌더링에 주로 사용됩니다.


* ### Example
```typescript
const camera = new RedGPU.Camera.Camera2D();
camera.x = 100;
camera.y = 50;
camera.setPosition(200, 100);
```

## Constructors

### Constructor

> **new Camera2D**(): `Camera2D`

Defined in: [src/camera/camera/Camera2D.ts:61](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/camera/camera/Camera2D.ts#L61)

Camera2D 인스턴스를 생성합니다.


#### Returns

`Camera2D`

## Accessors

### modelMatrix

#### Get Signature

> **get** **modelMatrix**(): [`mat4`](../../../type-aliases/mat4.md)

Defined in: [src/camera/camera/Camera2D.ts:97](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/camera/camera/Camera2D.ts#L97)

모델 행렬을 반환합니다.


##### Returns

[`mat4`](../../../type-aliases/mat4.md)

모델 행렬


***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/camera/Camera2D.ts:72](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/camera/camera/Camera2D.ts#L72)

카메라 이름을 반환합니다.


##### Returns

`string`

카메라 이름


#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:85](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/camera/camera/Camera2D.ts#L85)

카메라 이름을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 이름

##### Returns

`void`

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`\]

Defined in: [src/camera/camera/Camera2D.ts:171](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/camera/camera/Camera2D.ts#L171)

카메라 위치 (x, y)를 반환합니다.


##### Returns

\[`number`, `number`\]

[x, y] 좌표 배열


***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/camera/Camera2D.ts:121](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/camera/camera/Camera2D.ts#L121)

X 좌표를 반환합니다.


##### Returns

`number`

X 좌표


#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:133](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/camera/camera/Camera2D.ts#L133)

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

Defined in: [src/camera/camera/Camera2D.ts:146](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/camera/camera/Camera2D.ts#L146)

Y 좌표를 반환합니다.


##### Returns

`number`

Y 좌표


#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:158](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/camera/camera/Camera2D.ts#L158)

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

Defined in: [src/camera/camera/Camera2D.ts:109](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/camera/camera/Camera2D.ts#L109)

Z 좌표를 반환합니다. (미사용)


##### Returns

`number`

Z 좌표


## Methods

### setPosition()

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/camera/camera/Camera2D.ts:186](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/camera/camera/Camera2D.ts#L186)

카메라의 위치를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X 좌표 또는 [x, y, z] 배열
| `y?` | `number` | Y 좌표 (x가 배열인 경우 무시됨)

#### Returns

`void`
