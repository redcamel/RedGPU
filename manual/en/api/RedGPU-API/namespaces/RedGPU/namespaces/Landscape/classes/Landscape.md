[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Landscape](../README.md) / Landscape

# Class: Landscape

Defined in: [src/landscape/Landscape.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L52)

Core class that integrates and manages tile streaming, GPU-driven frustum/HZB occlusion culling, continuous LOD morphing, multi-layer splatting, and vegetation (`FoliageManager`) and grass (`GrassManager`) ecosystems for large-scale terrains.

***

### Example
```typescript
// Create a terrain with 4000x4000 world size and assign it to the scene
const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 4000);
landscape.globalHeightmapUrl = './assets/heightmap.png';
landscape.heightScale = 600;
scene.landscape = landscape;
```

## See

- [Basic Terrain example](https://redcamel.github.io/RedGPU/examples/3d/landscape/basicTerrain/)
 - [Multi-Layer Splatting example](https://redcamel.github.io/RedGPU/examples/3d/landscape/multiLayerSplatting/)
 - [Tile Streaming example](https://redcamel.github.io/RedGPU/examples/3d/landscape/tileStreaming/)
 - [Procedural Grass example](https://redcamel.github.io/RedGPU/examples/3d/landscape/proceduralGrass/)
 - [Foliage and Impostors example](https://redcamel.github.io/RedGPU/examples/3d/landscape/foliageAndImpostors/)
 - [Landscape and Water example](https://redcamel.github.io/RedGPU/examples/3d/landscape/landscapeAndWater/)
 - [Open World Integration example](https://redcamel.github.io/RedGPU/examples/3d/landscape/openWorldIntegration/)

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new Landscape**(`redGPUContext`, `worldSize?`): `Landscape`

Defined in: [src/landscape/Landscape.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L109)

Creates a `Landscape` instance.

#### Example
```typescript
// Create a Landscape instance with 4000x4000 dimensions
const landscape = new RedGPU.Landscape.Landscape(redGPUContext, [4000, 4000]);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` instance |
| `worldSize?` | `number` \| \[`number`, `number`\] | `2000` | Total world size of the terrain (single number or `[worldSizeX, worldSizeZ]` tuple, default: `2000`) |

#### Returns

`Landscape`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### baseColor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **baseColor**(): [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/landscape/Landscape.ts:561](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L561)

Returns the default base color (`ColorRGBA`) of the terrain material.

##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

`ColorRGBA` instance

***

***

### castHeightmapShadow

#### Get Signature

> **get** **castHeightmapShadow**(): `boolean`

Defined in: [src/landscape/Landscape.ts:755](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L755)

Gets or sets whether heightmap raymarching-based terrain self-shadowing is enabled. (Default: `false`)

##### Returns

`boolean`

Whether heightmap self-shadowing is enabled

#### Set Signature

> **set** **castHeightmapShadow**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:759](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L759)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### componentCount

#### Get Signature

> **get** **componentCount**(): \[`number`, `number`\]

Defined in: [src/landscape/Landscape.ts:365](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L365)

Gets or sets the number of tiles (components) `[countX, countZ]` dividing the terrain along the X and Z axes.

##### Returns

\[`number`, `number`\]

Component count tuple `[number, number]`

#### Set Signature

> **set** **componentCount**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:369](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L369)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` \| \[`number`, `number`\] |

##### Returns

`void`

***

***

### components

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **components**(): [`LandscapeComponent`](../namespaces/Core/namespaces/Spatial/classes/LandscapeComponent.md)[]

Defined in: [src/landscape/Landscape.ts:489](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L489)

Returns the array of all `LandscapeComponent` instances belonging to the terrain spatial grid.

##### Returns

[`LandscapeComponent`](../namespaces/Core/namespaces/Spatial/classes/LandscapeComponent.md)[]

Array of `LandscapeComponent` instances

***

***

### componentSizeQuads

#### Get Signature

> **get** **componentSizeQuads**(): `number`

Defined in: [src/landscape/Landscape.ts:432](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L432)

Gets or sets the base quad subdivision count per side of a standard tile component. (Only values from `LANDSCAPE_BASE_GRID_SIZE` are allowed)

##### Returns

`number`

Number of quads per side of a component

#### Set Signature

> **set** **componentSizeQuads**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:436](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L436)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### debuggerManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **debuggerManager**(): [`LandscapeDebuggerManager`](../namespaces/Debugger/classes/LandscapeDebuggerManager.md)

Defined in: [src/landscape/Landscape.ts:214](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L214)

Returns the `LandscapeDebuggerManager` that controls terrain debug visualization and wireframe states.

##### Returns

[`LandscapeDebuggerManager`](../namespaces/Debugger/classes/LandscapeDebuggerManager.md)

`LandscapeDebuggerManager` instance

***

***

### foliageManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **foliageManager**(): [`FoliageManager`](../namespaces/Foliage/classes/FoliageManager.md)

Defined in: [src/landscape/Landscape.ts:226](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L226)

Returns the `FoliageManager` that manages vegetation (3D mesh) scattering on the terrain.

##### Returns

[`FoliageManager`](../namespaces/Foliage/classes/FoliageManager.md)

`FoliageManager` instance

***

***

### globalHeightmapUrl

#### Get Signature

> **get** **globalHeightmapUrl**(): `string`

Defined in: [src/landscape/Landscape.ts:601](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L601)

Gets or sets the global heightmap image URL that provides base elevation across the entire terrain.

##### Returns

`string`

Global heightmap URL string

#### Set Signature

> **set** **globalHeightmapUrl**(`val`): `void`

Defined in: [src/landscape/Landscape.ts:605](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L605)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` |

##### Returns

`void`

***

***

### grassManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **grassManager**(): [`GrassManager`](../namespaces/Grass/classes/GrassManager.md)

Defined in: [src/landscape/Landscape.ts:238](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L238)

Returns the `GrassManager` that manages procedural grass and vegetation clumps on the terrain.

##### Returns

[`GrassManager`](../namespaces/Grass/classes/GrassManager.md)

`GrassManager` instance

***

***

### halfWorldSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **halfWorldSizeX**(): `number`

Defined in: [src/landscape/Landscape.ts:341](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L341)

Returns half of the X-axis world size (`worldSizeX * 0.5`).

##### Returns

`number`

Half of the X-axis world size

***

***

### halfWorldSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **halfWorldSizeZ**(): `number`

Defined in: [src/landscape/Landscape.ts:353](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L353)

Returns half of the Z-axis world size (`worldSizeZ * 0.5`).

##### Returns

`number`

Half of the Z-axis world size

***

***

### hasValidScatterAtlas

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hasValidScatterAtlas**(): `boolean`

Defined in: [src/landscape/Landscape.ts:687](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L687)

Returns whether both the VHT/VBT atlases and loaded tiles required for foliage and grass scattering are valid.

##### Returns

`boolean`

Whether the scatter atlases are valid

***

***

### hasValidVbtAtlas

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hasValidVbtAtlas**(): `boolean`

Defined in: [src/landscape/Landscape.ts:704](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L704)

Returns whether the VBT base color atlas and loaded tiles are valid.

##### Returns

`boolean`

Whether the VBT atlas is valid

***

***

### heightmapShadowDistance

#### Get Signature

> **get** **heightmapShadowDistance**(): `number`

Defined in: [src/landscape/Landscape.ts:774](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L774)

Gets or sets the maximum trace distance (in world units, minimum: `10.0`, default: `1000.0`) for heightmap self-shadow raymarching.

##### Returns

`number`

Maximum heightmap shadow trace distance

#### Set Signature

> **set** **heightmapShadowDistance**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:778](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L778)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### heightmapShadowSoftness

#### Get Signature

> **get** **heightmapShadowSoftness**(): `number`

Defined in: [src/landscape/Landscape.ts:812](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L812)

Gets or sets the softness factor (minimum: `0.1`, default: `8.0`) for heightmap self-shadow edges.

##### Returns

`number`

Heightmap shadow softness factor

#### Set Signature

> **set** **heightmapShadowSoftness**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:816](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L816)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### heightmapShadowSteps

#### Get Signature

> **get** **heightmapShadowSteps**(): `number`

Defined in: [src/landscape/Landscape.ts:793](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L793)

Gets or sets the number of sampling steps (range: `4 to 64`, default: `16`) for heightmap self-shadow raymarching.

##### Returns

`number`

Number of heightmap shadow raymarching steps

#### Set Signature

> **set** **heightmapShadowSteps**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:797](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L797)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### heightScale

#### Get Signature

> **get** **heightScale**(): `number`

Defined in: [src/landscape/Landscape.ts:409](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L409)

Gets or sets the maximum elevation scale (in world units, default: `200.0`) multiplied by normalized heightmap values (`0.0 to 1.0`).

##### Returns

`number`

Maximum height scale

#### Set Signature

> **set** **heightScale**(`val`): `void`

Defined in: [src/landscape/Landscape.ts:413](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L413)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### instanceBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceBuffer**(): `LandscapeInstanceBuffer`

Defined in: [src/landscape/Landscape.ts:190](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L190)

Returns the `LandscapeInstanceBuffer` managing tile instance and indirect draw GPU buffers.

##### Returns

`LandscapeInstanceBuffer`

`LandscapeInstanceBuffer` instance

***

***

### invWorldSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **invWorldSizeX**(): `number`

Defined in: [src/landscape/Landscape.ts:317](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L317)

Returns the reciprocal of the X-axis world size (`1 / worldSizeX`).

##### Returns

`number`

Reciprocal of the X-axis world size

***

***

### invWorldSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **invWorldSizeZ**(): `number`

Defined in: [src/landscape/Landscape.ts:329](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L329)

Returns the reciprocal of the Z-axis world size (`1 / worldSizeZ`).

##### Returns

`number`

Reciprocal of the Z-axis world size

***

***

### layers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **layers**(): [`LandscapeLayer`](LandscapeLayer.md)[]

Defined in: [src/landscape/Landscape.ts:573](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L573)

Returns the array of `LandscapeLayer` instances registered in the terrain material.

##### Returns

[`LandscapeLayer`](LandscapeLayer.md)[]

Array of `LandscapeLayer` instances

***

***

### lod0SizeQuads

#### Get Signature

> **get** **lod0SizeQuads**(): `number`

Defined in: [src/landscape/Landscape.ts:460](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L460)

Gets or sets the quad subdivision count per side for the highest-resolution LOD 0 tile.

##### Returns

`number`

Number of quads per side for LOD 0 tiles

#### Set Signature

> **set** **lod0SizeQuads**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:464](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L464)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lodDistancesSq

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lodDistancesSq**(): `number`[]

Defined in: [src/landscape/Landscape.ts:549](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L549)

Returns the array of squared threshold distances for each LOD level transition.

##### Returns

`number`[]

Array of squared LOD transition distances (`number[]`)

***

***

### lodMaxLevel

#### Get Signature

> **get** **lodMaxLevel**(): `number`

Defined in: [src/landscape/Landscape.ts:520](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L520)

Gets or sets the maximum number of LOD levels used for the terrain mesh (range: `1 to 8`, default: `5`).

##### Returns

`number`

Maximum number of LOD levels

#### Set Signature

> **set** **lodMaxLevel**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:524](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L524)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lodMetric

