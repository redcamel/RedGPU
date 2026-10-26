import RedGPUObject from "../../base/RedGPUObject";
import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
type DebugMode = 'OBB' | 'AABB' | 'BOTH' | 'COMBINED_AABB';
/**
 * [KO] 대상 3D 메시(`Mesh`)의 공간 바운딩 박스(AABB, OBB)를 와이어프레임으로 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class that visualizes the spatial bounding box (AABB, OBB) of a target 3D `Mesh` as a wireframe.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] Mesh의 enableDebugger 프로퍼티를 통해 활성화합니다.
 * // [EN] Enable via the enableDebugger property of Mesh.
 * mesh.enableDebugger = true;
 * mesh.drawDebugger.debugMode = 'BOTH';
 * ```
 *
 * @see [DrawDebugger basic example](/RedGPU/examples/3d/drawDebugger/basic/)
 * @see [Mesh BoundBox example](/RedGPU/examples/3d/mesh/boundBox/meshBoundBox/)
 * @category Debugger
 */
declare class DrawDebuggerMesh extends RedGPUObject {
    #private;
    /**
     * [KO] `DrawDebuggerMesh` 인스턴스를 생성합니다.
     * [EN] Creates a `DrawDebuggerMesh` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param target -
     * [KO] 디버깅할 대상 `Mesh` 인스턴스
     * [EN] Target `Mesh` instance to debug
     */
    constructor(redGPUContext: RedGPUContext, target: Mesh);
    /**
     * [KO] 바운딩 박스 디버그 표시 모드(`'OBB' | 'AABB' | 'BOTH' | 'COMBINED_AABB'`)를 반환하거나 설정합니다.
     * [EN] Returns or sets the bounding box debug display mode (`'OBB' | 'AABB' | 'BOTH' | 'COMBINED_AABB'`).
     *
     * @returns
     * [KO] 현재 설정된 디버그 모드
     * [EN] Currently set debug mode
     */
    get debugMode(): DebugMode;
    set debugMode(value: DebugMode);
    /**
     * [KO] 대상 메시의 바운딩 볼륨 디버그 와이어프레임을 렌더링합니다.
     * [EN] Renders the bounding volume debug wireframe of the target mesh.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerMesh;
