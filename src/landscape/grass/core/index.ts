/**
 * [KO] 절차적 잔디(Grass) 시스템의 핵심 내부 클래스, 베이킹, 컬링 및 렌더링 구성 요소를 제공하는 코어 모듈입니다.
 * [EN] Core module providing core internal classes, baking, culling, and rendering components for the procedural grass system.
 * @packageDocumentation
 */
import Grass, {type GrassOptions} from "./Grass";
import GrassMegaBuffer from "./buffer/GrassMegaBuffer";
import GrassInstanceBaker from "./baking/GrassInstanceBaker";
import GrassCuller from "./culling/GrassCuller";
import GrassRenderer from "./renderer/GrassRenderer";
import GrassSlotPooler from "./buffer/GrassSlotPooler";

export {
    Grass,
    GrassMegaBuffer,
    GrassInstanceBaker,
    GrassCuller,
    GrassRenderer,
    GrassSlotPooler,

    type GrassOptions
};
