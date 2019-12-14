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
import RedImageLoader from "./system/RedImageLoader.js";
import RedUUID from "../base/RedUUID.js";

let defaultSampler;
const IMG_TABLE = {};
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
			if (RedGPUContext.useDebugConsole) console.log('mapKey', this.mapKey);
			if (IMG_TABLE[srcList]) {
				IMG_TABLE[srcList].push(this)
			} else {
				new RedImageLoader(IMG_TABLE, srcList, redGPUContext, this)
				IMG_TABLE[srcList] = [];
				IMG_TABLE[srcList].push(this)
				console.log('IMG_TABLE',IMG_TABLE)
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
