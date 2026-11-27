import dequantizeAccessorValue from "../core/dequantizeAccessorValue";
import GLTF_COMPONENT_TYPES from "../core/GLTF_COMPONENT_TYPES";
import {getActiveParseContext} from "../core/GLTFParseContext";
import {Accessor, GLTF} from "../GLTF";
import GLTFLoader from "../GLTFLoader";

/**
 * [KO] GLTF Accessor의 희소(Sparse) 데이터를 파싱하여 대상 속성 배열에 직접 적용합니다.
 * [EN] Parses sparse data of a GLTF Accessor and applies it directly to the target attribute array.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param propertyKey -
 * [KO] 정점 속성 키 (예: `'POSITION'`, `'NORMAL'`, `'TANGENT'`, `'TEXCOORD_0'`, `'COLOR_0'`)
 * [EN] Vertex attribute key (e.g., `'POSITION'`, `'NORMAL'`, `'TANGENT'`, `'TEXCOORD_0'`, `'COLOR_0'`)
 * @param targetAccessor -
 * [KO] 대상 GLTF Accessor 객체
 * [EN] Target GLTF Accessor object
 * @param gltfData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param targetData -
 * [KO] 희소 데이터가 적용될 대상 속성 배열 (`Float32Array` 또는 `number[]`)
 * [EN] Target attribute array (`Float32Array` or `number[]`) to which sparse data will be applied
 * @category GLTF
 */
const parseSparse_GLTF = (
    gltfLoader: GLTFLoader,
    propertyKey: string,
    targetAccessor: Accessor,
    gltfData: GLTF,
    targetData: Float32Array | number[]
): void => {
    const targetSparse = targetAccessor.sparse;
    if (!targetSparse || !targetData || targetSparse.count <= 0) return;

    let srcComponents: number;
    switch (targetAccessor.type) {
        case 'SCALAR':
            srcComponents = 1;
            break;
        case 'VEC2':
            srcComponents = 2;
            break;
        case 'VEC3':
            srcComponents = 3;
            break;
        case 'VEC4':
            srcComponents = 4;
            break;
        default:
            console.warn('Unknown accessor type', targetAccessor.type);
            return;
    }

    const {values: sparseValuesAccessor, indices: sparseIndices, count: sparseCount} = targetSparse;
    const bufferViewsData = gltfData.bufferViews;
    const valuesBufferView = bufferViewsData[sparseValuesAccessor.bufferView];
    const indicesBufferView = bufferViewsData[sparseIndices.bufferView];
    if (!valuesBufferView || !indicesBufferView) return;

    const buffers = getActiveParseContext(gltfLoader)?.buffers
        ?? (gltfLoader as { parsingResult?: { uris?: { buffers?: DataView[] } } }).parsingResult?.uris?.buffers;
    const valuesDataView = buffers?.[valuesBufferView.buffer] ?? null;
    const indicesDataView = buffers?.[indicesBufferView.buffer] ?? null;
    if (!valuesDataView || !indicesDataView) return;

    const valueComponentType = GLTF_COMPONENT_TYPES[targetAccessor.componentType];
    const valueBytes = valueComponentType.BYTES_PER_ELEMENT;
    let valueGetMethod: string;
    switch (valueComponentType) {
        case Float32Array:
            valueGetMethod = 'getFloat32';
            break;
        case Uint32Array:
            valueGetMethod = 'getUint32';
            break;
        case Uint16Array:
            valueGetMethod = 'getUint16';
            break;
        case Int16Array:
            valueGetMethod = 'getInt16';
            break;
        case Uint8Array:
            valueGetMethod = 'getUint8';
            break;
        case Int8Array:
            valueGetMethod = 'getInt8';
            break;
        default:
            console.warn('Unsupported sparse value componentType', targetAccessor.componentType);
            return;
    }

    const indicesComponentType = GLTF_COMPONENT_TYPES[sparseIndices.componentType];
    const indicesBytes = indicesComponentType.BYTES_PER_ELEMENT;
    let indicesGetMethod: string;
    switch (indicesComponentType) {
        case Uint32Array:
            indicesGetMethod = 'getUint32';
            break;
        case Uint16Array:
            indicesGetMethod = 'getUint16';
            break;
        case Uint8Array:
            indicesGetMethod = 'getUint8';
            break;
        default:
            console.warn('Unsupported sparse indices componentType', sparseIndices.componentType);
            return;
    }

    const isNormalized = targetAccessor.normalized === true;
    const rawComponentType = targetAccessor.componentType;
    const isVec3Color = srcComponents === 3 && propertyKey === 'COLOR_0';
    const dstComponents = isVec3Color ? 4 : srcComponents;

    let valueByteOffset = (valuesBufferView.byteOffset || 0) + (sparseValuesAccessor.byteOffset || 0);
    const valueByteStride = valuesBufferView.byteStride || (srcComponents * valueBytes);
    let indexByteOffset = (indicesBufferView.byteOffset || 0) + (sparseIndices.byteOffset || 0);

    for (let i = 0; i < sparseCount; i++) {
        const targetIndex = indicesDataView[indicesGetMethod](indexByteOffset, true);
        const dstBase = targetIndex * dstComponents;
        for (let c = 0; c < srcComponents; c++) {
            const rawValue = valuesDataView[valueGetMethod](valueByteOffset + c * valueBytes, true);
            targetData[dstBase + c] = isNormalized
                ? dequantizeAccessorValue(rawValue, rawComponentType, true)
                : rawValue;
        }
        if (isVec3Color) {
            targetData[dstBase + 3] = 1;
        }
        valueByteOffset += valueByteStride;
        indexByteOffset += indicesBytes;
    }
};
export default parseSparse_GLTF;
