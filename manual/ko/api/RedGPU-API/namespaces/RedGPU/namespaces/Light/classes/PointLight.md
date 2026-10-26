[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / PointLight

# Class: PointLight

Defined in: [src/light/lights/PointLight.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L26)

한 점에서 모든 방향으로 균일하게 퍼져 나가는 점광원(Point Light) 클래스입니다. 설정된 반경(`radius`) 내에서 거리에 따라 빛의 세기가 감쇠합니다.

***

### Example
```typescript
const pointLight = new RedGPU.Light.PointLight('#ffcc00', 1000);
pointLight.setPosition(0, 5, 0);
pointLight.radius = 15;
scene.lightManager.addPointLight(pointLight);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/pointLight/" style="width:100%; height:500px;"></iframe>

## See

- [PointLight basic example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLight/)
 - [PointLight performance example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLightPerformance/)
 - [PointLight with GLTF example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLightWithGltf/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors



***

### Constructor

> **new PointLight**(`color?`, `lumen?`): `PointLight`

Defined in: [src/light/lights/PointLight.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L50)

PointLight 인스턴스를 생성합니다.

#### Example
```typescript
const light = new RedGPU.Light.PointLight('#ffffff', 1000);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color?` | `string` | `'#fff'` | 조명의 색상 (HEX 문자열, 기본값: `'#fff'`) |
| `lumen?` | `number` | `1000` | 조명의 광속 (Lumen 단위, 기본값: `1000`) |

#### Returns

`PointLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Accessors



***

### drawDebugger

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerPointLight`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerPointLight.md)

Defined in: [src/light/lights/PointLight.ts:190](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L190)

점광원의 시각적 디버거(`DrawDebuggerPointLight`) 인스턴스를 반환합니다.

##### Returns

[`DrawDebuggerPointLight`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerPointLight.md)

디버거 인스턴스 (`DrawDebuggerPointLight`)

***

***

### lumen

#### Get Signature

> **get** **lumen**(): `number`

Defined in: [src/light/lights/PointLight.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L63)

점광원의 광속(Lumen)을 가져오거나 설정합니다.

##### Returns

`number`

광속 값 (Lumen)

#### Set Signature

> **set** **lumen**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:67](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L67)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/PointLight.ts:127](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L127)

광원의 월드 위치 좌표(`[x, y, z]`)를 반환합니다.

##### Returns

\[`number`, `number`, `number`\]

위치 좌표 튜플 (`[number, number, number]`)

***

***

### radius

#### Get Signature

> **get** **radius**(): `number`

Defined in: [src/light/lights/PointLight.ts:139](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L139)

빛이 도달하는 최대 감쇠 반경(`radius`)을 가져오거나 설정합니다.

##### Returns

`number`

광원 반경

#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L143)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/light/lights/PointLight.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L79)

광원의 월드 X 좌표를 가져오거나 설정합니다.

##### Returns

`number`

X축 좌표

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:83](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L83)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/light/lights/PointLight.ts:95](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L95)

광원의 월드 Y 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Y축 좌표

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L99)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/light/lights/PointLight.ts:111](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L111)

광원의 월드 Z 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Z축 좌표

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L115)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods



***

### render()

> **render**(`debugViewRenderState`): `void`

Defined in: [src/light/lights/PointLight.ts:202](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L202)

디버거가 활성화된 경우 점광원 디버거 기즈모를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `debugViewRenderState` | [`RenderViewStateData`](../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | 현재 렌더링 뷰의 상태 데이터 (`RenderViewStateData`) |

#### Returns

`void`

***

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/light/lights/PointLight.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L172)

광원의 월드 위치를 설정합니다.

#### Example
```typescript
// 개별 좌표로 위치 설정
pointLight.setPosition(10, 5, -3);

// 배열로 위치 설정
pointLight.setPosition([10, 5, -3]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X축 좌표 또는 `[x, y, z]` 좌표 배열 |
| `y?` | `number` | Y축 좌표 (`x`가 숫자인 경우) |
| `z?` | `number` | Z축 좌표 (`x`가 숫자인 경우) |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L61)

조명의 색상(`ColorRGB`) 인스턴스를 반환하거나 설정합니다.

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

조명의 `ColorRGB` 인스턴스

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`ColorRGB`](../../Color/classes/ColorRGB.md) |

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`color`](../namespaces/Core/classes/ABaseLight.md#color)

***

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

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`enableDebugger`](../namespaces/Core/classes/ABaseLight.md#enabledebugger)

***

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

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`intensityMultiplier`](../namespaces/Core/classes/ABaseLight.md#intensitymultiplier)

***

</details>
