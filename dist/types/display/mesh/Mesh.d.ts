import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import DrawBufferManager, { DrawCommandSlot } from "../../renderer/core/DrawBufferManager";
import AABB from "../../bound/AABB";
import OBB from "../../bound/OBB";
import DrawDebuggerMesh from "../drawDebugger/DrawDebuggerMesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
import LODManager from "./core/LODManager";
import MeshBase from "./core/MeshBase";
import Object3DContainer from "./core/Object3DContainer";
interface Mesh {
    /**
     * [KO] 그림자 수신 여부
     * [EN] Whether to receive shadows
     */
    receiveShadow: boolean;
    /**
     * [KO] TAA 지터(Jitter) 비활성화 여부
     * [EN] Whether to disable TAA jitter
     */
    disableJitter: boolean;
    /**
     * [KO] 변위 텍스처(Displacement Texture) 사용 여부
     * [EN] Whether to use displacement texture
     */
    useDisplacementTexture: boolean;
    /**
     * [KO] Mesh 인스턴스 여부 판별 식별자
     * [EN] Identifier to determine if it is a Mesh instance
     */
    isInstanceofMesh: boolean;
}
/**
 * [KO] geometry와 material을 바탕으로 3D/2D 객체의 위치, 회전, 스케일, 피벗, 계층 구조, 렌더링, 그림자, 디버깅 등 다양한 기능을 제공하는 기본 메시 클래스입니다.
 * [EN] Basic mesh class that provides various functions such as position, rotation, scale, pivot, hierarchy, rendering, shadow, and debugging based on geometry and material.
 *
 * [KO] geometry(버텍스/메시 데이터)와 머티리얼을 바탕으로 실제 화면에 렌더링되는 객체를 표현합니다.
 * [EN] Represents objects rendered on the actual screen based on geometry (vertex/mesh data) and material.
 *
 * [KO] 위치, 회전, 스케일, 피벗, 계층 구조, 그림자, 디버깅, 이벤트 등 다양한 기능을 지원합니다.
 * [EN] Supports various functions such as position, rotation, scale, pivot, hierarchy, shadow, debugging, and events.
 *
 * ### Example
 * ```typescript
 * const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
 * scene.addChild(mesh);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/mesh/basicMesh/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Mesh Hierarchy example](/RedGPU/examples/3d/mesh/hierarchy/)
 * @see [Mesh Pivot example](/RedGPU/examples/3d/mesh/pivot/)
 * @see [Mesh Child Methods example](/RedGPU/examples/3d/mesh/childMethod/)
 * @see [Mesh lookAt Methods example](/RedGPU/examples/3d/mesh/lookAt/)
 * @see [Mesh CPU LOD](/RedGPU/examples/3d/lod/MeshCPULOD/)
 * @category Mesh
 */
