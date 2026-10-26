[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Foliage](../README.md) / Foliage

# Class: Foliage

Defined in: [src/landscape/foliage/core/Foliage.ts:319](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L319)

Class that manages LODs, sub-cell streaming, and rendering properties for a single foliage type (trees, rocks, shrubs, etc.) placed on a `Landscape`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Add a foliage type with LOD and impostor options
const pineTree = landscape.foliageManager.addType({
    name: 'PineTree',
    lods: [
        { mesh: pineLod0Mesh, lodDistance: 60 },
        { mesh: pineLod1Mesh, lodDistance: 150 }
    ],
    densityPerHectare: 150,
    useImpostor: true
});
```

## See

[Foliage and Impostors example](https://redcamel.github.io/RedGPU/examples/3d/landscape/foliageAndImpostors/)

## Extends

- [`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md)\<`FoliageTypeAllocation`\>

## Constructors



***

### Constructor

> **new Foliage**(`redGPUContext`, `options`, `megaBuffer?`, `baker?`, `slotPooler?`, `landscape?`): `Foliage`

Defined in: [src/landscape/foliage/core/Foliage.ts:396](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L396)

Creates a `Foliage` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |
| `options` | [`FoliageOptions`](../interfaces/FoliageOptions.md) | Foliage type initialization options |
| `megaBuffer?` | [`FoliageMegaBuffer`](../namespaces/Core/classes/FoliageMegaBuffer.md) | `FoliageMegaBuffer` instance to store foliage instance data |
| `baker?` | [`FoliageInstanceBaker`](../namespaces/Core/classes/FoliageInstanceBaker.md) | `FoliageInstanceBaker` instance that performs sub-cell instance baking |
| `slotPooler?` | [`FoliageSlotPooler`](../namespaces/Core/classes/FoliageSlotPooler.md) | `FoliageSlotPooler` instance managing render unit UBO slots |
| `landscape?` | [`Landscape`](../../../classes/Landscape.md) | Target `Landscape` instance where foliage is placed |

#### Returns

`Foliage`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`constructor`](../../Core/namespaces/Scatter/classes/AScatterType.md#constructor)

## Properties



***

### onRepopulateRequired?

> `optional` **onRepopulateRequired?**: (`type`) => `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:369](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L369)

Callback function invoked when sub-cell instance repopulation is required due to placement parameter changes

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `Foliage` |

#### Returns

`void`

***

***

### onUniformDirty?

> `optional` **onUniformDirty?**: (`typeId`) => `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:364](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L364)

Callback function invoked when uniform parameters change and UBO update is required

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `typeId` | `number` |

#### Returns

`void`

## Accessors



***

### activeInstanceCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeInstanceCount**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:799](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L799)

Returns the total number of active instances currently mounted in the GPU mega buffer.

##### Returns

`number`

Active instance count

***

***

### alignFactor

#### Get Signature

> **get** **alignFactor**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:890](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L890)

Gets or sets the terrain normal alignment factor (`0.0` to `1.0`).

##### Returns

`number`

Normal alignment factor

#### Set Signature

> **set** **alignFactor**(`val`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:853](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L853)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### alignToNormal

#### Get Signature

> **get** **alignToNormal**(): `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:870](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L870)

Gets or sets whether to align instances to the terrain surface normal.

##### Returns

`boolean`

Whether terrain normal alignment is enabled

#### Set Signature

> **set** **alignToNormal**(`val`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:836](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L836)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

***

***

### boundingRadius

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingRadius**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:810](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L810)

Returns the bounding sphere radius of the foliage mesh in meters.

##### Returns

`number`

Bounding radius

***

***

### depthPrepassMaskedRenderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthPrepassMaskedRenderUnits**(): [`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:744](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L744)

Returns the list of alpha-masked `FoliageRenderUnit` instances rendered in the Depth Prepass.

##### Returns

[`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Array of alpha-masked Depth Prepass render units

***

***

### depthPrepassOpaqueRenderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthPrepassOpaqueRenderUnits**(): [`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:733](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L733)

Returns the list of opaque `FoliageRenderUnit` instances rendered in the Depth Prepass.

##### Returns

[`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Array of opaque Depth Prepass render units

***

***

### groundBlendRange

#### Get Signature

> **get** **groundBlendRange**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:964](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L964)

Gets or sets the height range in meters over which terrain ground color blending is applied.

##### Returns

`number`

Ground blend height range in meters

#### Set Signature

> **set** **groundBlendRange**(`v`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:874](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L874)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

***

### hasImpostor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hasImpostor**(): `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:901](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L901)

