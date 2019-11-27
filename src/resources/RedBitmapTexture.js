/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.26 19:46:12
 *
 */
"use strict";
let imageCanvas;
let imageCanvasContext;
const TABLE = new Map()
export default class RedBitmapTexture {
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
		imageCanvasContext.translate(0, height);
		imageCanvasContext.scale(1, -1);
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
			width,
			height,
			depth: 1
		};
		const commandEncoder = device.createCommandEncoder({});
		commandEncoder.copyBufferToTexture(bufferView, textureView, textureExtent);
		device.defaultQueue.submit([commandEncoder.finish()]);

		console.log('mip', mip, 'width', width, 'height', height)
	}
	constructor(redGPU, src, useMipmap = true) {
		// 귀찮아서 텍스쳐 맹그는 놈은 들고옴
		let self = this;
		if (!src) {
			console.log('src')
		} else {
			const mapKey = src + useMipmap
			if (TABLE.get(mapKey)) return TABLE.get(mapKey)
			const img = new Image();
			img.src = src;
			img.onerror = function (v) {
				console.log(v)
			};

			img.onload = async _ => {
				if (useMipmap) this.mipMaps = Math.floor(Math.log2(Math.max(img.width, img.height)))
				await img.decode();
				const textureDescriptor = {
					size: {
						width: img.width,
						height: img.height,
						depth: 1,
					},
					dimension: '2d',
					format: 'bgra8unorm',
					arrayLayerCount: 1,
					mipLevelCount: useMipmap ? this.mipMaps + 1 : 1,
					sampleCount: 1,
					usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED
				};
				const gpuTexture = redGPU.device.createTexture(textureDescriptor);
				let i = 1, len = this.mipMaps
				let faceWidth = img.width
				let faceHeight = img.height

				this.#updateTexture(redGPU.device, img, gpuTexture, faceWidth, faceHeight, 0)
				if (useMipmap) {
					for (i; i <= len; i++) {
						faceWidth = Math.max(Math.floor(faceWidth / 2), 1);
						faceHeight = Math.max(Math.floor(faceHeight / 2), 1);
						this.#updateTexture(redGPU.device, img, gpuTexture, faceWidth, faceHeight, i)
					}
				}
				TABLE.set(mapKey, gpuTexture)
				self.resolve(gpuTexture)

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
		this.#GPUTextureView = texture.createView();
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
