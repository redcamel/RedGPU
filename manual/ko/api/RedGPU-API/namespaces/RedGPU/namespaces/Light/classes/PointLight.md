[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / PointLight

# Class: PointLight

Defined in: [src/light/lights/PointLight.ts:25](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L25)

점광원(PointLight)을 정의하는 클래스입니다.

이 광원은 특정 위치에서 모든 방향으로 빛을 방사하며, 반경(radius)을 기준으로 빛의 영향을 받는 범위를 설정할 수 있습니다.
```typescript
const light = new RedGPU.Light.PointLight('#ffcc00', 1.5);
light.setPosition(0, 5, 10);
scene.lightManager.addPointLight(light);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/pointLight/" ></iframe>

아래는 PointLight 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.

## See

 - [PointLight Cluster Performance example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLightPerformance/)
 - [PointLight with glTF example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLightWithGltf/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new PointLight**(`color?`, `lumen?`): `PointLight`

Defined in: [src/light/lights/PointLight.ts:63](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L63)

새로운 PointLight 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `'#fff'` | 광원의 색상 (hex 문자열, 예: '#ffffff')
| `lumen` | `number` | `1000` | 광원의 광선속 (Lumen, lm, 기본값: 1,000)

#### Returns

`PointLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Properties

### lumen

#### Get Signature

> **get** **lumen**(): `number`

Defined in: [src/light/lights/PointLight.ts:75](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L75)

광원의 광선속(Lumen, lm)을 반환합니다.

##### Returns

`number`

광선속 값

#### Set Signature

> **set** **lumen**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:86](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L86)

광원의 광선속(Lumen, lm)을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 광선속 값 (예: 1,000)

##### Returns

`void`

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/PointLight.ts:163](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L163)

광원의 위치를 [x, y, z] 형태로 반환합니다.

##### Returns

\[`number`, `number`, `number`\]

위치 배열 [x, y, z]

***

### radius

#### Get Signature

> **get** **radius**(): `number`

Defined in: [src/light/lights/PointLight.ts:174](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L174)

광원의 반경을 반환합니다.

##### Returns

`number`

반경 값

#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:185](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L185)

광원의 반경을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 반경 값 (예: 5.0)

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/light/lights/PointLight.ts:97](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L97)

X 좌표를 반환합니다.

##### Returns

`number`

X 좌표

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:108](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L108)

X 좌표를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 좌표

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/light/lights/PointLight.ts:119](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L119)

Y 좌표를 반환합니다.

##### Returns

`number`

Y 좌표

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:130](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L130)

Y 좌표를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 좌표

##### Returns

`void`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/light/lights/PointLight.ts:141](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L141)

Z 좌표를 반환합니다.

##### Returns

`number`

Z 좌표

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:152](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L152)

Z 좌표를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 좌표

##### Returns

`void`

## Methods

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/light/lights/PointLight.ts:202](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/PointLight.ts#L202)

광원의 위치를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X 좌표 또는 [x, y, z] 배열
| `y?` | `number` | Y 좌표 (x가 숫자일 경우)
| `z?` | `number` | Z 좌표 (x가 숫자일 경우)

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### drawDebugger

> **drawDebugger**: [`ADrawDebuggerLight`](../../Display/namespaces/drawDebugger/classes/ADrawDebuggerLight.md)\<[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)\>

Defined in: [src/light/core/ABaseLight.ts:22](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L22)

광원의 디버깅 시각화를 위한 도우미 객체입니다.

외부에서 설정되며, 광원의 위치나 방향을 시각적으로 표시할 수 있습니다.

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`drawDebugger`](../namespaces/Core/classes/ABaseLight.md#drawdebugger)

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:84](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L84)

광원의 색상을 반환합니다.

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

ColorRGB 객체

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:95](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L95)

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

Defined in: [src/light/core/ABaseLight.ts:62](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L62)

디버깅 시각화 기능의 활성화 여부를 반환합니다.

##### Returns

`boolean`

활성화 여부

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:73](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L73)

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

Defined in: [src/light/core/ABaseLight.ts:109](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L109)

광원의 세기 배율을 반환합니다.

##### Returns

`number`

배율 값

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:120](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L120)

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
