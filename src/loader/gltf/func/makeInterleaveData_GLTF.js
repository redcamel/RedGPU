/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */
"use strict";
let makeInterleaveData_GLTF = function (interleaveData, vertices, verticesColor_0, normalData, uvs, uvs1, jointWeights, joints, tangents) {
  let i = 0, len = vertices.length / 3;
  let idx = 0;
  for (i; i < len; i++) {
    if (vertices.length) {
      interleaveData[idx++] = vertices[i * 3 + 0];
      interleaveData[idx++] = vertices[i * 3 + 1];
      interleaveData[idx++] = vertices[i * 3 + 2];
    }
    if (normalData.length) {
      interleaveData[idx++] = normalData[i * 3 + 0];
      interleaveData[idx++] = normalData[i * 3 + 1];
      interleaveData[idx++] = normalData[i * 3 + 2];
    } else {
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
    }
    if (!uvs.length) uvs.push(0, 0);
    if (uvs.length) {
      interleaveData[idx++] = uvs[i * 2 + 0];
      interleaveData[idx++] = uvs[i * 2 + 1];
    }
    if (uvs1.length) {
      interleaveData[idx++] = uvs1[i * 2 + 0];
      interleaveData[idx++] = uvs1[i * 2 + 1];
    } else if (uvs.length) {
      interleaveData[idx++] = uvs[i * 2 + 0];
      interleaveData[idx++] = uvs[i * 2 + 1];
    }
    if (verticesColor_0.length) {
      interleaveData[idx++] = verticesColor_0[i * 4 + 0];
      interleaveData[idx++] = verticesColor_0[i * 4 + 1];
      interleaveData[idx++] = verticesColor_0[i * 4 + 2];
      interleaveData[idx++] = verticesColor_0[i * 4 + 3];
    } else {
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
    }
    if (jointWeights.length) {
      interleaveData[idx++] = jointWeights[i * 4 + 0];
      interleaveData[idx++] = jointWeights[i * 4 + 1];
      interleaveData[idx++] = jointWeights[i * 4 + 2];
      interleaveData[idx++] = jointWeights[i * 4 + 3];
    } else {
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
    }
    if (joints.length) {
      interleaveData[idx++] = joints[i * 4 + 0];
      interleaveData[idx++] = joints[i * 4 + 1];
      interleaveData[idx++] = joints[i * 4 + 2];
      interleaveData[idx++] = joints[i * 4 + 3];
    } else {
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
    }
    if (tangents.length) {
      interleaveData[idx++] = tangents[i * 4 + 0];
      interleaveData[idx++] = tangents[i * 4 + 1];
      interleaveData[idx++] = tangents[i * 4 + 2];
      interleaveData[idx++] = tangents[i * 4 + 3];
    } else {
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
    }
  }
};
export default makeInterleaveData_GLTF;
