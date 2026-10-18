/**
 * [KO] `IndexBuffer`, `StorageBuffer`, `UniformBuffer`, `VertexBuffer`, `GlobalStorageBufferManager` ??GPU 踰꾪띁 由ъ냼?ㅻ? ?쒓났?⑸땲??
 * [EN] Provides GPU buffer resources such as `IndexBuffer`, `StorageBuffer`, `UniformBuffer`, `VertexBuffer`, and `GlobalStorageBufferManager`.
 * @packageDocumentation
 */
import IndexBuffer, {NumberArray} from "./indexBuffer/IndexBuffer";
import StorageBuffer from "./storageBuffer/StorageBuffer";
import UniformBuffer from "./uniformBuffer/UniformBuffer";
import GlobalStorageBufferManager, {BufferSlot} from "./globalStorageBufferManager/GlobalStorageBufferManager";

export * as CoreBuffer from './core'
export * from './vertexBuffer'
export {
    IndexBuffer,
    NumberArray,
    StorageBuffer,
    UniformBuffer,
    GlobalStorageBufferManager,
    BufferSlot
}