#### Get Signature

> **get** **lodMetric**(): `"distance"` \| `"screenSize"`

Defined in: [src/landscape/Landscape.ts:501](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L501)

Gets or sets the tile LOD determination metric (`'distance'` or `'screenSize'`, default: `'screenSize'`).

##### Returns

`"distance"` \| `"screenSize"`

LOD determination metric (`'distance' | 'screenSize'`)

#### Set Signature

> **set** **lodMetric**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:505](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L505)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"distance"` \| `"screenSize"` |

##### Returns

`void`

***

***

### material

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **material**(): [`LandscapeMaterial`](LandscapeMaterial.md)

Defined in: [src/landscape/Landscape.ts:250](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L250)

Returns the `LandscapeMaterial` responsible for terrain surface layers and texture blending.

##### Returns

[`LandscapeMaterial`](LandscapeMaterial.md)

`LandscapeMaterial` instance

***

***

### nearDetailDistance

#### Get Signature

> **get** **nearDetailDistance**(): `number`

Defined in: [src/landscape/Landscape.ts:585](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L585)

Gets or sets the distance (in world units) within which high-resolution near-detail textures are applied.

##### Returns

`number`

Near-detail blending distance

#### Set Signature

> **set** **nearDetailDistance**(`val`): `void`

Defined in: [src/landscape/Landscape.ts:589](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L589)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### receiveShadow

#### Get Signature

> **get** **receiveShadow**(): `boolean`

Defined in: [src/landscape/Landscape.ts:736](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L736)

Gets or sets whether the terrain receives directional light shadow maps. (Default: `true`)

##### Returns

`boolean`

Whether shadow receiving is enabled

#### Set Signature

> **set** **receiveShadow**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:740](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L740)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### sharedGeometry

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **sharedGeometry**(): `LandscapeSharedGeometry`

Defined in: [src/landscape/Landscape.ts:178](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L178)

Returns the shared LOD grid geometry (`LandscapeSharedGeometry`) used by terrain tiles.

##### Returns

`LandscapeSharedGeometry`

`LandscapeSharedGeometry` instance

***

***

### tileLoadedCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileLoadedCount**(): `number`

Defined in: [src/landscape/Landscape.ts:651](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L651)

Returns the number of terrain tiles currently loaded and active.

##### Returns

`number`

Number of loaded tiles

***

***

### tileLoadingRadius

#### Get Signature

> **get** **tileLoadingRadius**(): `number`

Defined in: [src/landscape/Landscape.ts:619](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L619)

Gets or sets the radius (in world units, default: `2500.0`) around the camera position within which high-resolution tile heightmaps are streamed.

##### Returns

`number`

Tile streaming loading radius

#### Set Signature

> **set** **tileLoadingRadius**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:623](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L623)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### tileMaxLoadsPerFrame

#### Get Signature

> **get** **tileMaxLoadsPerFrame**(): `number`

Defined in: [src/landscape/Landscape.ts:635](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L635)

Gets or sets the maximum number of tiles to start decoding and baking per single frame.

##### Returns

`number`

Maximum tile loads per frame

#### Set Signature

> **set** **tileMaxLoadsPerFrame**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:639](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L639)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### tileSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileSize**(): \[`number`, `number`\]

Defined in: [src/landscape/Landscape.ts:397](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L397)

Returns the world size `[tileSizeX, tileSizeZ]` of a single tile (component).

##### Returns

\[`number`, `number`\]

Tile size tuple `[number, number]`

***

***

### tileUrlResolver

#### Get Signature

> **get** **tileUrlResolver**(): [`LandscapeTileUrlResolver`](../namespaces/Core/namespaces/Spatial/type-aliases/LandscapeTileUrlResolver.md)

Defined in: [src/landscape/Landscape.ts:720](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L720)

Gets or sets the resolver function that returns individual tile heightmap image URLs based on tile row and column indices (`row`, `col`).

##### Returns

[`LandscapeTileUrlResolver`](../namespaces/Core/namespaces/Spatial/type-aliases/LandscapeTileUrlResolver.md)

Tile URL resolver function or `null`

#### Set Signature

> **set** **tileUrlResolver**(`resolver`): `void`

Defined in: [src/landscape/Landscape.ts:724](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L724)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `resolver` | [`LandscapeTileUrlResolver`](../namespaces/Core/namespaces/Spatial/type-aliases/LandscapeTileUrlResolver.md) |

##### Returns

`void`

***

***

### vbtTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vbtTextureView**(): `GPUTextureView`

Defined in: [src/landscape/Landscape.ts:675](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L675)

Returns the `GPUTextureView` of the Virtual Blend Texture (VBT) base color atlas.

##### Returns

`GPUTextureView`

VBT base color atlas `GPUTextureView` or `null`

***

***

### vertexShaderModule

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexShaderModule**(): `GPUShaderModule`

Defined in: [src/landscape/Landscape.ts:202](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L202)

Returns the vertex shader module (`GPUShaderModule`) used for terrain rendering.

##### Returns

`GPUShaderModule`

`GPUShaderModule` instance

***

***

### vhtTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vhtTextureView**(): `GPUTextureView`

Defined in: [src/landscape/Landscape.ts:663](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L663)

Returns the `GPUTextureView` of the Virtual Height Texture (VHT) atlas.

##### Returns

`GPUTextureView`

VHT atlas `GPUTextureView` or `null`

***

***

### worldSize

#### Get Signature

> **get** **worldSize**(): \[`number`, `number`\]

Defined in: [src/landscape/Landscape.ts:262](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L262)

Gets or sets the total world size `[worldSizeX, worldSizeZ]` of the terrain.

##### Returns

\[`number`, `number`\]

World size tuple `[number, number]`

#### Set Signature

> **set** **worldSize**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:266](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L266)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` \| \[`number`, `number`\] |

