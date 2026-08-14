import RedGPUContext from '../../../context/RedGPUContext';
import Landscape from '../core/Landscape';
import {FoliageType, FoliageTypeOptions} from './FoliageType';
import foliageInstancedWGSL from './shader/foliageInstanced.wgsl';

/**
 * LandscapeFoliageManager
 * Landscape 지형 엔진 연동 및 수십만 개 식생 인스턴스 렌더링 총괄 매니저
 */
export class LandscapeFoliageManager {
    readonly landscape: Landscape;
    readonly redGPUContext: RedGPUContext;

    private foliageTypes: Map<string, FoliageType> = new Map();
    private renderPipeline: GPURenderPipeline | null = null;
    private shaderModule: GPUShaderModule | null = null;

    constructor(landscape: Landscape) {
        this.landscape = landscape;
        this.redGPUContext = landscape.redGPUContext;
        this.initPipeline();
    }

    /**
     * 식생 종류(Species) 추가 (Grass, Tree, Rock 등)
     */
    addFoliageType(options: FoliageTypeOptions): FoliageType {
        if (this.foliageTypes.has(options.name)) {
            console.warn(`[LandscapeFoliageManager] FoliageType with name '${options.name}' already exists.`);
            return this.foliageTypes.get(options.name)!;
        }

        const foliageType = new FoliageType(this.redGPUContext, options);
        this.foliageTypes.set(options.name, foliageType);
        return foliageType;
    }

    /**
     * 식생 종류 제거
     */
    removeFoliageType(name: string): boolean {
        const foliageType = this.foliageTypes.get(name);
        if (foliageType) {
            foliageType.destroy();
            return this.foliageTypes.delete(name);
        }
        return false;
    }

    /**
     * 식생 종류 조회
     */
    getFoliageType(name: string): FoliageType | undefined {
        return this.foliageTypes.get(name);
    }

    /**
     * 등록된 모든 식생 종류 반환
     */
    getAllFoliageTypes(): FoliageType[] {
        return Array.from(this.foliageTypes.values());
    }

    /**
     * 매 프레임 카메라 위치 기반 Culling 및 Distance Scale Fade 갱신
     */
    update(cameraPosition: [number, number, number]): void {
        const camX = cameraPosition[0];
        const camY = cameraPosition[1];
        const camZ = cameraPosition[2];

        this.foliageTypes.forEach((foliageType) => {
            const activeCount = foliageType.activeInstanceCount;
            if (activeCount <= 0) return;

            const buffer = foliageType.instanceBuffer;
            const cullingDist = foliageType.options.cullingDistance;
            const fadeStartDist = foliageType.options.fadeStartDistance;
            const cullingDistSq = cullingDist * cullingDist;
            const fadeRange = Math.max(cullingDist - fadeStartDist, 1.0);

            const data = buffer.dataBuffer;
            const stride = buffer.strideFloats;

            for (let i = 0; i < activeCount; i++) {
                const offset = i * stride;
                const posX = data[offset];
                const posY = data[offset + 1];
                const posZ = data[offset + 2];

                const dx = posX - camX;
                const dy = posY - camY;
                const dz = posZ - camZ;
                const distSq = dx * dx + dy * dy + dz * dz;

                let fade = 1.0;
                if (distSq >= cullingDistSq) {
                    fade = 0.0;
                } else {
                    const dist = Math.sqrt(distSq);
                    if (dist > fadeStartDist) {
                        fade = 1.0 - (dist - fadeStartDist) / fadeRange;
                    }
                }

                data[offset + 10] = Math.max(0.0, Math.min(1.0, fade));
            }

            buffer.uploadToGPU(activeCount);
        });
    }

    /**
     * 지정 범위 내 무작위 생성
     */
    populateAllFoliageTypes(
        countPerType: number,
        bounds: { minX: number; minZ: number; maxX: number; maxZ: number },
        getHeightAt?: (x: number, z: number) => number
    ): void {
        this.foliageTypes.forEach((foliageType) => {
            foliageType.populateRandomInstances(countPerType, bounds, getHeightAt);
        });
    }

