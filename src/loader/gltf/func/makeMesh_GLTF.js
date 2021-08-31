/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */

"use strict";
import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF.js";
import PBRMaterial_System from "../../../material/system/PBRMaterial_System.js";
import UTIL from "../../../util/UTIL.js";
import RedGPUContext from "../../../RedGPUContext.js";
import InterleaveInfo from "../../../geometry/InterleaveInfo.js";
import Geometry from "../../../geometry/Geometry.js";
import Buffer from "../../../buffer/Buffer.js";
import UUID from "../../../base/UUID.js";
import Mesh from "../../../object3D/Mesh.js";
import Render from "../../../renderer/Render.js";
import makeInterleaveData_GLTF from "./makeInterleaveData_GLTF.js";
import parseAttributeInfo_GLTF from "./parseAttributeInfo_GLTF.js";
import parseIndicesInfo_GLTF from "./parseIndicesInfo_GLTF.js";
import parseMaterialInfo_GLTF from "./parseMaterialInfo_GLTF.js";
import MorphInfo_GLTF from "../cls/MorphInfo_GLTF.js";
import parseSparse_GLTF from "./parseSparse_GLTF.js";

let makeMesh_GLTF = function (redGLTFLoader, json, meshData) {
  let tName, tDoubleSide, tAlphaMode, tAlphaCutoff;
  if (meshData['name']) tName = meshData['name'];
  let tMeshList = [];

  meshData['primitives'].forEach(function (v, index) {
    let tMesh;
    let tMaterial;
    let indices = [];
    // 어트리뷰트에서 파싱되는놈들
    let vertices = [];
    let verticesColor_0 = [];
    let uvs = [];
    let uvs1 = [];
    let normals = [];
    let jointWeights = [];
    let joints = [];
    let tangents = [];
    let tDrawMode;
    // 형상 파싱
    if (v['attributes']) {
      for (let key in v['attributes']) {
        // 엑세서를 통해서 정보파악하고
        let accessorIndex = v['attributes'][key];
        let accessorInfo = new AccessorInfo_GLTF(redGLTFLoader, json, accessorIndex);
        // 어트리뷰트 갈궈서 파악함
        parseAttributeInfo_GLTF(
          redGLTFLoader, json, key, accessorInfo,
          vertices, uvs, uvs1, normals, jointWeights, joints, verticesColor_0, tangents
        );
        // 스파스 정보도 갈굼
        if (accessorInfo['accessor']['sparse']) parseSparse_GLTF(redGLTFLoader, key, accessorInfo['accessor'], json, vertices, uvs, uvs1, normals, jointWeights, joints);
      }
    }
    // 인덱스 파싱
    if ('indices' in v) {
      // 버퍼뷰의 위치를 말하므로...이를 추적파싱항
      let accessorIndex = v['indices'];
      let accessorInfo = new AccessorInfo_GLTF(redGLTFLoader, json, accessorIndex);
      parseIndicesInfo_GLTF(
        redGLTFLoader, json, accessorInfo, indices
      );
    }
    // 재질파싱
    tMaterial = parseMaterialInfo_GLTF(redGLTFLoader, json, v);
    tDoubleSide = tMaterial[1];
    tAlphaMode = tMaterial[2];
    tAlphaCutoff = tMaterial[3];
    tMaterial = tMaterial[0];
    if (tMaterial instanceof PBRMaterial_System) redGLTFLoader['parsingResult']['materials'].push(tMaterial);
    // 모드 파싱
    if ('mode' in v) {
      // 0 POINTS
      // 1 LINES
      // 2 LINE_LOOP
      // 3 LINE_STRIP
      // 4 TRIANGLES
      // 5 TRIANGLE_STRIP
      // 6 TRIANGLE_FAN
      switch (v['mode']) {
        case 0 :
          tDrawMode = "point-list";
          break;
        case 1 :
          tDrawMode = "line-list";//redGLTFLoader['redGPUContext'].gl.LINES;
          break;
        case 2 :
          tDrawMode = "line-list";//redGLTFLoader['redGPUContext'].gl.LINE_LOOP;
          break;
        case 3 :
          // tDrawMode = "line-strip";//redGLTFLoader['redGPUContext'].gl.LINE_STRIP;
          tDrawMode = "line-list";//redGLTFLoader['redGPUContext'].gl.LINE_STRIP;
          break;
        case 4 :
          tDrawMode = "triangle-list";
          break;
        case 5 :
          tDrawMode = "triangle-strip";
          break;
        case 6 :
          tDrawMode = "triangle-strip";//redGLTFLoader['redGPUContext'].gl.TRIANGLE_FAN;
          break;
      }
    }
    /////////////////////////////////////////////////////////
    // 최종데이터 생산
    let normalData;
    if (normals.length) normalData = normals;
    else normalData = UTIL.calculateNormals(vertices, indices);
    let interleaveData = [];
    makeInterleaveData_GLTF(interleaveData, vertices, verticesColor_0, normalData, uvs, uvs1, jointWeights, joints, tangents);

    if (RedGPUContext.useDebugConsole) console.log('interleaveData', interleaveData);


    /////////////////////////////////////////////////////////
    // 메쉬 생성
    let tGeo;
    let tInterleaveInfoList = [];
    if (vertices.length) tInterleaveInfoList.push(new InterleaveInfo('aVertexPosition', "float32x3"));
    if (normalData.length) tInterleaveInfoList.push(new InterleaveInfo('aVertexNormal', "float32x3"));
    if (uvs.length) tInterleaveInfoList.push(new InterleaveInfo('aTexcoord', 'float32x2'));
    if (uvs1.length) tInterleaveInfoList.push(new InterleaveInfo('aTexcoord1', 'float32x2'));
    else if (uvs.length) tInterleaveInfoList.push(new InterleaveInfo('aTexcoord1', 'float32x2'));
    tInterleaveInfoList.push(new InterleaveInfo('aVertexColor_0', 'float32x4'));
    tInterleaveInfoList.push(new InterleaveInfo('aVertexWeight', 'float32x4'));
    tInterleaveInfoList.push(new InterleaveInfo('aVertexJoint', 'float32x4'));
    tInterleaveInfoList.push(new InterleaveInfo('aVertexTangent', 'float32x4'));

    tGeo = new Geometry(
      redGLTFLoader['redGPUContext'],
      new Buffer(
        redGLTFLoader['redGPUContext'],
        'testGLTF_interleaveBuffer_' + UUID.getNextUUID(),
        Buffer.TYPE_VERTEX,
        new Float32Array(interleaveData),
        tInterleaveInfoList
      ),
      indices.length ? new Buffer(
        redGLTFLoader['redGPUContext'],
        'testGLTF_indexBuffer_' + UUID.getNextUUID(),
        Buffer.TYPE_INDEX,
        new Uint32Array(indices)
      ) : null
    );
    if (!tMaterial) {
      UTIL.throwFunc('재질을 파싱할수없는경우 ', v);
    }
    tMesh = new Mesh(redGLTFLoader['redGPUContext'], tGeo, tMaterial);


    if (tName) {
      tMesh.name = tName;
      if (redGLTFLoader['parsingOption']) {
        for (let k in redGLTFLoader['parsingOption']) {
          if (tName.toLowerCase().indexOf(k) > -1) {
            redGLTFLoader['parsingOption'][k](tMesh);
          }
        }
      }

    }
    if (tDrawMode) tMesh.primitiveTopology = tDrawMode;
    else tMesh.primitiveTopology = "triangle-list";
    //
    if (tDoubleSide) {
      tMesh.cullMode = 'none';
      tMaterial.useMaterialDoubleSide = true;
    }
    switch (tAlphaMode) {
      // TODO

      case 'BLEND' :
        tMesh.renderDrawLayerIndex = Render.DRAW_LAYER_INDEX1;
        tMaterial.alphaBlend = 2;
        break;
      case 'MASK' :
        tMaterial.alphaBlend = 1;
        tMaterial.cutOff = tAlphaCutoff;
        tMaterial.useCutOff = true;
        break;
      default :
        tMaterial.alphaBlend = 0;
        tMaterial.useCutOff = false;
    }
    if (verticesColor_0.length) tMaterial.useVertexColor_0 = true;
    if (tangents.length) tMaterial.useVertexTangent = true;

    /////////////////////////////////////////////////////////
    // 모프리스트 설정
    let morphInfo = new MorphInfo_GLTF(redGLTFLoader, json, v, meshData['weights']);
    morphInfo['list'].forEach(function (v) {
      let normalData;
      if (v['normals'].length) normalData = v['normals'];
      else normalData = UTIL.calculateNormals(v['vertices'], indices);
      let interleaveData = [];
      makeInterleaveData_GLTF(interleaveData, v['vertices'], v['verticesColor_0'], normalData, v['uvs'], v['uvs1'], v['jointWeights'], v['joints'], v['tangents']);
      v['interleaveData'] = interleaveData;
    });
    tMesh['_morphInfo'] = morphInfo;
    tMesh['_morphInfo']['origin'] = new Float32Array(interleaveData);
    if (RedGPUContext.useDebugConsole) console.log('모프리스트', tMesh['_morphInfo']);
    /////////////////////////////////////////////////////
    let targetData = tMesh['geometry']['interleaveBuffer']['data'];
    let NUM = 0;
    tInterleaveInfoList.forEach(function (v) {
      NUM += v['size'];
    });
    let gap = 0;
    tMesh['_morphInfo']['list'].forEach(function (v, index) {
      let i = 0, len = targetData.length / NUM;
      let tWeights = tMesh['_morphInfo']['list']['weights'][index] == undefined ? 0.5 : tMesh['_morphInfo']['list']['weights'][index];
      for (i; i < len; i++) {
        targetData[i * NUM + 0] += v['vertices'][i * 3 + 0] * tWeights;
        targetData[i * NUM + 1] += v['vertices'][i * 3 + 1] * tWeights;
        targetData[i * NUM + 2] += v['vertices'][i * 3 + 2] * tWeights;
      }
    });
    tMesh['geometry']['interleaveBuffer'].update(targetData);
    tMesh['_morphInfo']['origin'] = new Float32Array(targetData);
    /////////////////////////////////////////////////////
    v['Mesh'] = tMesh;
    tMeshList.push(tMesh);
    // console.log('vertices', vertices);
    // console.log('normalData', normalData);
    // console.log('uvs', uvs);
    // console.log('joints', joints);
    // console.log('jointWeights', jointWeights);
    // console.log('tangents', tangents);
    // console.log('indices', indices)
  });
  return tMeshList;
};

export default makeMesh_GLTF;
