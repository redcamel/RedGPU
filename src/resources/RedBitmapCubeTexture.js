/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.16 20:34:19
 *
 */
"use strict";
import RedSampler from "./RedSampler.js";
import RedImageLoader from "./system/RedImageLoader.js";
import RedUUID from "../base/RedUUID.js";
import RedBitmapTexture from "./RedBitmapTexture.js";
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
let makeMipmap = function (redGPUContext, imgList, targetTexture) {
	console.log('imgList', imgList)
	let tW = imgList[0].imageDatas[0].width;
	let tH = imgList[0].imageDatas[0].height;
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
	let result = []
	const commandEncoder = redGPUContext.device.createCommandEncoder({});
	imgList.forEach((imgInfo, face) => {
		result.push(updateTexture(commandEncoder, redGPUContext.device, imgInfo.imageDatas, gpuTexture, targetTexture, face));

	});
	Promise.all(result).then(
		_ => {
			targetTexture.resolve(gpuTexture)
			if (targetTexture.onload) targetTexture.onload.call(targetTexture)
			redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);
		}
	)
}
export default class RedBitmapCubeTexture extends RedUUID {
	#updateList = [];
	#GPUTexture;
	#GPUTextureView;

	constructor(redGPUContext, srcList, sampler, useMipmap = true, onload, onerror) {
		super()
		if (!defaultSampler) defaultSampler = new RedSampler(redGPUContext);
		this.sampler = sampler || defaultSampler;
		this.src = srcList
		this.onload = onload
		this.onerror = onerror
		this.mapKey = srcList + useMipmap;
		this.useMipmap = useMipmap
		if (!srcList) {
			console.log('src')
		} else {
			let self = this
			new RedImageLoader(redGPUContext, srcList, function () {
				console.log(MIPMAP_TABLE.get(self.mapKey))

				if (MIPMAP_TABLE.get(self.mapKey)) {
					console.log('캐싱사용')
					self.resolve(MIPMAP_TABLE.get(self.mapKey))
					if (self.onload) self.onload(self)
				} else {
					console.log('신규생성')
					console.log(this)
					makeMipmap(redGPUContext, this.imgList, self)
				}


			}, RedImageLoader.TYPE_CUBE)
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
		this.#GPUTextureView = texture ? texture.createView(
			{
				format: 'rgba8unorm',
				dimension: 'cube',
				aspect: 'all',
				baseMipLevel: 0,
				mipLevelCount: this.mipMaps + 1,
				baseArrayLayer: 0,
				arrayLayerCount: 6

			}
		) : null;
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
