import RedGPUContext from "../../../context/RedGPUContext";
import {keepLog} from "../../../utils";
import createUUID from "../../../utils/createUUID";
import Sampler from "../../sampler/Sampler";
import computeShaderCode from "./computeShader.wgsl";

type ComponentMapping = {
	r?: 'r' | 'g' | 'b' | 'a';  // r 채널에서 사용할 컴포넌트
	g?: 'r' | 'g' | 'b' | 'a';  // g 채널에서 사용할 컴포넌트
	b?: 'r' | 'g' | 'b' | 'a';  // b 채널에서 사용할 컴포넌트
	a?: 'r' | 'g' | 'b' | 'a';  // a 채널에서 사용할 컴포넌트
};

const cacheMap: Map<string, { gpuTexture: GPUTexture, useNum: number, mappingKey: string }> = new Map();
// 인스턴스별 현재 사용 중인 키 추적을 위한 WeakMap
const instanceMappingKeys: WeakMap<PackedTexture, string> = new WeakMap();

let globalPipeline: GPURenderPipeline;
let globalBindGroupLayout: GPUBindGroupLayout;
let mappingBuffer: GPUBuffer;

class PackedTexture {
	#redGPUContext: RedGPUContext;
	#sampler: GPUSampler;
	#gpuTexture: GPUTexture;
	#gpuDevice: GPUDevice;
	#bindGroup: GPUBindGroup;
	#tempBindGroupCache: Map<string, GPUBindGroup> = new Map();

	get gpuTexture(): GPUTexture {
		return this.#gpuTexture;
	}

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#gpuDevice = redGPUContext.gpuDevice;
		this.#initializeGlobals();
		this.#sampler = this.#createSampler();
	}

	#initializeGlobals() {
		if (!mappingBuffer) {
			mappingBuffer = this.#gpuDevice.createBuffer({
				label: 'PACK_TEXTURE_MAPPING_BUFFER',
				size: 16, // 4개 컴포넌트 * 4바이트
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			});
		}
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
			label: label || `PACK_TEXTURE_${createUUID()}`
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
		this.#gpuTexture = this.#redGPUContext.resourceManager.mipmapGenerator.generateMipmap(packedTexture, textureDescriptor);

		// 새로운 텍스처를 캐시에 등록
		cacheMap.set(mappingKey, {
			gpuTexture: this.#gpuTexture,
			useNum: 1,
			mappingKey
		});

		// keepLog('packing 함', cacheMap.get(mappingKey));
		this.#bindGroup = null;
	}

	#executeRenderPass(packedTexture: GPUTexture) {
		const {resourceManager} = this.#redGPUContext;
		const commandEncoder = this.#gpuDevice.createCommandEncoder();
		const passEncoder = commandEncoder.beginRenderPass({
			colorAttachments: [
				{
					view: resourceManager.getGPUResourceBitmapTextureView(packedTexture),
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

	#createSampler(): GPUSampler {
		return new Sampler(this.#redGPUContext).gpuSampler;
	}
}

export default PackedTexture;
