import ResourceState from "../../resourceManager/resourceState/ResourceState";
import ResourceStateIndexBuffer from "../../resourceManager/resourceState/ResourceStateIndexBuffer";
import ResourceStateStorageBuffer from "../../resourceManager/resourceState/ResourceStateStorageBuffer";
import ResourceStateUniformBuffer from "../../resourceManager/resourceState/ResourceStateUniformBuffer";
import ResourceStateVertexBuffer from "../../resourceManager/resourceState/ResourceStateVertexBuffer";

const findCacheBufferInTable = (targetResourceManagedState: ResourceState, cacheKey: string):
    ResourceStateIndexBuffer | ResourceStateVertexBuffer | ResourceStateUniformBuffer | ResourceStateStorageBuffer
    | undefined => {
    if (!cacheKey) return undefined;
    let result: ResourceStateIndexBuffer | ResourceStateVertexBuffer | ResourceStateUniformBuffer | ResourceStateStorageBuffer
    const table = targetResourceManagedState.table
    for (const k in table) {
        if (table[k].label === cacheKey) {
            result = table[k]
            break
        }
    }
    return result;
}
export default findCacheBufferInTable
