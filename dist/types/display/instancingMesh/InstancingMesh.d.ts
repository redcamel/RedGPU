import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import Mesh from "../mesh/Mesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
import InstancingMeshObject3D from "./core/InstancingMeshObject3D";
/**
 * [KO] GPU 인스턴싱 기반의 메시 클래스입니다.
 * [EN] Mesh class based on GPU instancing.
 *
 * [KO] 하나의 geometry와 material을 여러 인스턴스(Instance)로 효율적으로 렌더링할 수 있습니다. 각 인스턴스는 transform(위치, 회전, 스케일)만 다르고 geometry/vertex 데이터와 머티리얼은 공유합니다.
 * [EN] Efficiently renders a single geometry and material as multiple instances. Each instance differs only in its transform (position, rotation, scale) while sharing geometry/vertex data and material.
 *
 * * ### Example
 * ```typescript
 * const instancingMesh = new RedGPU.Display.InstancingMesh(redGPUContext, 1000, 10, geometry, material);
 * scene.addChild(instancingMesh);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/instancedMesh/simple/"></iframe>
 *
 * [KO] 아래는 instancedMesh의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of instancedMesh.
 * @see [instancedMesh GPU LOD](/RedGPU/examples/3d/lod/InstanceMeshGPULOD/)
 *
 * @category Mesh
 */
declare class InstancingMesh extends Mesh {
    #private;
    /**
     * [KO] 인스턴스 메시 오브젝트의 dirty 상태 여부
     * [EN] Whether the instance mesh object is dirty
     */
    dirtyInstanceMeshObject3D: boolean;
    /**
     * [KO] 인스턴스 개수의 dirty 상태 여부
     * [EN] Whether the instance count is dirty
     */
    dirtyInstanceNum: boolean;
    /**
     * [KO] InstancingMesh 인스턴스를 생성합니다.
     * [EN] Creates an instance of InstancingMesh.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param maxInstanceCount -
     * [KO] 허용할 최대 인스턴스 개수
     * [EN] Maximum allowed instance count
     * @param instanceCount -
     * [KO] 초기 인스턴스 개수
     * [EN] Initial instance count
     * @param geometry -
     * [KO] geometry 또는 primitive 객체(선택)
     * [EN] geometry or primitive object (optional)
     * @param material -
     * [KO] 머티리얼(선택)
     * [EN] Material (optional)
     */
    constructor(redGPUContext: RedGPUContext, maxInstanceCount: number, instanceCount: number, geometry?: Geometry | Primitive, material?: any);
    get instanceCount(): number;
    set instanceCount(count: number);
    get maxInstanceCount(): number;
    set maxInstanceCount(count: number);
    get instanceChildren(): InstancingMeshObject3D[];
    static getLimitSize(): number;
    render(renderViewStateData: RenderViewStateData, shadowRender?: boolean): void;
}
export default InstancingMesh;
