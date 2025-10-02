import RedGPUContext from "../../../context/RedGPUContext";
import getMipLevelCount from "../../../utils/texture/getMipLevelCount";
import createUUID from "../../../utils/uuid/createUUID";
import Sampler from "../../sampler/Sampler";
import computeShaderCode from "./computeShader.wgsl";

/**
 * 컴포넌트 매핑 타입 정의 (r/g/b/a 채널별 매핑)
 */
type ComponentMapping = {
	r?: 'r' | 'g' | 'b' | 'a';
	g?: 'r' | 'g' | 'b' | 'a';
	b?: 'r' | 'g' | 'b' | 'a';
	a?: 'r' | 'g' | 'b' | 'a';
};
/**
 * 패킹된 텍스처 캐시 맵
 */
const cacheMap: Map<string, { gpuTexture: GPUTexture, useNum: number, mappingKey: string, uuid: string }> = new Map();
/**
 * 인스턴스별 현재 사용 중인 키 추적용 WeakMap
 */
const instanceMappingKeys: WeakMap<PackedTexture, string> = new WeakMap();
let globalPipeline: GPURenderPipeline;
let globalBindGroupLayout: GPUBindGroupLayout;
let mappingBuffer: GPUBuffer;

/**
 * 여러 텍스처의 채널을 조합해 하나의 텍스처로 패킹하는 유틸리티 클래스입니다.
 * @category Texture
 */
class PackedTexture {
	/** 인스턴스 고유 식별자 */
	#uuid: string = createUUID();
	/** RedGPUContext 인스턴스 */
	#redGPUContext: RedGPUContext;
	/** 샘플러 객체 */
	#sampler: GPUSampler;
	/** 패킹 결과 GPUTexture 객체 */
	#gpuTexture: GPUTexture;
	/** GPU 디바이스 객체 */
	#gpuDevice: GPUDevice;
	/** 바인드 그룹 객체 */
	#bindGroup: GPUBindGroup;
	/** 임시 바인드 그룹 캐시 */
	#tempBindGroupCache: Map<string, GPUBindGroup> = new Map();

