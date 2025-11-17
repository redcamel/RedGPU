import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import Mesh from "../mesh/Mesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
import InstancingMeshObject3D from "./core/InstancingMeshObject3D";
import LODManager from "./LODManager";
/**
 * GPU 인스턴싱 기반의 메시 클래스입니다.
 *
 * 하나의 geometry와 material을 여러 인스턴스(Instance)로 효율적으로 렌더링할 수 있습니다.
 * 각 인스턴스는 transform(위치, 회전, 스케일)만 다르고 geometry/vertex 데이터와 머티리얼은 공유합니다.
 *
 * <iframe src="/RedGPU/examples/3d/instancedMesh/basic/"></iframe>
 * @category Mesh
 */
declare class InstancingMesh extends Mesh {
    #private;
    dirtyInstanceMeshObject3D: boolean;
    dirtyInstanceNum: boolean;
    dirtyLOD: boolean;
    constructor(redGPUContext: RedGPUContext, maxInstanceCount: number, instanceCount: number, geometry?: Geometry | Primitive, material?: any);
    get lodManager(): LODManager;
    get instanceCount(): number;
    set instanceCount(count: number);
    get maxInstanceCount(): number;
    set maxInstanceCount(count: number);
    get instanceChildren(): InstancingMeshObject3D[];
    static getLimitSize(): number;
    render(renderViewStateData: RenderViewStateData, shadowRender?: boolean): void;
}
export default InstancingMesh;