declare class Mesh extends MeshBase {
    #private;
    /**
     * [KO] 그림자 캐스팅 여부
     * [EN] Whether to cast shadows
     */
    castShadow: boolean;
    /**
     * [KO] LOD 정보 변경 필요 여부
     * [EN] Whether LOD info needs update
     */
    dirtyLOD: boolean;
    /**
     * [KO] 프러스텀 컬링 통과 여부
     * [EN] Whether it passed frustum culling
     */
    passFrustumCulling: boolean;
    /**
     * [KO] 커스텀 버텍스 셰이더 모듈 생성 함수
     * [EN] Function to create custom vertex shader module
     */
    createCustomMeshVertexShaderModule?: () => GPUShaderModule;
    /**
     * [KO] Mesh 인스턴스를 생성합니다.
     * [EN] Creates an instance of Mesh.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param geometry -
     * [KO] geometry 또는 primitive 객체(선택)
     * [EN] geometry or primitive object (optional)
     * @param material -
     * [KO] 머티리얼(선택)
     * [EN] Material (optional)
     * @param name -
     * [KO] 메시 이름(선택)
     * [EN] Mesh name (optional)
     */
    constructor(redGPUContext: RedGPUContext, geometry?: Geometry | Primitive, material?: any, name?: string);
    /**
     * [KO] 글로벌 버퍼 슬롯 인덱스를 반환합니다.
     * [EN] Returns the global buffer slot index.
     *
     * @returns
     * [KO] 글로벌 버텍스 슬롯 인덱스
     * [EN] Global vertex slot index
     */
    get globalVertexSlotIndex(): number;
    /**
     * [KO] 드로우 커맨드 슬롯을 반환합니다.
     * [EN] Returns the draw command slot.
     *
     * @returns
     * [KO] DrawCommandSlot 인스턴스 또는 `null`
     * [EN] DrawCommandSlot instance or `null`
     */
    get drawCommandSlot(): DrawCommandSlot | null;
    /**
     * [KO] 드로우 버퍼 매니저를 반환합니다.
     * [EN] Returns the draw buffer manager.
     *
     * @returns
     * [KO] DrawBufferManager 인스턴스 또는 `null`
     * [EN] DrawBufferManager instance or `null`
     */
    get drawBufferManager(): DrawBufferManager | null;
    /**
     * [KO] LOD(Level of Detail) 매니저를 반환합니다.
     * [EN] Returns the LOD (Level of Detail) manager.
     *
     * @returns
     * [KO] LODManager 인스턴스
     * [EN] LODManager instance
     */
    get LODManager(): LODManager;
    /**
     * [KO] 디버거 활성화 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether the debugger is enabled.
     *
     * @returns
     * [KO] 디버거 활성화 여부
     * [EN] Whether the debugger is enabled
     */
    get enableDebugger(): boolean;
    set enableDebugger(value: boolean);
    /**
     * [KO] 디버그 메시 객체를 반환합니다.
     * [EN] Returns the debug mesh object.
     *
     * @returns
     * [KO] DrawDebuggerMesh 인스턴스
     * [EN] DrawDebuggerMesh instance
     */
    get drawDebugger(): DrawDebuggerMesh;
    _material: any;
    /**
     * [KO] 머티리얼을 가져오거나 설정합니다.
     * [EN] Gets or sets the material.
     *
     * @returns
     * [KO] 설정된 머티리얼 인스턴스
     * [EN] Configured material instance
     */
    get material(): any;
    set material(value: any);
    _geometry: Geometry | Primitive;
    /**
     * [KO] 지오메트리를 가져오거나 설정합니다.
     * [EN] Gets or sets the geometry.
     *
     * @returns
     * [KO] Geometry 또는 Primitive 인스턴스
     * [EN] Geometry or Primitive instance
     */
    get geometry(): Geometry | Primitive;
    set geometry(value: Geometry | Primitive);
    /**
     * [KO] 메시의 투명도를 가져오거나 설정합니다 (0~1).
     * [EN] Gets or sets the opacity of the mesh (0~1).
     *
     * @returns
     * [KO] 투명도 값 (0~1)
     * [EN] Opacity value (0~1)
     */
    get opacity(): number;
    set opacity(value: number);
    /**
     * [KO] 프러스텀 컬링 무시 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether to ignore frustum culling.
     *
     * @returns
     * [KO] 프러스텀 컬링 무시 여부
     * [EN] Whether frustum culling is ignored
     */
    get ignoreFrustumCulling(): boolean;
    set ignoreFrustumCulling(value: boolean);
    /**
     * [KO] 투영 면적 컬링(Screen Space Size Culling) 사용 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether to use screen space size culling.
     *
     * @returns
     * [KO] 투영 면적 컬링 사용 여부
     * [EN] Whether screen space size culling is used
     */
    get useScreenSpaceSizeCulling(): boolean;
    set useScreenSpaceSizeCulling(value: boolean);
    /**
     * [KO] 투영 면적 컬링의 화면상 크기 비율 임계값을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum size ratio threshold for screen space size culling.
     *
     * @returns
     * [KO] 화면상 크기 비율 임계값
     * [EN] Screen space size ratio threshold
     */
    get minScreenSpaceSize(): number;
    set minScreenSpaceSize(value: number);
    /**
     * [KO] 피킹 ID를 반환합니다.
     * [EN] Returns the picking ID.
     *
     * @returns
     * [KO] 피킹 식별자 값
     * [EN] Picking identifier value
     */
    get pickingId(): number;
    /**
     * [KO] 등록된 이벤트 맵 객체를 반환합니다.
     * [EN] Returns the registered event map object.
     *
     * @returns
     * [KO] 등록된 이벤트 객체
     * [EN] Registered events object
     */
    get events(): any;
    /**
     * [KO] 버텍스 상태 버퍼 레이아웃 배열을 반환합니다.
     * [EN] Returns the array of vertex state buffer layouts.
     *
     * @returns
     * [KO] GPUVertexBufferLayout 배열
     * [EN] Array of GPUVertexBufferLayout
     */
    get vertexStateBuffers(): GPUVertexBufferLayout[];
    /**
     * [KO] 설정된 부모 컨테이너 객체를 가져오거나 설정합니다.
     * [EN] Gets or sets the parent container object.
     *
     * @returns
     * [KO] 부모 Object3DContainer 인스턴스
     * [EN] Parent Object3DContainer instance
     */
    get parent(): Object3DContainer;
    set parent(value: Object3DContainer);
    /**
     * [KO] 물(Lake)과의 실시간 파동 인터랙션 활성화 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether real-time wave interaction with water (Lake) is enabled.
     *
     * @returns
     * [KO] 물 파동 인터랙션 활성화 여부
     * [EN] Whether water wave interaction is enabled
     */
    get enableWaterInteraction(): boolean;
    set enableWaterInteraction(value: boolean);
    /**
     * [KO] 물 파동 생성 강도 배율을 가져오거나 설정합니다 (기본값: 1.0).
     * [EN] Gets or sets the wave generation strength multiplier (default: 1.0).
     *
     * @returns
     * [KO] 물 파동 생성 강도 배율
     * [EN] Water wave generation strength multiplier
     */
    get waterWaveStrength(): number;
    set waterWaveStrength(value: number);
    /**
     * [KO] 피벗 X 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the pivot X coordinate.
     *
     * @returns
     * [KO] 피벗 X 좌표
     * [EN] Pivot X coordinate
     */
    get pivotX(): number;
    set pivotX(value: number);
    /**
     * [KO] 피벗 Y 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the pivot Y coordinate.
     *
     * @returns
     * [KO] 피벗 Y 좌표
     * [EN] Pivot Y coordinate
     */
    get pivotY(): number;
    set pivotY(value: number);
    /**
     * [KO] 피벗 Z 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the pivot Z coordinate.
     *
     * @returns
     * [KO] 피벗 Z 좌표
     * [EN] Pivot Z coordinate
     */
    get pivotZ(): number;
    set pivotZ(value: number);
    /**
     * [KO] X 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the X position coordinate.
     *
     * @returns
     * [KO] X 위치 좌표
     * [EN] X position coordinate
     */
    get x(): number;
    set x(value: number);
    /**
     * [KO] Y 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y position coordinate.
     *
     * @returns
     * [KO] Y 위치 좌표
     * [EN] Y position coordinate
     */
    get y(): number;
    set y(value: number);
    /**
     * [KO] Z 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z position coordinate.
     *
     * @returns
     * [KO] Z 위치 좌표
     * [EN] Z position coordinate
     */
    get z(): number;
    set z(value: number);
    /**
     * [KO] 현재 위치를 반환합니다. [x, y, z]
     * [EN] Returns the current position. [x, y, z]
     *
     * @returns
     * [KO] 위치 배열
     * [EN] Position array
     */
    get position(): Float32Array;
    /**
     * [KO] X축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis scale.
     *
     * @returns
     * [KO] X축 스케일 값
     * [EN] X-axis scale value
     */
    get scaleX(): number;
    set scaleX(value: number);
    /**
     * [KO] Y축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis scale.
     *
     * @returns
     * [KO] Y축 스케일 값
     * [EN] Y-axis scale value
     */
    get scaleY(): number;
    set scaleY(value: number);
    /**
     * [KO] Z축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis scale.
     *
     * @returns
     * [KO] Z축 스케일 값
     * [EN] Z-axis scale value
     */
    get scaleZ(): number;
    set scaleZ(value: number);
    /**
     * [KO] 현재 스케일을 반환합니다. [x, y, z]
     * [EN] Returns the current scale. [x, y, z]
     *
     * @returns
     * [KO] 스케일 배열
     * [EN] Scale array
     */
    get scale(): Float32Array;
    /**
     * [KO] X축 회전값을 가져오거나 설정합니다 (도).
     * [EN] Gets or sets the X-axis rotation value (degrees).
     *
     * @returns
     * [KO] X축 회전값 (도)
     * [EN] X-axis rotation value (degrees)
     */
    get rotationX(): number;
    set rotationX(value: number);
    /**
     * [KO] Y축 회전값을 가져오거나 설정합니다 (도).
     * [EN] Gets or sets the Y-axis rotation value (degrees).
     *
     * @returns
     * [KO] Y축 회전값 (도)
     * [EN] Y-axis rotation value (degrees)
     */
    get rotationY(): number;
    set rotationY(value: number);
    /**
     * [KO] Z축 회전값을 가져오거나 설정합니다 (도).
     * [EN] Gets or sets the Z-axis rotation value (degrees).
     *
     * @returns
     * [KO] Z축 회전값 (도)
     * [EN] Z-axis rotation value (degrees)
     */
    get rotationZ(): number;
    set rotationZ(value: number);
    /**
     * [KO] 현재 회전값을 반환합니다. [x, y, z] (도)
     * [EN] Returns the current rotation values. [x, y, z] (degrees)
     *
     * @returns
     * [KO] 회전값 배열 (도)
     * [EN] Rotation values array (degrees)
     */
    get rotation(): Float32Array;
    /**
     * [KO] OBB(Oriented Bounding Box) 정보를 반환합니다.
     * [EN] Returns the OBB (Oriented Bounding Box) information.
     *
     * @returns
     * [KO] 계산된 OBB 인스턴스
     * [EN] Calculated OBB instance
     */
    get boundingOBB(): OBB;
    /**
     * [KO] AABB(Axis-Aligned Bounding Box) 정보를 반환합니다. (Zero-GC 인플레이스 재사용)
     * [EN] Returns the AABB (Axis-Aligned Bounding Box) information. (Zero-GC in-place reuse)
     *
     * @returns
     * [KO] 계산된 AABB 인스턴스
     * [EN] Calculated AABB instance
     */
    get boundingAABB(): AABB;
    /**
     * [KO] 자식 객체들을 포함한 통합 AABB 정보를 반환합니다.
     * [EN] Returns the combined AABB information including child objects.
     *
     * @returns
     * [KO] 통합된 AABB 인스턴스
     * [EN] Combined AABB instance
     */
    get combinedBoundingAABB(): AABB;
    /**
     * [KO] 하위 계층의 모든 객체에 디버거 활성화 여부를 설정합니다.
     * [EN] Sets the debugger visibility for all objects in the hierarchy.
     *
     * @param enableDebugger -
     * [KO] 활성화 여부 (기본값: false)
     * [EN] Whether to enable (default: false)
     */
    setEnableDebuggerRecursively(enableDebugger?: boolean): void;
    /**
     * [KO] 하위 계층의 모든 객체에 그림자 캐스팅 여부를 설정합니다.
     * [EN] Sets shadow casting for all objects in the hierarchy.
     *
     * @param value -
     * [KO] 캐스팅 여부 (기본값: false)
     * [EN] Whether to cast (default: false)
     */
    setCastShadowRecursively(value?: boolean): void;
    /**
     * [KO] 하위 계층의 모든 객체에 그림자 수신 여부를 설정합니다.
     * [EN] Sets shadow receiving for all objects in the hierarchy.
     *
     * @param value -
     * [KO] 수신 여부 (기본값: false)
     * [EN] Whether to receive (default: false)
     */
    setReceiveShadowRecursively(value?: boolean): void;
    /**
     * [KO] 하위 계층의 모든 객체에 프러스텀 컬링 무시 여부를 설정합니다.
     * [EN] Sets whether to ignore frustum culling for all objects in the hierarchy.
     *
     * @param value -
     * [KO] 무시 여부 (기본값: false)
     * [EN] Whether to ignore (default: false)
     */
    setIgnoreFrustumCullingRecursively(value?: boolean): void;
    /**
     * [KO] 부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.
     * [EN] Calculates and returns the combined opacity considering the parent hierarchy.
     *
     * @returns
     * [KO] 통합 투명도 값
     * [EN] Combined opacity value
     */
    getCombinedOpacity(): number;
    /**
     * [KO] 이벤트 리스너를 추가합니다.
     * [EN] Adds an event listener.
     *
     * @param eventName -
     * [KO] 이벤트 이름
     * [EN] Event name
     * @param callback -
     * [KO] 콜백 함수
     * [EN] Callback function
     */
    addListener(eventName: string, callback: Function): void;
    /**
     * [KO] 메시가 특정 좌표를 바라보도록 회전시킵니다.
     * [EN] Rotates the mesh to look at a specific coordinate.
     *
     * @param targetX -
     * [KO] 대상 X 좌표 또는 [x, y, z] 배열
     * [EN] Target X coordinate or [x, y, z] array
     * @param targetY -
     * [KO] 대상 Y 좌표 (targetX가 배열인 경우 무시됨)
     * [EN] Target Y coordinate (ignored if targetX is an array)
     * @param targetZ -
     * [KO] 대상 Z 좌표 (targetX가 배열인 경우 무시됨)
     * [EN] Target Z coordinate (ignored if targetX is an array)
     */
    lookAt(targetX: number | [number, number, number], targetY?: number, targetZ?: number): void;
    /**
     * [KO] 스케일을 설정합니다.
     * [EN] Sets the scale.
     *
     * @param x -
     * [KO] X축 스케일
     * [EN] X-axis scale
     * @param y -
     * [KO] Y축 스케일 (생략 시 x와 동일)
     * [EN] Y-axis scale (if omitted, same as x)
     * @param z -
     * [KO] Z축 스케일 (생략 시 x와 동일)
     * [EN] Z-axis scale (if omitted, same as x)
     */
    setScale(x: number, y?: number, z?: number): void;
    /**
     * [KO] 위치를 설정합니다.
     * [EN] Sets the position.
     *
     * @param x -
     * [KO] X 좌표
     * [EN] X coordinate
     * @param y -
     * [KO] Y 좌표 (생략 시 x와 동일)
     * [EN] Y coordinate (if omitted, same as x)
     * @param z -
     * [KO] Z 좌표 (생략 시 x와 동일)
     * [EN] Z coordinate (if omitted, same as x)
     */
    setPosition(x: number, y?: number, z?: number): void;
    /**
     * [KO] 회전값을 설정합니다. (도)
     * [EN] Sets the rotation values. (degrees)
     *
     * @param rotationX -
     * [KO] X축 회전
     * [EN] X-axis rotation
     * @param rotationY -
     * [KO] Y축 회전 (생략 시 rotationX와 동일)
     * [EN] Y-axis rotation (if omitted, same as rotationX)
     * @param rotationZ -
     * [KO] Z축 회전 (생략 시 rotationX와 동일)
     * [EN] Z-axis rotation (if omitted, same as rotationX)
     */
    setRotation(rotationX: number, rotationY?: number, rotationZ?: number): void;
    /**
     * [KO] 메시를 복제합니다.
     * [EN] Clones the mesh.
     *
     * @experimental
     * @returns
     * [KO] 복제된 Mesh 인스턴스
     * [EN] Cloned Mesh instance
     */
    clone(): Mesh;
    /**
     * [KO] 메시를 렌더링합니다.
     * [EN] Renders the mesh.
     *
     * @param renderViewStateData -
     * [KO] 렌더 상태 데이터
     * [EN] Render view state data
     */
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] 메시의 GPU 렌더링 정보(VertexGPURenderInfo)를 초기화하고 파이프라인을 갱신합니다.
     * [EN] Initializes the mesh's GPU render info (VertexGPURenderInfo) and updates the pipeline.
     */
    initGPURenderInfos(): void;
    /**
     * [KO] 기본 메시 버텍스 셰이더 모듈과 유니폼 바인드 그룹을 생성하고 반환합니다.
     * [EN] Creates and returns the basic mesh vertex shader module and uniform bind group.
     *
     * @param VERTEX_SHADER_MODULE_NAME -
     * [KO] 버텍스 셰이더 모듈 이름
     * [EN] Vertex shader module name
     * @param SHADER_INFO -
     * [KO] 파싱된 WGSL 셰이더 정보
     * [EN] Parsed WGSL shader info
     * @param UNIFORM_STRUCT_BASIC -
     * [KO] 버텍스 유니폼 구조체 정보
     * [EN] Vertex uniform struct info
     * @param vertexModuleSource -
     * [KO] 버텍스 셰이더 WGSL 소스 코드
     * [EN] Vertex shader WGSL source code
     * @returns
     * [KO] 생성된 GPUShaderModule 인스턴스
     * [EN] Created GPUShaderModule instance
     */
    createMeshVertexShaderModuleBASIC: (VERTEX_SHADER_MODULE_NAME: any, SHADER_INFO: any, UNIFORM_STRUCT_BASIC: any, vertexModuleSource: any) => GPUShaderModule;
    /**
     * [KO] Mesh 인스턴스를 파기하고 할당된 드로우 커맨드 슬롯, 전역 버퍼 슬롯 및 리소스를 즉시 해제합니다.
     * [EN] Destroys the Mesh instance and immediately releases the allocated draw command slots, global buffer slots, and resources.
     */
    destroy(): void;
}
export default Mesh;
