/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.17 9:45:10
 *
 */
"use strict";
import RedSampler from "./RedSampler.js";
import RedImageLoader from "./system/RedImageLoader.js";
import RedBitmapTexture from "./RedBitmapTexture.js";
import RedCopyBufferToTexture from './system/RedCopyBufferToTexture.js'
import RedBaseTexture from "../base/RedBaseTexture.js";

let defaultSampler;
const MIPMAP_TABLE = new Map();

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
		result.push(RedCopyBufferToTexture(commandEncoder, redGPUContext.device, imgInfo.imageDatas, gpuTexture, targetTexture, face));

	});
	Promise.all(result).then(
		_ => {
			targetTexture.resolve(gpuTexture)
			if (targetTexture.onload) targetTexture.onload.call(targetTexture)
			redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);
		}
	)
}
export default class RedBitmapCubeTexture extends RedBaseTexture {

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

}
