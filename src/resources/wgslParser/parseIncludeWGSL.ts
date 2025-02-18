import PassPointLightClustersHelper from "../../light/pointLightCluster/PassPointLightClustersHelper";
import SystemCode from "../systemCode/SystemCode";

const shaderCodeKeys = Object.keys(SystemCode).join('|');
const regexPattern = new RegExp(`#redgpu_include (${shaderCodeKeys})`, 'g');
const parseIncludeWGSL = (code: string) => {
    return code.replace(regexPattern, (match, key) => SystemCode[key] || match)
        .replace(/REDGPU_DEFINE_TILE_COUNT_X/g, PassPointLightClustersHelper.TILE_COUNT_X.toString())
        .replace(/REDGPU_DEFINE_TILE_COUNT_Y/g, PassPointLightClustersHelper.TILE_COUNT_Y.toString())
        .replace(/REDGPU_DEFINE_TILE_COUNT_Z/g, PassPointLightClustersHelper.TILE_COUNT_Z.toString())
        .replace(/REDGPU_DEFINE_TOTAL_TILES/g, PassPointLightClustersHelper.getTotalTileSize().toString())
        .replace(/REDGPU_DEFINE_WORKGROUP_SIZE_X/g, PassPointLightClustersHelper.WORKGROUP_SIZE_X.toString())
        .replace(/REDGPU_DEFINE_WORKGROUP_SIZE_Y/g, PassPointLightClustersHelper.WORKGROUP_SIZE_Y.toString())
        .replace(/REDGPU_DEFINE_WORKGROUP_SIZE_Z/g, PassPointLightClustersHelper.WORKGROUP_SIZE_Z.toString())
        .replace(/REDGPU_DEFINE_WORKGROUP_SIZE_Z/g, PassPointLightClustersHelper.WORKGROUP_SIZE_Z.toString())
        .replace(/REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTER/g, PassPointLightClustersHelper.MAX_POINT_LIGHTS_PER_CLUSTER.toString());
}
export default parseIncludeWGSL;
