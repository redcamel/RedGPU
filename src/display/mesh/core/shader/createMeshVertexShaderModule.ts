import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import createMeshVertexShaderModulePBRSkin from "./createMeshVertexShaderModulePBRSkin";
import Mesh from "../../Mesh";
import MESH_SHADER_INFO from "./MESH_SHADER_INFO";

const NAME_SHADER_PBR_SKIN = 'VERTEX_MODULE_MESH_PBR_SKIN';
const NAME_SHADER_PBR = 'VERTEX_MODULE_MESH_PBR';
const NAME_SHADER_BASIC = 'VERTEX_MODULE_MESH';
const NAME_SHADER_ONLY_FRAGMENT_PBR = 'VERTEX_MODULE_MESH_ONLY_FRAGMENT_PBR';
const NAME_SHADER_ONLY_VERTEX_PBR = 'VERTEX_MODULE_MESH_ONLY_VERTEX_PBR';

const {
    SHADER_INFO_PBR,
    SHADER_INFO_BASIC,
    SHADER_INFO_ONLY_FRAGMENT_PBR,
    SHADER_INFO_ONLY_VERTEX_PBR,
} = MESH_SHADER_INFO;

const UNIFORM_STRUCT_PBR = SHADER_INFO_PBR.uniforms.vertexUniforms;
const UNIFORM_STRUCT_BASIC = SHADER_INFO_BASIC.uniforms.vertexUniforms;


const determineShaderConfig = (mesh: Mesh) => {
    const {geometry, material} = mesh;

    const vertexIsPBR = geometry.vertexBuffer.interleavedStruct.label === 'PBR';
    const materialIsPBR = material instanceof PBRMaterial;

    const isPBR = vertexIsPBR && materialIsPBR;
    const isVertexPBR = vertexIsPBR && !materialIsPBR;
    const isFragmentPBR = !vertexIsPBR && materialIsPBR;

    if (isPBR) {
        return {
            name: NAME_SHADER_PBR,
            shaderInfo: SHADER_INFO_PBR,
            source: SHADER_INFO_PBR.defaultSource,
            uniformStruct: UNIFORM_STRUCT_PBR,
        };
    }

    if (isFragmentPBR) {
        return {
            name: NAME_SHADER_ONLY_FRAGMENT_PBR,
            shaderInfo: SHADER_INFO_ONLY_FRAGMENT_PBR,
            source: SHADER_INFO_ONLY_FRAGMENT_PBR.defaultSource,
            uniformStruct: UNIFORM_STRUCT_BASIC,
        };
    }

    if (isVertexPBR) {
        return {
            name: NAME_SHADER_ONLY_VERTEX_PBR,
            shaderInfo: SHADER_INFO_ONLY_VERTEX_PBR,
            source: SHADER_INFO_ONLY_VERTEX_PBR.defaultSource,
            uniformStruct: UNIFORM_STRUCT_BASIC,
        };
    }

    return {
        name: NAME_SHADER_BASIC,
        shaderInfo: SHADER_INFO_BASIC,
        source: SHADER_INFO_BASIC.defaultSource,
        uniformStruct: UNIFORM_STRUCT_BASIC,
    };
};

const createMeshVertexShaderModule = (mesh: Mesh): GPUShaderModule => {
    const {material} = mesh;
    let shaderModule: GPUShaderModule;
    let type = 'basic'
    if (material instanceof PBRMaterial && mesh.animationInfo?.skinInfo) {
        type = 'skin'
    } else if (mesh.createCustomMeshVertexShaderModule) {
        type = 'custom'

    }
    switch (type) {
        case 'basic': {
            const config = determineShaderConfig(mesh);
            shaderModule = mesh.createMeshVertexShaderModuleBASIC(
                config.name,
                config.shaderInfo,
                config.uniformStruct,
                config.source
            );
            break
        }
        case 'skin':
            shaderModule = createMeshVertexShaderModulePBRSkin(
                NAME_SHADER_PBR_SKIN,
                mesh
            );
            break;
        case 'custom':
            shaderModule = mesh.createCustomMeshVertexShaderModule();
            break
    }

    mesh.currentShaderModuleName = shaderModule.label;
    return shaderModule;
};

export default createMeshVertexShaderModule;