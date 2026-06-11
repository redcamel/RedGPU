[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VoronoiTexture

# Class: VoronoiTexture

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:59](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L59)

**`Experimental`**

Texture class that generates Voronoi noise patterns.

Can generate cellular patterns, stone textures, crack patterns, cell ID outputs, etc.

* ### Example
```typescript
const texture = new RedGPU.Resource.VoronoiTexture(redGPUContext);
```

## Extends

- [`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md)

## Constructors

### Constructor

> **new VoronoiTexture**(`redGPUContext`, `width?`, `height?`, `define?`, `useMipmap?`): `VoronoiTexture`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:90](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L90)

**`Experimental`**

Creates a VoronoiTexture instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `width` | `number` | `1024` | Texture width |
| `height` | `number` | `1024` | Texture height |
| `define?` | [`NoiseDefine`](../namespaces/CoreNoiseTexture/interfaces/NoiseDefine.md) | `undefined` | Noise definition object (optional) |
| `useMipmap?` | `boolean` | `true` | Whether to use mipmaps (default: true) |

#### Returns

`VoronoiTexture`

#### Overrides

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`constructor`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#constructor)

## Properties

### cellIdColorIntensity

#### Get Signature

> **get** **cellIdColorIntensity**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:322](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L322)

**`Experimental`**

Returns the cell ID color intensity.

##### Returns

`number`

- Color intensity

#### Set Signature

> **set** **cellIdColorIntensity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:331](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L331)

**`Experimental`**

Sets the cell ID color intensity.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Color intensity to set (positive number) |

##### Returns

`void`

***

### distanceScale

#### Get Signature

> **get** **distanceScale**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:157](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L157)

**`Experimental`**

Returns the distance scale.

##### Returns

`number`

- Distance scale value

#### Set Signature

> **set** **distanceScale**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:166](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L166)

**`Experimental`**

Sets the distance scale.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Distance scale value to set (positive number) |

##### Returns

`void`

***

### distanceType

#### Get Signature

> **get** **distanceType**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:256](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L256)

**`Experimental`**

Returns the distance calculation method.

##### Returns

`number`

- Distance calculation method

#### Set Signature

> **set** **distanceType**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:265](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L265)

**`Experimental`**

Sets the distance calculation method.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Distance calculation method (one of VORONOI_DISTANCE_TYPE) |

##### Returns

`void`

***

### frequency

#### Get Signature

> **get** **frequency**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:137](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L137)

**`Experimental`**

Returns the frequency (density/scale).

##### Returns

`number`

- Frequency value

#### Set Signature

> **set** **frequency**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:146](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L146)

**`Experimental`**

Sets the frequency (density/scale).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Frequency value to set (positive number) |

##### Returns

`void`

***

### jitter

#### Get Signature

> **get** **jitter**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:302](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L302)

**`Experimental`**

Returns the jitter value (randomness of the points).

##### Returns

`number`

- Jitter value

#### Set Signature

> **set** **jitter**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:311](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L311)

**`Experimental`**

Sets the jitter value (randomness of the points).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Jitter value to set (positive number between 0 and 1) |

##### Returns

`void`

***

### lacunarity

#### Get Signature

> **get** **lacunarity**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:217](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L217)

**`Experimental`**

Returns the lacunarity (rate of frequency increase for each octave).

##### Returns

`number`

- Lacunarity value

#### Set Signature

> **set** **lacunarity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:226](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L226)

**`Experimental`**

Sets the lacunarity (rate of frequency increase for each octave).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Lacunarity value to set (positive number) |

##### Returns

`void`

***

### octaves

#### Get Signature

> **get** **octaves**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:177](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L177)

**`Experimental`**

Returns the number of octaves (number of noise layers to combine).

##### Returns

`number`

- Number of octaves

#### Set Signature

> **set** **octaves**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:186](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L186)

**`Experimental`**

Sets the number of octaves (number of noise layers to combine).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Number of octaves to set (integer between 1 and 8) |

##### Returns

`void`

***

### outputType

#### Get Signature

> **get** **outputType**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:279](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L279)

**`Experimental`**

Returns the output type.

##### Returns

`number`

- Output type

#### Set Signature

> **set** **outputType**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:288](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L288)

**`Experimental`**

Sets the output type.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Output type (one of VORONOI_OUTPUT_TYPE) |

##### Returns

`void`

***

### persistence

#### Get Signature

> **get** **persistence**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:197](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L197)

**`Experimental`**

Returns the persistence (rate of amplitude reduction for each octave).

##### Returns

`number`

- Persistence value

#### Set Signature

> **set** **persistence**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:206](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L206)

**`Experimental`**

Sets the persistence (rate of amplitude reduction for each octave).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Persistence value to set (positive number between 0 and 1) |

##### Returns

`void`

***

### seed

#### Get Signature

> **get** **seed**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:237](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L237)

**`Experimental`**

Returns the seed value.

##### Returns

`number`

- Seed value

#### Set Signature

> **set** **seed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:246](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L246)

**`Experimental`**

Sets the seed value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Seed value to set |

##### Returns

`void`

***

### applySettings()

> **applySettings**(`settings`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:523](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L523)

**`Experimental`**

Applies settings at once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `settings` | `Partial`\<[`VoronoiSettings`](../interfaces/VoronoiSettings.md)\> | Object containing partial settings to apply |

#### Returns

`void`

***

### getDistanceTypeName()

> **getDistanceTypeName**(): `string`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:541](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L541)

**`Experimental`**

Returns the name string of the current distance type.

#### Returns

`string`

- Distance type name

***

### getOutputTypeName()

> **getOutputTypeName**(): `string`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:555](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L555)

**`Experimental`**

Returns the name string of the current output type.

#### Returns

`string`

- Output type name

***

### getSettings()

> **getSettings**(): [`VoronoiSettings`](../interfaces/VoronoiSettings.md)

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:503](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L503)

**`Experimental`**

Returns all currently applied Voronoi settings in an object format.

#### Returns

[`VoronoiSettings`](../interfaces/VoronoiSettings.md)

- Current settings object

***

### randomizeSeed()

> **randomizeSeed**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:341](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L341)

**`Experimental`**

Randomizes the seed value.

#### Returns

`void`

***

### setBiomeMapPattern()

> **setBiomeMapPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:491](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L491)

**`Experimental`**

Applies the biome map pattern preset.

#### Returns

`void`

***

### setCellIdColorOutput()

> **setCellIdColorOutput**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:413](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L413)

**`Experimental`**

Sets the output type to Cell ID Color (assigning unique RGB color for each cell).

#### Returns

`void`

***

### setCellIdOutput()

> **setCellIdOutput**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:405](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L405)

**`Experimental`**

Sets the output type to Cell ID (quantifying unique ID of each cell).

#### Returns

`void`

***

### setCellularPattern()

> **setCellularPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:421](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L421)

**`Experimental`**

Applies the cellular pattern preset.

#### Returns

`void`

***

### setChebyshevDistance()

> **setChebyshevDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:365](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L365)

**`Experimental`**

Sets the distance calculation method to Chebyshev.

#### Returns

`void`

***

### setCrackPattern()

> **setCrackPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:389](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L389)

**`Experimental`**

Sets the output type to F2 - F1 (crack pattern).

#### Returns

`void`

***

### setCrystalPattern()

> **setCrystalPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:459](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L459)

**`Experimental`**

Applies the crystal pattern preset.

#### Returns

`void`

***

### setEuclideanDistance()

> **setEuclideanDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:349](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L349)

**`Experimental`**

Sets the distance calculation method to Euclidean.

#### Returns

`void`

***

### setF1Output()

> **setF1Output**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:373](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L373)

**`Experimental`**

Sets the output type to F1 (closest distance).

#### Returns

`void`

***

### setF2Output()

> **setF2Output**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:381](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L381)

**`Experimental`**

Sets the output type to F2 (second closest distance).

#### Returns

`void`

***

### setGridPattern()

> **setGridPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:450](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L450)

**`Experimental`**

Applies the grid pattern preset.

#### Returns

`void`

***

### setManhattanDistance()

> **setManhattanDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:357](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L357)

**`Experimental`**

Sets the distance calculation method to Manhattan.

#### Returns

`void`

***

### setMosaicPattern()

> **setMosaicPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:480](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L480)

**`Experimental`**

Applies the mosaic pattern preset.

#### Returns

`void`

***

### setOrganicPattern()

> **setOrganicPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:441](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L441)

**`Experimental`**

Applies the organic pattern preset.

#### Returns

`void`

***

### setSmoothBlend()

> **setSmoothBlend**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:397](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L397)

**`Experimental`**

Sets the output type to F1 + F2 (smooth blend).

#### Returns

`void`

***

### setStainedGlassPattern()

> **setStainedGlassPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:469](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L469)

**`Experimental`**

Applies the stained glass pattern preset.

#### Returns

`void`

***

### setStonePattern()

> **setStonePattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:431](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L431)

**`Experimental`**

Applies the stone pattern preset.

#### Returns

`void`

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### mipLevelCount

> **mipLevelCount**: `number` = `1`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:39](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L39)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`mipLevelCount`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#miplevelcount)

***

### src

> **src**: `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:41](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L41)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`src`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#src)

