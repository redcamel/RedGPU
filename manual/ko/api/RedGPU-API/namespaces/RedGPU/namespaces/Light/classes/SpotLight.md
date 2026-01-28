[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / SpotLight

# Class: SpotLight

Defined in: [src/light/lights/SpotLight.ts:25](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L25)

스포트라이트(SpotLight)를 정의하는 클래스입니다.


이 광원은 특정 위치에서 지정된 방향으로 빛을 방사하며, 내부/외부 컷오프 각도를 통해 빛의 퍼짐 범위를 제어할 수 있습니다.

* ### Example
```typescript
const light = new RedGPU.Light.SpotLight('#ffffff', 2.0);
light.setPosition(0, 5, 10);
light.lookAt(0, 0, 0);
scene.lightManager.addSpotLight(light);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/spotLight/" ></iframe>

아래는 SpotLight 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.


## See

[SpotLight Cluster Performance example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLightPerformance/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new SpotLight**(`color`, `intensity`): `SpotLight`

Defined in: [src/light/lights/SpotLight.ts:91](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L91)

새로운 SpotLight 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `'#fff'` | 광원의 색상 (hex 문자열, 예: '#ffffff')
| `intensity` | `number` | `1` | 광원의 세기 (기본값: 1)

#### Returns

`SpotLight`

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

Defined in: [src/light/lights/SpotLight.ts:267](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L267)

광원의 방향 벡터를 [x, y, z] 형태로 반환합니다.


##### Returns

\[`number`, `number`, `number`\]

방향 벡터 [x, y, z]


#### Set Signature

> **set** **direction**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:278](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L278)

광원의 방향 벡터를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | \[`number`, `number`, `number`\] | [x, y, z] 형태의 방향 벡터

##### Returns

`void`

***

### directionX

#### Get Signature

> **get** **directionX**(): `number`

Defined in: [src/light/lights/SpotLight.ts:201](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L201)

방향 벡터의 X 성분을 반환합니다.


##### Returns

`number`

X 성분 값


#### Set Signature

> **set** **directionX**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:212](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L212)

방향 벡터의 X 성분을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 성분 값

##### Returns

`void`

***

### directionY

#### Get Signature

> **get** **directionY**(): `number`

Defined in: [src/light/lights/SpotLight.ts:223](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L223)

방향 벡터의 Y 성분을 반환합니다.


##### Returns

`number`

Y 성분 값


#### Set Signature

> **set** **directionY**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:234](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L234)

방향 벡터의 Y 성분을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 성분 값

##### Returns

`void`

***

### directionZ

#### Get Signature

> **get** **directionZ**(): `number`

Defined in: [src/light/lights/SpotLight.ts:245](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L245)

방향 벡터의 Z 성분을 반환합니다.


##### Returns

`number`

Z 성분 값


#### Set Signature

> **set** **directionZ**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:256](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L256)

방향 벡터의 Z 성분을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 성분 값

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

### innerCutoff

#### Get Signature

> **get** **innerCutoff**(): `number`

Defined in: [src/light/lights/SpotLight.ts:291](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L291)

내부 컷오프 각도를 반환합니다.


##### Returns

`number`

각도 (degree)


#### Set Signature

> **set** **innerCutoff**(`degrees`): `void`

Defined in: [src/light/lights/SpotLight.ts:302](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L302)

내부 컷오프 각도를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `degrees` | `number` | 각도 (degree)

##### Returns

`void`

***

### innerCutoffCos

#### Get Signature

> **get** **innerCutoffCos**(): `number`

Defined in: [src/light/lights/SpotLight.ts:338](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L338)

내부 컷오프 각도의 코사인 값을 반환합니다.


셰이더 계산 등에 사용됩니다.


##### Returns

`number`

코사인 값


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

***

### outerCutoff

#### Get Signature

> **get** **outerCutoff**(): `number`

Defined in: [src/light/lights/SpotLight.ts:313](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L313)

외부 컷오프 각도를 반환합니다.


##### Returns

`number`

각도 (degree)


#### Set Signature

> **set** **outerCutoff**(`degrees`): `void`

Defined in: [src/light/lights/SpotLight.ts:324](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L324)

외부 컷오프 각도를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `degrees` | `number` | 각도 (degree)

##### Returns

`void`

***

### outerCutoffCos

#### Get Signature

> **get** **outerCutoffCos**(): `number`

Defined in: [src/light/lights/SpotLight.ts:352](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L352)

외부 컷오프 각도의 코사인 값을 반환합니다.


셰이더 계산 등에 사용됩니다.


##### Returns

`number`

코사인 값


***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/SpotLight.ts:168](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L168)

광원의 위치를 [x, y, z] 형태로 반환합니다.


##### Returns

\[`number`, `number`, `number`\]

위치 배열 [x, y, z]


***

### radius

#### Get Signature

> **get** **radius**(): `number`

Defined in: [src/light/lights/SpotLight.ts:179](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L179)

광원의 반경을 반환합니다.


##### Returns

`number`

반경 값


#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:190](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L190)

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

Defined in: [src/light/lights/SpotLight.ts:102](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L102)

X 좌표를 반환합니다.


##### Returns

`number`

X 좌표


#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:113](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L113)

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

Defined in: [src/light/lights/SpotLight.ts:124](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L124)

Y 좌표를 반환합니다.


##### Returns

`number`

Y 좌표


#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:135](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L135)

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

Defined in: [src/light/lights/SpotLight.ts:146](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L146)

Z 좌표를 반환합니다.


##### Returns

`number`

Z 좌표


#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:157](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L157)

Z 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 좌표

##### Returns

`void`

## Methods

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/light/lights/SpotLight.ts:392](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L392)

특정 타겟 위치를 바라보도록 방향 벡터를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | 타겟 X 좌표 또는 [x, y, z] 배열
| `targetY?` | `number` | 타겟 Y 좌표 (targetX가 숫자일 경우)
| `targetZ?` | `number` | 타겟 Z 좌표 (targetX가 숫자일 경우)

#### Returns

`void`

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/light/lights/SpotLight.ts:369](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/light/lights/SpotLight.ts#L369)

광원의 위치를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X 좌표 또는 [x, y, z] 배열
| `y?` | `number` | Y 좌표 (x가 숫자일 경우)
| `z?` | `number` | Z 좌표 (x가 숫자일 경우)

#### Returns

`void`
