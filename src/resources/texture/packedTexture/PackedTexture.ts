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
let globalPipeline: GPURenderPipeline;
let globalBindGroupLayout: GPUBindGroupLayout;
let mappingBuffer: GPUBuffer;

class PackedTexture {
	#redGPUContext: RedGPUContext;
	#sampler: GPUSampler;
	#gpuTexture: GPUTexture;
	#gpuDevice: GPUDevice;
	#bindGroup: GPUBindGroup;
	#prevMappingKey: string;

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
				label: 'packedTexture_mappingBuffer',
				size: 16, // 4개 컴포넌트 * 4바이트
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			});
		}
		if (!globalBindGroupLayout) {
			globalBindGroupLayout = this.#redGPUContext.resourceManager.createBindGroupLayout(
				'packedTexture_bindGroupLayout',
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
		const bindGroupEntries = [
			{
				binding: 0,
				resource: textures.r ?
					textures.r.createView({label: textures.r.label}) :
					this.#redGPUContext.resourceManager.emptyBitmapTextureView
			},
			{
				binding: 1,
				resource: textures.g ?
					textures.g.createView({label: textures.g.label}) :
					this.#redGPUContext.resourceManager.emptyBitmapTextureView
			},
			{
				binding: 2,
				resource: textures.b ?
					textures.b.createView({label: textures.b.label}) :
					this.#redGPUContext.resourceManager.emptyBitmapTextureView
			},
			{
				binding: 3,
				resource: textures.a ?
					textures.a.createView({label: textures.a.label}) :
					this.#redGPUContext.resourceManager.emptyBitmapTextureView
			},
			{binding: 4, resource: this.#sampler},
			{binding: 5, resource: {buffer: mappingBuffer}}
		];
		this.#bindGroup = this.#gpuDevice.createBindGroup({
			label: 'packedTexture_bindGroup',
			layout: globalBindGroupLayout,
			entries: bindGroupEntries,
		});
	}

	async packing(
		textures: { r?: GPUTexture; g?: GPUTexture; b?: GPUTexture; a?: GPUTexture },
		width: number,
		height: number,
		label?: string,
		componentMapping?: ComponentMapping
	) {
		const mapping = {
			r: 'r',
			g: 'g',
			b: 'b',
			a: 'a',
			...componentMapping
		};
		const textureKey = `${textures.r?.label || ''}_${textures.g?.label || ''}_${textures.b?.label || ''}_${textures.a?.label || ''}`;
		const mappingKey = `${JSON.stringify(mapping)}_${textureKey}`;
		const prevEntry = this.#prevMappingKey ? cacheMap.get(this.#prevMappingKey) : null;
		const currEntry = cacheMap.get(mappingKey);
		if (!textures.r && !textures.g && !textures.b && !textures.a) {
			return;
		}
		this.#handleCacheManagement(mappingKey, prevEntry, currEntry);
		if (currEntry) {
			return;
		}
		// Create new texture
		this.#createPackedTexture(textures, width, height, label, mapping, mappingKey);
	}

	#handleCacheManagement(mappingKey: string, prevEntry: any, currEntry: any) {
		if (this.#prevMappingKey) {
			const isChangedKey = this.#prevMappingKey !== mappingKey;
			if (prevEntry && isChangedKey) {
				prevEntry.useNum--;
			}
			if (currEntry) {
				this.#gpuTexture = currEntry.gpuTexture;
				currEntry.useNum++;
				keepLog('기존 생성된 텍스쳐를 사용함', currEntry);
			}
			if (prevEntry && isChangedKey) {
				if (prevEntry.useNum === 0) {
					keepLog('삭제된 텍스쳐', prevEntry);
					prevEntry.gpuTexture?.destroy();
					this.#gpuTexture = null;
					cacheMap.delete(this.#prevMappingKey);
					keepLog('이전키가 더이상 사용되지 않아서 캐시에서 삭제함', prevEntry);
				} else {
					keepLog('이전키와 현재키가 달라서 기존 캐시 정리함', prevEntry);
				}
				keepLog('prev', prevEntry);
			}
			this.#prevMappingKey = mappingKey;
		} else {
			if (currEntry) {
				this.#gpuTexture = currEntry.gpuTexture;
				currEntry.useNum++;
				keepLog('기존 생성된 텍스쳐를 사용함', currEntry);
			}
		}
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
			label: label || `packedTexture_${createUUID()}`
		};
		if (this.#gpuTexture) {
			this.#gpuTexture = null;
		}
		const packedTexture = this.#gpuDevice.createTexture(textureDescriptor);
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
		cacheMap.set(mappingKey, {
			gpuTexture: this.#gpuTexture,
			useNum: 1,
			mappingKey
		});
		keepLog('packing 함', cacheMap.get(mappingKey));
		this.#bindGroup = null;
	}

	#executeRenderPass(packedTexture: GPUTexture) {
		const commandEncoder = this.#gpuDevice.createCommandEncoder();
		const passEncoder = commandEncoder.beginRenderPass({
			colorAttachments: [
				{
					view: packedTexture.createView({label: packedTexture.label}),
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

	#createPipeline(): GPURenderPipeline {
		const shaderCode = computeShaderCode;
		const {resourceManager} = this.#redGPUContext;
		const pipelineLayout = this.#gpuDevice.createPipelineLayout({
			label: 'packedTexture_pipelineLayout',
			bindGroupLayouts: [globalBindGroupLayout]
		});
		return this.#gpuDevice.createRenderPipeline({
			label: 'packedTexturePipeline',
			layout: pipelineLayout,
			vertex: {
				module: resourceManager.createGPUShaderModule('packedTexture', {code: shaderCode}),
				entryPoint: 'vertexMain',
			},
			fragment: {
				module: resourceManager.createGPUShaderModule('packedTexture', {code: shaderCode}),
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
