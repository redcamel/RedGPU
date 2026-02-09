import VertexInterleavedStructElement from "./core/VertexInterleavedStructElement";
import { TypeInterleave } from "./VertexInterleaveType";
/**
 * [KO] 정점 속성을 인터리브 방식으로 배치하기 위한 구조를 정의하는 클래스입니다.
 * [EN] Class that defines a structure for interleaving vertex attributes.
 *
 * * ### Example
 * ```typescript
 * const struct = new RedGPU.Resource.VertexInterleavedStruct({
 *   position: RedGPU.Resource.VertexInterleaveType.float32x3,
 *   uv: RedGPU.Resource.VertexInterleaveType.float32x2
 * });
 * ```
 * @category Buffer
 */
export default class VertexInterleavedStruct {
    #private;
    /**
     * [KO] VertexInterleavedStruct 인스턴스를 생성합니다.
     * [EN] Creates a VertexInterleavedStruct instance.
     * @param attributes -
     * [KO] 속성 정의 맵
     * [EN] Attribute definition map
     * @param name -
     * [KO] 구조 이름 (선택)
     * [EN] Structure name (optional)
     */
    constructor(attributes: Record<string, TypeInterleave>, name?: string);
    /**
     * [KO] 구조의 레이블(이름)을 반환합니다.
     * [EN] Returns the label (name) of the structure.
     */
    get label(): string;
    /**
     * [KO] GPU 정점 속성 배열을 반환합니다.
     * [EN] Returns the array of GPU vertex attributes.
     */
    get attributes(): any[];
    /**
     * [KO] 전체 stride(바이트 크기)를 반환합니다.
     * [EN] Returns the total stride (byte size).
     */
    get arrayStride(): number;
    /**
     * [KO] 내부 속성 정의 맵을 반환합니다.
     * [EN] Returns the internal attribute definition map.
     */
    get define(): Record<string, VertexInterleavedStructElement>;
}
