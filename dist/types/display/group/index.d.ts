/**
 * [KO] 객체들을 계층적으로 그룹화하고 통합 변환을 적용할 수 있는 그룹 시스템을 제공합니다.
 * [EN] Provides a group system for hierarchically grouping objects and applying integrated transformations.
 *
 * [KO] 3D 및 2D 환경에서 사용할 수 있는 그룹 노드를 통해 복잡한 씬 구조를 효율적으로 구성하고 관리할 수 있습니다.
 * [EN] You can efficiently organize and manage complex scene structures through group nodes available in both 3D and 2D environments.
 *
 * @packageDocumentation
 */
import Group2D from "./Group2D";
import Group3D from "./Group3D";
export * as CoreGroup from './core';
export { Group2D, Group3D };
