[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Light](../../../../../README.md) / [Core](../../../README.md) / [ClusterLight](../README.md) / PassClustersLightHelper

# Variable: PassClustersLightHelper

> `const` **PassClustersLightHelper**: `object`

Defined in: [src/light/core/clusterLight/core/PassClustersLightHelper.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L7)

3D grid subdivision constants and buffer/dispatch size calculation utilities for clustered lighting.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-getclusterlightsbuffersize"></a> `getClusterLightsBufferSize()` | () => `number` | - | Returns the total byte size of the cluster light index storage buffer. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L65) |
| <a id="property-getdispatchsize"></a> `getDispatchSize()` | () => `number`[] | - | Returns the compute workgroup dispatch size (`[x, y, z]`) for processing the cluster grid. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L77) |
| <a id="property-gettotaltilesize"></a> `getTotalTileSize()` | () => `number` | - | Returns the total number of tiles in the 3D cluster grid. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L56) |
| <a id="property-max_cluster_lights"></a> `MAX_CLUSTER_LIGHTS` | `number` | `1024` | Maximum total number of lights processed simultaneously in clustered lighting. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:47](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L47) |
| <a id="property-max_lights_per_cluster"></a> `MAX_LIGHTS_PER_CLUSTER` | `number` | `100` | Maximum number of lights assignable per cluster tile. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L42) |
| <a id="property-tile_count_x"></a> `TILE_COUNT_X` | `number` | `16` | Number of cluster tile subdivisions along the X-axis. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L12) |
| <a id="property-tile_count_y"></a> `TILE_COUNT_Y` | `number` | `16` | Number of cluster tile subdivisions along the Y-axis. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L17) |
| <a id="property-tile_count_z"></a> `TILE_COUNT_Z` | `number` | `64` | Number of cluster slice subdivisions along the Z-axis (depth). | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L22) |
| <a id="property-workgroup_size_x"></a> `WORKGROUP_SIZE_X` | `number` | `8` | Compute shader workgroup size along the X-axis. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L27) |
| <a id="property-workgroup_size_y"></a> `WORKGROUP_SIZE_Y` | `number` | `4` | Compute shader workgroup size along the Y-axis. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L32) |
| <a id="property-workgroup_size_z"></a> `WORKGROUP_SIZE_Z` | `number` | `8` | Compute shader workgroup size along the Z-axis. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L37) |
