import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import RenderViewStateData from "../view/core/RenderViewStateData";
import Mesh from "../mesh/Mesh";
import InstancingMeshObject3D from "./core/InstancingMeshObject3D";
/**
 * GPU 인스턴싱 기반의 메시 클래스입니다.
 *
 * 하나의 geometry와 material을 여러 인스턴스(Instance)로 효율적으로 렌더링할 수 있습니다.
 *
 * 각 인스턴스는 transform(위치, 회전, 스케일)만 다르고 geometry/vertex 데이터와 머티리얼은 공유합니다.
 *
 * <iframe src="/RedGPU/examples/3d/instancedMesh/basic/"></iframe>
 * @category Mesh
 */
declare class InstancingMesh extends Mesh {
    #private;
    dirtyInstanceMeshObject3D: boolean;
    /**
     * InstancingMesh 인스턴스를 생성합니다.
     * @param redGPUContext RedGPU 컨텍스트
     * @param instanceCount 인스턴스 개수
     * @param geometry geometry 또는 primitive 객체(선택)
     * @param material 머티리얼(선택)
     */
    constructor(redGPUContext: RedGPUContext, maxInstanceCount: number, instanceCount: number, geometry?: Geometry | Primitive, material?: any);
    /**
     * 인스턴스 개수를 반환합니다.
     */
    get instanceCount(): number;
    get maxInstanceCount(): number;
    /**
     * 인스턴스 개수를 설정합니다. (버퍼 및 인스턴스 객체 자동 갱신)
     * @param count 인스턴스 개수
     */
    set instanceCount(count: number);
    set maxInstanceCount(count: number);
    static getLimitSize(): number;
    /**
     * 인스턴스별 transform/계층 구조를 관리하는 객체 배열을 반환합니다.
     */
    get instanceChildren(): InstancingMeshObject3D[];
    /**
     * 인스턴싱 메시의 렌더링을 수행합니다.
     * @param renderViewStateData 렌더 상태 데이터
     */
    render(renderViewStateData: RenderViewStateData, shadowRender?: boolean): void;
}
export default InstancingMesh;
