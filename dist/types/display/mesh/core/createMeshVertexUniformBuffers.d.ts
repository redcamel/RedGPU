import Mesh from "../Mesh";
/**
 * [KO] 메시의 버텍스 유니폼 버퍼와 바인드 그룹 레이아웃을 생성합니다.
 * [EN] Creates the vertex uniform buffer and bind group layout for the mesh.
 *
 * ::: warning
 * [KO] 이 함수는 시스템에 의해 내부적으로 호출됩니다.<br/>직접 호출하지 마십시오.
 * [EN] This function is called internally by the system.<br/>Do not call it directly.
 * :::
 *
 * @param mesh -
 * [KO] 대상 Mesh 인스턴스
 * [EN] Target Mesh instance
 * @param skin -
 * [KO] 스키닝 사용 여부 (기본값: false)
 * [EN] Whether skinning is used (default: false)
 * @category Core
 */
declare const createMeshVertexUniformBuffers: (mesh: Mesh, skin?: boolean) => void;
export default createMeshVertexUniformBuffers;
