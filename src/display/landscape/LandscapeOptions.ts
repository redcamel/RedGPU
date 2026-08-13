import LandscapeMaterial from "./LandscapeMaterial";

/**
 * [KO] Landscape 지형 생성 옵션 인터페이스입니다.
 * [EN] Landscape terrain creation options interface.
 */
export interface LandscapeOptions {
    /**
     * [KO] 전체 지형 월드 XZ 크기 (기본값: 8000). 단일 수치 또는 [worldSizeX, worldSizeZ] 배열 형태
     * [EN] Total terrain world XZ size (default: 8000). Single number or [worldSizeX, worldSizeZ] array
     */
    worldSize?: number | [number, number];

    /**
     * [KO] 타일 개수 (기본값: 8x8). 단일 수치 또는 [tileCountX, tileCountZ] 배열 형태 (최소 1, 최대 32 타일)
     * [EN] Tile count (default: 8x8). Single number or [tileCountX, tileCountZ] array (min 1, max 32 tiles)
     */
    tileCount?: number | [number, number];

    /**
     * [KO] 단일 타일 XZ 크기. 지정 시 worldSize 자동 계산
     * [EN] Single tile XZ size. If specified, worldSize is calculated automatically
     */
    tileSize?: number | [number, number];

    /**
     * [KO] 타일 당 최고 해상도 Quad Grid 크기 (기본값: LANDSCAPE_BASE_GRID_SIZE.QUAD_63)
     * [EN] Base Quad Grid size per tile for LOD 0 (default: LANDSCAPE_BASE_GRID_SIZE.QUAD_63)
     */
    gridSize?: number;

    /**
     * [KO] LOD 레벨 단계 수 (기본값: 4, 최소 1 ~ 최대 8)
     * [EN] Number of LOD levels (default: 4, min 1 to max 8)
     */
    lodCount?: number;

    /**
     * [KO] LOD 디버그 표시용 HEX 색상 코드 팔레트 배열
     * [EN] Array of HEX color codes for LOD debug display
     */
    lodColors?: string[];

    /**
     * [KO] LOD 전환 스케일 승수 배열 (기본값: [1.25, 2.5, 4.25, 7.0, 11.0, 16.0, 24.0])
     * [EN] LOD transition scale multiplier array (default: [1.25, 2.5, 4.25, 7.0, 11.0, 16.0, 24.0])
     */
    lodMultipliers?: number[];

    /**
     * [KO] LOD 전환 제곱 거리 임계값 배열 (수동 지정 시 적용)
     * [EN] LOD transition distance thresholds array
     */
    lodDistances?: number[];

    /**
     * [KO] 지형 전용 머티리얼 (기본값: 기본 녹색 LandscapeMaterial)
     * [EN] Terrain material (default: default green LandscapeMaterial)
     */
    material?: LandscapeMaterial;

    /**
     * [KO] 와이어프레임 표시 여부 (기본값: false)
     * [EN] Whether to display wireframe (default: false)
     */
    wireframe?: boolean;

    /**
     * [KO] LOD 디버그 색상 모드 활성화 여부 (기본값: false)
     * [EN] Whether to enable LOD debug color mode (default: false)
     */
    debugLODColorMode?: boolean;
}

export default LandscapeOptions;
