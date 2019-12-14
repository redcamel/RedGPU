/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 15:38:23
 *
 */
"use strict";
import RedSampler from "./RedSampler.js";
import RedUTIL from "../util/RedUTIL.js";

let imageCanvas;
let imageCanvasContext;
let defaultSampler;
const TABLE = new Map();
export default class RedBitmapCubeTexture {
	#updateList = [];
	#GPUTexture;
	#GPUTextureView;
	#updateTexture = function (commandEncoder, device, img, gpuTexture, width, height, mip, face = -1) {
		let promise = new Promise(((resolve, reject) => {
			if (!imageCanvas) {
				imageCanvas = document.createElement('canvas');
				imageCanvasContext = imageCanvas.getContext('2d');
			}
			imageCanvas.width = width;
			imageCanvas.height = height;
			// imageCanvasContext.translate(0, height);
			// imageCanvasContext.scale(1, -1);
			imageCanvasContext.drawImage(img, 0, 0, width, height);
			const imageData = imageCanvasContext.getImageData(0, 0, width, height);
			let data = null;
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
			console.log('mip', mip, 'width', width, 'height', height)
			resolve()
		}))
		return promise
	};
	#makeCubeTexture = function (redGPUContext, useMipmap, imgList, maxW, maxH, onload) {
		maxW = RedUTIL.nextHighestPowerOfTwo(maxW);
		maxH = RedUTIL.nextHighestPowerOfTwo(maxH)
		if (useMipmap) this.mipMaps = Math.round(Math.log2(Math.max(maxW, maxH)));
		const textureDescriptor = {
			size: {
				width: maxW,
				height: maxH,
				depth: 1,
			},
			dimension: '2d',
			format: 'rgba8unorm',
			arrayLayerCount: 6,
			sampleCount: 1,
			mipLevelCount: useMipmap ? this.mipMaps + 1 : 1,
			usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED
		};
		const gpuTexture = redGPUContext.device.createTexture(textureDescriptor);
		let result = []
		const commandEncoder = redGPUContext.device.createCommandEncoder({});

		imgList.forEach((img, face) => {
			let i = 1, len = this.mipMaps;
			let faceWidth = maxW;
			let faceHeight = maxH;
			result.push(this.#updateTexture(commandEncoder, redGPUContext.device, img, gpuTexture, faceWidth, faceHeight, 0, face));
			if (useMipmap) {
				for (i; i <= len; i++) {
					faceWidth = Math.max(Math.floor(faceWidth / 2), 1);
					faceHeight = Math.max(Math.floor(faceHeight / 2), 1);
					result.push(this.#updateTexture(commandEncoder, redGPUContext.device, img, gpuTexture, faceWidth, faceHeight, i, face))
				}
			}
		});
		Promise.all(result).then(
			_ => {
				console.log('오긴하니', imgList)
				if (onload) onload.call(this)
				this.resolve(gpuTexture)
				redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);
			}
		)

	};
	constructor(redGPUContext, srcList, sampler, useMipmap = true, onload, onerror) {
		//TODO : onload처리
		if (!defaultSampler) defaultSampler = new RedSampler(redGPUContext);
		this.sampler = sampler || defaultSampler;
		let maxW = 0;
		let maxH = 0;
		let loadCount = 0;
		let imgList = [];
		const mapKey = srcList + this.sampler.string + useMipmap;
		console.log('mapKey', mapKey);
		if (TABLE.get(mapKey)) {
			console.log('캐시된 녀석을 던집', mapKey, TABLE.get(mapKey));
			return TABLE.get(mapKey);
		}
		TABLE.set(mapKey, this);
		srcList.forEach((src, face) => {
			if (!src) {
				console.log('src')
			} else {
				const img = new Image();
				img.src = src;
				img.crossOrigin = 'anonymous';
				img.onerror = e => {
					console.log(e)
					if (onerror) onerror.call(this, e)
					this.resolve(null)
				};
				img.decode().then(_ => {
					imgList[face] = img;
					loadCount++;
					maxW = Math.max(maxW, img.width);
					maxH = Math.max(maxH, img.height);
					if (maxW > 1024) maxW = 1024;
					if (maxH > 1024) maxH = 1024;
					if (loadCount == 6) this.#makeCubeTexture(redGPUContext, useMipmap, imgList, maxW, maxH, onload)
				})
			}
		})

	}

	get GPUTexture() {
		return this.#GPUTexture
	}

	get GPUTextureView() {
		return this.#GPUTextureView
	}

	resolve(texture) {
		this.#GPUTexture = texture;
		this.#GPUTextureView = texture ? texture.createView(
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
		this.#updateList.forEach(data => {
			// console.log(data[1]);
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
