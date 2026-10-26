[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Wind](../README.md) / WindManager

# Class: WindManager

Defined in: [src/wind/WindManager.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L24)

Class that manages scene-wide wind direction, speed, and strength; automatically created internally by the Scene.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
// Correct access method
const windManager = scene.windManager;
windManager.directionAngle = 45;
windManager.speed = 2.0;
windManager.strength = 1.5;
```

## Constructors

### Constructor

> **new WindManager**(`scene`): `WindManager`

Defined in: [src/wind/WindManager.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L41)

Creates a WindManager instance. (Internal system only)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `scene` | [`Scene`](../../Display/classes/Scene.md) | Parent Scene instance |

#### Returns

`WindManager`

## Accessors

### directionAngle

#### Get Signature

> **get** **directionAngle**(): `number`

Defined in: [src/wind/WindManager.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L70)

Horizontal wind direction angle on the XZ plane. (Unit: degree, 0 ~ 360, default: 0)

#### Example
```typescript
scene.windManager.directionAngle = 45;
```

##### Returns

`number`

Direction angle (degree)

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

Returns the normalized X component (`cos(directionAngle)`) of the wind direction.

##### Returns

`number`

Normalized X direction component

***

### directionZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **directionZ**(): `number`

Defined in: [src/wind/WindManager.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L101)

Returns the normalized Z component (`sin(directionAngle)`) of the wind direction.

##### Returns

`number`

Normalized Z direction component

***

### enabled

#### Get Signature

> **get** **enabled**(): `boolean`

Defined in: [src/wind/WindManager.ts:145](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L145)

Whether the wind effect is enabled. (default: true)

##### Returns

`boolean`

Enabled state

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

Returns the parent Scene instance.

##### Returns

[`Scene`](../../Display/classes/Scene.md)

Parent Scene

***

### speed

#### Get Signature

> **get** **speed**(): `number`

Defined in: [src/wind/WindManager.ts:113](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L113)

Time multiplier of the wind animation. (default: 1.0)

##### Returns

`number`

Speed multiplier

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

Base wind strength (force). (default: 1.0)

##### Returns

`number`

Wind strength

#### Set Signature

> **set** **strength**(`value`): `void`

Defined in: [src/wind/WindManager.ts:133](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/wind/WindManager.ts#L133)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
