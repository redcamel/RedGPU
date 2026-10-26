[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Foliage](../README.md) / FoliageOptions

# Interface: FoliageOptions

Defined in: [src/landscape/foliage/core/Foliage.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L213)

Configuration options interface for creating and initializing a `Foliage` type.

## Extends

- [`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md)

## Properties



***

### alignFactor?

> `optional` **alignFactor?**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:283](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L283)

Terrain normal alignment factor (`0.0` to `1.0`, default: `1.0`)

***

***

### alignToNormal?

> `optional` **alignToNormal?**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L277)

Whether to align instances to the terrain surface normal (default: `false`)

***

***

### groundBlendRange?

> `optional` **groundBlendRange?**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:289](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L289)

Height range over which terrain ground color blending is applied in meters (default: `1.5`)

***

***

### leafFlutterScale?

> `optional` **leafFlutterScale?**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:271](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L271)

Wind-driven leaf flutter scale multiplier (default: `1.0`)

***

***

### lods

> **lods**: [`FoliageLODConfig`](FoliageLODConfig.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:218](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L218)

List of distance-based LOD mesh configurations

***

***

### maxInstances?

> `optional` **maxInstances?**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:229](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L229)

Maximum instance capacity to allocate (automatically calculated based on density and radius if omitted)

***

***

### maxScale?

> `optional` **maxScale?**: \[`number`, `number`, `number`\]

Defined in: [src/landscape/foliage/core/Foliage.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L241)

Maximum random instance scale `[x, y, z]` (default: `[1.0, 1.0, 1.0]`)

***

***

### minScale?

> `optional` **minScale?**: \[`number`, `number`, `number`\]

Defined in: [src/landscape/foliage/core/Foliage.ts:235](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L235)

Minimum random instance scale `[x, y, z]` (default: `[1.0, 1.0, 1.0]`)

***

***

### preservePivot?

> `optional` **preservePivot?**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:259](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L259)

Whether to preserve the original pivot when assembling meshes

***

***

### randomRotationY?

> `optional` **randomRotationY?**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:247](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L247)

Whether to apply random rotation around the Y-axis (default: `true`)

***

***

### receiveShadow?

> `optional` **receiveShadow?**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:223](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L223)

Whether the foliage surface receives shadows (default: `true`)

***

***

### trunkBendScale?

> `optional` **trunkBendScale?**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L265)

Wind-driven trunk bending scale multiplier (default: `1.0`)

***

***

### useImpostor?

> `optional` **useImpostor?**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L253)

Whether to automatically generate and use a far-distance Octahedral Impostor LOD (default: `true`)

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### bottomOffset?

> `optional` **bottomOffset?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L36)

Bottom height offset of the instance relative to the terrain surface (default: `0.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`bottomOffset`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#bottomoffset)

***

***

### castShadow?

> `optional` **castShadow?**: `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L48)

Whether directional light shadow casting is enabled (default: `true`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`castShadow`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#castshadow)

***

***

### cullingDistance?

> `optional` **cullingDistance?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L24)

Maximum visibility distance from the camera at which instances are culled (default: `200.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`cullingDistance`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#cullingdistance)

***

***

### densityMultiplier?

> `optional` **densityMultiplier?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L84)

Density multiplier applied to the base density (default: `1.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`densityMultiplier`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#densitymultiplier)

***

***

### densityPerHectare?

> `optional` **densityPerHectare?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L78)

Base placement density per hectare (10,000㎡) (default: `1000.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`densityPerHectare`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#densityperhectare)

***

***

### densityScaleByWeight?

> `optional` **densityScaleByWeight?**: `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:72](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L72)

Whether to scale instance size proportionally to the layer weight (default: `true`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`densityScaleByWeight`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#densityscalebyweight)

***

***

### groundBlendStrength?

> `optional` **groundBlendStrength?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L90)

Ground blending strength with terrain surface color and normal (`0.0`~`1.0`, default: `1.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`groundBlendStrength`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#groundblendstrength)

***

***

### height?

> `optional` **height?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L42)

Base height of the instance (default: `1.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`height`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#height)

***

***

### maxSlope?

> `optional` **maxSlope?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L66)

Maximum terrain slope angle at which instances can be placed (in degrees, default: `45.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`maxSlope`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#maxslope)

***

***

### minSlope?

> `optional` **minSlope?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L60)

Minimum terrain slope angle at which instances can be placed (in degrees, default: `0.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`minSlope`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#minslope)

***

***

### name

> **name**: `string`

Defined in: [src/landscape/core/scatter/AScatterType.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L18)

Unique identifier name of the scatter type

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`name`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#name)

***

***

### shadowCullDistance?

> `optional` **shadowCullDistance?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:30](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L30)

Maximum distance at which instances are culled in the shadow pass (default: `50.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`shadowCullDistance`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#shadowculldistance)

***

***

### targetLayer?

> `optional` **targetLayer?**: `string` \| `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L54)

Name or index of the target terrain layer from which to reference placement density

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`targetLayer`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#targetlayer)

***

</details>
