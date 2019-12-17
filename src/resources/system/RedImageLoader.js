/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.17 14:27:8
 *
 */

"use strict";
import RedUUID from "../../base/RedUUID.js";


const SRC_MAP = {};

//TODO 정리해야함
function createWorker(f) {
	return new Worker(URL.createObjectURL(new Blob([`(${f})()`])));
}

const worker = createWorker(() => {
	let nextHighestPowerOfTwo = (function () {
		var i;
		return function (v) {
			--v;
			for (i = 1; i < 32; i <<= 1) v = v | v >> i;
			return v + 1;
		}
	})();
	self.addEventListener('message', e => {
		const src = e.data;
		let errorInfo;
		fetch(src, {mode: 'cors'})
			.then(response => {
				errorInfo = {
					url: response.url,
					ok: response.ok,
					status: response.status,
					statusText: response.statusText,
					type: response.type
				};
				if (!response.ok) {
					// console.log(response)
					throw Error('error');
				} else {
					response.blob()
						.then(blob => createImageBitmap(blob))
						.then(bitmap => {
							let faceWidth = bitmap.width;
							let faceHeight = bitmap.height;
							faceWidth = nextHighestPowerOfTwo(faceWidth);
							faceHeight = nextHighestPowerOfTwo(faceHeight);
							if (faceWidth > 1024) faceWidth = 1024;
							if (faceHeight > 1024) faceHeight = 1024;
							// console.log(data)
							let imageDatas = [];
							let mipIndex = 0, len = Math.round(Math.log2(Math.max(faceWidth, faceHeight)));
							let getMipmapDatas = img => {
								const cvs = new OffscreenCanvas(faceWidth, faceHeight);
								const ctx = cvs.getContext('2d');
								ctx.fillStyle = 'rgba(0,0,0,0)'
								ctx.fillRect(0,0,faceWidth,faceHeight)
								ctx.drawImage(img, 0, 0, faceWidth, faceHeight);
								let imageData = ctx.getImageData(0, 0, faceWidth, faceHeight).data;
								let data;
								const rowPitch = Math.ceil(faceWidth * 4 / 256) * 256;
								if (rowPitch == faceWidth * 4) {
									data = imageData;
								} else {
									data = new Uint8ClampedArray(rowPitch * faceHeight);
									let pixelsIndex = 0;
									for (let y = 0; y < faceHeight; ++y) {
										for (let x = 0; x < faceWidth; ++x) {
											let i = x * 4 + y * rowPitch;
											data[i] = imageData[pixelsIndex];
											data[i + 1] = imageData[pixelsIndex + 1] ;
											data[i + 2] = imageData[pixelsIndex + 2];
											data[i + 3] = imageData[pixelsIndex + 3];
											pixelsIndex += 4;
										}
									}
								}
								imageDatas.push({
									data: data.buffer,
									width: faceWidth,
									height: faceHeight,
									rowPitch: rowPitch
								});
								faceWidth = Math.max(Math.floor(faceWidth / 2), 1);
								faceHeight = Math.max(Math.floor(faceHeight / 2), 1);
								mipIndex++;
								if (mipIndex == len + 1) {
									self.postMessage({src, imageDatas: imageDatas});
								} else {
									getMipmapDatas(cvs)
								}

							};
							getMipmapDatas(bitmap)
						})
				}

			}).catch(error => {
			self.postMessage({
				error: errorInfo,
				src: src
			})
		})

	});
});
function loadImageWithWorker(src) {
	return new Promise((resolve, reject) => {
		function handler(e) {
			if (e.data.src === src) {
				worker.removeEventListener('message', handler);
				if (e.data.error) {
					reject(e.data.error);
				}
				resolve(e.data);
			}
		}
		worker.addEventListener('message', handler);
		worker.postMessage(src);
	});
}
export default class RedImageLoader extends RedUUID {
	static TYPE_2D = 'TYPE_2D';
	static TYPE_CUBE = 'TYPE_CUBE';
	constructor(redGPUContext, src, callback, type = RedImageLoader.TYPE_2D) {
		super();
		this.callback = callback;
		if (type == RedImageLoader.TYPE_2D) {
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
					requestAnimationFrame(_=>{
						if (callback) callback.call(this)
					})
				} else {
					SRC_MAP[targetSRC].tempList.push(this)
				}
			} else {
				SRC_MAP[targetSRC] = {
					loaded: false,
					tempList: []
				};
				SRC_MAP[targetSRC].tempList.push(this);
				loadImageWithWorker(targetSRC)
					.then(result => {
						console.log(result);
						console.log('첫 로딩업데이트 해야될 대상', SRC_MAP[targetSRC]);
						SRC_MAP[targetSRC].loaded = true;
						SRC_MAP[targetSRC]['imageDatas'] = result['imageDatas'];
						SRC_MAP[targetSRC].tempList.forEach(loader => {
							loader['imageDatas'] = SRC_MAP[targetSRC]['imageDatas'];
							if (loader.callback) loader.callback.call(loader)
						});
						SRC_MAP[targetSRC].tempList.length = 0
					})
					.catch(result => {
						console.log('로딩실패!', result)
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
							requestAnimationFrame(_=>{
								if (callback) callback.call(this)
							})
						} else {
							SRC_MAP[targetSRC].tempList.push(this)
						}
					} else {
						SRC_MAP[targetSRC] = {
							loaded: false,
							imgList : imgList,
							tempList: []
						};
						SRC_MAP[targetSRC].tempList.push(this);
						loadImageWithWorker(targetSRC)
							.then(result => {
								imgList[face] = result;
								loadCount++;
								maxW = Math.max(maxW, result.imageDatas[0].width);
								maxH = Math.max(maxH, result.imageDatas[0].height);
								if (maxW > 1024) maxW = 1024;
								if (maxH > 1024) maxH = 1024;
								console.log(result);
								console.log('첫 로딩업데이트 해야될 대상', SRC_MAP[targetSRC]);
								if (loadCount == 6) {
									SRC_MAP[targetSRC].loaded = true;
									SRC_MAP[targetSRC]['imgList'] = imgList;
									SRC_MAP[targetSRC]['maxW'] = maxW;
									SRC_MAP[targetSRC]['maxH'] = maxH;

									SRC_MAP[targetSRC].tempList.forEach(loader => {
										loader['imgList'] = SRC_MAP[targetSRC]['imgList'];
										loader['maxW'] = SRC_MAP[targetSRC]['maxW'];
										loader['maxH'] = SRC_MAP[targetSRC]['maxH'];
										if (loader.callback) loader.callback.call(loader)
									});
									SRC_MAP[targetSRC].tempList.length = 0
								}

							})
							.catch(result => {
								console.log('로딩실패!', result)
							});
					}



				}
			})
		}
	}
}
