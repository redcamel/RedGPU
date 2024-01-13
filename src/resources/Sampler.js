/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */

const TABLE = {};
export default class Sampler {
  constructor(redGPUContext, option = {}) {
    option = {
      magFilter: option['magFilter'] || "linear",
      minFilter: option['minFilter'] || "linear",
      mipmapFilter: option['mipmapFilter'] || "linear",
      addressModeU: option['addressModeU'] || "repeat",
      addressModeV: option['addressModeV'] || "repeat",
      addressModeW: option['addressModeW'] || "repeat"
    };
    this.string = JSON.stringify(option);
    if (TABLE[this.string]) return TABLE[this.string];
    else this.GPUSampler = redGPUContext.device.createSampler(option);
    TABLE[this.string] = this;
  }
}
