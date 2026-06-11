[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Camera](../../../README.md) / [Core](../README.md) / ACamera

# Abstract Class: ACamera

Defined in: [src/camera/core/ACamera.ts:11](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/camera/core/ACamera.ts#L11)

모든 카메라의 기본이 되는 추상 클래스입니다. 물리적 카메라 속성과 공통 메타데이터를 관리합니다.

## Extends

- [`BaseObject`](../../../../BaseObject/classes/BaseObject.md)

## Extended by

- [`PerspectiveCamera`](../../../classes/PerspectiveCamera.md)
- [`Camera2D`](../../../classes/Camera2D.md)

## Constructors

### Constructor

> `protected` **new ACamera**(): `ACamera`

Defined in: [src/base/BaseObject.ts:34](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L34)

BaseObject 생성자입니다. (추상 클래스로 직접 인스턴스 생성은 불가합니다)

#### Returns

`ACamera`

#### Inherited from

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`constructor`](../../../../BaseObject/classes/BaseObject.md#constructor)

## Properties

### CALIBRATION\_CONSTANT

> `readonly` `static` **CALIBRATION\_CONSTANT**: `number` = `12.5`

Defined in: [src/camera/core/ACamera.ts:19](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/camera/core/ACamera.ts#L19)

교정 상수 (Calibration Constant, K)

#### Description

언리얼 엔진 5 및 사진학적 표준 (ISO 2720 표준 기준 K = 12.5)

## Accessors

### aperture

#### Get Signature

> **get** **aperture**(): `number`

Defined in: [src/camera/core/ACamera.ts:123](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/camera/core/ACamera.ts#L123)

조리개(f-stop) 값을 반환합니다.

##### Returns

`number`

조리개 값

#### Set Signature

> **set** **aperture**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:135](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/camera/core/ACamera.ts#L135)

조리개(f-stop) 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 조리개 값

##### Returns

`void`

***

### ev100

#### Get Signature

> **get** **ev100**(): `number`

Defined in: [src/camera/core/ACamera.ts:110](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/camera/core/ACamera.ts#L110)

물리적 노출 지수(EV100)를 반환합니다.

##### Returns

`number`

EV100 값

***

### iso

#### Get Signature

> **get** **iso**(): `number`

Defined in: [src/camera/core/ACamera.ts:177](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/camera/core/ACamera.ts#L177)

센서 감도(ISO)를 반환합니다.

##### Returns

`number`

ISO 감도

#### Set Signature

> **set** **iso**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:189](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/camera/core/ACamera.ts#L189)

센서 감도(ISO)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 ISO 감도

##### Returns

`void`

***

### shutterSpeed

#### Get Signature

> **get** **shutterSpeed**(): `number`

Defined in: [src/camera/core/ACamera.ts:150](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/camera/core/ACamera.ts#L150)

셔터 속도(초 단위)를 반환합니다.

##### Returns

`number`

셔터 속도

#### Set Signature

> **set** **shutterSpeed**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:162](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/camera/core/ACamera.ts#L162)

셔터 속도(초 단위)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 셔터 속도

##### Returns

`void`

***

### useAutoExposure

#### Get Signature

> **get** **useAutoExposure**(): `boolean`

Defined in: [src/camera/core/ACamera.ts:61](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/camera/core/ACamera.ts#L61)

자동 노출 사용 여부를 반환합니다.

##### Returns

`boolean`

자동 노출 활성화 여부

#### Set Signature

> **set** **useAutoExposure**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:73](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/camera/core/ACamera.ts#L73)

자동 노출 사용 여부를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 설정할 자동 노출 활성화 여부

##### Returns

`void`

***

### updateExposure()

> **updateExposure**(`view?`): `void`

Defined in: [src/camera/core/ACamera.ts:204](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/camera/core/ACamera.ts#L204)

노출 값을 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view?` | [`View3D`](../../../../Display/classes/View3D.md) | View3D 인스턴스 (선택 사항)

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`PostEffectTexturePool`](../../../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md).[`name`](../../../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md#name)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`uuid`](../../../../BaseObject/classes/BaseObject.md#uuid)

## Methods


</details>
