/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 14:4:9
 *
 */
"use strict";
import Sampler from "./Sampler.js";
import ImageLoader from "./system/ImageLoader.js";
import CopyBufferToTexture from './system/CopyBufferToTexture.js'
import BaseTexture from "../base/BaseTexture.js";

let defaultSampler;
const MIPMAP_TABLE = new Map();
let makeMipmap = function (redGPUContext, imageDatas, targetTexture) {
	let tW, tH, textureDescriptor, gpuTexture, commandEncoder;
	tW = imageDatas[0].width;
	tH = imageDatas[0].height;
	if (targetTexture.useMipmap) {
		targetTexture.mipMaps = Math.round(Math.log2(Math.max(tW, tH)));
		if (targetTexture.mipMaps > 10) targetTexture.mipMaps = 10
	}
	textureDescriptor = {
		size: {width: tW, height: tH, depth: 1,},
		dimension: '2d',
		format: 'rgba8unorm',
		// arrayLayerCount: 1,
		mipLevelCount: targetTexture.useMipmap ? targetTexture.mipMaps + 1 : 1,
		usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED
	};
	gpuTexture = redGPUContext.device.createTexture(textureDescriptor);
	MIPMAP_TABLE.set(targetTexture.mapKey, gpuTexture);
	commandEncoder = redGPUContext.device.createCommandEncoder({});
	CopyBufferToTexture(commandEncoder, redGPUContext.device, imageDatas, gpuTexture, targetTexture)
		.then(
			_ => {
				redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);
				targetTexture.resolve(gpuTexture);
				if (targetTexture.onload) targetTexture.onload(targetTexture);
			}
		);
};
export default class BitmapTexture extends BaseTexture {
	//TODO 옵션값이 바뀌면 어떻게 할건지 결정해야함
	constructor(redGPUContext, src, sampler, useMipmap = true, onload, onerror) {
		super();
		if (!defaultSampler) defaultSampler = new Sampler(redGPUContext);
		this.sampler = sampler || defaultSampler;
		this.onload = onload;
		this.onerror = onerror;
		this.mapKey = src + useMipmap + this.sampler.string;
		this.useMipmap = useMipmap;
		if (!src) {
			console.log('src')
		} else {
			let self = this;
			new ImageLoader(redGPUContext, src, function (e) {
				console.log(MIPMAP_TABLE)
				console.log(self.mapKey)
				if (MIPMAP_TABLE.get(self.mapKey)) {
					console.log('BitmapTexture - 캐싱사용');
					self.resolve(MIPMAP_TABLE.get(self.mapKey));
					if (self.onload) self.onload(self)
				} else {
					console.log('BitmapTexture - 신규생성', e);
					if (e.ok) makeMipmap(redGPUContext, this.imageDatas, self);
					else {
						self.resolve(null);
						if (self.onerror) self.onerror(self)
					}
				}
			}, ImageLoader.TYPE_2D)
		}
	}
}
