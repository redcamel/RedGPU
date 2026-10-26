[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Light](../../../README.md) / [Core](../README.md) / ABaseLight

# Abstract Class: ABaseLight

Defined in: [src/light/core/ABaseLight.ts:16](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L16)

모든 조명(Light)의 공통 속성(`color`, `intensityMultiplier`, `enableDebugger`)을 정의하는 추상 클래스입니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extended by

- [`AmbientLight`](../../../classes/AmbientLight.md)
- [`PointLight`](../../../classes/PointLight.md)
- [`SpotLight`](../../../classes/SpotLight.md)
- [`DirectionalLight`](../../../classes/DirectionalLight.md)

## Constructors

### Constructor

> **new ABaseLight**(`color`, `intensityMultiplier?`): `ABaseLight`

Defined in: [src/light/core/ABaseLight.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L32)

ABaseLight 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | [`ColorRGB`](../../../../Color/classes/ColorRGB.md) | `undefined` | 조명의 기본 색상 (`ColorRGB` 인스턴스) |
| `intensityMultiplier?` | `number` | `1` | 조명 강도 배율 (기본값: `1`) |

#### Returns

`ABaseLight`

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L61)

조명의 색상(`ColorRGB`) 인스턴스를 반환하거나 설정합니다.

##### Returns

[`ColorRGB`](../../../../Color/classes/ColorRGB.md)

조명의 `ColorRGB` 인스턴스

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`ColorRGB`](../../../../Color/classes/ColorRGB.md) |

##### Returns

`void`

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/light/core/ABaseLight.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L45)

조명 시각적 디버거 활성화 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

디버거 활성화 여부

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L49)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/light/core/ABaseLight.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L80)

조명 강도 배율(`0` 이상의 실수)을 반환하거나 설정합니다.

##### Returns

`number`

조명 강도 배율

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L84)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
