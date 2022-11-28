import ShaderDefine_SystemUniforms from './ShaderDefine_SystemUniforms.wgsl'
import ShaderDefine_ModelUniformStruct from './ShaderDefine_ModelUniformStruct.wgsl'
import ShaderDefine_SystemAmbientDirectionalLights from './ShaderDefine_SystemAmbientDirectionalLights.wgsl'
import ShaderDefine_SystemPointLights from './ShaderDefine_SystemPointLights.wgsl'
import ShaderDefine_PointLightCluster from './ShaderDefine_PointLightCluster.wgsl'
import ShaderDefine_PointLightClusterLightGroup from './ShaderDefine_PointLightClusterLightGroup.wgsl'
import ShaderDefine_SystemCalcLightFunctions from './ShaderDefine_SystemCalcLightFunctions.wgsl'

/**
 *
 * @type {{ShaderDefine_PointLightClusterLightGroup: *, ShaderDefine_SystemCalcLightFunctions: *, ShaderDefine_SystemPointLights: *, ShaderDefine_PointLightCluster: *, ShaderDefine_ModelUniformStruct: *, ShaderDefine_SystemUniforms: *, ShaderDefine_SystemAmbientDirectionalLights: *}}
 */
const ShaderDefine = {
	ShaderDefine_SystemUniforms: ShaderDefine_SystemUniforms,
	ShaderDefine_ModelUniformStruct,
	ShaderDefine_SystemAmbientDirectionalLights,
	ShaderDefine_SystemPointLights,
	ShaderDefine_PointLightCluster,
	ShaderDefine_PointLightClusterLightGroup,
	ShaderDefine_SystemCalcLightFunctions
}
export default ShaderDefine