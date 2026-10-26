import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF";

/**
 * [KO] glTF 접근자(`AccessorInfo_GLTF`)로부터 스칼라 인덱스 데이터를 읽어 대상 배열에 추가합니다.
 * [EN] Reads scalar index data from a glTF accessor (`AccessorInfo_GLTF`) and appends it to the target array.
 *
 * @param accessorInfo -
 * [KO] 파싱할 glTF 접근자 정보 인스턴스
 * [EN] glTF accessor information instance to parse
 * @param indices -
 * [KO] 파싱된 인덱스를 저장할 대상 배열
 * [EN] Target array to store parsed indices
 * @category GLTF
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
