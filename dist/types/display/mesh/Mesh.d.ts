import { Function } from "wgsl_reflect";
import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import AABB from "../../bound/AABB";
import OBB from "../../bound/OBB";
import DrawDebuggerMesh from "../drawDebugger/DrawDebuggerMesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
import LODManager from "./core/LODManager";
import MeshBase from "./core/MeshBase";
import Object3DContainer from "./core/Object3DContainer";
interface Mesh {
    receiveShadow: boolean;
    disableJitter: boolean;
    meshType: string;
    useDisplacementTexture: boolean;
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
 * * ### Example
 * ```typescript
 * const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
 * scene.addChild(mesh);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/mesh/basicMesh/"></iframe>
 *
 * @see
 * [KO] 아래는 Mesh의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of Mesh.
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
     * [KO] 메시의 디스플레이스먼트 텍스처
     * [EN] Displacement texture of the mesh
     */
    displacementTexture: BitmapTexture;
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
     * [KO] LOD(Level of Detail) 매니저를 반환합니다.
     * [EN] Returns the LOD (Level of Detail) manager.
     * @returns
     * [KO] LODManager 인스턴스
     * [EN] LODManager instance
     */
    get LODManager(): LODManager;
    /**
     * [KO] 디버거 활성화 여부를 반환합니다.
     * [EN] Returns whether the debugger is enabled.
     */
    get enableDebugger(): boolean;
    /**
     * [KO] 디버거 활성화 여부를 설정합니다.
     * [EN] Sets whether the debugger is enabled.
     * @param value -
     * [KO] 활성화 여부
     * [EN] Whether to enable
     */
    set enableDebugger(value: boolean);
    /**
     * [KO] 디버그 메시 객체를 반환합니다.
     * [EN] Returns the debug mesh object.
     */
    get drawDebugger(): DrawDebuggerMesh;
    _material: any;
    /**
     * [KO] 머티리얼을 반환합니다.
     * [EN] Returns the material.
     */
    get material(): any;
    /**
     * [KO] 머티리얼을 설정합니다.
     * [EN] Sets the material.
     * @param value -
     * [KO] 설정할 머티리얼
     * [EN] Material to set
     */
    set material(value: any);
    _geometry: Geometry | Primitive;
    /**
     * [KO] 지오메트리를 반환합니다.
     * [EN] Returns the geometry.
     */
    get geometry(): Geometry | Primitive;
    /**
     * [KO] 지오메트리를 설정합니다.
     * [EN] Sets the geometry.
     * @param value -
     * [KO] 설정할 지오메트리
     * [EN] Geometry to set
     */
    set geometry(value: Geometry | Primitive);
    /**
     * [KO] 메시의 투명도를 반환합니다. (0~1)
     * [EN] Returns the opacity of the mesh. (0~1)
     */
    get opacity(): number;
    /**
     * [KO] 메시의 투명도를 설정합니다. (0~1)
     * [EN] Sets the opacity of the mesh. (0~1)
     * @param value -
     * [KO] 투명도 값
     * [EN] Opacity value
     */
    set opacity(value: number);
    /**
     * [KO] 프러스텀 컬링 무시 여부를 반환합니다.
     * [EN] Returns whether to ignore frustum culling.
     */
    get ignoreFrustumCulling(): boolean;
    /**
     * [KO] 프러스텀 컬링 무시 여부를 설정합니다.
     * [EN] Sets whether to ignore frustum culling.
     * @param value -
     * [KO] 무시 여부
     * [EN] Whether to ignore
     */
    set ignoreFrustumCulling(value: boolean);
    /**
     * [KO] 피킹 ID를 반환합니다.
     * [EN] Returns the picking ID.
     */
    get pickingId(): number;
    /**
     * [KO] 등록된 이벤트들을 반환합니다.
     * [EN] Returns the registered events.
     */
    get events(): any;
    /**
     * [KO] 메시의 이름을 반환합니다.
     * [EN] Returns the name of the mesh.
     */
    get name(): string;
    /**
     * [KO] 메시의 이름을 설정합니다.
     * [EN] Sets the name of the mesh.
     * @param value -
     * [KO] 메시 이름
     * [EN] Mesh name
     */
    set name(value: string);
    /**
     * [KO] 버텍스 상태 버퍼 레이아웃을 반환합니다.
     * [EN] Returns the vertex state buffer layouts.
     */
    get vertexStateBuffers(): GPUVertexBufferLayout[];
    /**
     * [KO] 설정된 부모 객체를 반환합니다.
     * [EN] Returns the set parent object.
     */
    get parent(): Object3DContainer;
    /**
     * [KO] 부모 객체를 설정합니다.
     * [EN] Sets the parent object.
     * @param value -
     * [KO] 부모 컨테이너
     * [EN] Parent container
     */
    set parent(value: Object3DContainer);
    /**
     * [KO] 피벗 X 좌표를 반환합니다.
     * [EN] Returns the pivot X coordinate.
     */
    get pivotX(): number;
    /**
     * [KO] 피벗 X 좌표를 설정합니다.
     * [EN] Sets the pivot X coordinate.
     * @param value -
     * [KO] X 좌표
     * [EN] X coordinate
     */
    set pivotX(value: number);
    /**
     * [KO] 피벗 Y 좌표를 반환합니다.
     * [EN] Returns the pivot Y coordinate.
     */
    get pivotY(): number;
    /**
     * [KO] 피벗 Y 좌표를 설정합니다.
     * [EN] Sets the pivot Y coordinate.
     * @param value -
     * [KO] Y 좌표
     * [EN] Y coordinate
     */
    set pivotY(value: number);
    /**
     * [KO] 피벗 Z 좌표를 반환합니다.
     * [EN] Returns the pivot Z coordinate.
     */
    get pivotZ(): number;
    /**
     * [KO] 피벗 Z 좌표를 설정합니다.
     * [EN] Sets the pivot Z coordinate.
     * @param value -
     * [KO] Z 좌표
     * [EN] Z coordinate
     */
    set pivotZ(value: number);
    /**
     * [KO] X 위치 좌표를 반환합니다.
     * [EN] Returns the X position coordinate.
     */
    get x(): number;
    /**
     * [KO] X 위치 좌표를 설정합니다.
     * [EN] Sets the X position coordinate.
     * @param value -
     * [KO] X 좌표
     * [EN] X coordinate
     */
    set x(value: number);
    /**
     * [KO] Y 위치 좌표를 반환합니다.
     * [EN] Returns the Y position coordinate.
     */
    get y(): number;
    /**
     * [KO] Y 위치 좌표를 설정합니다.
     * [EN] Sets the Y position coordinate.
     * @param value -
     * [KO] Y 좌표
     * [EN] Y coordinate
     */
    set y(value: number);
    /**
     * [KO] Z 위치 좌표를 반환합니다.
     * [EN] Returns the Z position coordinate.
     */
    get z(): number;
    /**
     * [KO] Z 위치 좌표를 설정합니다.
     * [EN] Sets the Z position coordinate.
     * @param value -
     * [KO] Z 좌표
     * [EN] Z coordinate
     */
    set z(value: number);
    /**
     * [KO] 현재 위치를 반환합니다. [x, y, z]
     * [EN] Returns the current position. [x, y, z]
     * @returns
     * [KO] 위치 배열
     * [EN] Position array
     */
    get position(): Float32Array;
    /**
     * [KO] X축 스케일을 반환합니다.
     * [EN] Returns the X-axis scale.
     */
    get scaleX(): number;
    /**
     * [KO] X축 스케일을 설정합니다.
     * [EN] Sets the X-axis scale.
     * @param value -
     * [KO] 스케일 값
     * [EN] Scale value
     */
    set scaleX(value: number);
    /**
     * [KO] Y축 스케일을 반환합니다.
     * [EN] Returns the Y-axis scale.
     */
    get scaleY(): number;
    /**
     * [KO] Y축 스케일을 설정합니다.
     * [EN] Sets the Y-axis scale.
     * @param value -
     * [KO] 스케일 값
     * [EN] Scale value
     */
    set scaleY(value: number);
    /**
     * [KO] Z축 스케일을 반환합니다.
     * [EN] Returns the Z-axis scale.
     */
    get scaleZ(): number;
    /**
     * [KO] Z축 스케일을 설정합니다.
     * [EN] Sets the Z-axis scale.
     * @param value -
     * [KO] 스케일 값
     * [EN] Scale value
     */
    set scaleZ(value: number);
    /**
     * [KO] 현재 스케일을 반환합니다. [x, y, z]
     * [EN] Returns the current scale. [x, y, z]
     */
    get scale(): Float32Array;
    /**
     * [KO] X축 회전값을 반환합니다. (도)
     * [EN] Returns the X-axis rotation value. (degrees)
     */
    get rotationX(): number;
    /**
     * [KO] X축 회전값을 설정합니다. (도)
     * [EN] Sets the X-axis rotation value. (degrees)
     * @param value -
     * [KO] 회전값
     * [EN] Rotation value
     */
    set rotationX(value: number);
    /**
     * [KO] Y축 회전값을 반환합니다. (도)
     * [EN] Returns the Y-axis rotation value. (degrees)
     */
    get rotationY(): number;
    /**
     * [KO] Y축 회전값을 설정합니다. (도)
     * [EN] Sets the Y-axis rotation value. (degrees)
     * @param value -
     * [KO] 회전값
     * [EN] Rotation value
     */
    set rotationY(value: number);
    /**
     * [KO] Z축 회전값을 반환합니다. (도)
     * [EN] Returns the Z-axis rotation value. (degrees)
     */
    get rotationZ(): number;
    /**
     * [KO] Z축 회전값을 설정합니다. (도)
     * [EN] Sets the Z-axis rotation value. (degrees)
     * @param value -
     * [KO] 회전값
     * [EN] Rotation value
     */
    set rotationZ(value: number);
    /**
     * [KO] 현재 회전값을 반환합니다. [x, y, z] (도)
     * [EN] Returns the current rotation values. [x, y, z] (degrees)
     */
    get rotation(): Float32Array;
    /**
     * [KO] OBB(Oriented Bounding Box) 정보를 반환합니다.
     * [EN] Returns the OBB (Oriented Bounding Box) information.
     */
    get boundingOBB(): OBB;
    /**
     * [KO] AABB(Axis-Aligned Bounding Box) 정보를 반환합니다.
     * [EN] Returns the AABB (Axis-Aligned Bounding Box) information.
     */
    get boundingAABB(): AABB;
    /**
     * [KO] 자식 객체들을 포함한 통합 AABB 정보를 반환합니다.
     * [EN] Returns the combined AABB information including child objects.
     */
    get combinedBoundingAABB(): AABB;
    /**
     * [KO] 하위 계층의 모든 객체에 디버거 활성화 여부를 설정합니다.
     * [EN] Sets the debugger visibility for all objects in the hierarchy.
     * @param enableDebugger -
     * [KO] 활성화 여부 (기본값: false)
     * [EN] Whether to enable (default: false)
     */
    setEnableDebuggerRecursively(enableDebugger?: boolean): void;
    /**
     * [KO] 하위 계층의 모든 객체에 그림자 캐스팅 여부를 설정합니다.
     * [EN] Sets shadow casting for all objects in the hierarchy.
     * @param value -
     * [KO] 캐스팅 여부 (기본값: false)
     * [EN] Whether to cast (default: false)
     */
    setCastShadowRecursively(value?: boolean): void;
    /**
     * [KO] 하위 계층의 모든 객체에 그림자 수신 여부를 설정합니다.
     * [EN] Sets shadow receiving for all objects in the hierarchy.
     * @param value -
     * [KO] 수신 여부 (기본값: false)
     * [EN] Whether to receive (default: false)
     */
    setReceiveShadowRecursively(value?: boolean): void;
    /**
     * [KO] 하위 계층의 모든 객체에 프러스텀 컬링 무시 여부를 설정합니다.
     * [EN] Sets whether to ignore frustum culling for all objects in the hierarchy.
     * @param value -
     * [KO] 무시 여부 (기본값: false)
     * [EN] Whether to ignore (default: false)
     */
    setIgnoreFrustumCullingRecursively(value?: boolean): void;
    /**
     * [KO] 부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.
     * [EN] Calculates and returns the combined opacity considering the parent hierarchy.
     * @returns
     * [KO] 통합 투명도 값
     * [EN] Combined opacity value
     */
    getCombinedOpacity(): number;
    /**
     * [KO] 이벤트 리스너를 추가합니다.
     * [EN] Adds an event listener.
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
     * @experimental
     * @returns
     * [KO] 복제된 Mesh 인스턴스
     * [EN] Cloned Mesh instance
     */
    clone(): Mesh;
    /**
     * [KO] 메시를 렌더링합니다.
     * [EN] Renders the mesh.
     * @param renderViewStateData -
     * [KO] 렌더 상태 데이터
     * [EN] Render view state data
     */
    render(renderViewStateData: RenderViewStateData): void;
    initGPURenderInfos(): void;
    createMeshVertexShaderModuleBASIC: (VERTEX_SHADER_MODULE_NAME: any, SHADER_INFO: any, UNIFORM_STRUCT_BASIC: any, vertexModuleSource: any) => GPUShaderModule;
}
export default Mesh;
