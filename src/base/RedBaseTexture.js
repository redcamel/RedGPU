/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.17 9:48:50
 *
 */

"use strict";
import RedUUID from "./RedUUID.js";
import RedBitmapTexture from "../resources/RedBitmapTexture.js";

export default class RedBaseTexture extends RedUUID {
	#updateList = [];
	_GPUTexture;
	_GPUTextureView;
	constructor() {
		super()
	}
	get GPUTexture() {
		return this._GPUTexture
	}

	get GPUTextureView() {
		return this._GPUTextureView
	}

	resolve(texture) {
		this._GPUTexture = texture;
		if (this instanceof RedBitmapTexture) this._GPUTextureView = texture ? texture.createView() : null;
		else {
			this._GPUTexture = texture;
			this._GPUTextureView = texture ? texture.createView(
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

		}
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
