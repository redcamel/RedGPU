[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [BaseObject](../README.md) / BaseObject

# Abstract Class: BaseObject

Defined in: [src/base/BaseObject.ts:13](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L13)

RedGPU의 모든 엔진 객체가 상속받는 최상위 추상 클래스입니다.

모든 객체에 공통적으로 필요한 고유 식별자(UUID), 인스턴스 이름, 인스턴스 ID 관리 기능을 제공합니다.

## Extended by

- [`RedGPUObject`](RedGPUObject.md)
- [`ACamera`](../../Camera/namespaces/Core/classes/ACamera.md)
- [`DrawDebuggerGrid`](../../Display/namespaces/drawDebugger/classes/DrawDebuggerGrid.md)
- [`Object3DContainer`](../../Display/namespaces/CoreMesh/classes/Object3DContainer.md)

## Constructors

### Constructor

> `protected` **new BaseObject**(): `BaseObject`

Defined in: [src/base/BaseObject.ts:34](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L34)

BaseObject 생성자입니다. (추상 클래스로 직접 인스턴스 생성은 불가합니다)

#### Returns

`BaseObject`

## Accessors

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열
