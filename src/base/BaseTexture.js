/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */

"use strict";
import UUID from "./UUID.js";
import BitmapTexture from "../resources/BitmapTexture.js";

export default class BaseTexture extends UUID {
	#updateList = [];
	_GPUTexture;
	_GPUTextureView;
	constructor() {super()}
	get GPUTexture() {return this._GPUTexture}
	get GPUTextureView() {return this._GPUTextureView}

	resolve(texture) {
		this._GPUTexture = texture;
		if (this instanceof BitmapTexture) this._GPUTextureView = texture ? texture.createView() : null;
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
		let i = this.#updateList.length;
		while (i--) {
			let data = this.#updateList[i];
			data[0][data[1]] = this;
		}
		this.#updateList.length = 0;
	}

	addUpdateTarget(target, key) { this.#updateList.push([target, key]) }
}
