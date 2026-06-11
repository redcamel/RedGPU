[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyAtmosphere

# Class: SkyAtmosphere

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:41](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L41)

The SkyAtmosphere class is a physics-based atmospheric scattering simulation system.

Simulates Rayleigh scattering, Mie scattering, and Ozone absorption to create realistic sky, sunset, and aerial perspective effects.

This system utilizes multiple LUT (Look Up Table) generation passes to process computationally intensive physical calculations in real-time.

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new SkyAtmosphere**(`redGPUContext`): `SkyAtmosphere`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:130](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L130)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) |

#### Returns

`SkyAtmosphere`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors

### absorptionCoefficient

#### Get Signature

> **get** **absorptionCoefficient**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:291](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L291)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **absorptionCoefficient**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:295](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L295)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### absorptionTentWidth

#### Get Signature

> **get** **absorptionTentWidth**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:307](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L307)

##### Returns

`number`

#### Set Signature

> **set** **absorptionTentWidth**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:311](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L311)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### absorptionTipAltitude

#### Get Signature

> **get** **absorptionTipAltitude**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:299](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L299)

##### Returns

`number`

#### Set Signature

> **set** **absorptionTipAltitude**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:303](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L303)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### aerialPerspectiveDistanceScale

#### Get Signature

> **get** **aerialPerspectiveDistanceScale**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:195](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L195)

##### Returns

`number`

#### Set Signature

> **set** **aerialPerspectiveDistanceScale**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:199](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L199)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### aerialPerspectiveLUT

#### Get Signature

> **get** **aerialPerspectiveLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:359](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L359)

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

***

### aerialPerspectiveStartDepth

#### Get Signature

> **get** **aerialPerspectiveStartDepth**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:203](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L203)

##### Returns

`number`

#### Set Signature

> **set** **aerialPerspectiveStartDepth**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:207](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L207)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### atmosphereHeight

#### Get Signature

> **get** **atmosphereHeight**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:227](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L227)

##### Returns

`number`

#### Set Signature

> **set** **atmosphereHeight**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:231](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L231)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### atmosphereSampler

#### Get Signature

> **get** **atmosphereSampler**(): [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:375](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L375)

##### Returns

[`Sampler`](../../Resource/classes/Sampler.md)

***

### cloudCoverage

#### Get Signature

> **get** **cloudCoverage**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:171](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L171)

##### Returns

`number`

#### Set Signature

> **set** **cloudCoverage**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:175](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L175)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### cloudDensity

#### Get Signature

> **get** **cloudDensity**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:179](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L179)

##### Returns

`number`

#### Set Signature

> **set** **cloudDensity**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:183](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L183)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### cloudHeight

#### Get Signature

> **get** **cloudHeight**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:187](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L187)

##### Returns

`number`

#### Set Signature

> **set** **cloudHeight**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:191](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L191)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### cloudTimeMultiplier

#### Get Signature

> **get** **cloudTimeMultiplier**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:163](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L163)

##### Returns

`number`

#### Set Signature

> **set** **cloudTimeMultiplier**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:167](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L167)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### groundAlbedo

#### Get Signature

> **get** **groundAlbedo**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:283](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L283)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **groundAlbedo**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:287](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L287)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### groundRadius

#### Get Signature

> **get** **groundRadius**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:219](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L219)

##### Returns

`number`

#### Set Signature

> **set** **groundRadius**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:223](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L223)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### mieAbsorption

#### Get Signature

> **get** **mieAbsorption**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:243](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L243)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **mieAbsorption**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:247](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L247)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### mieAnisotropy

#### Get Signature

> **get** **mieAnisotropy**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:275](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L275)

##### Returns

`number`

#### Set Signature

> **set** **mieAnisotropy**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:279](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L279)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### mieExponentialDistribution

#### Get Signature

> **get** **mieExponentialDistribution**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:267](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L267)

##### Returns

`number`

#### Set Signature

> **set** **mieExponentialDistribution**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:271](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L271)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### mieScattering

