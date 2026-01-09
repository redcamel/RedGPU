
import RedGPUContext from "../../../../context/RedGPUContext";

export interface Float16ConversionOptions {
    width: number;
    height: number;
    workgroupSize?: [number, number];
}

export interface Float16ConversionResult {
    data: Uint16Array;
    processedPixels: number;
    executionTime: number;
}

/**
 * 🎬 GPU 기반 Float32 → Float16 변환 유틸리티
 * 톤매핑 없이 단순 포맷 변환만 수행
 */
export async function float32ToFloat16WithToneMapping(
    redGPUContext: RedGPUContext,
    float32Data: Float32Array,
    options: Float16ConversionOptions
): Promise<Float16ConversionResult> {
    const startTime = performance.now();
    const {gpuDevice} = redGPUContext;
    const {width, height, workgroupSize = [8, 8]} = options;
    const pixelCount = float32Data.length / 4; // RGBA

    console.log(`GPU Float32 → Float16 변환`);
    console.log(`총 픽셀 수: ${pixelCount.toLocaleString()}`);

    // 🔧 컴퓨트 셰이더 코드
    const computeShaderCode = createFloat16ShaderCode(workgroupSize);

    try {
        // 🔧 컴퓨트 셰이더 생성
        const computeShader = gpuDevice.createShaderModule({
            code: computeShaderCode,
            label: 'hdr_float16_conversion_shader'
        });

        // 🔧 버퍼들 생성
        const buffers = createBuffers(gpuDevice, float32Data, pixelCount);

        // 🔧 상수 데이터 업로드
        uploadConstants(gpuDevice, buffers.constantsBuffer, width, height);

        // 🔧 컴퓨트 파이프라인 및 바인드 그룹 생성
        const {computePipeline, bindGroup} = createPipelineAndBindGroup(
            gpuDevice,
            computeShader,
            buffers
        );

        // 🔧 컴퓨트 패스 실행
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

        // 🗑️ 버퍼 정리
        cleanupBuffers(buffers);

        const executionTime = performance.now() - startTime;
        console.log(`GPU Float16 변환 완료: ${pixelCount.toLocaleString()}픽셀 처리 (${executionTime.toFixed(2)}ms)`);

        return {
            data: result,
            processedPixels: pixelCount,
            executionTime
        };
    } catch (error) {
        console.error('Float16 변환 처리 실패:', error);
        throw error;
    }
}

/**
 * 🎨 Float16 변환 컴퓨트 셰이더 코드 생성
 */
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

/**
 * 🔧 GPU 버퍼들 생성
 */
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
        label: 'float16_input_float32_buffer'
    });

    const outputBuffer = gpuDevice.createBuffer({
        size: pixelCount * 8, // Float16 RGBA = 8 bytes per pixel (2 u32s per pixel)
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        label: 'float16_output_float16_buffer'
    });

    const constantsBuffer = gpuDevice.createBuffer({
        size: 8, // u32 + u32 (4 + 4 bytes)
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        label: 'float16_constants_buffer'
    });

    const readBuffer = gpuDevice.createBuffer({
        size: pixelCount * 8,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        label: 'float16_read_buffer'
    });

    // 🔧 입력 데이터 업로드
    gpuDevice.queue.writeBuffer(inputBuffer, 0, float32Data);

    return {inputBuffer, outputBuffer, constantsBuffer, readBuffer};
}

/**
 * 🔧 상수 데이터 업로드
 */
function uploadConstants(gpuDevice: GPUDevice, constantsBuffer: GPUBuffer, width: number, height: number): void {
    const constantsData = new ArrayBuffer(8);
    const constantsView = new DataView(constantsData);
    constantsView.setUint32(0, width, true); // width
    constantsView.setUint32(4, height, true); // height
    gpuDevice.queue.writeBuffer(constantsBuffer, 0, constantsData);
}

/**
 * 🔧 파이프라인 및 바인드 그룹 생성
 */
function createPipelineAndBindGroup(gpuDevice: GPUDevice, computeShader: GPUShaderModule, buffers: Float16ConversionBuffers): {
    computePipeline: GPUComputePipeline;
    bindGroup: GPUBindGroup;
} {
    const computePipeline = gpuDevice.createComputePipeline({
        layout: 'auto',
        compute: {
            module: computeShader,
            entryPoint: 'main'
        },
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

/**
 * 🔧 컴퓨트 패스 실행
 */
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
    const commandEncoder = gpuDevice.createCommandEncoder({
        label: 'float16_conversion_encoder'
    });

    const computePass = commandEncoder.beginComputePass({
        label: 'float16_conversion_pass'
    });

    computePass.setPipeline(computePipeline);
    computePass.setBindGroup(0, bindGroup);

    // 🔧 워크그룹 수 계산
    const workgroupsX = Math.ceil(width / workgroupSize[0]);
    const workgroupsY = Math.ceil(height / workgroupSize[1]);
    console.log(`워크그룹 디스패치: ${workgroupsX} × ${workgroupsY} (최대: 65535)`);

    // 🔧 GPU 제한 확인
    if (workgroupsX > 65535 || workgroupsY > 65535) {
        throw new Error(`이미지가 너무 큽니다. 최대 크기: ${65535 * workgroupSize[0]} × ${65535 * workgroupSize[1]}`);
    }

    computePass.dispatchWorkgroups(workgroupsX, workgroupsY);
    computePass.end();

    // 🔧 결과를 읽기용 버퍼로 복사
    commandEncoder.copyBufferToBuffer(
        outputBuffer, 0,
        readBuffer, 0,
        pixelCount * 8 // Float16 RGBA = 8 bytes per pixel
    );

    gpuDevice.queue.submit([commandEncoder.finish()]);

    // 🔧 결과 읽기
    await readBuffer.mapAsync(GPUMapMode.READ);
    const packedData = new Uint32Array(readBuffer.getMappedRange());
    const uint16Data = packedData.byteLength > 0
        ? new Uint16Array(packedData.buffer.slice(packedData.byteOffset, packedData.byteOffset + packedData.byteLength))
        : new Uint16Array(8); // 기본 크기
    readBuffer.unmap();

    return uint16Data;
}

/**
 * 🗑️ 버퍼 정리
 */
function cleanupBuffers(buffers: Float16ConversionBuffers): void {
    buffers.inputBuffer.destroy();
    buffers.outputBuffer.destroy();
    buffers.constantsBuffer.destroy();
    buffers.readBuffer.destroy();
}