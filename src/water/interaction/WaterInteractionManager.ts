import RedGPUContext from "../../context/RedGPUContext";
import RedGPUObject from "../../base/RedGPUObject";
import Mesh from "../../display/mesh/Mesh";
import WaterInteractionRegistry from "./WaterInteractionRegistry";

/**
 * [KO] 수면과 상호작용하는 활성 메시의 물리적 파라미터를 담는 인터페이스입니다.
 * [EN] Interface containing physical parameters of an active mesh interacting with the water surface.
 */
export interface WaterActiveMeshEntry {
    /**
     * [KO] 상호작용 대상 Mesh
     * [EN] Target Mesh for interaction
     */
    mesh: Mesh;
    /**
     * [KO] 생성할 물결 파동 세기
     * [EN] Wave strength to generate
     */
    waveStrength: number;
    /**
     * [KO] 메시 이동 속도
     * [EN] Movement speed of the mesh
     */
    speed: number;
    /**
     * [KO] 발자국/걸음 펄스 세기
     * [EN] Footstep/step pulse strength
     */
    stepPulse: number;
    /**
     * [KO] 걸음 좌우측 구분 (-1.0 또는 1.0)
     * [EN] Footstep side indicator (-1.0 or 1.0)
     */
    footSide: number;
}

class MeshMotionTracker {
    data: Float32Array = new Float32Array(7);
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
            d[3] = 0;
            d[4] = 0;
            d[5] = 0;
            d[6] = 1.0;
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
        d[3] = d[3] * 0.4 + rawSpeed * 0.6;
        const speed = d[3];

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

Object.freeze(MeshMotionTracker);

/**
 * [KO] 수면과 충돌/상호작용하는 메시들을 감지하고 파동 파라미터를 수집하는 관리자 클래스입니다.
 * [EN] Manager class that detects meshes colliding/interacting with the water surface and collects wave parameters.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Water
 */
export class WaterInteractionManager extends RedGPUObject {
    #motionTrackers: Map<Mesh, MeshMotionTracker> = new Map();
    #activeMeshBuffer: WaterActiveMeshEntry[] = [];

    /**
     * [KO] WaterInteractionManager 인스턴스를 생성합니다.
     * [EN] Creates an instance of WaterInteractionManager.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] 수면 상호작용 도메인 내의 활성 메시 목록을 수집합니다.
     * [EN] Collects the list of active meshes within the water interaction domain.
     *
     * @param dt -
     * [KO] 델타 시간 (초)
     * [EN] Delta time in seconds
     * @param domainCenterX -
     * [KO] 도메인 중심 X 좌표
     * [EN] Domain center X coordinate
     * @param domainCenterZ -
     * [KO] 도메인 중심 Z 좌표
     * [EN] Domain center Z coordinate
     * @param domainRadius -
     * [KO] 도메인 반경
     * [EN] Domain radius
     * @param waterLevel -
     * [KO] 수면 높이 Y 좌표
     * [EN] Water surface height Y coordinate
     * @param verticalRange -
     * [KO] 수직 검사 범위 (기본값: 6.0)
     * [EN] Vertical check range (default: 6.0)
     * @returns
     * [KO] 활성 메시 엔트리 배열
     * [EN] Array of active mesh entries
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

            const m = mesh.modelMatrix;
            const mx = m ? m[12] : mesh.x;
            const my = m ? m[13] : mesh.y;
            const mz = m ? m[14] : mesh.z;

            const dx = mx - domainCenterX;
            const dz = mz - domainCenterZ;
            const distSq = dx * dx + dz * dz;
            if (distSq > r2) continue;

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

            if (bottomY > waterLevel + verticalRange || topY < waterLevel - verticalRange) {
                continue;
            }

            const footDepth = waterLevel - bottomY;

            if (topY < waterLevel) {
                const headSubmergedDepth = waterLevel - topY;
                if (headSubmergedDepth > 0.25) {
                    continue;
                }
                const subFade = 1.0 - (headSubmergedDepth / 0.25);
                waveStrength *= subFade;
                stepPulse = 0;
            } else if (footDepth > 0.6) {
                const footPulseFade = Math.max(0.0, 1.0 - (footDepth - 0.6) / 0.6);
                stepPulse *= footPulseFade;
            } else if (footDepth < -0.1) {
                stepPulse = 0;
            }

            if (waveStrength <= 0.0001) {
                continue;
            }

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

        this.#cleanupTrackers();

        return this.#activeMeshBuffer;
    }

    /**
     * [KO] WaterInteractionManager 인스턴스를 파괴하고 내부 모션 트래커 및 버퍼를 해제합니다.
     * [EN] Destroys the WaterInteractionManager instance and clears internal motion trackers and buffers.
     */
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

Object.freeze(WaterInteractionManager);

