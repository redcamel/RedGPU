import RedGPUContext from "../../../../context/RedGPUContext";

export interface ToneMappingOptions {
	exposure: number;
	width: number;
	height: number;
	workgroupSize?: [number, number];
}

export interface ToneMappingResult {
	data: Uint8Array;
	processedPixels: number;
	executionTime: number;
}

/**
 * 🎬 GPU 기반 HDR 톤매핑 유틸리티
 * ACES 톤매핑과 감마 보정을 통해 Float32 → Uint8 변환
 */
export async function float32ToUint8WithToneMapping(
	redGPUContext: RedGPUContext,
	float32Data: Float32Array,
	options: ToneMappingOptions
): Promise<ToneMappingResult> {
	const startTime = performance.now();
	const {gpuDevice} = redGPUContext;
	const {exposure, width, height, workgroupSize = [8, 8]} = options;

	const pixelCount = float32Data.length / 4; // RGBA
	console.log(`GPU Float32 → Uint8 변환 (ACES 톤매핑, 노출: ${exposure.toFixed(3)})`);
	console.log(`총 픽셀 수: ${pixelCount.toLocaleString()}`);

	// 🔧 컴퓨트 셰이더 코드
	const computeShaderCode = createToneMappingShaderCode(workgroupSize);

	try {
		// 🔧 컴퓨트 셰이더 생성
		const computeShader = gpuDevice.createShaderModule({
			code: computeShaderCode,
			label: 'hdr_tonemapping_shader'
		});

		// 🔧 버퍼들 생성
		const buffers = createBuffers(gpuDevice, float32Data, pixelCount);

		// 🔧 상수 데이터 업로드
		uploadConstants(gpuDevice, buffers.constantsBuffer, exposure, width, height);

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
			buffers.outputBuffer, // outputBuffer를 직접 전달
			buffers.readBuffer,
			width,
			height,
			workgroupSize,
			pixelCount
		);

		// 🗑️ 버퍼 정리
		cleanupBuffers(buffers);

		const executionTime = performance.now() - startTime;
		console.log(`GPU 톤매핑 완료: ${pixelCount.toLocaleString()}픽셀 처리 (${executionTime.toFixed(2)}ms)`);

		return {
			data: result,
			processedPixels: pixelCount,
			executionTime
		};

	} catch (error) {
		console.error('톤매핑 처리 실패:', error);
		throw error;
	}
}

/**
 * 🎨 톤매핑 컴퓨트 셰이더 코드 생성
 */
function createToneMappingShaderCode(workgroupSize: [number, number]): string {
	return `
        struct Constants {
            exposure: f32,
            width: u32,
            height: u32,
        }
        
        @group(0) @binding(0) var<storage, read> inputData: array<f32>;
        @group(0) @binding(1) var<storage, read_write> outputData: array<u32>;
        @group(0) @binding(2) var<uniform> constants: Constants;
        
        /* ACES 톤매핑 함수 */
        fn acesToneMapping(x: f32) -> f32 {
            let a = 2.51;
            let b = 0.03;
            let c = 2.43;
            let d = 0.59;
            let e = 0.14;
            return max(0.0, (x * (a * x + b)) / (x * (c * x + d) + e));
        }
        
        /* Linear → sRGB 감마 보정 */
        fn linearToSRGB(linearValue: f32) -> f32 {
            if (linearValue <= 0.0031308) {
                return 12.92 * linearValue;
            } else {
                return 1.055 * pow(linearValue, 1.0 / 2.4) - 0.055;
            }
        }
        
        @compute @workgroup_size(${workgroupSize[0]}, ${workgroupSize[1]})
        fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
            let x = global_id.x;
            let y = global_id.y;
            
            /* 범위 체크 */
            if (x >= constants.width || y >= constants.height) {
                return;
            }
            
            let pixelIndex = y * constants.width + x;
            let baseIndex = pixelIndex * 4u;
            
            /* 🎯 RGBA 각 채널 처리 */
            var processedPixel = 0u;
            
            for (var channel = 0u; channel < 4u; channel++) {
                let inputIndex = baseIndex + channel;
                let originalVal = inputData[inputIndex];
                
                /* 🎯 노출값 적용 */
                let exposedVal = originalVal * constants.exposure;
                
                /* 🎬 ACES 톤매핑 적용 */
                let toneMappedVal = acesToneMapping(exposedVal);
                
                /* 🔧 감마 보정 적용 (sRGB) */
                let gammaCorrectedVal = linearToSRGB(toneMappedVal);
                
                /* 🎯 최종 8bit 변환 */
                let uint8Val = u32(round(clamp(gammaCorrectedVal, 0.0, 1.0) * 255.0));
                
                /* 🔧 4개 채널을 하나의 u32에 패킹 */
                processedPixel |= (uint8Val << (channel * 8u));
            }
            
            outputData[pixelIndex] = processedPixel;
        }
    `;
}