    /**
     * 렌더 패스 엔코더에 인스턴스드 드로우콜 바인딩 및 디스패치
     */
    render(view: any, passEncoder: GPURenderPassEncoder): void {
        if (!passEncoder || this.foliageTypes.size === 0) return;

        this.foliageTypes.forEach((foliageType) => {
            const activeCount = foliageType.activeInstanceCount;
            if (activeCount <= 0) return;

            const instanceGPUBuffer = foliageType.instanceBuffer.getGPUBuffer();
            if (!instanceGPUBuffer) return;

            const mesh = foliageType.mesh;
            const geometry = mesh?.geometry;
            if (!geometry) return;

            const vertexBufferObj = geometry.vertexBuffer;
            const indexBufferObj = geometry.indexBuffer;
            const vertexGPUBuffer = vertexBufferObj?.gpuBuffer;
            const indexGPUBuffer = indexBufferObj?.gpuBuffer;

            if (!vertexGPUBuffer) return;

            // Pipeline 바인딩
            if (this.renderPipeline) {
                passEncoder.setPipeline(this.renderPipeline);
            }

            // 카메라 유니폼 바인드 그룹 (View3D 유니폼 바인딩)
            const cameraBindGroup = view?.systemUniform_Vertex_UniformBindGroup || view?.view3D?.systemUniform_Vertex_UniformBindGroup;
            if (cameraBindGroup) {
                passEncoder.setBindGroup(0, cameraBindGroup);
            }

            // Buffer 0: Geometry Vertex Buffer
            passEncoder.setVertexBuffer(0, vertexGPUBuffer);
            // Buffer 1: Foliage Instance Buffer
            passEncoder.setVertexBuffer(1, instanceGPUBuffer);

            // Index 렌더링 vs Non-Index 렌더링
            if (indexGPUBuffer) {
                const format = (indexBufferObj as any)?.indexFormat || 'uint32';
                passEncoder.setIndexBuffer(indexGPUBuffer, format);
                passEncoder.drawIndexed(indexBufferObj.indexCount, activeCount, 0, 0, 0);
            } else if (vertexBufferObj) {
                passEncoder.draw(vertexBufferObj.vertexCount, activeCount, 0, 0);
            }
        });
    }

    /**
     * 리소스 해제
     */
    destroy(): void {
        this.foliageTypes.forEach((type) => type.destroy());
        this.foliageTypes.clear();
    }

    /**
     * Foliage Instanced WGSL 렌더 파이프라인 생성
     */
    private initPipeline(): void {
        const gpuDevice: GPUDevice = this.redGPUContext.gpuDevice;

        this.shaderModule = gpuDevice.createShaderModule({
            label: 'FoliageInstancedShader_Module',
            code: foliageInstancedWGSL,
        });

        // Buffer 0: Mesh Geometry (Position, Normal, UV)
        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: (3 + 3 + 2) * 4, // 32 bytes
            attributes: [
                {shaderLocation: 0, offset: 0, format: 'float32x3'},  // position
                {shaderLocation: 1, offset: 12, format: 'float32x3'}, // normal
                {shaderLocation: 2, offset: 24, format: 'float32x2'}, // uv
            ],
        };

        // Buffer 1: Instance Attributes (Pos, RotQuat, Scale, Extra)
        const instanceBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 12 * 4, // 48 bytes
            stepMode: 'instance',
            attributes: [
                {shaderLocation: 3, offset: 0, format: 'float32x3'},  // instancePos
                {shaderLocation: 4, offset: 12, format: 'float32x4'}, // instanceRotQuat
                {shaderLocation: 5, offset: 28, format: 'float32x3'}, // instanceScale
                {shaderLocation: 6, offset: 40, format: 'float32x2'}, // instanceExtra (fade, subId)
            ],
        };

        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: 'FoliageInstanced_RenderPipeline',
            layout: 'auto',
            vertex: {
                module: this.shaderModule,
                entryPoint: 'mainInput',
                buffers: [geometryBufferLayout, instanceBufferLayout],
            },
            fragment: {
                module: this.shaderModule,
                entryPoint: 'mainFragment',
                targets: [
                    {
                        format: navigator.gpu.getPreferredCanvasFormat(),
                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none',
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
        };

        try {
            this.renderPipeline = gpuDevice.createRenderPipeline(pipelineDescriptor);
        } catch (e) {
            console.warn('[LandscapeFoliageManager] Standard pipeline creation fallback:', e);
        }
    }
}
