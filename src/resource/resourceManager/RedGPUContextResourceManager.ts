import RedGPUContextBase from "../../context/RedGPUContextBase";
import makeUUID from "../../util/makeUUID";
import {BitmapCubeTexture, BitmapTexture, TextureSampler} from "../texture";
import CubeTextureInfo from "./CubeTextureInfo";
import TextureInfo from "./TextureInfo";

class RedGPUContextResourceManager extends RedGPUContextBase {
	#uuidTable = {}
	#textureTable: {} = {}
	#cubeTextureTable = {}
	#samplerTable = {}
	#emptyTextureInfo?: TextureInfo;
	#emptyCubeTextureInfo?: CubeTextureInfo

	constructor(context) {
		super(context)
		const emptyTextureInfo = this.redGPUContext.gpuDevice.createTexture({
			label: 'emptyTexture',
			size: {width: 1, height: 1, depthOrArrayLayers: 1},
			format: navigator.gpu.getPreferredCanvasFormat(),
			usage: GPUTextureUsage.TEXTURE_BINDING || GPUTextureUsage.RENDER_ATTACHMENT,
		})
		const emptyCubeTextureInfo = this.redGPUContext.gpuDevice.createTexture({
			label: 'emptyCubeTexture',
			size: {width: 1, height: 1, depthOrArrayLayers: 6,},
			dimension: '2d',
			// arrayLayerCount: 6,
			mipLevelCount: 1,
			sampleCount: 1,
			format: navigator.gpu.getPreferredCanvasFormat(),
			usage: GPUTextureUsage.TEXTURE_BINDING,
		})
		this.#emptyTextureInfo = new TextureInfo(emptyTextureInfo, emptyTextureInfo.createView())
		this.#emptyCubeTextureInfo = new CubeTextureInfo(
			emptyCubeTextureInfo,
			emptyCubeTextureInfo.createView({
				dimension: 'cube',
				aspect: 'all',
				baseMipLevel: 0,
				mipLevelCount: 1,
				baseArrayLayer: 0,
				arrayLayerCount: 6
			})
		)
		console.log(this, this.#textureTable)
	}

	get textureTable(): {} {
		return this.#textureTable;
	}

	get cubeTextureTable(): {} {
		return this.#cubeTextureTable;
	}

	get samplerTable(): {} {
		return this.#samplerTable;
	}

	get emptyTextureInfo() {
		return this.#emptyTextureInfo;
	}

	get emptyCubeTextureInfo() {
		return this.#emptyCubeTextureInfo;
	}

	delResource(resource) {
		const uuid = this.#getUUID(resource)
		if (resource instanceof BitmapTexture) {
			delete this.#textureTable[uuid];
		} else if (resource instanceof BitmapCubeTexture) {
			delete this.#cubeTextureTable[uuid];
		} else if (resource instanceof TextureSampler) {
			delete this.#samplerTable[uuid];
		} else {
		}
	}

	getResource(resource) {
		const uuid = this.#getUUID(resource)
		if (resource instanceof BitmapTexture) {
			return this.#textureTable[uuid];
		} else if (resource instanceof BitmapCubeTexture) {
			return this.#cubeTextureTable[uuid];
		} else if (resource instanceof TextureSampler) {
			return this.#samplerTable[uuid];
		} else {
		}
	}

	addResource(resource) {
		console.log('addResource', resource)
		let uuid;
		const label = this.#getLabel(resource)
		if (resource instanceof BitmapTexture) {
			uuid = this.#uuidTable[label] = makeUUID()
			this.#textureTable[uuid] = new TextureInfo(resource)
		} else if (resource instanceof BitmapCubeTexture) {
			uuid = this.#uuidTable[label] = makeUUID()
			this.#cubeTextureTable[uuid] = new CubeTextureInfo(resource, null,)
		} else if (resource instanceof TextureSampler) {
			uuid = this.#uuidTable[label] = makeUUID()
			this.#samplerTable[uuid] = resource;
		} else {
			alert('등록할수 없는 타입')
		}
	}

	#getUUID(resource) {
		let tableID
		const label = this.#getLabel(resource)
		if (resource instanceof BitmapTexture) {
			tableID = this.#uuidTable[label]
		} else if (resource instanceof BitmapCubeTexture) {
			tableID = this.#uuidTable[label]
		} else if (resource instanceof TextureSampler) {
			tableID = this.#uuidTable[label]
		} else {
			alert('리소스로 관리 할수 없는 타입')
		}
		return tableID
	}

	#getLabel(resource) {
		let label
		if (resource instanceof BitmapTexture) {
			label = resource.src
		} else if (resource instanceof BitmapCubeTexture) {
			label = resource.srcList.toString()
		} else if (resource instanceof TextureSampler) {
			label = resource.optionString
		} else {
			alert('리소스로 관리 할수 없는 타입')
		}
		return label
	}
}

export default RedGPUContextResourceManager
