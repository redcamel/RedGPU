/**
 * [KO] 클러스터 라이팅 패스를 위한 헬퍼 객체입니다.
 * [EN] Helper object for the cluster lighting pass.
 *
 * [KO] 타일 크기, 워크그룹 크기, 버퍼 크기 계산 등의 상수를 정의하고 유틸리티 함수를 제공합니다.
 * [EN] Defines constants such as tile size, workgroup size, and buffer size calculation, and provides utility functions.
 * @category Light
 */
const PassClustersLightHelper = {
    /**
     * [KO] X축 타일 개수
     * [EN] Number of tiles on the X-axis
     */
    TILE_COUNT_X: 32,
    /**
     * [KO] Y축 타일 개수
     * [EN] Number of tiles on the Y-axis
     */
    TILE_COUNT_Y: 32,
    /**
     * [KO] Z축 타일 개수
     * [EN] Number of tiles on the Z-axis
     */
    TILE_COUNT_Z: 48,
    /**
     * [KO] X축 워크그룹 크기
     * [EN] Workgroup size on the X-axis
     */
    WORKGROUP_SIZE_X: 8,
    /**
     * [KO] Y축 워크그룹 크기
     * [EN] Workgroup size on the Y-axis
     */
    WORKGROUP_SIZE_Y: 4,
    /**
     * [KO] Z축 워크그룹 크기
     * [EN] Workgroup size on the Z-axis
     */
    WORKGROUP_SIZE_Z: 8,
    /**
     * [KO] 클러스터당 최대 조명 개수
     * [EN] Maximum number of lights per cluster
     */
    MAX_LIGHTS_PER_CLUSTER: 100,
    /**
     * [KO] 최대 클러스터 조명 개수
     * [EN] Maximum number of cluster lights
     */
    MAX_CLUSTER_LIGHTS: 1024,
    /**
     * [KO] 전체 타일 개수를 반환합니다.
     * [EN] Returns the total number of tiles.
     * @returns
     * [KO] 전체 타일 개수
     * [EN] Total number of tiles
     */
    getTotalTileSize: () => PassClustersLightHelper.TILE_COUNT_X * PassClustersLightHelper.TILE_COUNT_Y * PassClustersLightHelper.TILE_COUNT_Z,
    /**
     * [KO] 클러스터 조명 버퍼 크기를 계산하여 반환합니다.
     * [EN] Calculates and returns the cluster light buffer size.
     * @returns
     * [KO] 클러스터 조명 버퍼 크기 (bytes)
     * [EN] Cluster light buffer size (bytes)
     */
    getClusterLightsBufferSize: () => {
        const totalTileSize = PassClustersLightHelper.getTotalTileSize();
        return (8 * totalTileSize) + (8 * PassClustersLightHelper.MAX_LIGHTS_PER_CLUSTER * totalTileSize) + 4
    },
    /**
     * [KO] 디스패치 크기를 계산하여 반환합니다.
     * [EN] Calculates and returns the dispatch size.
     * @returns
     * [KO] [x, y, z] 디스패치 크기 배열
     * [EN] [x, y, z] dispatch size array
     */
    getDispatchSize: () => [
        Math.ceil(PassClustersLightHelper.TILE_COUNT_X / PassClustersLightHelper.WORKGROUP_SIZE_X),
        Math.ceil(PassClustersLightHelper.TILE_COUNT_Y / PassClustersLightHelper.WORKGROUP_SIZE_Y),
        Math.ceil(PassClustersLightHelper.TILE_COUNT_Z / PassClustersLightHelper.WORKGROUP_SIZE_Z)
    ]
}
Object.freeze(PassClustersLightHelper)
export default PassClustersLightHelper