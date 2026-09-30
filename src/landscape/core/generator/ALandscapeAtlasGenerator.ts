/**
 * [KO] 지형 가상 텍스처(VBT, VHT, VNT) 아틀라스 베이커 추상 기본 클래스 모듈입니다.
 * [EN] Abstract base class module for terrain virtual texture (VBT, VHT, VNT) atlas bakers.
 * @packageDocumentation
 */

import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] 지형 GPU Compute 아틀라스 베이킹을 위한 공통 파이프라인, 유니폼 풀 및 디스패치 루프를 제공하는 추상 기본 클래스입니다.
 * [EN] Abstract base class providing common compute pipelines, uniform pools, and dispatch loops for terrain GPU compute atlas baking.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 내부적으로 관리되는 추상 클래스입니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class managed internally by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export abstract class ALandscapeAtlasGenerator extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;

    #uniformBufferPool: GPUBuffer[] = [];
    #poolIndex: number = 0;
    #lastFrameId: number = -1;
    #generatorLabel: string;

    constructor(redGPUContext: RedGPUContext, generatorLabel: string) {
        super(redGPUContext);
        this.#generatorLabel = generatorLabel;
    }

    get computePipeline(): GPUComputePipeline | null {
        return this.#computePipeline;
    }

    get bindGroupLayout(): GPUBindGroupLayout | null {
        return this.#bindGroupLayout;
    }

    /**
     * [KO] 프레임 단위로 유니폼 버퍼를 풀링하여 재사용하고 필요한 경우 확장합니다.
     * [EN] Pools and reuses uniform buffers per frame, expanding when necessary.
     * @param byteLength -
     * [KO] 필요한 바이트 크기
     * [EN] Required byte size
     * @returns
     * [KO] 할당 또는 재사용된 GPUBuffer
     * [EN] Allocated or reused GPUBuffer
     */
    acquireUniformBuffer(byteLength: number): GPUBuffer {
        const device = this.gpuDevice;
        const curFrame = this.redGPUContext.currentRequestAnimationFrame;

        if (this.#lastFrameId !== curFrame) {
            this.#lastFrameId = curFrame;
            this.#poolIndex = 0;
        }

        if (this.#poolIndex >= this.#uniformBufferPool.length) {
            this.#uniformBufferPool.push(device.createBuffer({
                label: `Landscape_${this.#generatorLabel}_UniformBuffer_Slot_${this.#uniformBufferPool.length}`,
                size: Math.max(16, byteLength),
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            }));
        }

        const buf = this.#uniformBufferPool[this.#poolIndex++];
        if (buf.size < byteLength) {
            const newBuf = device.createBuffer({
                label: `Landscape_${this.#generatorLabel}_UniformBuffer_Slot_${this.#poolIndex - 1}`,
                size: Math.max(16, byteLength),
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            this.#uniformBufferPool[this.#poolIndex - 1] = newBuf;
            return newBuf;
        }

        return buf;
    }

    /**
     * [KO] 지정된 픽셀 영역에 대해 GPU Compute 베이킹 패스를 실행합니다.
     * [EN] Dispatches a GPU compute bake pass for the specified pixel region.
     * @param bindGroup -
     * [KO] 바인딩할 GPUBindGroup
     * [EN] GPUBindGroup to bind
     * @param pixelW -
     * [KO] 베이킹 가로 픽셀 폭
     * [EN] Bake pixel width
     * @param pixelH -
     * [KO] 베이킹 세로 픽셀 높이
     * [EN] Bake pixel height
     * @param pixelX -
     * [KO] 베이킹 시작 X 픽셀 좌표
     * [EN] Bake start X pixel coordinate
     * @param pixelZ -
     * [KO] 베이킹 시작 Z 픽셀 좌표
     * [EN] Bake start Z pixel coordinate
     */
    dispatchBakePass(
        bindGroup: GPUBindGroup,
        pixelW: number,
        pixelH: number,
        pixelX: number,
        pixelZ: number
    ): void {
        if (!this.#computePipeline) return;
        if (pixelW <= 0 || pixelH <= 0) return;

        const workgroupCountX = Math.max(1, Math.ceil(pixelW / 16));
        const workgroupCountY = Math.max(1, Math.ceil(pixelH / 16));

        this.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
            const pass = commandEncoder.beginComputePass({
                label: `Landscape_${this.#generatorLabel}_ComputePass_[${pixelX},${pixelZ}]`
            });
            pass.setPipeline(this.#computePipeline!);
            pass.setBindGroup(0, bindGroup);
            pass.dispatchWorkgroups(workgroupCountX, workgroupCountY);
            pass.end();
        });
    }

    initBaseComputePipeline(
        shaderModuleKey: string,
        shaderCode: string,
        layoutEntries: GPUBindGroupLayoutEntry[],
        defaultUniformByteLength: number = 16
    ): void {
        const {gpuDevice: device, resourceManager} = this;
        if (!device) return;

        this.#uniformBufferPool = [];
        for (let i = 0; i < 16; i++) {
            this.#uniformBufferPool.push(device.createBuffer({
                label: `Landscape_${this.#generatorLabel}_UniformBuffer_Slot_${i}`,
                size: Math.max(16, defaultUniformByteLength),
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            }));
        }

        let shaderModule = resourceManager.getGPUShaderModule(shaderModuleKey);
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule(shaderModuleKey, {
                code: shaderCode
            });
        }

        this.#bindGroupLayout = device.createBindGroupLayout({
            label: `Landscape_${this.#generatorLabel}_BindGroupLayout`,
            entries: layoutEntries
        });

        const pipelineLayout = device.createPipelineLayout({
            label: `Landscape_${this.#generatorLabel}_PipelineLayout`,
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#computePipeline = device.createComputePipeline({
            label: `Landscape_${this.#generatorLabel}_ComputePipeline`,
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
    }

    destroy(): void {
        const count = this.#uniformBufferPool.length;
        for (let i = 0; i < count; i++) {
            try {
                this.#uniformBufferPool[i]?.destroy();
            } catch (e) {
            }
        }
        this.#uniformBufferPool.length = 0;
        this.#computePipeline = null;
        this.#bindGroupLayout = null;
    }
}

Object.freeze(ALandscapeAtlasGenerator);
export default ALandscapeAtlasGenerator;
