/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 16:4:46
 *
 */
"use strict";
import RedSampler from "./RedSampler.js";
import RedUTIL from "../util/RedUTIL.js";
import RedGPUContext from "../RedGPUContext.js";


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
			if (RedGPUContext.useDebugConsole) console.time('getImageData' + img.src)
			const imageData = imageCanvasContext.getImageData(0, 0, width, height);
			if (RedGPUContext.useDebugConsole) console.timeEnd('getImageData' + img.src)
			let data;
			const rowPitch = Math.ceil(width * 4 / 256) * 256;
			if (rowPitch == width * 4) {
				data = imageData.data;
			} else {
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
			if (RedGPUContext.useDebugConsole) console.log('mip', mip, 'width', width, 'height', height)
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
			if (RedGPUContext.useDebugConsole) console.log('mapKey', mapKey);
			if (TABLE.get(mapKey)) {
				if (onload) onload.call(this)
				return TABLE.get(mapKey);
			}
			const img = new Image();
			img.src = src;
			img.crossOrigin = 'anonymous';
			img.onerror = e => {
				if (onerror) onerror.call(this, e)
				this.resolve(null)
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
					let promise = self.#updateTexture(commandEncoder, redGPUContext.device, targetImage, gpuTexture, faceWidth, faceHeight, mipIndex)
					if (useMipmap) {
						if (mipIndex == len) {
							promise.then(
								_ => {
									if (onload) onload.call(self)
									self.resolve(gpuTexture)
									redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);


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
								if (onload) onload.call(self)
								self.resolve(gpuTexture)
								redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);

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
