/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
"use strict";
import AccessorInfo_GLTF from "./AccessorInfo_GLTF.js";
import parseAttributeInfo_GLTF from "../func/parseAttributeInfo_GLTF.js";
import parseSparse_GLTF from "../func/parseSparse_GLTF.js";

class MorphInfo_GLTF {
  constructor(redGLTFLoader, json, primitiveData, weightsData) {
    let morphList = [];
    if (primitiveData['targets']) {
      primitiveData['targets'].forEach(function (v2) {
        let tMorphData = {
          vertices: [],
          verticesColor_0: [],
          normals: [],
          uvs: [],
          uvs1: [],
          jointWeights: [],
          joints: [],
          tangents: []
        };
        morphList.push(tMorphData);
        for (let key in v2) {
          let vertices = tMorphData['vertices'];
          let verticesColor_0 = tMorphData['verticesColor_0'];
          let normals = tMorphData['normals'];
          let uvs = tMorphData['uvs'];
          let uvs1 = tMorphData['uvs1'];
          let jointWeights = tMorphData['jointWeights'];
          let joints = tMorphData['joints'];
          let tangents = tMorphData['tangents'];
          let accessorIndex = v2[key];
          let accessorInfo = new AccessorInfo_GLTF(redGLTFLoader, json, accessorIndex);
          // 어트리뷰트 갈궈서 파악함
          parseAttributeInfo_GLTF(
            redGLTFLoader, json, key, accessorInfo,
            vertices, uvs, uvs1, normals, jointWeights, joints, verticesColor_0, tangents
          );
          // 스파스 정보도 갈굼
          if (accessorInfo['accessor']['sparse']) parseSparse_GLTF(redGLTFLoader, key, accessorInfo['accessor'], json, vertices, uvs, uvs1, normals, jointWeights, joints);
        }
      });
    }
    this['list'] = morphList;
    morphList['weights'] = weightsData || [];
    this['origin'] = null;
  }
}

export default MorphInfo_GLTF;
