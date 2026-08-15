import RedGPUContext from '../../../context/RedGPUContext';
import Mesh from '../../mesh/Mesh';
import {FoliageInstanceBuffer} from './FoliageInstanceBuffer';

export interface FoliageTypeOptions {
    name: string;
    mesh: Mesh;
    maxInstances?: number;

    // 지형 레이어 & 경사각 마스킹 필터
    targetLayerName?: string;               // 연동할 LandscapeLayer 이름
    minLayerWeight?: number;                // 최소 레이어 가중치 (0.0~1.0, 기본: 0.2)
    minSlope?: number;                      // 생장 최소 경사각(°) (기본: 0)
    maxSlope?: number;                      // 생장 최대 경사각(°) (기본: 30)

    // Culling & Fade Out
    cullingDistance?: number;               // 시선 최장 표시 거리 (m, 기본: 200)
    fadeStartDistance?: number;             // 소멸 축소 시작 거리 (m, 기본: 150)

    minScale?: [number, number, number];
    maxScale?: [number, number, number];
    randomRotationY?: boolean;
}

/**
 * FoliageType
 * 개별 식생 종(Species)의 지오메트리, PBR 머티리얼, 인스턴싱 버퍼, 경사각/레이어 필터 및 파퓰레이션 관리
 */
export class FoliageType {
    readonly redGPUContext: RedGPUContext;
    readonly options: Required<FoliageTypeOptions>;
    readonly instanceBuffer: FoliageInstanceBuffer;

    #activeInstanceCount: number = 0;

    constructor(redGPUContext: RedGPUContext, options: FoliageTypeOptions) {
        this.redGPUContext = redGPUContext;
        this.options = {
            name: options.name,
            mesh: options.mesh,
            maxInstances: options.maxInstances ?? 50000,
            targetLayerName: options.targetLayerName ?? '',
            minLayerWeight: options.minLayerWeight ?? 0.2,
            minSlope: options.minSlope ?? 0.0,
            maxSlope: options.maxSlope ?? 30.0,
            cullingDistance: options.cullingDistance ?? 2000.0,
            fadeStartDistance: options.fadeStartDistance ?? 1500.0,
            minScale: options.minScale ?? [1.0, 1.0, 1.0],
            maxScale: options.maxScale ?? [1.0, 1.0, 1.0],
            randomRotationY: options.randomRotationY ?? true,
        };

        this.instanceBuffer = new FoliageInstanceBuffer(redGPUContext, this.options.maxInstances);
    }

    get mesh(): Mesh {
        return this.options.mesh;
    }

    get activeInstanceCount(): number {
        return this.#activeInstanceCount;
    }

    /**
     * [KO] 지정된 월드 영역 내에 무작위 위치/스케일/회전으로 식생 인스턴스를 자동 파퓰레이션합니다. (경사각 필터링 탑재)
     */
    populateRandomInstances(
        count: number,
        bounds: { minX: number; minZ: number; maxX: number; maxZ: number },
        getHeightAt?: (x: number, z: number) => number
    ): void {
        const maxLimit = Math.min(count, this.options.maxInstances);
        const {minScale, maxScale, randomRotationY, minSlope, maxSlope} = this.options;
        const rangeX = bounds.maxX - bounds.minX;
        const rangeZ = bounds.maxZ - bounds.minZ;

        const scaleDiffX = maxScale[0] - minScale[0];
        const scaleDiffY = maxScale[1] - minScale[1];
        const scaleDiffZ = maxScale[2] - minScale[2];

        // 지오메트리 Bounding Box 분석을 통한 하단 바닥 오프셋 자동 추출
        const bottomOffset = this.#getGeometryBottomOffset();

        let spawnedCount = 0;
        let attempts = 0;
        const maxAttempts = maxLimit * 3; // 경사각 필터링 시도 한계

        while (spawnedCount < maxLimit && attempts < maxAttempts) {
            attempts++;
            const posX = bounds.minX + Math.random() * rangeX;
            const posZ = bounds.minZ + Math.random() * rangeZ;

            // 경사각(Slope) 필터 검사
            if (getHeightAt && (minSlope > 0 || maxSlope < 90)) {
                const slopeAngle = this.#getSlopeAngleAt(posX, posZ, getHeightAt);
                if (slopeAngle < minSlope || slopeAngle > maxSlope) {
                    continue; // 생장 조건을 벗어나는 경사면 거름
                }
            }

            const scaleX = minScale[0] + Math.random() * scaleDiffX;
            const scaleY = minScale[1] + Math.random() * scaleDiffY;
            const scaleZ = minScale[2] + Math.random() * scaleDiffZ;

            const terrainY = getHeightAt ? getHeightAt(posX, posZ) : 0;
            // 지형 고도 Y + 개별 스케일에 비례한 지오메트리 밑바닥 자동 피봇 안착!
            const posY = terrainY + bottomOffset * scaleY;

            let rotX = 0, rotY = 0, rotZ = 0, rotW = 1;
            if (randomRotationY) {
                const angle = Math.random() * Math.PI * 2;
                rotY = Math.sin(angle * 0.5);
                rotW = Math.cos(angle * 0.5);
            }

            this.instanceBuffer.setInstanceData(spawnedCount, posX, posY, posZ, rotX, rotY, rotZ, rotW, scaleX, scaleY, scaleZ, 1.0, 0);
            spawnedCount++;
        }

        this.#activeInstanceCount = spawnedCount;
        this.instanceBuffer.uploadToGPU(spawnedCount);
    }