#### Get Signature

> **get** **mieScattering**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:235](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L235)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **mieScattering**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:239](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L239)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### multiScatLUT

#### Get Signature

> **get** **multiScatLUT**(): [`DirectTexture`](../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:351](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L351)

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

***

### multiScatteringFactor

#### Get Signature

> **get** **multiScatteringFactor**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:315](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L315)

##### Returns

`number`

#### Set Signature

> **set** **multiScatteringFactor**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:319](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L319)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### params

#### Get Signature

> **get** **params**(): `object`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:159](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L159)

##### Returns

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `absorptionCoefficient` | `number`[] | - | Ozone absorption coefficient | [src/display/skyAtmosphere/SkyAtmosphere.ts:78](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L78) |
| `absorptionTentWidth` | `number` | `15.0` | Ozone distribution width | [src/display/skyAtmosphere/SkyAtmosphere.ts:84](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L84) |
| `absorptionTipAltitude` | `number` | `25.0` | Ozone peak density altitude (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:80](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L80) |
| `aerialPerspectiveDistanceScale` | `number` | `100.0` | Aerial Perspective distance scale | [src/display/skyAtmosphere/SkyAtmosphere.ts:98](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L98) |
| `aerialPerspectiveStartDepth` | `number` | `0.0` | Aerial Perspective start depth | [src/display/skyAtmosphere/SkyAtmosphere.ts:100](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L100) |
| `atmosphereHeight` | `number` | `60.0` | Atmosphere height (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:96](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L96) |
| `cameraHeight` | `number` | `0.001` | Current camera height (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:108](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L108) |
| `cloudCoverage` | `number` | `0.4` | Cloud coverage (0 to 1) | [src/display/skyAtmosphere/SkyAtmosphere.ts:114](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L114) |
| `cloudDensity` | `number` | `0.7` | Cloud density (0 to 1) | [src/display/skyAtmosphere/SkyAtmosphere.ts:116](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L116) |
| `cloudHeight` | `number` | `5.0` | Cloud height (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:118](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L118) |
| `cloudTime` | `number` | `0.0` | Cloud animation time | [src/display/skyAtmosphere/SkyAtmosphere.ts:110](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L110) |
| `cloudTimeMultiplier` | `number` | `0.0` | Cloud time multiplier | [src/display/skyAtmosphere/SkyAtmosphere.ts:112](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L112) |
| `groundAlbedo` | `number`[] | - | Ground albedo | [src/display/skyAtmosphere/SkyAtmosphere.ts:82](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L82) |
| `groundRadius` | `number` | `6360.0` | Planet ground radius (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:94](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L94) |
| `mieAbsorption` | `number`[] | - | Mie absorption coefficient | [src/display/skyAtmosphere/SkyAtmosphere.ts:74](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L74) |
| `mieAnisotropy` | `number` | `0.8` | Mie anisotropy coefficient (G-factor) | [src/display/skyAtmosphere/SkyAtmosphere.ts:72](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L72) |
| `mieExponentialDistribution` | `number` | `1.2` | Mie exponential distribution altitude (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:76](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L76) |
| `mieScattering` | `number`[] | - | Mie scattering coefficient | [src/display/skyAtmosphere/SkyAtmosphere.ts:70](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L70) |
| `multiScatteringFactor` | `number` | `1.0` | Multi-scattering correction factor | [src/display/skyAtmosphere/SkyAtmosphere.ts:88](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L88) |
| `rayleighExponentialDistribution` | `number` | `8.0` | Rayleigh exponential distribution altitude (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:68](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L68) |
| `rayleighScattering` | `number`[] | - | Rayleigh scattering coefficient | [src/display/skyAtmosphere/SkyAtmosphere.ts:66](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L66) |
| `skyLuminanceFactor` | `number`[] | - | Overall sky luminance factor | [src/display/skyAtmosphere/SkyAtmosphere.ts:86](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L86) |
| `sunDirection` | `Float32Array`\<`ArrayBuffer`\> | - | Sun direction vector | [src/display/skyAtmosphere/SkyAtmosphere.ts:90](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L90) |
| `sunIntensity` | `number` | `100000.0` | Sun intensity (lux) | [src/display/skyAtmosphere/SkyAtmosphere.ts:102](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L102) |
| `sunLimbDarkening` | `number` | `0.5` | Sun limb darkening intensity | [src/display/skyAtmosphere/SkyAtmosphere.ts:106](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L106) |
| `sunSize` | `number` | `0.533` | Visual size of the sun | [src/display/skyAtmosphere/SkyAtmosphere.ts:104](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L104) |
| `transmittanceMinLightElevationAngle` | `number` | `-90.0` | Minimum light elevation angle for transmittance | [src/display/skyAtmosphere/SkyAtmosphere.ts:92](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L92) |

