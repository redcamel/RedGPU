declare const PassClustersLightHelper: {
    TILE_COUNT_X: number;
    TILE_COUNT_Y: number;
    TILE_COUNT_Z: number;
    WORKGROUP_SIZE_X: number;
    WORKGROUP_SIZE_Y: number;
    WORKGROUP_SIZE_Z: number;
    MAX_LIGHTS_PER_CLUSTER: number;
    MAX_CLUSTER_LIGHTS: number;
    getTotalTileSize: () => number;
    getClusterLightsBufferSize: () => number;
    getDispatchSize: () => number[];
};
export default PassClustersLightHelper;
