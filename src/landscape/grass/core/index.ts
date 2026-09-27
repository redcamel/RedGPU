/**
 * [KO] Landscape 절차적 잔디(Grass) 렌더링 파이프라인의 핵심 인프라 모듈을 제공합니다.
 * [EN] Provides core infrastructure modules for the Landscape procedural grass rendering pipeline.
 *
 * @remarks
 * **[KO]**
 * - `LandscapeGrass`: 개별 잔디 타입 정의 및 지형 타일별 인스턴스 배치 객체입니다.
 * - `GrassBaker`: GPU 컴퓨트 기반 잔디 블레이드 밀도 및 배치 베이킹 엔진입니다.
 * - `GrassMegaBuffer`: Multi-Draw Indirect 호출 및 인스턴스 데이터를 통합 관리하는 대용량 GPU 버퍼입니다.
 * - `GrassCuller`: GPU 컴퓨트 기반 프러스텀 및 HZB 오클루전 컬링 엔진입니다.
 *
 * **[EN]**
 * - `LandscapeGrass`: Defines individual grass types and per-tile instance placement.
 * - `GrassBaker`: GPU compute-based grass blade density and distribution baking engine.
 * - `GrassMegaBuffer`: Unified GPU mega buffer managing Multi-Draw Indirect calls and instance data.
 * - `GrassCuller`: GPU compute-based frustum and HZB occlusion culling engine.
 *
 * @packageDocumentation
 */
import LandscapeGrass, {GrassLODInfo} from "./LandscapeGrass";
import {GrassBaker} from "./baking/GrassBaker";
import {GrassMegaBuffer} from "./buffer/GrassMegaBuffer";
import {GrassCuller} from "./culling/GrassCuller";

export {
    LandscapeGrass,
    GrassBaker,
    GrassMegaBuffer,
    GrassCuller
};

export type {
    GrassLODInfo
};
