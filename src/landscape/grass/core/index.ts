/**
 * [KO] Landscape 절차적 잔디(Grass) 렌더링 파이프라인의 핵심 인프라 모듈을 제공합니다.
 * [EN] Provides core infrastructure modules for the Landscape procedural grass rendering pipeline.
 *
 * **[KO]**
 * - `Grass`: 개별 잔디 타입 정의 및 지형 타일별 인스턴스 배치 객체입니다.
 * - `GrassScatterMegaBuffer`: Multi-Draw Indirect 호출 및 인스턴스 데이터를 통합 관리하는 대용량 GPU 버퍼입니다.
 * - `GrassCuller`: GPU 컴퓨트 기반 거리 및 프러스텀 컬링 엔진입니다.
 *
 * **[EN]**
 * - `Grass`: Defines individual grass types and per-tile instance placement.
 * - `GrassScatterMegaBuffer`: Unified GPU mega buffer managing Multi-Draw Indirect calls and instance data.
 * - `GrassCuller`: GPU compute-based distance and frustum culling engine.
 *
 * @packageDocumentation
 */
import Grass, {type GrassOptions} from "./Grass";
import {GrassScatterMegaBuffer} from "./buffer/GrassScatterMegaBuffer";
import {GrassCuller} from "./culling/GrassCuller";
import {GrassRenderer, type GrassTypeMaterialBufferResources} from "./renderer/GrassRenderer";

export {
    // Runtime Classes
    Grass,
    GrassScatterMegaBuffer,
    GrassCuller,
    GrassRenderer,

    // Code Hint Interfaces
    type GrassOptions,
    type GrassTypeMaterialBufferResources
};
