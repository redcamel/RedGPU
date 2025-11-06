import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF";

/**
 * Parses indices information from a GLTF accessor.
 *
 * @param {AccessorInfo_GLTF} accessorInfo - The GLTF accessor information.
 * @param {Array} indices - The array to populate with parsed indices.
 * @returns {void}
 */
const parseIndicesInfo_GLTF = (accessorInfo: AccessorInfo_GLTF, indices) => {
	const {accessor, startIndex, getMethod, bufferURIDataView, componentType_BYTES_PER_ELEMENT} = accessorInfo
	const {type, count} = accessor
	let i = startIndex;
	let len;
	switch (type) {
		case 'SCALAR' :
			len = i + count;
			for (i; i < len; i++) {
				indices.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
			}
			break;
		default :
			console.log('알수없는 형식 엑세서 타입', accessorInfo.accessor);
			break;
	}
};
export default parseIndicesInfo_GLTF;
