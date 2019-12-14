/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 20:25:55
 *
 */
"use strict";
import RedSampler from "./RedSampler.js";
import RedGPUContext from "../RedGPUContext.js";
import RedUUID from "../base/RedUUID.js";
import RedImageLoader from "./system/RedImageLoader.js";


let defaultSampler;
const IMG_TABLE = {};
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
			if (RedGPUContext.useDebugConsole) console.log('mapKey', this.mapKey);
			if (IMG_TABLE[src]) {
				IMG_TABLE[src].push(this)
			} else {
				new RedImageLoader(IMG_TABLE, src, redGPUContext, this)
				IMG_TABLE[src] = [];
				IMG_TABLE[src].push(this)
			}

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
