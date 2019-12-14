/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 13:16:40
 *
 */
"use strict";
import RedSampler from "./RedSampler.js";
import RedUTIL from "../util/RedUTIL.js";


let defaultSampler;
const TABLE = new Map();
export default class RedBitmapTexture {
	#updateList = [];
	#GPUTexture;
	#GPUTextureView;
	#updateTexture = function (commandEncoder, device, img, gpuTexture, width, height, mip, face = -1) {
		let promise = new Promise(((resolve, reject) => {
			let imageCanvas;
			let imageCanvasContext;
			imageCanvas = document.createElement('canvas',);
			imageCanvasContext = imageCanvas.getContext('2d');

			imageCanvas.width = width;
			imageCanvas.height = height;
			// imageCanvasContext.translate(0, height);
			// imageCanvasContext.scale(1, -1);
			imageCanvasContext.drawImage(img, 0, 0, width, height);
			// const imageData = imageCanvasContext.getImageData(0, 0, width, height);
			console.time('getImageData' + img.src)
			const imageData = imageCanvasContext.getImageData(0, 0, width, height);
			console.timeEnd('getImageData' + img.src)
			let data;
			const rowPitch = Math.ceil(width * 4 / 256) * 256;
			console.time('uint8 make')
			if (rowPitch == width * 4) {
				data = imageData.data;
				console.log('uint8 make', '여기냐1')
			} else {
				console.log('uint8 make', '여기냐2')
				data = new Uint8ClampedArray(rowPitch * height);
				let pixelsIndex = 0;
				for (let y = 0; y < height; ++y) {
					for (let x = 0; x < width; ++x) {
						let i = x * 4 + y * rowPitch;
						data[i] = imageData.data[pixelsIndex];
						data[i + 1] = imageData.data[pixelsIndex + 1];
						data[i + 2] = imageData.data[pixelsIndex + 2];
						data[i + 3] = imageData.data[pixelsIndex + 3];
						pixelsIndex += 4;
					}
				}
			}
			console.timeEnd('uint8 make')
			const textureDataBuffer = device.createBuffer({
				size: data.byteLength + data.byteLength % 4,
				usage: globalThis.GPUBufferUsage.COPY_DST | globalThis.GPUBufferUsage.COPY_SRC,
			});
			textureDataBuffer.setSubData(0, data);
			const bufferView = {
				buffer: textureDataBuffer,
				rowPitch: rowPitch,
				imageHeight: height,
			};
			const textureView = {
				texture: gpuTexture,
				mipLevel: mip,
				arrayLayer: Math.max(face, 0),
			};

			const textureExtent = {
				width: width,
				height: height,
				depth: 1
			};

			commandEncoder.copyBufferToTexture(bufferView, textureView, textureExtent);
			console.log('mip', mip, 'width', width, 'height', height)
			resolve(imageCanvas)
		}))

		return promise
	};
	constructor(redGPUContext, src, sampler, useMipmap = true, onload, onerror) {
		if (!defaultSampler) defaultSampler = new RedSampler(redGPUContext);
		this.sampler = sampler || defaultSampler;

		if (!src) {
			console.log('src')
		} else {
			const mapKey = src + this.sampler.string + useMipmap;
			console.log('this.sampler.string', this.sampler.string)
			console.log('mapKey', mapKey);
			if (TABLE.get(mapKey)) {
				console.log('캐시된 녀석을 던집', mapKey, TABLE.get(mapKey));
				return TABLE.get(mapKey);
			}
			const img = new Image();
			img.src = src;
			img.crossOrigin = 'anonymous';
			img.onerror = e => {
				console.log(e)
				this.resolve(null)
				if (onerror) onerror(e)
			};
			TABLE.set(mapKey, this);
			img.decode().then(_ => {
				let tW = img.width;
				let tH = img.height;
				tW = RedUTIL.nextHighestPowerOfTwo(tW);
				tH = RedUTIL.nextHighestPowerOfTwo(tH)
				if (tW > 1024) tW = 1024;
				if (tH > 1024) tH = 1024;
				if (useMipmap) this.mipMaps = Math.round(Math.log2(Math.max(tW, tH)));

				const textureDescriptor = {
					size: {
						width: tW,
						height: tH,
						depth: 1,
					},
					dimension: '2d',
					format: 'rgba8unorm',
					arrayLayerCount: 1,
					mipLevelCount: useMipmap ? this.mipMaps + 1 : 1,
					usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED
				};
				const gpuTexture = redGPUContext.device.createTexture(textureDescriptor);
				let mipIndex = 0, len = this.mipMaps;
				let faceWidth = tW;
				let faceHeight = tH;


				const commandEncoder = redGPUContext.device.createCommandEncoder({});
				let self = this
				function callNextMip(targetImage) {
					// console.log('대상이미지', targetImage)
					let promise = self.#updateTexture(commandEncoder, redGPUContext.device, targetImage, gpuTexture, faceWidth, faceHeight, mipIndex)
					if (useMipmap) {
						if (mipIndex == len) {
							promise.then(
								_ => {
									// console.log('오긴하니', src)
									self.resolve(gpuTexture)
									redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);
									if (onload) onload()
								}
							)
						} else {
							promise.then(canvas => {
									faceWidth = Math.max(Math.floor(faceWidth / 2), 1);
									faceHeight = Math.max(Math.floor(faceHeight / 2), 1);
									mipIndex++
									callNextMip(canvas)
								}
							)
						}
					} else {
						promise.then(_ => {
								// console.log('밉맵실행', src, mipIndex)
								self.resolve(gpuTexture)
								redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);
								if (onload) onload()
							}
						)
					}

				}
				callNextMip(img)
			})
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
			console.log(data[1]);
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
