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
    foamGeneration: number;
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
    private readonly _items: Map<WaterInteractiveTarget, WaterInteractionItem> = new Map();

    // 활성 메쉬 수집용 풀링 버퍼 (GC 0바이트)
    private readonly _activeMeshBuffer: WaterActiveMeshEntry[] = [];

    constructor(redGPUContext: RedGPUContext) {
        this.redGPUContext = redGPUContext;
    }

    /**
     * [KO] 등록된 모든 인터랙션 아이템 목록을 반환합니다.
     */
    get items(): IterableIterator<WaterInteractionItem> {
        return this._items.values();
    }

    /**
     * [KO] 등록된 아이템 개수를 반환합니다.
     */
    get count(): number {
        return this._items.size;
    }

    /**
     * [KO] 인터랙션 객체를 등록합니다 (하이라키 하위 메쉬 자동 수집).
     * [EN] Registers interactive object (automatically collects child hierarchy meshes).
     */
    addInteractiveObject(target: WaterInteractiveTarget, options?: WaterInteractionOptions): WaterInteractionItem {
        if (this._items.has(target)) {
            return this._items.get(target)!;
        }
        const item = new WaterInteractionItem(target, options);
        this._items.set(target, item);
        return item;
    }

    /**
     * [KO] 등록된 인터랙션 객체를 제거합니다.
     * [EN] Removes registered interactive object.
     */
    removeInteractiveObject(target: WaterInteractiveTarget): boolean {
        return this._items.delete(target);
    }

    /**
     * [KO] 등록된 모든 인터랙션 객체를 비웁니다.
     * [EN] Clears all registered interactive objects.
     */
    clearInteractiveObjects(): void {
        this._items.clear();
    }

    /**
     * [KO] 등록된 아이템 래퍼를 조회합니다.
     */
    getItem(target: WaterInteractiveTarget): WaterInteractionItem | undefined {
        return this._items.get(target);
    }

    /**
     * [KO] 매 프레임 등록된 객체들의 위치 및 속도를 갱신합니다.
     */
    update(deltaTime: number): void {
        for (const item of this._items.values()) {
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

        for (const item of this._items.values()) {
            const meshes = item.flattenedMeshes;
            const meshCount = meshes.length;
            const waveStrength = item.options.waveStrength ?? 1.0;
            const foamGeneration = item.options.foamGeneration ?? 1.0;
            const speed = item.speed;
            const stepPulse = item.stepPulse;
            const footSide = item.footSide;

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
                if (count >= this._activeMeshBuffer.length) {
                    this._activeMeshBuffer.push({
                        mesh,
                        waveStrength,
                        foamGeneration,
                        speed,
                        stepPulse,
                        footSide
                    });
                } else {
                    const entry = this._activeMeshBuffer[count];
                    entry.mesh = mesh;
                    entry.waveStrength = waveStrength;
                    entry.foamGeneration = foamGeneration;
                    entry.speed = speed;
                    entry.stepPulse = stepPulse;
                    entry.footSide = footSide;
                }
                count++;
            }
        }

        this._activeMeshBuffer.length = count;
        return this._activeMeshBuffer;
    }
}
