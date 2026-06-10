[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / PrimitiveUtils

# Class: PrimitiveUtils

Defined in: [src/primitive/core/PrimitiveUtils.ts:13](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L13)

Utility class for common math and data processing for primitive generation.

## Constructors

### Constructor

> **new PrimitiveUtils**(): `PrimitiveUtils`

#### Returns

`PrimitiveUtils`

## Methods

### calculateTangents()

> `static` **calculateTangents**(`interleaveData`, `indexData`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:383](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L383)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `interleaveData` | `number`[] |
| `indexData` | `number`[] |

#### Returns

`void`

***

### finalize()

> `static` **finalize**(`redGPUContext`, `interleaveData`, `indexData`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:37](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `interleaveData` | `number`[] |
| `indexData` | `number`[] |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### generateBoxData()

> `static` **generateBoxData**(`redGPUContext`, `width`, `height`, `depth`, `widthSegments`, `heightSegments`, `depthSegments`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:59](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L59)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `width` | `number` |
| `height` | `number` |
| `depth` | `number` |
| `widthSegments` | `number` |
| `heightSegments` | `number` |
| `depthSegments` | `number` |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### generateCapsuleData()

> `static` **generateCapsuleData**(`redGPUContext`, `radius`, `height`, `radialSegments`, `heightSegments`, `capSegments`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:362](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L362)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `radius` | `number` |
| `height` | `number` |
| `radialSegments` | `number` |
| `heightSegments` | `number` |
| `capSegments` | `number` |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### generateCircleEntryData()

> `static` **generateCircleEntryData**(`redGPUContext`, `radius`, `radialSegments`, `thetaStart`, `thetaLength`, `isRadial`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:228](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L228)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `radius` | `number` |
| `radialSegments` | `number` |
| `thetaStart` | `number` |
| `thetaLength` | `number` |
| `isRadial` | `boolean` |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### generateConeData()

> `static` **generateConeData**(`redGPUContext`, `radius`, `height`, `radialSegments`, `heightSegments`, `capBottom`, `thetaStart`, `thetaLength`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:202](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L202)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `radius` | `number` |
| `height` | `number` |
| `radialSegments` | `number` |
| `heightSegments` | `number` |
| `capBottom` | `boolean` |
| `thetaStart` | `number` |
| `thetaLength` | `number` |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### generateCylinderData()

> `static` **generateCylinderData**(`redGPUContext`, `radiusTop`, `radiusBottom`, `height`, `radialSegments`, `heightSegments`, `capTop`, `capBottom`, `thetaStart`, `thetaLength`, `isRadialTop`, `isRadialBottom`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:185](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L185)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `radiusTop` | `number` |
| `radiusBottom` | `number` |
| `height` | `number` |
| `radialSegments` | `number` |
| `heightSegments` | `number` |
| `capTop` | `boolean` |
| `capBottom` | `boolean` |
| `thetaStart` | `number` |
| `thetaLength` | `number` |
| `isRadialTop` | `boolean` |
| `isRadialBottom` | `boolean` |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### generateCylinderTorsoData()

> `static` **generateCylinderTorsoData**(`interleaveData`, `indexData`, `radiusTop`, `radiusBottom`, `height`, `radialSegments`, `heightSegments`, `thetaStart`, `thetaLength`, `center`, `uV`, `vV`, `axisVector?`, `skipIndices?`, `uvVStart?`, `uvVEnd?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:334](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L334)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` |
| `indexData` | `number`[] | `undefined` |
| `radiusTop` | `number` | `undefined` |
| `radiusBottom` | `number` | `undefined` |
| `height` | `number` | `undefined` |
| `radialSegments` | `number` | `undefined` |
| `heightSegments` | `number` | `undefined` |
| `thetaStart` | `number` | `undefined` |
| `thetaLength` | `number` | `undefined` |
| `center` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` |
| `center.x` | `number` | `undefined` |
| `center.y` | `number` | `undefined` |
| `center.z` | `number` | `undefined` |
| `uV` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` |
| `uV.x` | `number` | `undefined` |
| `uV.y` | `number` | `undefined` |
| `uV.z` | `number` | `undefined` |
| `vV` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` |
| `vV.x` | `number` | `undefined` |
| `vV.y` | `number` | `undefined` |
| `vV.z` | `number` | `undefined` |
| `axisVector` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `...` |
| `axisVector.x` | `number` | `undefined` |
| `axisVector.y` | `number` | `undefined` |
| `axisVector.z` | `number` | `undefined` |
| `skipIndices` | `boolean` | `false` |
| `uvVStart` | `number` | `0` |
| `uvVEnd` | `number` | `1` |

#### Returns

`void`

***

### generateGrid()

> `static` **generateGrid**(`interleaveData`, `indexData`, `resolutionX`, `resolutionY`, `vertexCallback`, `skipIndices?`, `reverseIndices?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:42](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L42)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` |
| `indexData` | `number`[] | `undefined` |
| `resolutionX` | `number` | `undefined` |
| `resolutionY` | `number` | `undefined` |
| `vertexCallback` | (`u`, `v`, `ix`, `iy`) => `void` | `undefined` |
| `skipIndices` | `boolean` | `false` |
| `reverseIndices` | `boolean` | `false` |

#### Returns

`void`

***

### generateGridIndices()

> `static` **generateGridIndices**(`indexData`, `vertexOffset`, `gridX`, `gridY`, `gridX1`, `reverse?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:373](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L373)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `indexData` | `number`[] | `undefined` |
| `vertexOffset` | `number` | `undefined` |
| `gridX` | `number` | `undefined` |
| `gridY` | `number` | `undefined` |
| `gridX1` | `number` | `undefined` |
| `reverse` | `boolean` | `false` |

#### Returns

`void`

***

### generateGroundData()

> `static` **generateGroundData**(`redGPUContext`, `width`, `height`, `widthSegments`, `heightSegments`, `flipY`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:217](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L217)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `width` | `number` |
| `height` | `number` |
| `widthSegments` | `number` |
| `heightSegments` | `number` |
| `flipY` | `boolean` |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### generatePlaneData()

> `static` **generatePlaneData**(`interleaveData`, `indexData`, `width`, `height`, `mainSegmentsX`, `mainSegmentsY`, `center`, `uV`, `vV`, `normal`, `radius?`, `radiusSegments?`, `boxDim?`, `flipY?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:103](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L103)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` |
| `indexData` | `number`[] | `undefined` |
| `width` | `number` | `undefined` |
| `height` | `number` | `undefined` |
| `mainSegmentsX` | `number` | `undefined` |
| `mainSegmentsY` | `number` | `undefined` |
| `center` | `any` | `undefined` |
| `uV` | `any` | `undefined` |
| `vV` | `any` | `undefined` |
| `normal` | `any` | `undefined` |
| `radius` | `number` | `0` |
| `radiusSegments` | `number` | `0` |
| `boxDim` | `any` | `null` |
| `flipY` | `boolean` | `false` |

#### Returns

`void`

***

### generatePlaneEntryData()

> `static` **generatePlaneEntryData**(`redGPUContext`, `width`, `height`, `widthSegments`, `heightSegments`, `flipY`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:206](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L206)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `width` | `number` |
| `height` | `number` |
| `widthSegments` | `number` |
| `heightSegments` | `number` |
| `flipY` | `boolean` |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### generateRingData()

> `static` **generateRingData**(`interleaveData`, `indexData`, `innerRadius`, `outerRadius`, `thetaSegments`, `phiSegments`, `thetaStart`, `thetaLength`, `center`, `uV`, `vV`, `normal`, `isFront?`, `isRadial?`, `uvVStart?`, `uvVEnd?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:300](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L300)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` |
| `indexData` | `number`[] | `undefined` |
| `innerRadius` | `number` | `undefined` |
| `outerRadius` | `number` | `undefined` |
| `thetaSegments` | `number` | `undefined` |
| `phiSegments` | `number` | `undefined` |
| `thetaStart` | `number` | `undefined` |
| `thetaLength` | `number` | `undefined` |
| `center` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` |
| `center.x` | `number` | `undefined` |
| `center.y` | `number` | `undefined` |
| `center.z` | `number` | `undefined` |
| `uV` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` |
| `uV.x` | `number` | `undefined` |
| `uV.y` | `number` | `undefined` |
| `uV.z` | `number` | `undefined` |
| `vV` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` |
| `vV.x` | `number` | `undefined` |
| `vV.y` | `number` | `undefined` |
| `vV.z` | `number` | `undefined` |
| `normal` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` |
| `normal.x` | `number` | `undefined` |
| `normal.y` | `number` | `undefined` |
| `normal.z` | `number` | `undefined` |
| `isFront` | `boolean` | `true` |
| `isRadial` | `boolean` | `false` |
| `uvVStart` | `number` | `0` |
| `uvVEnd` | `number` | `1` |

#### Returns

`void`

***

### generateRingEntryData()

> `static` **generateRingEntryData**(`redGPUContext`, `innerRadius`, `outerRadius`, `thetaSegments`, `phiSegments`, `thetaStart`, `thetaLength`, `isRadial`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:235](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L235)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `innerRadius` | `number` |
| `outerRadius` | `number` |
| `thetaSegments` | `number` |
| `phiSegments` | `number` |
| `thetaStart` | `number` |
| `thetaLength` | `number` |
| `isRadial` | `boolean` |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### generateRoundedBoxData()

> `static` **generateRoundedBoxData**(`redGPUContext`, `width`, `height`, `depth`, `widthSegments`, `heightSegments`, `depthSegments`, `radius`, `radiusSegments`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:63](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L63)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `width` | `number` |
| `height` | `number` |
| `depth` | `number` |
| `widthSegments` | `number` |
| `heightSegments` | `number` |
| `depthSegments` | `number` |
| `radius` | `number` |
| `radiusSegments` | `number` |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### generateSphereData()

> `static` **generateSphereData**(`redGPUContext`, `radius`, `widthSegments`, `heightSegments`, `phiStart`, `phiLength`, `thetaStart`, `thetaLength`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:178](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L178)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `radius` | `number` |
| `widthSegments` | `number` |
| `heightSegments` | `number` |
| `phiStart` | `number` |
| `phiLength` | `number` |
| `thetaStart` | `number` |
| `thetaLength` | `number` |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### generateSphericalData()

> `static` **generateSphericalData**(`interleaveData`, `indexData`, `radius`, `widthSegments`, `heightSegments`, `phiStart`, `phiLength`, `thetaStart`, `thetaLength`, `yOffset?`, `uvVStart?`, `uvVEnd?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:324](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L324)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` |
| `indexData` | `number`[] | `undefined` |
| `radius` | `number` | `undefined` |
| `widthSegments` | `number` | `undefined` |
| `heightSegments` | `number` | `undefined` |
| `phiStart` | `number` | `undefined` |
| `phiLength` | `number` | `undefined` |
| `thetaStart` | `number` | `undefined` |
| `thetaLength` | `number` | `undefined` |
| `yOffset` | `number` | `0` |
| `uvVStart` | `number` | `0` |
| `uvVEnd` | `number` | `1` |

#### Returns

`void`

***

### generateTorusData()

> `static` **generateTorusData**(`redGPUContext`, `radius`, `thickness`, `radialSegments`, `tubularSegments`, `thetaStart`, `thetaLength`, `capStart`, `capEnd`, `isRadialCapStart`, `isRadialCapEnd`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:242](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L242)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `radius` | `number` |
| `thickness` | `number` |
| `radialSegments` | `number` |
| `tubularSegments` | `number` |
| `thetaStart` | `number` |
| `thetaLength` | `number` |
| `capStart` | `boolean` |
| `capEnd` | `boolean` |
| `isRadialCapStart` | `boolean` |
| `isRadialCapEnd` | `boolean` |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### generateTorusKnotData()

> `static` **generateTorusKnotData**(`redGPUContext`, `radius`, `tubeRadius`, `tubularSegments`, `radialSegments`, `windingsAroundAxis`, `windingsAroundCircle`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:275](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L275)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `radius` | `number` |
| `tubeRadius` | `number` |
| `tubularSegments` | `number` |
| `radialSegments` | `number` |
| `windingsAroundAxis` | `number` |
| `windingsAroundCircle` | `number` |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### getEmptyGeometry()

> `static` **getEmptyGeometry**(`redGPUContext`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:53](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L53)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `uniqueKey` | `string` |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

***

### interleavePacker()

> `static` **interleavePacker**(`interleaveData`, `px`, `py`, `pz`, `nx`, `ny`, `nz`, `u`, `v`, `tx?`, `ty?`, `tz?`, `tw?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:410](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/primitive/core/PrimitiveUtils.ts#L410)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` |
| `px` | `number` | `undefined` |
| `py` | `number` | `undefined` |
| `pz` | `number` | `undefined` |
| `nx` | `number` | `undefined` |
| `ny` | `number` | `undefined` |
| `nz` | `number` | `undefined` |
| `u` | `number` | `undefined` |
| `v` | `number` | `undefined` |
| `tx` | `number` | `0` |
| `ty` | `number` | `0` |
| `tz` | `number` | `0` |
| `tw` | `number` | `1` |

#### Returns

`void`
