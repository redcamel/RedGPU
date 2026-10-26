/**
 * [KO] 리소스 관리를 위한 기본 기반 클래스(`ResourceBase`, `ManagementResourceBase`)와 `ResourceManager`를 제공합니다.
 * [EN] Provides base classes for resource management (`ResourceBase`, `ManagementResourceBase`) and `ResourceManager`.
 * @packageDocumentation
 */
import ManagementResourceBase from "./ManagementResourceBase";
import ResourceBase from "./ResourceBase";

export * from "./resourceManager/index";
export {ManagementResourceBase, ResourceBase}