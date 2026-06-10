[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / DirectionalLight

# Class: DirectionalLight

Defined in: [src/light/lights/DirectionalLight.ts:19](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L19)

방향성 광원을 정의하는 클래스입니다.

이 광원은 특정 방향으로 균일하게 빛을 투사하며, 태양광과 같은 효과를 구현할 때 사용됩니다. 위치 기반이 아닌 방향 기반으로 작동하며, 그림자 생성 및 광원 시뮬레이션에 적합합니다.
```typescript
const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/directionalLight/" ></iframe>

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new DirectionalLight**(`direction?`, `color?`, `lux?`): `DirectionalLight`

Defined in: [src/light/lights/DirectionalLight.ts:42](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L42)

새로운 DirectionalLight 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `direction` | \[`number`, `number`, `number`\] | `...` | 광원의 방향 벡터 [x, y, z]
| `color` | `string` | `'#fff'` | 광원의 색상 (hex 문자열, 예: '#ffcc00')
| `lux` | `number` | `100000` | 광원의 조도 (Lux, lx, 기본값: 100,000)

#### Returns

`DirectionalLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Properties

### azimuth

#### Get Signature

> **get** **azimuth**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:87](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L87)

광원의 방위각(Azimuth, 도)입니다.

##### Returns

`number`

#### Set Signature

> **set** **azimuth**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:91](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L91)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### direction

#### Get Signature

> **get** **direction**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/DirectionalLight.ts:139](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L139)

광원의 전체 방향 벡터를 반환합니다.

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **direction**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:147](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L147)

광원의 전체 방향 벡터를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### directionX

#### Get Signature

> **get** **directionX**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:100](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L100)

광원의 X 방향 벡터 값입니다.

##### Returns

`number`

#### Set Signature

> **set** **directionX**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:104](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L104)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### directionY

#### Get Signature

> **get** **directionY**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:113](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L113)

광원의 Y 방향 벡터 값입니다.

##### Returns

`number`

#### Set Signature

> **set** **directionY**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:117](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L117)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### directionZ

#### Get Signature

> **get** **directionZ**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:126](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L126)

광원의 Z 방향 벡터 값입니다.

##### Returns

`number`

#### Set Signature

> **set** **directionZ**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:130](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L130)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### elevation

#### Get Signature

> **get** **elevation**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:74](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L74)

광원의 고도(Elevation, 도)입니다.

##### Returns

`number`

#### Set Signature

> **set** **elevation**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:78](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L78)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### lux

#### Get Signature

> **get** **lux**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:55](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L55)

광원의 조도(Lux, lx)를 반환합니다.

##### Returns

`number`

조도 값

#### Set Signature

> **set** **lux**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:66](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/lights/DirectionalLight.ts#L66)

광원의 조도(Lux, lx)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 조도 값 (예: 100,000)

##### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### drawDebugger

> **drawDebugger**: [`ADrawDebuggerLight`](../../Display/namespaces/drawDebugger/classes/ADrawDebuggerLight.md)\<[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)\>

Defined in: [src/light/core/ABaseLight.ts:22](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/core/ABaseLight.ts#L22)

광원의 디버깅 시각화를 위한 도우미 객체입니다.

외부에서 설정되며, 광원의 위치나 방향을 시각적으로 표시할 수 있습니다.

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`drawDebugger`](../namespaces/Core/classes/ABaseLight.md#drawdebugger)

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:84](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/core/ABaseLight.ts#L84)

광원의 색상을 반환합니다.

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

ColorRGB 객체

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:95](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/core/ABaseLight.ts#L95)

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

Defined in: [src/light/core/ABaseLight.ts:62](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/core/ABaseLight.ts#L62)

디버깅 시각화 기능의 활성화 여부를 반환합니다.

##### Returns

`boolean`

활성화 여부

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:73](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/core/ABaseLight.ts#L73)

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

Defined in: [src/light/core/ABaseLight.ts:109](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/core/ABaseLight.ts#L109)

광원의 세기 배율을 반환합니다.

##### Returns

`number`

배율 값

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:120](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/light/core/ABaseLight.ts#L120)

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
