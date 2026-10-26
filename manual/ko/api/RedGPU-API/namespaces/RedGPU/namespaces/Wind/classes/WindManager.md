[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Wind](../README.md) / WindManager

# Class: WindManager

Defined in: [src/wind/WindManager.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L24)

씬 전역의 바람 방향, 속도, 세기를 관리하는 클래스로, Scene에 의해 내부적으로 자동 생성됩니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
// 올바른 접근 방법
const windManager = scene.windManager;
windManager.directionAngle = 45;
windManager.speed = 2.0;
windManager.strength = 1.5;
```

## Constructors

### Constructor

> **new WindManager**(`scene`): `WindManager`

Defined in: [src/wind/WindManager.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L41)

WindManager 인스턴스를 생성합니다. (내부 시스템 전용)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `scene` | [`Scene`](../../Display/classes/Scene.md) | 소속 Scene 인스턴스 |

#### Returns

`WindManager`

## Accessors

### directionAngle

#### Get Signature

> **get** **directionAngle**(): `number`

Defined in: [src/wind/WindManager.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L70)

XZ 평면 기준 바람의 수평 진행 방향 각도입니다. (단위: degree, 0 ~ 360, 기본값: 0)

#### Example
```typescript
scene.windManager.directionAngle = 45;
```

##### Returns

`number`

방향 각도 (degree)

#### Set Signature

> **set** **directionAngle**(`deg`): `void`

Defined in: [src/wind/WindManager.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L74)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `deg` | `number` |

##### Returns

`void`

***

### directionX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **directionX**(): `number`

Defined in: [src/wind/WindManager.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L89)

바람 진행 방향의 정규화된 X 성분 (`cos(directionAngle)`)을 반환합니다.

##### Returns

`number`

정규화된 X 방향 성분

***

### directionZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **directionZ**(): `number`

Defined in: [src/wind/WindManager.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L101)

바람 진행 방향의 정규화된 Z 성분 (`sin(directionAngle)`)을 반환합니다.

##### Returns

`number`

정규화된 Z 방향 성분

***

### enabled

#### Get Signature

> **get** **enabled**(): `boolean`

Defined in: [src/wind/WindManager.ts:145](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L145)

바람 효과 활성화 여부입니다. (기본값: true)

##### Returns

`boolean`

활성화 여부

#### Set Signature

> **set** **enabled**(`value`): `void`

Defined in: [src/wind/WindManager.ts:149](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L149)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### scene

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **scene**(): [`Scene`](../../Display/classes/Scene.md)

Defined in: [src/wind/WindManager.ts:53](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L53)

소속 Scene 인스턴스를 반환합니다.

##### Returns

[`Scene`](../../Display/classes/Scene.md)

소속 Scene

***

### speed

#### Get Signature

> **get** **speed**(): `number`

Defined in: [src/wind/WindManager.ts:113](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L113)

바람 애니메이션의 시간 배율입니다. (기본값: 1.0)

##### Returns

`number`

속도 배율

#### Set Signature

> **set** **speed**(`value`): `void`

Defined in: [src/wind/WindManager.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L117)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### strength

#### Get Signature

> **get** **strength**(): `number`

Defined in: [src/wind/WindManager.ts:129](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L129)

바람의 기본 세기(풍압)입니다. (기본값: 1.0)

##### Returns

`number`

바람 세기

#### Set Signature

> **set** **strength**(`value`): `void`

Defined in: [src/wind/WindManager.ts:133](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L133)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
