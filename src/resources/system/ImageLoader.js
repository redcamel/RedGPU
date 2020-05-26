/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.10 17:50:10
 *
 */

"use strict";
import UUID from "../../base/UUID.js";
import RedGPUWorker from "../../base/RedGPUWorker.js";


const SRC_MAP = {};

//TODO 정리해야함

export default class ImageLoader extends UUID {
	static TYPE_2D = 'TYPE_2D';
	static TYPE_CUBE = 'TYPE_CUBE';
	constructor(redGPUContext, src, callback, type = ImageLoader.TYPE_2D) {
		super();
		this.callback = callback;
		if (type === ImageLoader.TYPE_2D) {
			let path = location.pathname.split('/');
			if (path.length > 1) path.pop();
			let targetSRC = location.origin + (path.join('/')) + '/' + src;
			if (src.includes(';base64,') || src.includes('://')) targetSRC = src;
			if (SRC_MAP[targetSRC]) {
				if (SRC_MAP[targetSRC].loaded) {
					console.log('곧장 맵찾으러감', SRC_MAP[targetSRC]);
					this['imageDatas'] = SRC_MAP[targetSRC]['imageDatas'];
					if (callback) callback.call(this, {ok: true})
				} else {
					SRC_MAP[targetSRC].tempList.push(this)
				}
			} else {
				SRC_MAP[targetSRC] = {
					loaded: false,
					tempList: []
				};
				SRC_MAP[targetSRC].tempList.push(this);
				RedGPUWorker.loadImageWithWorker(targetSRC)
					.then(result => {
						// console.log('result', result);
						// console.log('첫 로딩업데이트 해야될 대상', SRC_MAP[targetSRC]);
						SRC_MAP[targetSRC].loaded = true;
						SRC_MAP[targetSRC]['imageDatas'] = result['imageDatas'];
						SRC_MAP[targetSRC].tempList.forEach(loader => {
							loader['imageDatas'] = SRC_MAP[targetSRC]['imageDatas'];
							if (loader.callback) loader.callback.call(loader, result)
						});
						SRC_MAP[targetSRC].tempList.length = 0
					})
					.catch(result => {
						console.log('로딩실패!', result);
						SRC_MAP[targetSRC].tempList.forEach(loader => {
							if (loader.callback) loader.callback.call(loader, result)
						});
						SRC_MAP[targetSRC].tempList.length = 0
					});
			}

		} else {
			let maxW = 0;
			let maxH = 0;
			let loadCount = 0;
			let imgList = [];
			let srcList = src;
			srcList.forEach((src, face) => {
				if (!src) {
					// console.log('src')
				} else {
					let path = location.pathname.split('/');
					if (path.length > 1) path.pop();
					let targetSRC = location.origin + (path.join('/')) + '/' + src;
					if (src.includes(';base64,') || src.includes('://')) {
						targetSRC = src
					}

					if (SRC_MAP[targetSRC]) {
						if (SRC_MAP[targetSRC].loaded) {
							console.log('곧장 맵찾으러감');
							this['imageDatas'] = SRC_MAP[targetSRC]['imageDatas'];
							if (callback) callback.call(this, {ok: true})
						} else {
							SRC_MAP[targetSRC].tempList.push(this)
						}
					} else {
						SRC_MAP[targetSRC] = {
							loaded: false,
							imgList: imgList,
							tempList: []
						};
						SRC_MAP[targetSRC].tempList.push(this);
						RedGPUWorker.loadImageWithWorker(targetSRC)
							.then(result => {
								imgList[face] = result;
								loadCount++;
								maxW = Math.max(maxW, result.imageDatas[0].width);
								maxH = Math.max(maxH, result.imageDatas[0].height);
								if (maxW > 1920) maxW = 1920;
								if (maxH > 1920) maxH = 1920;
								// console.log('result', result);
								// console.log('첫 로딩업데이트 해야될 대상', SRC_MAP[targetSRC]);
								if (loadCount == 6) {
									SRC_MAP[targetSRC].loaded = true;
									SRC_MAP[targetSRC]['imgList'] = imgList;
									SRC_MAP[targetSRC]['maxW'] = maxW;
									SRC_MAP[targetSRC]['maxH'] = maxH;
									SRC_MAP[targetSRC].tempList.forEach(loader => {
										loader['imgList'] = SRC_MAP[targetSRC]['imgList'];
										loader['maxW'] = SRC_MAP[targetSRC]['maxW'];
										loader['maxH'] = SRC_MAP[targetSRC]['maxH'];
										if (loader.callback) loader.callback.call(loader, result)
									});
									SRC_MAP[targetSRC].tempList.length = 0
								}

							})
							.catch(result => {
								console.log('로딩실패!',targetSRC, result);
								SRC_MAP[targetSRC].tempList.forEach(loader => {
									if (loader.callback) loader.callback.call(loader, result)
								});
								SRC_MAP[targetSRC].tempList.length = 0
							});
					}
				}
			})
		}
	}
}
