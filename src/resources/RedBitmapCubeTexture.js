/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.7 15:34:43
 *
 */
"use strict";
import RedSampler from "./RedSampler.js";

let imageCanvas;
let imageCanvasContext;
let defaultSampler;
export default class RedBitmapCubeTexture {
	#updateList = [];
	#GPUTexture;
	#GPUTextureView;
	#updateTexture = function (device, img, gpuTexture, width, height, mip, face = -1) {
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
			data = new Uint8Array(rowPitch * height);
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
		const commandEncoder = device.createCommandEncoder({});
		commandEncoder.copyBufferToTexture(bufferView, textureView, textureExtent);
		device.defaultQueue.submit([commandEncoder.finish()]);

		console.log('mip', mip, 'width', width, 'height', height)
	};
	#makeCubeTexture = function (redGPU, useMipmap, imgList, maxW, maxH) {
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
		const gpuTexture = redGPU.device.createTexture(textureDescriptor);
		imgList.forEach((img, face) => {
			let i = 1, len = this.mipMaps;
			let faceWidth = maxW;
			let faceHeight = maxH;
			this.#updateTexture(redGPU.device, img, gpuTexture, faceWidth, faceHeight, 0, face);
			if (useMipmap) {
				for (i; i <= len; i++) {
					faceWidth = Math.max(Math.floor(faceWidth / 2), 1);
					faceHeight = Math.max(Math.floor(faceHeight / 2), 1);
					this.#updateTexture(redGPU.device, img, gpuTexture, faceWidth, faceHeight, i, face)
				}
			}
		});

		this.resolve(gpuTexture)
	};
	constructor(redGPU, srcList,sampler, useMipmap = true) {
		// 귀찮아서 텍스쳐 맹그는 놈은 들고옴
		if (!defaultSampler) defaultSampler = new RedSampler(redGPU);
		this.sampler = sampler || defaultSampler;
		let maxW = 0;
		let maxH = 0;
		let loadCount = 0;
		let imgList = [];
		srcList.forEach((src, face) => {
			if (!src) {
				console.log('src')
			} else {
				const mapKey = src + this.sampler.string + useMipmap;
				console.log('mapKey', mapKey);

				const img = new Image();
				img.src = src;
				img.onerror = function (v) {
					console.log(v)
				};

				img.onload = _ => {
					imgList[face] = img;
					loadCount++;
					maxW = Math.max(maxW, img.width);
					maxH = Math.max(maxH, img.height);
					if(maxW>1024) maxW = 1024;
					if(maxH>1024) maxH = 1024;
					if (loadCount == 6) this.#makeCubeTexture(redGPU, useMipmap, imgList, maxW, maxH)
				}
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
		this.#GPUTextureView = texture.createView(
			{
				format: 'rgba8unorm',
				dimension: 'cube',
				aspect: 'all',
				baseMipLevel: 0,
				mipLevelCount: this.mipMaps + 1,
				baseArrayLayer: 0,
				arrayLayerCount: 6

			}
		);
		console.log('this.#updateList', this.#updateList);
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
