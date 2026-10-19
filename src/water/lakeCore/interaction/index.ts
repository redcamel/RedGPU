/**
 * [KO] 호수 수면 상호작용을 위한 레지스트리(`LakeInteractionRegistry`), 매니저(`LakeInteractionManager`), 침투 깊이 캡처 패스(`LakeCapturePass`), 파동 시뮬레이터(`LakeWaveSimulator`)를 제공합니다.
 * [EN] Provides the registry (`LakeInteractionRegistry`), manager (`LakeInteractionManager`), penetration depth capture pass (`LakeCapturePass`), and wave simulator (`LakeWaveSimulator`) for lake surface interaction.
 * @packageDocumentation
 */
import LakeInteractionRegistry from "./LakeInteractionRegistry";
import LakeInteractionManager, {type LakeActiveMeshEntry} from "./LakeInteractionManager";
import LakeCapturePass from "./LakeCapturePass";
import LakeWaveSimulator from "./LakeWaveSimulator";

export {
    LakeInteractionRegistry,
    LakeInteractionManager,
    LakeCapturePass,
    LakeWaveSimulator
};

export type {
    LakeActiveMeshEntry
};
