[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreMesh](../README.md) / mixInMesh2D

# Function: mixInMesh2D()

> **mixInMesh2D**\<`TBase`\>(`Base`): \{new (...`args`): `resultClass`; `prototype`: `resultClass`\<`any`\>; \} & `TBase`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/mixInMesh2D.ts#L60)

Mixin function that combines 2D-specific transform (position, scale, rotation) and blend mode functionality into a base mesh class.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| <a id="type-parameter-tbase"></a> `TBase` *extends* new (...`args`) => `Mesh2DBase` | Constructor type satisfying `Mesh2DBase` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `Base` | `TBase` | Base class to extend |

## Returns

\{new (...`args`): `resultClass`; `prototype`: `resultClass`\<`any`\>; \} & `TBase`

Class extended with 2D mesh functionality
