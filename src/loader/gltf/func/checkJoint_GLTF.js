/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.17 11:10:39
 *
 */

"use strict";

let check = (redGLTFLoader, skinInfo, nodes, v) => {
	let tJointMesh = nodes[v]['Mesh'];
	if (tJointMesh) {
		skinInfo['joints'].push(tJointMesh);
		tJointMesh.primitiveTopology = 'line-list';
		tJointMesh.depthCompare = 'never'
	} else checkJoint_GLTF(redGLTFLoader, skinInfo, nodes, v)
};

let checkJoint_GLTF = function (redGLTFLoader, nodes, info) {
	let skinInfo = {joints: [], inverseBindMatrices: []};
	return new Promise((resolve, reject) => {
		console.time('checkJoint_GLTF'+'_'+redGLTFLoader.fileName);
		let i, len;
		i = 0;
		len = info['joints'].length;
		for (i; i < len; i++) check(redGLTFLoader, skinInfo, nodes, info['joints'][i])
		console.timeEnd('checkJoint_GLTF'+'_'+redGLTFLoader.fileName);
		resolve(skinInfo)
	})
};

export default checkJoint_GLTF;