[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VoronoiTexture

# Class: VoronoiTexture

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L64)

**`Experimental`**

Texture that generates Voronoi (cellular) noise patterns using a compute shader.

***

### Example
```typescript
const texture = new RedGPU.Resource.VoronoiTexture(redGPUContext);
texture.setCrackPattern();
```

## See

[Voronoi noise texture example](https://redcamel.github.io/RedGPU/examples/3d/noiseTexture/voronoi/basic/)

## Extends

- [`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md)

## Constructors



***

### Constructor

> **new VoronoiTexture**(`redGPUContext`, `width?`, `height?`, `define?`, `useMipmap?`): `VoronoiTexture`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:101](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L101)

**`Experimental`**

Creates a VoronoiTexture instance.

#### Example
```typescript
const texture = new RedGPU.Resource.VoronoiTexture(redGPUContext, 512, 512);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `width?` | `number` | `1024` | Texture width (default: 1024) |
| `height?` | `number` | `1024` | Texture height (default: 1024) |
| `define?` | [`NoiseDefine`](../namespaces/CoreNoiseTexture/interfaces/NoiseDefine.md) | `undefined` | Noise definition object that extends the shader logic (optional) |
| `useMipmap?` | `boolean` | `true` | Whether to use mipmaps (default: true) |

#### Returns

`VoronoiTexture`

#### Overrides

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`constructor`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#constructor)

## Properties



## Accessors



***

### cellIdColorIntensity

#### Get Signature

> **get** **cellIdColorIntensity**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:324](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L324)

**`Experimental`**

Cell color intensity applied in `CELL_ID_COLOR` output. (positive, default: 1.0)

##### Returns

`number`

Color intensity

#### Set Signature

> **set** **cellIdColorIntensity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:328](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L328)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### distanceScale

#### Get Signature

> **get** **distanceScale**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:169](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L169)

**`Experimental`**

Scale multiplied to the output distance value. (positive, default: 1.0)

##### Returns

`number`

Distance scale value

#### Set Signature

> **set** **distanceScale**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L173)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### distanceType

#### Get Signature

> **get** **distanceType**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:261](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L261)

**`Experimental`**

Distance calculation method. Only `VORONOI_DISTANCE_TYPE` values are allowed.

##### Throws

Throws an error if an invalid value is set.

##### Returns

`number`

Distance calculation method value

#### Set Signature

> **set** **distanceType**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L265)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### frequency

#### Get Signature

> **get** **frequency**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:151](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L151)

**`Experimental`**

Frequency that determines cell density. (positive, default: 8.0)

##### Returns

`number`

Frequency value

#### Set Signature

> **set** **frequency**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:155](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L155)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### jitter

#### Get Signature

> **get** **jitter**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:306](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L306)

**`Experimental`**

Degree of random distribution of cell centers. (0~1, 0 yields a perfect grid, default: 1.0)

##### Returns

`number`

Jitter value

#### Set Signature

> **set** **jitter**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:310](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L310)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lacunarity

#### Get Signature

> **get** **lacunarity**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:223](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L223)

**`Experimental`**

Frequency increase ratio applied per octave. (positive, default: 2.0)

##### Returns

`number`

Lacunarity value

#### Set Signature

> **set** **lacunarity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:227](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L227)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### octaves

#### Get Signature

> **get** **octaves**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L187)

**`Experimental`**

Number of noise layers (octaves) to combine. (integer 1~8, default: 1)

##### Returns

`number`

Number of octaves

#### Set Signature

> **set** **octaves**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:191](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L191)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### outputType

#### Get Signature

> **get** **outputType**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L285)

**`Experimental`**

Output type. Only `VORONOI_OUTPUT_TYPE` values are allowed.

##### Throws

Throws an error if an invalid value is set.

##### Returns

`number`

Output type value

#### Set Signature

> **set** **outputType**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:289](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L289)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### persistence

#### Get Signature

> **get** **persistence**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L205)

**`Experimental`**

Amplitude reduction ratio applied per octave. (0~1, default: 0.5)

##### Returns

`number`

Persistence value

#### Set Signature

> **set** **persistence**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:209](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L209)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### seed

#### Get Signature

> **get** **seed**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L241)

**`Experimental`**

Seed value of the noise pattern.

##### Returns

`number`

Seed value

#### Set Signature

> **set** **seed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:245](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L245)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### applySettings()

> **applySettings**(`settings`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:531](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L531)

**`Experimental`**

Applies only the provided properties at once. Each value passes through its setter's validation.

