[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Light](../../../../../README.md) / [Core](../../../README.md) / [ClusterLight](../README.md) / PassClustersLightHelper

# Variable: PassClustersLightHelper

> `const` **PassClustersLightHelper**: `object`

Defined in: [src/light/core/clusterLight/core/PassClustersLightHelper.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L7)

클러스터드 라이팅의 3D 그리드 분할 상수 및 버퍼·디스패치 크기 계산 유틸리티입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-getclusterlightsbuffersize"></a> `getClusterLightsBufferSize()` | () => `number` | - | 클러스터 라이트 인덱스 스토리지 버퍼의 총 바이트 크기를 반환합니다. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L65) |
| <a id="property-getdispatchsize"></a> `getDispatchSize()` | () => `number`[] | - | 클러스터 그리드 처리를 위한 컴퓨트 워크그룹 디스패치 크기(`[x, y, z]`)를 반환합니다. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L77) |
| <a id="property-gettotaltilesize"></a> `getTotalTileSize()` | () => `number` | - | 전체 3D 클러스터 그리드의 총 타일 개수를 반환합니다. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L56) |
| <a id="property-max_cluster_lights"></a> `MAX_CLUSTER_LIGHTS` | `number` | `1024` | 클러스터드 라이팅에서 동시 처리 가능한 최대 광원 개수입니다. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:47](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L47) |
| <a id="property-max_lights_per_cluster"></a> `MAX_LIGHTS_PER_CLUSTER` | `number` | `100` | 단일 클러스터 타일당 최대 할당 광원 개수입니다. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L42) |
| <a id="property-tile_count_x"></a> `TILE_COUNT_X` | `number` | `16` | X축 클러스터 타일 분할 수입니다. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L12) |
| <a id="property-tile_count_y"></a> `TILE_COUNT_Y` | `number` | `16` | Y축 클러스터 타일 분할 수입니다. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L17) |
| <a id="property-tile_count_z"></a> `TILE_COUNT_Z` | `number` | `64` | Z축(깊이) 클러스터 슬라이스 분할 수입니다. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L22) |
| <a id="property-workgroup_size_x"></a> `WORKGROUP_SIZE_X` | `number` | `8` | 컴퓨트 셰이더의 X축 워크그룹 크기입니다. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L27) |
| <a id="property-workgroup_size_y"></a> `WORKGROUP_SIZE_Y` | `number` | `4` | 컴퓨트 셰이더의 Y축 워크그룹 크기입니다. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L32) |
| <a id="property-workgroup_size_z"></a> `WORKGROUP_SIZE_Z` | `number` | `8` | 컴퓨트 셰이더의 Z축 워크그룹 크기입니다. | [src/light/core/clusterLight/core/PassClustersLightHelper.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/core/PassClustersLightHelper.ts#L37) |
