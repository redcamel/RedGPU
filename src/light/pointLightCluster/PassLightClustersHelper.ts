const PassLightClustersHelper = {
	TILE_COUNT_X: 32,
	TILE_COUNT_Y: 32,
	TILE_COUNT_Z: 128,
	WORKGROUP_SIZE_X: 4,
	WORKGROUP_SIZE_Y: 4,
	WORKGROUP_SIZE_Z: 16,
	MAX_POINT_LIGHTS_PER_CLUSTER: 32,
	getTotalTileSize: () => PassLightClustersHelper.TILE_COUNT_X * PassLightClustersHelper.TILE_COUNT_Y * PassLightClustersHelper.TILE_COUNT_Z,
	getClusterLightBufferSize: () => {
		const totalTileSize = PassLightClustersHelper.getTotalTileSize();
		return (8 * totalTileSize) + (8 * PassLightClustersHelper.MAX_POINT_LIGHTS_PER_CLUSTER * totalTileSize) + 4
	},
	getDispatchSize: () => [
		Math.ceil(PassLightClustersHelper.TILE_COUNT_X / PassLightClustersHelper.WORKGROUP_SIZE_X),
		Math.ceil(PassLightClustersHelper.TILE_COUNT_Y / PassLightClustersHelper.WORKGROUP_SIZE_Y),
		Math.ceil(PassLightClustersHelper.TILE_COUNT_Z / PassLightClustersHelper.WORKGROUP_SIZE_Z)
	]
}
Object.freeze(PassLightClustersHelper)
export default PassLightClustersHelper
