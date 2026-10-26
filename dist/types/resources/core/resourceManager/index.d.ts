/**
 * [KO] GPU 리소스를 통합 관리하는 `ResourceManager` 및 리소스별 상태 클래스를 제공합니다.
 * [EN] Provides `ResourceManager` for integrated GPU resource management and resource-specific state classes.
 * @packageDocumentation
 */
import ResourceManager, { ImmutableKeyMap, ResourceState, ResourceStateBitmapTexture, ResourceStateCubeTexture, ResourceStateHDRTexture, ResourceStateIndexBuffer, ResourceStateStorageBuffer, ResourceStateUniformBuffer, ResourceStateVertexBuffer } from "./ResourceManager";
import ResourceStatusInfo from "./resourceState/ResourceStatusInfo";
export { ResourceManager, ResourceStatusInfo, ImmutableKeyMap, ResourceState, ResourceStateIndexBuffer, ResourceStateStorageBuffer, ResourceStateUniformBuffer, ResourceStateVertexBuffer, ResourceStateBitmapTexture, ResourceStateCubeTexture, ResourceStateHDRTexture };
