/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 19:33:10
 *
 */
"use strict";
import RedSampler from "./RedSampler.js";
import RedUTIL from "../util/RedUTIL.js";
import RedGPUContext from "../RedGPUContext.js";
import RedUUID from "../base/RedUUID.js";


let defaultSampler;
const MIPMAP_TABLE = new Map();
const IMG_TABLE = {};
export default class RedBitmapTexture extends RedUUID{
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
		super()
		if (!defaultSampler) defaultSampler = new RedSampler(redGPUContext);
		this.sampler = sampler || defaultSampler;
		this.src = src
		this.onload = onload
		this.onerror = onerror
		const mapKey = src + this.sampler.string + useMipmap;
		if (!src) {
			console.log('src')
		} else {


			if (RedGPUContext.useDebugConsole) console.log('mapKey', mapKey);
			if (IMG_TABLE[src]) {
				IMG_TABLE[src].push(this)
			} else {
				const img = new Image();
				img.src = src;
				img.crossOrigin = 'anonymous';
				img.onerror = e => {
					this.resolve(null)
					if (onerror) onerror.call(this, e)
				};
				IMG_TABLE[src] = [];
				IMG_TABLE[src].push(this)
				img.decode().then(_ => {
					// console.log('업데이트 해야될 대상', src, IMG_TABLE[src])
					IMG_TABLE[src].forEach(updateTarget => {
						if (MIPMAP_TABLE.get(mapKey)) {
							console.log('캐쉬된 놈을 써야함',updateTarget.src)
							console.log(updateTarget)
							if (updateTarget.onload) updateTarget.onload.call(updateTarget)
							updateTarget.resolve(MIPMAP_TABLE.get(mapKey))
						} else {
							console.log('새로만들어야함')
							console.log(mapKey)
							let tW = img.width;
							let tH = img.height;
							tW = RedUTIL.nextHighestPowerOfTwo(tW);
							tH = RedUTIL.nextHighestPowerOfTwo(tH)
							if (tW > 1024) tW = 1024;
							if (tH > 1024) tH = 1024;
							if (useMipmap) updateTarget.mipMaps = Math.round(Math.log2(Math.max(tW, tH)));
							const textureDescriptor = {
								size: {
									width: tW,
									height: tH,
									depth: 1,
								},
								dimension: '2d',
								format: 'rgba8unorm',
								arrayLayerCount: 1,
								mipLevelCount: useMipmap ? updateTarget.mipMaps + 1 : 1,
								usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED
							};
							const gpuTexture = redGPUContext.device.createTexture(textureDescriptor);
							MIPMAP_TABLE.set(mapKey,gpuTexture)
							let mipIndex = 0, len = updateTarget.mipMaps;
							let faceWidth = tW;
							let faceHeight = tH;


							const commandEncoder = redGPUContext.device.createCommandEncoder({});

							function callNextMip(targetImage) {
								let promise = updateTarget.#updateTexture(commandEncoder, redGPUContext.device, targetImage, gpuTexture, faceWidth, faceHeight, mipIndex)
								if (useMipmap) {
									if (mipIndex == len) {
										promise.then(
											_ => {
												updateTarget.resolve(gpuTexture)

												if (onload) onload.call(updateTarget)
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
											updateTarget.resolve(gpuTexture)
											if (onload) onload.call(updateTarget)
											redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);

										}
									)
								}

							}
							callNextMip(img)
						}
					})

				}).then(_ => {

				})
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
