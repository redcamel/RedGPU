import shaderDefineReplace from "./shaderDefineReplace";
import shaderDefines from "../material/wgsl";

const SHADER_DEFINE = {
	shaderDefineReplace,
	...shaderDefines
}
export {SHADER_DEFINE}
