[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / AmbientLight

# Class: AmbientLight

Defined in: [src/light/lights/AmbientLight.ts:28](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/light/lights/AmbientLight.ts#L28)

환경광(AmbientLight)을 정의하는 클래스입니다.

씬 전체에 균일하게 퍼지는 기본 조명으로, 그림자나 방향성 없이 모든 객체에 동일한 밝기를 제공합니다.
광량 단위로 **룩스(Lux, lx)**를 사용하며, 자동 노출(Auto-Exposure) 시스템과 연동됩니다.

##조도 기준 예시 (Lux)
- 보름달 밤: 0.25 lx
- 일반 거실: 50 lx
- 사무실: 300 ~ 500 lx
- 흐린 날 야외: 1,000 lx
- 태양 직사광: 100,000 lx

* ### Example
```typescript
const ambient = new RedGPU.Light.AmbientLight('#ADD8E6', 50); // 50 Lux
scene.lightManager.ambientLight = ambient;
```

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new AmbientLight**(`color?`, `lux?`): `AmbientLight`

Defined in: [src/light/lights/AmbientLight.ts:41](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/light/lights/AmbientLight.ts#L41)

새로운 AmbientLight 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `'#ADD8E6'` | 광원의 색상 (기본값: #ADD8E6)
| `lux` | `number` | `50` | 광원의 조도 (단위: Lux, 기본값: 50)

#### Returns

`AmbientLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Properties

### lux

#### Get Signature

> **get** **lux**(): `number`

Defined in: [src/light/lights/AmbientLight.ts:50](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/light/lights/AmbientLight.ts#L50)

광원의 조도(Lux)를 반환하거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **lux**(`value`): `void`

Defined in: [src/light/lights/AmbientLight.ts:54](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/light/lights/AmbientLight.ts#L54)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### drawDebugger

> **drawDebugger**: [`ADrawDebuggerLight`](../../Display/namespaces/drawDebugger/classes/ADrawDebuggerLight.md)\<[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)\>

Defined in: [src/light/core/ABaseLight.ts:22](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/light/core/ABaseLight.ts#L22)

광원의 디버깅 시각화를 위한 도우미 객체입니다.

외부에서 설정되며, 광원의 위치나 방향을 시각적으로 표시할 수 있습니다.

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`drawDebugger`](../namespaces/Core/classes/ABaseLight.md#drawdebugger)

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:84](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/light/core/ABaseLight.ts#L84)

광원의 색상을 반환합니다.

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

ColorRGB 객체

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:95](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/light/core/ABaseLight.ts#L95)

광원의 색상을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`ColorRGB`](../../Color/classes/ColorRGB.md) | ColorRGB 객체

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`color`](../namespaces/Core/classes/ABaseLight.md#color)

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/light/core/ABaseLight.ts:62](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/light/core/ABaseLight.ts#L62)

디버깅 시각화 기능의 활성화 여부를 반환합니다.

##### Returns

`boolean`

활성화 여부

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:73](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/light/core/ABaseLight.ts#L73)

디버깅 시각화 기능을 활성화하거나 비활성화합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | true면 디버깅 기능 활성화

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`enableDebugger`](../namespaces/Core/classes/ABaseLight.md#enabledebugger)

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/light/core/ABaseLight.ts:109](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/light/core/ABaseLight.ts#L109)

광원의 세기 배율을 반환합니다.

##### Returns

`number`

배율 값

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:120](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/light/core/ABaseLight.ts#L120)

광원의 세기 배율을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 숫자 값 (예: 1.0)

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`intensityMultiplier`](../namespaces/Core/classes/ABaseLight.md#intensitymultiplier)

***


</details>
