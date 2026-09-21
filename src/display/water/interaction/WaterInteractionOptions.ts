import Mesh from "../../mesh/Mesh";

/**
 * [KO] 인터랙티브 수면 객체 등록 옵션 인터페이스
 * [EN] Interface for interactive water object registration options
 */
export interface WaterInteractionOptions {
    /**
     * [KO] 물결 파동 충격량 배율 (기본값: 1.0)
     * [EN] Wave impulse multiplier (Default: 1.0)
     */
    waveStrength?: number;

    /**
     * [KO] 수면 접촉 반경 가중치 (기본값: 1.0)
     * [EN] Radius scale for water surface contact (Default: 1.0)
     */
    radiusScale?: number;

    /**
     * [KO] 정적 객체 여부 (기본값: false, true일 경우 이동 속도 계산 생략)
     * [EN] Whether the object is static (Default: false, skips velocity calculation if true)
     */
    isStatic?: boolean;

    /**
     * [KO] 복잡한 하이라키 대신 수면 상호작용 전용으로 사용할 간이 프록시 메쉬 (지정 시 하위 순회 대체)
     * [EN] Simplified proxy mesh for water interaction (replaces child hierarchy traversal if specified)
     */
    proxyMesh?: Mesh;

    /**
     * [KO] 하위 메쉬 중 특정 파츠를 인터랙션에서 제외할 필터 콜백
     * [EN] Filter callback to exclude specific child meshes from interaction
     */
    filter?: (mesh: Mesh) => boolean;

    /**
     * [KO] 객체의 높이 (미터 단위, 수중 완전 잠수 판정 및 감쇄에 사용, 기본값: 1.8m)
     * [EN] Object height (in meters, used for full submersion detection and attenuation, default: 1.8m)
     */
    objectHeight?: number;
}
