import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import landscapeCullSource from "../shader/landscapeCull.wgsl";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

/**
 * [KO] 컴퓨트 셰이더를 사용하여 지형(Landscape) 타일의 프러스텀 컬링, HZB 오클루전 컬링 및 LOD 선택을 수행하는 클래스입니다.
 * [EN] Class that performs frustum culling, HZB occlusion culling, and LOD selection for Landscape tiles using a compute shader.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class LandscapeGPUCuller extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #uniformBuffer: GPUBuffer | null = null;
    #bindGroup: GPUBindGroup | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;

    #uniformByteLength: number = 0;
    #uniformData: Float32Array;
    #uniformUintData: Uint32Array;

    /**
     * [KO] LandscapeGPUCuller 인스턴스를 생성하고 GPU 리소스를 초기화합니다.
     * [EN] Creates a LandscapeGPUCuller instance and initializes GPU resources.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#initGPUResources();
    }

    /**
     * [KO] 타일 버퍼, 인다이렉트 드로우 버퍼 및 HZB 텍스처를 바인딩하여 컬링용 바인드 그룹을 갱신합니다.
     * [EN] Updates the culling bind group by binding tile buffers, indirect draw buffer, and HZB texture.
     *
     * @param allTilesBuffer -
     * [KO] 전체 타일 정적 정보가 담긴 GPU 스토리지 버퍼
     * [EN] GPU storage buffer containing static information for all tiles
     * @param visibleTilesBuffer -
     * [KO] 가시 타일 출력 결과가 기록될 GPU 스토리지 버퍼
     * [EN] GPU storage buffer where visible tile output results will be written
     * @param indirectDrawBuffer -
     * [KO] LOD별 인다이렉트 드로우 인자가 기록될 GPU 버퍼
     * [EN] GPU buffer where indirect draw arguments per LOD will be written
     * @param hzbTextureView -
     * [KO] 계층적 Z-버퍼(HZB) 텍스처 뷰 (선택)
     * [EN] Hierarchical Z-Buffer (HZB) texture view (optional)
     * @param hzbSampler -
     * [KO] HZB 샘플링용 GPU 샘플러 (선택)
     * [EN] GPU sampler for HZB sampling (optional)
     */
    updateBindGroup(
        allTilesBuffer: GPUBuffer,
        visibleTilesBuffer: GPUBuffer,
        indirectDrawBuffer: GPUBuffer,
        hzbTextureView?: GPUTextureView | null,
        hzbSampler?: GPUSampler | null
    ): void {
        const {gpuDevice, resourceManager} = this;
        if (!gpuDevice || !this.#bindGroupLayout || !this.#uniformBuffer) return;

        const {emptyR32FloatTextureView, basicSampler} = resourceManager;
        const targetHZBView = hzbTextureView || emptyR32FloatTextureView;
        const targetHZBSampler = hzbSampler || basicSampler.gpuSampler;

        this.#bindGroup = gpuDevice.createBindGroup({
            label: `Landscape_Cull_BindGroup_${this.instanceId}`,
            layout: this.#bindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: this.#uniformBuffer}},
                {binding: 1, resource: {buffer: allTilesBuffer}},
                {binding: 2, resource: {buffer: visibleTilesBuffer}},
                {binding: 3, resource: {buffer: indirectDrawBuffer}},
                {binding: 4, resource: targetHZBView},
                {binding: 5, resource: targetHZBSampler}
            ]
        });
    }

    /**
     * [KO] 카메라 위치, 프러스텀 평면, LOD 거리 임계값 등 컬링 컴퓨트 셰이더의 유니폼 데이터를 갱신합니다.
     * [EN] Updates the uniform data for the culling compute shader, including camera position, frustum planes, and LOD distance thresholds.
     *
     * @param camX -
     * [KO] 카메라의 월드 X 좌표
     * [EN] Camera world X coordinate
     * @param camY -
     * [KO] 카메라의 월드 Y 좌표
     * [EN] Camera world Y coordinate
     * @param camZ -
     * [KO] 카메라의 월드 Z 좌표
     * [EN] Camera world Z coordinate
     * @param lodMaxLevel -
     * [KO] 최대 LOD 레벨 수
     * [EN] Maximum number of LOD levels
     * @param tileSizeX -
     * [KO] 단일 타일의 가로(X) 월드 크기
     * [EN] World width (X) of a single tile
     * @param tileSizeZ -
     * [KO] 단일 타일의 세로(Z) 월드 크기
     * [EN] World depth (Z) of a single tile
     * @param heightScale -
     * [KO] 지형 최대 높이 스케일
     * [EN] Maximum height scale of the terrain
     * @param tileCount -
     * [KO] 전체 타일 컴포넌트 개수
     * [EN] Total number of tile components
     * @param frustumPlanes -
     * [KO] 6개 프러스텀 평면 데이터 배열 (총 24개 float) 또는 `null`
     * [EN] Array of 6 frustum plane data (24 floats total) or `null`
     * @param lodDistancesSq -
     * [KO] LOD 레벨별 거리 제곱(`distance^2`) 배열
     * [EN] Array of squared distances (`distance^2`) per LOD level
     * @param tanHalfFOV -
     * [KO] 카메라 수직 시야각 절반의 탄젠트 값 (`tan(fov / 2)`)
     * [EN] Tangent of half the camera vertical field of view (`tan(fov / 2)`)
     * @param lodMetric -
     * [KO] 화면 공간 오차 기반 LOD 산출 메트릭 값
     * [EN] Metric value for screen-space error based LOD calculation
     * @param useHZB -
     * [KO] HZB 오클루전 컬링 활성화 여부
     * [EN] Whether HZB occlusion culling is enabled
     * @param viewProjectionMatrix -
     * [KO] 뷰-프로젝션(`4x4`) 행렬 데이터 또는 `null`
     * [EN] View-projection (`4x4`) matrix data or `null`
     */
    updateUniforms(
        camX: number,
        camY: number,
        camZ: number,
        lodMaxLevel: number,
        tileSizeX: number,
        tileSizeZ: number,
        heightScale: number,
        tileCount: number,
        frustumPlanes: Float32Array | null,
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

        if (viewProjectionMatrix && viewProjectionMatrix.length >= 16) {
            for (let i = 0; i < 16; i++) {
                data[i] = viewProjectionMatrix[i];
            }
        } else {
            for (let i = 0; i < 16; i++) {
                data[i] = 0.0;
            }
        }

        if (frustumPlanes && frustumPlanes.length >= 24) {
            data.set(frustumPlanes.length === 24 ? frustumPlanes : frustumPlanes.subarray(0, 24), 16);
        } else {
            for (let i = 0; i < 6; i++) {
                const offset = 16 + i * 4;
                data[offset] = 0;
                data[offset + 1] = 0;
                data[offset + 2] = 0;
                data[offset + 3] = 1000000000.0;
            }
        }

        const distCount = lodDistancesSq.length;
        for (let i = 0; i < 8; i++) {
            const val = i < distCount ? lodDistancesSq[i] : 0;
            data[40 + i] = (val && val > 0) ? val : 1e15;
        }

        data[48] = camX;
        data[49] = camY;
        data[50] = camZ;
        uintData[51] = lodMaxLevel;

        data[52] = tileSizeX;
        data[53] = tileSizeZ;
        data[54] = heightScale;
        uintData[55] = tileCount;

        data[56] = tanHalfFOV;
        data[57] = lodMetric;
        uintData[58] = useHZB ? 1 : 0;

        data[59] = 0.0;
        data[60] = 0.0;
        data[61] = 0.0;
        data[62] = 0.0;
        data[63] = 0.0;

        gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, data.buffer, 0, data.byteLength);
    }

    /**
     * [KO] 주어진 컴퓨트 패스 인코더에 지형 타일 컬링 워크그룹을 디스패치합니다.
     * [EN] Dispatches terrain tile culling workgroups onto the given compute pass encoder.
     *
     * @param computePass -
     * [KO] 활성화된 GPU 컴퓨트 패스 인코더
     * [EN] Active GPU compute pass encoder
     * @param tileCount -
     * [KO] 컬링 대상 전체 타일 개수
     * [EN] Total number of tiles to cull
     */
    dispatchPass(computePass: GPUComputePassEncoder, tileCount: number): void {
        if (!this.#computePipeline || !this.#bindGroup) return;

        computePass.setPipeline(this.#computePipeline);
        computePass.setBindGroup(0, this.#bindGroup);

        const workgroupCount = Math.ceil(tileCount / 64);
        computePass.dispatchWorkgroups(workgroupCount);
    }

    #initGPUResources(): void {
        const {gpuDevice, resourceManager} = this;
        if (!gpuDevice) return;
        const shaderInfo = resourceManager.wgslParser.parse('Landscape_Cull_ShaderModule', landscapeCullSource);

        let shaderModule = resourceManager.getGPUShaderModule('Landscape_Cull_ShaderModule');
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule('Landscape_Cull_ShaderModule', {
                code: landscapeCullSource
            });
        }

        this.#uniformByteLength = shaderInfo.uniforms?.uniforms?.arrayBufferByteLength || 256;
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
     * [KO] 컬링기가 점유한 GPU 유니폼 버퍼 및 파이프라인 참조를 해제합니다.
     * [EN] Releases the GPU uniform buffer and pipeline references held by the culler.
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