    /**
     * [KO] VHT 타일 로딩 완료 시 배치된 식생 인스턴스들의 Y 고도를 지형 표면에 정밀 재동기화합니다.
     */
    realignHeights(getHeightAt?: (x: number, z: number) => number): void {
        const activeCount = this.#activeInstanceCount;
        if (activeCount <= 0 || !getHeightAt) return;

        const data = this.instanceBuffer.dataBuffer;
        const stride = this.instanceBuffer.strideFloats;

        // 지오메트리 Bounding Box 분석을 통한 하단 바닥 오프셋 자동 추출
        const bottomOffset = this.#getGeometryBottomOffset();

        for (let i = 0; i < activeCount; i++) {
            const offset = i * stride;
            const posX = data[offset];
            const posZ = data[offset + 2];
            const scaleY = data[offset + 8];

            const terrainY = getHeightAt(posX, posZ);
            // 지형 고도 Y + 개별 스케일에 비례한 지오메트리 밑바닥 자동 피봇 안착!
            data[offset + 1] = terrainY + bottomOffset * scaleY;
        }

        this.instanceBuffer.uploadToGPU(activeCount);
    }

    /**
     * 지오메트리 버텍스 버퍼를 분석하여 메시의 바닥(Bottom Y Base) 피봇 오프셋을 100% 자동 산출합니다.
     */
    #getGeometryBottomOffset(): number {
        const geometry = this.options.mesh?.geometry;
        if (!geometry || !geometry.vertexBuffer) return 0.0;

        const vertexBuffer = geometry.vertexBuffer;
        const data = (vertexBuffer as any).data || (vertexBuffer as any).typedArray || (vertexBuffer as any).dataBuffer;
        const stride = (vertexBuffer as any).stride || 12; // 12 floats per vertex

        if (!data || data.length === 0) return 0.0;

        let minY = Infinity;
        const vertexCount = vertexBuffer.vertexCount || Math.floor(data.length / stride);

        for (let i = 0; i < vertexCount; i++) {
            const y = data[i * stride + 1];
            if (y < minY) {
                minY = y;
            }
        }

        return (minY !== Infinity && !isNaN(minY)) ? -minY : 0.0;
    }

    /**
     * 지형 수치 미분을 통해 위치 (x, z)에서의 경사각(Slope Angle in degrees)을 정밀 계산합니다.
     */
    #getSlopeAngleAt(x: number, z: number, getHeightAt: (x: number, z: number) => number): number {
        const delta = 1.0; // 1m 샘플링 갭
        const hCenter = getHeightAt(x, z);
        const hRight = getHeightAt(x + delta, z);
        const hForward = getHeightAt(x, z + delta);

        const dzdx = (hRight - hCenter) / delta;
        const dzdz = (hForward - hCenter) / delta;

        const gradient = Math.sqrt(dzdx * dzdx + dzdz * dzdz);
        const slopeRadians = Math.atan(gradient);
        return (slopeRadians * 180.0) / Math.PI; // Degree 변환
    }

    destroy(): void {
        this.instanceBuffer.destroy();
    }
}
