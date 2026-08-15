import RedGPUContext from '../../../context/RedGPUContext';
import Mesh from '../../mesh/Mesh';
import {FoliageInstanceBuffer} from './FoliageInstanceBuffer';

export interface FoliageTypeOptions {
    name: string;
    mesh: Mesh;
    maxInstances?: number;

    // Culling & Fade Out
    cullingDistance?: number;               // 시선 최장 표시 거리 (m, 기본: 2000)
    fadeStartDistance?: number;             // 소멸 축소 시작 거리 (m, 기본: 1500)

    minScale?: [number, number, number];
    maxScale?: [number, number, number];
    randomRotationY?: boolean;
}

/**
 * FoliageType
 * 개별 식생 종(Species)의 지오메트리, PBR 머티리얼, 인스턴싱 버퍼 및 파퓰레이션 관리
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

    #streamingTask: {
        targetCount: number;
        spawnedCount: number;
        minX: number;
        maxX: number;
        minZ: number;
        maxZ: number;
        chunkSize: number;
    } | null = null;

    #loadedTileKeys: Set<string> = new Set();

    get isStreaming(): boolean {
        return this.#streamingTask !== null;
    }

    /**
     * [KO] 지형 타일(LandscapeComponent) 1개가 로딩 완수되었을 때 해당 타일 영역 식생(0.75MB)만 부분 업로드합니다.
     */
    populateTile(comp: any, targetCountPerTile?: number): void {
        const key = `${comp.componentZ}_${comp.componentX}`;
        if (this.#loadedTileKeys.has(key)) return;
        this.#loadedTileKeys.add(key);

        const landscape = this.foliageManager?.landscape;
        const compCountX = landscape?.componentCount?.[0] ?? 8;
        const totalTiles = compCountX * compCountX;

        // 타일별 배치 인스턴스 수 (예: 1,000,000 / 64 = 타일당 ~15,625개)
        const countForThisTile = targetCountPerTile ?? Math.floor(this.options.maxInstances / totalTiles);
        if (countForThisTile <= 0) return;

        const tileSizeMeters = comp.componentSizeQuads || ((landscape && landscape.worldSize) ? landscape.worldSize[0] / compCountX : 1000);
        const halfTile = tileSizeMeters * 0.5;

        const minX = comp.worldX - halfTile;
        const maxX = comp.worldX + halfTile;
        const minZ = comp.worldZ - halfTile;
        const maxZ = comp.worldZ + halfTile;

        const startIdx = this.#activeInstanceCount;
        const endIdx = Math.min(startIdx + countForThisTile, this.options.maxInstances);
        const actualCount = endIdx - startIdx;
        if (actualCount <= 0) return;

        const {minScale, maxScale, randomRotationY} = this.options;
        const rangeX = maxX - minX;
        const rangeZ = maxZ - minZ;

        const scaleDiffX = maxScale[0] - minScale[0];
        const scaleDiffY = maxScale[1] - minScale[1];
        const scaleDiffZ = maxScale[2] - minScale[2];

        for (let i = 0; i < actualCount; i++) {
            const idx = startIdx + i;
            const posX = minX + Math.random() * rangeX;
            const posZ = minZ + Math.random() * rangeZ;

            const scaleX = minScale[0] + Math.random() * scaleDiffX;
            const scaleY = minScale[1] + Math.random() * scaleDiffY;
            const scaleZ = minScale[2] + Math.random() * scaleDiffZ;

            const posY = 0.0;

            let rotX = 0, rotY = 0, rotZ = 0, rotW = 1;
            if (randomRotationY) {
                const angle = Math.random() * Math.PI * 2;
                rotY = Math.sin(angle * 0.5);
                rotW = Math.cos(angle * 0.5);
            }

            this.instanceBuffer.setInstanceData(idx, posX, posY, posZ, rotX, rotY, rotZ, rotW, scaleX, scaleY, scaleZ, 1.0, 0);
        }

        this.#activeInstanceCount += actualCount;

        // 해당 타일 영역 식생(0.75MB)만 GPU 버퍼 부분 위치로 업로드
        this.instanceBuffer.uploadRangeToGPU(startIdx, actualCount);
        this.updateIndirectBuffer();
    }

    /**
     * [KO] Landscape 지형 전체 영역(World Size)에 식생 인스턴스를 1회성으로 배치합니다. (GPU Compute Culling 전담 아키텍처)
     */
    populateWorld(count?: number, chunkSize?: number): void {
        const targetCount = count ?? this.options.maxInstances;
        const landscape = this.foliageManager?.landscape;
        let bounds = {minX: -4000, minZ: -4000, maxX: 4000, maxZ: 4000};
        if (landscape && landscape.worldSize && landscape.worldSize[0] > 0 && landscape.worldSize[1] > 0) {
            const halfX = landscape.worldSize[0] * 0.5;
            const halfZ = landscape.worldSize[1] * 0.5;
            bounds = {minX: -halfX, minZ: -halfZ, maxX: halfX, maxZ: halfZ};
        }
        this.populateRandomInstances(targetCount, bounds, undefined, chunkSize);
    }

    /**
     * [KO] 지정된 월드 영역 내에 시분할(Time-Sliced Chunked) 방식으로 식생 인스턴스를 백그라운드 미세 분산 파퓰레이션합니다. (chunkSize: 5000 = 0.24MB/frame, 0 = 즉시 100% 동기 생성)
     */
    populateRandomInstances(
        count: number,
        bounds?: { minX: number; minZ: number; maxX: number; maxZ: number },
        getHeightAt?: (x: number, z: number) => number,
        chunkSize: number = 5000
    ): void {
        let targetBounds = bounds;
        const landscape = this.foliageManager?.landscape;
        if (landscape && landscape.worldSize && landscape.worldSize[0] > 0 && landscape.worldSize[1] > 0) {
            const halfX = landscape.worldSize[0] * 0.5;
            const halfZ = landscape.worldSize[1] * 0.5;
            if (targetBounds) {
                targetBounds = {
                    minX: Math.max(-halfX, targetBounds.minX),
                    maxX: Math.min(halfX, targetBounds.maxX),
                    minZ: Math.max(-halfZ, targetBounds.minZ),
                    maxZ: Math.min(halfZ, targetBounds.maxZ),
                };
            } else {
                targetBounds = {minX: -halfX, minZ: -halfZ, maxX: halfX, maxZ: halfZ};
            }
        }
        if (!targetBounds) {
            targetBounds = {minX: -1000, minZ: -1000, maxX: 1000, maxZ: 1000};
        }

        const maxLimit = Math.min(count, this.options.maxInstances);
        this.#activeInstanceCount = 0;

        const effectiveChunkSize = chunkSize > 0 ? chunkSize : maxLimit;

        this.#streamingTask = {
            targetCount: maxLimit,
            spawnedCount: 0,
            minX: targetBounds.minX,
            maxX: targetBounds.maxX,
            minZ: targetBounds.minZ,
            maxZ: targetBounds.maxZ,
            chunkSize: effectiveChunkSize
        };

        // 최초 1번째 청크(예: 5,000개 = 0.24MB) 즉시 렌더링 디스패치 (로딩 지연 0ms)
        this.processStreamingChunk();
    }

    /**
     * [Zero-GC Chunk Streaming] 매 프레임 지정된 청크 크기(예: 50,000개 = 2.4MB)만큼 미세 분산 연산 및 GPU 업로드
     */
    processStreamingChunk(): boolean {
        if (!this.#streamingTask) return false;

        const task = this.#streamingTask;
        const {targetCount, chunkSize, minX, maxX, minZ, maxZ} = task;
        let spawnedCount = task.spawnedCount;

        const endCount = Math.min(spawnedCount + chunkSize, targetCount);
        const {minScale, maxScale, randomRotationY} = this.options;
        const rangeX = maxX - minX;
        const rangeZ = maxZ - minZ;

        const scaleDiffX = maxScale[0] - minScale[0];
        const scaleDiffY = maxScale[1] - minScale[1];
        const scaleDiffZ = maxScale[2] - minScale[2];

        const startIdx = spawnedCount;

        while (spawnedCount < endCount) {
            const posX = minX + Math.random() * rangeX;
            const posZ = minZ + Math.random() * rangeZ;

            const scaleX = minScale[0] + Math.random() * scaleDiffX;
            const scaleY = minScale[1] + Math.random() * scaleDiffY;
            const scaleZ = minScale[2] + Math.random() * scaleDiffZ;

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

        task.spawnedCount = spawnedCount;
        this.#activeInstanceCount = spawnedCount;

        // 부분 범위만 GPU로 미세 업로드 (2.4MB / 프레임)
        const chunkUploadCount = spawnedCount - startIdx;
        if (chunkUploadCount > 0) {
            this.instanceBuffer.uploadRangeToGPU(startIdx, chunkUploadCount);
            this.updateIndirectBuffer();
        }

        if (spawnedCount >= targetCount) {
            this.#streamingTask = null;
            return false;
        }

        return true;
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
        this.#lastPopulatedCamX = camX;
        this.#lastPopulatedCamZ = camZ;
        this.#lastPopulatedRadius = radius;

        const bounds = {
            minX: camX - radius,
            maxX: camX + radius,
            minZ: camZ - radius,
            maxZ: camZ + radius,
        };

        this.populateRandomInstances(count, bounds, getHeightAt);
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

    destroy(): void {
        this.instanceBuffer.destroy();
    }
}
