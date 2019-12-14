/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 19:33:10
 *
 */
"use strict";
import RedUUID from "../base/RedUUID.js";
import RedBitmapTexture from "../resources/RedBitmapTexture.js";
import RedBitmapCubeTexture from "../resources/RedBitmapCubeTexture.js";

export default class RedTextureLoader extends RedUUID {
	textures = [];
	constructor(redGPUContext, srcInfoList, callback) {
		super();
		let loaded, check;
		srcInfoList = srcInfoList || [];
		loaded = 0;

		check = _ => {
			loaded++
			if (loaded == srcInfoList.length) {
				if (callback) callback.call(this)
			}
		};
		srcInfoList.forEach((srcInfo, idx) => {
			let t0, tSrc, tSampler;
			let targetClass = RedBitmapTexture;
			if (srcInfo.hasOwnProperty('src')) {
				tSrc = srcInfo.src;
				tSampler = srcInfo.sampler;
			} else tSrc = srcInfo
			if (tSrc instanceof Array) targetClass = RedBitmapCubeTexture;
			t0 = {
				src: tSrc,
				texture: new targetClass(
					redGPUContext, tSrc, tSampler, true,
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
				loadSuccess: false,
				userInfo: srcInfo
			}
			// console.log(t0)
			this.textures.push(t0)
		})
		console.log(this)
	}
	getTextureByIndex(index) {
		return this.textures[index].texture
	}
}