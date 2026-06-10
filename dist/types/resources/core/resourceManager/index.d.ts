/**
 * [KO] GPU 리소스를 통합 관리하는 `ResourceManager`와 관련 상태 정보를 제공합니다.
 * [EN] Provides the `ResourceManager`, which integrates and manages GPU resources, and related status information.
 * @packageDocumentation
 */
import ResourceManager, { ImmutableKeyMap, ResourceState, ResourceStateBitmapTexture, ResourceStateCubeTexture, ResourceStateHDRTexture, ResourceStateIndexBuffer, ResourceStateStorageBuffer, ResourceStateUniformBuffer, ResourceStateVertexBuffer } from "./ResourceManager";
import ResourceStatusInfo from "./resourceState/ResourceStatusInfo";
export { ResourceManager, ResourceStatusInfo, ImmutableKeyMap, ResourceState, ResourceStateIndexBuffer, ResourceStateStorageBuffer, ResourceStateUniformBuffer, ResourceStateVertexBuffer, ResourceStateBitmapTexture, ResourceStateCubeTexture, ResourceStateHDRTexture };
