import Mesh from "../../mesh/Mesh";
import Object3DContainer from "../../mesh/core/Object3DContainer";
import {WaterInteractionOptions} from "./WaterInteractionOptions";

export type WaterInteractiveTarget = Object3DContainer;

/**
 * [KO] 인터랙티브 수면 등록 객체 래퍼
 * [EN] Wrapper for registered interactive water objects
 */
export class WaterInteractionItem {
    readonly target: WaterInteractiveTarget;
    readonly options: WaterInteractionOptions;

    /**
     * [KO] 지오메트리를 보유한 실제 하위 렌더링 메쉬 목록 (평탄화 캐시)
     * [EN] List of actual child rendering meshes possessing geometry (flattened cache)
     */
    readonly flattenedMeshes: Mesh[] = [];

    // 위치 및 속도 추적용 재사용 Float32Array (GC 0바이트)
    readonly lastWorldPos: Float32Array = new Float32Array(3);
    readonly currentWorldPos: Float32Array = new Float32Array(3);
    readonly velocity: Float32Array = new Float32Array(3);
    speed: number = 0;

    /**
     * [KO] 발걸음 위상 (라디안)
     */
    stepPhase: number = 0;

    /**
     * [KO] 발을 딛는 순간의 첨벙임 펄스 강도 (0.0 ~ 1.0)
     */
    stepPulse: number = 0;

    /**
     * [KO] 현재 디디고 있는 발의 좌우 구분 (-1.0: 왼발, +1.0: 오른발)
     */
    footSide: number = 1.0;

    /**
     * [KO] 하위 메쉬들의 AABB로부터 자동 계산된 실제 높이
     */
    computedHeight: number = 1.8;

    /**
     * [KO] 객체의 실제 높이 (미터 단위)
     */
    get objectHeight(): number {
        return this.computedHeight;
    }

    #isFirstFrame: boolean = true;

    constructor(target: WaterInteractiveTarget, options: WaterInteractionOptions = {}) {
        this.target = target;
        this.options = {
            waveStrength: 1.0,
            isStatic: false,
            ...options
        };

        this.refreshHierarchy();
    }

    /**
     * [KO] 하이라키(자식 노드들)를 탐색하여 지오메트리를 가진 모든 하위 메쉬를 평탄화 캐시에 수집합니다.
     * [EN] Traverses hierarchy (children) to collect all child meshes with geometry into flattened cache.
     */
    refreshHierarchy(): void {
        this.flattenedMeshes.length = 0;

        if (this.options.proxyMesh) {
            // 프록시 메쉬가 지정된 경우 프록시만 단독 사용
            this.flattenedMeshes.push(this.options.proxyMesh);
            return;
        }

        const stack: Object3DContainer[] = [this.target];
        const filter = this.options.filter;

        while (stack.length > 0) {
            const current = stack.pop()!;
            if (!current) continue;

            if (current instanceof Mesh && current.geometry) {
                if (!filter || filter(current)) {
                    this.flattenedMeshes.push(current);
                }
            }

            const children = current.children;
            if (children && children.length > 0) {
                const childLen = children.length;
                for (let i = 0; i < childLen; i++) {
                    stack.push(children[i]);
                }
            }
        }
    }

    /**
     * [KO] 매 프레임 위치를 추적하고 속도 벡터를 제자리 갱신합니다 (GC 0바이트).
     * [EN] Tracks position each frame and updates velocity in-place (0 byte GC).
     */
    update(deltaTime: number): void {
        const root = this.target;
        const curr = this.currentWorldPos;
        const last = this.lastWorldPos;
        const vel = this.velocity;

        // 타겟의 월드 좌표 추출 (modelMatrix 기반 월드 좌표 사용)
        const m = root.modelMatrix;
        if (m) {
            curr[0] = m[12];
            curr[1] = m[13];
            curr[2] = m[14];
        } else {
            curr[0] = 0;
            curr[1] = 0;
            curr[2] = 0;
        }

        if (this.#isFirstFrame) {
            last[0] = curr[0];
            last[1] = curr[1];
            last[2] = curr[2];
            vel[0] = 0;
            vel[1] = 0;
            vel[2] = 0;
            this.speed = 0;
            this.#isFirstFrame = false;
            return;
        }

        if (this.options.isStatic) {
            vel[0] = 0;
            vel[1] = 0;
            vel[2] = 0;
            this.speed = 0;
            return;
        }

        const dt = Math.max(0.0001, deltaTime);
        vel[0] = (curr[0] - last[0]) / dt;
        vel[1] = (curr[1] - last[1]) / dt;
        vel[2] = (curr[2] - last[2]) / dt;

        this.speed = Math.sqrt(vel[0] * vel[0] + vel[1] * vel[1] + vel[2] * vel[2]);

        // 발걸음 첨벙임 펄스 (Footstep Cadence Pulse) 계산
        if (this.speed > 0.15) {
            // 속도에 비례한 발걸음 주파수 (걸을 때 ~2.2Hz, 달릴 때 ~3.5Hz)
            const stepFreq = 1.8 + this.speed * 0.45;
            this.stepPhase += stepFreq * Math.PI * 2 * dt;
            if (this.stepPhase > Math.PI * 2) {
                this.stepPhase -= Math.PI * 2;
            }

            const cosVal = Math.cos(this.stepPhase);
            // 발을 딛는 순간(cos의 절대값 8제곱)에 날카로운 충격 피크 펄스 생성
            this.stepPulse = Math.pow(Math.abs(cosVal), 8.0);
            this.footSide = cosVal >= 0 ? 1.0 : -1.0;
        } else {
            this.stepPulse = Math.max(0, this.stepPulse - dt * 5.0);
        }

        last[0] = curr[0];
        last[1] = curr[1];
        last[2] = curr[2];
    }
}
