/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */

"use strict";
import WEBGL_COMPONENT_TYPES from "../cls/WEBGL_COMPONENT_TYPES.js";

let parseSparse_GLTF = function (redGLTFLoader, key, tAccessors, json, vertices, uvs, uvs1, normals, jointWeights, joints) {
	if (tAccessors['sparse']) {
		let sparseVerties = [];
		let sparseNormals = [];
		let sparseUvs = [];
		(function () {
			let tSparse = tAccessors['sparse'];
			let tSparseValuesAccessors = tSparse['values'];
			let tBufferView = json['bufferViews'][tSparseValuesAccessors['bufferView']];
			let tBufferIndex = tBufferView['buffer'];
			let tBuffer = json['buffers'][tBufferIndex];
			let tBufferURIDataView;
			if (tBuffer['uri']) {
				tBufferURIDataView = redGLTFLoader['parsingResult']['uris']['buffers'][tBufferIndex]
			}
			let i, len;
			let tComponentType;
			let tMethod;
			tComponentType = WEBGL_COMPONENT_TYPES[tAccessors['componentType']];
			if (tComponentType == Float32Array) tMethod = 'getFloat32';
			if (tComponentType == Uint32Array) tMethod = 'getUint32';
			if (tComponentType == Uint16Array) tMethod = 'getUint16';
			if (tComponentType == Int16Array) tMethod = 'getInt16';
			if (tComponentType == Uint8Array) tMethod = 'getUint8';
			if (tComponentType == Int8Array) tMethod = 'getInt8';
			let tAccessorBufferOffset = tAccessors['byteOffset'] || 0;
			let tBufferViewOffset = tBufferView['byteOffset'] || 0;
			i = (tBufferViewOffset + tAccessorBufferOffset) / tComponentType['BYTES_PER_ELEMENT'];
			switch (tAccessors['type']) {
				case 'VEC3' :
					len = i + (tComponentType['BYTES_PER_ELEMENT'] * tSparse['count']) / tComponentType['BYTES_PER_ELEMENT'] * 3;

					for (i; i < len; i++) {
						if (key == 'NORMAL') sparseNormals.push(tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true));
						else if (key == 'POSITION') sparseVerties.push(tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true))
					}
					break;
				case 'VEC2' :
					len = i + (tComponentType['BYTES_PER_ELEMENT'] * tSparse['count']) / tComponentType['BYTES_PER_ELEMENT'] * 2;
					for (i; i < len; i++) {
						if (key == 'TEXCOORD_0') {
							sparseUvs.push(tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true))
						}
					}
					break;
				default :
					console.log('알수없는 형식 엑세서 타입', tAccessors['type']);
					break
			}
		})();

		let tSparse = tAccessors['sparse'];
		let tSparseAccessors = tSparse['indices'];

		let tBufferView = json['bufferViews'][tSparseAccessors['bufferView']];
		let tBufferIndex = tBufferView['buffer'];
		let tBuffer = json['buffers'][tBufferIndex];
		let tBufferURIDataView;
		if (tBuffer['uri']) {
			tBufferURIDataView = redGLTFLoader['parsingResult']['uris']['buffers'][tBufferIndex]
		}
		let i, len;
		let tComponentType;
		let tMethod;
		tComponentType = WEBGL_COMPONENT_TYPES[tSparseAccessors['componentType']];
		if (tComponentType == Uint16Array) tMethod = 'getUint16';
		else if (tComponentType == Uint8Array) tMethod = 'getUint8';
		let tAccessorBufferOffset = tSparseAccessors['byteOffset'] || 0;
		let tBufferViewOffset = tBufferView['byteOffset'] || 0;
		i = (tBufferViewOffset + tAccessorBufferOffset) / tComponentType['BYTES_PER_ELEMENT'];
		//
		len = i + (tComponentType['BYTES_PER_ELEMENT'] * tSparse['count']) / tComponentType['BYTES_PER_ELEMENT'];

		let sparseIndex = 0;
		for (i; i < len; i++) {
			let targetIndex = tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true);

			vertices[targetIndex * 3] = sparseVerties[sparseIndex * 3];
			vertices[targetIndex * 3 + 1] = sparseVerties[sparseIndex * 3 + 1];
			vertices[targetIndex * 3 + 2] = sparseVerties[sparseIndex * 3 + 2];
			sparseIndex++

		}
	}
};

export default parseSparse_GLTF;