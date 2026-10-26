import Mesh from "../../Mesh";
/**
 * [KO] 메시의 기본 버텍스 바인드 그룹 디스크립터를 생성하여 반환합니다.
 * [EN] Creates and returns the basic vertex bind group descriptor for a mesh.
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
 * [KO] 스키닝 버퍼 바인딩 포함 여부 (기본값: false)
 * [EN] Whether to include skinning buffer bindings (default: false)
 * @returns
 * [KO] 생성된 GPUBindGroupDescriptor 객체
 * [EN] Created GPUBindGroupDescriptor object
 * @category Core
 */
declare const getBasicMeshVertexBindGroupDescriptor: (mesh: Mesh, skin?: boolean) => GPUBindGroupDescriptor;
export default getBasicMeshVertexBindGroupDescriptor;
