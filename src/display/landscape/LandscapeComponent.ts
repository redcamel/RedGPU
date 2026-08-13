import RedGPUContext from "../../context/RedGPUContext";
import LandscapeSharedGeometry from "./LandscapeSharedGeometry";

/**
 * [KO] SpatialGrid의 단일 공간 셀(타일) 단위를 관리하는 경량 공간 데이터 클래스입니다.
 * [EN] Lightweight spatial data class managing a single spatial cell (tile) unit of SpatialGrid.
 */
export class LandscapeComponent {
    #worldX: number = 0;
    #worldZ: number = 0;
    #prevWorldX: number = 0;
    #prevWorldZ: number = 0;
    #componentX: number = 0;
    #componentZ: number = 0;
    #lodLevel: number = 0;

    /**
     * [KO] LandscapeComponent 인스턴스를 생성합니다.
     * [EN] Creates an instance of LandscapeComponent.
     */
    constructor(
        redGPUContext: RedGPUContext,
        sharedGeometry: LandscapeSharedGeometry,
        worldX: number,
        worldZ: number,
        material: any,
        wireframe: boolean = false,
        componentX: number = 0,
        componentZ: number = 0
    ) {
        this.#worldX = worldX;
        this.#worldZ = worldZ;
        this.#prevWorldX = worldX;
        this.#prevWorldZ = worldZ;
        this.#componentX = componentX;
        this.#componentZ = componentZ;
    }

    get worldX(): number {
        return this.#worldX;
    }

    set worldX(val: number) {
        this.#prevWorldX = this.#worldX;
        this.#worldX = val;
    }

    get worldZ(): number {
        return this.#worldZ;
    }

    set worldZ(val: number) {
        this.#prevWorldZ = this.#worldZ;
        this.#worldZ = val;
    }

    get prevWorldX(): number {
        return this.#prevWorldX;
    }

    get prevWorldZ(): number {
        return this.#prevWorldZ;
    }

    get componentX(): number {
        return this.#componentX;
    }

    set componentX(val: number) {
        this.#componentX = val;
    }

    get componentZ(): number {
        return this.#componentZ;
    }

    set componentZ(val: number) {
        this.#componentZ = val;
    }

    updateSharedGeometry(sharedGeometry: LandscapeSharedGeometry): void {
        // Shared geometry update notification if needed
    }

    /**
     * [KO] 프레임 종료 후 이전 월드 위치를 현재 위치로 안전하게 업데이트합니다 (Mesh prevModelMatrix 동기화와 100% 동일).
     */
    updatePrevPosition(): void {
        this.#prevWorldX = this.#worldX;
        this.#prevWorldZ = this.#worldZ;
    }

    get lodLevel(): number {
        return this.#lodLevel;
    }

    set lodLevel(val: number) {
        this.#lodLevel = val;
    }
}

export default LandscapeComponent;
