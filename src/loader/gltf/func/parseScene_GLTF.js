/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */

"use strict";

import RedGPUContext from "../../../RedGPUContext.js";
import parseNode_GLTF from "./parseNode_GLTF.js";

let parseScene_GLTF = function (redGLTFLoader, json, callback) {
	if (RedGPUContext.useDebugConsole) console.log('parseScene_GLTF 시작');
	if (RedGPUContext.useDebugConsole) console.log(json);
	let i, len;
	let nodesInScene;
	let nodeIndex;
	nodesInScene = json['scenes'][0]['nodes'];
	i = 0;
	len = nodesInScene.length;
	let tick = function () {
		nodeIndex = nodesInScene[i];
		parseNode_GLTF(redGLTFLoader, json, nodeIndex, json['nodes'][nodeIndex], redGLTFLoader['resultMesh']);
		i++;
		if (i === len) {
			if (callback) callback()
		} else requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
};

export default parseScene_GLTF