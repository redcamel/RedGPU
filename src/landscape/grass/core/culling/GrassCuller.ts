/**
 * [KO] 절차적 잔디 GPU 거리 및 프러스텀 컬링 디스패처 모듈입니다.
 * [EN] Procedural grass GPU distance and frustum culling dispatcher module.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import grassCullComputeWGSL from "./grassCullCompute.wgsl";
import type {GrassMegaBuffer} from "../buffer/GrassMegaBuffer";

/**
 * [KO] GPU Compute 기반으로 지형 잔디의 거리 및 프러스텀 컬링을 수행하는 컬링 디스패처 클래스입니다.
 * [EN] Culling dispatcher class that performs GPU compute-based distance and frustum culling for landscape grass.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class GrassCuller extends RedGPUObject {
    #cullPipeline: GPUComputePipeline | null = null;
    #cullBindGroupLayout: GPUBindGroupLayout | null = null;
    #cullBindGroup: GPUBindGroup | null = null;

    #globalUniformGPUBuffer: GPUBuffer | null = null;
    #globalUniformCPUBuffer: Float32Array;
    #globalUniformUintBuffer: Uint32Array;

    #cachedRawBuffer: GPUBuffer | null = null;
    #cachedTypeParamsBuffer: GPUBuffer | null = null;
    #cachedCulledBuffer: GPUBuffer | null = null;
    #cachedIndirectBuffer: GPUBuffer | null = null;

    /**
     * [KO] GrassCuller 인스턴스를 생성하고 내부 유니폼 버퍼 및 GPU 파이프라인을 초기화합니다.
     * [EN] Creates a GrassCuller instance and initializes internal uniform buffers and the GPU pipeline.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);

        this.#globalUniformCPUBuffer = new Float32Array(32);
        this.#globalUniformUintBuffer = new Uint32Array(this.#globalUniformCPUBuffer.buffer);

        this.#init();
    }

    /**
     * [KO] 캐시된 GPU 바인드그룹 및 버퍼 참조를 무효화하여 다음 프레임에 재생성되도록 합니다.
     * [EN] Invalidates cached GPU bind groups and buffer references so they are recreated on the next frame.
     */
    invalidateBindGroup(): void {
        this.#cullBindGroup = null;
        this.#cachedRawBuffer = null;
        this.#cachedTypeParamsBuffer = null;
        this.#cachedCulledBuffer = null;
        this.#cachedIndirectBuffer = null;
    }

    /**
     * [KO] 카메라 위치, 프러스텀 평면 및 인스턴스 수량 정보를 GPU 유니폼 버퍼에 기록합니다.
     * [EN] Writes camera position, frustum planes, and instance count data into the GPU uniform buffer.
     *
     * @param camX - [KO] 카메라 월드 X 좌표 [EN] Camera world X coordinate
     * @param camY - [KO] 카메라 월드 Y 좌표 [EN] Camera world Y coordinate
     * @param camZ - [KO] 카메라 월드 Z 좌표 [EN] Camera world Z coordinate
     * @param frustumPlanes - [KO] 6개 프러스텀 평면 계수 배열 (24 floats) [EN] Array of 6 frustum plane coefficients (24 floats)
     * @param totalInstances - [KO] 컬링을 수행할 총 잔디 인스턴스 수 [EN] Total number of grass instances to cull
     * @param typeCount - [KO] 등록된 잔디 타입 수 (기본값: 1) [EN] Number of registered grass types (default: 1)
     */
    updateUniforms(
        camX: number,
        camY: number,
        camZ: number,
        frustumPlanes: Float32Array | null,
        totalInstances: number,
        typeCount: number = 1
    ): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#globalUniformGPUBuffer) return;

        const f32 = this.#globalUniformCPUBuffer;
        const u32 = this.#globalUniformUintBuffer;

        f32[0] = camX;
        f32[1] = camY;
        f32[2] = camZ;
        f32[3] = 1.0;

        if (frustumPlanes && frustumPlanes.length >= 24) {
            for (let i = 0; i < 24; i++) {
                f32[4 + i] = frustumPlanes[i];
            }
        } else {
            f32.fill(0, 4, 28);
        }

        u32[28] = totalInstances;
        u32[29] = typeCount;
        u32[30] = 0;
        u32[31] = 0;

        gpuDevice.queue.writeBuffer(
            this.#globalUniformGPUBuffer,
            0,
            this.#globalUniformCPUBuffer.buffer,
            0,
            32 * 4
        );
    }

    /**
     * [KO] 메가버퍼의 내부 GPU 버퍼 상태를 검사하여 바인드그룹을 최신 상태로 유지하거나 갱신합니다.
     * [EN] Checks internal GPU buffers of the mega-buffer and updates the bind group when needed.
     *
     * @param megaBuffer - [KO] 잔디 메가버퍼 인스턴스 [EN] Grass mega-buffer instance
     */
    updateBindGroup(megaBuffer: GrassMegaBuffer): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#cullBindGroupLayout || !this.#globalUniformGPUBuffer) return;

        if (
            !this.#cullBindGroup ||
            this.#cachedRawBuffer !== megaBuffer.rawGPUBuffer ||
            this.#cachedTypeParamsBuffer !== megaBuffer.typeParamsGPUBuffer ||
            this.#cachedCulledBuffer !== megaBuffer.culledGPUBuffer ||
            this.#cachedIndirectBuffer !== megaBuffer.indirectGPUBuffer
        ) {
            if (!megaBuffer.rawGPUBuffer || !megaBuffer.typeParamsGPUBuffer ||
                !megaBuffer.culledGPUBuffer || !megaBuffer.indirectGPUBuffer) {
                return;
            }

            this.#cachedRawBuffer = megaBuffer.rawGPUBuffer;
            this.#cachedTypeParamsBuffer = megaBuffer.typeParamsGPUBuffer;
            this.#cachedCulledBuffer = megaBuffer.culledGPUBuffer;
            this.#cachedIndirectBuffer = megaBuffer.indirectGPUBuffer;

            this.#cullBindGroup = gpuDevice.createBindGroup({
                label: `Grass_Cull_BindGroup_${this.instanceId}`,
                layout: this.#cullBindGroupLayout,
                entries: [
                    {binding: 0, resource: {buffer: megaBuffer.rawGPUBuffer}},
                    {binding: 1, resource: {buffer: this.#globalUniformGPUBuffer}},
                    {binding: 2, resource: {buffer: megaBuffer.typeParamsGPUBuffer}},
                    {binding: 3, resource: {buffer: megaBuffer.culledGPUBuffer}},
                    {binding: 4, resource: {buffer: megaBuffer.indirectGPUBuffer}},
                ],
            });
        }
    }

    /**
     * [KO] 지정된 컴퓨트 패스 엔코더에 컬링 파이프라인 및 바인드그룹을 설정하고 디스패치 명령을 기록합니다.
     * [EN] Sets the culling pipeline and bind group on the given compute pass encoder and records dispatch commands.
     *
     * @param computePass - [KO] GPU 컴퓨트 패스 인코더 [EN] GPU compute pass encoder
     * @param totalInstances - [KO] 디스패치할 총 인스턴스 수 [EN] Total instance count to dispatch
     */
    dispatchPass(computePass: GPUComputePassEncoder, totalInstances: number): void {
        if (!this.#cullPipeline || !this.#cullBindGroup || totalInstances <= 0) return;

        computePass.setPipeline(this.#cullPipeline);
        computePass.setBindGroup(0, this.#cullBindGroup);
        const workgroupCount = Math.ceil(totalInstances / 64);
        computePass.dispatchWorkgroups(workgroupCount, 1, 1);
    }

    /**
     * [KO] GrassCuller가 점유 중인 GPU 버퍼 및 파이프라인 자원을 해제합니다.
     * [EN] Releases GPU buffers and pipeline resources held by GrassCuller.
     */
    destroy(): void {
        this.#globalUniformGPUBuffer?.destroy();
        this.#globalUniformGPUBuffer = null;

        this.#cullPipeline = null;
        this.#cullBindGroupLayout = null;
        this.#cullBindGroup = null;
        this.#cachedRawBuffer = null;
        this.#cachedTypeParamsBuffer = null;
        this.#cachedCulledBuffer = null;
        this.#cachedIndirectBuffer = null;
    }

    #init(): void {
        const {gpuDevice, resourceManager} = this;
        if (!gpuDevice) return;

        this.#globalUniformGPUBuffer = gpuDevice.createBuffer({
            label: `Grass_Cull_GlobalUniformBuffer_${this.instanceId}`,
            size: this.#globalUniformCPUBuffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const shaderModule = resourceManager.createGPUShaderModule('Grass_Cull_ComputeModule', {
            code: grassCullComputeWGSL,
        });

        this.#cullBindGroupLayout = resourceManager.createBindGroupLayout('Grass_Cull_BindGroupLayout', {
            label: 'Grass_Cull_BindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
            ],
        });

        const pipelineLayout = resourceManager.createGPUPipelineLayout('Grass_Cull_PipelineLayout', {
            bindGroupLayouts: [this.#cullBindGroupLayout],
        });

        this.#cullPipeline = gpuDevice.createComputePipeline({
            label: `Grass_Cull_ComputePipeline_${this.instanceId}`,
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main',
            },
        });
    }
}

Object.freeze(GrassCuller);
export default GrassCuller;
