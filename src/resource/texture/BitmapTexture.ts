import RedGPUContext from "../../context/RedGPUContext";
import RedGPUContextBase from "../../context/RedGPUContextBase";
import makeUUID from "../../util/makeUUID";
import generateWebGPUTextureMipmap from "./mipmapGenerator/generateWebGPUTextureMipmap";

class BitmapTexture extends RedGPUContextBase {
	#src: string
	#imgBitmap?: ImageBitmap
	#gpuTexture: GPUTexture
	#targetList = new Set()

	constructor(redGPUContext: RedGPUContext, src: string) {
		super(redGPUContext);
		this.#src = src
		if (this.#src) {
			const resource = redGPUContext.resourceManager.getResource(this)
			if (resource) {
				console.log('BitmapTexture 캐시된 녀석을씀')
				// console.log('캐시된 녀석을씀',redGPUContext.resourceManager,redGPUContext.resourceManager.getResource(this))
				return resource.resource
			} else {
				console.log('BitmapTexture 캐시된 녀석을안씀')
				redGPUContext.resourceManager.addResource(this)
				this.#webGPUTextureFromImageUrl(this.#src)
			}
		}
	}

	get src(): string {
		return this.#src;
	}

	get imgBitmap(): ImageBitmap {
		return this.#imgBitmap;
	}

	get gpuTexture(): GPUTexture {
		return this.#gpuTexture;
	}

	get gpuTextureView(): GPUTextureView {
		const tResource = this.redGPUContext.resourceManager.getResource(this)
		if (this.#gpuTexture) {
			if (tResource.textureView) {
				console.log('BitmapTexture 캐시된 녀석의 뷰를 사용함')
				return tResource.textureView
			} else {
				console.log('BitmapTexture 캐시된 녀석의 뷰를 만듬')
				tResource.textureView = this.#gpuTexture.createView({
					label: this.#src
				})
				return tResource.textureView
			}
		} else {
			return this.redGPUContext.resourceManager['emptyTextureInfo'].textureView
		}
	}

	destroy() {
		if (this.#gpuTexture) {
			this.#gpuTexture.destroy()
			this.#gpuTexture = null
			this.redGPUContext.resourceManager.delResource(this)
		}
	}

	addTargetMaterial(target) {
		this.#targetList.add(target)
	}

	#webGPUTextureFromImageUrl(url) {
		const {redGPUContext} = this
		const {gpuDevice} = redGPUContext
		fetch(url).then(response => response.blob().then(blob => createImageBitmap(blob))).then(imgBitmap => {
			console.log(imgBitmap)
			this.#imgBitmap = imgBitmap
			this.#gpuTexture = makeWebGPUTexture(gpuDevice, imgBitmap, true, url)
			this.#resolve()
		}).catch(e => {
			this.#gpuTexture = null
			this.#resolve()
		})
	}

	#resolve() {
		const temp = this.#targetList
		this.#targetList = new Set()
		console.log('#targetList', temp)
		for (const value of temp) {
			temp.delete(value)
			value['bindGroupID'] = makeUUID()
			value['dirtyTexture'] = true
		}
		console.log('#targetList', temp)
		// temp.clear()
	}
}

function makeWebGPUTexture(gpuDevice, source, generateMipmaps: boolean = true, label?: string) {
	// 텍스쳐에 대한 정의를 내리고
	const textureDescriptor: GPUTextureDescriptor = {
		size: {width: source.width, height: source.height},
		format: 'rgba8unorm',
		usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
		label
	};
	// 밉맵을 생성할꺼면 소스를 계산해서... 밉맵 카운트를 추가 정의한다.
	if (generateMipmaps) {
		// Compute how many mip levels are needed for a full chain.
		textureDescriptor.mipLevelCount = Math.floor(Math.log2(Math.max(source.width, source.height))) + 1;
		// Needed in order to use render passes to generate the mipmaps.
		textureDescriptor.usage |= GPUTextureUsage.RENDER_ATTACHMENT;
	}
	// 생성할 원본 소스를 생성한다.
	const texture = gpuDevice.createTexture(textureDescriptor);
	// 생성한 텍스쳐에 데이터를 밀어넣는다.
	gpuDevice.queue.copyExternalImageToTexture({source}, {texture}, textureDescriptor.size);
	if (generateMipmaps) {
		// 밉맵생성을 한다.
		generateWebGPUTextureMipmap(gpuDevice, texture, textureDescriptor);
	}
	return texture;
}

export default BitmapTexture