***

### useMipmap

> **useMipmap**: `boolean` = `true`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:40](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L40)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`useMipmap`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#usemipmap)

## Accessors

### animationSpeed

#### Get Signature

> **get** **animationSpeed**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:103](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L103)

**`Experimental`**

Returns the animation speed.

##### Returns

`number`

#### Set Signature

> **set** **animationSpeed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:108](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L108)

**`Experimental`**

Sets the animation speed.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationSpeed`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationspeed)

***

### animationX

#### Get Signature

> **get** **animationX**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:115](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L115)

**`Experimental`**

Returns the animation X value.

##### Returns

`number`

#### Set Signature

> **set** **animationX**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:120](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L120)

**`Experimental`**

Sets the animation X value.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationX`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationx)

***

### animationY

#### Get Signature

> **get** **animationY**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:127](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L127)

**`Experimental`**

Returns the animation Y value.

##### Returns

`number`

#### Set Signature

> **set** **animationY**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:132](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L132)

**`Experimental`**

Sets the animation Y value.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationY`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationy)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L76)

**`Experimental`**

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`antialiasingManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#antialiasingmanager)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L53)

**`Experimental`**

Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L61)

**`Experimental`**

Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`cacheKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#cachekey)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L88)

**`Experimental`**

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`commandEncoderManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L77)

