/**
 * [KO] 호수 수면 상호작용을 위한 레지스트리, 매니저, 캡처 패스 및 파동 시뮬레이터를 제공합니다.
 * [EN] Provides the registry, manager, capture pass, and wave simulator for lake surface interaction.
 * @packageDocumentation
 */
import LakeInteractionRegistry from "./LakeInteractionRegistry";
import LakeInteractionManager, { type LakeActiveMeshEntry } from "./LakeInteractionManager";
import LakeCapturePass from "./LakeCapturePass";
import LakeWaveSimulator from "./LakeWaveSimulator";
export { LakeInteractionRegistry, LakeInteractionManager, LakeCapturePass, LakeWaveSimulator };
export type { LakeActiveMeshEntry };
