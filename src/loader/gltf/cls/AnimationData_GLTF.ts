import dequantizeAccessorValue from "../core/dequantizeAccessorValue";
import {tryCopyAlignedFloat32} from "../core/gltfBufferUtils";
import {GLTF, GlTfId} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import AccessorInfo_GLTF from "./AccessorInfo_GLTF";

/**
 * [KO] GLTF 애니메이션 데이터를 파싱하여 보관하는 클래스입니다.
 * [EN] Class that parses and stores GLTF animation data.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Loader
 */
class AnimationData_GLTF {
    /**
     * [KO] 파싱된 애니메이션 데이터 배열
     * [EN] Parsed animation data array
     */
    dataList: Float32Array

    /**
     * [KO] `AnimationData_GLTF` 인스턴스를 생성합니다.
     * [EN] Creates an instance of `AnimationData_GLTF`.
     *
     * @param gltfLoader -
     * [KO] `GLTFLoader` 인스턴스
     * [EN] `GLTFLoader` instance
     * @param gltfData -
     * [KO] GLTF 데이터 객체
     * [EN] GLTF data object
     * @param accessorGlTfId -
     * [KO] 데이터를 가져올 엑세서의 GLTF ID
     * [EN] GLTF ID of the accessor to retrieve data from
     */
    constructor(gltfLoader: GLTFLoader, gltfData: GLTF, accessorGlTfId: GlTfId) {
        const accessorInfo = new AccessorInfo_GLTF(gltfLoader, gltfData, accessorGlTfId);
        const {
            accessor,
            componentType: typedArrayCtor,
            componentType_BYTES_PER_ELEMENT,
            bufferViewOffset,
            accessorBufferOffset,
            bufferViewByteStride,
            bufferURIDataView,
            getMethod
        } = accessorInfo;
        const {type, count, componentType, normalized} = accessor;
        const isNormalized = normalized === true;
        let factor = 1;
        switch (type) {
            case 'SCALAR':
                factor = 1;
                break;
            case 'VEC2':
                factor = 2;
                break;
            case 'VEC4':
                factor = 4;
                break;
            case 'VEC3':
                factor = 3;
                break;
            default:
                console.warn('알수없는 형식 엑세서 타입', accessor);
        }
        const total = count * factor;
        const dataList = new Float32Array(total);
        const baseByteOffset = bufferViewOffset + accessorBufferOffset;
        const packedByteStride = factor * componentType_BYTES_PER_ELEMENT;
        const byteStride = bufferViewByteStride || packedByteStride;

        if (
            !isNormalized &&
            tryCopyAlignedFloat32(
                bufferURIDataView,
                baseByteOffset,
                byteStride,
                packedByteStride,
                typedArrayCtor,
                total,
                dataList
            )
        ) {
            this.dataList = dataList;
            return;
        }

        let byteOffset = baseByteOffset;
        let outIdx = 0;
        for (let i = 0; i < count; i++) {
            for (let c = 0; c < factor; c++) {
                const rawValue = bufferURIDataView[getMethod](byteOffset + c * componentType_BYTES_PER_ELEMENT, true);
                dataList[outIdx++] = isNormalized ? dequantizeAccessorValue(rawValue, componentType, true) : rawValue;
            }
            byteOffset += byteStride;
        }
        this.dataList = dataList;
    }
}

export default AnimationData_GLTF;
