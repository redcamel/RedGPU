/**
 * [KO] `IndexBuffer`, `StorageBuffer`, `UniformBuffer`, `VertexBuffer` 등 다양한 버퍼 리소스를 제공합니다.
 * [EN] Provides various buffer resources such as `IndexBuffer`, `StorageBuffer`, `UniformBuffer`, and `VertexBuffer`.
 * @packageDocumentation
 */
import IndexBuffer, { NumberArray } from "./indexBuffer/IndexBuffer";
import StorageBuffer from "./storageBuffer/StorageBuffer";
import UniformBuffer from "./uniformBuffer/UniformBuffer";
import GlobalStorageBufferManager, { BufferSlot } from "./globalStorageBufferManager/GlobalStorageBufferManager";
export * as CoreBuffer from './core';
export * from './vertexBuffer';
export { IndexBuffer, NumberArray, StorageBuffer, UniformBuffer, GlobalStorageBufferManager, BufferSlot };
