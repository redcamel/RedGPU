import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import vertexModuleSource from "../../shader/meshVertex.wgsl";
import vertexModuleSourcePbr from "../../shader/meshVertexPbr.wgsl";
import createMeshVertexShaderModulePBRSkin from "./createMeshVertexShaderModulePBRSkin";

const VERTEX_SHADER_MODULE_NAME_PBR_SKIN = 'VERTEX_MODULE_MESH_PBR_SKIN'
//
const VERTEX_SHADER_MODULE_NAME_PBR = 'VERTEX_MODULE_MESH_PBR'
const SHADER_INFO_PBR = parseWGSL(vertexModuleSourcePbr);
const UNIFORM_STRUCT_PBR = SHADER_INFO_PBR.uniforms.vertexUniforms;
//
const VERTEX_SHADER_MODULE_NAME_BASIC = 'VERTEX_MODULE_MESH'
const SHADER_INFO_BASIC = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT_BASIC = SHADER_INFO_BASIC.uniforms.vertexUniforms;
const createMeshVertexShaderModule = (mesh: any): GPUShaderModule => {
    const {material} = mesh
    let result: GPUShaderModule
    if (material instanceof PBRMaterial) {
        if (mesh.animationInfo.skinInfo) {
            result = createMeshVertexShaderModulePBRSkin(VERTEX_SHADER_MODULE_NAME_PBR_SKIN, mesh)
        } else result = mesh.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME_PBR, SHADER_INFO_PBR, UNIFORM_STRUCT_PBR, vertexModuleSourcePbr)
    } else {
        if (mesh.createCustomMeshVertexShaderModule) result = mesh.createCustomMeshVertexShaderModule()
        else result = mesh.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME_BASIC, SHADER_INFO_BASIC, UNIFORM_STRUCT_BASIC, vertexModuleSource)
    }
    mesh.currentShaderModuleName = result.label
    return result
}
export default createMeshVertexShaderModule
