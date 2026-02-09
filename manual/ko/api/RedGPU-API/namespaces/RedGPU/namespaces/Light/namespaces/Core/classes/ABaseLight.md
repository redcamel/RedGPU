[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Light](../../../README.md) / [Core](../README.md) / ABaseLight

# Abstract Class: ABaseLight

Defined in: [src/light/core/ABaseLight.ts:12](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/light/core/ABaseLight.ts#L12)

모든 광원 클래스의 기본이 되는 추상 클래스입니다.


색상, 세기(intensity), 디버깅 시각화 기능 등을 포함하며, DirectionalLight, PointLight 등 다양한 조명 클래스의 기반으로 사용됩니다.


## Extended by

- [`AmbientLight`](../../../classes/AmbientLight.md)
- [`PointLight`](../../../classes/PointLight.md)
- [`SpotLight`](../../../classes/SpotLight.md)
- [`DirectionalLight`](../../../classes/DirectionalLight.md)

## Constructors

### Constructor

> **new ABaseLight**(`color`, `intensity`): `ABaseLight`

Defined in: [src/light/core/ABaseLight.ts:48](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/light/core/ABaseLight.ts#L48)

새로운 ABaseLight 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | [`ColorRGB`](../../../../Color/classes/ColorRGB.md) | `undefined` | 광원의 색상 (ColorRGB 객체)
| `intensity` | `number` | `1` | 광원의 세기 (기본값: 1)

#### Returns

`ABaseLight`

## Properties

### drawDebugger

> **drawDebugger**: `ADrawDebuggerLight`

Defined in: [src/light/core/ABaseLight.ts:20](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/light/core/ABaseLight.ts#L20)

광원의 디버깅 시각화를 위한 도우미 객체입니다.


외부에서 설정되며, 광원의 위치나 방향을 시각적으로 표시할 수 있습니다.


## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:82](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/light/core/ABaseLight.ts#L82)

광원의 색상을 반환합니다.


##### Returns

[`ColorRGB`](../../../../Color/classes/ColorRGB.md)

ColorRGB 객체


#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:93](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/light/core/ABaseLight.ts#L93)

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

Defined in: [src/light/core/ABaseLight.ts:60](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/light/core/ABaseLight.ts#L60)

디버깅 시각화 기능의 활성화 여부를 반환합니다.


##### Returns

`boolean`

활성화 여부


#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:71](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/light/core/ABaseLight.ts#L71)

디버깅 시각화 기능을 활성화하거나 비활성화합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | true면 디버깅 기능 활성화

##### Returns

`void`

***

### intensity

#### Get Signature

> **get** **intensity**(): `number`

Defined in: [src/light/core/ABaseLight.ts:104](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/light/core/ABaseLight.ts#L104)

광원의 세기를 반환합니다.


##### Returns

`number`

세기 값


#### Set Signature

> **set** **intensity**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:115](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/light/core/ABaseLight.ts#L115)

광원의 세기를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 숫자 값 (예: 1.0)

##### Returns

`void`
