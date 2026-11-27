import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF";
import dequantizeAccessorValue from "../core/dequantizeAccessorValue";
import {tryCopyAlignedFloat32} from "../core/gltfBufferUtils";

const EMPTY_FLOAT32_ARRAY = new Float32Array(0);

/**
 * [KO] GLTF accessor 데이터를 attribute 키(POSITION, NORMAL, TEXCOORD_n, COLOR_0, TANGENT, WEIGHTS_0, JOINTS_0)에 따라 사전 할당된 `Float32Array`로 직접 파싱합니다.
 * [EN] Parses GLTF accessor data directly into a pre-allocated `Float32Array` according to the attribute key (POSITION, NORMAL, TEXCOORD_n, COLOR_0, TANGENT, WEIGHTS_0, JOINTS_0).
 *
 * [KO] `bufferViewByteStride`가 있으면 interleaved 데이터로 처리하며, VEC3 `COLOR_0`는 알파값 `1`을 추가하여 RGBA(4성분)로 확장합니다.
 * [EN] Handles interleaved data when `bufferViewByteStride` is set, and expands VEC3 `COLOR_0` to 4-component RGBA by appending an alpha of `1`.
 *
 * @param key -
 * [KO] attribute 키
 * [EN] Attribute key
 * @param accessorInfo -
 * [KO] accessor 파싱 정보
 * [EN] Parsed accessor information
 * @returns
 * [KO] 파싱된 `Float32Array` (미사용 키 또는 알 수 없는 타입인 경우 `null`)
 * [EN] Parsed `Float32Array` (`null` for unused keys or unknown accessor types)
 * @throws
 * [KO] VEC4/VEC3 타입에서 지원하지 않는 attribute 키인 경우
 * [EN] If the attribute key is not supported for VEC4/VEC3 types
 * @category GLTF
 */
