/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 20:25:55
 *
 */

"use strict"
import RedUUID from "../../base/RedUUID.js";
import RedUTIL from "../../util/RedUTIL.js";
import RedGPUContext from "../../RedGPUContext.js";
import RedBitmapTexture from "../RedBitmapTexture.js";

const MIPMAP_TABLE = new Map();
const updateTexture = function (commandEncoder, device, img, gpuTexture, width, height, mip, face = -1) {
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
const makeCubeTexture = function (redGPUContext, useMipmap, imgList, maxW, maxH, IMG_TABLE, src) {
	IMG_TABLE[src].forEach(updateTarget => {
		console.log('updateTarget.mapKey',updateTarget.mapKey)
		if (MIPMAP_TABLE.get(updateTarget.mapKey)) {
			console.log('Cube - 캐쉬된 놈을 써야함', updateTarget.src)
			console.log(updateTarget)
			if (updateTarget.onload) updateTarget.onload.call(updateTarget)
			updateTarget.resolve(MIPMAP_TABLE.get(updateTarget.mapKey))
		} else {
			console.log('Cube - 새로만들어야함')
			console.log(updateTarget.mapKey)
		}
		maxW = RedUTIL.nextHighestPowerOfTwo(maxW);
		maxH = RedUTIL.nextHighestPowerOfTwo(maxH)
		if (useMipmap) updateTarget.mipMaps = Math.round(Math.log2(Math.max(maxW, maxH)));
		const textureDescriptor = {
			size: {
				width: maxW,
				height: maxH,
				depth: 1,
			},
			dimension: '2d',
			format: 'rgba8unorm',
			arrayLayerCount: 6,
			mipLevelCount: useMipmap ? updateTarget.mipMaps + 1 : 1,
			usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED
		};
		const gpuTexture = redGPUContext.device.createTexture(textureDescriptor);
		MIPMAP_TABLE.set(updateTarget.mapKey, gpuTexture)
		let result = []
		const commandEncoder = redGPUContext.device.createCommandEncoder({});

		imgList.forEach((img, face) => {
			let i = 1, len = updateTarget.mipMaps;
			let faceWidth = maxW;
			let faceHeight = maxH;
			result.push(updateTexture(commandEncoder, redGPUContext.device, img, gpuTexture, faceWidth, faceHeight, 0, face));
			if (useMipmap) {
				for (i; i <= len; i++) {
					faceWidth = Math.max(Math.floor(faceWidth / 2), 1);
					faceHeight = Math.max(Math.floor(faceHeight / 2), 1);
					result.push(updateTexture(commandEncoder, redGPUContext.device, img, gpuTexture, faceWidth, faceHeight, i, face))
				}
			}
		});
		Promise.all(result).then(
			_ => {
				updateTarget.resolve(gpuTexture)
				if (updateTarget.onload) updateTarget.onload.call(updateTarget)
				redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);
			}
		)
	})

};
//TODO 정리해야함
export default class RedImageLoader extends RedUUID {

	constructor(IMG_TABLE, src, redGPUContext, targetTexture) {
		super()
		if (targetTexture instanceof RedBitmapTexture) {
			let img = new Image();
			img.src = src;
			img.crossOrigin = 'anonymous';
			img.onerror = e => {
				this.resolve(null)
				if (targetTexture.onerror) targetTexture.onerror.call(this, e)
			};
			img.decode().then(_ => {
				// console.log('업데이트 해야될 대상', src, IMG_TABLE[src])
				IMG_TABLE[src].forEach(updateTarget => {
					if (MIPMAP_TABLE.get(updateTarget.mapKey)) {
						console.log('캐쉬된 놈을 써야함', updateTarget.src)
						console.log(updateTarget)
						if (updateTarget.onload) updateTarget.onload.call(updateTarget)
						updateTarget.resolve(MIPMAP_TABLE.get(updateTarget.mapKey))
					} else {
						console.log('새로만들어야함')
						console.log(updateTarget.mapKey)
						let tW = img.width;
						let tH = img.height;
						tW = RedUTIL.nextHighestPowerOfTwo(tW);
						tH = RedUTIL.nextHighestPowerOfTwo(tH)
						if (tW > 1024) tW = 1024;
						if (tH > 1024) tH = 1024;
						if (updateTarget.useMipmap) updateTarget.mipMaps = Math.round(Math.log2(Math.max(tW, tH)));
						const textureDescriptor = {
							size: {
								width: tW,
								height: tH,
								depth: 1,
							},
							dimension: '2d',
							format: 'rgba8unorm',
							arrayLayerCount: updateTarget instanceof RedBitmapTexture ? 1 : 6,
							mipLevelCount: updateTarget.useMipmap ? updateTarget.mipMaps + 1 : 1,
							usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED
						};

						const gpuTexture = redGPUContext.device.createTexture(textureDescriptor);
						MIPMAP_TABLE.set(updateTarget.mapKey, gpuTexture)
						let mipIndex = 0, len = updateTarget.mipMaps;
						let faceWidth = tW;
						let faceHeight = tH;


						const commandEncoder = redGPUContext.device.createCommandEncoder({});

						function callNextMip(targetImage) {
							let promise = updateTexture(commandEncoder, redGPUContext.device, targetImage, gpuTexture, faceWidth, faceHeight, mipIndex)
							if (updateTarget.useMipmap) {
								if (mipIndex == len) {
									promise.then(
										_ => {
											updateTarget.resolve(gpuTexture)
											if (targetTexture.onload) targetTexture.onload.call(targetTexture)
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
										targetTexture.resolve(gpuTexture)
										if (updateTarget.onload) targetTexture.onload.call(targetTexture)
										redGPUContext.device.defaultQueue.submit([commandEncoder.finish()]);
									}
								)
							}

						}
						callNextMip(img)
					}
				})

			})
		} else {
			let maxW = 0;
			let maxH = 0;
			let loadCount = 0;
			let imgList = [];
			src.forEach((tSrc, face) => {
				if (!tSrc) {
					console.log('src')
				} else {
					let img = new Image();
					img.src = tSrc;
					img.crossOrigin = 'anonymous';
					img.onerror = e => {
						targetTexture.resolve(null)
						if (targetTexture.onerror) targetTexture.onerror.call(this, e)
					};
					img.decode().then(_ => {
						imgList[face] = img;
						loadCount++;
						maxW = Math.max(maxW, img.width);
						maxH = Math.max(maxH, img.height);
						if (maxW > 1024) maxW = 1024;
						if (maxH > 1024) maxH = 1024;
						if (loadCount == 6) makeCubeTexture(redGPUContext, targetTexture.useMipmap, imgList, maxW, maxH, IMG_TABLE, src)
					})
				}
			})
		}

	}
}
