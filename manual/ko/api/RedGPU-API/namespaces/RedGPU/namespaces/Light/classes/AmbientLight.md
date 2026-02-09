[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / AmbientLight

# Class: AmbientLight

Defined in: [src/light/lights/AmbientLight.ts:18](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/light/lights/AmbientLight.ts#L18)

환경광(AmbientLight)을 정의하는 클래스입니다.


씬 전체에 균일하게 퍼지는 기본 조명으로, 그림자나 방향성 없이 모든 객체에 동일한 밝기를 제공합니다. 주로 전체적인 분위기 조절이나 기본 조명으로 사용됩니다.

* ### Example
```typescript
const ambient = new RedGPU.Light.AmbientLight();
scene.lightManager.ambientLight = ambient;
```

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new AmbientLight**(`color`, `intensity`): `AmbientLight`

Defined in: [src/light/lights/AmbientLight.ts:29](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/light/lights/AmbientLight.ts#L29)

새로운 AmbientLight 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `'#ADD8E6'` | 광원의 색상 (기본값: 연한 하늘색 #ADD8E6)
| `intensity` | `number` | `0.1` | 광원의 세기 (기본값: 0.1)

#### Returns

`AmbientLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Properties

### drawDebugger

> **drawDebugger**: `ADrawDebuggerLight`

Defined in: [src/light/core/ABaseLight.ts:20](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/light/core/ABaseLight.ts#L20)

광원의 디버깅 시각화를 위한 도우미 객체입니다.


외부에서 설정되며, 광원의 위치나 방향을 시각적으로 표시할 수 있습니다.


#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`drawDebugger`](../namespaces/Core/classes/ABaseLight.md#drawdebugger)

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:82](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/light/core/ABaseLight.ts#L82)

광원의 색상을 반환합니다.


##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

ColorRGB 객체


#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:93](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/light/core/ABaseLight.ts#L93)

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

Defined in: [src/light/core/ABaseLight.ts:60](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/light/core/ABaseLight.ts#L60)

디버깅 시각화 기능의 활성화 여부를 반환합니다.


##### Returns

`boolean`

활성화 여부


#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:71](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/light/core/ABaseLight.ts#L71)

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

### intensity

#### Get Signature

> **get** **intensity**(): `number`

Defined in: [src/light/core/ABaseLight.ts:104](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/light/core/ABaseLight.ts#L104)

광원의 세기를 반환합니다.


##### Returns

`number`

세기 값


#### Set Signature

> **set** **intensity**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:115](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/light/core/ABaseLight.ts#L115)

광원의 세기를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 숫자 값 (예: 1.0)

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`intensity`](../namespaces/Core/classes/ABaseLight.md#intensity)
