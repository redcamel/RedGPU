[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / DirectionalLight

# Class: DirectionalLight

Defined in: [src/light/lights/DirectionalLight.ts:19](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/DirectionalLight.ts#L19)

방향성 광원을 정의하는 클래스입니다.


이 광원은 특정 방향으로 균일하게 빛을 투사하며, 태양광과 같은 효과를 구현할 때 사용됩니다. 위치 기반이 아닌 방향 기반으로 작동하며, 그림자 생성 및 광원 시뮬레이션에 적합합니다.

* ### Example
```typescript
const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/directionalLight/" ></iframe>

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new DirectionalLight**(`direction`, `color`, `intensity`): `DirectionalLight`

Defined in: [src/light/lights/DirectionalLight.ts:52](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/DirectionalLight.ts#L52)

새로운 DirectionalLight 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `direction` | \[`number`, `number`, `number`\] | `...` | 광원의 방향 벡터 [x, y, z]
| `color` | `string` | `'#fff'` | 광원의 색상 (hex 문자열, 예: '#ffcc00')
| `intensity` | `number` | `1` | 광원의 세기 (기본값: 1)

#### Returns

`DirectionalLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Properties

### drawDebugger

> **drawDebugger**: `ADrawDebuggerLight`

Defined in: [src/light/core/ABaseLight.ts:20](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/core/ABaseLight.ts#L20)

광원의 디버깅 시각화를 위한 도우미 객체입니다.


외부에서 설정되며, 광원의 위치나 방향을 시각적으로 표시할 수 있습니다.


#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`drawDebugger`](../namespaces/Core/classes/ABaseLight.md#drawdebugger)

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:82](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/core/ABaseLight.ts#L82)

광원의 색상을 반환합니다.


##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

ColorRGB 객체


#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:93](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/core/ABaseLight.ts#L93)

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

### direction

#### Get Signature

> **get** **direction**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/DirectionalLight.ts:132](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/DirectionalLight.ts#L132)

광원의 전체 방향 벡터를 반환합니다.


##### Returns

\[`number`, `number`, `number`\]

방향 벡터 [x, y, z]


#### Set Signature

> **set** **direction**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:143](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/DirectionalLight.ts#L143)

광원의 전체 방향 벡터를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | \[`number`, `number`, `number`\] | 방향 벡터 [x, y, z]

##### Returns

`void`

***

### directionX

#### Get Signature

> **get** **directionX**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:66](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/DirectionalLight.ts#L66)

광원의 X 방향 벡터 값을 반환합니다.


##### Returns

`number`

X 방향 벡터 값


#### Set Signature

> **set** **directionX**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:77](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/DirectionalLight.ts#L77)

광원의 X 방향 벡터 값을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 방향 벡터 값

##### Returns

`void`

***

### directionY

#### Get Signature

> **get** **directionY**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:88](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/DirectionalLight.ts#L88)

광원의 Y 방향 벡터 값을 반환합니다.


##### Returns

`number`

Y 방향 벡터 값


#### Set Signature

> **set** **directionY**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:99](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/DirectionalLight.ts#L99)

광원의 Y 방향 벡터 값을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 방향 벡터 값

##### Returns

`void`

***

### directionZ

#### Get Signature

> **get** **directionZ**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:110](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/DirectionalLight.ts#L110)

광원의 Z 방향 벡터 값을 반환합니다.


##### Returns

`number`

Z 방향 벡터 값


#### Set Signature

> **set** **directionZ**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:121](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/DirectionalLight.ts#L121)

광원의 Z 방향 벡터 값을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 방향 벡터 값

##### Returns

`void`

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/light/core/ABaseLight.ts:60](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/core/ABaseLight.ts#L60)

디버깅 시각화 기능의 활성화 여부를 반환합니다.


##### Returns

`boolean`

활성화 여부


#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:71](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/core/ABaseLight.ts#L71)

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

Defined in: [src/light/core/ABaseLight.ts:104](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/core/ABaseLight.ts#L104)

광원의 세기를 반환합니다.


##### Returns

`number`

세기 값


#### Set Signature

> **set** **intensity**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:115](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/core/ABaseLight.ts#L115)

광원의 세기를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 숫자 값 (예: 1.0)

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`intensity`](../namespaces/Core/classes/ABaseLight.md#intensity)
