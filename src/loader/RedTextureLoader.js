/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 15:14:27
 *
 */
"use strict";
import RedUUID from "../base/RedUUID.js";
import RedBitmapTexture from "../resources/RedBitmapTexture.js";

export default class RedTextureLoader extends RedUUID {
	textures = [];
	constructor(redGPUContext, srcList, callback) {
		super();
		let loaded, check;
		srcList = srcList || [];
		loaded = 0;
		check = _ => {
			loaded++
			if (loaded == srcList.length) {
				if (callback) callback.call(this)
			}
		};
		srcList.forEach((src, idx) => {
			let t0 = {
				src: src,
				texture: new RedBitmapTexture(
					redGPUContext, src, null, true,
					function (e) {
						// console.log('onload', this);
						t0.loadSuccess = true;
						t0.loadEnd = true;
						check();
					},
					function (e) {
						// console.log('onerror', this,e)
						t0.loadSuccess = false;
						t0.loadEnd = true;
						check();
					}
				),
				loadEnd: false,
				loadSuccess: false
			}
			this.textures.push(t0)
		})
		console.log(this)
	}
	getTextureByIndex(index) {
		return this.textures[index].texture
	}
}