##### Returns

`void`

***

***

### worldSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldSizeX**(): `number`

Defined in: [src/landscape/Landscape.ts:293](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L293)

Returns the total world size of the terrain along the X-axis.

##### Returns

`number`

World size along the X-axis

***

***

### worldSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldSizeZ**(): `number`

Defined in: [src/landscape/Landscape.ts:305](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L305)

Returns the total world size of the terrain along the Z-axis.

##### Returns

`number`

World size along the Z-axis

## Methods



***

### addLayer()

> **addLayer**(`options`): [`LandscapeLayer`](LandscapeLayer.md)

Defined in: [src/landscape/Landscape.ts:889](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L889)

Creates, adds, and returns a new splatting layer (`LandscapeLayer`) to the terrain material. Up to 8 PBR material layers can be registered, sharing a single RGBA weight map texture (`weightTexture`, 4 channels: `'R' | 'G' | 'B' | 'A'`) across the terrain.

#### Example
```typescript
// Add a grass splatting layer to the landscape
const grassLayer = landscape.addLayer({
    name: 'Grass',
    baseColorTexture: './assets/grass_diff.jpg',
    normalTexture: './assets/grass_norm.jpg',
    uvScale: [25, 25]
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`LandscapeLayerOptions`](../interfaces/LandscapeLayerOptions.md) | Configuration options for the layer to create (`LandscapeLayerOptions`) |

#### Returns

[`LandscapeLayer`](LandscapeLayer.md)

Created and added `LandscapeLayer` instance

***

***

### clearLayers()

> **clearLayers**(): `void`

Defined in: [src/landscape/Landscape.ts:920](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L920)

Removes all splatting layers registered in the terrain material.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/Landscape.ts:1052](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L1052)

Releases all sub-managers (foliage, grass, tile streamer, culler, renderer, geometry, etc.) and GPU resources belonging to the terrain.

#### Returns

`void`

***

***

### getHeightAt()

> **getHeightAt**(`x`, `z`): `number`

Defined in: [src/landscape/Landscape.ts:844](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L844)

Computes and returns the terrain surface height (Y coordinate, in world units) at the specified world X, Z coordinates from the CPU heightmap cache.

#### Example
```typescript
// Query terrain elevation at world position (120, -45)
const groundY = landscape.getHeightAt(120, -45);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | World X coordinate |
| `z` | `number` | World Z coordinate |

