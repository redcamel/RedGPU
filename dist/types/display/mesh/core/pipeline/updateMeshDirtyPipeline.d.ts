import RenderViewStateData from "../../../view/core/RenderViewStateData";
import Mesh from "../../Mesh";
/**
 * [KO] 메시의 변경된 파이프라인 상태와 버텍스 셰이더 모듈을 갱신합니다.
 * [EN] Updates the dirty pipeline state and vertex shader module of a mesh.
 *
 * ::: warning
 * [KO] 이 함수는 시스템에 의해 내부적으로 호출됩니다.<br/>직접 호출하지 마십시오.
 * [EN] This function is called internally by the system.<br/>Do not call it directly.
 * :::
 *
 * @param mesh -
 * [KO] 파이프라인을 갱신할 대상 Mesh 인스턴스
 * [EN] Target Mesh instance to update the pipeline for
 * @param renderViewStateData -
 * [KO] 현재 렌더링 뷰 상태 데이터 (선택)
 * [EN] Current render view state data (optional)
 * @category Core
 */
declare const updateMeshDirtyPipeline: (mesh: Mesh, renderViewStateData?: RenderViewStateData) => void;
export default updateMeshDirtyPipeline;
