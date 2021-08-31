/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.6 18:57:8
 *
 */

import RedGPUContext from "../../RedGPUContext.js";

export default function CopyBufferToTexture(commandEncoder, device, imageDatas, gpuTexture, updateTarget, face = -1) {
  let promise = new Promise(((resolve, reject) => {
    imageDatas.forEach((info, mip) => {
      if (!updateTarget.useMipmap && mip) return;
      if (mip > updateTarget.mipMaps) return;
      let data = new Uint8ClampedArray(info.data);
      let width = info.width;
      let height = info.height;
      let bytesPerRow = info.bytesPerRow;
      const textureDataBuffer = device.createBuffer({
        size: data.byteLength + data.byteLength % 4,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
      });
      // console.log(imageData)
      // textureDataBuffer.setSubData(0, data);
      device.queue.writeBuffer(textureDataBuffer, 0, data);
      const bufferView = {
        buffer: textureDataBuffer,
        bytesPerRow: bytesPerRow,
        rowsPerImage: height,
      };
      const textureView = {
        texture: gpuTexture,
        mipLevel: mip,
        origin: {
          z: Math.max(face, 0)
        },
      };
      const textureExtent = {
        width: width,
        height: height,
        depthOrArrayLayers: 1
      };
      commandEncoder.copyBufferToTexture(bufferView, textureView, textureExtent);
      if (RedGPUContext.useDebugConsole) console.log('mip', mip, 'width', width, 'height', height);
    });
    resolve();
  }));
  return promise;
};

