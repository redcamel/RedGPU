/**
 * [KO] `IndexBuffer`, `StorageBuffer`, `UniformBuffer`, `VertexBuffer`, `GlobalStorageBufferManager` 등 GPU 버퍼 리소스를 제공합니다.
 * [EN] Provides GPU buffer resources such as `IndexBuffer`, `StorageBuffer`, `UniformBuffer`, `VertexBuffer`, and `GlobalStorageBufferManager`.
 * @packageDocumentation
 */
import IndexBuffer, { NumberArray } from "./indexBuffer/IndexBuffer";
import StorageBuffer from "./storageBuffer/StorageBuffer";
import UniformBuffer from "./uniformBuffer/UniformBuffer";
import GlobalStorageBufferManager, { BufferSlot } from "./globalStorageBufferManager/GlobalStorageBufferManager";
export * as CoreBuffer from './core';
export * from './vertexBuffer';
export { IndexBuffer, NumberArray, StorageBuffer, UniformBuffer, GlobalStorageBufferManager, BufferSlot };
