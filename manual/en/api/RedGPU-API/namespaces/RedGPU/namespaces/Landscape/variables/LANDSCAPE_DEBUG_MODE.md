[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Landscape](../README.md) / LANDSCAPE\_DEBUG\_MODE

# Variable: LANDSCAPE\_DEBUG\_MODE

> `const` **LANDSCAPE\_DEBUG\_MODE**: `object`

Defined in: [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L7)

Visual debug mode constants for landscape rendering.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-albedo"></a> `ALBEDO` | `3` | `3` | Visualizes the pure albedo (Base Color) without lighting calculations. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L27) |
| <a id="property-ambient_occlusion"></a> `AMBIENT_OCCLUSION` | `6` | `6` | Visualizes the surface ambient occlusion value. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L42) |
| <a id="property-csm_shadow_mask"></a> `CSM_SHADOW_MASK` | `8` | `8` | Visualizes the Cascaded Shadow Map (CSM) shadow mask. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L52) |
| <a id="property-elevation_heatmap"></a> `ELEVATION_HEATMAP` | `10` | `10` | Visualizes normalized terrain elevation as a heatmap color. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:62](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L62) |
| <a id="property-final_normal"></a> `FINAL_NORMAL` | `1` | `1` | Visualizes the final world-space normal vector combined with layer normal maps. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L17) |
| <a id="property-heightmap_shadow_mask"></a> `HEIGHTMAP_SHADOW_MASK` | `7` | `7` | Visualizes the heightmap raymarching-based self-shadow mask. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:47](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L47) |
| <a id="property-lod_level"></a> `LOD_LEVEL` | `11` | `11` | Visualizes per-tile geometry LOD levels with colors. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:67](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L67) |
| <a id="property-macro_normal"></a> `MACRO_NORMAL` | `2` | `2` | Visualizes the terrain macro normal vector sampled from the VNT atlas. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L22) |
| <a id="property-none"></a> `NONE` | `0` | `0` | Disables debug visualization and performs normal PBR rendering. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L12) |
| <a id="property-roughness"></a> `ROUGHNESS` | `5` | `5` | Visualizes the surface roughness value in grayscale. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L37) |
| <a id="property-splat_weights"></a> `SPLAT_WEIGHTS` | `4` | `4` | Visualizes the blending weight distribution of splatting layers. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L32) |
| <a id="property-total_shadow_visibility"></a> `TOTAL_SHADOW_VISIBILITY` | `9` | `9` | Visualizes the total shadow visibility combining heightmap shadows and CSM shadows. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L57) |
