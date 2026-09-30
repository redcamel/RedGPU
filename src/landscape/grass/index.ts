/**
 * [KO] Landscape 잔디(Grass) 시스템 모듈입니다.
 * [EN] Grass system module for the Landscape terrain.
 *
 * @remarks
 * **[KO]**
 * - `GrassManager`: 잔디 인스턴스 등록 및 Near/Far 렌더링 파이프라인, 스트리밍, 바람 시뮬레이션을 총괄 관리합니다.
 * - `Core`: 잔디 엔티티(`Grass`), GPU 컴퓨트 베이킹, 메가 버퍼, 거리 및 프러스텀 컬링 엔진을 제공합니다.
 *
 * **[EN]**
 * - `GrassManager`: Orchestrates grass instances, Near/Far rendering pipelines, streaming, and wind simulation.
 * - `Core`: Provides grass entity (`Grass`), GPU compute baking, mega buffers, and distance/frustum culling engines.
 *
 * @packageDocumentation
 */
export * as Core from "./core";

import GrassManager from "./GrassManager";
import Grass, {type GrassOptions} from "./core/Grass";

export {
    Grass,
    GrassManager
};

export type {
    GrassOptions
};
