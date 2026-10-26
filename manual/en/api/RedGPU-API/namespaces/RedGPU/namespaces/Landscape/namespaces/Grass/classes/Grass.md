[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Grass](../README.md) / Grass

# Class: Grass

Defined in: [src/landscape/grass/core/Grass.ts:110](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L110)

Class that manages geometry, shading properties, and baking parameters for a single large-scale grass type placed on a `Landscape`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Add a grass type with density and culling distance
const grass = landscape.grassManager.addType({
    name: 'MeadowGrass',
    mesh: grassMesh,
    densityPerHectare: 50000,
    cullingDistance: 80
});
```

## See

[Foliage and Impostors example](https://redcamel.github.io/RedGPU/examples/3d/landscape/foliageAndImpostors/)

## Extends

- [`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md)\<`GrassTypeAllocation`\>

## Constructors



***

### Constructor

> **new Grass**(`redGPUContext`, `options`): `Grass`

Defined in: [src/landscape/grass/core/Grass.ts:144](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L144)

Creates a `Grass` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |
| `options` | [`GrassOptions`](../interfaces/GrassOptions.md) | Grass type initialization options |

#### Returns

`Grass`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`constructor`](../../Core/namespaces/Scatter/classes/AScatterType.md#constructor)

## Accessors



***

### activeInstanceCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeInstanceCount**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:630](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L630)

Returns the total number of currently baked and active grass instances.

##### Returns

`number`

Active instance count

***

***

### alphaCutoff

#### Get Signature

> **get** **alphaCutoff**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:440](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L440)

Gets or sets the alpha cutoff threshold (`0.01` to `1.0`).

##### Returns

`number`

Alpha cutoff value

#### Set Signature

> **set** **alphaCutoff**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:425](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L425)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

***

### bakeRadius

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **bakeRadius**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:607](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L607)

Returns the radius in meters around the camera within which grass instances are baked.

##### Returns

`number`

Bake radius in meters

***

***

### baseColorTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **baseColorTexture**(): [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/grass/core/Grass.ts:318](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L318)

Returns the base color `BitmapTexture` of the grass.

##### Returns

[`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md)

`BitmapTexture` instance

***

***

### baseColorTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **baseColorTextureView**(): `GPUTextureView`

Defined in: [src/landscape/grass/core/Grass.ts:329](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L329)

Returns the `GPUTextureView` of the grass base color texture.

##### Returns

`GPUTextureView`

`GPUTextureView` instance

***

***

### exposureBoost

#### Get Signature

> **get** **exposureBoost**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:421](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L421)

Gets or sets the brightness exposure boost multiplier.

##### Returns

`number`

Exposure boost multiplier

#### Set Signature

> **set** **exposureBoost**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:395](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L395)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

***

### farDistance

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **farDistance**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:307](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L307)

Returns the threshold distance in meters separating near and far grass buckets.

##### Returns

`number`

Near/far separation distance in meters

***

***

### geometry

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **geometry**(): [`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/landscape/grass/core/Grass.ts:274](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L274)

Returns the assembled and unified grass `Geometry` or `Primitive` instance.

##### Returns

[`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

`Geometry` or `Primitive` instance

***

***

### instancesPerCell

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instancesPerCell**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:343](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L343)

Returns the number of instances generated per grass grid cell.

##### Returns

`number`

Number of instances per cell

***

***

### maxInstances

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **maxInstances**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:619](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L619)

Returns the maximum instance capacity allocated to this grass type.

##### Returns

`number`

Maximum instance count, or `undefined` if unallocated

***

***

### maxScale

#### Get Signature

> **get** **maxScale**(): \[`number`, `number`\]

Defined in: [src/landscape/grass/core/Grass.ts:391](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L391)

Gets or sets the maximum random instance scale `[width, height]`.

##### Returns

\[`number`, `number`\]

Maximum scale tuple `[width, height]`

#### Set Signature

> **set** **maxScale**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:371](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L371)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`\] \| \[`number`, `number`, `number`\] |

##### Returns

`void`

***

***

### mesh

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mesh**(): [`Mesh`](../../../../Display/classes/Mesh.md)

Defined in: [src/landscape/grass/core/Grass.ts:285](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L285)

Returns the source `Mesh` instance used to create the grass.

##### Returns

[`Mesh`](../../../../Display/classes/Mesh.md)

Source `Mesh` instance

***

***

### minScale

#### Get Signature

> **get** **minScale**(): \[`number`, `number`\]

Defined in: [src/landscape/grass/core/Grass.ts:367](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L367)

