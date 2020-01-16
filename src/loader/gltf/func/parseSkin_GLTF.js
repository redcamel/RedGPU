/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */

"use strict";
import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF.js";
let checkJoint = function (redGLTFLoader, skinInfo, nodes, v) {
	let tJointMesh = nodes[v]['Mesh'];
	if (tJointMesh) {
		let tJointMesh = nodes[v]['Mesh'];
		skinInfo['joints'].push(tJointMesh);
		// tJointMesh.geometry = Sphere(redGLTFLoader['redGPUContext'], 0.05, 3, 3, 3);
		// tJointMesh.material = ColorMaterial(redGLTFLoader['redGPUContext'], '#ff0000');
		tJointMesh.primitiveTopology = 'line-list';
		tJointMesh.depthCompare = 'never'
	} else requestAnimationFrame(function () {
		checkJoint(redGLTFLoader, skinInfo, nodes, v)
	})
};
let parseSkin_GLTF = function (redGLTFLoader, json, info, tMesh) {
	console.log('스킨설정!', info);
	let skinInfo = {
		joints: [],
		inverseBindMatrices: []
	};
	let nodes = json['nodes'];
	info['joints'].forEach(function (v) {
		checkJoint(redGLTFLoader, skinInfo, nodes, v)
	});
	// 스켈레톤 정보가 있으면 정보와 메쉬를 연결해둔다.
	if (info['skevaron']) skinInfo['skevaron'] = json['nodes'][info['skevaron']]['Mesh'];
	// 액세서 구하고..
	// 정보 파싱한다.
	let accessorIndex = info['inverseBindMatrices'];
	let accessorInfo = new AccessorInfo_GLTF(redGLTFLoader, json, accessorIndex);
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
		case 'MAT4' :
			if (tBufferViewByteStride) {
				len = i + tCount * (tBufferViewByteStride / tBYTES_PER_ELEMENT);
				for (i; i < len; i++) {
					if (strideIndex % stridePerElement < 16) {
						skinInfo['inverseBindMatrices'].push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
					}
					strideIndex++
				}
			} else {
				len = i + tCount * 16;
				for (i; i < len; i++) {
					skinInfo['inverseBindMatrices'].push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
					strideIndex++
				}
			}
			break;
		default :
			console.log('알수없는 형식 엑세서 타입', tType);
			break
	}
	skinInfo['inverseBindMatrices'] = new Float32Array(skinInfo['inverseBindMatrices']);
	tMesh['skinInfo'] = skinInfo;
	tMesh.material.skin = tMesh['skinInfo'] ? true : false;
};
export default parseSkin_GLTF;