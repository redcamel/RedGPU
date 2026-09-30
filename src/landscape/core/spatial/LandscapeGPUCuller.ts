import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import landscapeCullComputeSource from "../shader/landscapeCullCompute.wgsl";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

/**
 * [KO] 프러스텀 및 HZB 기반의 GPU 컴퓨트 컬링 및 LOD 선정을 수행하고 간접 드로우 인스턴스 버퍼를 갱신하는 디스패처 클래스입니다.
 * [EN] GPU compute culling dispatcher performing frustum and HZB occlusion culling, selecting tile LODs, and updating indirect draw arguments.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(Landscape)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (Landscape).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class LandscapeGPUCuller extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #uniformBuffer: GPUBuffer | null = null;
    #bindGroup: GPUBindGroup | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;

    #uniformByteLength: number = 0;
    #uniformData: Float32Array;
    #uniformUintData: Uint32Array;

    /**
     * [KO] LandscapeGPUCuller 생성자입니다.
     * [EN] Constructor for LandscapeGPUCuller.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 / [EN] RedGPU context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#initGPUResources();
    }

    /**
     * [KO] GPU 컬링 연산에 필요한 입력 타일 버퍼, 가시 인덱스 버퍼, 간접 드로우 버퍼 및 HZB 텍스처를 바인드 그룹으로 바인딩합니다.
     * [EN] Updates the compute bind group with input tiles, visible indices, indirect draw buffers, and optional HZB texture.
     *
     * @param allInputTilesBuffer - [KO] 전체 입력 타일 스토리지 버퍼 / [EN] Storage buffer containing all input tiles
     * @param visibleTileIndicesBuffer - [KO] 컬링된 가시 타일 인덱스 출력 스토리지 버퍼 / [EN] Output storage buffer for visible tile indices
     * @param indirectDrawBuffer - [KO] LOD별 간접 인덱스 드로우 인자 버퍼 / [EN] Indirect indexed draw argument buffer
     * @param hzbTextureView - [KO] HZB 텍스처 뷰 (선택 사항) / [EN] Optional HZB texture view
     * @param hzbSampler - [KO] HZB 텍스처 샘플러 (선택 사항) / [EN] Optional HZB sampler
     */
    updateBindGroup(
        allInputTilesBuffer: GPUBuffer,
        visibleTileIndicesBuffer: GPUBuffer,
        indirectDrawBuffer: GPUBuffer,
        hzbTextureView?: GPUTextureView | null,
        hzbSampler?: GPUSampler | null
    ): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#bindGroupLayout || !this.#uniformBuffer) return;

        const targetHZBView = hzbTextureView || this.resourceManager.emptyBitmapTextureView;
        const targetHZBSampler = hzbSampler || this.resourceManager.basicSampler.gpuSampler;

        this.#bindGroup = gpuDevice.createBindGroup({
            label: `Landscape_Cull_BindGroup_${this.instanceId}`,
            layout: this.#bindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: this.#uniformBuffer}},
                {binding: 1, resource: {buffer: allInputTilesBuffer}},
                {binding: 2, resource: {buffer: visibleTileIndicesBuffer}},
                {binding: 3, resource: {buffer: indirectDrawBuffer}},
                {binding: 4, resource: targetHZBView},
                {binding: 5, resource: targetHZBSampler}
            ]
        });
    }

    /**
     * [KO] 카메라 위치, 프러스텀 평면, LOD 거리 임계값 및 투영 행렬을 컬링 유니폼 버퍼에 갱신합니다.
     * [EN] Updates camera position, frustum planes, LOD distance thresholds, and projection matrix to the culling uniform buffer.
     *
     * @param camX - [KO] 카메라 월드 X 좌표 / [EN] Camera world X coordinate
     * @param camY - [KO] 카메라 월드 Y 좌표 / [EN] Camera world Y coordinate
     * @param camZ - [KO] 카메라 월드 Z 좌표 / [EN] Camera world Z coordinate
     * @param lodMaxLevel - [KO] 최대 LOD 단계 수 / [EN] Maximum LOD levels count
     * @param worldSizeX - [KO] 전체 지형 월드 X 크기 / [EN] Total terrain world X size
     * @param worldSizeZ - [KO] 전체 지형 월드 Z 크기 / [EN] Total terrain world Z size
     * @param tileSizeX - [KO] 단일 타일 X 크기 / [EN] Single tile X size
     * @param tileSizeZ - [KO] 단일 타일 Z 크기 / [EN] Single tile Z size
     * @param heightScale - [KO] 지형 높이 스케일 / [EN] Terrain height scale
     * @param tileCount - [KO] 전체 활성 타일 수 / [EN] Total active tile count
     * @param frustumPlanes - [KO] 카메라 뷰 프러스텀 6개 평면 배열 / [EN] Array of 6 camera view frustum planes
     * @param lodDistancesSq - [KO] LOD 레벨 전환 제곱 거리 배열 / [EN] Squared distance thresholds per LOD
     * @param tanHalfFOV - [KO] tan(halfFOV) 값 / [EN] tan(halfFOV) factor
     * @param lodMetric - [KO] 화면 투영 오차 LOD 계수 / [EN] Screen space error metric
     * @param useHZB - [KO] HZB 오클루전 컬링 활성화 여부 / [EN] Whether HZB occlusion culling is enabled
     * @param viewProjectionMatrix - [KO] 뷰-프로젝션 결합 행렬 / [EN] Optional view-projection matrix
     */
    updateUniforms(
        camX: number,
        camY: number,
        camZ: number,
        lodMaxLevel: number,
        worldSizeX: number,
        worldSizeZ: number,
        tileSizeX: number,
        tileSizeZ: number,
        heightScale: number,
        tileCount: number,
        frustumPlanes: number[][] | Float32Array[] | null,
        lodDistancesSq: Float32Array,
        tanHalfFOV: number = 1.0,
        lodMetric: number = 0.0,
        useHZB: boolean = false,
        viewProjectionMatrix: Float32Array | null = null
    ): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#uniformBuffer) return;

        const data = this.#uniformData;
        const uintData = this.#uniformUintData;

        data[0] = camX;
        data[1] = camY;
        data[2] = camZ;
        uintData[3] = lodMaxLevel;

        data[4] = worldSizeX;
        data[5] = worldSizeZ;
        data[6] = tileSizeX;
        data[7] = tileSizeZ;

        data[8] = heightScale;
        uintData[9] = tileCount;
        data[10] = tanHalfFOV;
        data[11] = lodMetric;

        uintData[12] = useHZB ? 1 : 0;
        data[13] = 0.0;
        data[14] = 0.0;
        data[15] = 0.0;

        if (viewProjectionMatrix && viewProjectionMatrix.length >= 16) {
            for (let i = 0; i < 16; i++) {
                data[16 + i] = viewProjectionMatrix[i];
            }
        } else {
            for (let i = 0; i < 16; i++) {
                data[16 + i] = 0.0;
            }
        }

        if (frustumPlanes && frustumPlanes.length >= 6) {
            for (let i = 0; i < 6; i++) {
                const plane = frustumPlanes[i];
                const offset = 32 + i * 4;
                data[offset] = plane[0];
                data[offset + 1] = plane[1];
                data[offset + 2] = plane[2];
                data[offset + 3] = plane[3];
            }
        } else {
            for (let i = 0; i < 6; i++) {
                const offset = 32 + i * 4;
                data[offset] = 0;
                data[offset + 1] = 0;
                data[offset + 2] = 0;
                data[offset + 3] = 1000000000.0;
            }
        }

        const distCount = lodDistancesSq.length;
        for (let i = 0; i < 8; i++) {
            const val = i < distCount ? lodDistancesSq[i] : 0;
            data[56 + i] = (val && val > 0) ? val : 1e15;
        }

        gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, data.buffer, 0, data.byteLength);
    }

    /**
     * [KO] 주어진 컴퓨트 패스 인코더를 통해 GPU 컬링 컴퓨트 셰이더를 디스패치합니다.
     * [EN] Dispatches the GPU culling compute shader through the provided compute pass encoder.
     *
     * @param computePass - [KO] GPU 컴퓨트 패스 인코더 / [EN] GPU compute pass encoder
     * @param tileCount - [KO] 디스패치할 활성 타일 수 / [EN] Active tile count to dispatch
     */
    dispatchPass(computePass: GPUComputePassEncoder, tileCount: number): void {
        if (!this.#computePipeline || !this.#bindGroup) return;

        computePass.setPipeline(this.#computePipeline);
        computePass.setBindGroup(0, this.#bindGroup);

        const workgroupCount = Math.ceil(tileCount / 64);
        computePass.dispatchWorkgroups(workgroupCount);
    }

    #initGPUResources(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const resourceManager = this.resourceManager;
        const shaderInfo = resourceManager.wgslParser.parse('Landscape_Cull_ShaderModule', landscapeCullComputeSource);

        let shaderModule = resourceManager.getGPUShaderModule('Landscape_Cull_ShaderModule');
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule('Landscape_Cull_ShaderModule', {
                code: landscapeCullComputeSource
            });
        }

        this.#uniformByteLength = shaderInfo?.uniforms?.uniforms?.arrayBufferByteLength || 256;
        this.#uniformData = new Float32Array(this.#uniformByteLength / Float32Array.BYTES_PER_ELEMENT);
        this.#uniformUintData = new Uint32Array(this.#uniformData.buffer);

        this.#uniformBuffer = gpuDevice.createBuffer({
            label: `Landscape_Cull_UniformBuffer_${this.instanceId}`,
            size: this.#uniformByteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        this.#bindGroupLayout = resourceManager.createBindGroupLayout('Landscape_Cull_BindGroupLayout', {
            label: 'Landscape_Cull_BindGroupLayout',
            ...descriptor
        });

        const pipelineLayout = resourceManager.createGPUPipelineLayout('Landscape_Cull_PipelineLayout', {
            bindGroupLayouts: [this.#bindGroupLayout]
        });
        this.#computePipeline = gpuDevice.createComputePipeline({
            label: `Landscape_Cull_ComputePipeline_${this.instanceId}`,
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
    }

    /**
     * [KO] GPU 유니폼 버퍼 및 파이프라인 참조를 해제합니다.
     * [EN] Destroys GPU uniform buffers and releases pipeline references.
     */
    destroy(): void {
        if (this.#uniformBuffer) {
            try {
                this.#uniformBuffer.destroy();
            } catch (e) {
            }
            this.#uniformBuffer = null;
        }
        this.#computePipeline = null;
        this.#bindGroup = null;
        this.#bindGroupLayout = null;
    }
}

Object.freeze(LandscapeGPUCuller);
export default LandscapeGPUCuller;
