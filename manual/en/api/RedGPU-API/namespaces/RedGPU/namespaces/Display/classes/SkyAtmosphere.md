[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyAtmosphere

# Class: SkyAtmosphere

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L54)

Physically based atmospheric simulation class that precomputes Rayleigh scattering, Mie scattering, and Ozone absorption into multi-stage LUTs to generate real-time sky backgrounds, aerial perspective, and indirect lighting (IBL).

***

### Example
```typescript
const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
view.skyAtmosphere = skyAtmosphere;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/skyAtmosphere/skyAtmosphere/" style="width:100%; height:500px;"></iframe>

## See

- [SkyAtmosphere Basic Example](https://redcamel.github.io/RedGPU/examples/3d/skyAtmosphere/skyAtmosphere/)
 - [SkyAtmosphere Scattering Test](https://redcamel.github.io/RedGPU/examples/3d/skyAtmosphere/scatteringTest/)
 - [SkyAtmosphere GLTF Example](https://redcamel.github.io/RedGPU/examples/3d/skyAtmosphere/gltf/)
 - [SkyAtmosphere LUT Generator Test](https://redcamel.github.io/RedGPU/examples/3d/skyAtmosphere/generator/)

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new SkyAtmosphere**(`redGPUContext`): `SkyAtmosphere`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:149](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L149)

Creates a SkyAtmosphere instance.

#### Example
```typescript
const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`SkyAtmosphere`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### absorption

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **absorption**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:479](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L479)

Returns the Ozone layer light absorption RGB color (`ColorRGB`) object. (Default: `ColorRGB(88, 255, 12)`)

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

Ozone absorption `ColorRGB` instance

***

***

### absorptionScale

#### Get Signature

> **get** **absorptionScale**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:491](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L491)

Gets or sets the Ozone layer absorption coefficient scale (unit: km⁻¹, 0 or greater). (Default: 0.001881)

##### Returns

`number`

Ozone absorption coefficient scale (km⁻¹)

#### Set Signature

> **set** **absorptionScale**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:495](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L495)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### absorptionTentWidth

#### Get Signature

> **get** **absorptionTentWidth**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:525](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L525)

Gets or sets the distribution width of the Ozone layer (unit: km, range: 1 to 50). (Default: 15.0)

##### Returns

`number`

Ozone distribution width (km)

#### Set Signature

> **set** **absorptionTentWidth**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:529](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L529)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### absorptionTipAltitude

#### Get Signature

> **get** **absorptionTipAltitude**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:509](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L509)

Gets or sets the altitude where Ozone density peaks (unit: km, range: 0 to 100). (Default: 25.0)

##### Returns

`number`

Ozone peak density altitude (km)

#### Set Signature

> **set** **absorptionTipAltitude**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:513](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L513)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### aerialPerspectiveDistanceScale

#### Get Signature

> **get** **aerialPerspectiveDistanceScale**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L265)

Gets or sets the distance scale for the aerial perspective effect (range: 1 to 1000). (Default: 100.0)

##### Returns

`number`

Distance scale

#### Set Signature

> **set** **aerialPerspectiveDistanceScale**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:269](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L269)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### aerialPerspectiveLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **aerialPerspectiveLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:637](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L637)

Returns the Aerial Perspective volume LUT texture storing distance-based atmospheric scattering.

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Aerial Perspective LUT texture

***

***

### aerialPerspectiveStartDepth

#### Get Signature

> **get** **aerialPerspectiveStartDepth**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:281](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L281)

Gets or sets the starting depth for the aerial perspective effect (range: 0 to 100). (Default: 0.0)

##### Returns

`number`

Start depth

#### Set Signature

> **set** **aerialPerspectiveStartDepth**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L285)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### atmosphereHeight

#### Get Signature

> **get** **atmosphereHeight**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L313)

Gets or sets the atmosphere thickness (unit: km). (Default: 60.0)

##### Returns

`number`

Atmosphere height (km)

#### Set Signature

> **set** **atmosphereHeight**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:317](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L317)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### atmosphereSampler

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **atmosphereSampler**(): [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:673](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L673)

Returns the linear sampler used for atmospheric LUT sampling.

##### Returns

[`Sampler`](../../Resource/classes/Sampler.md)

Sampler instance

***

***

### cloudCoverage

#### Get Signature

> **get** **cloudCoverage**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L217)

Gets or sets the cloud coverage across the sky (0.0 to 1.0). (Default: 0.4)

##### Returns

`number`

Cloud coverage (0.0 to 1.0)

#### Set Signature

> **set** **cloudCoverage**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:221](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L221)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### cloudDensity

#### Get Signature

> **get** **cloudDensity**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:233](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L233)

Gets or sets the cloud density (0.0 to 1.0). (Default: 0.7)

##### Returns

`number`

Cloud density (0.0 to 1.0)

#### Set Signature

> **set** **cloudDensity**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:237](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L237)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### cloudHeight

