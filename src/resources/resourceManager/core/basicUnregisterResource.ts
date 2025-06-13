import ManagedResourceBase from "../../ManagedResourceBase";

const basicUnregisterResource = (target: ManagedResourceBase) => {
	const {uuid, targetResourceManagedState} = target
	const {table} = targetResourceManagedState
	if (table[uuid]) {
		// @ts-ignore
		targetResourceManagedState.videoMemory -= target.size // TODO 이걸 먹여야할것 같은데...
		delete table[uuid]
		targetResourceManagedState.length--
	}
}
export default basicUnregisterResource
