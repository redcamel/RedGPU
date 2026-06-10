import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import Mesh from "../mesh/Mesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
import InstancingMeshObject3D from "./core/InstancingMeshObject3D";
/**
 * [KO] GPU 인스턴싱 기반의 고성능 메시 클래스입니다.
 * [EN] High-performance mesh class based on GPU instancing.
 *
 * [KO] 단일 Geometry와 Material을 공유하는 대량의 메시를 단 하나의 드로우 콜로 화면에 그릴 수 있게 해줍니다. 각 인스턴스(InstancingMeshObject3D)는 개별적인 위치, 회전, 스케일 및 불투명도(Opacity) 속성을 가지며, 프러스텀 컬링(Frustum Culling) 및 LOD(Level of Detail) 기능을 GPU 연산을 통해 효율적으로 처리합니다.
 * [EN] Enables rendering a large number of meshes that share a single Geometry and Material using a single draw call. Each instance (InstancingMeshObject3D) has independent position, rotation, scale, and opacity properties, with frustum culling and Level of Detail (LOD) processed efficiently via GPU compute operations.
 *
 * * ### Example
 * ```typescript
 * const instancingMesh = new RedGPU.Display.InstancingMesh(redGPUContext, 1000, 10, geometry, material);
 * scene.addChild(instancingMesh);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/instancedMesh/simple/"></iframe>
 *
 * [KO] 아래는 InstancingMesh의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of InstancingMesh.
 * @see [InstancingMesh Simple example](/RedGPU/examples/3d/instancedMesh/simple/)
 * @see [InstancingMesh Sphere example](/RedGPU/examples/3d/instancedMesh/sphere/)
 * @see [InstancingMesh GPU LOD example](/RedGPU/examples/3d/lod/InstanceMeshGPULOD/)
 * @see [InstancingMesh GPU LOD Material example](/RedGPU/examples/3d/lod/InstanceMeshGPULOD_material/)
 * @category Mesh
 */
declare class InstancingMesh extends Mesh {
    #private;
    /**
     * [KO] 개별 인스턴스 정보가 수정되어 GPU 버퍼 데이터를 업데이트해야 하는지 여부입니다.
     * [EN] Whether individual instance data is dirty and the GPU buffer needs to be updated.
     */
    dirtyInstanceMeshObject3D: boolean;
    /**
     * [KO] 현재 활성화된 인스턴스 개수 정보가 수정되었는지 여부입니다.
     * [EN] Whether the active instance count information has been modified.
     */
    dirtyInstanceNum: boolean;
    /**
     * [KO] InstancingMesh 인스턴스를 생성합니다.
     * [EN] Creates an instance of InstancingMesh.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param maxInstanceCount -
     * [KO] 최대로 생성 및 업로드 가능한 인스턴스 한도
     * [EN] The maximum limit of instances that can be created and uploaded
     * @param instanceCount -
     * [KO] 초기 활성화할 인스턴스 개수
     * [EN] Initial active instance count
     * @param geometry -
     * [KO] 지오메트리 또는 프리미티브 객체 (선택)
     * [EN] Geometry or primitive object (optional)
     * @param material -
     * [KO] 적용할 머티리얼 (선택)
     * [EN] Material to apply (optional)
     */
    constructor(redGPUContext: RedGPUContext, maxInstanceCount: number, instanceCount: number, geometry?: Geometry | Primitive, material?: any);
    /**
     * [KO] 현재 활성화하여 렌더링할 인스턴스 개수를 조회하거나 설정합니다. 설정된 개수에 따라 내부적으로 개별 인스턴스 관리 객체(InstancingMeshObject3D)들이 자동 생성 및 갱신됩니다.
     * [EN] Gets or sets the number of active instances to render. Individual instance controllers (InstancingMeshObject3D) are automatically created and updated internally based on the value.
     */
    get instanceCount(): number;
    set instanceCount(count: number);
    /**
     * [KO] 해당 인스턴싱 메시에서 지원 가능한 최대 인스턴스 개수를 조회합니다.
     * [EN] Gets the maximum allowed instance count for this instanced mesh.
     */
    get maxInstanceCount(): number;
    /**
     * [KO] 각 개별 인스턴스의 개별 트랜스폼 정보를 제어할 수 있는 자식 객체들의 목록을 가져옵니다.
     * [EN] Gets the array of child objects (InstancingMeshObject3D) to control the transform details of each instance.
     */
    get instanceChildren(): InstancingMeshObject3D[];
    /**
     * [KO] 현재 GPU Context의 하드웨어 한계 한도(maxStorageBufferBindingSize)를 계산하여, 업로드 가능한 이론적인 최대 인스턴스 개수를 가져옵니다.
     * [EN] Computes the maximum theoretical instance count that can be uploaded based on the current GPU Context's limits (maxStorageBufferBindingSize).
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @returns
     * [KO] 하드웨어적으로 허용 가능한 최대 인스턴스 개수
     * [EN] Hardware-constrained maximum instance count
     */
    static getLimitSize(redGPUContext: RedGPUContext): number;
    /**
     * [KO] 인스턴싱 메시를 렌더링 큐에 기록합니다. LOD 변경 시 리소스를 재구성하며, 섀도우 렌더링 모드가 아닐 때는 GPU 연산 셰이더를 통해 프러스텀 컬링(Frustum Culling)을 우선 수행합니다.
     * [EN] Records the instanced mesh into the rendering queue. Rebuilds resources when LOD is dirty, and performs frustum culling via GPU compute shaders if not in shadow rendering mode.
     * @param renderViewStateData -
     * [KO] 렌더 뷰 상태 데이터
     * [EN] Render view state data
     * @param shadowRender -
     * [KO] 그림자 맵 생성용 패스인지 여부 (기본값: false)
     * [EN] Whether it is for the shadow map generation pass (default: false)
     */
    render(renderViewStateData: RenderViewStateData, shadowRender?: boolean): void;
}
export default InstancingMesh;