Returns whether an octahedral impostor render unit exists for this foliage type.

##### Returns

`boolean`

Whether an impostor render unit exists

***

***

### hasMaskedLOD0

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hasMaskedLOD0**(): `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:821](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L821)

Returns whether LOD 0 contains an alpha-masked material.

##### Returns

`boolean`

Whether LOD 0 has a masked material

***

***

### landscape

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **landscape**(): [`Landscape`](../../../classes/Landscape.md)

Defined in: [src/landscape/foliage/core/Foliage.ts:711](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L711)

Returns the target `Landscape` instance where the foliage is placed.

##### Returns

[`Landscape`](../../../classes/Landscape.md)

`Landscape` instance or `null`

***

***

### lastMountedCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lastMountedCount**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:986](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L986)

Returns the number of newly mounted sub-cells in the most recent streaming update.

##### Returns

`number`

Recently mounted sub-cell count

***

***

### lastUnmountedCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lastUnmountedCount**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:997](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L997)

Returns the number of unmounted sub-cells in the most recent streaming update.

##### Returns

`number`

Recently unmounted sub-cell count

***

***

### leafFlutterScale

#### Get Signature

> **get** **leafFlutterScale**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:832](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L832)

Gets or sets the wind-driven leaf flutter scale multiplier.

##### Returns

`number`

Leaf flutter scale multiplier

#### Set Signature

> **set** **leafFlutterScale**(`val`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:844](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L844)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### lod0RenderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lod0RenderUnits**(): [`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:766](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L766)

Returns the list of `FoliageRenderUnit` instances belonging to LOD 0.

##### Returns

[`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Array of LOD 0 render units

***

***

### lodInfoList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lodInfoList**(): [`FoliageLODInfo`](../namespaces/Core/interfaces/FoliageLODInfo.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:788](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L788)

Returns the list of metadata (`FoliageLODInfo`) for each configured LOD level.

##### Returns

[`FoliageLODInfo`](../namespaces/Core/interfaces/FoliageLODInfo.md)[]

Array of `FoliageLODInfo`

***

***

### mainRenderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mainRenderUnits**(): [`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:755](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L755)

Returns the list of `FoliageRenderUnit` instances rendered in the main color pass.

##### Returns

[`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Array of main pass render units

***

***

### maxInstances

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **maxInstances**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:624](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L624)

Returns the maximum instance capacity allocated to this foliage type.

##### Returns

`number`

Maximum instance count

***

***

### maxScale

#### Get Signature

> **get** **maxScale**(): \[`number`, `number`, `number`\]

Defined in: [src/landscape/foliage/core/Foliage.ts:678](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L678)

Gets or sets the maximum random instance scale `[x, y, z]`.

##### Returns

\[`number`, `number`, `number`\]

Maximum scale tuple `[x, y, z]`

#### Set Signature

> **set** **maxScale**(`v`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:655](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L655)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`\] \| \[`number`, `number`, `number`\] |

##### Returns

`void`

***

***

### megaBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **megaBuffer**(): [`FoliageMegaBuffer`](../namespaces/Core/classes/FoliageMegaBuffer.md)

Defined in: [src/landscape/foliage/core/Foliage.ts:700](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L700)

Returns the associated `FoliageMegaBuffer` instance.

##### Returns

[`FoliageMegaBuffer`](../namespaces/Core/classes/FoliageMegaBuffer.md)

`FoliageMegaBuffer` instance or `null`

***

***

### minScale

#### Get Signature

> **get** **minScale**(): \[`number`, `number`, `number`\]

Defined in: [src/landscape/foliage/core/Foliage.ts:651](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L651)

Gets or sets the minimum random instance scale `[x, y, z]`.

##### Returns

\[`number`, `number`, `number`\]

Minimum scale tuple `[x, y, z]`

#### Set Signature

> **set** **minScale**(`v`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:628](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L628)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`\] \| \[`number`, `number`, `number`\] |

##### Returns

`void`

***

***

### mountedSubCellCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mountedSubCellCount**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:975](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L975)

Returns the number of currently mounted sub-cells.

##### Returns

`number`

Number of mounted sub-cells

***

***

### nameHash

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **nameHash**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:613](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L613)

Returns the hash value calculated from the foliage type name.

##### Returns

`number`

Name hash value

***

***

### randomRotationY

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **randomRotationY**(): `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:689](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L689)