Gets or sets the minimum random instance scale `[width, height]`.

##### Returns

\[`number`, `number`\]

Minimum scale tuple `[width, height]`

#### Set Signature

> **set** **minScale**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:347](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L347)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`\] \| \[`number`, `number`, `number`\] |

##### Returns

`void`

***

***

### minY

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **minY**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:410](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L410)

Returns the minimum Y offset of the mesh local bounding box.

##### Returns

`number`

Minimum Y offset

***

***

### onRepopulateRequired

#### Set Signature

> **set** **onRepopulateRequired**(`cb`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:596](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L596)

Sets the callback function to be invoked when instance rebaking (repopulation) is required.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cb` | (`typeId`) => `void` | Callback function receiving the type ID, or `null` |

##### Returns

`void`

***

***

### onUniformDirty

#### Set Signature

> **set** **onUniformDirty**(`cb`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:584](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L584)

Sets the callback function to be invoked when uniform parameters change.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cb` | (`typeId`) => `void` | Callback function receiving the type ID, or `null` |

##### Returns

`void`

***

***

### receiveShadow

#### Get Signature

> **get** **receiveShadow**(): `boolean`

Defined in: [src/landscape/grass/core/Grass.ts:523](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L523)

Gets or sets whether the grass surface receives shadows.

##### Returns

`boolean`

Whether shadows are received

#### Set Signature

> **set** **receiveShadow**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:508](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L508)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `boolean` |

##### Returns

`void`

***

***

### renderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderUnits**(): [`ScatterRenderUnit`](../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md)[]

Defined in: [src/landscape/grass/core/Grass.ts:296](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L296)

Returns the array of `ScatterRenderUnit` instances used for grass rendering.

##### Returns

[`ScatterRenderUnit`](../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md)[]

Array of `ScatterRenderUnit`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`renderUnits`](../../Core/namespaces/Scatter/classes/AScatterType.md#renderunits)

***

***

### roughness

#### Get Signature

> **get** **roughness**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:459](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L459)

Gets or sets the surface roughness factor (`0.04` to `1.0`).

##### Returns

`number`

Roughness factor

#### Set Signature

> **set** **roughness**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:444](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L444)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

***

### shadowCullDistance

#### Get Signature

> **get** **shadowCullDistance**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:553](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L553)

Returns the maximum culling distance at which grass shadows are rendered (auto-derived from `farDistance`).

##### Returns

`number`

Shadow culling distance in meters

#### Set Signature

> **set** **shadowCullDistance**(`_val`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:557](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L557)

Gets or sets the shadow pass instance culling distance (`0` or greater).

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `_val` | `number` |

##### Returns

`void`

Shadow pass culling distance

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`shadowCullDistance`](../../Core/namespaces/Scatter/classes/AScatterType.md#shadowculldistance)

***

***

### shadowFadeStartDistance

#### Get Signature

> **get** **shadowFadeStartDistance**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:568](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L568)

Returns the distance at which grass shadow fade-out begins (`shadowCullDistance * 0.5`).

##### Returns

`number`

Shadow fade start distance in meters

#### Set Signature

> **set** **shadowFadeStartDistance**(`_val`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:572](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L572)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `_val` | `number` |

##### Returns

`void`

***

***

### shadowStrength

#### Get Signature

> **get** **shadowStrength**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:542](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L542)

Gets or sets the darkness strength of received shadows (`0.0` to `1.0`).

##### Returns

`number`

Shadow strength

#### Set Signature

> **set** **shadowStrength**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:527](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L527)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

***

### slotIndex

#### Get Signature

> **get** **slotIndex**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:641](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L641)

Gets or sets the UBO slot index allocated from `GrassSlotPooler`.

##### Returns

`number`

Allocated slot index (`-1` if unallocated)

#### Set Signature

> **set** **slotIndex**(`val`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:718](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L718)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### subsurfaceColor

#### Get Signature

> **get** **subsurfaceColor**(): \[`number`, `number`, `number`\]

Defined in: [src/landscape/grass/core/Grass.ts:504](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L504)

Gets or sets the subsurface scattering RGB color `[r, g, b]`.

##### Returns

\[`number`, `number`, `number`\]

Subsurface RGB color tuple `[r, g, b]`

#### Set Signature

> **set** **subsurfaceColor**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:482](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L482)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

***

### subsurfaceStrength

#### Get Signature

> **get** **subsurfaceStrength**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:478](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L478)

Gets or sets the subsurface scattering transmission strength (`0.0` to `3.0`).

##### Returns

`number`

Subsurface transmission strength

#### Set Signature

> **set** **subsurfaceStrength**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:463](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L463)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/grass/core/Grass.ts:703](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L703)

Releases the unified geometry owned by the grass type and associated resources.

#### Returns

`void`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`destroy`](../../Core/namespaces/Scatter/classes/AScatterType.md#destroy)

***

***

### onParameterChanged()

> **onParameterChanged**(`prop`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:653](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L653)

Invoked when a scatter or material property changes, triggering rebaking or UBO update.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prop` | `string` | Name of the changed property |