#### Example
```typescript
texture.applySettings({frequency: 4.0, jitter: 0.5});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `settings` | `Partial`\<[`VoronoiSettings`](../interfaces/VoronoiSettings.md)\> | Settings to apply (`Partial<VoronoiSettings>`) |

#### Returns

`void`

***

***

### getDistanceTypeName()

> **getDistanceTypeName**(): `string`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:552](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L552)

**`Experimental`**

Returns the name of the current distance calculation method.

#### Returns

`string`

Distance type name ('Unknown' if not recognized)

***

***

### getOutputTypeName()

> **getOutputTypeName**(): `string`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:569](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L569)

**`Experimental`**

Returns the name of the current output type.

#### Returns

`string`

Output type name ('Unknown' if not recognized)

***

***

### getSettings()

> **getSettings**(): [`VoronoiSettings`](../interfaces/VoronoiSettings.md)

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:503](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L503)

**`Experimental`**

Returns the current settings as a new object.

#### Returns

[`VoronoiSettings`](../interfaces/VoronoiSettings.md)

Current settings object

***

***

### randomizeSeed()

> **randomizeSeed**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:338](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L338)

**`Experimental`**

Changes the seed to a random value in the range 0~1000.

#### Returns

`void`

***

***

### setBiomeMapPattern()

> **setBiomeMapPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:488](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L488)

**`Experimental`**

Applies the biome map preset. (Cell ID, Euclidean, jitter 0.8, frequency 4.0)

#### Returns

`void`

***

***

### setCellIdColorOutput()

> **setCellIdColorOutput**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:410](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L410)

**`Experimental`**

Sets the output type to Cell ID Color (unique RGB color per cell).

#### Returns

`void`

***

***

### setCellIdOutput()

> **setCellIdOutput**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:402](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L402)

**`Experimental`**

Sets the output type to Cell ID (unique grayscale value per cell).

#### Returns

`void`

***

***

### setCellularPattern()

> **setCellularPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:418](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L418)

**`Experimental`**

Applies the cellular pattern preset. (F1, Euclidean, jitter 1.0)

#### Returns

`void`

***

***

### setChebyshevDistance()

> **setChebyshevDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:362](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L362)

**`Experimental`**

Sets the distance calculation method to Chebyshev.

#### Returns

`void`

***

***

### setCrackPattern()

> **setCrackPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:386](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L386)

**`Experimental`**

Sets the output type to F2 - F1 (cell edge emphasis, crack pattern).

#### Returns

`void`

***

***

### setCrystalPattern()

> **setCrystalPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:456](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L456)

**`Experimental`**

Applies the crystal pattern preset. (F2 - F1, Chebyshev, jitter 0.9)

#### Returns

`void`

***

***

### setEuclideanDistance()

> **setEuclideanDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:346](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L346)

**`Experimental`**

Sets the distance calculation method to Euclidean.

#### Returns

`void`

***

***

### setF1Output()

> **setF1Output**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:370](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L370)

**`Experimental`**

Sets the output type to F1 (distance to the closest point).

#### Returns

`void`

***

***

### setF2Output()

> **setF2Output**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:378](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L378)

**`Experimental`**

Sets the output type to F2 (distance to the second closest point).

#### Returns

`void`

***

***

### setGridPattern()

> **setGridPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:447](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L447)

**`Experimental`**

Applies the grid pattern preset. (jitter 0.0, Euclidean)

#### Returns

`void`

***

***

### setManhattanDistance()

> **setManhattanDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:354](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L354)

**`Experimental`**

Sets the distance calculation method to Manhattan.

#### Returns

`void`

***

***

### setMosaicPattern()

> **setMosaicPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:477](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L477)

**`Experimental`**

Applies the mosaic tile preset. (Cell ID Color, Manhattan, jitter 0.3, color intensity 1.0)

#### Returns

`void`

***

***

### setOrganicPattern()

> **setOrganicPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:438](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L438)

**`Experimental`**

Applies the organic pattern preset. (Manhattan, jitter 0.6)

#### Returns

`void`

***

***

### setSmoothBlend()

> **setSmoothBlend**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:394](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L394)

**`Experimental`**

Sets the output type to F1 + F2 (smooth blend).

#### Returns

`void`

***

***

### setStainedGlassPattern()

> **setStainedGlassPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:466](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L466)

**`Experimental`**

Applies the stained glass preset. (Cell ID Color, Euclidean, jitter 0.7, color intensity 0.8)

#### Returns

`void`

***

***

### setStonePattern()

> **setStonePattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:428](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L428)

**`Experimental`**

Applies the stone pattern preset. (F2 - F1, Euclidean, jitter 0.8)

#### Returns

`void`

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### mipLevelCount

> **mipLevelCount**: `number` = `1`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L47)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`mipLevelCount`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#miplevelcount)

***

***

### src

> **src**: `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L49)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`src`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#src)

