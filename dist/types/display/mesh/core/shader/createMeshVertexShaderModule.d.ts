import Mesh from "../../Mesh";
/**
 * [KO] 메시의 지오메트리 및 머티리얼 구성에 맞는 버텍스 GPUShaderModule을 생성하고 반환합니다.
 * [EN] Creates and returns a vertex GPUShaderModule matching the geometry and material configuration of the mesh.
 *
 * ::: warning
 * [KO] 이 함수는 시스템에 의해 내부적으로 호출됩니다.<br/>직접 호출하지 마십시오.
 * [EN] This function is called internally by the system.<br/>Do not call it directly.
 * :::
 *
 * @param mesh -
 * [KO] 대상 Mesh 인스턴스
 * [EN] Target Mesh instance
 * @returns
 * [KO] 생성된 버텍스 GPUShaderModule 인스턴스
 * [EN] Created vertex GPUShaderModule instance
 * @category Core
 */
declare const createMeshVertexShaderModule: (mesh: Mesh) => GPUShaderModule;
export default createMeshVertexShaderModule;
