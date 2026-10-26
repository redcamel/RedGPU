import WEBGL_COMPONENT_TYPES from "../core/WEBGL_COMPONENT_TYPES";
import {Accessor, GLTF} from "../GLTF";
import GLTFLoader from "../GLTFLoader";

/**
 * [KO] GLTF Accessor의 희소(Sparse) 데이터를 파싱하여 정점 배열에 적용합니다.
 * [EN] Parses sparse data of a GLTF Accessor and applies it to the vertex array.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param propertyKey -
 * [KO] 정점 속성 키 (예: 'POSITION', 'NORMAL', 'TEXCOORD_0')
 * [EN] Vertex attribute key (e.g., 'POSITION', 'NORMAL', 'TEXCOORD_0')
 * @param targetAccessor -
 * [KO] 대상 GLTF Accessor 객체
 * [EN] Target GLTF Accessor object
 * @param gltfData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param vertices -
 * [KO] 희소 데이터가 적용될 대상 정점 배열
 * [EN] Target vertex array to which sparse data will be applied
 * @category Loader
 */
const parseSparse_GLTF = (gltfLoader: GLTFLoader, propertyKey: string, targetAccessor: Accessor, gltfData: GLTF, vertices: any) => {
    const targetSparse = targetAccessor.sparse;
    if (!targetSparse) return;
    const {values: sparseValuesAccessor, indices: sparseIndices, count: sparseCount} = targetSparse;
    const bufferViewsData = gltfData.bufferViews;
    const targetBufferView = bufferViewsData[sparseValuesAccessor.bufferView];
    const targetBufferID = targetBufferView.buffer;
    const buffersData = gltfData.buffers;
    const targetBuffer = buffersData[targetBufferID];
    const arraySparseVertices = [];
    const arraySparseNormals = [];
    const arraySparseUvs = [];
    const bufferViewData = bufferViewsData[sparseIndices.bufferView];
    const bufferGlTfId = bufferViewData.buffer;
    const buffer = buffersData[bufferGlTfId];
    let targetBufferURIDataView;
    if (targetBuffer.uri) targetBufferURIDataView = gltfLoader.parsingResult.uris.buffers[targetBufferID];
    const componentType = WEBGL_COMPONENT_TYPES[targetAccessor.componentType];
    const {BYTES_PER_ELEMENT} = componentType;
    let methodToGetData;
    switch (componentType) {
        case Float32Array:
            methodToGetData = 'getFloat32';
            break;
        case Uint32Array:
            methodToGetData = 'getUint32';
            break;
        case Uint16Array:
            methodToGetData = 'getUint16';
            break;
        case Int16Array:
            methodToGetData = 'getInt16';
            break;
        case Uint8Array:
            methodToGetData = 'getUint8';
            break;
        case Int8Array:
            methodToGetData = 'getInt8';
            break;
    }
    const accessorBufferOffset = targetAccessor.byteOffset || 0;
    const bufferViewOffset = targetBufferView.byteOffset || 0;
    let initialIndex = (bufferViewOffset + accessorBufferOffset) / BYTES_PER_ELEMENT;
    let finalIndex;
    switch (targetAccessor.type) {
        case 'VEC3':
            finalIndex = initialIndex + (BYTES_PER_ELEMENT * sparseCount) / BYTES_PER_ELEMENT * 3;
            for (initialIndex; initialIndex < finalIndex; initialIndex++) {
                const data = targetBufferURIDataView[methodToGetData](initialIndex * BYTES_PER_ELEMENT, true);
                if (propertyKey == 'NORMAL') arraySparseNormals.push(data);
                else if (propertyKey == 'POSITION') arraySparseVertices.push(data);
            }
            break;
        case 'VEC2':
            finalIndex = initialIndex + (BYTES_PER_ELEMENT * sparseCount) / BYTES_PER_ELEMENT * 2;
            for (initialIndex; initialIndex < finalIndex; initialIndex++) {
                if (propertyKey == 'TEXCOORD_0') arraySparseUvs.push(targetBufferURIDataView[methodToGetData](initialIndex * BYTES_PER_ELEMENT, true));
            }
            break;
        default :
            console.log('Unknown accessor type', targetAccessor.type);
            break;
    }
    let bufferURIDataView;
    if (buffer.uri) bufferURIDataView = gltfLoader.parsingResult.uris.buffers[bufferGlTfId];
    const indicesComponentType = WEBGL_COMPONENT_TYPES[sparseIndices.componentType];
    const indicesComponentType_BYTES_PER_ELEMENT = indicesComponentType.BYTES_PER_ELEMENT
    const indicesMethod = indicesComponentType === Uint16Array ? 'getUint16' : 'getUint8';
    const sparseIndicesOffset = sparseIndices.byteOffset || 0;
    const bufferViewIndicesOffset = bufferViewData.byteOffset || 0;
    let sparseIndex = (bufferViewIndicesOffset + sparseIndicesOffset) / indicesComponentType_BYTES_PER_ELEMENT;
    const limitSparseIndex = sparseIndex + (indicesComponentType_BYTES_PER_ELEMENT * sparseCount) / indicesComponentType_BYTES_PER_ELEMENT;
    let countSparseVertices = 0;
    for (; sparseIndex < limitSparseIndex; sparseIndex++) {
        const targetIndex = bufferURIDataView[indicesMethod](sparseIndex * indicesComponentType_BYTES_PER_ELEMENT, true);
        vertices[targetIndex * 3] = arraySparseVertices[countSparseVertices * 3];
        vertices[targetIndex * 3 + 1] = arraySparseVertices[countSparseVertices * 3 + 1];
        vertices[targetIndex * 3 + 2] = arraySparseVertices[countSparseVertices * 3 + 2];
        countSparseVertices++;
    }
};
export default parseSparse_GLTF;
