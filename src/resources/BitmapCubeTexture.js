/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.10 20:9:14
 *
 */
import Sampler from "./Sampler.js";
import ImageLoader from "./system/ImageLoader.js";
import BitmapTexture from "./BitmapTexture.js";
import CopyBufferToTexture from './system/CopyBufferToTexture.js';
import BaseTexture from "../base/BaseTexture.js";

let defaultSampler;
const MIPMAP_TABLE = new Map();
let makeMipmap = function (redGPUContext, imgList, targetTexture) {
  let tW, tH, textureDescriptor, gpuTexture, commandEncoder;
  tW = imgList[0].imageDatas[0].width;
  tH = imgList[0].imageDatas[0].height;
  if (targetTexture.useMipmap) {
    targetTexture.mipMaps = Math.round(Math.log2(Math.max(tW, tH)));
    if (targetTexture.mipMaps > 10) targetTexture.mipMaps = 10;
  }
  textureDescriptor = {
    size: {width: tW, height: tH, depthOrArrayLayers: targetTexture instanceof BitmapTexture ? 1 : 6},
    dimension: '2d',
    format: 'rgba8unorm',
    // sampleCount: 1,
    mipLevelCount: targetTexture.useMipmap ? targetTexture.mipMaps + 1 : 1,
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING
  };
  gpuTexture = redGPUContext.device.createTexture(textureDescriptor);
  MIPMAP_TABLE.set(targetTexture.mapKey, gpuTexture);
  let promiseList = [];
  commandEncoder = redGPUContext.device.createCommandEncoder({});
  imgList.forEach((imgInfo, face) => {
    promiseList.push(CopyBufferToTexture(commandEncoder, redGPUContext.device, imgInfo.imageDatas, gpuTexture, targetTexture, face));
  });
  Promise.all(promiseList)
    .then(
      _ => {
        redGPUContext.device.queue.submit([commandEncoder.finish()]);
        console.log('이놈은뭐냐', gpuTexture);
        targetTexture.resolve(gpuTexture);
        if (targetTexture.onload) targetTexture.onload.call(targetTexture);
      }
    );
};
export default class BitmapCubeTexture extends BaseTexture {
  constructor(redGPUContext, srcList, sampler, useMipmap = true, onload, onerror) {
    super();
    if (!defaultSampler) defaultSampler = new Sampler(redGPUContext);
    this.sampler = sampler || defaultSampler;
    this.onload = onload;
    this.onerror = onerror;
    this.mapKey = srcList + useMipmap + this.sampler.string;
    this.useMipmap = useMipmap;
    if (!srcList) {
      console.log('src');
    } else {
      let self = this;
      new ImageLoader(redGPUContext, srcList, function (e) {
        // console.log(MIPMAP_TABLE.get(self.mapKey));
        //FIXME - 캐싱이 왜안되나
        if (MIPMAP_TABLE.get(self.mapKey)) {
          console.log('BitmapCubeTexture - 캐싱사용', e);
          console.log('뭐가오는거지', MIPMAP_TABLE);
          self.resolve(MIPMAP_TABLE.get(self.mapKey));
          if (self.onload) self.onload(self);
        } else {
          console.log('BitmapCubeTexture - 신규생성', e);
          if (e.ok) makeMipmap(redGPUContext, this.imgList, self);
          else {
            self.resolve(null);
            if (self.onerror) self.onerror(self);
          }
        }
      }, ImageLoader.TYPE_CUBE);
    }
  }
}
