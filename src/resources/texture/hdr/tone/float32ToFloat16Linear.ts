import RedGPUContext from "../../../../context/RedGPUContext";
import computeShaderCode from "./float16Linear.wgsl";

/**
 * [KO] Float16 변환 옵션 인터페이스입니다.
 * [EN] Interface for Float16 conversion options.
 */
export interface Float16ConversionOptions {
    /**
     * [KO] 이미지 너비
     * [EN] Image width
     */
    width: number;
    /**
     * [KO] 이미지 높이
     * [EN] Image height
     */
    height: number;
    /**
     * [KO] 결과가 복사될 대상 텍스처
     * [EN] Target texture to copy the result to
     */
    targetTexture: GPUTexture;
}

/**
 * [KO] Float16 변환 결과 인터페이스입니다.
 * [EN] Interface for Float16 conversion results.
 */
export interface Float16ConversionResult {
    /**
     * [KO] 처리된 총 픽셀 수
     * [EN] Total number of processed pixels
     */
    processedPixels: number;
    /**
     * [KO] 실행 시간 (ms)
     * [EN] Execution time in milliseconds
     */
    executionTime: number;
}

/**
 * [KO] Float32 데이터를 Float16(Half-float)으로 변환하여 대상 텍스처에 업로드합니다.
 * [EN] Converts Float32 data to Float16 (Half-float) and uploads it to the target texture.
 *
 * [KO] GPU 컴퓨트 셰이더를 사용하여 선형 색공간을 유지하며 고속으로 변환을 수행하고, 결과를 직접 텍스처로 복사합니다.
 * [EN] Performs high-speed conversion using GPU compute shaders while maintaining linear color space, and copies the result directly to the texture.
 *
 * ### Example
 * ```typescript
 * await float32ToFloat16Linear(redGPUContext, rawFloat32Data, {
 *     width: 1024,
 *     height: 1024,
 *     targetTexture: myTexture
 * });
 * ```
 *
 * @param redGPUContext -
 * [KO] RedGPUContext 인스턴스
 * [EN] RedGPUContext instance
 * @param float32Data -
 * [KO] 변환할 Float32 데이터 배열
 * [EN] Float32 data array to convert
 * @param options -
 * [KO] 변환 옵션
 * [EN] Conversion options
 * @returns
 * [KO] 변환 결과 (실행 정보 포함)
 * [EN] Conversion result (including execution info)
 * @category IBL
 */
export async function float32ToFloat16Linear(
    redGPUContext: RedGPUContext,
    float32Data: Float32Array,
    options: Float16ConversionOptions,
): Promise<Float16ConversionResult> {
    const startTime = performance.now();
    const {gpuDevice} = redGPUContext;
    const {width, height, targetTexture} = options;
    const pixelCount = float32Data.length / 4;

    console.log(`Float32 → Float16 변환 및 업로드 시작`);
    console.log(`총 픽셀 수: ${pixelCount.toLocaleString()}`);

    try {
        const computeShader = gpuDevice.createShaderModule({
            code: computeShaderCode,
            label: 'float16_linear_conversion_shader'
        });

        const buffers = createBuffers(gpuDevice, float32Data, pixelCount);

        // 상수 업로드 단순화
        gpuDevice.queue.writeBuffer(buffers.constantsBuffer, 0, new Uint32Array([width, height]));

        const {computePipeline, bindGroup} = createPipelineAndBindGroup(
            gpuDevice,
            computeShader,
            buffers
        );

        await executeCompute(
            redGPUContext,
            computePipeline,
            bindGroup,
            buffers.outputBuffer,
            targetTexture,
            width,
            height,
        );

        cleanupBuffers(buffers);

        const executionTime = performance.now() - startTime;
        console.log(`변환 및 업로드 완료: ${executionTime.toFixed(2)}ms`);

        return {
            processedPixels: pixelCount,
            executionTime
        };
    } catch (error) {
        console.error('Float16 변환 실패:', error);
        throw error;
    }
}

interface Float16ConversionBuffers {
    inputBuffer: GPUBuffer;
    outputBuffer: GPUBuffer;
    constantsBuffer: GPUBuffer;
}

function createBuffers(gpuDevice: GPUDevice, float32Data: Float32Array, pixelCount: number): Float16ConversionBuffers {
    const inputBuffer = gpuDevice.createBuffer({
        size: float32Data.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        label: 'float16_input_buffer'
    });

    const outputBuffer = gpuDevice.createBuffer({
        size: pixelCount * 8,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        label: 'float16_output_buffer'
    });

    const constantsBuffer = gpuDevice.createBuffer({
        size: 16,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        label: 'float16_constants_buffer'
    });

    gpuDevice.queue.writeBuffer(inputBuffer, 0, float32Data as BufferSource);

    return {inputBuffer, outputBuffer, constantsBuffer};
}

function createPipelineAndBindGroup(
    gpuDevice: GPUDevice,
    computeShader: GPUShaderModule,
    buffers: Float16ConversionBuffers
): { computePipeline: GPUComputePipeline; bindGroup: GPUBindGroup } {
    const computePipeline = gpuDevice.createComputePipeline({
        layout: 'auto',
        compute: {module: computeShader, entryPoint: 'main'},
        label: 'float16_conversion_pipeline'
    });

    const bindGroup = gpuDevice.createBindGroup({
        layout: computePipeline.getBindGroupLayout(0),
        entries: [
            {binding: 0, resource: {buffer: buffers.inputBuffer}},
            {binding: 1, resource: {buffer: buffers.outputBuffer}},
            {binding: 2, resource: {buffer: buffers.constantsBuffer}}
        ],
        label: 'float16_conversion_bindgroup'
    });

    return {computePipeline, bindGroup};
}

async function executeCompute(
    redGPUContext: RedGPUContext,
    computePipeline: GPUComputePipeline,
    bindGroup: GPUBindGroup,
    outputBuffer: GPUBuffer,
    targetTexture: GPUTexture,
    width: number,
    height: number,
): Promise<void> {
    const workgroupsX = Math.ceil(width / 8);
    const workgroupsY = Math.ceil(height / 8);
    if (workgroupsX > 65535 || workgroupsY > 65535) {
        throw new Error(`이미지 크기 초과: ${workgroupsX} × ${workgroupsY}`);
    }

    await redGPUContext.commandEncoderManager.immediateComputePass(
        'float16_conversion_command_encoder',
        (computePass: GPUComputePassEncoder) => {
            computePass.setPipeline(computePipeline);
            computePass.setBindGroup(0, bindGroup);
            computePass.dispatchWorkgroups(workgroupsX, workgroupsY);
        },
        (commandEncoder: GPUCommandEncoder) => {
            // GPU 내에서 버퍼를 텍스처로 직접 복사
            commandEncoder.copyBufferToTexture(
                {
                    buffer: outputBuffer,
                    bytesPerRow: width * 8,
                    rowsPerImage: height
                },
                {
                    texture: targetTexture
                },
                {
                    width,
                    height,
                    depthOrArrayLayers: 1
                }
            );
        }
    );

    // GPU 작업 완료 대기
    await redGPUContext.gpuDevice.queue.onSubmittedWorkDone();
}

function cleanupBuffers(buffers: Float16ConversionBuffers): void {
    buffers.inputBuffer.destroy();
    buffers.outputBuffer.destroy();
    buffers.constantsBuffer.destroy();
}
