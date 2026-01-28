[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / PointLight

# Class: PointLight

Defined in: [src/light/lights/PointLight.ts:24](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/lights/PointLight.ts#L24)

점광원(PointLight)을 정의하는 클래스입니다.


이 광원은 특정 위치에서 모든 방향으로 빛을 방사하며, 반경(radius)을 기준으로 빛의 영향을 받는 범위를 설정할 수 있습니다.

* ### Example
```typescript
const light = new RedGPU.Light.PointLight('#ffcc00', 1.5);
light.setPosition(0, 5, 10);
scene.lightManager.addPointLight(light);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/pointLight/" ></iframe>

아래는 PointLight 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.


## See

[PointLight Cluster Performance example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLightPerformance/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new PointLight**(`color`, `intensity`): `PointLight`

Defined in: [src/light/lights/PointLight.ts:60](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/lights/PointLight.ts#L60)

새로운 PointLight 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `'#fff'` | 광원의 색상 (hex 문자열, 예: '#ffffff')
| `intensity` | `number` | `1` | 광원의 세기 (기본값: 1)

#### Returns

`PointLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Properties

### drawDebugger

> **drawDebugger**: `ADrawDebuggerLight`

Defined in: [src/light/core/ABaseLight.ts:20](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/core/ABaseLight.ts#L20)

광원의 디버깅 시각화를 위한 도우미 객체입니다.


외부에서 설정되며, 광원의 위치나 방향을 시각적으로 표시할 수 있습니다.


#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`drawDebugger`](../namespaces/Core/classes/ABaseLight.md#drawdebugger)

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:82](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/core/ABaseLight.ts#L82)

광원의 색상을 반환합니다.


##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

ColorRGB 객체


#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:93](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/core/ABaseLight.ts#L93)

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

Defined in: [src/light/core/ABaseLight.ts:60](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/core/ABaseLight.ts#L60)

디버깅 시각화 기능의 활성화 여부를 반환합니다.


##### Returns

`boolean`

활성화 여부


#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:71](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/core/ABaseLight.ts#L71)

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

Defined in: [src/light/core/ABaseLight.ts:104](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/core/ABaseLight.ts#L104)

광원의 세기를 반환합니다.


##### Returns

`number`

세기 값


#### Set Signature

> **set** **intensity**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:115](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/core/ABaseLight.ts#L115)

광원의 세기를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 숫자 값 (예: 1.0)

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`intensity`](../namespaces/Core/classes/ABaseLight.md#intensity)

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/PointLight.ts:137](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/lights/PointLight.ts#L137)

광원의 위치를 [x, y, z] 형태로 반환합니다.


##### Returns

\[`number`, `number`, `number`\]

위치 배열 [x, y, z]


***

### radius

#### Get Signature

> **get** **radius**(): `number`

Defined in: [src/light/lights/PointLight.ts:148](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/lights/PointLight.ts#L148)

광원의 반경을 반환합니다.


##### Returns

`number`

반경 값


#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:159](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/lights/PointLight.ts#L159)

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

Defined in: [src/light/lights/PointLight.ts:71](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/lights/PointLight.ts#L71)

X 좌표를 반환합니다.


##### Returns

`number`

X 좌표


#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:82](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/lights/PointLight.ts#L82)

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

Defined in: [src/light/lights/PointLight.ts:93](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/lights/PointLight.ts#L93)

Y 좌표를 반환합니다.


##### Returns

`number`

Y 좌표


#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:104](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/lights/PointLight.ts#L104)

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

Defined in: [src/light/lights/PointLight.ts:115](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/lights/PointLight.ts#L115)

Z 좌표를 반환합니다.


##### Returns

`number`

Z 좌표


#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:126](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/lights/PointLight.ts#L126)

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

Defined in: [src/light/lights/PointLight.ts:176](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/light/lights/PointLight.ts#L176)

광원의 위치를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X 좌표 또는 [x, y, z] 배열
| `y?` | `number` | Y 좌표 (x가 숫자일 경우)
| `z?` | `number` | Z 좌표 (x가 숫자일 경우)

#### Returns

`void`
