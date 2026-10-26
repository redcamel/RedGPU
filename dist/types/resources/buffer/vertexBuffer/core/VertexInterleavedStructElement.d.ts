import { TypeInterleave } from "../VertexInterleaveType";
/**
 * [KO] 정점 인터리브 구조체의 개별 속성 요소를 정의하는 클래스입니다.
 * [EN] Class that defines an individual attribute element of a vertex interleaved struct.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Buffer
 */
declare class VertexInterleavedStructElement {
    /**
     * [KO] 정점 속성 이름
     * [EN] Vertex attribute name
     */
    attributeName: string;
    /**
     * [KO] 정점 속성 스트라이드 (바이트 단위)
     * [EN] Vertex attribute stride in bytes
     */
    attributeStride: number;
    /**
     * [KO] 인터리브 포맷 정보
     * [EN] Interleave format information
     */
    interleaveType: TypeInterleave;
    /**
     * [KO] VertexInterleavedStructElement 인스턴스를 생성합니다.
     * [EN] Creates a VertexInterleavedStructElement instance.
     *
     * @param attributeName -
     * [KO] 정점 속성 이름
     * [EN] Vertex attribute name
     * @param attributeStride -
     * [KO] 정점 속성 스트라이드 (바이트 단위)
     * [EN] Vertex attribute stride in bytes
     * @param interleaveType -
     * [KO] 인터리브 포맷 정보
     * [EN] Interleave format information
     */
    constructor(attributeName: string, attributeStride: number, interleaveType: TypeInterleave);
}
export default VertexInterleavedStructElement;
