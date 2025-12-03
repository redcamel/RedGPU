import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import vertexSourcePbrInput from "../../shader/meshVertexPbr_input.wgsl";
import vertexSourcePbrOutput from "../../shader/meshVertexPbr_output.wgsl";
import vertexSourcePbr from "../../shader/meshVertexPbr.wgsl";
import vertexSourceInput from "../../shader/meshVertex_input.wgsl";
import vertexSourceOutput from "../../shader/meshVertex_output.wgsl";
import vertexSource from "../../shader/meshVertex.wgsl";

const SHADER_INFO_PBR = parseWGSL([
    vertexSourcePbrInput,
    vertexSourcePbrOutput,
    vertexSourcePbr,
].join("\n"));

const SHADER_INFO_BASIC = parseWGSL([
    vertexSourceInput,
    vertexSourceOutput,
    vertexSource
].join("\n"));

const SHADER_INFO_ONLY_FRAGMENT_PBR = parseWGSL([
    vertexSourceInput,
    vertexSourcePbrOutput,
    vertexSource,
].join("\n"));

const SHADER_INFO_ONLY_VERTEX_PBR = parseWGSL([
    vertexSourcePbrInput,
    vertexSourceOutput,
    vertexSource,
].join("\n"));
const MESH_SHADER_INFO = {
    SHADER_INFO_PBR,
    SHADER_INFO_BASIC,
    SHADER_INFO_ONLY_FRAGMENT_PBR,
    SHADER_INFO_ONLY_VERTEX_PBR

}
Object.freeze(MESH_SHADER_INFO)
export default MESH_SHADER_INFO