Returns whether random rotation around the Y-axis is applied.

##### Returns

`boolean`

Whether Y-axis random rotation is enabled

***

***

### receiveShadow

#### Get Signature

> **get** **receiveShadow**(): `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:933](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L933)

Gets or sets whether the foliage surface receives shadows.

##### Returns

`boolean`

Whether shadows are received

#### Set Signature

> **set** **receiveShadow**(`value`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:937](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L937)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### renderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderUnits**(): [`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:722](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L722)

Returns the list of `FoliageRenderUnit` instances across all LOD levels.

##### Returns

[`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Array of `FoliageRenderUnit`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`renderUnits`](../../Core/namespaces/Scatter/classes/AScatterType.md#renderunits)

***

***

### shadowMergedRenderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowMergedRenderUnits**(): [`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:777](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L777)

Returns the list of merged `FoliageRenderUnit` instances for shadow pass rendering.

##### Returns

[`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Array of shadow-merged render units

***

***

### streamingRadius

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **streamingRadius**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:953](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L953)

Returns the effective radius in meters within which sub-cell streaming is performed.

##### Returns

`number`

Streaming radius in meters

***

***

### trunkBendScale

#### Get Signature

> **get** **trunkBendScale**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:593](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L593)

Gets or sets the wind-driven trunk bending scale multiplier.

##### Returns

`number`

Trunk bending scale multiplier

#### Set Signature

> **set** **trunkBendScale**(`val`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:597](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L597)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### useImpostor

#### Get Signature

> **get** **useImpostor**(): `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:912](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L912)

Gets or sets whether the far-distance Octahedral Impostor LOD is used.

##### Returns

`boolean`

Whether the impostor is used

#### Set Signature

> **set** **useImpostor**(`value`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:916](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L916)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

## Methods



***

### clearSubCellCache()

> **clearSubCellCache**(): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1061](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L1061)

Resets the state of all mounted sub-cells and clears the sub-cell cache.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1005](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L1005)

Releases all render units, sub-cell caches, and associated resources of the foliage type.

#### Returns

`void`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`destroy`](../../Core/namespaces/Scatter/classes/AScatterType.md#destroy)

***

***

### flushAllRenderUnitUBOs()

> **flushAllRenderUnitUBOs**(): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1043](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L1043)

Synchronizes type parameters and flushes the slot UBOs of all render units and shadow render units to the GPU.

#### Returns

`void`

***

***

### onParameterChanged()

> **onParameterChanged**(`prop`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1108](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L1108)

Invoked when a scatter property value changes, triggering cache reset, rebaking, or UBO update.

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

### rebake()

> **rebake**(): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1339](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L1339)

Rebakes the instance transform data of all currently mounted sub-cells into the GPU mega buffer.

#### Returns

`void`

***

***

### setLODDistance()

> **setLODDistance**(`lodIndex`, `distance`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1088](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L1088)

Updates the transition distance of a specific LOD level.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `lodIndex` | `number` | Target LOD level index |
| `distance` | `number` | Transition distance to set in meters |

#### Returns

`void`

***

***

### updateStreaming()

> **updateStreaming**(`camX`, `camZ`, `mountBudget?`, `unmountBudget?`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L1208)

Mounts or unmounts sub-cells inside and outside the streaming radius within the given budget based on the camera position.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `camX` | `number` | `undefined` | World X coordinate of the camera |
| `camZ` | `number` | `undefined` | World Z coordinate of the camera |
| `mountBudget?` | `number` | `16` | Maximum number of sub-cells allowed to mount per frame (default: `16`) |
| `unmountBudget?` | `number` | `32` | Maximum number of sub-cells allowed to unmount per frame (default: `32`) |

#### Returns

`void`

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

### shadowCullDistance

#### Get Signature

> **get** **shadowCullDistance**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:275](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L275)

Gets or sets the shadow pass instance culling distance (`0` or greater).

##### Returns

`number`

Shadow pass culling distance

#### Set Signature

> **set** **shadowCullDistance**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:299](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L299)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`shadowCullDistance`](../../Core/namespaces/Scatter/classes/AScatterType.md#shadowculldistance)

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
| `allocation` | `FoliageTypeAllocation` | Segment allocation information to bind, or `null` |

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

***

</details>
