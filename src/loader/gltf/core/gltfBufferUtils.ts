import {GLTFComponentTypedArrayConstructor} from "./GLTF_COMPONENT_TYPES";

/**
 * [KO] 4바이트 정렬된 밀집(Tightly Packed) `Float32` `DataView` 구간을 대상 `Float32Array`로 블록 복사합니다.
 * [EN] Copies a 4-byte-aligned, tightly packed `Float32` `DataView` region into `out` via `Float32Array.set`.
 *
 * @param dataView -
 * [KO] 원본 바이너리 `DataView`
 * [EN] Source binary `DataView`
 * @param baseByteOffset -
 * [KO] `dataView` 내부 시작 바이트 오프셋
 * [EN] Starting byte offset within `dataView`
 * @param byteStride -
 * [KO] 실제 버퍼뷰 바이트 스트라이드
 * [EN] Effective bufferView byte stride
 * @param packedByteStride -
 * [KO] 밀집 배치 기준 바이트 스트라이드
 * [EN] Tightly packed byte stride
 * @param componentType -
 * [KO] glTF accessor 컴포넌트 TypedArray 생성자
 * [EN] glTF accessor component TypedArray constructor
 * @param totalElements -
 * [KO] 복사할 전체 float 요소 개수
 * [EN] Total number of float elements to copy
 * @param out -
 * [KO] 복사 결과를 기록할 `Float32Array`
 * [EN] Destination `Float32Array`
 * @returns
 * [KO] Fast-path 복사 성공 여부 (`false`이면 호출부가 일반 루프로 폴백)
 * [EN] `true` if fast-path copy succeeded; otherwise `false`
 * @category GLTF
 */
export const tryCopyAlignedFloat32 = (
    dataView: DataView | null,
    baseByteOffset: number,
    byteStride: number,
    packedByteStride: number,
    componentType: GLTFComponentTypedArrayConstructor,
    totalElements: number,
    out: Float32Array
): boolean => {
    if (
        byteStride === packedByteStride &&
        componentType === Float32Array &&
        dataView instanceof DataView
    ) {
        const absoluteByteOffset = dataView.byteOffset + baseByteOffset;
        if (absoluteByteOffset >= 0 && (absoluteByteOffset & 3) === 0) {
            out.set(new Float32Array(dataView.buffer, absoluteByteOffset, totalElements));
            return true;
        }
    }
    return false;
};
