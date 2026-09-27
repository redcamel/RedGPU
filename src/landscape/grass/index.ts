/**
 * [KO] Landscape 잔디(Grass) 시스템 모듈입니다.
 * [EN] Grass system module for the Landscape terrain.
 *
 * @remarks
 * **[KO]**
 * - `LandscapeGrassManager`: 잔디 인스턴스 등록 및 LOD, 스트리밍, 바람 시뮬레이션을 총괄 관리합니다.
 * - `Core`: 잔디 엔티티(`LandscapeGrass`), GPU 컴퓨트 베이킹, 메가 버퍼, 프러스텀/HZB 오클루전 컬링 엔진을 제공합니다.
 *
 * **[EN]**
 * - `LandscapeGrassManager`: Orchestrates grass instances, LOD, streaming, and wind simulation.
 * - `Core`: Provides grass entity (`LandscapeGrass`), GPU compute baking, mega buffers, and frustum/HZB occlusion culling engines.
 *
 * @packageDocumentation
 */
export * as Core from "./core";

import LandscapeGrassManager from "./LandscapeGrassManager";
import type {GrassLODConfig, LandscapeGrassOptions} from "./core/LandscapeGrass";

export {
    LandscapeGrassManager
};

export type {
    LandscapeGrassOptions,
    GrassLODConfig
};
