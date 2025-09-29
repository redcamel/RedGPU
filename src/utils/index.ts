import copyGPUBuffer from "./copyGPUBuffer";
import InstanceIdGenerator from "./InstanceIdGenerator";
import createUUID from "./uuid/createUUID";
import uuidToUint from "./uuid/uuidToUint";

/**
 * 빌드시 사라지지않는 console.log
 * @category Log
 */
const keepLog = console.log.bind(console);
export * from "./convertColor";
export * from "./file";
export * from "./math";
export * from "./texture";
export {
	keepLog,
	createUUID,
	uuidToUint,
	copyGPUBuffer,
	InstanceIdGenerator
}


