import RedGPUContext from "../../context/RedGPUContext";

class JitteredFrameCopyManager {
	#redGPUContext: RedGPUContext
	#name: string
	#jitteredCopyPipeline: GPUComputePipeline
	#jitteredCopyBindGroupLayout: GPUBindGroupLayout
	#jitteredCopyShader: GPUShaderModule

	constructor(redGPUContext: RedGPUContext, name: string) {
		this.#redGPUContext = redGPUContext;
		this.#name = `${name}_JITTERED_FRAME_COPY`;
		this.#initJitteredCopyShader();
	}

	// 🎯 지터 적용된 복사를 위한 셰이더 초기화
	#initJitteredCopyShader() {
		const {resourceManager} = this.#redGPUContext;

		const jitteredCopyShaderCode = `
			@group(0) @binding(0) var sourceTexture: texture_2d<f32>;
			@group(0) @binding(1) var targetTexture: texture_storage_2d<rgba8unorm, write>;
			@group(0) @binding(2) var<uniform> jitterOffset: vec2<f32>;

			@compute @workgroup_size(8, 8, 1)
			fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
				let index = vec2<u32>(global_id.xy);
				let dimensions = textureDimensions(sourceTexture);

				if (index.x >= dimensions.x || index.y >= dimensions.y) {
					return;
				}

				let jitteredCoord = vec2<f32>(f32(index.x), f32(index.y)) + jitterOffset;

				var sampledColor: vec4<f32>;
				if (jitteredCoord.x >= 0.0 && jitteredCoord.y >= 0.0 &&
					jitteredCoord.x < f32(dimensions.x - 1u) && jitteredCoord.y < f32(dimensions.y - 1u)) {

					let coordFloor = floor(jitteredCoord);
					let coordFract = jitteredCoord - coordFloor;

					let coord00 = vec2<u32>(coordFloor);
					let coord10 = coord00 + vec2<u32>(1u, 0u);
					let coord01 = coord00 + vec2<u32>(0u, 1u);
					let coord11 = coord00 + vec2<u32>(1u, 1u);

					var sample00 = textureLoad(sourceTexture, coord00, 0);
					var sample10 = sample00;
					var sample01 = sample00;
					var sample11 = sample00;

					if (coord10.x < dimensions.x) { sample10 = textureLoad(sourceTexture, coord10, 0); }
					if (coord01.y < dimensions.y) { sample01 = textureLoad(sourceTexture, coord01, 0); }
					if (coord11.x < dimensions.x && coord11.y < dimensions.y) { 
						sample11 = textureLoad(sourceTexture, coord11, 0); 
					}

					let top = mix(sample00, sample10, coordFract.x);
					let bottom = mix(sample01, sample11, coordFract.x);
					sampledColor = mix(top, bottom, coordFract.y);
				} else {
					let clampedCoord = clamp(vec2<u32>(jitteredCoord), vec2<u32>(0u), dimensions - vec2<u32>(1u));
					sampledColor = textureLoad(sourceTexture, clampedCoord, 0);
				}

				textureStore(targetTexture, index, sampledColor);
			}
		`;

		this.#jitteredCopyShader = resourceManager.createGPUShaderModule(
			`${this.#name}_SHADER`,
			{code: jitteredCopyShaderCode}
		);

		// 바인드 그룹 레이아웃 생성
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

		// 파이프라인 생성
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

	/**
	 * 🚀 지터 적용된 현재 프레임 복사 - 실제로 다른 서브픽셀 정보를 저장
	 */
	copyCurrentFrameToArrayWithJitter(
		sourceTextureView: GPUTextureView,
		frameBufferArrayTexture: GPUTexture,
		currentSliceIndex: number,
		jitter: number[],
		frameIndex: number,
		outputTexture: GPUTexture
	) {
		const {gpuDevice} = this.#redGPUContext;

		// 🎯 프레임 인덱스 기반 미세 조정
		const framePhase = frameIndex * 0.1;
		const microJitterX = jitter[0] + Math.sin(framePhase) * 0.08;
		const microJitterY = jitter[1] + Math.cos(framePhase * 1.2) * 0.08;

		// 지터 uniform 버퍼 생성
		const jitterBuffer = gpuDevice.createBuffer({
			size: 8, // vec2<f32>
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			label: `${this.#name}_JITTER_UNIFORM_BUFFER`
		});

		// 🎯 개선된 지터 데이터 업로드
		const jitterData = new Float32Array([microJitterX, microJitterY]);
		gpuDevice.queue.writeBuffer(jitterBuffer, 0, jitterData);

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
				{ binding: 2, resource: { buffer: jitterBuffer } }
			]
		});

		// 지터 적용된 복사 실행
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

		// 정리
		jitterBuffer.destroy();
	}

	destroy() {
		// 리소스 정리가 필요한 경우 여기에 추가
		// GPU 리소스들은 ResourceManager가 관리하므로 별도 정리 불필요
	}
}

Object.freeze(JitteredFrameCopyManager);
export default JitteredFrameCopyManager;
