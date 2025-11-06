import RedGPUContext from "../RedGPUContext";

/**
 * @description `RedGPUContextDetector` 클래스는 주어진 `RedGPUContext`
 * 객체로부터 GPUAdapter를 분석해 아래와 같은 정보를 제공한다.
 *
 * - Adapter 정보(`adapterInfo`) 및 현재 사용중인 `limits`,
 * - fallback 여부(`isFallbackAdapter`) 판단,
 * - 제한값을 그룹화한(`groupedLimits`) 자료구조 제공,
 * - 사용자 에이전(UA) 정보를 반환하고, 모바일 디바이스 여부를 판정한다.
 */
class RedGPUContextDetector {
	/* Adapter 관련 정보 (예: 이름, 벤더 등). 내부적으로 `GPUAdapterInfo` 형태로 저장된다. */
	#adapterInfo: GPUAdapterInfo;
	/* GPU가 지원하는 한계(`GPUSupportedLimits`) 를 담는다. */
	#limits: GPUSupportedLimits;
	/* 현재 사용중인 adapter 가 fallback 여부를 표시한다 (`true` 인 경우, 실제 하드웨어 대신 Fallback Adapter를 사용). */
	#isFallbackAdapter: boolean;
	/* `#groupedLimits` 는 원래의 `#limits` 를 범주별(`TextureLimits`, `BufferLimits` 등)로 그룹화한 자료구조. */
	#groupedLimits: any;
	/* 브라우저가 가진 User‑Agent 문자열. */
	#userAgent: string;

	/**
	 * @description 생성자. 전달받은 `RedGPUContext` 인스턴스에서 GPUAdapter 를 추출해
	 * 내부 프로퍼티를 초기화한다.
	 *
	 * @param {RedGPUContext} redGPUContext - 컨텍스트 객체(구현적으로 `gpuAdapter` 속성 포함). */
	constructor(redGPUContext: RedGPUContext) {
		this.#init(redGPUContext.gpuAdapter);
		console.log(this); // 디버그용
	}

	/**
	 * @returns {GPUAdapterInfo} 현재 사용중인 GPUAdapter 의 정보를 반환한다. */
	get adapterInfo(): GPUAdapterInfo {
		return this.#adapterInfo;
	}

	/**
	 * @returns {GPUSupportedLimits} 현재 사용 중인 GPU의 한계값을 반환한다. */
	get limits(): GPUSupportedLimits {
		return this.#limits;
	}

	/**
	 * @returns {boolean} 현재 adapter 가 fallback인지 여부를 반환한다 (`true` 은 Fallback Adapter임). */
	get isFallbackAdapter(): boolean {
		return this.#isFallbackAdapter;
	}

	/**
	 * @returns {any} 그룹화된 한계값. 내부적으로 `groupedLimits` 프로퍼티에 저장된다. */
	get groupedLimits(): any {
		return this.#groupedLimits;
	}

	/**
	 * @returns {string} 브라우저가 가진 User‑Agent 문자열을 반환한다. */
	get userAgent(): string {
		return this.#userAgent;
	}

	/**
	 * @description 모바일 디바이스인지 여부를 판단한다.
	 *
	 * @returns {boolean} `true` 라면 모바일 기기(안드로이드, iOS 등) 를 사용 중임. */
	get isMobile(): boolean {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Kindle|Silk|PlayBook/i.test(navigator.userAgent);
	}

	/* -------------------------------------------------------------------------- */

	/* 내부 유틸리티 메서드 */
	/**
	 * @description `#init` 는 주어진 GPUAdapter 를 분석해 내부 프로퍼티들을 초기화한다.
	 *
	 * @param {GPUAdapter} gpuAdapter - 현재 사용중인 Adapter 객체. */
	#init(gpuAdapter: GPUAdapter) {
		this.#userAgent = navigator.userAgent;
		this.#parseAdapter(gpuAdapter);
		this.#parseLimits();
	}

	/**
	 * @description `#parseAdapter` 는 주어진 `gpuAdapter` 로부터 adapter 정보를 추출하고
	 * 내부 프로퍼티(`#adapterInfo`, `#isFallbackAdapter`, `#limits`) 를 세팅한다.
	 *
	 * @param {GPUAdapter} gpuAdapter - 현재 사용중인 GPU Adapter 객체. */
	#parseAdapter(gpuAdapter: GPUAdapter) {
		if (gpuAdapter) {
			const {limits, info} = gpuAdapter;
			const {isFallbackAdapter} = info;
			this.#adapterInfo = info;
			this.#isFallbackAdapter = isFallbackAdapter;
			this.#limits = limits;
		}
	}

	/**
	 * @description `#parseLimits` 는 `#limits` 객체를 읽어
	 * `groupSettings` 으해 정의한 그룹별로 재배치한다.
	 *
	 * 내부적으로 다음과 같은 그룹을 구성한다. */
	#parseLimits() {
		const groupSettings = {
			"TextureLimits": [
				'maxTextureDimension1D',
				'maxTextureDimension2D',
				'maxTextureDimension3D',
				'maxTextureArrayLayers',
				'maxSampledTexturesPerShaderStage',
				'maxSamplersPerShaderStage'
			],
			"BufferLimits": [
				'maxBindGroups',
				'maxBindGroupsPlusVertexBuffers',
				'maxBindingsPerBindGroup',
				'maxDynamicUniformBuffersPerPipelineLayout',
				'maxDynamicStorageBuffersPerPipelineLayout',
				'maxStorageBuffersPerShaderStage',
				'maxStorageTexturesPerShaderStage',
				'maxUniformBuffersPerShaderStage',
				'maxUniformBufferBindingSize',
				'maxStorageBufferBindingSize',
				'minUniformBufferOffsetAlignment',
				'minStorageBufferOffsetAlignment',
				'maxBufferSize'
			],
			"PipelineAndShaderLimits": [
				'maxVertexBuffers',
				'maxVertexAttributes',
				'maxVertexBufferArrayStride',
				'maxInterStageShaderComponents',
				'maxInterStageShaderVariables'
			],
			"ComputeLimits": [
				'maxComputeWorkgroupStorageSize',
				'maxComputeInvocationsPerWorkgroup',
				'maxComputeWorkgroupSizeX',
				'maxComputeWorkgroupSizeY',
				'maxComputeWorkgroupSizeZ',
				'maxComputeWorkgroupsPerDimension'
			],
			"ColorLimits": [
				'maxColorAttachments',
				'maxColorAttachmentBytesPerSample'
			]
		};
		const groupedLimits = {
			"TextureLimits": {},
			"BufferLimits": {},
			"PipelineAndShaderLimits": {},
			"ComputeLimits": {},
			"ColorLimits": {},
			"EtcLimit": {}
		};
		for (const limit in this.#limits) {
			let found = false;
			for (const group in groupSettings) {
				if (groupSettings[group].includes(limit)) {
					groupedLimits[group][limit] = this.#limits[limit];
					found = true;
					break;
				}
			}
			if (!found) {
				groupedLimits["EtcLimit"][limit] = this.#limits[limit];
			}
		}
		this.#groupedLimits = groupedLimits;
	}
}

export default RedGPUContextDetector;
