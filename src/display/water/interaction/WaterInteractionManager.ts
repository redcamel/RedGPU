import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import {WaterInteractionRegistry} from "./WaterInteractionRegistry";

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
 * [KO] 메쉬별 실시간 모션 추적기 (Zero-GC)
 * [EN] Per-mesh real-time motion tracker (Zero-GC)
 */
class MeshMotionTracker {
    // [0: lastX, 1: lastY, 2: lastZ, 3: speed, 4: stepPhase, 5: stepPulse, 6: footSide]
    readonly data: Float32Array = new Float32Array(7);
    isInitialized: boolean = false;

    get speed(): number {
        return this.data[3];
    }

    get stepPulse(): number {
        return this.data[5];
    }

    get footSide(): number {
        return this.data[6];
    }

    update(x: number, y: number, z: number, dt: number, isStatic: boolean): void {
        const d = this.data;
        if (!this.isInitialized) {
            d[0] = x;
            d[1] = y;
            d[2] = z;
            d[3] = 0; // speed
            d[4] = 0; // stepPhase
            d[5] = 0; // stepPulse
            d[6] = 1.0; // footSide
            this.isInitialized = true;
            return;
        }

        if (isStatic) {
            d[0] = x;
            d[1] = y;
            d[2] = z;
            d[3] = 0;
            d[5] = 0;
            return;
        }

        const safeDt = Math.max(0.0001, dt);
        const vx = (x - d[0]) / safeDt;
        const vy = (y - d[1]) / safeDt;
        const vz = (z - d[2]) / safeDt;
        const rawSpeed = Math.sqrt(vx * vx + vy * vy + vz * vz);
        // 지수 평활을 적용하여 프레임 간 속도 지터 완화
        d[3] = d[3] * 0.4 + rawSpeed * 0.6;
        const speed = d[3];

        // 발걸음 첨벙임 펄스 (Footstep Cadence Pulse) 계산
        if (speed > 0.15) {
            const stepFreq = 1.8 + speed * 0.45;
            let stepPhase = d[4] + stepFreq * Math.PI * 2 * safeDt;
            if (stepPhase > Math.PI * 2) {
                stepPhase -= Math.PI * 2;
            }
            d[4] = stepPhase;
            const cosVal = Math.cos(stepPhase);
            d[5] = Math.pow(Math.abs(cosVal), 8.0);
            d[6] = cosVal >= 0 ? 1.0 : -1.0;
        } else {
            d[5] = Math.max(0, d[5] - safeDt * 5.0);
        }

        d[0] = x;
        d[1] = y;
        d[2] = z;
    }
}

/**
 * [KO] 선언적 물 상호작용 메쉬 자동 수집 및 파동 시뮬레이션 인터랙션 관리자
 * [EN] Manager for collecting declarative water interactive meshes and managing wave interaction
 */
export class WaterInteractionManager {
    readonly redGPUContext: RedGPUContext;
    readonly #motionTrackers: Map<Mesh, MeshMotionTracker> = new Map();

    // 활성 메쉬 수집용 풀링 버퍼 (GC 0바이트)
    readonly #activeMeshBuffer: WaterActiveMeshEntry[] = [];

    constructor(redGPUContext: RedGPUContext) {
        this.redGPUContext = redGPUContext;
    }

    /**
     * [KO] 물 상호작용 등록 메쉬 중 시뮬레이션 도메인 및 수면 부근에 위치한 활성 메쉬들을 수집합니다 (Zero-GC).
     * [EN] Collects active meshes located within simulation domain radius and near water level from registry (Zero-GC).
     */
    collectActiveMeshes(
        dt: number,
        domainCenterX: number,
        domainCenterZ: number,
        domainRadius: number,
        waterLevel: number,
        verticalRange: number = 6.0
    ): WaterActiveMeshEntry[] {
        let count = 0;
        const r2 = domainRadius * domainRadius;
        const meshes = WaterInteractionRegistry.meshes;

        for (const mesh of meshes) {
            if (!mesh.geometry) continue;
            if (mesh.material && mesh.material.opacity <= 0) continue;

            // 월드 좌표 취득 (modelMatrix 기반)
            const m = mesh.modelMatrix;
            const mx = m ? m[12] : mesh.x;
            const my = m ? m[13] : mesh.y;
            const mz = m ? m[14] : mesh.z;

            // 1. 2D 평면 거리 검사
            const dx = mx - domainCenterX;
            const dz = mz - domainCenterZ;
            const distSq = dx * dx + dz * dz;
            if (distSq > r2) continue;

            // 2. 모션 트래커 갱신
            let tracker = this.#motionTrackers.get(mesh);
            if (!tracker) {
                tracker = new MeshMotionTracker();
                this.#motionTrackers.set(mesh, tracker);
            }
            tracker.update(mx, my, mz, dt, mesh.waterInteractionStatic);

            const speed = tracker.speed;
            let stepPulse = tracker.stepPulse;
            const footSide = tracker.footSide;
            let waveStrength = mesh.waterWaveStrength;

            // 3. 지오메트리 AABB 기반 수면 침수(Submersion) 및 수심 판정 (Zero-GC)
            const aabb = mesh.boundingAABB;
            let topY: number;
            let bottomY: number;
            if (aabb) {
                topY = aabb.maxY;
                bottomY = aabb.minY;
            } else {
                bottomY = my;
                topY = my + 1.8;
            }

            // 수직 수면 근접도 검사 (waterLevel 기준 verticalRange 이내)
            if (bottomY > waterLevel + verticalRange || topY < waterLevel - verticalRange) {
                continue;
            }

            const footDepth = waterLevel - bottomY;

            // 전신 완전 잠수 판정 (메시 최상단이 수면 아래로 들어간 경우)
            if (topY < waterLevel) {
                const headSubmergedDepth = waterLevel - topY;
                // 머리가 수면 아래로 0.25m 이상 들어가면 파문 렌더링 스킵
                if (headSubmergedDepth > 0.25) {
                    continue;
                }
                // 0.0 ~ 0.25m 진입 구간에서는 수심에 비례하여 부드럽게 0으로 감쇄
                const subFade = 1.0 - (headSubmergedDepth / 0.25);
                waveStrength *= subFade;
                stepPulse = 0; // 완전 잠수 시 발걸음 첨벙임 펄스 차단
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

        this.#activeMeshBuffer.length = count;

        // 등록 해제된 메쉬의 트래커 메모리 정리
        this.#cleanupTrackers();

        return this.#activeMeshBuffer;
    }

    destroy(): void {
        this.#motionTrackers.clear();
        this.#activeMeshBuffer.length = 0;
    }

    #cleanupTrackers(): void {
        const meshes = WaterInteractionRegistry.meshes;
        if (this.#motionTrackers.size > meshes.size + 16) {
            for (const mesh of this.#motionTrackers.keys()) {
                if (!meshes.has(mesh)) {
                    this.#motionTrackers.delete(mesh);
                }
            }
        }
    }
}
