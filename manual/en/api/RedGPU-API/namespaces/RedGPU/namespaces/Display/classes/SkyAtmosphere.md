[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyAtmosphere

# Class: SkyAtmosphere

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:38](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L38)

The SkyAtmosphere class is a physics-based atmospheric scattering simulation system.

Simulates Rayleigh scattering, Mie scattering, and Ozone absorption to create realistic sky, sunset, and aerial perspective effects.

This system utilizes multiple LUT (Look Up Table) generation passes to process computationally intensive physical calculations in real-time.

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new SkyAtmosphere**(`redGPUContext`): `SkyAtmosphere`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:128](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L128)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) |

#### Returns

`SkyAtmosphere`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### absorptionCoefficient

#### Get Signature

> **get** **absorptionCoefficient**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:290](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L290)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **absorptionCoefficient**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:294](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L294)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:306](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L306)

##### Returns

`number`

#### Set Signature

> **set** **absorptionTentWidth**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:310](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L310)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:298](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L298)

##### Returns

`number`

#### Set Signature

> **set** **absorptionTipAltitude**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:302](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L302)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:194](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L194)

##### Returns

`number`

#### Set Signature

> **set** **aerialPerspectiveDistanceScale**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:198](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L198)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:358](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L358)

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

***

### aerialPerspectiveStartDepth

#### Get Signature

> **get** **aerialPerspectiveStartDepth**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:202](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L202)

##### Returns

`number`

#### Set Signature

> **set** **aerialPerspectiveStartDepth**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:206](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L206)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:226](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L226)

##### Returns

`number`

#### Set Signature

> **set** **atmosphereHeight**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:230](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L230)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:374](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L374)

##### Returns

[`Sampler`](../../Resource/classes/Sampler.md)

***

### cloudCoverage

#### Get Signature

> **get** **cloudCoverage**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:170](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L170)

##### Returns

`number`

#### Set Signature

> **set** **cloudCoverage**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:174](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L174)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:178](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L178)

##### Returns

`number`

#### Set Signature

> **set** **cloudDensity**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:182](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L182)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:186](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L186)

##### Returns

`number`

#### Set Signature

> **set** **cloudHeight**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:190](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L190)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:162](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L162)

##### Returns

`number`

#### Set Signature

> **set** **cloudTimeMultiplier**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:166](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L166)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:282](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L282)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **groundAlbedo**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:286](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L286)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:218](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L218)

##### Returns

`number`

#### Set Signature

> **set** **groundRadius**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:222](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L222)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:242](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L242)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **mieAbsorption**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:246](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L246)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:274](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L274)

##### Returns

`number`

#### Set Signature

> **set** **mieAnisotropy**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:278](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L278)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:266](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L266)

##### Returns

`number`

#### Set Signature

> **set** **mieExponentialDistribution**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:270](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L270)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:234](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L234)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **mieScattering**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:238](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L238)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:350](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L350)

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

***

### multiScatteringFactor

#### Get Signature

> **get** **multiScatteringFactor**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:314](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L314)

##### Returns

`number`

#### Set Signature

> **set** **multiScatteringFactor**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:318](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L318)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:158](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L158)

