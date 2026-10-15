/**
 * [KO] 지형(Landscape)의 공간 분할 그리드, 타일 컴포넌트, 스트리밍 및 GPU 컬링 관련 모듈을 제공합니다.
 * [EN] Provides spatial partitioning grid, tile components, streaming, and GPU culling modules for Landscape.
 *
 * @packageDocumentation
 */
import LandscapeComponent from "./LandscapeComponent";
import LandscapeSpatialGrid from "./LandscapeSpatialGrid";
import type {LandscapeTileUrlResolver} from "./LandscapeTileStreamer";

export {
    LandscapeComponent,
    LandscapeSpatialGrid
};

export type {
    LandscapeTileUrlResolver
};
