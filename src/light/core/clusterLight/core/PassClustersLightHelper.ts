/**
 * [KO] 클러스터드 라이팅(Clustered Lighting) 연산에 필요한 그리드 분할 상수 및 버퍼/디스패치 크기 계산 유틸리티를 제공합니다.
 * [EN] Provides grid subdivision constants and buffer/dispatch size calculation utilities required for Clustered Lighting computations.
 *
 * @category Light
 */
const PassClustersLightHelper = {
    /**
     * [KO] X축 방향 클러스터 타일 분할 개수
     * [EN] Number of cluster tile subdivisions along the X-axis
     */
    TILE_COUNT_X: 16,
    /**
     * [KO] Y축 방향 클러스터 타일 분할 개수
     * [EN] Number of cluster tile subdivisions along the Y-axis
     */
    TILE_COUNT_Y: 16,
    /**
     * [KO] Z축(깊이) 방향 클러스터 슬라이스 분할 개수
     * [EN] Number of cluster slice subdivisions along the Z-axis (depth)
     */
    TILE_COUNT_Z: 64,
    /**
     * [KO] 컴퓨트 셰이더의 X축 워크그룹 크기
     * [EN] Compute shader workgroup size along the X-axis
     */
    WORKGROUP_SIZE_X: 8,
    /**
     * [KO] 컴퓨트 셰이더의 Y축 워크그룹 크기
     * [EN] Compute shader workgroup size along the Y-axis
     */
    WORKGROUP_SIZE_Y: 4,
    /**
     * [KO] 컴퓨트 셰이더의 Z축 워크그룹 크기
     * [EN] Compute shader workgroup size along the Z-axis
     */
    WORKGROUP_SIZE_Z: 8,
    /**
     * [KO] 단일 클러스터 타일당 할당 가능한 최대 광원 개수
     * [EN] Maximum number of lights assignable to a single cluster tile
     */
    MAX_LIGHTS_PER_CLUSTER: 100,
    /**
     * [KO] 클러스터드 라이팅에서 동시에 처리 가능한 전체 최대 광원 개수 (PointLight + SpotLight)
     * [EN] Maximum total number of lights processable simultaneously in clustered lighting (PointLight + SpotLight)
     */
    MAX_CLUSTER_LIGHTS: 1024,
    /**
     * [KO] 전체 3D 클러스터 그리드의 총 타일(셀) 개수를 반환합니다.
     * [EN] Returns the total number of tiles (cells) in the entire 3D cluster grid.
     *
     * @returns
     * [KO] 총 클러스터 타일 개수 (`TILE_COUNT_X * TILE_COUNT_Y * TILE_COUNT_Z`)
     * [EN] Total cluster tile count (`TILE_COUNT_X * TILE_COUNT_Y * TILE_COUNT_Z`)
     */
    getTotalTileSize: () => PassClustersLightHelper.TILE_COUNT_X * PassClustersLightHelper.TILE_COUNT_Y * PassClustersLightHelper.TILE_COUNT_Z,
    /**
     * [KO] 클러스터 라이트 인덱스 및 메타데이터를 저장할 스토리지 버퍼의 총 바이트 크기를 계산합니다.
     * [EN] Calculates the total byte size of the storage buffer for storing cluster light indices and metadata.
     *
     * @returns
     * [KO] 스토리지 버퍼 바이트 크기
     * [EN] Storage buffer size in bytes
     */
    getClusterLightsBufferSize: () => {
        const totalTileSize = PassClustersLightHelper.getTotalTileSize();
        return (8 * totalTileSize) + (8 * PassClustersLightHelper.MAX_LIGHTS_PER_CLUSTER * totalTileSize) + 4
    },
    /**
     * [KO] 전체 클러스터 그리드를 처리하기 위한 컴퓨트 셰이더 워크그룹 디스패치 크기(`[x, y, z]`)를 반환합니다.
     * [EN] Returns the compute shader workgroup dispatch size (`[x, y, z]`) required to process the entire cluster grid.
     *
     * @returns
     * [KO] 워크그룹 디스패치 크기 배열 (`[dispatchX, dispatchY, dispatchZ]`)
     * [EN] Workgroup dispatch size array (`[dispatchX, dispatchY, dispatchZ]`)
     */
    getDispatchSize: () => [
        Math.ceil(PassClustersLightHelper.TILE_COUNT_X / PassClustersLightHelper.WORKGROUP_SIZE_X),
        Math.ceil(PassClustersLightHelper.TILE_COUNT_Y / PassClustersLightHelper.WORKGROUP_SIZE_Y),
        Math.ceil(PassClustersLightHelper.TILE_COUNT_Z / PassClustersLightHelper.WORKGROUP_SIZE_Z)
    ]
}
Object.freeze(PassClustersLightHelper)
export default PassClustersLightHelper