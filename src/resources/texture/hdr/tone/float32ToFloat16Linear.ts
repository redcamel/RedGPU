import RedGPUContext from "../../../../context/RedGPUContext";

export interface Float16ConversionOptions {
    width: number;
    height: number;
    workgroupSize?: [number, number];
    maxValue?: number;
}

export interface Float16ConversionResult {
    data: Uint16Array;
    processedPixels: number;
    executionTime: number;
}

/// Float32 → Float16 변환 (선형 색공간 유지, 극단값 클램프)
export async function float32ToFloat16Linear(
    redGPUContext: RedGPUContext,
    float32Data: Float32Array,
    options: Float16ConversionOptions
): Promise<Float16ConversionResult> {
    const startTime = performance.now();
    const {gpuDevice} = redGPUContext;
    const {width, height, workgroupSize = [8, 8], maxValue = 1000.0} = options;
    const pixelCount = float32Data.length / 4;

    console.log(`Float32 → Float16 변환 시작 (최대값: ${maxValue})`);
    console.log(`총 픽셀 수: ${pixelCount.toLocaleString()}`);

    const computeShaderCode = createFloat16ShaderCode(workgroupSize);

    try {
        const computeShader = gpuDevice.createShaderModule({
            code: computeShaderCode,
            label: 'float16_linear_conversion_shader'
        });

        const buffers = createBuffers(gpuDevice, float32Data, pixelCount);
        uploadConstants(gpuDevice, buffers.constantsBuffer, width, height, maxValue);

        const {computePipeline, bindGroup} = createPipelineAndBindGroup(
            gpuDevice,
            computeShader,
            buffers
        );

        const result = await executeCompute(
            gpuDevice,
            computePipeline,
            bindGroup,
            buffers.outputBuffer,
            buffers.readBuffer,
            width,
            height,
            workgroupSize,
            pixelCount
        );

        cleanupBuffers(buffers);

        const executionTime = performance.now() - startTime;
        console.log(`변환 완료: ${executionTime.toFixed(2)}ms`);

        return {
            data: result,
            processedPixels: pixelCount,
            executionTime
        };
    } catch (error) {
        console.error('Float16 변환 실패:', error);
        throw error;
    }
}

function createFloat16ShaderCode(workgroupSize: [number, number]): string {
    return `
    struct Constants {
        width: u32,
        height: u32,
    }

    @group(0) @binding(0) var<storage, read> inputData: array<f32>;
    @group(0) @binding(1) var<storage, read_write> outputData: array<u32>;
    @group(0) @binding(2) var<uniform> constants: Constants;

    fn floatToHalf(value: f32) -> u32 {
        let bits = bitcast<u32>(value);
        let sign = (bits >> 16u) & 0x8000u;
        var exp = (bits >> 23u) & 0xFFu;
        var mantissa = bits & 0x7FFFFFu;

        if (exp == 0u) {
            return sign;
        }

        if (exp == 255u) {
            return sign | 0x7C00u | select(0u, 1u, mantissa != 0u);
        }

        let newExp = i32(exp) - 127 + 15;
        if (newExp <= 0) {
            return sign;
        }
        if (newExp >= 31) {
            return sign | 0x7C00u;
        }

        return sign | (u32(newExp) << 10u) | (mantissa >> 13u);
    }

    @compute @workgroup_size(${workgroupSize[0]}, ${workgroupSize[1]})
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let x = global_id.x;
        let y = global_id.y;

        if (x >= constants.width || y >= constants.height) {
            return;
        }

        let pixelIndex = y * constants.width + x;
        let baseIndex = pixelIndex * 4u;

        let r = inputData[baseIndex];
        let g = inputData[baseIndex + 1u];
        let b = inputData[baseIndex + 2u];
        let a = inputData[baseIndex + 3u];

        let r16 = floatToHalf(r);
        let g16 = floatToHalf(g);
        let b16 = floatToHalf(b);
        let a16 = floatToHalf(a);

        let outputIndex = pixelIndex * 2u;
        outputData[outputIndex] = (g16 << 16u) | r16;
        outputData[outputIndex + 1u] = (a16 << 16u) | b16;
    }
    `;
}

interface Float16ConversionBuffers {
    inputBuffer: GPUBuffer;
    outputBuffer: GPUBuffer;
    constantsBuffer: GPUBuffer;
    readBuffer: GPUBuffer;
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

    const readBuffer = gpuDevice.createBuffer({
        size: pixelCount * 8,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        label: 'float16_read_buffer'
    });

    gpuDevice.queue.writeBuffer(inputBuffer, 0, float32Data);

    return {inputBuffer, outputBuffer, constantsBuffer, readBuffer};
}

function uploadConstants(
    gpuDevice: GPUDevice,
    constantsBuffer: GPUBuffer,
    width: number,
    height: number,
    maxValue: number
): void {
    const constantsData = new ArrayBuffer(16);
    const constantsView = new DataView(constantsData);
    constantsView.setUint32(0, width, true);
    constantsView.setUint32(4, height, true);
    constantsView.setFloat32(8, maxValue, true);
    gpuDevice.queue.writeBuffer(constantsBuffer, 0, constantsData);
}

function createPipelineAndBindGroup(
    gpuDevice: GPUDevice,
    computeShader: GPUShaderModule,
    buffers: Float16ConversionBuffers
): {computePipeline: GPUComputePipeline; bindGroup: GPUBindGroup} {
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
    gpuDevice: GPUDevice,
    computePipeline: GPUComputePipeline,
    bindGroup: GPUBindGroup,
    outputBuffer: GPUBuffer,
    readBuffer: GPUBuffer,
    width: number,
    height: number,
    workgroupSize: [number, number],
    pixelCount: number
): Promise<Uint16Array> {
    const workgroupsX = Math.ceil(width / workgroupSize[0]);
    const workgroupsY = Math.ceil(height / workgroupSize[1]);

    if (workgroupsX > 65535 || workgroupsY > 65535) {
        throw new Error(`이미지 크기 초과: ${workgroupsX} × ${workgroupsY}`);
    }

    const commandEncoder = gpuDevice.createCommandEncoder();
    const computePass = commandEncoder.beginComputePass();

    computePass.setPipeline(computePipeline);
    computePass.setBindGroup(0, bindGroup);
    computePass.dispatchWorkgroups(workgroupsX, workgroupsY);
    computePass.end();

    commandEncoder.copyBufferToBuffer(outputBuffer, 0, readBuffer, 0, pixelCount * 8);
    gpuDevice.queue.submit([commandEncoder.finish()]);

    await readBuffer.mapAsync(GPUMapMode.READ);
    const packedData = new Uint32Array(readBuffer.getMappedRange());
    const uint16Data = new Uint16Array(
        packedData.buffer.slice(packedData.byteOffset, packedData.byteOffset + packedData.byteLength)
    );
    readBuffer.unmap();

    return uint16Data;
}

function cleanupBuffers(buffers: Float16ConversionBuffers): void {
    buffers.inputBuffer.destroy();
    buffers.outputBuffer.destroy();
    buffers.constantsBuffer.destroy();
    buffers.readBuffer.destroy();
}