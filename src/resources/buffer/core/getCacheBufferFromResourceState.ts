import IndexBuffer from "../indexBuffer/IndexBuffer";
import StorageBuffer from "../storageBuffer/StorageBuffer";
import UniformBuffer from "../uniformBuffer/UniformBuffer";
import VertexBuffer from "../vertexBuffer/VertexBuffer";
import findCacheBufferInTable from "./findCacheBufferInTable";

const getCacheBufferFromResourceState =
	(target: VertexBuffer | UniformBuffer | StorageBuffer | IndexBuffer,
	 cacheKey: string
	): VertexBuffer | UniformBuffer | StorageBuffer | IndexBuffer => {
		const {targetResourceManagedState} = target
		const t0 = findCacheBufferInTable(targetResourceManagedState, cacheKey)
		return t0 ? targetResourceManagedState.table[target.uuid].buffer : null
	}
export default getCacheBufferFromResourceState
