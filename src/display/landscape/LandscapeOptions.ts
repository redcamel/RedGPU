/**
 * [KO] Landscape 지형 시스템 설정을 위한 옵션 인터페이스입니다.
 * [EN] Options interface for configuring the Landscape terrain system.
 */
export interface LandscapeOptions {
    /** [KO] 전체 지형의 가로/세로 타일 개수 (기본값 4 -> 4x4 타일) [EN] Number of tiles per row/column (default 4) */
    tileCount?: number;
    /** [KO] 단일 타일 크기 (월드 공간 단위, 기본값 1000) [EN] Size of a single tile in world units (default 1000) */
    tileSize?: number;
    /** [KO] 타일당 기본 격자 갯수 (기본값 64 -> 64x64 Quads) [EN] Base grid size per tile (default 64) */
    gridSize?: number;
    /** [KO] 전체 LOD 단계 수 (기본값 4 -> LOD 0 ~ LOD 3) [EN] Total number of LOD levels (default 4) */
    lodCount?: number;
    /** [KO] 각 LOD 레벨별 전환 임계 거리 배열 (월드 공간 단위) [EN] Array of distance thresholds for LOD transitions */
    lodDistances?: number[];
    /** [KO] 와이어프레임 렌더링 여부 (기본값 false) [EN] Whether wireframe mode is enabled (default false) */
    wireframe?: boolean;
    /** [KO] LOD 레벨별 시각화 색상 오버레이 디버그 모드 여부 (기본값 false) [EN] Whether LOD color overlay debug mode is enabled (default false) */
    debugLODColorMode?: boolean;
}

export default LandscapeOptions;
