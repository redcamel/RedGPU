import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
type DebugMode = 'OBB' | 'AABB' | 'BOTH' | 'COMBINED_AABB';
/**
 * 대상 3D 메시(Mesh)의 공간 바운딩 박스(AABB, OBB) 정보를 추출하여 시각적으로 투영해 주는 디버깅용 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 모드는 OBB(빨간색 와이어프레임), AABB(초록색 와이어프레임), 혹은 두 형태를 모두 표기하는 BOTH 모드를 지원합니다.
 * - 메시 오브젝트의 크기, 회전, 스케일 등 볼륨 데이터의 변경 이력을 감지(캐싱 연산)하여 필요할 때만 GPU 버텍스 정보를 갱신합니다.
 * - 카메라 절두체 컬링(View Frustum Culling) 로직과 긴밀하게 연동되어, 바운딩 볼륨이 화면 밖으로 이탈하면 렌더 루프 호출을 방지합니다.
 *
 * **[EN]**
 * - Visualizes spatial bounds (AABB, OBB) of a target 3D Mesh in the viewport.
 * - Renders bounding wireframe boxes in various modes: OBB (Red), AABB (Green), or BOTH.
 * - Tracks change history of target geometries to execute GPU vertex updates lazily (performance-optimized caching).
 * - Implements view frustum culling to bypass drawing operations once the target object leaves the view camera boundaries.
 *
 * @category Debugger
 */
declare class DrawDebuggerMesh {
    #private;
    constructor(redGPUContext: RedGPUContext, target: Mesh);
    get debugMode(): DebugMode;
    set debugMode(value: DebugMode);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerMesh;
