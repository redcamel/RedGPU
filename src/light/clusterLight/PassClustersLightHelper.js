const PassClustersLightHelper = {
    TILE_COUNT_X: 32,
    TILE_COUNT_Y: 32,
    TILE_COUNT_Z: 48,
    WORKGROUP_SIZE_X: 8,
    WORKGROUP_SIZE_Y: 4,
    WORKGROUP_SIZE_Z: 8,
    MAX_LIGHTS_PER_CLUSTER: 100,
    MAX_CLUSTER_LIGHTS: 1024,
    getTotalTileSize: () => PassClustersLightHelper.TILE_COUNT_X * PassClustersLightHelper.TILE_COUNT_Y * PassClustersLightHelper.TILE_COUNT_Z,
    getClusterLightsBufferSize: () => {
        const totalTileSize = PassClustersLightHelper.getTotalTileSize();
        return (8 * totalTileSize) + (8 * PassClustersLightHelper.MAX_LIGHTS_PER_CLUSTER * totalTileSize) + 4;
    },
    getDispatchSize: () => [
        Math.ceil(PassClustersLightHelper.TILE_COUNT_X / PassClustersLightHelper.WORKGROUP_SIZE_X),
        Math.ceil(PassClustersLightHelper.TILE_COUNT_Y / PassClustersLightHelper.WORKGROUP_SIZE_Y),
        Math.ceil(PassClustersLightHelper.TILE_COUNT_Z / PassClustersLightHelper.WORKGROUP_SIZE_Z)
    ]
};
Object.freeze(PassClustersLightHelper);
export default PassClustersLightHelper;