#### Returns

`number`

Interpolated terrain surface height in world units

***

***

### getLayer()

> **getLayer**(`name`): [`LandscapeLayer`](LandscapeLayer.md)

Defined in: [src/landscape/Landscape.ts:935](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L935)

Finds and returns the `LandscapeLayer` with the specified name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Layer name to look up |

#### Returns

[`LandscapeLayer`](LandscapeLayer.md)

Matching `LandscapeLayer` instance or `undefined`

***

***

### isTileLoaded()

> **isTileLoaded**(`row`, `col`): `boolean`

Defined in: [src/landscape/Landscape.ts:862](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L862)

Returns whether the terrain tile at the specified `row` and `col` indices has finished loading.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `row` | `number` | Tile row (Z-axis) index |
| `col` | `number` | Tile column (X-axis) index |

#### Returns

`boolean`

Whether the tile is loaded

***

***

### removeLayer()

> **removeLayer**(`layer`): `boolean`

Defined in: [src/landscape/Landscape.ts:911](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L911)

Removes the specified `LandscapeLayer` instance or layer name from the terrain material.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layer` | `string` \| [`LandscapeLayer`](LandscapeLayer.md) | `LandscapeLayer` instance or layer name to remove |

#### Returns

`boolean`

Whether the layer was successfully removed

***

***

### render()

> **render**(`view`, `passEncoder?`): `void`

Defined in: [src/landscape/Landscape.ts:1044](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L1044)

Renders the terrain mesh into the current render pass via the internal `LandscapeRenderer`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | `any` | Render view or `RenderViewStateData` object |
| `passEncoder?` | `GPURenderPassEncoder` | `GPURenderPassEncoder` to use (extracted from `view` if omitted) |

#### Returns

`void`

***

***

### update()

> **update**(`renderViewStateData`): `void`

Defined in: [src/landscape/Landscape.ts:948](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/Landscape.ts#L948)

Updates tile streaming, GPU culling, foliage (`FoliageManager`), and grass (`GrassManager`) compute passes each frame based on the camera view state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | Current frame's view and frustum state data (`RenderViewStateData`) |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
