[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / SpotLight

# Class: SpotLight

Defined in: [src/light/lights/SpotLight.ts:26](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L26)

스포트라이트(SpotLight)를 정의하는 클래스입니다.

이 광원은 특정 위치에서 지정된 방향으로 빛을 방사하며, 내부/외부 컷오프 각도를 통해 빛의 퍼짐 범위를 제어할 수 있습니다.
```typescript
const light = new RedGPU.Light.SpotLight('#ffffff', 2.0);
light.setPosition(0, 5, 10);
light.lookAt(0, 0, 0);
scene.lightManager.addSpotLight(light);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/spotLight/" ></iframe>

아래는 SpotLight 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.

## See

 - [SpotLight Cluster Performance example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLightPerformance/)
 - [SpotLight with glTF example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLightWithGltf/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new SpotLight**(`color?`, `lumen?`): `SpotLight`

Defined in: [src/light/lights/SpotLight.ts:94](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L94)

새로운 SpotLight 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `'#fff'` | 광원의 색상 (hex 문자열, 예: '#ffffff')
| `lumen` | `number` | `1000` | 광원의 광선속 (Lumen, lm, 기본값: 1,000)

#### Returns

`SpotLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Properties

### direction

#### Get Signature

> **get** **direction**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/SpotLight.ts:293](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L293)

광원의 방향 벡터를 [x, y, z] 형태로 반환합니다.

##### Returns

\[`number`, `number`, `number`\]

방향 벡터 [x, y, z]

#### Set Signature

> **set** **direction**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:304](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L304)

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

Defined in: [src/light/lights/SpotLight.ts:227](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L227)

방향 벡터의 X 성분을 반환합니다.

##### Returns

`number`

X 성분 값

#### Set Signature

> **set** **directionX**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:238](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L238)

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

Defined in: [src/light/lights/SpotLight.ts:249](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L249)

방향 벡터의 Y 성분을 반환합니다.

##### Returns

`number`

Y 성분 값

#### Set Signature

> **set** **directionY**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:260](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L260)

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

Defined in: [src/light/lights/SpotLight.ts:271](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L271)

방향 벡터의 Z 성분을 반환합니다.

##### Returns

`number`

Z 성분 값

#### Set Signature

> **set** **directionZ**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:282](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L282)

방향 벡터의 Z 성분을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 성분 값

##### Returns

`void`

***

### innerCutoff

#### Get Signature

> **get** **innerCutoff**(): `number`

Defined in: [src/light/lights/SpotLight.ts:317](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L317)

내부 컷오프 각도를 반환합니다.

##### Returns

`number`

각도 (degree)

#### Set Signature

> **set** **innerCutoff**(`degrees`): `void`

Defined in: [src/light/lights/SpotLight.ts:328](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L328)

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

Defined in: [src/light/lights/SpotLight.ts:364](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L364)

내부 컷오프 각도의 코사인 값을 반환합니다.

셰이더 계산 등에 사용됩니다.

##### Returns

`number`

코사인 값

***

### lumen

#### Get Signature

> **get** **lumen**(): `number`

Defined in: [src/light/lights/SpotLight.ts:106](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L106)

광원의 광선속(Lumen, lm)을 반환합니다.

##### Returns

`number`

광선속 값

#### Set Signature

> **set** **lumen**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:117](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L117)

광원의 광선속(Lumen, lm)을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 광선속 값 (예: 1,000)

##### Returns

`void`

***

### outerCutoff

#### Get Signature

> **get** **outerCutoff**(): `number`

Defined in: [src/light/lights/SpotLight.ts:339](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L339)

외부 컷오프 각도를 반환합니다.

##### Returns

`number`

각도 (degree)

#### Set Signature

> **set** **outerCutoff**(`degrees`): `void`

Defined in: [src/light/lights/SpotLight.ts:350](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L350)

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

Defined in: [src/light/lights/SpotLight.ts:378](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L378)

외부 컷오프 각도의 코사인 값을 반환합니다.

셰이더 계산 등에 사용됩니다.

##### Returns

`number`

코사인 값

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/SpotLight.ts:194](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L194)

광원의 위치를 [x, y, z] 형태로 반환합니다.

##### Returns

\[`number`, `number`, `number`\]

위치 배열 [x, y, z]

***

### radius

#### Get Signature

> **get** **radius**(): `number`

Defined in: [src/light/lights/SpotLight.ts:205](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L205)

광원의 반경을 반환합니다.

##### Returns

`number`

반경 값

#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:216](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L216)

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

Defined in: [src/light/lights/SpotLight.ts:128](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L128)

X 좌표를 반환합니다.

##### Returns

`number`

X 좌표

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:139](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L139)

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

Defined in: [src/light/lights/SpotLight.ts:150](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L150)

Y 좌표를 반환합니다.

##### Returns

`number`

Y 좌표

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:161](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L161)

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

Defined in: [src/light/lights/SpotLight.ts:172](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L172)

Z 좌표를 반환합니다.

##### Returns

`number`

Z 좌표

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:183](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L183)

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

Defined in: [src/light/lights/SpotLight.ts:418](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L418)

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

Defined in: [src/light/lights/SpotLight.ts:395](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/lights/SpotLight.ts#L395)

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

Defined in: [src/light/core/ABaseLight.ts:22](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L22)

광원의 디버깅 시각화를 위한 도우미 객체입니다.

외부에서 설정되며, 광원의 위치나 방향을 시각적으로 표시할 수 있습니다.

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`drawDebugger`](../namespaces/Core/classes/ABaseLight.md#drawdebugger)

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:84](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L84)

광원의 색상을 반환합니다.

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

ColorRGB 객체

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:95](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L95)

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

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`enableDebugger`](../namespaces/Core/classes/ABaseLight.md#enabledebugger)

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

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`intensityMultiplier`](../namespaces/Core/classes/ABaseLight.md#intensitymultiplier)

***


</details>