const parseAttributeInfo_GLTF = (
    key: string,
    accessorInfo: AccessorInfo_GLTF
): Float32Array | null => {
    const {
        accessor,
        getMethod,
        componentType,
        bufferViewByteStride,
        bufferURIDataView,
        componentType_BYTES_PER_ELEMENT,
        bufferViewOffset,
        accessorBufferOffset,
    } = accessorInfo;
    const {type, count, componentType: rawComponentType, normalized} = accessor;

    let srcComponents: number;
    switch (type) {
        case 'VEC4':
            if (key !== 'WEIGHTS_0' && key !== 'JOINTS_0' && key !== 'COLOR_0' && key !== 'TANGENT') {
                consoleAndThrowError('VEC4에서 현재 지원하고 있지 않는 키', key);
            }
            srcComponents = 4;
            break;
        case 'VEC3':
            if (key !== 'NORMAL' && key !== 'POSITION' && key !== 'COLOR_0' && key !== 'TANGENT') {
                consoleAndThrowError('VEC3에서 현재 지원하고 있지 않는 키', key);
            }
            srcComponents = 3;
            break;
        case 'VEC2':
            if (key !== 'TEXCOORD_0' && key !== 'TEXCOORD_1') {
                return null;
            }
            srcComponents = 2;
            break;
        default:
            console.warn('알수없는 형식 엑세서 타입', type);
            return null;
    }

    if (count <= 0) return EMPTY_FLOAT32_ARRAY;

    const isNormalized = normalized === true;
    const isVec3Color = srcComponents === 3 && key === 'COLOR_0';
    const dstComponents = isVec3Color ? 4 : srcComponents;

    // glTF 2.0 spec: when accessor.bufferView is undefined, the accessor is initialized with zeros (typically paired with sparse)
    if (!bufferURIDataView) {
        const zeroResult = new Float32Array(count * dstComponents);
        if (isVec3Color) {
            for (let i = 3, len = zeroResult.length; i < len; i += 4) {
                zeroResult[i] = 1;
            }
        }
        return zeroResult;
    }

    const packedByteStride = srcComponents * componentType_BYTES_PER_ELEMENT;
    const byteStride = bufferViewByteStride || packedByteStride;
    const baseByteOffset = bufferViewOffset + accessorBufferOffset;

    const result = new Float32Array(count * dstComponents);

    // Fast path: tightly packed Float32Array without normalization or RGBA expansion
    if (
        !isVec3Color &&
        !isNormalized &&
        tryCopyAlignedFloat32(
            bufferURIDataView,
            baseByteOffset,
            byteStride,
            packedByteStride,
            componentType,
            count * srcComponents,
            result
        )
    ) {
        return result;
    }

    const elemBytes = componentType_BYTES_PER_ELEMENT;
    const elemBytes2 = elemBytes * 2;
    const elemBytes3 = elemBytes * 3;
    let byteOffset = baseByteOffset;
    let outIdx = 0;

    if (isVec3Color) {
        if (isNormalized) {
            for (let i = 0; i < count; i++) {
                result[outIdx] = dequantizeAccessorValue(bufferURIDataView[getMethod](byteOffset, true), rawComponentType, true);
                result[outIdx + 1] = dequantizeAccessorValue(bufferURIDataView[getMethod](byteOffset + elemBytes, true), rawComponentType, true);
                result[outIdx + 2] = dequantizeAccessorValue(bufferURIDataView[getMethod](byteOffset + elemBytes2, true), rawComponentType, true);
                result[outIdx + 3] = 1;
                byteOffset += byteStride;
                outIdx += 4;
            }
        } else {
            for (let i = 0; i < count; i++) {
                result[outIdx] = bufferURIDataView[getMethod](byteOffset, true);
                result[outIdx + 1] = bufferURIDataView[getMethod](byteOffset + elemBytes, true);
                result[outIdx + 2] = bufferURIDataView[getMethod](byteOffset + elemBytes2, true);
                result[outIdx + 3] = 1;
                byteOffset += byteStride;
                outIdx += 4;
            }
        }
        return result;
    }

    if (srcComponents === 3) {
        if (isNormalized) {
            for (let i = 0; i < count; i++) {
                result[outIdx] = dequantizeAccessorValue(bufferURIDataView[getMethod](byteOffset, true), rawComponentType, true);
                result[outIdx + 1] = dequantizeAccessorValue(bufferURIDataView[getMethod](byteOffset + elemBytes, true), rawComponentType, true);
                result[outIdx + 2] = dequantizeAccessorValue(bufferURIDataView[getMethod](byteOffset + elemBytes2, true), rawComponentType, true);
                byteOffset += byteStride;
                outIdx += 3;
            }
        } else {
            for (let i = 0; i < count; i++) {
                result[outIdx] = bufferURIDataView[getMethod](byteOffset, true);
                result[outIdx + 1] = bufferURIDataView[getMethod](byteOffset + elemBytes, true);
                result[outIdx + 2] = bufferURIDataView[getMethod](byteOffset + elemBytes2, true);
                byteOffset += byteStride;
                outIdx += 3;
            }
        }
    } else if (srcComponents === 2) {
        if (isNormalized) {
            for (let i = 0; i < count; i++) {
                result[outIdx] = dequantizeAccessorValue(bufferURIDataView[getMethod](byteOffset, true), rawComponentType, true);
                result[outIdx + 1] = dequantizeAccessorValue(bufferURIDataView[getMethod](byteOffset + elemBytes, true), rawComponentType, true);
                byteOffset += byteStride;
                outIdx += 2;
            }
        } else {
            for (let i = 0; i < count; i++) {
                result[outIdx] = bufferURIDataView[getMethod](byteOffset, true);
                result[outIdx + 1] = bufferURIDataView[getMethod](byteOffset + elemBytes, true);
                byteOffset += byteStride;
                outIdx += 2;
            }
        }
    } else {
        if (isNormalized) {
            for (let i = 0; i < count; i++) {
                result[outIdx] = dequantizeAccessorValue(bufferURIDataView[getMethod](byteOffset, true), rawComponentType, true);
                result[outIdx + 1] = dequantizeAccessorValue(bufferURIDataView[getMethod](byteOffset + elemBytes, true), rawComponentType, true);
                result[outIdx + 2] = dequantizeAccessorValue(bufferURIDataView[getMethod](byteOffset + elemBytes2, true), rawComponentType, true);
                result[outIdx + 3] = dequantizeAccessorValue(bufferURIDataView[getMethod](byteOffset + elemBytes3, true), rawComponentType, true);
                byteOffset += byteStride;
                outIdx += 4;
            }
        } else {
            for (let i = 0; i < count; i++) {
                result[outIdx] = bufferURIDataView[getMethod](byteOffset, true);
                result[outIdx + 1] = bufferURIDataView[getMethod](byteOffset + elemBytes, true);
                result[outIdx + 2] = bufferURIDataView[getMethod](byteOffset + elemBytes2, true);
                result[outIdx + 3] = bufferURIDataView[getMethod](byteOffset + elemBytes3, true);
                byteOffset += byteStride;
                outIdx += 4;
            }
        }
    }

    return result;
};
export default parseAttributeInfo_GLTF;