/**
 * 🔧 GPU 버퍼들 생성
 */
interface ToneMappingBuffers {
	inputBuffer: GPUBuffer;
	outputBuffer: GPUBuffer;
	constantsBuffer: GPUBuffer;
	readBuffer: GPUBuffer;
}

function createBuffers(gpuDevice: GPUDevice, float32Data: Float32Array, pixelCount: number): ToneMappingBuffers {
	const inputBuffer = gpuDevice.createBuffer({
		size: float32Data.byteLength,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		label: 'hdr_input_float32_buffer'
	});

	const outputBuffer = gpuDevice.createBuffer({
		size: pixelCount * 4, // u32 per pixel
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
		label: 'hdr_output_uint8_buffer'
	});

	const constantsBuffer = gpuDevice.createBuffer({
		size: 12, // f32 + u32 + u32 (4 + 4 + 4 bytes)
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		label: 'hdr_constants_buffer'
	});

	const readBuffer = gpuDevice.createBuffer({
		size: pixelCount * 4,
		usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
		label: 'hdr_read_buffer'
	});

	// 🔧 입력 데이터 업로드
	gpuDevice.queue.writeBuffer(inputBuffer, 0, float32Data);

	return {inputBuffer, outputBuffer, constantsBuffer, readBuffer};
}

/**
 * 🔧 상수 데이터 업로드
 */
function uploadConstants(gpuDevice: GPUDevice, constantsBuffer: GPUBuffer, exposure: number, width: number, height: number): void {
	const constantsData = new ArrayBuffer(12);
	const constantsView = new DataView(constantsData);
	constantsView.setFloat32(0, exposure, true); // exposure
	constantsView.setUint32(4, width, true); // width
	constantsView.setUint32(8, height, true); // height
	gpuDevice.queue.writeBuffer(constantsBuffer, 0, constantsData);
}

/**
 * 🔧 파이프라인 및 바인드 그룹 생성
 */
function createPipelineAndBindGroup(gpuDevice: GPUDevice, computeShader: GPUShaderModule, buffers: ToneMappingBuffers): {
	computePipeline: GPUComputePipeline;
	bindGroup: GPUBindGroup;
} {
	const computePipeline = gpuDevice.createComputePipeline({
		layout: 'auto',
		compute: {
			module: computeShader,
			entryPoint: 'main'
		},
		label: 'hdr_tonemapping_pipeline'
	});

	const bindGroup = gpuDevice.createBindGroup({
		layout: computePipeline.getBindGroupLayout(0),
		entries: [
			{binding: 0, resource: {buffer: buffers.inputBuffer}},
			{binding: 1, resource: {buffer: buffers.outputBuffer}},
			{binding: 2, resource: {buffer: buffers.constantsBuffer}}
		],
		label: 'hdr_tonemapping_bindgroup'
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
	outputBuffer: GPUBuffer, // outputBuffer를 직접 받음
	readBuffer: GPUBuffer,
	width: number,
	height: number,
	workgroupSize: [number, number],
	pixelCount: number
): Promise<Uint8Array> {
	const commandEncoder = gpuDevice.createCommandEncoder({
		label: 'hdr_tonemapping_encoder'
	});

	const computePass = commandEncoder.beginComputePass({
		label: 'hdr_tonemapping_pass'
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

	// 🔧 결과를 읽기용 버퍼로 복사 - outputBuffer를 직접 사용
	commandEncoder.copyBufferToBuffer(
		outputBuffer, 0,
		readBuffer, 0,
		pixelCount * 4
	);

	gpuDevice.queue.submit([commandEncoder.finish()]);

	// 🔧 결과 읽기
	await readBuffer.mapAsync(GPUMapMode.READ);
	const packedData = new Uint32Array(readBuffer.getMappedRange());

	const uint8Data = packedData.byteLength > 0
		? new Uint8Array(packedData.buffer.slice(packedData.byteOffset, packedData.byteOffset + packedData.byteLength))
		: new Uint8Array(4); // 기본 크기

	readBuffer.unmap();
	return uint8Data;
}

/**
 * 🗑️ 버퍼 정리
 */
function cleanupBuffers(buffers: ToneMappingBuffers): void {
	buffers.inputBuffer.destroy();
	buffers.outputBuffer.destroy();
	buffers.constantsBuffer.destroy();
	buffers.readBuffer.destroy();
}