**`Experimental`**

Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuDevice`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gpudevice)

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:144](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L144)

**`Experimental`**

Returns the GPUTexture object.

##### Returns

`GPUTexture`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gputexture)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L58)

**`Experimental`**

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L71)

**`Experimental`**

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`name`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L40)

**`Experimental`**

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`redGPUContext`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L64)

**`Experimental`**

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:98](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L98)

**`Experimental`**

Resource manager key

##### Returns

`string`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManagerKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L45)

**`Experimental`**

Returns the revision (update count) of the resource.

##### Returns

`number`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`revision`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#revision)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ManagementResourceBase.ts#L45)

**`Experimental`**

Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`targetResourceManagedState`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#targetresourcemanagedstate)

***

### time

#### Get Signature

> **get** **time**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:149](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L149)

**`Experimental`**

Returns the current time.

##### Returns

`number`

#### Set Signature

> **set** **time**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:154](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L154)

**`Experimental`**

Sets the current time.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`time`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#time)

***

### uniformInfo

#### Get Signature

> **get** **uniformInfo**(): `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:139](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L139)

**`Experimental`**

Returns the uniform information.

##### Returns

`any`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uniformInfo`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uniforminfo)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L46)

**`Experimental`**

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uuid`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:93](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L93)

**`Experimental`**

Video memory usage in bytes

##### Returns

`number`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`videoMemorySize`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L89)

**`Experimental`**

Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__addDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__adddirtypipelinelistener)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L101)

**`Experimental`**

Removes a resource update listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__removeDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:186](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L186)

**`Experimental`**

Destroys the resource.

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`destroy`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#destroy)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L116)

**`Experimental`**

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`notifyUpdate`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#notifyupdate)

***

### render()

> **render**(`time`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:181](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L181)

**`Experimental`**

Renders noise at the specified time.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `time` | `number` |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`render`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#render)

***

### updateUniform()

> **updateUniform**(`name`, `value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:161](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L161)

**`Experimental`**

Updates an individual uniform parameter.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniform`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniform)

***

### updateUniforms()

> **updateUniforms**(`uniforms`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:170](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L170)

**`Experimental`**

Updates multiple uniform parameters at once.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `uniforms` | `Record`\<`string`, `any`\> |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniforms`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniforms)


</details>
