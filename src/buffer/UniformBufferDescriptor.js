/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 20:56:47
 *
 */


import TypeSize from "../resources/TypeSize.js";
import UUID from "../base/UUID.js";
import UTIL from "../util/UTIL.js";

export default class UniformBufferDescriptor {
  constructor(redStruct = [], usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST) {
    if (!Array.isArray(redStruct)) UTIL.throwFunc(`${this.constructor.name} - only allow Array Instance. / inputValue : ${redStruct} { type : ${typeof redStruct} }`);
    this.redStruct = JSON.parse(JSON.stringify(redStruct));
    this.redStructOffsetMap = {};
    let offset = 0;
    let FLOAT4_SIZE = TypeSize.float32x4;
    this.redStruct.map((v) => {
      console.log(v);
      if (!v.valueName) UTIL.throwFunc(`${this.constructor.name} - need valueName / inputValue : ${v.valueName} { type : ${typeof v.valueName} }`);
      if (!v.hasOwnProperty('size')) UTIL.throwFunc(`${this.constructor.name} - need size / inputValue : ${v.size} { type : ${typeof v.size} }`);
      if (v.size <= FLOAT4_SIZE) {
        let t0 = Math.floor(offset / FLOAT4_SIZE);
        let t1 = Math.floor((offset + v.size - 1) / FLOAT4_SIZE);
        if (t0 != t1) offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;
        v.offset = offset;
        // console.log(v.valueName, '결정된 오프셋', offset)
        offset += v.size;
      } else {
        if (offset % FLOAT4_SIZE) offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;
        v.offset = offset;
        offset += v.size;
      }
      this.redStructOffsetMap[v['valueName']] = v.offset;
      v._UUID = v.valueName + '_' + UUID.getNextUUID();
    });
    let t0 = offset % FLOAT4_SIZE;
    this.size = this.redStruct.length ? (offset + (t0 ? (FLOAT4_SIZE - t0) : 0)) : FLOAT4_SIZE;
    this.usage = usage;
    console.log(this)
  }
}
