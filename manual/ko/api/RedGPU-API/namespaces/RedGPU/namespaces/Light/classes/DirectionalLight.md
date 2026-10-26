[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / DirectionalLight

# Class: DirectionalLight

Defined in: [src/light/lights/DirectionalLight.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L22)

무한히 먼 거리에서 일정한 방향으로 평행하게 입사하는 직사광(Directional Light) 클래스입니다. 거리 감쇠가 없으며 직교 방향 벡터(`direction`) 또는 구면 좌표(`elevation`, `azimuth`)로 입사 방향을 제어합니다.

***

### Example
```typescript
const directionalLight = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff', 100000);
scene.lightManager.addDirectionalLight(directionalLight);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/directionalLight/" style="width:100%; height:500px;"></iframe>

## See

[DirectionalLight example](https://redcamel.github.io/RedGPU/examples/3d/light/directionalLight/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors



***

### Constructor

> **new DirectionalLight**(`direction?`, `color?`, `lux?`): `DirectionalLight`

Defined in: [src/light/lights/DirectionalLight.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L52)

새로운 DirectionalLight 인스턴스를 생성합니다.

#### Example
```typescript
const light = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#fff', 100000);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `direction?` | \[`number`, `number`, `number`\] | `...` | 빛의 진행 방향 벡터 (`[x, y, z]`, 기본값: `[-1, -1, -1]`) |
| `color?` | `string` | `'#fff'` | 조명의 색상 (HEX 문자열, 기본값: `'#fff'`) |
| `lux?` | `number` | `100000` | 조명의 조도 (Lux 단위, 기본값: `100000`) |

#### Returns

`DirectionalLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Accessors



***

### azimuth

#### Get Signature

> **get** **azimuth**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L99)

광원의 방위각(Azimuth, 도 단위)을 반환하거나 설정합니다. 값을 변경하면 `direction` 벡터가 자동으로 갱신됩니다.

##### Returns

`number`

방위각 (도 단위, `degree`)

#### Set Signature

> **set** **azimuth**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:103](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L103)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### direction

#### Get Signature

> **get** **direction**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/DirectionalLight.ts:167](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L167)

빛의 진행 방향 벡터(`[x, y, z]`)를 반환하거나 설정합니다. 값을 변경하면 구면 좌표(`elevation`, `azimuth`)가 자동으로 갱신됩니다.

##### Returns

\[`number`, `number`, `number`\]

방향 벡터 튜플 (`[number, number, number]`)

#### Set Signature

> **set** **direction**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:171](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L171)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

***

### directionX

#### Get Signature

> **get** **directionX**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L116)

빛의 진행 방향 X 성분을 반환하거나 설정합니다. 값을 변경하면 구면 좌표(`elevation`, `azimuth`)가 자동으로 갱신됩니다.

##### Returns

`number`

방향 벡터의 X 성분

#### Set Signature

> **set** **directionX**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:120](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L120)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### directionY

#### Get Signature

> **get** **directionY**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:133](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L133)

빛의 진행 방향 Y 성분을 반환하거나 설정합니다. 값을 변경하면 구면 좌표(`elevation`, `azimuth`)가 자동으로 갱신됩니다.

##### Returns

`number`

방향 벡터의 Y 성분

#### Set Signature

> **set** **directionY**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:137](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L137)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### directionZ

#### Get Signature

> **get** **directionZ**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L150)

빛의 진행 방향 Z 성분을 반환하거나 설정합니다. 값을 변경하면 구면 좌표(`elevation`, `azimuth`)가 자동으로 갱신됩니다.

##### Returns

`number`

방향 벡터의 Z 성분

#### Set Signature

> **set** **directionZ**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:154](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L154)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### drawDebugger

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerDirectionalLight`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerDirectionalLight.md)

Defined in: [src/light/lights/DirectionalLight.ts:186](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L186)

직사광의 시각적 디버거(`DrawDebuggerDirectionalLight`) 인스턴스를 반환합니다.

##### Returns

[`DrawDebuggerDirectionalLight`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerDirectionalLight.md)

디버거 인스턴스 (`DrawDebuggerDirectionalLight`)

***

***

### elevation

#### Get Signature

> **get** **elevation**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L82)

광원의 고도각(Elevation, 도 단위)을 반환하거나 설정합니다. 값을 변경하면 `direction` 벡터가 자동으로 갱신됩니다.

##### Returns

`number`

고도각 (도 단위, `degree`)

#### Set Signature

> **set** **elevation**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L86)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lux

#### Get Signature

> **get** **lux**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L66)

직사광의 조도(Lux)를 반환하거나 설정합니다.

##### Returns

`number`

조도 값 (Lux)

#### Set Signature

> **set** **lux**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L70)

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

Defined in: [src/light/lights/DirectionalLight.ts:198](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/DirectionalLight.ts#L198)

디버거가 활성화된 경우 직사광 디버거 기즈모를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `debugViewRenderState` | [`RenderViewStateData`](../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | 현재 렌더링 뷰의 상태 데이터 (`RenderViewStateData`) |

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
