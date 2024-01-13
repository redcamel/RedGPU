/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 14:4:9
 *
 */

import Buffer from "../buffer/Buffer.js";
import Geometry from "../geometry/Geometry.js";
import InterleaveInfo from "../geometry/InterleaveInfo.js";
import RedGPUContext from "../RedGPUContext.js";
import baseGeometry from "../base/baseGeometry.js";
import glMatrix from "../base/gl-matrix-min.js";

export default class Cylinder extends baseGeometry {
  #makeData = (function () {
    let generateTorso;
    let generateCap;
    //TODO 정리
    return function (redGPUContext, typeKey, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength, uvSize) {
      ////////////////////////////////////////////////////////////////////////////
      // 데이터 생성!
      // buffers Data
      let interleaveData = [];
      let indexData = [];
      //
      let index = 0;
      let indexArray = [];
      let halfHeight = height / 2;
      let groupStart = 0;

      generateTorso = function () {
        let x, y;
        let normal = [];
        let vertex = [];
        let groupCount = 0;
        // this will be used to calculate the normal
        let slope = (radiusBottom - radiusTop) / height;
        // generate vertices, normals and uvs
        for (y = 0; y <= heightSegments; y++) {
          let indexRow = [];
          let v = y / heightSegments;
          // calculate the radius of the current row
          let radius = v * (radiusBottom - radiusTop) + radiusTop;
          for (x = 0; x <= radialSegments; x++) {
            let u = x / radialSegments;
            let theta = u * thetaLength + thetaStart;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);
            // vertex
            vertex[0] = radius * sinTheta;
            vertex[1] = -v * height + halfHeight;
            vertex[2] = radius * cosTheta;
            interleaveData.push(vertex[0], vertex[1], vertex[2]);
            // normal
            normal[0] = sinTheta;
            normal[1] = slope;
            normal[2] = cosTheta;
            glMatrix.vec3.normalize(normal, normal);
            interleaveData.push(normal[0], normal[1], normal[2]);
            // uv
            interleaveData.push(u * uvSize, v * uvSize);
            // save index of vertex in respective row
            indexRow.push(index++);
          }
          // now save vertices of the row in our index array
          indexArray.push(indexRow);
        }
        // generate indices
        for (x = 0; x < radialSegments; x++) {
          for (y = 0; y < heightSegments; y++) {
            // we use the index array to access the correct indices
            let a = indexArray [y][x];
            let b = indexArray[y + 1][x];
            let c = indexArray[y + 1][x + 1];
            let d = indexArray[y][x + 1];
            // faces
            indexData.push(a, b, d);
            indexData.push(b, c, d);
            // update group counter
            groupCount += 6;
          }
        }
        groupStart += groupCount;
      };
      generateCap = function (top) {
        let x, centerIndexStart, centerIndexEnd;
        let uv = [];
        let vertex = [];
        let groupCount = 0;
        let radius = (top === true) ? radiusTop : radiusBottom;
        let sign = (top === true) ? 1 : -1;
        // save the index of the first center vertex
        centerIndexStart = index;
        // first we generate the center vertex data of the cap.
        // because the geometry needs one set of uvs per face,
        // we must generate a center vertex per face/segment
        for (x = 1; x <= radialSegments; x++) {
          // vertex
          interleaveData.push(0, halfHeight * sign, 0);
          // normal
          interleaveData.push(0, sign, 0);
          // uv
          interleaveData.push(uvSize * 0.5, uvSize * 0.5);
          // increase index
          index++;
        }
        // save the index of the last center vertex
        centerIndexEnd = index;
        // now we generate the surrounding vertices, normals and uvs
        for (x = 0; x <= radialSegments; x++) {
          let u = x / radialSegments;
          let theta = u * thetaLength + thetaStart;
          let cosTheta = Math.cos(theta);
          let sinTheta = Math.sin(theta);
          // vertex
          vertex[0] = radius * sinTheta;
          vertex[1] = halfHeight * sign;
          vertex[2] = radius * cosTheta;
          interleaveData.push(vertex[0], vertex[1], vertex[2]);
          // normal
          interleaveData.push(0, sign, 0);
          // uv
          uv[0] = (cosTheta * 0.5) + 0.5;
          uv[1] = (sinTheta * 0.5 * sign) + 0.5;
          interleaveData.push(uv[0] * uvSize, uvSize - uv[1] * uvSize);
          // increase index
          index++;
        }
        // generate indices
        for (x = 0; x < radialSegments; x++) {
          let c = centerIndexStart + x;
          let i = centerIndexEnd + x;
          if (top === true) {
            // face top
            indexData.push(i, i + 1, c);
          } else {
            // face bottom
            indexData.push(i + 1, i, c);
          }
          groupCount += 3;
        }
        // calculate new start value for groups
        groupStart += groupCount;

      };
      generateTorso();
      if (openEnded === false) {
        if (radiusTop > 0) generateCap(true);
        if (radiusBottom > 0) generateCap(false);
      }

      return new Geometry(
        redGPUContext,
        new Buffer(
          redGPUContext,
          `${typeKey}_interleaveBuffer`,
          Buffer.TYPE_VERTEX,
          new Float32Array(interleaveData),
          [
            new InterleaveInfo('vertexPosition', "float32x3"),
            new InterleaveInfo('vertexNormal', "float32x3"),
            new InterleaveInfo('texcoord', 'float32x2')
          ]
        ),
        new Buffer(
          redGPUContext,
          `${typeKey}_indexBuffer`,
          Buffer.TYPE_INDEX,
          new Uint32Array(indexData)
        )
      );
    };
  })();

  constructor(redGPUContext, radiusTop = 1, radiusBottom = 1, height = 1, radialSegments = 8, heightSegments = 1, openEnded = false, thetaStart = 0.0, thetaLength = Math.PI * 2, uvSize = 1) {
    super();
    let typeKey;
    // 유일키 생성

    typeKey = [this.constructor.name, redGPUContext, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength, uvSize].join('_');
    if (redGPUContext.state.Geometry.has(typeKey)) return redGPUContext.state.Geometry.get(typeKey);
    let tData = this.#makeData(redGPUContext, typeKey, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength, uvSize);
    this.interleaveBuffer = tData['interleaveBuffer'];
    this.indexBuffer = tData['indexBuffer'];
    this.vertexState = tData['vertexState'];
    redGPUContext.state.Geometry.set(typeKey, this);
    if (RedGPUContext.useDebugConsole) console.log(this);
  }
}
