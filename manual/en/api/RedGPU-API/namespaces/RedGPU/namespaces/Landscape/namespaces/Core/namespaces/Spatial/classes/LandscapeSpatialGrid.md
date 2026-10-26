[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Spatial](../README.md) / LandscapeSpatialGrid

# Class: LandscapeSpatialGrid

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L14)

Class that partitions the entire world area of the Landscape into a 2D tile grid and processes spatial queries.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new LandscapeSpatialGrid**(`tileCountX`, `tileCountZ`, `tileSizeX`, `tileSizeZ`): `LandscapeSpatialGrid`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:47](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L47)

Creates a `LandscapeSpatialGrid` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tileCountX` | `number` | Number of tiles along the X axis |
| `tileCountZ` | `number` | Number of tiles along the Z axis |
| `tileSizeX` | `number` | World width (X) of a single tile |
| `tileSizeZ` | `number` | World depth (Z) of a single tile |

#### Returns

`LandscapeSpatialGrid`

## Accessors

### componentCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **componentCount**(): \[`number`, `number`\]

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L77)

Returns the tile component count tuple (`[tileCountX, tileCountZ]`).

##### Returns

\[`number`, `number`\]

Tile component count tuple (`[number, number]`)

***

### flatCells

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **flatCells**(): [`LandscapeComponent`](LandscapeComponent.md)[]

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:149](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L149)

Returns the 1D array (`Array<LandscapeComponent>`) of all tile components in the grid.

##### Returns

[`LandscapeComponent`](LandscapeComponent.md)[]

1D array of tile components (`Array<LandscapeComponent>`)

***

### halfWorldSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **halfWorldSizeX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:209](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L209)

Returns half of the total terrain world width (`worldSizeX / 2`).

##### Returns

`number`

Half of the total terrain world width

***

### halfWorldSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **halfWorldSizeZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:221](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L221)

Returns half of the total terrain world depth (`worldSizeZ / 2`).

##### Returns

`number`

Half of the total terrain world depth

***

### invWorldSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **invWorldSizeX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:125](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L125)

Returns the reciprocal of the total terrain world width (`1 / worldSizeX`).

##### Returns

`number`

Reciprocal of the world width

***

### invWorldSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **invWorldSizeZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:137](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L137)

Returns the reciprocal of the total terrain world depth (`1 / worldSizeZ`).

##### Returns

`number`

Reciprocal of the world depth

***

### tileCountX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileCountX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:161](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L161)

Returns the number of tiles along the X axis.

##### Returns

`number`

Number of tiles along the X axis

***

### tileCountZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileCountZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:173](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L173)

Returns the number of tiles along the Z axis.

##### Returns

`number`

Number of tiles along the Z axis

***

### tileSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileSize**(): \[`number`, `number`\]

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L89)

Returns the single tile world size tuple (`[tileSizeX, tileSizeZ]`).

##### Returns

\[`number`, `number`\]

Single tile world size tuple (`[number, number]`)

***

### tileSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileSizeX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:185](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L185)

Returns the world width (X) of a single tile.

##### Returns

`number`

Single tile world width (X)

***

### tileSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileSizeZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:197](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L197)

Returns the world depth (Z) of a single tile.

##### Returns

`number`

Single tile world depth (Z)

***

### worldSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldSize**(): \[`number`, `number`\]

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L65)

Returns the world size tuple (`[worldSizeX, worldSizeZ]`) of the entire terrain.

##### Returns

\[`number`, `number`\]

Entire terrain world size tuple (`[number, number]`)

***

### worldSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldSizeX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L101)

Returns the total world width (X) of the terrain.

##### Returns

`number`

Total terrain world width (X)

***

### worldSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldSizeZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:113](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L113)

Returns the total world depth (Z) of the terrain.

##### Returns

`number`

Total terrain world depth (Z)

## Methods

### getActiveComponentsInRadius()

> **getActiveComponentsInRadius**(`camX`, `camZ`, `tileLoadingRadius`, `outArray`): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:357](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L357)

Searches for active tile components within the given radius around the camera world coordinates and populates the output array.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `camX` | `number` | Reference center (camera) world X coordinate |
| `camZ` | `number` | Reference center (camera) world Z coordinate |
| `tileLoadingRadius` | `number` | Search radius (in world units) |
| `outArray` | [`LandscapeComponent`](LandscapeComponent.md)[] | Reusable array (`Array<LandscapeComponent>`) to be populated with the found `LandscapeComponent` list |

#### Returns

`number`

Number of tile components found within the radius

***

### getCellCoordinates()

> **getCellCoordinates**(`x`, `z`, `outBuffer`): `void`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:329](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L329)

Converts world `(x, z)` coordinates to grid cell coordinates (`[col, row]`) and writes them into the output buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | World X coordinate |
| `z` | `number` | World Z coordinate |
| `outBuffer` | `Int32Array` | `Int32Array` buffer of length 2 or greater to store the `[col, row]` result |

#### Returns

`void`

***

### getComponent()

> **getComponent**(`row`, `col`): [`LandscapeComponent`](LandscapeComponent.md)

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:310](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L310)

Returns the tile component located at the specified row and column indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `row` | `number` | Row (Z) index |
| `col` | `number` | Column (X) index |

#### Returns

[`LandscapeComponent`](LandscapeComponent.md)

`LandscapeComponent` at the position, or `null` if out of bounds

***

### rebuildTiles()

> **rebuildTiles**(`onTileCreated?`): `void`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:261](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L261)

Rebuilds all `LandscapeComponent` tile instances according to the current grid configuration.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `onTileCreated?` | (`comp`, `index`) => `void` | Callback function invoked when each tile component is created (optional) |

#### Returns

`void`

***

### setConfig()

> **setConfig**(`tileCountX`, `tileCountZ`, `tileSizeX`, `tileSizeZ`): `void`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:242](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L242)

Updates the tile count and tile size configuration of the grid and clears the existing cell list.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tileCountX` | `number` | Number of tiles along the X axis |
| `tileCountZ` | `number` | Number of tiles along the Z axis |
| `tileSizeX` | `number` | World width (X) of a single tile |
| `tileSizeZ` | `number` | World depth (Z) of a single tile |

#### Returns

`void`
