import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import {WaterInteractionOptions} from "./WaterInteractionOptions";
import {WaterInteractionItem, WaterInteractiveTarget} from "./WaterInteractionItem";

/**
 * [KO] 활성 인터랙션 메쉬 항목 (메쉬 및 파라미터 튜플)
 * [EN] Active interaction mesh entry (mesh and parameters tuple)
 */
export interface WaterActiveMeshEntry {
    mesh: Mesh;
    waveStrength: number;
    speed: number;
    stepPulse: number;
    footSide: number;
}

/**
 * [KO] 호수 인터랙션 객체 등록 및 활성 메쉬 수집 관리자
 * [EN] Manager for registering interactive objects and collecting active meshes for water
 */
export class WaterInteractionManager {
    readonly redGPUContext: RedGPUContext;
    readonly #items: Map<WaterInteractiveTarget, WaterInteractionItem> = new Map();

    // 활성 메쉬 수집용 풀링 버퍼 (GC 0바이트)
    readonly #activeMeshBuffer: WaterActiveMeshEntry[] = [];

    constructor(redGPUContext: RedGPUContext) {
        this.redGPUContext = redGPUContext;
    }

    /**
     * [KO] 등록된 모든 인터랙션 아이템 목록을 반환합니다.
     */
    get items(): IterableIterator<WaterInteractionItem> {
        return this.#items.values();
    }

    /**
     * [KO] 등록된 아이템 개수를 반환합니다.
     */
    get count(): number {
        return this.#items.size;
    }

    /**
     * [KO] 인터랙션 객체를 등록합니다 (하이라키 하위 메쉬 자동 수집).
     * [EN] Registers interactive object (automatically collects child hierarchy meshes).
     */
    addInteractiveObject(target: WaterInteractiveTarget, options?: WaterInteractionOptions): WaterInteractionItem {
        if (this.#items.has(target)) {
            return this.#items.get(target)!;
        }
        const item = new WaterInteractionItem(target, options);
        this.#items.set(target, item);
        return item;
    }

    /**
     * [KO] 등록된 인터랙션 객체를 제거합니다.
     * [EN] Removes registered interactive object.
     */
    removeInteractiveObject(target: WaterInteractiveTarget): boolean {
        return this.#items.delete(target);
    }

    /**
     * [KO] 등록된 모든 인터랙션 객체를 비웁니다.
     * [EN] Clears all registered interactive objects.
     */
    clearInteractiveObjects(): void {
        this.#items.clear();
    }

    /**
     * [KO] 등록된 아이템 래퍼를 조회합니다.
     */
    getItem(target: WaterInteractiveTarget): WaterInteractionItem | undefined {
        return this.#items.get(target);
    }

    /**
     * [KO] 매 프레임 등록된 객체들의 위치 및 속도를 갱신합니다.
     */
    update(deltaTime: number): void {
        for (const item of this.#items.values()) {
            item.update(deltaTime);
        }
    }

    /**
     * [KO] 시뮬레이션 도메인(반경 R) 및 수면 높이 부근에 위치한 활성 하위 메쉬들을 수집합니다 (GC 0바이트).
     * [EN] Collects active child meshes located within simulation domain radius and near water level (0 byte GC).
     */
    collectActiveMeshes(
        domainCenterX: number,
        domainCenterZ: number,
        domainRadius: number,
        waterLevel: number,
        verticalRange: number = 6.0
    ): WaterActiveMeshEntry[] {
        let count = 0;
        const r2 = domainRadius * domainRadius;

        for (const item of this.#items.values()) {
            const meshes = item.flattenedMeshes;
            const meshCount = meshes.length;
            if (meshCount === 0) continue;

            let waveStrength = item.options.waveStrength ?? 1.0;
            const speed = item.speed;
            let stepPulse = item.stepPulse;
            const footSide = item.footSide;

            // 1. 객체의 실시간 지오메트리 AABB 기반 수면 침수(Submersion) 및 수심 판정 (Zero-GC)
            let topY = -Infinity;
            let bottomY = Infinity;

            for (let j = 0; j < meshCount; j++) {
                const aabb = meshes[j].boundingAABB;
                if (aabb.maxY > topY) topY = aabb.maxY;
                if (aabb.minY < bottomY) bottomY = aabb.minY;
            }

            // 바운딩 박스를 취합할 수 없는 예외 상황 fallback
            if (topY === -Infinity || bottomY === Infinity) {
                const rootY = item.currentWorldPos[1];
                bottomY = rootY;
                topY = rootY + 1.8;
            }

            item.computedHeight = Math.max(0.05, topY - bottomY);

            // 실제 객체 최하단 바닥면 기준 수심
            const footDepth = waterLevel - bottomY;

            // 전신 완전 잠수 판정 (객체 최상단이 수면 아래로 들어간 경우)
            if (topY < waterLevel) {
                const headSubmergedDepth = waterLevel - topY;
                // 머리가 수면 아래로 0.25m 이상 깊이 들어가면 수면 파문 완전 차단 (렌더링 스킵)
                if (headSubmergedDepth > 0.25) {
                    continue;
                }
                // 0.0 ~ 0.25m 진입 구간에서는 수심에 비례하여 부드럽게 0으로 감쇄
                const subFade = 1.0 - (headSubmergedDepth / 0.25);
                waveStrength *= subFade;
                stepPulse = 0; // 완전 잠수 시 발걸음 첨벙임 펄스는 완전 차단
            } else if (footDepth > 0.6) {
                // 허리 이상 깊은 물에 들어갔을 때 발걸음 첨벙임 펄스 점진적 감쇄 (0.6m ~ 1.2m 구간)
                const footPulseFade = Math.max(0.0, 1.0 - (footDepth - 0.6) / 0.6);
                stepPulse *= footPulseFade;
            } else if (footDepth < -0.1) {
                // 완전히 물 밖(지상)에 있을 때 수면에 펄스 주입 방지
                stepPulse = 0;
            }

            // 침수 감쇄로 인해 강도가 0이면 렌더링 스킵
            if (waveStrength <= 0.0001) {
                continue;
            }

            for (let i = 0; i < meshCount; i++) {
                const mesh = meshes[i];
                if (mesh.material && mesh.material.opacity <= 0) continue;

                // 월드 좌표는 modelMatrix[12], [13], [14] 사용 (하이라키 하위 메쉬 완벽 지원)
                const m = mesh.modelMatrix;
                const mx = m ? m[12] : mesh.x;
                const my = m ? m[13] : mesh.y;
                const mz = m ? m[14] : mesh.z;

                // 2D 평면 거리 검사
                const dx = mx - domainCenterX;
                const dz = mz - domainCenterZ;
                const distSq = dx * dx + dz * dz;
                if (distSq > r2) continue;

                // 수직 수면 근접도 검사 (waterLevel 기준 verticalRange 이내)
                const dy = Math.abs(my - waterLevel);
                if (dy > verticalRange) continue;

                // 풀에서 항목 가져오기 또는 새로 할당 (GC 0바이트 유지)
                if (count >= this.#activeMeshBuffer.length) {
                    this.#activeMeshBuffer.push({
                        mesh,
                        waveStrength,
                        speed,
                        stepPulse,
                        footSide
                    });
                } else {
                    const entry = this.#activeMeshBuffer[count];
                    entry.mesh = mesh;
                    entry.waveStrength = waveStrength;
                    entry.speed = speed;
                    entry.stepPulse = stepPulse;
                    entry.footSide = footSide;
                }
                count++;
            }
        }

        this.#activeMeshBuffer.length = count;
        return this.#activeMeshBuffer;
    }
}
