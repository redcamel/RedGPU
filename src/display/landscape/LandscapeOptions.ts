import LandscapeMaterial from "./LandscapeMaterial";

/**
 * [KO] Landscape 지형 생성 옵션 인터페이스입니다 (UE5 공식 프로퍼티 표준 단일 적용).
 * [EN] Landscape terrain creation options interface (Strict UE5 official property standard).
 */
export interface LandscapeOptions {
    /**
     * [KO] 전체 지형 월드 XZ 크기 (기본값: 8000). 단일 수치 또는 [worldSizeX, worldSizeZ] 배열 형태
     * [EN] Total terrain world XZ size (default: 8000). Single number or [worldSizeX, worldSizeZ] array
     */
    worldSize?: number | [number, number];

    /**
     * [KO] UE5 공식 컴포넌트 개수 (기본값: 8x8). 단일 수치 또는 [countX, countZ] 배열 형태 (최소 1, 최대 32 컴포넌트)
     * [EN] UE5 official component count (default: 8x8). Single number or [countX, countZ] array (min 1, max 32 components)
     */
    componentCount?: number | [number, number];

    /**
     * [KO] 단일 컴포넌트 XZ 크기. 지정 시 worldSize 자동 계산
     * [EN] Single component XZ size. If specified, worldSize is calculated automatically
     */
    tileSize?: number | [number, number];

    /**
     * [KO] UE5 공식 컴포넌트 쿼드 그리드 해상도 (기본값: LANDSCAPE_BASE_GRID_SIZE.QUAD_63)
     * [EN] UE5 official component quad grid size (default: LANDSCAPE_BASE_GRID_SIZE.QUAD_63)
     */
    componentSizeQuads?: number;

    /**
     * [KO] UE5 공식 최대 LOD 레벨 단계 수 (기본값: 4, 최소 1 ~ 최대 8)
     * [EN] UE5 official max LOD level count (default: 4, min 1 to max 8)
     */
    maxLODLevel?: number;

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
     * [KO] UE5 공식 지형 머티리얼 (기본값: 기본 녹색 LandscapeMaterial)
     * [EN] UE5 official landscape material (default: default green LandscapeMaterial)
     */
    landscapeMaterial?: LandscapeMaterial;

    /**
     * [KO] UE5 공식 지형 고도 변위 스케일 (미터 단위, 기본값: 500.0)
     * [EN] UE5 official height displacement scale in meters (default: 500.0)
     */
    heightScale?: number;

    /**
     * [KO] 타일 URL 생성기 콜백 함수
     * [EN] Tile URL resolver callback function
     */
    tileUrlResolver?: (row: number, col: number) => string;

    /**
     * [KO] 동적 타일 로딩 시야 반경 (미터 단위, 기본값: 2500.0)
     * [EN] Dynamic tile loading radius in meters (default: 2500.0)
     */
    loadingRadius?: number;

    /**
     * [KO] 와이어프레임 표시 여부 (기본값: false)
     * [EN] Wireframe display flag (default: false)
     */
    wireframe?: boolean;

    /**
     * [KO] LOD 색상 디버그 모드 활성화 여부 (기본값: false)
     * [EN] LOD Coloration mode flag (default: false)
     */
    lodColoration?: boolean;
}

export default LandscapeOptions;