##### Returns

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `absorptionCoefficient` | `number`[] | - | Ozone absorption coefficient | [src/display/skyAtmosphere/SkyAtmosphere.ts:75](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L75) |
| `absorptionTentWidth` | `number` | `15.0` | Ozone distribution width | [src/display/skyAtmosphere/SkyAtmosphere.ts:81](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L81) |
| `absorptionTipAltitude` | `number` | `25.0` | Ozone peak density altitude (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:77](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L77) |
| `aerialPerspectiveDistanceScale` | `number` | `100.0` | Aerial Perspective distance scale | [src/display/skyAtmosphere/SkyAtmosphere.ts:95](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L95) |
| `aerialPerspectiveStartDepth` | `number` | `0.0` | Aerial Perspective start depth | [src/display/skyAtmosphere/SkyAtmosphere.ts:97](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L97) |
| `atmosphereHeight` | `number` | `60.0` | Atmosphere height (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:93](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L93) |
| `cameraHeight` | `number` | `0.001` | Current camera height (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:105](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L105) |
| `cloudCoverage` | `number` | `0.4` | Cloud coverage (0 to 1) | [src/display/skyAtmosphere/SkyAtmosphere.ts:111](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L111) |
| `cloudDensity` | `number` | `0.7` | Cloud density (0 to 1) | [src/display/skyAtmosphere/SkyAtmosphere.ts:113](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L113) |
| `cloudHeight` | `number` | `5.0` | Cloud height (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:115](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L115) |
| `cloudTime` | `number` | `0.0` | Cloud animation time | [src/display/skyAtmosphere/SkyAtmosphere.ts:107](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L107) |
| `cloudTimeMultiplier` | `number` | `0.0` | Cloud time multiplier | [src/display/skyAtmosphere/SkyAtmosphere.ts:109](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L109) |
| `groundAlbedo` | `number`[] | - | Ground albedo | [src/display/skyAtmosphere/SkyAtmosphere.ts:79](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L79) |
| `groundRadius` | `number` | `6360.0` | Planet ground radius (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:91](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L91) |
| `mieAbsorption` | `number`[] | - | Mie absorption coefficient | [src/display/skyAtmosphere/SkyAtmosphere.ts:71](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L71) |
| `mieAnisotropy` | `number` | `0.8` | Mie anisotropy coefficient (G-factor) | [src/display/skyAtmosphere/SkyAtmosphere.ts:69](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L69) |
| `mieExponentialDistribution` | `number` | `1.2` | Mie exponential distribution altitude (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:73](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L73) |
| `mieScattering` | `number`[] | - | Mie scattering coefficient | [src/display/skyAtmosphere/SkyAtmosphere.ts:67](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L67) |
| `multiScatteringFactor` | `number` | `1.0` | Multi-scattering correction factor | [src/display/skyAtmosphere/SkyAtmosphere.ts:85](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L85) |
| `rayleighExponentialDistribution` | `number` | `8.0` | Rayleigh exponential distribution altitude (km) | [src/display/skyAtmosphere/SkyAtmosphere.ts:65](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L65) |
| `rayleighScattering` | `number`[] | - | Rayleigh scattering coefficient | [src/display/skyAtmosphere/SkyAtmosphere.ts:63](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L63) |
| `skyLuminanceFactor` | `number`[] | - | Overall sky luminance factor | [src/display/skyAtmosphere/SkyAtmosphere.ts:83](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L83) |
| `sunDirection` | `Float32Array`\<`ArrayBuffer`\> | - | Sun direction vector | [src/display/skyAtmosphere/SkyAtmosphere.ts:87](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L87) |
| `sunIntensity` | `number` | `100000.0` | Sun intensity (lux) | [src/display/skyAtmosphere/SkyAtmosphere.ts:99](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L99) |
| `sunLimbDarkening` | `number` | `0.5` | Sun limb darkening intensity | [src/display/skyAtmosphere/SkyAtmosphere.ts:103](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L103) |
| `sunSize` | `number` | `0.533` | Visual size of the sun | [src/display/skyAtmosphere/SkyAtmosphere.ts:101](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L101) |
| `transmittanceMinLightElevationAngle` | `number` | `-90.0` | Minimum light elevation angle for transmittance | [src/display/skyAtmosphere/SkyAtmosphere.ts:89](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L89) |

***

### postEffect

#### Get Signature

> **get** **postEffect**(): [`SkyAtmospherePostEffect`](../namespaces/CoreSkyAtmosphere/classes/SkyAtmospherePostEffect.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:154](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L154)

Returns Post Effect instance

##### Returns

[`SkyAtmospherePostEffect`](../namespaces/CoreSkyAtmosphere/classes/SkyAtmospherePostEffect.md)

***

### rayleighExponentialDistribution

#### Get Signature

> **get** **rayleighExponentialDistribution**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:258](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L258)

##### Returns

`number`

#### Set Signature

> **set** **rayleighExponentialDistribution**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:262](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L262)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:250](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L250)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **rayleighScattering**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:254](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L254)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:362](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L362)

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

***

### skyAtmosphereReflectionLUT

#### Get Signature

> **get** **skyAtmosphereReflectionLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:366](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L366)

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

***

### skyLight

#### Get Signature

> **get** **skyLight**(): [`SkyLight`](../namespaces/CoreSkyAtmosphere/classes/SkyLight.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:370](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L370)

##### Returns

[`SkyLight`](../namespaces/CoreSkyAtmosphere/classes/SkyLight.md)

***

### skyLuminanceFactor

#### Get Signature

> **get** **skyLuminanceFactor**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:338](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L338)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **skyLuminanceFactor**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:342](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L342)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:354](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L354)

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

***

### sunLimbDarkening

#### Get Signature

> **get** **sunLimbDarkening**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:330](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L330)

##### Returns

`number`

#### Set Signature

> **set** **sunLimbDarkening**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:334](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L334)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:322](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L322)

##### Returns

`number`

#### Set Signature

> **set** **sunSize**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:326](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L326)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:346](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L346)

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

***

### transmittanceMinLightElevationAngle

#### Get Signature

> **get** **transmittanceMinLightElevationAngle**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:210](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L210)

##### Returns

`number`

#### Set Signature

> **set** **transmittanceMinLightElevationAngle**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:214](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L214)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:414](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L414)

#### Returns

`void`

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:396](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L396)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:382](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L382)

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

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:401](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/skyAtmosphere/SkyAtmosphere.ts#L401)

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

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L76)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L88)

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

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L52)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L40)

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

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/RedGPUObject.ts#L64)

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

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
