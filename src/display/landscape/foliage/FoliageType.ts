import RedGPUContext from '../../../context/RedGPUContext';
import Mesh from '../../mesh/Mesh';
import {FoliageInstanceBuffer} from './FoliageInstanceBuffer';

export interface FoliageTypeOptions {
    name: string;
    mesh: Mesh;                             // 식생 3D 메시 (Grass, Tree, Rock 등 범용 Mesh)
    densityPer100m2?: number;               // 100m² 당 인스턴스 생성 밀도 (기본: 20)
    maxInstances?: number;                  // 최대 할당 인스턴스 버퍼 수 (기본: 50,000)

    minScale?: [number, number, number];    // 최소 스케일
    maxScale?: [number, number, number];    // 최대 스케일
    randomRotationY?: boolean;              // Y축 무작위 회전 적용 여부 (기본: true)

    // 지형 레이어 마스킹 필터
    targetLayerName?: string;               // 연동할 LandscapeLayer 이름
    minLayerWeight?: number;                // 최소 레이어 가중치 (0.0~1.0, 기본: 0.2)
    minSlope?: number;                      // 생장 최소 경사각(°) (기본: 0)
    maxSlope?: number;                      // 생장 최대 경사각(°) (기본: 30)

    // Culling & Fade Out
    cullingDistance?: number;               // 시선 최장 표시 거리 (m, 기본: 200)
    fadeStartDistance?: number;             // 소멸 축소 시작 거리 (m, 기본: 150)
}

/**
 * FoliageType
 * 단일 식생 종(Species) 메타데이터 및 Instance Buffer 관리자
 */
export class FoliageType {
    readonly name: string;
    readonly mesh: Mesh;
    readonly options: Required<FoliageTypeOptions>;
    readonly instanceBuffer: FoliageInstanceBuffer;

    constructor(redGPUContext: RedGPUContext, options: FoliageTypeOptions) {
        this.name = options.name;
        this.mesh = options.mesh;

        // Default Options 병합
        this.options = {
            name: options.name,
            mesh: options.mesh,
            densityPer100m2: options.densityPer100m2 ?? 20,
            maxInstances: options.maxInstances ?? 50000,
            minScale: options.minScale ?? [0.8, 0.8, 0.8],
            maxScale: options.maxScale ?? [1.2, 1.2, 1.2],
            randomRotationY: options.randomRotationY ?? true,
            targetLayerName: options.targetLayerName ?? '',
            minLayerWeight: options.minLayerWeight ?? 0.2,
            minSlope: options.minSlope ?? 0,
            maxSlope: options.maxSlope ?? 30,
            cullingDistance: options.cullingDistance ?? 200,
            fadeStartDistance: options.fadeStartDistance ?? 150,
        };

        this.instanceBuffer = new FoliageInstanceBuffer(redGPUContext, this.options.maxInstances);
    }

    private _activeInstanceCount: number = 0;

    get activeInstanceCount(): number {
        return this._activeInstanceCount;
    }

    setActiveInstanceCount(count: number): void {
        this._activeInstanceCount = Math.min(count, this.options.maxInstances);
    }

    /**
     * 임의의 범위 내에 무작위 식생 인스턴스 배치 세팅 (Zero-GC)
     */
    populateRandomInstances(
        count: number,
        bounds: { minX: number; minZ: number; maxX: number; maxZ: number },
        getHeightAt?: (x: number, z: number) => number
    ): void {
        const targetCount = Math.min(count, this.options.maxInstances);
        const {minScale, maxScale, randomRotationY} = this.options;

        const rangeX = bounds.maxX - bounds.minX;
        const rangeZ = bounds.maxZ - bounds.minZ;

        const scaleDiffX = maxScale[0] - minScale[0];
        const scaleDiffY = maxScale[1] - minScale[1];
        const scaleDiffZ = maxScale[2] - minScale[2];

        for (let i = 0; i < targetCount; i++) {
            const posX = bounds.minX + Math.random() * rangeX;
            const posZ = bounds.minZ + Math.random() * rangeZ;
            const posY = getHeightAt ? getHeightAt(posX, posZ) : 0;

            // Y축 회전 쿼터니언 계산 (Quat: [0, sin(theta/2), 0, cos(theta/2)])
            let rotX = 0, rotY = 0, rotZ = 0, rotW = 1;
            if (randomRotationY) {
                const angle = Math.random() * Math.PI * 2;
                rotY = Math.sin(angle * 0.5);
                rotW = Math.cos(angle * 0.5);
            }

            const scaleX = minScale[0] + Math.random() * scaleDiffX;
            const scaleY = minScale[1] + Math.random() * scaleDiffY;
            const scaleZ = minScale[2] + Math.random() * scaleDiffZ;

            // Float32Array 버퍼에 직접 세팅
            this.instanceBuffer.setInstanceData(
                i,
                posX, posY, posZ,
                rotX, rotY, rotZ, rotW,
                scaleX, scaleY, scaleZ,
                1.0, // initial fade
                0    // subId
            );
        }

        this.setActiveInstanceCount(targetCount);
        this.instanceBuffer.uploadToGPU(targetCount);
    }

    /**
     * [KO] VHT 타일 로딩 완료 시 배치된 식생 인스턴스들의 Y 고도를 최신 지형 고도 및 heightScale에 정밀 재동기화합니다.
     */
    realignHeights(getHeightAt?: (x: number, z: number) => number): void {
        const activeCount = this.activeInstanceCount;
        if (activeCount <= 0) return;

        const data = this.instanceBuffer.dataBuffer;
        const stride = this.instanceBuffer.strideFloats;

        for (let i = 0; i < activeCount; i++) {
            const offset = i * stride;
            const posX = data[offset];
            const posZ = data[offset + 2];

            if (getHeightAt) {
                data[offset + 1] = getHeightAt(posX, posZ);
            }
        }

        this.instanceBuffer.uploadToGPU(activeCount);
    }

    destroy(): void {
        this.instanceBuffer.destroy();
    }
}
