import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import Mesh from "../mesh/Mesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
import InstancingMeshObject3D from "./core/InstancingMeshObject3D";
/**
 * [KO] 단일 지오메트리와 재질을 공유하는 다수의 메시를 단일 드로우 콜로 렌더링하는 GPU 인스턴싱 메시 클래스입니다.
 * [EN] GPU instancing mesh class that renders multiple meshes sharing a single geometry and material in a single draw call.
 *
 * [KO] 각 인스턴스(`InstancingMeshObject3D`)는 개별 위치, 회전, 스케일, 불투명도(`opacity`)를 가지며, GPU 컴퓨트 셰이더 기반 프러스텀 컬링과 LOD(Level of Detail)를 지원합니다.
 * [EN] Each instance (`InstancingMeshObject3D`) has independent position, rotation, scale, and `opacity`, supporting GPU compute shader-based frustum culling and Level of Detail (LOD).
 *
 * ### Example
 * ```typescript
 * const instancingMesh = new RedGPU.Display.InstancingMesh(redGPUContext, 1000, 100, geometry, material);
 * scene.addChild(instancingMesh);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/instancedMesh/simple/" style="width:100%; height:500px;"></iframe>
 *
 * @see [InstancingMesh Simple example](/RedGPU/examples/3d/instancedMesh/simple/)
 * @see [InstancingMesh Sphere example](/RedGPU/examples/3d/instancedMesh/sphere/)
 * @see [InstancingMesh GPU LOD example](/RedGPU/examples/3d/lod/InstanceMeshGPULOD/)
 * @see [InstancingMesh GPU LOD Material example](/RedGPU/examples/3d/lod/InstanceMeshGPULOD_material/)
 * @category Mesh
 */
declare class InstancingMesh extends Mesh {
    #private;
    /**
     * [KO] 개별 인스턴스 변환/속성 데이터가 변경되어 GPU 버퍼 갱신이 필요한지 여부
     * [EN] Whether individual instance transform or property data has changed and requires a GPU buffer update
     */
    dirtyInstanceMeshObject3D: boolean;
    /**
     * [KO] 활성 인스턴스 개수가 변경되었는지 여부
     * [EN] Whether the active instance count has changed
     */
    dirtyInstanceNum: boolean;
    /**
     * [KO] `InstancingMesh` 인스턴스를 생성합니다.
     * [EN] Creates an `InstancingMesh` instance.
     *
     * ### Example
     * ```typescript
     * const instancingMesh = new RedGPU.Display.InstancingMesh(redGPUContext, 1000, 100, geometry, material);
     * ```
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param maxInstanceCount -
     * [KO] 생성 가능한 최대 인스턴스 개수
     * [EN] Maximum number of instances that can be created
     * @param instanceCount -
     * [KO] 초기 활성 인스턴스 개수
     * [EN] Initial active instance count
     * @param geometry -
     * [KO] 지오메트리 또는 프리미티브 객체 (선택)
     * [EN] Geometry or primitive object (optional)
     * @param material -
     * [KO] 적용할 재질 객체 (선택)
     * [EN] Material object to apply (optional)
     */
    constructor(redGPUContext: RedGPUContext, maxInstanceCount: number, instanceCount: number, geometry?: Geometry | Primitive, material?: any);
    /**
     * [KO] 현재 렌더링에 활성화된 인스턴스 개수를 반환하거나 설정합니다. (`0` ~ `maxInstanceCount`)
     * [EN] Returns or sets the number of active instances for rendering. (`0` to `maxInstanceCount`)
     *
     * [KO] 설정된 개수에 맞춰 `instanceChildren` 배열의 `InstancingMeshObject3D` 요소가 자동으로 생성되거나 조정됩니다.
     * [EN] `InstancingMeshObject3D` elements in `instanceChildren` are automatically created or adjusted according to the set count.
     *
     * @returns
     * [KO] 활성 인스턴스 개수
     * [EN] Active instance count
     */
    get instanceCount(): number;
    set instanceCount(count: number);
    /**
     * [KO] 허용 가능한 최대 인스턴스 개수를 반환합니다.
     * [EN] Returns the maximum allowed instance count.
     *
     * @returns
     * [KO] 최대 인스턴스 개수
     * [EN] Maximum instance count
     */
    get maxInstanceCount(): number;
    /**
     * [KO] 개별 인스턴스의 트랜스폼과 속성을 제어하는 자식 객체(`InstancingMeshObject3D`) 배열을 반환합니다.
     * [EN] Returns the array of child objects (`InstancingMeshObject3D`) controlling transform and properties of each instance.
     *
     * @returns
     * [KO] `InstancingMeshObject3D` 인스턴스 배열
     * [EN] Array of `InstancingMeshObject3D` instances
     */
    get instanceChildren(): InstancingMeshObject3D[];
    /**
     * [KO] 현재 디바이스의 스토리지 버퍼 바인딩 한도(`maxStorageBufferBindingSize`)를 기준으로 생성 가능한 최대 인스턴스 개수를 계산합니다.
     * [EN] Calculates the maximum number of instances that can be created based on the current device's storage buffer binding limit (`maxStorageBufferBindingSize`).
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @returns
     * [KO] 하드웨어 한계 기반 최대 인스턴스 개수
     * [EN] Hardware-limited maximum instance count
     */
    static getLimitSize(redGPUContext: RedGPUContext): number;
    /**
     * [KO] 인스턴싱 메시의 GPU 프러스텀 컬링을 수행하고 렌더 패스에 드로우 명령을 기록합니다.
     * [EN] Performs GPU frustum culling for the instancing mesh and records draw commands into the render pass.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render view state data for the current view
     * @param shadowRender -
     * [KO] 그림자 맵 렌더링 패스 여부 (기본값: `false`)
     * [EN] Whether it is a shadow map rendering pass (default: `false`)
     */
    render(renderViewStateData: RenderViewStateData, shadowRender?: boolean): void;
    /**
     * [KO] `InstancingMesh` 인스턴스를 파기하고 할당된 인스턴싱 전용 GPU 버퍼 및 파이프라인 리소스를 해제합니다.
     * [EN] Destroys the `InstancingMesh` instance and releases allocated instancing-specific GPU buffers and pipeline resources.
     */
    destroy(): void;
}
export default InstancingMesh;
