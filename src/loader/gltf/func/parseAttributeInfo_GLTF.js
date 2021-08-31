/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */

"use strict";
import UTIL from "../../../util/UTIL.js";

let parseAttributeInfo_GLTF = function (redGLTFLoader, json, key, accessorInfo, vertices, uvs, uvs1, normals, jointWeights, joints, verticesColor_0, tangents) {
  let tBYTES_PER_ELEMENT = accessorInfo['componentType_BYTES_PER_ELEMENT'];
  let tBufferViewByteStride = accessorInfo['bufferViewByteStride'];
  let tBufferURIDataView = accessorInfo['bufferURIDataView'];
  let tGetMethod = accessorInfo['getMethod'];
  let tType = accessorInfo['accessor']['type'];
  let tCount = accessorInfo['accessor']['count'];
  let strideIndex = 0;
  let stridePerElement = tBufferViewByteStride / tBYTES_PER_ELEMENT;
  let i = accessorInfo['startIndex'];
  let len;
  switch (tType) {
    case 'VEC4' :
      if (tBufferViewByteStride) {
        len = i + tCount * (tBufferViewByteStride / tBYTES_PER_ELEMENT);
        for (i; i < len; i++) {
          if (strideIndex % stridePerElement < 4) {
            if (key == 'WEIGHTS_0') jointWeights.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            else if (key == 'JOINTS_0') joints.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            else if (key == 'COLOR_0') verticesColor_0.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            else if (key == 'TANGENT') tangents.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            // else UTIL.throwFunc('VEC4에서 현재 지원하고 있지 않는 키', key)
          }
          strideIndex++;
        }
      } else {
        len = i + tCount * 4;
        for (i; i < len; i++) {
          if (key == 'WEIGHTS_0') jointWeights.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          else if (key == 'JOINTS_0') joints.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          else if (key == 'COLOR_0') verticesColor_0.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          else if (key == 'TANGENT') tangents.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          // else UTIL.throwFunc('VEC4에서 현재 지원하고 있지 않는 키', key)
          strideIndex++;
        }
      }
      break;
    case 'VEC3' :
      if (tBufferViewByteStride) {
        len = i + tCount * (tBufferViewByteStride / tBYTES_PER_ELEMENT);
        for (i; i < len; i++) {
          if (strideIndex % stridePerElement < 3) {
            if (key == 'NORMAL') normals.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            else if (key == 'POSITION') vertices.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            else if (key == 'COLOR_0') {
              verticesColor_0.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
              if (strideIndex % stridePerElement == 2) verticesColor_0.push(1);
            }
            // else if ( key == 'TANGENT' ) tangents.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
            // else UTIL.throwFunc('VEC3에서 현재 지원하고 있지 않는 키', key)
          }
          strideIndex++;
        }
      } else {
        len = i + tCount * 3;
        for (i; i < len; i++) {
          if (key == 'NORMAL') normals.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          else if (key == 'POSITION') vertices.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          else if (key == 'COLOR_0') {
            verticesColor_0.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            if (strideIndex % 3 == 2) verticesColor_0.push(1);
          }
          // else if ( key == 'TANGENT' ) tangents.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
          // else UTIL.throwFunc('VEC3에서 현재 지원하고 있지 않는 키', key)
          strideIndex++;
        }
      }
      break;
    case 'VEC2' :
      if (tBufferViewByteStride) {
        len = i + tCount * (tBufferViewByteStride / tBYTES_PER_ELEMENT);
        for (i; i < len; i++) {
          if (strideIndex % stridePerElement < 2) {
            if (key == 'TEXCOORD_0') {
              uvs.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            } else if (key == 'TEXCOORD_1') {
              uvs1.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            } else UTIL.throwFunc('VEC2에서 현재 지원하고 있지 않는 키', key);
          }
          strideIndex++;
        }
      } else {
        len = i + tCount * 2;
        for (i; i < len; i++) {
          if (key == 'TEXCOORD_0') {
            uvs.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          } else if (key == 'TEXCOORD_1') {
            uvs1.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          } else UTIL.throwFunc('VEC2에서 현재 지원하고 있지 않는 키', key);
          strideIndex++;
        }
      }
      break;
    default :
      console.log('알수없는 형식 엑세서 타입', tType);
      break;
  }
};

export default parseAttributeInfo_GLTF;
