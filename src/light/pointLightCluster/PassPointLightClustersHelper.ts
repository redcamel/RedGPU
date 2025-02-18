const PassPointLightClustersHelper = {
    TILE_COUNT_X: 32,
    TILE_COUNT_Y: 32,
    TILE_COUNT_Z: 48,
    WORKGROUP_SIZE_X: 8,
    WORKGROUP_SIZE_Y: 4,
    WORKGROUP_SIZE_Z: 8,
    MAX_POINT_LIGHTS_PER_CLUSTER: 100,
    MAX_POINT_LIGHTS: 1024,
    getTotalTileSize: () => PassPointLightClustersHelper.TILE_COUNT_X * PassPointLightClustersHelper.TILE_COUNT_Y * PassPointLightClustersHelper.TILE_COUNT_Z,
    getPointLight_ClusterLightsBufferSize: () => {
        const totalTileSize = PassPointLightClustersHelper.getTotalTileSize();
        return (8 * totalTileSize) + (8 * PassPointLightClustersHelper.MAX_POINT_LIGHTS_PER_CLUSTER * totalTileSize) + 4
    },
    getDispatchSize: () => [
        Math.ceil(PassPointLightClustersHelper.TILE_COUNT_X / PassPointLightClustersHelper.WORKGROUP_SIZE_X),
        Math.ceil(PassPointLightClustersHelper.TILE_COUNT_Y / PassPointLightClustersHelper.WORKGROUP_SIZE_Y),
        Math.ceil(PassPointLightClustersHelper.TILE_COUNT_Z / PassPointLightClustersHelper.WORKGROUP_SIZE_Z)
    ]
}
Object.freeze(PassPointLightClustersHelper)
export default PassPointLightClustersHelper