#### Get Signature

> **get** **cloudHeight**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:249](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L249)

Gets or sets the altitude at which clouds form (unit: km, range: 0.1 to 20.0). (Default: 5.0)

##### Returns

`number`

Cloud altitude (km)

#### Set Signature

> **set** **cloudHeight**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L253)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### cloudTimeMultiplier

#### Get Signature

> **get** **cloudTimeMultiplier**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L201)

Gets or sets the cloud animation time multiplier. (Default: 0.0)

##### Returns

`number`

Cloud time multiplier

#### Set Signature

> **set** **cloudTimeMultiplier**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L205)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### groundAlbedo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **groundAlbedo**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:467](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L467)

Returns the ground albedo RGB color (`ColorRGB`) object. (Default: `ColorRGB(102, 102, 102)`)

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

Ground albedo `ColorRGB` instance

***

***

### groundRadius

#### Get Signature

> **get** **groundRadius**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:297](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L297)

Gets or sets the planet radius (unit: km). (Default: 6360.0)

##### Returns

`number`

Planet radius (km)

#### Set Signature

> **set** **groundRadius**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:301](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L301)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### irradianceLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **irradianceLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:649](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L649)

Returns the atmospheric scattering-based indirect diffuse (Irradiance) cube texture.

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Irradiance cube texture

***

***

### mieAbsorption

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mieAbsorption**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:359](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L359)

Returns the Mie absorption RGB color (`ColorRGB`) object. (Default: `ColorRGB(255, 255, 255)`)

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

Mie absorption `ColorRGB` instance

***

***

### mieAbsorptionScale

#### Get Signature

> **get** **mieAbsorptionScale**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:371](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L371)

Gets or sets the Mie absorption coefficient scale (unit: km⁻¹, 0 or greater). (Default: 0.000444)

##### Returns

`number`

Mie absorption coefficient scale (km⁻¹)

#### Set Signature

> **set** **mieAbsorptionScale**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:375](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L375)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mieAnisotropy

#### Get Signature

> **get** **mieAnisotropy**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:451](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L451)

Gets or sets the Mie scattering anisotropy factor (range: 0 to 0.999). (Default: 0.8)

##### Returns

`number`

Mie anisotropy factor

#### Set Signature

> **set** **mieAnisotropy**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:455](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L455)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mieExponentialDistribution

#### Get Signature

> **get** **mieExponentialDistribution**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:435](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L435)

Gets or sets the exponential distribution altitude for Mie scattering particles (unit: km, range: 0.1 to 100). (Default: 1.2)

##### Returns

`number`

Mie distribution altitude (km)

#### Set Signature

> **set** **mieExponentialDistribution**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:439](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L439)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mieScattering

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mieScattering**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:329](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L329)

Returns the Mie scattering RGB color (`ColorRGB`) object. (Default: `ColorRGB(255, 255, 255)`)

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

Mie scattering `ColorRGB` instance

***

***

### mieScatteringScale

#### Get Signature

> **get** **mieScatteringScale**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:341](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L341)

Gets or sets the Mie scattering coefficient scale (unit: km⁻¹, 0 or greater). (Default: 0.003996)

##### Returns

`number`

Mie scattering coefficient scale (km⁻¹)

#### Set Signature

> **set** **mieScatteringScale**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:345](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L345)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### multiScatteringFactor

#### Get Signature

> **get** **multiScatteringFactor**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:541](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L541)

Gets or sets the multi-scattering contribution factor (range: 0 to 10). (Default: 1.0)

##### Returns

`number`

Multi-scattering factor

#### Set Signature

> **set** **multiScatteringFactor**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:545](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L545)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### multiScatteringLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **multiScatteringLUT**(): [`DirectTexture`](../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:613](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L613)

Returns the Multi-Scattering 2D LUT texture.

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

Multi-Scattering LUT texture

***

***

### params

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **params**(): `object`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:189](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L189)

Returns the atmospheric physical simulation parameters object.

::: warning
This property is for internal system uniform updates only.<br/>Do not directly modify properties of the returned object.
:::

##### Returns

`object`

