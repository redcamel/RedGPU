[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / PrimitiveUtils

# Class: PrimitiveUtils

Defined in: [src/primitive/core/PrimitiveUtils.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L18)

Static utility class that generates vertex, index, normal, and tangent data for primitive geometries.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new PrimitiveUtils**(): `PrimitiveUtils`

#### Returns

`PrimitiveUtils`

## Methods

### calculateTangents()

> `static` **calculateTangents**(`interleaveData`, `indexData`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:1087](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L1087)

Calculates vertex tangents (`vertexTangent`) from the interleaved vertex and index arrays and writes them in place.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `interleaveData` | `number`[] | Interleaved vertex data array (`Array<number>`) |
| `indexData` | `number`[] | Index data array (`Array<number>`) |

#### Returns

`void`

***

### finalize()

> `static` **finalize**(`redGPUContext`, `interleaveData`, `indexData`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L60)

Calculates tangents for the interleaved vertex data and creates a `Geometry` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `interleaveData` | `number`[] | Interleaved vertex data array (`Array<number>`) |
| `indexData` | `number`[] | Index data array (`Array<number>`) |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### generateBoxData()

> `static` **generateBoxData**(`redGPUContext`, `width`, `height`, `depth`, `widthSegments`, `heightSegments`, `depthSegments`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:154](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L154)

Generates box geometry data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `width` | `number` | Width |
| `height` | `number` | Height |
| `depth` | `number` | Depth |
| `widthSegments` | `number` | Number of width segments |
| `heightSegments` | `number` | Number of height segments |
| `depthSegments` | `number` | Number of depth segments |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### generateCapsuleData()

> `static` **generateCapsuleData**(`redGPUContext`, `radius`, `height`, `radialSegments`, `heightSegments`, `capSegments`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:1032](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L1032)

Generates Capsule geometry data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `radius` | `number` | Capsule radius |
| `height` | `number` | Cylinder torso height |
| `radialSegments` | `number` | Number of radial segments |
| `heightSegments` | `number` | Number of torso height segments |
| `capSegments` | `number` | Number of hemisphere cap segments |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### generateCircleEntryData()

> `static` **generateCircleEntryData**(`redGPUContext`, `radius`, `radialSegments`, `thetaStart`, `thetaLength`, `isRadial`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:611](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L611)

Generates Circle geometry data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `radius` | `number` | Circle radius |
| `radialSegments` | `number` | Number of radial segments |
| `thetaStart` | `number` | Starting angle (radians) |
| `thetaLength` | `number` | Sweep angle (radians) |
| `isRadial` | `boolean` | Whether to use radial UV mapping |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### generateConeData()

> `static` **generateConeData**(`redGPUContext`, `radius`, `height`, `radialSegments`, `heightSegments`, `capBottom`, `thetaStart`, `thetaLength`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:498](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L498)

Generates cone geometry data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `radius` | `number` | Base radius |
| `height` | `number` | Cone height |
| `radialSegments` | `number` | Number of radial segments |
| `heightSegments` | `number` | Number of height segments |
| `capBottom` | `boolean` | Whether to generate bottom cap |
| `thetaStart` | `number` | Starting angle (radians) |
| `thetaLength` | `number` | Sweep angle (radians) |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### generateCylinderData()

> `static` **generateCylinderData**(`redGPUContext`, `radiusTop`, `radiusBottom`, `height`, `radialSegments`, `heightSegments`, `capTop`, `capBottom`, `thetaStart`, `thetaLength`, `isRadialTop`, `isRadialBottom`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:446](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L446)

Generates cylinder geometry data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `radiusTop` | `number` | Top radius |
| `radiusBottom` | `number` | Bottom radius |
| `height` | `number` | Cylinder height |
| `radialSegments` | `number` | Number of radial segments |
| `heightSegments` | `number` | Number of height segments |
| `capTop` | `boolean` | Whether to generate top cap |
| `capBottom` | `boolean` | Whether to generate bottom cap |
| `thetaStart` | `number` | Starting angle (radians) |
| `thetaLength` | `number` | Sweep angle (radians) |
| `isRadialTop` | `boolean` | Whether top cap uses radial UV mapping |
| `isRadialBottom` | `boolean` | Whether bottom cap uses radial UV mapping |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### generateCylinderTorsoData()

> `static` **generateCylinderTorsoData**(`interleaveData`, `indexData`, `radiusTop`, `radiusBottom`, `height`, `radialSegments`, `heightSegments`, `thetaStart`, `thetaLength`, `center`, `uV`, `vV`, `axisVector?`, `skipIndices?`, `uvVStart?`, `uvVEnd?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:975](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L975)

Appends cylinder torso vertex and index data to the buffer arrays.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` | Interleaved vertex data array (`Array<number>`) |
| `indexData` | `number`[] | `undefined` | Index data array (`Array<number>`) |
| `radiusTop` | `number` | `undefined` | Top radius |
| `radiusBottom` | `number` | `undefined` | Bottom radius |
| `height` | `number` | `undefined` | Torso height |
| `radialSegments` | `number` | `undefined` | Number of radial segments |
| `heightSegments` | `number` | `undefined` | Number of height segments |
| `thetaStart` | `number` | `undefined` | Starting angle (radians) |
| `thetaLength` | `number` | `undefined` | Sweep angle (radians) |
| `center` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | Center coordinates |
| `center.x` | `number` | `undefined` | - |
| `center.y` | `number` | `undefined` | - |
| `center.z` | `number` | `undefined` | - |
| `uV` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | Horizontal (U) basis vector |
| `uV.x` | `number` | `undefined` | - |
| `uV.y` | `number` | `undefined` | - |
| `uV.z` | `number` | `undefined` | - |
| `vV` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | Vertical (V) basis vector |
| `vV.x` | `number` | `undefined` | - |
| `vV.y` | `number` | `undefined` | - |
| `vV.z` | `number` | `undefined` | - |
| `axisVector?` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `...` | Height axis vector |
| `axisVector.x` | `number` | `undefined` | - |
| `axisVector.y` | `number` | `undefined` | - |
| `axisVector.z` | `number` | `undefined` | - |
| `skipIndices?` | `boolean` | `false` | Whether to skip index generation (default: `false`) |
| `uvVStart?` | `number` | `0` | V texture coordinate start value (default: 0) |
| `uvVEnd?` | `number` | `1` | V texture coordinate end value (default: 1) |

#### Returns

`void`

***

### generateGrid()

> `static` **generateGrid**(`interleaveData`, `indexData`, `resolutionX`, `resolutionY`, `vertexCallback`, `skipIndices?`, `reverseIndices?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:91](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L91)

Iterates over a 2D UV grid, executes the vertex callback, and generates grid indices.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` | Interleaved vertex data array (`Array<number>`) |
| `indexData` | `number`[] | `undefined` | Index data array (`Array<number>`) |
| `resolutionX` | `number` | `undefined` | Horizontal (X) resolution |
| `resolutionY` | `number` | `undefined` | Vertical (Y) resolution |
| `vertexCallback` | (`u`, `v`, `ix`, `iy`) => `void` | `undefined` | Callback function invoked for each grid vertex |
| `skipIndices?` | `boolean` | `false` | Whether to skip index generation (default: `false`) |
| `reverseIndices?` | `boolean` | `false` | Whether to reverse index winding order (default: `false`) |

#### Returns

`void`

***

### generateGridIndices()

> `static` **generateGridIndices**(`indexData`, `vertexOffset`, `gridX`, `gridY`, `gridX1`, `reverse?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:1066](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L1066)

Generates triangle indices from a 2D grid vertex offset and resolution.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `indexData` | `number`[] | `undefined` | Target array to append indices to (`Array<number>`) |
| `vertexOffset` | `number` | `undefined` | Starting vertex index offset |
| `gridX` | `number` | `undefined` | Number of horizontal cells |
| `gridY` | `number` | `undefined` | Number of vertical cells |
| `gridX1` | `number` | `undefined` | Number of vertices per row (`gridX + 1`) |
| `reverse?` | `boolean` | `false` | Whether to reverse triangle winding order (default: `false`) |

#### Returns

`void`

***

### generateGroundData()

> `static` **generateGroundData**(`redGPUContext`, `width`, `height`, `widthSegments`, `heightSegments`, `flipY`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:571](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L571)

Generates Ground geometry data on the XZ plane.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `width` | `number` | Width along X-axis |
| `height` | `number` | Depth along Z-axis |
| `widthSegments` | `number` | Number of width segments |
| `heightSegments` | `number` | Number of depth segments |
| `flipY` | `boolean` | Whether to flip the V texture coordinate |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### generatePlaneData()

> `static` **generatePlaneData**(`interleaveData`, `indexData`, `width`, `height`, `mainSegmentsX`, `mainSegmentsY`, `center`, `uV`, `vV`, `normal`, `radius?`, `radiusSegments?`, `boxDim?`, `flipY?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:282](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L282)

Appends plane (or rounded box face) vertex and index data to the buffer arrays based on basis vectors and center point.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` | Interleaved vertex data array (`Array<number>`) |
| `indexData` | `number`[] | `undefined` | Index data array (`Array<number>`) |
| `width` | `number` | `undefined` | Plane width |
| `height` | `number` | `undefined` | Plane height |
| `mainSegmentsX` | `number` | `undefined` | Main horizontal segments |
| `mainSegmentsY` | `number` | `undefined` | Main vertical segments |
| `center` | `any` | `undefined` | Plane center coordinates |
| `uV` | `any` | `undefined` | Horizontal (U) basis vector |
| `vV` | `any` | `undefined` | Vertical (V) basis vector |
| `normal` | `any` | `undefined` | Plane normal vector |
| `radius?` | `number` | `0` | Corner rounding radius (default: 0) |
| `radiusSegments?` | `number` | `0` | Corner rounding segments (default: 0) |
| `boxDim?` | `any` | `null` | Rounded box dimension info (default: `null`) |
| `flipY?` | `boolean` | `false` | Whether to flip the V texture coordinate (default: `false`) |

#### Returns

`void`

***

### generatePlaneEntryData()

> `static` **generatePlaneEntryData**(`redGPUContext`, `width`, `height`, `widthSegments`, `heightSegments`, `flipY`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:531](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L531)

Generates Plane geometry data on the XY plane.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `width` | `number` | Width |
| `height` | `number` | Height |
| `widthSegments` | `number` | Number of width segments |
| `heightSegments` | `number` | Number of height segments |
| `flipY` | `boolean` | Whether to flip the V texture coordinate |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### generateRingData()

> `static` **generateRingData**(`interleaveData`, `indexData`, `innerRadius`, `outerRadius`, `thetaSegments`, `phiSegments`, `thetaStart`, `thetaLength`, `center`, `uV`, `vV`, `normal`, `isFront?`, `isRadial?`, `uvVStart?`, `uvVEnd?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:847](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L847)

Appends ring or disc cap vertex and index data to the buffer arrays.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` | Interleaved vertex data array (`Array<number>`) |
| `indexData` | `number`[] | `undefined` | Index data array (`Array<number>`) |
| `innerRadius` | `number` | `undefined` | Inner radius |
| `outerRadius` | `number` | `undefined` | Outer radius |
| `thetaSegments` | `number` | `undefined` | Number of circumferential segments |
| `phiSegments` | `number` | `undefined` | Number of radial segments |
| `thetaStart` | `number` | `undefined` | Starting angle (radians) |
| `thetaLength` | `number` | `undefined` | Sweep angle (radians) |
| `center` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | Center coordinates |
| `center.x` | `number` | `undefined` | - |
| `center.y` | `number` | `undefined` | - |
| `center.z` | `number` | `undefined` | - |
| `uV` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | Horizontal (U) basis vector |
| `uV.x` | `number` | `undefined` | - |
| `uV.y` | `number` | `undefined` | - |
| `uV.z` | `number` | `undefined` | - |
| `vV` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | Vertical (V) basis vector |
| `vV.x` | `number` | `undefined` | - |
| `vV.y` | `number` | `undefined` | - |
| `vV.z` | `number` | `undefined` | - |
| `normal` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | Normal vector |
| `normal.x` | `number` | `undefined` | - |
| `normal.y` | `number` | `undefined` | - |
| `normal.z` | `number` | `undefined` | - |
| `isFront?` | `boolean` | `true` | Whether to use front-facing winding (default: `true`) |
| `isRadial?` | `boolean` | `false` | Whether to use radial UV mapping (default: `false`) |
| `uvVStart?` | `number` | `0` | V texture coordinate start value (default: 0) |
| `uvVEnd?` | `number` | `1` | V texture coordinate end value (default: 1) |

#### Returns

`void`

***

### generateRingEntryData()

> `static` **generateRingEntryData**(`redGPUContext`, `innerRadius`, `outerRadius`, `thetaSegments`, `phiSegments`, `thetaStart`, `thetaLength`, `isRadial`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:653](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L653)

Generates Ring geometry data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `innerRadius` | `number` | Inner radius |
| `outerRadius` | `number` | Outer radius |
| `thetaSegments` | `number` | Number of circumferential segments |
| `phiSegments` | `number` | Number of radial segments |
| `thetaStart` | `number` | Starting angle (radians) |
| `thetaLength` | `number` | Sweep angle (radians) |
| `isRadial` | `boolean` | Whether to use radial UV mapping |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### generateRoundedBoxData()

> `static` **generateRoundedBoxData**(`redGPUContext`, `width`, `height`, `depth`, `widthSegments`, `heightSegments`, `depthSegments`, `radius`, `radiusSegments`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:196](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L196)

Generates rounded box geometry data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `width` | `number` | Width |
| `height` | `number` | Height |
| `depth` | `number` | Depth |
| `widthSegments` | `number` | Number of width segments |
| `heightSegments` | `number` | Number of height segments |
| `depthSegments` | `number` | Number of depth segments |
| `radius` | `number` | Corner chamfer radius |
| `radiusSegments` | `number` | Number of corner radius segments |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### generateSphereData()

> `static` **generateSphereData**(`redGPUContext`, `radius`, `widthSegments`, `heightSegments`, `phiStart`, `phiLength`, `thetaStart`, `thetaLength`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:392](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L392)

Generates sphere geometry data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `radius` | `number` | Sphere radius |
| `widthSegments` | `number` | Horizontal segments |
| `heightSegments` | `number` | Vertical segments |
| `phiStart` | `number` | Horizontal starting angle (radians) |
| `phiLength` | `number` | Horizontal sweep angle (radians) |
| `thetaStart` | `number` | Vertical starting angle (radians) |
| `thetaLength` | `number` | Vertical sweep angle (radians) |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### generateSphericalData()

> `static` **generateSphericalData**(`interleaveData`, `indexData`, `radius`, `widthSegments`, `heightSegments`, `phiStart`, `phiLength`, `thetaStart`, `thetaLength`, `yOffset?`, `uvVStart?`, `uvVEnd?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:912](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L912)

Appends spherical coordinate-based vertex and index data to the buffer arrays.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` | Interleaved vertex data array (`Array<number>`) |
| `indexData` | `number`[] | `undefined` | Index data array (`Array<number>` or `null`) |
| `radius` | `number` | `undefined` | Sphere radius |
| `widthSegments` | `number` | `undefined` | Horizontal segments |
| `heightSegments` | `number` | `undefined` | Vertical segments |
| `phiStart` | `number` | `undefined` | Horizontal starting angle (radians) |
| `phiLength` | `number` | `undefined` | Horizontal sweep angle (radians) |
| `thetaStart` | `number` | `undefined` | Vertical starting angle (radians) |
| `thetaLength` | `number` | `undefined` | Vertical sweep angle (radians) |
| `yOffset?` | `number` | `0` | Y-axis position offset (default: 0) |
| `uvVStart?` | `number` | `0` | V texture coordinate start value (default: 0) |
| `uvVEnd?` | `number` | `1` | V texture coordinate end value (default: 1) |

#### Returns

`void`

***

### generateTorusData()

> `static` **generateTorusData**(`redGPUContext`, `radius`, `thickness`, `radialSegments`, `tubularSegments`, `thetaStart`, `thetaLength`, `capStart`, `capEnd`, `isRadialCapStart`, `isRadialCapEnd`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:704](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L704)

Generates Torus geometry data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `radius` | `number` | Major radius |
| `thickness` | `number` | Tube thickness radius |
| `radialSegments` | `number` | Number of radial segments |
| `tubularSegments` | `number` | Number of tubular segments |
| `thetaStart` | `number` | Starting angle (radians) |
| `thetaLength` | `number` | Sweep angle (radians) |
| `capStart` | `boolean` | Whether to generate start cap |
| `capEnd` | `boolean` | Whether to generate end cap |
| `isRadialCapStart` | `boolean` | Whether start cap uses radial UV |
| `isRadialCapEnd` | `boolean` | Whether end cap uses radial UV |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### generateTorusKnotData()

> `static` **generateTorusKnotData**(`redGPUContext`, `radius`, `tubeRadius`, `tubularSegments`, `radialSegments`, `windingsAroundAxis`, `windingsAroundCircle`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:769](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L769)

Generates TorusKnot geometry data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `radius` | `number` | Overall radius |
| `tubeRadius` | `number` | Tube cross-section radius |
| `tubularSegments` | `number` | Number of tubular segments |
| `radialSegments` | `number` | Number of radial segments |
| `windingsAroundAxis` | `number` | Windings around the central axis p |
| `windingsAroundCircle` | `number` | Windings around the interior circle q |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance

***

### getEmptyGeometry()

> `static` **getEmptyGeometry**(`redGPUContext`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L116)

Returns an empty `Geometry` instance with minimal vertex data for invalid dimensions.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `uniqueKey` | `string` | Unique key for caching |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

Empty `Geometry` instance

***

### interleavePacker()

> `static` **interleavePacker**(`interleaveData`, `px`, `py`, `pz`, `nx`, `ny`, `nz`, `u`, `v`, `tx?`, `ty?`, `tz?`, `tw?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:1157](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L1157)

Appends position, normal, UV, and tangent components of a single vertex to the interleaved array.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` | Interleaved vertex data array (`Array<number>`) |
| `px` | `number` | `undefined` | Position X |
| `py` | `number` | `undefined` | Position Y |
| `pz` | `number` | `undefined` | Position Z |
| `nx` | `number` | `undefined` | Normal X |
| `ny` | `number` | `undefined` | Normal Y |
| `nz` | `number` | `undefined` | Normal Z |
| `u` | `number` | `undefined` | Texture coordinate U |
| `v` | `number` | `undefined` | Texture coordinate V |
| `tx?` | `number` | `0` | Tangent X (default: 0) |
| `ty?` | `number` | `0` | Tangent Y (default: 0) |
| `tz?` | `number` | `0` | Tangent Z (default: 0) |
| `tw?` | `number` | `1` | Tangent W handedness sign (default: 1) |

#### Returns

`void`
