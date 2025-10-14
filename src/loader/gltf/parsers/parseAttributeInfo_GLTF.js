import consoleAndThrowError from "../../../utils/consoleAndThrowError";
/**
 * Parses attribute information from GLTF format and populates corresponding arrays.
 *
 * @param {string} key - The attribute key.
 * @param {AccessorInfo_GLTF} accessorInfo - The object containing information about the accessor.
 * @param {Array} vertices - The array to store vertex data.
 * @param {Array} uvs - The array to store uv data.
 * @param {Array} uvs1 - The array to store uv1 data.
 * @param {Array} uvs2 - The array to store uv1 data.
 * @param {Array} normals - The array to store normal data.
 * @param {Array} jointWeights - The array to store joint weight data.
 * @param {Array} joints - The array to store joint data.
 * @param {Array} verticesColor_0 - The array to store vertex color data.
 * @param {Array} tangents - The array to store tangent data.
 */
const parseAttributeInfo_GLTF = function (key, accessorInfo, vertices, uvs, uvs1, uvs2, normals, jointWeights, joints, verticesColor_0, tangents) {
    const { accessor, startIndex, getMethod, bufferViewByteStride, bufferURIDataView, componentType_BYTES_PER_ELEMENT } = accessorInfo;
    const { type, count } = accessor;
    let strideIndex = 0;
    const stridePerElement = bufferViewByteStride / componentType_BYTES_PER_ELEMENT;
    let i = startIndex;
    let len;
    switch (type) {
        case 'VEC4':
            if (bufferViewByteStride) {
                len = i + count * (bufferViewByteStride / componentType_BYTES_PER_ELEMENT);
                for (i; i < len; i++) {
                    if (strideIndex % stridePerElement < 4) {
                        if (key == 'WEIGHTS_0')
                            jointWeights.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                        else if (key == 'JOINTS_0')
                            joints.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                        else if (key == 'COLOR_0')
                            verticesColor_0.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                        else if (key == 'TANGENT')
                            tangents.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                        else
                            consoleAndThrowError('VEC4에서 현재 지원하고 있지 않는 키', key);
                    }
                    strideIndex++;
                }
            }
            else {
                len = i + count * 4;
                for (i; i < len; i++) {
                    if (key == 'WEIGHTS_0')
                        jointWeights.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                    else if (key == 'JOINTS_0')
                        joints.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                    else if (key == 'COLOR_0')
                        verticesColor_0.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                    else if (key == 'TANGENT')
                        tangents.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                    else
                        consoleAndThrowError('VEC4에서 현재 지원하고 있지 않는 키', key);
                    strideIndex++;
                }
            }
            break;
        case 'VEC3':
            if (bufferViewByteStride) {
                len = i + count * (bufferViewByteStride / componentType_BYTES_PER_ELEMENT);
                for (i; i < len; i++) {
                    if (strideIndex % stridePerElement < 3) {
                        if (key == 'NORMAL')
                            normals.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                        else if (key == 'POSITION')
                            vertices.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                        else if (key == 'COLOR_0') {
                            verticesColor_0.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                            if (strideIndex % stridePerElement == 2)
                                verticesColor_0.push(1);
                        }
                        else if (key == 'TANGENT')
                            tangents.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                        else
                            consoleAndThrowError('VEC3에서 현재 지원하고 있지 않는 키', key);
                    }
                    strideIndex++;
                }
            }
            else {
                len = i + count * 3;
                for (i; i < len; i++) {
                    if (key == 'NORMAL')
                        normals.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                    else if (key == 'POSITION')
                        vertices.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                    else if (key == 'COLOR_0') {
                        verticesColor_0.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                        if (strideIndex % 3 == 2)
                            verticesColor_0.push(1);
                    }
                    else if (key == 'TANGENT')
                        tangents.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                    else
                        consoleAndThrowError('VEC3에서 현재 지원하고 있지 않는 키', key);
                    strideIndex++;
                }
            }
            break;
        case 'VEC2':
            if (bufferViewByteStride) {
                len = i + count * (bufferViewByteStride / componentType_BYTES_PER_ELEMENT);
                for (i; i < len; i++) {
                    if (strideIndex % stridePerElement < 2) {
                        if (key == 'TEXCOORD_0') {
                            uvs.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                        }
                        else if (key == 'TEXCOORD_1') {
                            uvs1.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                        }
                        else if (key == 'TEXCOORD_2') {
                            uvs2.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                            //TODO uvs2 구현해야함
                        }
                        else
                            consoleAndThrowError('VEC2에서 현재 지원하고 있지 않는 키', key);
                    }
                    strideIndex++;
                }
            }
            else {
                len = i + count * 2;
                for (i; i < len; i++) {
                    if (key == 'TEXCOORD_0') {
                        uvs.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                    }
                    else if (key == 'TEXCOORD_1') {
                        uvs1.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                    }
                    else if (key == 'TEXCOORD_2') {
                        uvs2.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                    }
                    else
                        consoleAndThrowError('VEC2에서 현재 지원하고 있지 않는 키', key);
                    strideIndex++;
                }
            }
            break;
        default:
            console.log('알수없는 형식 엑세서 타입', type);
            break;
    }
};
export default parseAttributeInfo_GLTF;
