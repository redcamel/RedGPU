[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Light](../../../README.md) / [Core](../README.md) / ABaseLight

# Abstract Class: ABaseLight

Defined in: [src/light/core/ABaseLight.ts:14](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L14)

모든 광원 클래스의 기본이 되는 추상 클래스입니다.

색상, 세기(intensity), 디버깅 시각화 기능 등을 포함하며, DirectionalLight, PointLight 등 다양한 조명 클래스의 기반으로 사용됩니다.

## Extended by

- [`AmbientLight`](../../../classes/AmbientLight.md)
- [`PointLight`](../../../classes/PointLight.md)
- [`SpotLight`](../../../classes/SpotLight.md)
- [`DirectionalLight`](../../../classes/DirectionalLight.md)

## Constructors

### Constructor

> `protected` **new ABaseLight**(`color`, `intensityMultiplier?`): `ABaseLight`

Defined in: [src/light/core/ABaseLight.ts:50](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L50)

새로운 ABaseLight 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | [`ColorRGB`](../../../../Color/classes/ColorRGB.md) | `undefined` | 광원의 색상 (ColorRGB 객체)
| `intensityMultiplier` | `number` | `1` | 광원의 세기 배율 (기본값: 1)

#### Returns

`ABaseLight`

## Properties

### drawDebugger

> **drawDebugger**: [`ADrawDebuggerLight`](../../../../Display/namespaces/drawDebugger/classes/ADrawDebuggerLight.md)\<`ABaseLight`\>

Defined in: [src/light/core/ABaseLight.ts:22](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L22)

광원의 디버깅 시각화를 위한 도우미 객체입니다.

외부에서 설정되며, 광원의 위치나 방향을 시각적으로 표시할 수 있습니다.

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:84](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L84)

광원의 색상을 반환합니다.

##### Returns

[`ColorRGB`](../../../../Color/classes/ColorRGB.md)

ColorRGB 객체

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:95](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L95)

광원의 색상을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`ColorRGB`](../../../../Color/classes/ColorRGB.md) | ColorRGB 객체

##### Returns

`void`

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/light/core/ABaseLight.ts:62](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L62)

디버깅 시각화 기능의 활성화 여부를 반환합니다.

##### Returns

`boolean`

활성화 여부

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:73](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L73)

디버깅 시각화 기능을 활성화하거나 비활성화합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | true면 디버깅 기능 활성화

##### Returns

`void`

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/light/core/ABaseLight.ts:109](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L109)

광원의 세기 배율을 반환합니다.

##### Returns

`number`

배율 값

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:120](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L120)

광원의 세기 배율을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 숫자 값 (예: 1.0)

##### Returns

`void`
