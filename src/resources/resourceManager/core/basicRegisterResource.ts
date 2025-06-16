import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import ManagedResourceBase from "../../ManagedResourceBase";
import ResourceStateBitmapTexture from "../resourceState/ResourceStateBitmapTexture";
import ResourceStateCubeTexture from "../resourceState/ResourceStateCubeTexture";
import ResourceStateCubeTextureFromSphericalSky from "../resourceState/ResourceStateCubeTextureFromSphericalSky";
import ResourceStateIndexBuffer from "../resourceState/ResourceStateIndexBuffer";
import ResourceStateStorageBuffer from "../resourceState/ResourceStateStorageBuffer";
import ResourceStateUniformBuffer from "../resourceState/ResourceStateUniformBuffer";
import ResourceStateVertexBuffer from "../resourceState/ResourceStateVertexBuffer";

const basicRegisterResource = (
	target: ManagedResourceBase,
	resourceState: ResourceStateVertexBuffer
		| ResourceStateIndexBuffer
		| ResourceStateUniformBuffer
		| ResourceStateStorageBuffer
		| ResourceStateCubeTexture
		| ResourceStateBitmapTexture
		| ResourceStateCubeTextureFromSphericalSky
) => {
	const {uuid, targetResourceManagedState} = target
	const textureYn = resourceState instanceof ResourceStateCubeTexture || resourceState instanceof ResourceStateBitmapTexture
	try {
		// 이미 등록된 버퍼인지 체크
		if (targetResourceManagedState.table[uuid]) {
			consoleAndThrowError(`Buffer with UUID ${uuid} is already registered.`);
		}
		// 중복이 아니므로 버퍼 추가
		targetResourceManagedState.table[uuid] = resourceState
		targetResourceManagedState.length++;
		if (textureYn) {
			// @ts-ignore
			// targetResourceManagedState.videoMemory += target. // TODO 이걸 먹여야할것 같은데...
		} else {
			// @ts-ignore
			targetResourceManagedState.videoMemory += target.size // TODO 이걸 먹여야할것 같은데...
		}
	} catch (error) {
		consoleAndThrowError(error.message);
	}
}
export default basicRegisterResource