#### Returns

`void`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`onParameterChanged`](../../Core/namespaces/Scatter/classes/AScatterType.md#onparameterchanged)

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### allocation

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **allocation**(): `TAllocation`

Defined in: [src/landscape/core/scatter/AScatterType.ts:211](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L211)

Returns the segment allocation info (`TAllocation | null`) assigned to this type in the mega buffer.

##### Returns

`TAllocation`

Segment allocation info (`TAllocation`), or `null` if unallocated

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`allocation`](../../Core/namespaces/Scatter/classes/AScatterType.md#allocation)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`antialiasingManager`](../../Core/namespaces/Scatter/classes/AScatterType.md#antialiasingmanager)

***

***

### bottomOffset

#### Get Signature

> **get** **bottomOffset**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:235](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L235)

Gets or sets the bottom height offset of instances from the terrain surface.

##### Returns

`number`

Bottom height offset

#### Set Signature

> **set** **bottomOffset**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:259](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L259)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`bottomOffset`](../../Core/namespaces/Scatter/classes/AScatterType.md#bottomoffset)

***

***

### castShadow

#### Get Signature

> **get** **castShadow**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:414](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L414)

Gets or sets whether directional light shadow casting is enabled.

##### Returns

`boolean`

Whether shadow casting is enabled

#### Set Signature

> **set** **castShadow**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:438](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L438)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`castShadow`](../../Core/namespaces/Scatter/classes/AScatterType.md#castshadow)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`commandEncoderManager`](../../Core/namespaces/Scatter/classes/AScatterType.md#commandencodermanager)

***

***

### cullingDistance

#### Get Signature

> **get** **cullingDistance**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:255](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L255)

Gets or sets the main pass instance visibility culling distance (`0` or greater).

##### Returns

`number`

Main pass visibility culling distance

#### Set Signature

> **set** **cullingDistance**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:279](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L279)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`cullingDistance`](../../Core/namespaces/Scatter/classes/AScatterType.md#cullingdistance)

***

***

### densityMultiplier

#### Get Signature

> **get** **densityMultiplier**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:394](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L394)

Gets or sets the density multiplier applied to the base density (`0.0` or greater).

##### Returns

`number`

Density multiplier

#### Set Signature

> **set** **densityMultiplier**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:418](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L418)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`densityMultiplier`](../../Core/namespaces/Scatter/classes/AScatterType.md#densitymultiplier)

***

***

### densityPerHectare

#### Get Signature

> **get** **densityPerHectare**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:374](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L374)

Gets or sets the base instance density per hectare (10,000㎡) (`0.0` or greater).

##### Returns

`number`

Base placement density per hectare

#### Set Signature

> **set** **densityPerHectare**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:398](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L398)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`densityPerHectare`](../../Core/namespaces/Scatter/classes/AScatterType.md#densityperhectare)

***

***

### densityScaleByWeight

#### Get Signature

> **get** **densityScaleByWeight**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:354](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L354)

Gets or sets whether to scale instance size according to the terrain layer weight.

##### Returns

`boolean`

Whether weight-based scaling is enabled

#### Set Signature

> **set** **densityScaleByWeight**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:378](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L378)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`densityScaleByWeight`](../../Core/namespaces/Scatter/classes/AScatterType.md#densityscalebyweight)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`gpuDevice`](../../Core/namespaces/Scatter/classes/AScatterType.md#gpudevice)

***

***

### groundBlendStrength

#### Get Signature

> **get** **groundBlendStrength**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:434](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L434)

Gets or sets the ground blending strength (`0.0`~`1.0`) with the terrain surface.

##### Returns

`number`

Ground blending strength (`0.0`~`1.0`)

#### Set Signature

> **set** **groundBlendStrength**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:461](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L461)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`groundBlendStrength`](../../Core/namespaces/Scatter/classes/AScatterType.md#groundblendstrength)

***

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:223](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L223)

