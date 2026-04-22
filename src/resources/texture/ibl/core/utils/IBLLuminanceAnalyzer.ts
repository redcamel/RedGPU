import RedGPUContext from "../../../../../context/RedGPUContext";
import iblLuminanceAnalysisShaderCode from "./shader/iblLuminanceAnalysis.wgsl";

/**
 * [KO] IBL 텍스처의 휘도를 분석하는 클래스입니다.
 * [EN] Class that analyzes the luminance of an IBL texture.
 *
 * @category IBL
 */
class IBLLuminanceAnalyzer {
    readonly #redGPUContext: RedGPUContext;
    #shaderModule: GPUShaderModule;
    #pipeline: GPUComputePipeline;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
    }

    /**
     * [KO] 주어진 큐브맵 텍스처의 평균 휘도를 분석하여 반환합니다.
     * [EN] Analyzes and returns the average luminance of a given cubemap texture.
     *
     * @param cubeTexture - [KO] 분석할 큐브맵 GPUTexture [EN] Cubemap GPUTexture to analyze
     * @returns [KO] 분석된 평균 휘도 [EN] Analyzed average luminance
     */
    async analyze(cubeTexture: GPUTexture): Promise<number> {
        const {gpuDevice, resourceManager} = this.#redGPUContext;

        if (!this.#shaderModule) {
            this.#shaderModule = resourceManager.createGPUShaderModule(
                'IBL_LUMINANCE_ANALYSIS_SHADER_MODULE',
                {code: iblLuminanceAnalysisShaderCode}
            );
        }

        if (!this.#pipeline) {
            this.#pipeline = gpuDevice.createComputePipeline({
                label: 'IBL_LUMINANCE_ANALYSIS_PIPELINE',
                layout: 'auto',
                compute: {
                    module: this.#shaderModule,
                    entryPoint: 'cs_main'
                },
            });
        }

        const size = cubeTexture.width;
        const luminanceBuffer = gpuDevice.createBuffer({
            size: 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            label: 'IBL_Luminance_Sum_Buffer'
        });

        const readBuffer = gpuDevice.createBuffer({
            size: 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
            label: 'IBL_Luminance_Read_Buffer'
        });

        const bindGroup = gpuDevice.createBindGroup({
            layout: this.#pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: cubeTexture.createView({dimension: '2d-array'})},
                {binding: 1, resource: {buffer: luminanceBuffer}}
            ]
        });

        const commandEncoder = gpuDevice.createCommandEncoder({label: 'IBL_Luminance_Analysis_Encoder'});
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(this.#pipeline);
        computePass.setBindGroup(0, bindGroup);
        // [KO] 128x128 그리드 분석을 위해 (8, 8) 워크그룹 디스패치 (16*8 = 128)
        // [EN] Dispatch (8, 8) workgroups for 128x128 grid analysis (16*8 = 128)
        computePass.dispatchWorkgroups(8, 8, 1);
        computePass.end();

        commandEncoder.copyBufferToBuffer(luminanceBuffer, 0, readBuffer, 0, 4);
        gpuDevice.queue.submit([commandEncoder.finish()]);

        await readBuffer.mapAsync(GPUMapMode.READ);
        const data = new Uint32Array(readBuffer.getMappedRange());
        const sum = data[0]; // 스케일 1.0 적용
        readBuffer.unmap();

        // [KO] 평균 휘도 계산 (총 샘플 수: 128 * 128 * 6)
        // [EN] Calculate average luminance (total samples: 128 * 128 * 6)
        const totalSamples = 128 * 128 * 6;
        const averageLuminance = sum / totalSamples;

        luminanceBuffer.destroy();
        readBuffer.destroy();

        return averageLuminance;
    }
}

export default IBLLuminanceAnalyzer;
