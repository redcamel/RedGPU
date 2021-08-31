/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */

"use strict";
import UTIL from "../../../util/UTIL.js";
import WEBGL_COMPONENT_TYPES from "./WEBGL_COMPONENT_TYPES.js";

class AccessorInfo_GLTF {
  constructor(redGLTFLoader, json, accessorIndex) {
    this['accessor'] = json['accessors'][accessorIndex];
    this['bufferView'] = json['bufferViews'][this['accessor']['bufferView']];
    this['bufferIndex'] = this['bufferView']['buffer'];
    this['buffer'] = json['buffers'][this['bufferIndex']];
    this['bufferURIDataView'] = null;
    if (this['buffer']['uri']) {
      this['bufferURIDataView'] = redGLTFLoader['parsingResult']['uris']['buffers'][this['bufferIndex']];
    }
    ////////////////////////////
    this['componentType'] = WEBGL_COMPONENT_TYPES[this['accessor']['componentType']];
    this['componentType_BYTES_PER_ELEMENT'] = this['componentType']['BYTES_PER_ELEMENT'];
    switch (this['componentType']) {
      case Float32Array :
        this['getMethod'] = 'getFloat32';
        break;
      case Uint32Array :
        this['getMethod'] = 'getUint32';
        break;
      case Uint16Array :
        this['getMethod'] = 'getUint16';
        break;
      case Int16Array :
        this['getMethod'] = 'getInt16';
        break;
      case Uint8Array :
        this['getMethod'] = 'getUint8';
        break;
      case Int8Array :
        this['getMethod'] = 'getInt8';
        break;
      default :
        UTIL.throwFunc('파싱할수없는 타입', this['componentType']);
    }
    this['accessorBufferOffset'] = this['accessor']['byteOffset'] || 0;
    this['bufferViewOffset'] = this['bufferView']['byteOffset'] || 0;
    this['bufferViewByteStride'] = this['bufferView']['byteStride'] || 0;
    this['startIndex'] = (this['bufferViewOffset'] + this['accessorBufferOffset']) / this['componentType_BYTES_PER_ELEMENT'];
    // console.log('해당 bufferView 정보', this['bufferView'])
    // console.log('바라볼 버퍼 인덱스', this['bufferIndex'])
    // console.log('바라볼 버퍼', this['buffer'])
    // console.log('바라볼 버퍼데이터', this['bufferURIDataView'])
    // console.log('바라볼 엑세서', this['accessor'])
    // console.log('this['componentType']', this['componentType'])
    // console.log("this['getMethod']", this['getMethod'])
    // console.log("this['bufferView']['byteOffset']", this['bufferView']['byteOffset'])
    // console.log("this['accessor']['byteOffset']", this['accessor']['byteOffset'])
  }
}

export default AccessorInfo_GLTF;
