[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / SpotLight

# Class: SpotLight

Defined in: [src/light/lights/SpotLight.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L28)

한 점에서 특정 방향으로 원뿔(Cone) 형태의 빛을 방출하는 스포트라이트(Spot Light) 클래스입니다. 반경(`radius`) 거리 감쇠와 내·외부 컷오프 각도(`innerCutoff`, `outerCutoff`) 기반 가장자리 감쇠를 지원합니다.

***

### Example
```typescript
const spotLight = new RedGPU.Light.SpotLight('#ffffff', 1000);
spotLight.setPosition(0, 5, 5);
spotLight.lookAt(0, 0, 0);
spotLight.innerCutoff = 15;
spotLight.outerCutoff = 30;
scene.lightManager.addSpotLight(spotLight);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/spotLight/" style="width:100%; height:500px;"></iframe>

## See

- [SpotLight basic example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLight/)
 - [SpotLight performance example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLightPerformance/)
 - [SpotLight with GLTF example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLightWithGltf/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors



***

### Constructor

> **new SpotLight**(`color?`, `lumen?`): `SpotLight`

Defined in: [src/light/lights/SpotLight.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L57)

SpotLight 인스턴스를 생성합니다.

#### Example
```typescript
const light = new RedGPU.Light.SpotLight('#ffffff', 1000);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color?` | `string` | `'#fff'` | 조명의 색상 (HEX 문자열, 기본값: `'#fff'`) |
| `lumen?` | `number` | `1000` | 조명의 광속 (Lumen 단위, 기본값: `1000`) |

#### Returns

`SpotLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Accessors



***

### direction

#### Get Signature

> **get** **direction**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/SpotLight.ts:210](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L210)

빛의 진행 방향 벡터(`[x, y, z]`)를 가져오거나 설정합니다.

##### Returns

\[`number`, `number`, `number`\]

방향 벡터 튜플 (`[number, number, number]`)

#### Set Signature

> **set** **direction**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:214](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L214)

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

Defined in: [src/light/lights/SpotLight.ts:162](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L162)

빛의 진행 방향 X 성분을 가져오거나 설정합니다.

##### Returns

`number`

방향 벡터의 X 성분

#### Set Signature

> **set** **directionX**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:166](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L166)

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

Defined in: [src/light/lights/SpotLight.ts:178](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L178)

빛의 진행 방향 Y 성분을 가져오거나 설정합니다.

##### Returns

`number`

방향 벡터의 Y 성분

#### Set Signature

> **set** **directionY**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:182](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L182)

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

Defined in: [src/light/lights/SpotLight.ts:194](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L194)

빛의 진행 방향 Z 성분을 가져오거나 설정합니다.

##### Returns

`number`

방향 벡터의 Z 성분

#### Set Signature

> **set** **directionZ**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:198](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L198)

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

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerSpotLight`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerSpotLight.md)

Defined in: [src/light/lights/SpotLight.ts:336](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L336)

스포트라이트의 시각적 디버거(`DrawDebuggerSpotLight`) 인스턴스를 반환합니다.

##### Returns

[`DrawDebuggerSpotLight`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerSpotLight.md)

디버거 인스턴스 (`DrawDebuggerSpotLight`)

***

***

### innerCutoff

#### Get Signature

> **get** **innerCutoff**(): `number`

Defined in: [src/light/lights/SpotLight.ts:228](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L228)

빛의 세기가 최대로 유지되는 내부 원뿔 각도(도 단위, `degree`)를 가져오거나 설정합니다.

##### Returns

`number`

내부 컷오프 각도 (도 단위, `degree`)

#### Set Signature

> **set** **innerCutoff**(`degrees`): `void`

Defined in: [src/light/lights/SpotLight.ts:232](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L232)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `degrees` | `number` |

##### Returns

`void`

***

***

### lumen

#### Get Signature

> **get** **lumen**(): `number`

Defined in: [src/light/lights/SpotLight.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L70)

스포트라이트의 광속(Lumen)을 가져오거나 설정합니다.

##### Returns

`number`

광속 값 (Lumen)

#### Set Signature

> **set** **lumen**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L74)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### outerCutoff

#### Get Signature

> **get** **outerCutoff**(): `number`

Defined in: [src/light/lights/SpotLight.ts:244](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L244)

빛이 완전히 소멸하는 외부 원뿔 각도(도 단위, `degree`)를 가져오거나 설정합니다.

##### Returns

`number`

외부 컷오프 각도 (도 단위, `degree`)

#### Set Signature

> **set** **outerCutoff**(`degrees`): `void`

Defined in: [src/light/lights/SpotLight.ts:248](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L248)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `degrees` | `number` |

##### Returns

`void`

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/SpotLight.ts:134](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L134)

광원의 월드 위치 좌표(`[x, y, z]`)를 반환합니다.

##### Returns

\[`number`, `number`, `number`\]

위치 좌표 튜플 (`[number, number, number]`)

***

***

### radius

#### Get Signature

> **get** **radius**(): `number`

Defined in: [src/light/lights/SpotLight.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L146)

빛이 도달하는 최대 감쇠 반경(`radius`)을 가져오거나 설정합니다.

##### Returns

`number`

광원 반경

#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L150)

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

Defined in: [src/light/lights/SpotLight.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L86)

광원의 월드 X 좌표를 가져오거나 설정합니다.

##### Returns

`number`

X축 좌표

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L90)

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

Defined in: [src/light/lights/SpotLight.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L102)

광원의 월드 Y 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Y축 좌표

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:106](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L106)

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

Defined in: [src/light/lights/SpotLight.ts:118](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L118)

광원의 월드 Z 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Z축 좌표

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:122](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L122)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods



***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/light/lights/SpotLight.ts:308](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L308)

광원이 지정된 목표 지점을 바라보도록 방향 벡터(`direction`)를 갱신합니다.

#### Example
```typescript
// 원점을 바라보도록 방향 설정
spotLight.lookAt(0, 0, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | 목표 지점의 X 좌표 또는 `[x, y, z]` 좌표 배열 |
| `targetY?` | `number` | 목표 지점의 Y 좌표 (`targetX`가 숫자인 경우) |
| `targetZ?` | `number` | 목표 지점의 Z 좌표 (`targetX`가 숫자인 경우) |

#### Returns

`void`

***

***

### render()

> **render**(`debugViewRenderState`): `void`

Defined in: [src/light/lights/SpotLight.ts:348](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L348)

디버거가 활성화된 경우 스포트라이트 디버거 기즈모를 렌더링합니다.

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

Defined in: [src/light/lights/SpotLight.ts:277](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/SpotLight.ts#L277)

광원의 월드 위치를 설정합니다.

#### Example
```typescript
// 개별 좌표로 위치 설정
spotLight.setPosition(0, 5, 5);

// 배열로 위치 설정
spotLight.setPosition([0, 5, 5]);
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
