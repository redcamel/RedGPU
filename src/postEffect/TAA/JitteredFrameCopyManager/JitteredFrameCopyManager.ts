import RedGPUContext from "../../../context/RedGPUContext";
import jitteredCopyShaderCode from "./computeCode.wgsl";

class JitteredFrameCopyManager {
	#redGPUContext: RedGPUContext
	#name: string
	#jitteredCopyPipeline: GPUComputePipeline
	#jitteredCopyBindGroupLayout: GPUBindGroupLayout
	#jitteredCopyShader: GPUShaderModule
	// 🔧 성능 개선: 버퍼 재사용
	#frameParamsBuffer: GPUBuffer
	#isDestroyed: boolean = false

	constructor(redGPUContext: RedGPUContext, name: string) {
		this.#redGPUContext = redGPUContext;
		this.#name = `${name}_JITTERED_FRAME_COPY`;
		this.#initJitteredCopyShader();
		this.#initBuffers();
	}

	#initBuffers() {
		const {gpuDevice} = this.#redGPUContext;

		// 🔧 재사용 가능한 uniform 버퍼 생성
		this.#frameParamsBuffer = gpuDevice.createBuffer({
			size: 16,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			label: `${this.#name}_FRAME_PARAMS_BUFFER`
		});
	}

	#initJitteredCopyShader() {
		const {resourceManager} = this.#redGPUContext;

		this.#jitteredCopyShader = resourceManager.createGPUShaderModule(
			`${this.#name}_SHADER`,
			{code: jitteredCopyShaderCode}
		);

		this.#jitteredCopyBindGroupLayout = resourceManager.createBindGroupLayout(
			`${this.#name}_BIND_GROUP_LAYOUT`,
			{
				entries: [
					{
						binding: 0,
						visibility: GPUShaderStage.COMPUTE,
						texture: { sampleType: 'float', viewDimension: '2d' }
					},
					{
						binding: 1,
						visibility: GPUShaderStage.COMPUTE,
						storageTexture: { access: 'write-only', format: 'rgba8unorm', viewDimension: '2d' }
					},
					{
						binding: 2,
						visibility: GPUShaderStage.COMPUTE,
						buffer: { type: 'uniform' }
					}
				]
			}
		);

		const {gpuDevice} = this.#redGPUContext;
		this.#jitteredCopyPipeline = gpuDevice.createComputePipeline({
			label: `${this.#name}_PIPELINE`,
			layout: gpuDevice.createPipelineLayout({
				bindGroupLayouts: [this.#jitteredCopyBindGroupLayout]
			}),
			compute: {
				module: this.#jitteredCopyShader,
				entryPoint: 'main'
			}
		});
	}

	#ensureBufferValid() {
		if (this.#isDestroyed || !this.#frameParamsBuffer) {
			const {gpuDevice} = this.#redGPUContext;
			this.#frameParamsBuffer = gpuDevice.createBuffer({
				size: 16,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
				label: `${this.#name}_FRAME_PARAMS_BUFFER`
			});
			this.#isDestroyed = false;
		}
	}

	/**
	 * 🚀 개선된 지터 적용 프레임 복사
	 */
	copyCurrentFrameToArrayWithJitter(
		sourceTextureView: GPUTextureView,
		frameBufferArrayTexture: GPUTexture,
		currentSliceIndex: number,
		jitterStrength: number,
		frameIndex: number,
		outputTexture: GPUTexture
	) {
		// 🔧 파괴된 상태 체크 및 버퍼 유효성 확인
		if (this.#isDestroyed) {
			console.warn('JitteredFrameCopyManager is destroyed, attempting to recreate buffer');
		}

		this.#ensureBufferValid();

		const {gpuDevice} = this.#redGPUContext;

		// 🔧 단순하고 효과적인 랜덤 시드
		const timeBasedSeed = Date.now() % 10000;
		const frameBasedSeed = (frameIndex * 1.618033988749) % 1000; // 황금비
		const combinedSeed = (timeBasedSeed + frameBasedSeed) % 1000;

		// 🔧 개선된 파라미터 설정
		// [frameIndex, sliceIndex, jitterStrength, randomSeed]
		const frameParamsData = new Float32Array([
			frameIndex,
			currentSliceIndex,
			jitterStrength,
			combinedSeed
		]);

		// 🔧 버퍼 재사용
		gpuDevice.queue.writeBuffer(this.#frameParamsBuffer, 0, frameParamsData);

		// 슬라이스별 뷰 생성
		const targetSliceView = frameBufferArrayTexture.createView({
			dimension: '2d',
			baseArrayLayer: currentSliceIndex,
			arrayLayerCount: 1,
			format: 'rgba8unorm'
		});

		// 바인드 그룹 생성
		const bindGroup = gpuDevice.createBindGroup({
			layout: this.#jitteredCopyBindGroupLayout,
			entries: [
				{ binding: 0, resource: sourceTextureView },
				{ binding: 1, resource: targetSliceView },
				{ binding: 2, resource: { buffer: this.#frameParamsBuffer } }
			]
		});

		const commandEncoder = gpuDevice.createCommandEncoder({
			label: `${this.#name}_COMMAND_ENCODER`
		});
		const computePass = commandEncoder.beginComputePass({
			label: `${this.#name}_COMPUTE_PASS`
		});

		computePass.setPipeline(this.#jitteredCopyPipeline);
		computePass.setBindGroup(0, bindGroup);
		computePass.dispatchWorkgroups(
			Math.ceil(outputTexture.width / 8),
			Math.ceil(outputTexture.height / 8)
		);

		computePass.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
	}

	destroy() {
		if (this.#frameParamsBuffer && !this.#isDestroyed) {
			this.#frameParamsBuffer.destroy();
			this.#frameParamsBuffer = null;
			this.#isDestroyed = true;
		}
	}
}

Object.freeze(JitteredFrameCopyManager);
export default JitteredFrameCopyManager;
