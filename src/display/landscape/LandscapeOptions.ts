import ABaseMaterial from "../../material/core/ABaseMaterial";

/**
 * [KO] Landscape 지형 시스템 설정을 위한 옵션 인터페이스입니다.
 * [EN] Options interface for configuring the Landscape terrain system.
 */
export interface LandscapeOptions {
    /** [Primary] 전체 지형의 월드 공간 크기 (단일 수치 또는 [worldSizeX, worldSizeZ] 배열 지정 가능, 기본값 8000m) */
    worldSize?: number | [number, number];
    /** [Primary] 전체 지형의 가로/세로 타일 분할 개수 (단일 수치 또는 [tileCountX, tileCountZ] 배열 지정 가능, 기본값 8) */
    tileCount?: number | [number, number];
    /** [Derived Readonly] 단일 타일 크기 (worldSize / tileCount 로 자동 산출되는 파생 수치) */
    tileSize?: number | [number, number];
    /** 타일당 기본 격자 갯수 (기본값 64 -> 64x64 Quads) */
    gridSize?: number;
    /** 전체 LOD 단계 수 (기본값 4 -> LOD 0 ~ LOD 3) */
    lodCount?: number;
    /** 각 LOD 레벨별 전환 임계 거리 비례 배율 배열 (기본값 [1.25, 2.5, 4.25, 7.0, 11.0]) */
    lodMultipliers?: number[];
    /** 각 LOD 레벨별 절대 전환 임계 거리 배열 (월드 공간 단위) */
    lodDistances?: number[];
    /** LOD 시각화 모드용 색상 헥사코드 배열 */
    lodColors?: string[];
    /** 지형에 적용할 기본 머티리얼 (지정하지 않을 경우 기본 ColorMaterial이 자동 사용됩니다) */
    material?: ABaseMaterial;
    /** 와이어프레임 렌더링 여부 (기본값 false) */
    wireframe?: boolean;
    /** LOD 레벨별 시각화 색상 오버레이 디버그 모드 여부 (기본값 false) */
    debugLODColorMode?: boolean;
}

export default LandscapeOptions;
