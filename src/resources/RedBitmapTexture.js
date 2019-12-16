/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.16 20:34:19
 *
 */
"use strict";
import RedSampler from "./RedSampler.js";
import RedUUID from "../base/RedUUID.js";
import RedImageLoader from "./system/RedImageLoader.js";
import RedGPUContext from "../RedGPUContext.js";


let defaultSampler;
const MIPMAP_TABLE = new Map();
const updateTexture = function (commandEncoder, device, imageDatas, gpuTexture, updateTarget, face = -1) {
	let promise = new Promise(((resolve, reject) => {

		imageDatas.forEach((info, mip) => {
			if (!updateTarget.useMipmap && mip) return
			let data = new Uint8ClampedArray(info.data)
			let width = info.width
			let height = info.height
			let rowPitch = info.rowPitch;
			const textureDataBuffer = device.createBuffer({
				size: data.byteLength + data.byteLength % 4,
				usage: globalThis.GPUBufferUsage.COPY_DST | globalThis.GPUBufferUsage.COPY_SRC,
			});
			// console.log(imageData)
			textureDataBuffer.setSubData(0, data);
			const bufferView = {
				buffer: textureDataBuffer,
				rowPitch: rowPitch,
				imageHeight: height,
			};
			const textureView = {
				texture: gpuTexture,
				mipLevel: mip,
				arrayLayer: Math.max(face, 0),
			};

			const textureExtent = {
				width: width,
				height: height,
				depth: 1
			};
			commandEncoder.copyBufferToTexture(bufferView, textureView, textureExtent);
			if (RedGPUContext.useDebugConsole) console.log('mip', mip, 'width', width, 'height', height)
		})

		resolve()
	}))

	return promise
};
let makeMipmap = function (redGPUContext, imageDatas, targetTexture) {
	console.log('imageDatas', imageDatas)
	let tW = imageDatas[0].width;
	let tH = imageDatas[0].height;
	const commandEncoder = redGPUContext.device.createCommandEncoder({});
	if (targetTexture.useMipmap) targetTexture.mipMaps = Math.round(Math.log2(Math.max(tW, tH)));
	const textureDescriptor = {
		size: {
			width: tW,
			height: tH,
			depth: 1,
		},
		dimension: '2d',
		format: 'rgba8unorm',
		arrayLayerCount: targetTexture instanceof RedBitmapTexture ? 1 : 6,
		mipLevelCount: targetTexture.useMipmap ? targetTexture.mipMaps + 1 : 1,
		usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED
	};
	// console.log(textureDescriptor)
	const gpuTexture = redGPUContext.device.createTexture(textureDescriptor);
	MIPMAP_TABLE.set(targetTexture.mapKey, gpuTexture)
	// console.log(tW, tH)
	updateTexture(commandEncoder, redGPUContext.device, imageDatas, gpuTexture, targetTexture).then(
		_ => {
			targetTexture.resolve(gpuTexture)
			if (targetTexture.onload) targetTexture.onload()
			redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);
		}
	)
}
export default class RedBitmapTexture extends RedUUID {
	#updateList = [];
	#GPUTexture;
	#GPUTextureView;
	//TODO 옵션값이 바뀌면 어떻게 할건지 결정해야함
	constructor(redGPUContext, src, sampler, useMipmap = true, onload, onerror) {
		super()
		if (!defaultSampler) defaultSampler = new RedSampler(redGPUContext);
		this.sampler = sampler || defaultSampler;
		this.src = src
		this.onload = onload
		this.onerror = onerror
		this.mapKey = src + useMipmap;
		this.useMipmap = useMipmap
		if (!src) {
			console.log('src')
		} else {
			let self = this
			new RedImageLoader(redGPUContext, src, function () {
				console.log(MIPMAP_TABLE.get(self.mapKey))
				if (MIPMAP_TABLE.get(self.mapKey)) {
					console.log('캐싱사용')
					self.resolve(MIPMAP_TABLE.get(self.mapKey))
					if (self.onload) self.onload(self)
				} else {
					console.log('신규생성')
					makeMipmap(redGPUContext, this.imageDatas, self)
				}


			}, RedImageLoader.TYPE_2D)

		}
	}

	get GPUTexture() {
		return this.#GPUTexture
	}

	get GPUTextureView() {
		return this.#GPUTextureView
	}

	resolve(texture) {
		this.#GPUTexture = texture;
		this.#GPUTextureView = texture ? texture.createView() : null;
		this.#updateList.forEach(data => {
			data[0][data[1]] = this
		});
		this.#updateList.length = 0
	}

	addUpdateTarget(target, key) {
		this.#updateList.push([
			target, key
		])
	}


}
