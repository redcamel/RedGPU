import Mesh from "../Mesh";
/**
 * createMeshVertexUniformBuffers
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 * @param mesh
 * @param skin
 */
declare const createMeshVertexUniformBuffers: (mesh: Mesh, skin?: boolean) => void;
export default createMeshVertexUniformBuffers;
