import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF";

const EMPTY_UINT32_ARRAY = new Uint32Array(0);

/**
 * [KO] glTF 접근자(`AccessorInfo_GLTF`)로부터 스칼라 인덱스 데이터를 읽어 사전 할당된 `Uint32Array`로 반환합니다.
 * [EN] Reads scalar index data from a glTF accessor (`AccessorInfo_GLTF`) and returns a pre-allocated `Uint32Array`.
 *
 * @param accessorInfo -
 * [KO] 파싱할 glTF 접근자 정보 인스턴스
 * [EN] glTF accessor information instance to parse
 * @returns
 * [KO] 파싱된 인덱스 `Uint32Array`
 * [EN] Parsed index `Uint32Array`
 * @category GLTF
 */
const parseIndicesInfo_GLTF = (accessorInfo: AccessorInfo_GLTF): Uint32Array => {
    const {
        accessor,
        getMethod,
        bufferURIDataView,
        componentType,
        componentType_BYTES_PER_ELEMENT,
        bufferViewOffset,
        accessorBufferOffset,
    } = accessorInfo;
    const {type, count} = accessor;
    if (type !== 'SCALAR') {
        console.warn('알수없는 형식 엑세서 타입', accessorInfo.accessor);
        return EMPTY_UINT32_ARRAY;
    }
    if (count <= 0) return EMPTY_UINT32_ARRAY;

    const result = new Uint32Array(count);
    const baseByteOffset = bufferViewOffset + accessorBufferOffset;

    if (bufferURIDataView instanceof DataView) {
        const absoluteByteOffset = bufferURIDataView.byteOffset + baseByteOffset;
        if (componentType === Uint32Array && (absoluteByteOffset & 3) === 0) {
            result.set(new Uint32Array(bufferURIDataView.buffer, absoluteByteOffset, count));
            return result;
        }
        if (componentType === Uint16Array && (absoluteByteOffset & 1) === 0) {
            result.set(new Uint16Array(bufferURIDataView.buffer, absoluteByteOffset, count));
            return result;
        }
        if (componentType === Uint8Array) {
            result.set(new Uint8Array(bufferURIDataView.buffer, absoluteByteOffset, count));
            return result;
        }
    }

    let byteOffset = baseByteOffset;
    for (let i = 0; i < count; i++) {
        result[i] = bufferURIDataView[getMethod](byteOffset, true);
        byteOffset += componentType_BYTES_PER_ELEMENT;
    }
    return result;
};
export default parseIndicesInfo_GLTF;