***

***

### useMipmap

> **useMipmap**: `boolean` = `true`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L48)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`useMipmap`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#usemipmap)

***

### animationSpeed

#### Get Signature

> **get** **animationSpeed**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:132](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L132)

**`Experimental`**

Returns the animation speed.

##### Returns

`number`

#### Set Signature

> **set** **animationSpeed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:144](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L144)

**`Experimental`**

Sets the animation speed.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Animation speed |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationSpeed`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationspeed)

***

***

### animationX

#### Get Signature

> **get** **animationX**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:154](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L154)

**`Experimental`**

Returns the animation X value.

##### Returns

`number`

#### Set Signature

> **set** **animationX**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L166)

**`Experimental`**

Sets the animation X value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Animation X value |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationX`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationx)

***

***

### animationY

#### Get Signature

> **get** **animationY**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:176](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L176)

**`Experimental`**

Returns the animation Y value.

##### Returns

`number`

#### Set Signature

> **set** **animationY**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L188)

**`Experimental`**

Sets the animation Y value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Animation Y value |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationY`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationy)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

**`Experimental`**

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`antialiasingManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#antialiasingmanager)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L61)

**`Experimental`**

Gets or sets the cache key.

##### Returns

`string`

Cache key string

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L65)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`cacheKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#cachekey)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

**`Experimental`**

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`commandEncoderManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L89)

**`Experimental`**

Returns the associated GPUDevice.

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuDevice`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gpudevice)

***

***

### gpuTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:206](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L206)

**`Experimental`**

Returns the GPUTexture object.

##### Returns

`GPUTexture`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gputexture)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

**`Experimental`**

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`instanceId`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

**`Experimental`**

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`name`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

**`Experimental`**

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`redGPUContext`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

**`Experimental`**

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L124)

**`Experimental`**

Returns the resource manager state key.

##### Returns

`string`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManagerKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L49)

**`Experimental`**

Returns the revision (update count) of the resource.

##### Returns

`number`

Resource revision number

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`revision`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#revision)

***

***

### targetResourceManagedState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ManagementResourceBase.ts#L50)

**`Experimental`**

Returns the managed state information of the resource.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Resource managed status info object

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`targetResourceManagedState`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#targetresourcemanagedstate)

***

***

### time

#### Get Signature

> **get** **time**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L214)

**`Experimental`**

Returns the current time.

##### Returns

`number`

#### Set Signature

> **set** **time**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:226](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L226)

**`Experimental`**

Sets the current time.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Time in milliseconds |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`time`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#time)

***

***

### uniformInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformInfo**(): `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:198](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L198)

**`Experimental`**

Returns the uniform information.

##### Returns

`any`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uniformInfo`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uniforminfo)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

**`Experimental`**

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uuid`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L116)

**`Experimental`**

Returns the video memory usage in bytes.

##### Returns

`number`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`videoMemorySize`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#videomemorysize)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L102)

**`Experimental`**

Adds a pipeline dirty listener to be called when the resource changes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to register |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__addDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L115)

**`Experimental`**

Removes a registered pipeline dirty listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to remove |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__removeDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__removedirtypipelinelistener)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L285)

**`Experimental`**

Destroys the resource.

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`destroy`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#destroy)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L131)

**`Experimental`**

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Whether to reset the listener list after notification (default: false) |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`notifyUpdate`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#notifyupdate)

***

***

### render()

> **render**(`time`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L277)

**`Experimental`**

Renders noise at the specified time.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `time` | `number` | Time to render |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`render`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#render)

***

***

### updateUniform()

> **updateUniform**(`name`, `value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:243](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L243)

**`Experimental`**

Updates an individual uniform parameter.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Uniform name |
| `value` | `any` | Value to set |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniform`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniform)

***

***

### updateUniforms()

> **updateUniforms**(`uniforms`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:259](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L259)

**`Experimental`**

Updates multiple uniform parameters at once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uniforms` | `Record`\<`string`, `any`\> | Record of uniform key-value pairs to update |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniforms`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniforms)

</details>
