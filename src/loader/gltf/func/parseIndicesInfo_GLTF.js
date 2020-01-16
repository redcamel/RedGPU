/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */

"use strict";
let parseIndicesInfo_GLTF = function (redGLTFLoader, json,  accessorInfo, indices) {
	let tBYTES_PER_ELEMENT = accessorInfo['componentType_BYTES_PER_ELEMENT'];
	let tBufferURIDataView = accessorInfo['bufferURIDataView'];
	let tGetMethod = accessorInfo['getMethod'];
	let tType = accessorInfo['accessor']['type'];
	let tCount = accessorInfo['accessor']['count'];
	let i = accessorInfo['startIndex'];
	let len;

	switch (tType) {
		case 'SCALAR' :
			len = i + tCount;

			for (i; i < len; i++) {
				indices.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
			}

			break;
		default :
			console.log('알수없는 형식 엑세서 타입', accessorInfo['accessor']);
			break
	}
};
export default parseIndicesInfo_GLTF