Simulation parameters object

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `absorptionCoefficient` | `number`[] | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:76](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L76) |
| `absorptionTentWidth` | `number` | `15.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L79) |
| `absorptionTipAltitude` | `number` | `25.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L77) |
| `aerialPerspectiveDistanceScale` | `number` | `100.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:85](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L85) |
| `aerialPerspectiveStartDepth` | `number` | `0.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L86) |
| `atmosphereHeight` | `number` | `60.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L84) |
| `cameraHeight` | `number` | `0.001` | [src/display/skyAtmosphere/SkyAtmosphere.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L90) |
| `cloudCoverage` | `number` | `0.4` | [src/display/skyAtmosphere/SkyAtmosphere.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L93) |
| `cloudDensity` | `number` | `0.7` | [src/display/skyAtmosphere/SkyAtmosphere.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L94) |
| `cloudHeight` | `number` | `5.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:95](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L95) |
| `cloudTime` | `number` | `0.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:91](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L91) |
| `cloudTimeMultiplier` | `number` | `0.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L92) |
| `groundAlbedo` | `number`[] | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L78) |
| `groundRadius` | `number` | `6360.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L83) |
| `mieAbsorption` | `number`[] | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L74) |
| `mieAnisotropy` | `number` | `0.8` | [src/display/skyAtmosphere/SkyAtmosphere.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L73) |
| `mieExponentialDistribution` | `number` | `1.2` | [src/display/skyAtmosphere/SkyAtmosphere.ts:75](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L75) |
| `mieScattering` | `number`[] | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:72](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L72) |
| `multiScatteringFactor` | `number` | `1.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L81) |
| `rayleighExponentialDistribution` | `number` | `8.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L71) |
| `rayleighScattering` | `number`[] | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L70) |
| `skyLuminanceFactor` | `number`[] | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L80) |
| `sunDirection` | `Float32Array`\<`ArrayBuffer`\> | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:82](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L82) |
| `sunIntensity` | `number` | `100000.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:87](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L87) |
| `sunLimbDarkening` | `number` | `0.5` | [src/display/skyAtmosphere/SkyAtmosphere.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L89) |
| `sunSize` | `number` | `0.533` | [src/display/skyAtmosphere/SkyAtmosphere.ts:88](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L88) |

***

***

### rayleighExponentialDistribution

#### Get Signature

> **get** **rayleighExponentialDistribution**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:419](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L419)

Gets or sets the exponential distribution altitude for Rayleigh scattering particles (unit: km, range: 0.1 to 100). (Default: 8.0)

##### Returns

`number`

Rayleigh distribution altitude (km)

#### Set Signature

> **set** **rayleighExponentialDistribution**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:423](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L423)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rayleighScattering

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rayleighScattering**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:389](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L389)

Returns the Rayleigh scattering RGB color (`ColorRGB`) object. (Default: `ColorRGB(45, 104, 255)`)

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

Rayleigh scattering `ColorRGB` instance

***

***

### rayleighScatteringScale

#### Get Signature

> **get** **rayleighScatteringScale**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:401](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L401)

Gets or sets the Rayleigh scattering coefficient scale (unit: km⁻¹, 0 or greater). (Default: 0.0331)

##### Returns

`number`

Rayleigh scattering coefficient scale (km⁻¹)

#### Set Signature

> **set** **rayleighScatteringScale**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:405](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L405)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### reflectionLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **reflectionLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:661](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L661)

Returns the atmospheric scattering-based indirect specular (Reflection) cube texture.

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Reflection cube texture

***

***

### skyLuminanceFactor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **skyLuminanceFactor**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:589](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L589)

Returns the overall sky RGB luminance factor color (`ColorRGB`) object. (Default: `ColorRGB(255, 255, 255)`)

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

Sky luminance factor `ColorRGB` instance

***

***

### skyViewLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **skyViewLUT**(): [`DirectTexture`](../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:625](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L625)

Returns the Sky View 2D LUT texture.

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

Sky View LUT texture

***

***

### sunLimbDarkening

#### Get Signature

> **get** **sunLimbDarkening**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:573](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L573)

Gets or sets the sun limb darkening intensity (range: 0 to 10.0). (Default: 0.5)

##### Returns

`number`

Sun limb darkening intensity

#### Set Signature

> **set** **sunLimbDarkening**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:577](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L577)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### sunSize

#### Get Signature

> **get** **sunSize**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:557](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L557)

Gets or sets the visual angular size of the sun disk (range: 0.01 to 10.0). (Default: 0.533)

##### Returns

`number`

Visual sun size

#### Set Signature

> **set** **sunSize**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:561](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L561)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### transmittanceLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **transmittanceLUT**(): [`DirectTexture`](../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:601](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L601)

Returns the Transmittance 2D LUT texture.

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

Transmittance LUT texture

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:749](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L749)

Releases the SkyAtmosphere instance along with all internal generators, buffers, and resources.

#### Returns

`void`

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:715](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L715)

Updates the atmospheric state and LUTs, and applies the aerial perspective post-effect to scene object regions.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](View3D.md) | Target View3D instance for rendering |
| `width` | `number` | Render target width |
| `height` | `number` | Render target height |
| `sourceTextureInfo` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | Input source texture information |

#### Returns

[`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Post-effect result with atmospheric effects applied

***

***

### renderBackground()

> **renderBackground**(`renderViewStateData`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:685](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L685)

Renders the sky background at infinite distance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Render state data of the current view |

#### Returns

`void`

***

***

### update()

> **update**(`view`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:728](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L728)

Detects changes in sun light direction, camera altitude, and view matrix to update the atmospheric uniform buffer and LUTs.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](View3D.md) | Reference View3D instance |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
