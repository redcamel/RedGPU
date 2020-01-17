/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.17 11:10:39
 *
 */

"use strict";
import parseTRSAndMATRIX_GLTF from "./parseTRSAndMATRIX_GLTF.js";
import parseSkin_GLTF from "./parseSkin_GLTF.js";
import Mesh from "../../../object3D/Mesh.js";
import makeMesh_GLTF from "./makeMesh_GLTF.js";

let parseNode_GLTF = (function () {
	return function (redGLTFLoader, json, nodeIndex, info, parentMesh) {
		if ('mesh' in info) {
			let tMeshIndex = info['mesh'];
			makeMesh_GLTF(redGLTFLoader, json, json['meshes'][tMeshIndex])
				.forEach(
					function (tMesh) {
						parentMesh.addChild(info['Mesh'] = tMesh);
						parseTRSAndMATRIX_GLTF(tMesh, info);
						if ('children' in info) {
							info['children'].forEach(function (index) {
								parseNode_GLTF(redGLTFLoader, json, index, json['nodes'][index], tMesh)
							})
						}
						if ('skin' in info) parseSkin_GLTF(redGLTFLoader, json, json['skins'][info['skin']], tMesh)
					}
				)
		} else {
			let tGroup;
			if (redGLTFLoader['parsingResult']['groups'][nodeIndex]) {
				console.log('기존에 존재!', redGLTFLoader['parsingResult']['groups'][nodeIndex]);
				tGroup = redGLTFLoader['parsingResult']['groups'][nodeIndex];
				info['Mesh'] = tGroup
			} else {
				tGroup = new Mesh(redGLTFLoader['redGPUContext']);
				parentMesh.addChild(tGroup);
				info['Mesh'] = tGroup;
				redGLTFLoader['parsingResult']['groups'][nodeIndex] = tGroup;
				redGLTFLoader['parsingResult']['groups'][nodeIndex]['name'] = info['name']
			}
			parseTRSAndMATRIX_GLTF(tGroup, info);
			// 카메라가 있으면 또 연결시킴
			if ('camera' in info) {
				redGLTFLoader['parsingResult']['cameras'][info['camera']]['_parentMesh'] = parentMesh;
				redGLTFLoader['parsingResult']['cameras'][info['camera']]['_targetMesh'] = tGroup;
				let tCameraMesh = new Mesh(redGLTFLoader['redGPUContext']);
				tGroup.addChild(tCameraMesh);
				redGLTFLoader['parsingResult']['cameras'][info['camera']]['_cameraMesh'] = tCameraMesh
			}
			if ('children' in info) {
				info['children'].forEach(function (index) {
					parseNode_GLTF(redGLTFLoader, json, index, json['nodes'][index], tGroup)
				})
			}
			if ('skin' in info) parseSkin_GLTF(redGLTFLoader, json, json['skins'][info['skin']], tGroup)
		}
	}
})();
export default parseNode_GLTF;