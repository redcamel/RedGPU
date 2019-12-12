/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.12 15:9:7
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
			const imageData = imageCanvasContext.getImageData(0, 0, width, height);
			let data;
			const rowPitch = Math.ceil(width * 4 / 256) * 256;
			if (rowPitch == width * 4) {
				data = imageData.data;
				console.log('여기니')
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
				usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
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
	constructor(redGPU, src, sampler, useMipmap = true) {
		// 귀찮아서 텍스쳐 맹그는 놈은 들고옴
		if (!defaultSampler) defaultSampler = new RedSampler(redGPU);
		this.sampler = sampler || defaultSampler;

		if (!src) {
			console.log('src')
		} else {
			const mapKey = src + this.sampler.string + useMipmap;
			console.log('mapKey', mapKey);
			if (TABLE.get(mapKey)) {
				console.log('캐시된 녀석을 던집', mapKey, TABLE.get(mapKey));
				return TABLE.get(mapKey);
			}
			const img = new Image();
			img.src = src;
			img.crossOrigin = 'anonymous';
			img.onerror = function (v) {
				console.log(v)
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
				const gpuTexture = redGPU.device.createTexture(textureDescriptor);
				let mipIndex = 0, len = this.mipMaps;
				let faceWidth = tW;
				let faceHeight = tH;


				const commandEncoder = redGPU.device.createCommandEncoder({});
				let self = this
				function callNextMip(targetImage) {
					console.log('대상이미지', targetImage)
					let promise = self.#updateTexture(commandEncoder, redGPU.device, targetImage, gpuTexture, faceWidth, faceHeight, mipIndex)
					if (useMipmap) {
						if (mipIndex == len) {
							promise.then(
								_ => {
									console.log('오긴하니', src)
									self.resolve(gpuTexture)
									redGPU.device.defaultQueue.submit([commandEncoder.finish()]);
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
								console.log('밉맵실행', src, mipIndex)
								self.resolve(gpuTexture)
								redGPU.device.defaultQueue.submit([commandEncoder.finish()]);
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
		this.#GPUTextureView = texture.createView();
		let data;
		let tick = _ => {
			data = this.#updateList[this.#updateList.length - 1]
			if (data) {
				data[0][data[1]] = this
				this.#updateList.pop()
				requestAnimationFrame(tick)
			}
		}
		requestAnimationFrame(tick)
	}

	addUpdateTarget(target, key) {
		this.#updateList.push([
			target, key
		])
	}


}