***

### postEffect

#### Get Signature

> **get** **postEffect**(): [`SkyAtmospherePostEffect`](../namespaces/CoreSkyAtmosphere/classes/SkyAtmospherePostEffect.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:155](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L155)

Returns Post Effect instance

##### Returns

[`SkyAtmospherePostEffect`](../namespaces/CoreSkyAtmosphere/classes/SkyAtmospherePostEffect.md)

***

### rayleighExponentialDistribution

#### Get Signature

> **get** **rayleighExponentialDistribution**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:259](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L259)

##### Returns

`number`

#### Set Signature

> **set** **rayleighExponentialDistribution**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:263](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L263)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### rayleighScattering

#### Get Signature

> **get** **rayleighScattering**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:251](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L251)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **rayleighScattering**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:255](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L255)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### skyAtmosphereIrradianceLUT

#### Get Signature

> **get** **skyAtmosphereIrradianceLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:363](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L363)

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

***

### skyAtmosphereReflectionLUT

#### Get Signature

> **get** **skyAtmosphereReflectionLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:367](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L367)

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

***

### skyLight

#### Get Signature

> **get** **skyLight**(): [`SkyLight`](../namespaces/CoreSkyAtmosphere/classes/SkyLight.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:371](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L371)

##### Returns

[`SkyLight`](../namespaces/CoreSkyAtmosphere/classes/SkyLight.md)

***

### skyLuminanceFactor

#### Get Signature

> **get** **skyLuminanceFactor**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:339](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L339)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **skyLuminanceFactor**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:343](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L343)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### skyViewLUT

#### Get Signature

> **get** **skyViewLUT**(): [`DirectTexture`](../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:355](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L355)

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

***

### sunLimbDarkening

#### Get Signature

> **get** **sunLimbDarkening**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:331](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L331)

##### Returns

`number`

#### Set Signature

> **set** **sunLimbDarkening**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:335](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L335)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### sunSize

#### Get Signature

> **get** **sunSize**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:323](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L323)

##### Returns

`number`

#### Set Signature

> **set** **sunSize**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:327](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L327)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### transmittanceLUT

#### Get Signature

> **get** **transmittanceLUT**(): [`DirectTexture`](../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:347](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L347)

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

***

### transmittanceMinLightElevationAngle

#### Get Signature

> **get** **transmittanceMinLightElevationAngle**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:211](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L211)

##### Returns

`number`

#### Set Signature

> **set** **transmittanceMinLightElevationAngle**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:215](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L215)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:397](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L397)

Performs post-effect rendering. (Dedicated to atmospheric transmittance on object regions)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](View3D.md) |
| `width` | `number` |
| `height` | `number` |
| `sourceTextureInfo` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) |

#### Returns

[`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

***

### renderBackground()

> **renderBackground**(`renderViewStateData`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:383](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L383)

Performs background rendering. (Dedicated to infinite distance background processing)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) |

#### Returns

`void`

***

### update()

> **update**(`view`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:402](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/display/skyAtmosphere/SkyAtmosphere.ts#L402)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](View3D.md) |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L71)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
