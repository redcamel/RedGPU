/**
 * [KO] Landscape 식생(Foliage) 시스템 모듈입니다.
 * [EN] Foliage system module for the Landscape terrain.
 *
 * @remarks
 * **[KO]**
 * - `FoliageManager`: 대규모 식생(나무, 수풀 등) 인스턴스 등록 및 LOD, HZB 오클루전 컬링을 총괄 관리합니다.
 * - `Core`: 식생 엔티티(`Foliage`), GPU 메가 버퍼, 3D 옥타헤드럴 임포스터 베이커 및 공간 분할 엔진을 제공합니다.
 *
 * **[EN]**
 * - `FoliageManager`: Orchestrates foliage instances, LOD, and HZB occlusion culling.
 * - `Core`: Provides foliage entity (`Foliage`), GPU mega buffers, 3D octahedral impostor baking, and spatial partitioning engines.
 *
 * @packageDocumentation
 */
export * as Core from "./core";

import FoliageManager from "./FoliageManager";
import Foliage, {type FoliageLODConfig, type FoliageLODInfo, type FoliageOptions} from "./core/Foliage";

export {
    Foliage,
    FoliageManager
};

export type {
    FoliageOptions,
    FoliageLODConfig,
    FoliageLODInfo
};
