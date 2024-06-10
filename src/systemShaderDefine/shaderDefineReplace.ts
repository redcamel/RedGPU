import {LightManager} from "../light";
import PassLightClustersHelper from "../light/pointLightCluster/PassLightClustersHelper";
import shaderDefines from "../material/wgsl";

const shaderDefineReplace = (source) => {
    return source
        .replace(
            /#+\bREDGPU_DEFINE_VERTEX_BASE\b/g,
            `#REDGPU_DEFINE_SYSTEM_UNIFORMS`
        )

        .replace(/#+\bREDGPU_DEFINE_SYSTEM_UNIFORMS\b/g, shaderDefines.ShaderDefine_SystemUniforms)
        .replace(/#+\bREDGPU_DEFINE_MODEL_UNIFORMS_STRUCT\b/g, shaderDefines.ShaderDefine_ModelUniformStruct)
        .replace(/#+\bREDGPU_DEFINE_SYSTEM_AMBIENT_DIRECTIONAL_LIGHTS\b/g, shaderDefines.ShaderDefine_SystemAmbientDirectionalLights)
        .replace(/#+\bREDGPU_DEFINE_SYSTEM_CALC_LIGHT_FUNCTIONS\b/g, shaderDefines.ShaderDefine_SystemCalcLightFunctions)
        .replace(/REDGPU_DEFINE_TILE_COUNT_X/g, PassLightClustersHelper.TILE_COUNT_X.toString())
        .replace(/REDGPU_DEFINE_TILE_COUNT_Y/g, PassLightClustersHelper.TILE_COUNT_Y.toString())
        .replace(/REDGPU_DEFINE_TILE_COUNT_Z/g, PassLightClustersHelper.TILE_COUNT_Z.toString())
        .replace(/REDGPU_DEFINE_TOTAL_TILES/g, PassLightClustersHelper.getTotalTileSize().toString())
        .replace(/REDGPU_DEFINE_WORKGROUP_SIZE_X/g, PassLightClustersHelper.WORKGROUP_SIZE_X.toString())
        .replace(/REDGPU_DEFINE_WORKGROUP_SIZE_Y/g, PassLightClustersHelper.WORKGROUP_SIZE_Y.toString())
        .replace(/REDGPU_DEFINE_WORKGROUP_SIZE_Z/g, PassLightClustersHelper.WORKGROUP_SIZE_Z.toString())
        .replace(/REDGPU_DEFINE_WORKGROUP_SIZE_Z/g, PassLightClustersHelper.WORKGROUP_SIZE_Z.toString())
        .replace(/REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTER/g, PassLightClustersHelper.MAX_POINT_LIGHTS_PER_CLUSTER.toString())
        .replace(/REDGPU_CONST_MAX_DIRECTIONAL_LIGHT_NUM/g, LightManager.MAX_DIRECTIONAL_LIGHT_NUM.toString())

}
export default shaderDefineReplace
