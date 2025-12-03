import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import vertexModuleSource from "../../shader/meshVertex.wgsl";
import vertexModuleSourceInput from "../../shader/meshVertex_input.wgsl";
import vertexModuleSourceOutput from "../../shader/meshVertex_output.wgsl";

import vertexModuleSourcePbr from "../../shader/meshVertexPbr.wgsl";
import vertexModuleSourcePbrInput from "../../shader/meshVertexPbr_input.wgsl";
import vertexModuleSourcePbrOutput from "../../shader/meshVertexPbr_output.wgsl";

import createMeshVertexShaderModulePBRSkin from "./createMeshVertexShaderModulePBRSkin";
import Mesh from "../../Mesh";
import {keepLog} from "../../../../utils";

const VERTEX_SHADER_MODULE_NAME_PBR_SKIN = 'VERTEX_MODULE_MESH_PBR_SKIN'
//
const VERTEX_SHADER_MODULE_NAME_PBR = 'VERTEX_MODULE_MESH_PBR'
const SHADER_INFO_PBR = parseWGSL([
    vertexModuleSourcePbrInput,
    vertexModuleSourcePbrOutput,
    vertexModuleSourcePbr,
].join("\n"));
const UNIFORM_STRUCT_PBR = SHADER_INFO_PBR.uniforms.vertexUniforms;
//
const VERTEX_SHADER_MODULE_NAME_BASIC = 'VERTEX_MODULE_MESH'
const SHADER_INFO_BASIC = parseWGSL([
    vertexModuleSourceInput,
    vertexModuleSourceOutput,
    vertexModuleSource
].join("\n"));
const UNIFORM_STRUCT_BASIC = SHADER_INFO_BASIC.uniforms.vertexUniforms;

const VERTEX_SHADER_MODULE_NAME_IN_BASIC_OUT_PBR = 'VERTEX_MODULE_MESH_IN_BASIC_OUT_PBR'
const SHADER_INFO_IN_BASIC_OUT_PBR = parseWGSL([
    vertexModuleSourceInput,
    vertexModuleSourcePbrOutput,
    vertexModuleSource,
].join("\n"));
const VERTEX_SHADER_MODULE_NAME_PBR_OUT_BASIC = 'VERTEX_MODULE_MESH_PBR_OUT_BASIC'
const SHADER_INFO_IN_PBR_OUT_BASIC = parseWGSL([
    vertexModuleSourcePbrInput,
    vertexModuleSourceOutput,
    vertexModuleSource,
].join("\n"));

const createMeshVertexShaderModule = (mesh: any): GPUShaderModule => {
    const {material} = mesh
    let result: GPUShaderModule
    if (material instanceof PBRMaterial) {
        if (mesh.animationInfo.skinInfo) {
            result = createMeshVertexShaderModulePBRSkin(VERTEX_SHADER_MODULE_NAME_PBR_SKIN, mesh)
        } else result = mesh.createMeshVertexShaderModuleBASIC(getVertexModuleSource(mesh).name, getVertexModuleSource(mesh).shaderInfo, UNIFORM_STRUCT_PBR, getVertexModuleSource(mesh).source)
    } else {
        if (mesh.createCustomMeshVertexShaderModule) result = mesh.createCustomMeshVertexShaderModule()
        else result = mesh.createMeshVertexShaderModuleBASIC(getVertexModuleSource(mesh).name, getVertexModuleSource(mesh).shaderInfo, UNIFORM_STRUCT_BASIC, getVertexModuleSource(mesh).source)
    }
    mesh.currentShaderModuleName = result.label
    return result
}

const getVertexModuleSource = (mesh:Mesh)=>{
    const {geometry,material} = mesh
    const vertexIsPBR = geometry.vertexBuffer.interleavedStruct.label === 'PBR';
    const isPbrMaterial = material instanceof PBRMaterial;

    const isPBR = vertexIsPBR && isPbrMaterial;
    const isPBROnyVertex = vertexIsPBR && !isPbrMaterial;
    const isPBROnyFragment = !vertexIsPBR && isPbrMaterial;


    return {
        source : isPBR ? SHADER_INFO_PBR.defaultSource : isPBROnyFragment ? SHADER_INFO_IN_BASIC_OUT_PBR.defaultSource : isPBROnyVertex ? SHADER_INFO_IN_PBR_OUT_BASIC.defaultSource : SHADER_INFO_BASIC.defaultSource,
        shaderInfo : isPBR ? SHADER_INFO_PBR : isPBROnyFragment ? SHADER_INFO_IN_BASIC_OUT_PBR : isPBROnyVertex ? SHADER_INFO_IN_PBR_OUT_BASIC : SHADER_INFO_BASIC,
        name : isPBR ? VERTEX_SHADER_MODULE_NAME_PBR : isPBROnyFragment ? VERTEX_SHADER_MODULE_NAME_IN_BASIC_OUT_PBR : isPBROnyVertex ? VERTEX_SHADER_MODULE_NAME_PBR_OUT_BASIC : VERTEX_SHADER_MODULE_NAME_BASIC,
    }
}
export default createMeshVertexShaderModule
