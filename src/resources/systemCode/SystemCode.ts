import SystemFragmentCode from "./shader/fragment";
import SYSTEM_UNIFORM from './shader/SYSTEM_UNIFORM.wgsl'
import SystemVertexCode from "./shader/vertex";

const SystemCode = Object.freeze({
	SYSTEM_UNIFORM,
	...SystemVertexCode,
	...SystemFragmentCode,
})
Object.freeze(SystemCode)
export default SystemCode