Gets or sets the base height of scatter instances (`0.01` or greater).

##### Returns

`number`

Instance base height

#### Set Signature

> **set** **height**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:239](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L239)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`height`](../../Core/namespaces/Scatter/classes/AScatterType.md#height)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`instanceId`](../../Core/namespaces/Scatter/classes/AScatterType.md#instanceid)

***

***

### maxSlope

#### Get Signature

> **get** **maxSlope**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:334](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L334)

Gets or sets the maximum terrain slope angle (degrees, `0.0`~`90.0`) allowed for instance placement.

##### Returns

`number`

Maximum terrain slope angle (in degrees)

#### Set Signature

> **set** **maxSlope**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:358](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L358)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`maxSlope`](../../Core/namespaces/Scatter/classes/AScatterType.md#maxslope)

***

***

### minSlope

#### Get Signature

> **get** **minSlope**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:315](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L315)

Gets or sets the minimum terrain slope angle (degrees, `0.0`~`90.0`) allowed for instance placement.

##### Returns

`number`

Minimum terrain slope angle (in degrees)

#### Set Signature

> **set** **minSlope**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:338](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L338)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`minSlope`](../../Core/namespaces/Scatter/classes/AScatterType.md#minslope)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/landscape/core/scatter/AScatterType.ts:166](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L166)

Returns the unique name of the scatter type. Cannot be changed after creation.

##### Returns

`string`

Unique name of the scatter type

#### Set Signature

> **set** **name**(`_value`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L170)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `_value` | `string` |

##### Returns

`void`

Object name string

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`name`](../../Core/namespaces/Scatter/classes/AScatterType.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`redGPUContext`](../../Core/namespaces/Scatter/classes/AScatterType.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`resourceManager`](../../Core/namespaces/Scatter/classes/AScatterType.md#resourcemanager)

***

***

### targetLayer

#### Get Signature

> **get** **targetLayer**(): `string` \| `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:295](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L295)

Gets or sets the target terrain layer name or index from which to reference placement density weights.

##### Returns

`string` \| `number`

Target layer name (`string`), index (`number`), or `undefined`

#### Set Signature

> **set** **targetLayer**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:319](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L319)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`targetLayer`](../../Core/namespaces/Scatter/classes/AScatterType.md#targetlayer)

***

***

### typeId

#### Get Signature

> **get** **typeId**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:182](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L182)

Gets or sets the unique numeric ID assigned to the scatter type.

##### Returns

`number`

Scatter type numeric ID

#### Set Signature

> **set** **typeId**(`value`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:186](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`typeId`](../../Core/namespaces/Scatter/classes/AScatterType.md#typeid)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`uuid`](../../Core/namespaces/Scatter/classes/AScatterType.md#uuid)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### bindAllocation()

> **bindAllocation**(`allocation`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:454](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L454)

Binds mega buffer segment allocation information to this scatter type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `allocation` | `GrassTypeAllocation` | Segment allocation information to bind, or `null` |

#### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`bindAllocation`](../../Core/namespaces/Scatter/classes/AScatterType.md#bindallocation)

***

***

### setRawScatterProperties()

> **setRawScatterProperties**(`values`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:477](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L477)

Batch-sets the internal raw values of scatter properties without triggering the `onParameterChanged` callback.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `values` | \{ `bottomOffset?`: `number`; `castShadow?`: `boolean`; `cullingDistance?`: `number`; `densityMultiplier?`: `number`; `densityPerHectare?`: `number`; `densityScaleByWeight?`: `boolean`; `groundBlendStrength?`: `number`; `height?`: `number`; `maxSlope?`: `number`; `minSlope?`: `number`; `shadowCullDistance?`: `number`; `targetLayer?`: `string` \| `number`; \} | Object containing scatter property values to batch-set |
| `values.bottomOffset?` | `number` | - |
| `values.castShadow?` | `boolean` | - |
| `values.cullingDistance?` | `number` | - |
| `values.densityMultiplier?` | `number` | - |
| `values.densityPerHectare?` | `number` | - |
| `values.densityScaleByWeight?` | `boolean` | - |
| `values.groundBlendStrength?` | `number` | - |
| `values.height?` | `number` | - |
| `values.maxSlope?` | `number` | - |
| `values.minSlope?` | `number` | - |
| `values.shadowCullDistance?` | `number` | - |
| `values.targetLayer?` | `string` \| `number` | - |

#### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`setRawScatterProperties`](../../Core/namespaces/Scatter/classes/AScatterType.md#setrawscatterproperties)

</details>
