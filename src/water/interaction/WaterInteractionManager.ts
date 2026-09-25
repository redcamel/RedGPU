import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import {WaterInteractionRegistry} from "./WaterInteractionRegistry";

export interface WaterActiveMeshEntry {
    mesh: Mesh;
    waveStrength: number;
    speed: number;
    stepPulse: number;
    footSide: number;
}

class MeshMotionTracker {
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

export class WaterInteractionManager {
    readonly redGPUContext: RedGPUContext;
    readonly #motionTrackers: Map<Mesh, MeshMotionTracker> = new Map();

    readonly #activeMeshBuffer: WaterActiveMeshEntry[] = [];

    constructor(redGPUContext: RedGPUContext) {
        this.redGPUContext = redGPUContext;
    }

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
