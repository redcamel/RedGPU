/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 14:4:9
 *
 */
"use strict";
import BaseTexture from "../base/BaseTexture.js";
import generateWebGPUTextureMipmap from "./mipmapGenerator/generateWebGPUTextureMipmap.js";
import Sampler from "./Sampler.js";

let defaultSampler;
const MIPMAP_TABLE = new Map();
// let makeMipmap = function (redGPUContext, imageDatas, targetTexture) {
//   let tW, tH, textureDescriptor, gpuTexture, commandEncoder;
//   tW = imageDatas[0].width;
//   tH = imageDatas[0].height;
//   if (targetTexture.useMipmap) {
//     targetTexture.mipMaps = Math.round(Math.log2(Math.max(tW, tH)));
//     if (targetTexture.mipMaps > 10) targetTexture.mipMaps = 10;
//   }
//   textureDescriptor = {
//     size: {width: tW, height: tH, depthOrArrayLayers: 1,},
//     dimension: '2d',
//     format: 'rgba8unorm',
//     sampleCount: 1,
//     // arrayLayerCount: 1,
//     mipLevelCount: targetTexture.useMipmap ? targetTexture.mipMaps + 1 : 1,
//     usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING
//   };
//   gpuTexture = redGPUContext.device.createTexture(textureDescriptor);
//   MIPMAP_TABLE.set(targetTexture.mapKey, gpuTexture);
//   commandEncoder = redGPUContext.device.createCommandEncoder({});
//   CopyBufferToTexture(commandEncoder, redGPUContext.device, imageDatas, gpuTexture, targetTexture)
//     .then(
//       _ => {
//         redGPUContext.device.queue.submit([commandEncoder.finish()]);
//         targetTexture.resolve(gpuTexture);
//         if (targetTexture.onload) targetTexture.onload(targetTexture);
//       }
//     );
// };
export default class BitmapTexture extends BaseTexture {
	//TODO 옵션값이 바뀌면 어떻게 할건지 결정해야함
	constructor(redGPUContext, src, sampler, useMipmap = true, onload, onerror) {
		super();
		if (!defaultSampler) defaultSampler = new Sampler(redGPUContext);
		this.sampler = sampler || defaultSampler;
		this.onload = onload;
		this.onerror = onerror;
		this.mapKey = src + useMipmap + this.sampler.string;
		this.useMipmap = useMipmap;
		if (!src) {
			console.log('src');
		} else {
			let self = this;
			// new ImageLoader(redGPUContext, src, function (e) {
			//   // console.log(MIPMAP_TABLE)
			//   // console.log(self.mapKey)
			//   if (MIPMAP_TABLE.get(self.mapKey)) {
			//     console.log('BitmapTexture - 캐싱사용', e);
			//     self.resolve(MIPMAP_TABLE.get(self.mapKey));
			//     if (self.onload) self.onload(self);
			//   } else {
			//     console.log('BitmapTexture - 신규생성', e);
			//     if (e.ok) makeMipmap(redGPUContext, this.imageDatas, self);
			//     else {
			//       self.resolve(null);
			//       if (self.onerror) self.onerror(self);
			//     }
			//   }
			// }, ImageLoader.TYPE_2D);
			if (MIPMAP_TABLE.get(self.mapKey)) {
				console.log('BitmapTexture - 캐싱사용', self.mapKey);
				self.resolve(MIPMAP_TABLE.get(self.mapKey));
				if (self.onload) self.onload(self);
			} else {
				// console.log('redGPUContext',redGPUContext)
				console.log('BitmapTexture - 신규생성', self.mapKey);

				const {device} = redGPUContext

        fetch(src).then(response => response.blob().then(blob => createImageBitmap(blob, {
					premultiplyAlpha: 'none'
				}))).then(async imgBitmap => {
					// console.log(imgBitmap)
          if(useMipmap) {
            self.mipMaps = Math.floor(Math.log2(Math.max(imgBitmap.width, imgBitmap.height))) + 1;
          }

          const gpuTexture = await makeWebGPUTexture(device, imgBitmap, useMipmap, src)
					MIPMAP_TABLE.set(self.mapKey, gpuTexture);
					self.resolve(gpuTexture);
					if (self.onload) self.onload(self);
				}).catch(e => {
          console.log(e)
					self.resolve(null);
					if (self.onerror) self.onerror(self);
				})

			}
		}
	}
}

function makeWebGPUTexture(gpuDevice, source, generateMipmaps = true, label) {
	// 텍스쳐에 대한 정의를 내리고
	const textureDescriptor = {
		size: {width: source.width, height: source.height},
		format: 'rgba8unorm',
		usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
		label
	};
	// 밉맵을 생성할꺼면 소스를 계산해서... 밉맵 카운트를 추가 정의한다.
	if (generateMipmaps) {
		// Compute how many mip levels are needed for a full chain.
		textureDescriptor.mipLevelCount = Math.floor(Math.log2(Math.max(source.width, source.height))) + 1;
		// Needed in order to use render passes to generate the mipmaps.
		textureDescriptor.usage |= GPUTextureUsage.RENDER_ATTACHMENT;
	}
	// 생성할 원본 소스를 생성한다.
	const texture = gpuDevice.createTexture(textureDescriptor);
	// 생성한 텍스쳐에 데이터를 밀어넣는다.
	gpuDevice.queue.copyExternalImageToTexture({source}, {texture}, textureDescriptor.size);

	if (generateMipmaps) {
		// 밉맵생성을 한다.
		generateWebGPUTextureMipmap(gpuDevice, texture, textureDescriptor);
	}
	return texture;
}
