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

const RAD_TO_DEG = 180.0 / Math.PI;

/**
 * FoliageType
 * 개별 식생 종(Species)의 지오메트리, PBR 머티리얼, 인스턴싱 버퍼, 경사각/레이어 필터 및 파퓰레이션 관리
 */
export class FoliageType {
    readonly redGPUContext: RedGPUContext;
    readonly options: Required<FoliageTypeOptions>;
    readonly instanceBuffer: FoliageInstanceBuffer;

    foliageManager?: any;
    #activeInstanceCount: number = 0;
    #bottomOffset: number | null = null;

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

    #lastPopulatedCamX: number = NaN;
    #lastPopulatedCamZ: number = NaN;
    #lastPopulatedRadius: number = 1500;

    get isPopulated(): boolean {
        return this.#activeInstanceCount > 0;
    }

    /**
     * [KO] 지정된 월드 영역 내에 무작위 위치/스케일/회전으로 식생 인스턴스를 자동 파퓰레이션합니다. (경사각 필터링 탑재)
     */
    populateRandomInstances(
        count: number,
        bounds?: { minX: number; minZ: number; maxX: number; maxZ: number },
        getHeightAt?: (x: number, z: number) => number
    ): void {
        let targetBounds = bounds;
        if (!targetBounds) {
            const landscape = this.foliageManager?.landscape;
            if (landscape) {
                const worldSize = landscape.worldSize;
                if (worldSize && worldSize[0] > 0 && worldSize[1] > 0) {
                    const halfX = worldSize[0] * 0.5;
                    const halfZ = worldSize[1] * 0.5;
                    targetBounds = {minX: -halfX, minZ: -halfZ, maxX: halfX, maxZ: halfZ};
                }
            }
        }
        if (!targetBounds) {
            targetBounds = {minX: -1000, minZ: -1000, maxX: 1000, maxZ: 1000};
        }

        const heightFn = getHeightAt || ((x: number, z: number) => this.foliageManager?.landscape?.getHeightAt(x, z) ?? 0);
        const maxLimit = Math.min(count, this.options.maxInstances);
        const {minScale, maxScale, randomRotationY, minSlope, maxSlope} = this.options;
        const rangeX = targetBounds.maxX - targetBounds.minX;
        const rangeZ = targetBounds.maxZ - targetBounds.minZ;

        const scaleDiffX = maxScale[0] - minScale[0];
        const scaleDiffY = maxScale[1] - minScale[1];
        const scaleDiffZ = maxScale[2] - minScale[2];

        // 지오메트리 Bounding Box 분석을 통한 하단 바닥 오프셋 자동 추출 (캐싱 활용)
        const bottomOffset = this.getGeometryBottomOffset();

        let spawnedCount = 0;
        let attempts = 0;
        const maxAttempts = maxLimit * 3; // 경사각 필터링 시도 한계

        while (spawnedCount < maxLimit && attempts < maxAttempts) {
            attempts++;
            const posX = targetBounds.minX + Math.random() * rangeX;
            const posZ = targetBounds.minZ + Math.random() * rangeZ;

            const scaleX = minScale[0] + Math.random() * scaleDiffX;
            const scaleY = minScale[1] + Math.random() * scaleDiffY;
            const scaleZ = minScale[2] + Math.random() * scaleDiffZ;

            // ⚡ Y 고도는 GPU Compute Shader에서 vhtAtlasTexture를 100% 자동 샘플링하므로 초기값 0으로 간결 세팅
            const posY = 0.0;

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
        this.updateIndirectBuffer();
    }

    /**
     * [KO] 언리얼 엔진 스타일: 카메라 현재 위치 (camX, camZ) 주변 반경(radius) 내에 집중 파퓰레이션합니다.
     */
    populateAroundCamera(
        count: number,
        camX: number,
        camZ: number,
        radius: number = 1500,
        getHeightAt?: (x: number, z: number) => number
    ): void {
        const bounds = {
            minX: camX - radius,
            maxX: camX + radius,
            minZ: camZ - radius,
            maxZ: camZ + radius,
        };

        this.#lastPopulatedCamX = camX;
        this.#lastPopulatedCamZ = camZ;
        this.#lastPopulatedRadius = radius;

        this.populateRandomInstances(count, bounds, getHeightAt);
    }

    /**
     * [KO] 카메라 위치 이동 거리가 thresholdDistance를 초과할 경우 카메라 주변으로 인스턴스를 백그라운드 재배치(Endless Rolling Stream)합니다.
     */
    checkCameraTracking(camX: number, camZ: number, count: number, thresholdDistance: number = 300, radius?: number): boolean {
        if (isNaN(this.#lastPopulatedCamX)) return false;

        const dx = camX - this.#lastPopulatedCamX;
        const dz = camZ - this.#lastPopulatedCamZ;
        const distSq = dx * dx + dz * dz;

        if (distSq >= thresholdDistance * thresholdDistance) {
            const useRadius = radius ?? this.#lastPopulatedRadius;
            this.populateAroundCamera(count, camX, camZ, useRadius);
            return true;
        }
        return false;
    }

    /**
     * [KO] 식생 지오메트리 카운트 및 activeInstanceCount 정보를 바탕으로 Indirect Draw Command Buffer 갱신
     */
    updateIndirectBuffer(): void {
        const geometry = this.mesh?.geometry;
        if (!geometry) return;
        const count = geometry.indexBuffer ? geometry.indexBuffer.indexCount : (geometry.vertexBuffer ? geometry.vertexBuffer.vertexCount : 0);
        this.instanceBuffer.resetIndirectCount(count);
    }

    /**
     * 지오메트리 버텍스 버퍼를 분석하여 메시의 바닥(Bottom Y Base) 피봇 오프셋을 산출합니다. (최초 1회만 스캔)
     */
    getGeometryBottomOffset(): number {
        if (this.#bottomOffset !== null) return this.#bottomOffset;

        const geometry = this.options.mesh?.geometry;
        if (!geometry || !geometry.vertexBuffer) {
            this.#bottomOffset = 0.0;
            return 0.0;
        }

        const vertexBuffer = geometry.vertexBuffer;
        const data = (vertexBuffer as any).data || (vertexBuffer as any).typedArray || (vertexBuffer as any).dataBuffer;
        const stride = (vertexBuffer as any).stride || 12; // 12 floats per vertex

        if (!data || data.length === 0) {
            this.#bottomOffset = 0.0;
            return 0.0;
        }

        let minY = Infinity;
        const vertexCount = vertexBuffer.vertexCount || Math.floor(data.length / stride);

        for (let i = 0; i < vertexCount; i++) {
            const y = data[i * stride + 1];
            if (y < minY) {
                minY = y;
            }
        }

        const calculated = (minY !== Infinity && !isNaN(minY)) ? -minY : 0.0;
        this.#bottomOffset = calculated;
        return calculated;
    }

    /**
     * 지형 수치 미분을 통해 위치 (x, z)에서의 경사각(Slope Angle in degrees)을 정밀 계산합니다.
     */
    #getSlopeAngleAt(x: number, z: number, getHeightAt: (x: number, z: number) => number, hCenter: number): number {
        const hRight = getHeightAt(x + 1.0, z);
        const hForward = getHeightAt(x, z + 1.0);

        const dzdx = hRight - hCenter;
        const dzdz = hForward - hCenter;

        const gradient = Math.sqrt(dzdx * dzdx + dzdz * dzdz);
        return Math.atan(gradient) * RAD_TO_DEG;
    }

    destroy(): void {
        this.instanceBuffer.destroy();
    }
}
