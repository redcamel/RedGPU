/**
 * [KO] Landscape 절차적 잔디(Grass) 렌더링 파이프라인의 핵심 인프라 모듈을 제공합니다.
 * [EN] Provides core infrastructure modules for the Landscape procedural grass rendering pipeline.
 *
 * @remarks
 * **[KO]**
 * - `Grass`: 개별 잔디 타입 정의 및 지형 타일별 인스턴스 배치 객체입니다.
 * - `GrassInstanceBaker`: GPU 컴퓨트 기반 잔디 블레이드 밀도 및 배치 베이킹 엔진입니다.
 * - `GrassMegaBuffer`: Multi-Draw Indirect 호출 및 인스턴스 데이터를 통합 관리하는 대용량 GPU 버퍼입니다.
 * - `GrassCuller`: GPU 컴퓨트 기반 거리 및 프러스텀 컬링 엔진입니다.
 *
 * **[EN]**
 * - `Grass`: Defines individual grass types and per-tile instance placement.
 * - `GrassInstanceBaker`: GPU compute-based grass blade density and distribution baking engine.
 * - `GrassMegaBuffer`: Unified GPU mega buffer managing Multi-Draw Indirect calls and instance data.
 * - `GrassCuller`: GPU compute-based distance and frustum culling engine.
 *
 * @packageDocumentation
 */
import Grass, {type GrassOptions} from "./Grass";
import {GrassInstanceBaker} from "./baking/GrassInstanceBaker";
import {type GrassDrawSlot, GrassMegaBuffer, type GrassTypeAllocation} from "./buffer/GrassMegaBuffer";
import {GrassCuller} from "./culling/GrassCuller";

export {
    Grass,
    type GrassOptions,
    GrassInstanceBaker,
    GrassMegaBuffer,
    type GrassDrawSlot,
    type GrassTypeAllocation,
    GrassCuller
};