	/**
	 * PackedTexture 생성자
	 * @param redGPUContext - RedGPUContext 인스턴스
	 */
	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#gpuDevice = redGPUContext.gpuDevice;
		this.#initializeGlobals();
		this.#sampler = this.#createSampler();
	}

	/** 인스턴스 고유 식별자 반환 */
	get uuid(): string {
		return this.#uuid;
	}

	/** 패킹 결과 GPUTexture 객체 반환 */
	get gpuTexture(): GPUTexture {
		return this.#gpuTexture;
	}

	/** 패킹 텍스처 캐시 맵 반환 (static) */
	static getCacheMap() {
		return cacheMap;
	}

	/**
	 * 여러 텍스처의 채널을 조합해 패킹 텍스처를 생성합니다.
	 * @param textures - r/g/b/a 채널별 GPUTexture 객체
	 * @param width - 결과 텍스처의 가로 크기
	 * @param height - 결과 텍스처의 세로 크기
	 * @param label - 텍스처 레이블(옵션)
	 * @param componentMapping - 채널별 매핑 정보(옵션)
	 */
	async packing(
		textures: { r?: GPUTexture; g?: GPUTexture; b?: GPUTexture; a?: GPUTexture },
		width: number,
		height: number,
		label?: string,
		componentMapping?: ComponentMapping
	) {
		// 캐시 초기화 (새로운 패킹 작업 시작 시)
		const mapping = {
			r: 'r',
			g: 'g',
			b: 'b',
			a: 'a',
			...componentMapping
		};
		const textureKey = `${textures.r?.label || ''}_${textures.g?.label || ''}_${textures.b?.label || ''}_${textures.a?.label || ''}`;
		const mappingKey = `${JSON.stringify(mapping)}_${textureKey}`;
		if (!textures.r && !textures.g && !textures.b && !textures.a) {
			return;
		}
		// 새로운 캐시 관리 방식
		this.#handleCacheManagement(mappingKey);
		const currEntry = cacheMap.get(mappingKey);
		if (currEntry) {
			// 캐시 정리 (기존 텍스처 사용 시)
			return;
		}
		// Create new texture
		await this.#createPackedTexture(textures, width, height, label, mapping, mappingKey);
		// 캐시 정리 (새 텍스처 생성 완료 후)
	}

	/**
	 * 인스턴스 정리 메서드
	 */
	destroy() {
		// 인스턴스 삭제 시 캐시 정리
		const currentMappingKey = instanceMappingKeys.get(this);
		if (currentMappingKey) {
			const entry = cacheMap.get(currentMappingKey);
			if (entry) {
				entry.useNum--;
				if (entry.useNum === 0) {
					entry.gpuTexture?.destroy();
					cacheMap.delete(currentMappingKey);
				}
			}
			instanceMappingKeys.delete(this);
		}
	}

	/**
	 * 글로벌 리소스(파이프라인, 레이아웃, 매핑버퍼) 초기화
	 */
	#initializeGlobals() {
		mappingBuffer = this.#redGPUContext.resourceManager.createGPUBuffer('PACK_TEXTURE_MAPPING_BUFFER', {
			size: 16, // 4개 컴포넌트 * 4바이트
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});
		if (!globalBindGroupLayout) {
			globalBindGroupLayout = this.#redGPUContext.resourceManager.createBindGroupLayout(
				'PACK_TEXTURE_BIND_GROUP_LAYOUT',
				{
					entries: [
						{binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {}},
						{binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {}},
						{binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {}},
						{binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: {}},
						{binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: {}},
						{binding: 5, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'uniform'}}
					]
				}
			);
		}
		if (!globalPipeline) {
			globalPipeline = this.#createPipeline();
		}
	}

	/**
	 * 텍스처 조합에 맞는 바인드 그룹을 갱신합니다.
	 * @param textures - r/g/b/a 채널별 GPUTexture 객체
	 */
	#updateBindGroup(textures: { r?: GPUTexture; g?: GPUTexture; b?: GPUTexture; a?: GPUTexture }) {
		const textureKey = `${textures.r?.label || 'empty'}_${textures.g?.label || 'empty'}_${textures.b?.label || 'empty'}_${textures.a?.label || 'empty'}`;
		const {resourceManager} = this.#redGPUContext
		if (!this.#tempBindGroupCache.has(textureKey)) {
			const bindGroupEntries = [
				{
					binding: 0,
					resource: resourceManager.getGPUResourceBitmapTextureView(textures.r)
				},
				{
					binding: 1,
					resource: resourceManager.getGPUResourceBitmapTextureView(textures.g)
				},
				{
					binding: 2,
					resource: resourceManager.getGPUResourceBitmapTextureView(textures.b)
				},
				{
					binding: 3,
					resource: resourceManager.getGPUResourceBitmapTextureView(textures.a)
				},
				{binding: 4, resource: this.#sampler},
				{binding: 5, resource: {buffer: mappingBuffer}}
			];
			const bindGroup = this.#gpuDevice.createBindGroup({
				label: `PACK_TEXTURE_BIND_GROUP_${textureKey}`,
				layout: globalBindGroupLayout,
				entries: bindGroupEntries,
			});
			this.#tempBindGroupCache.set(textureKey, bindGroup);
		}
		this.#bindGroup = this.#tempBindGroupCache.get(textureKey)!;
	}

	/**
	 * 캐시 관리 및 사용 횟수 갱신
	 * @param mappingKey - 매핑 키 문자열
	 */
	#handleCacheManagement(mappingKey: string) {
		// 현재 인스턴스가 사용 중인 이전 키 확인
		const prevMappingKey = instanceMappingKeys.get(this);
		// 이전 키와 현재 키가 다른 경우에만 처리
		if (prevMappingKey && prevMappingKey !== mappingKey) {
			const prevEntry = cacheMap.get(prevMappingKey);
			if (prevEntry) {
				prevEntry.useNum--;
				// keepLog(`텍스처 사용 횟수 감소: ${prevMappingKey} (${prevEntry.useNum})`);
				// 사용 횟수가 0이 되면 삭제
				if (prevEntry.useNum === 0) {
					// keepLog('삭제된 텍스쳐', prevEntry);
					prevEntry.gpuTexture?.destroy();
					cacheMap.delete(prevMappingKey);
					// keepLog('이전키가 더이상 사용되지 않아서 캐시에서 삭제함', prevEntry);
				}
			}
		}
		// 현재 키에 대한 처리
		const currEntry = cacheMap.get(mappingKey);
		if (currEntry) {
			this.#gpuTexture = currEntry.gpuTexture;
			currEntry.useNum++;
			// keepLog('기존 생성된 텍스쳐를 사용함', currEntry);
		}
		// 현재 인스턴스의 키 업데이트
		instanceMappingKeys.set(this, mappingKey);
	}

	/**
	 * 실제 패킹 텍스처를 생성합니다.
	 * @param textures - r/g/b/a 채널별 GPUTexture 객체
	 * @param width - 결과 텍스처의 가로 크기
	 * @param height - 결과 텍스처의 세로 크기
	 * @param label - 텍스처 레이블
	 * @param mapping - 채널별 매핑 정보
	 * @param mappingKey - 매핑 키 문자열
	 */
	async #createPackedTexture(
		textures: { r?: GPUTexture; g?: GPUTexture; b?: GPUTexture; a?: GPUTexture },
		width: number,
		height: number,
		label: string | undefined,
		mapping: any,
		mappingKey: string
	) {
		const textureDescriptor: GPUTextureDescriptor = {
			size: [width, height, 1],
			format: 'rgba8unorm',
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
			label: label || `PACK_TEXTURE_${createUUID()}`,
			mipLevelCount: getMipLevelCount(width, height)
		};
		if (this.#gpuTexture) {
			this.#gpuTexture = null;
		}
		const packedTexture = this.#redGPUContext.resourceManager.createManagedTexture(textureDescriptor);
		const mappingData = new Uint32Array([
			['r', 'g', 'b', 'a'].indexOf(mapping.r),
			['r', 'g', 'b', 'a'].indexOf(mapping.g),
			['r', 'g', 'b', 'a'].indexOf(mapping.b),
			['r', 'g', 'b', 'a'].indexOf(mapping.a),
		]);
		this.#gpuDevice.queue.writeBuffer(mappingBuffer, 0, mappingData);
		this.#updateBindGroup(textures);
		this.#executeRenderPass(packedTexture);
		if (textureDescriptor.mipLevelCount > 1) {
			this.#gpuTexture = this.#redGPUContext.resourceManager.mipmapGenerator.generateMipmap(packedTexture, textureDescriptor);
		} else {
			this.#gpuTexture = packedTexture;
		}
		// 새로운 텍스처를 캐시에 등록
		cacheMap.set(mappingKey, {
			gpuTexture: this.#gpuTexture,
			useNum: 1,
			mappingKey,
			uuid: this.#uuid
		});
		// keepLog('packing 함', cacheMap.get(mappingKey));
		this.#bindGroup = null;
	}

	/**
	 * 패킹 렌더 패스 실행
	 * @param packedTexture - 결과 GPUTexture 객체
	 */
	#executeRenderPass(packedTexture: GPUTexture) {
		const {resourceManager} = this.#redGPUContext;
		const commandEncoder = this.#gpuDevice.createCommandEncoder({
			label: 'PackedTexture_CommandEncoder'
		});
		const passEncoder = commandEncoder.beginRenderPass({
			colorAttachments: [
				{
					view: resourceManager.getGPUResourceBitmapTextureView(packedTexture, {
						baseMipLevel: 0,
						mipLevelCount: 1,
						dimension: '2d',
						label: `${packedTexture.label}_RENDER_TARGET`
					}),
					loadOp: 'clear',
					storeOp: 'store',
					clearValue: [0, 0, 0, 0],
				},
			],
		});
		passEncoder.setPipeline(globalPipeline);
		passEncoder.setBindGroup(0, this.#bindGroup);
		passEncoder.draw(6, 1, 0, 0);
		passEncoder.end();
		this.#gpuDevice.queue.submit([commandEncoder.finish()]);
	}

	/**
	 * 패킹용 렌더 파이프라인 생성
	 * @returns GPURenderPipeline 객체
	 */
	#createPipeline(): GPURenderPipeline {
		const shaderCode = computeShaderCode;
		const {resourceManager} = this.#redGPUContext;
		const pipelineLayout = this.#gpuDevice.createPipelineLayout({
			label: 'PACK_TEXTURE_PIPELINE_LAYOUT',
			bindGroupLayouts: [globalBindGroupLayout]
		});
		return this.#gpuDevice.createRenderPipeline({
			label: 'PACK_TEXTURE_PIPELINE',
			layout: pipelineLayout,
			vertex: {
				module: resourceManager.createGPUShaderModule('PACK_TEXTURE_SHADER_MODULE', {code: shaderCode}),
				entryPoint: 'vertexMain',
			},
			fragment: {
				module: resourceManager.createGPUShaderModule('PACK_TEXTURE_SHADER_MODULE', {code: shaderCode}),
				entryPoint: 'fragmentMain',
				targets: [{format: 'rgba8unorm'}],
			},
			primitive: {topology: 'triangle-list'},
		});
	}

	/**
	 * 샘플러 객체 생성
	 * @returns GPUSampler 객체
	 */
	#createSampler(): GPUSampler {
		return new Sampler(this.#redGPUContext).gpuSampler;
	}
}

export default PackedTexture;
