import ShaderDefine_ModelUniformStruct from './ShaderDefine_ModelUniformStruct.wgsl'
import ShaderDefine_SystemAmbientDirectionalLights from './ShaderDefine_SystemAmbientDirectionalLights.wgsl'
import ShaderDefine_SystemCalcLightFunctions from './ShaderDefine_SystemCalcLightFunctions.wgsl'
import ShaderDefine_SystemUniforms from './ShaderDefine_SystemUniforms.wgsl'

const ShaderDefine = {
	ShaderDefine_SystemUniforms: ShaderDefine_SystemUniforms,
	ShaderDefine_ModelUniformStruct,
	ShaderDefine_SystemAmbientDirectionalLights,
	ShaderDefine_SystemCalcLightFunctions
}
export default ShaderDefine
