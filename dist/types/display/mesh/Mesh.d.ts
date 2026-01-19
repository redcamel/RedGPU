import { Function } from "wgsl_reflect";
import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import AABB from "../../utils/math/bound/AABB";
import OBB from "../../utils/math/bound/OBB";
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
    dirtyLOD: boolean;
    passFrustumCulling: boolean;
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
    get LODManager(): LODManager;
    get enableDebugger(): boolean;
    set enableDebugger(value: boolean);
    get drawDebugger(): DrawDebuggerMesh;
    _material: any;
    get material(): any;
    set material(value: any);
    _geometry: Geometry | Primitive;
    get geometry(): Geometry | Primitive;
    set geometry(value: Geometry | Primitive);
    get opacity(): number;
    set opacity(value: number);
    get ignoreFrustumCulling(): boolean;
    set ignoreFrustumCulling(value: boolean);
    get pickingId(): number;
    get events(): any;
    get name(): string;
    set name(value: string);
    get vertexStateBuffers(): GPUVertexBufferLayout[];
    /**
     * 설정된 부모 객체값을 반환합니다.
     */
    get parent(): Object3DContainer;
    /**
     * 부모 객체를 설정합니다.
     * @param value
     */
    set parent(value: Object3DContainer);
    get pivotX(): number;
    set pivotX(value: number);
    get pivotY(): number;
    set pivotY(value: number);
    get pivotZ(): number;
    set pivotZ(value: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get position(): Float32Array;
    get scaleX(): number;
    set scaleX(value: number);
    get scaleY(): number;
    set scaleY(value: number);
    get scaleZ(): number;
    set scaleZ(value: number);
    get scale(): Float32Array;
    get rotationX(): number;
    set rotationX(value: number);
    get rotationY(): number;
    set rotationY(value: number);
    get rotationZ(): number;
    set rotationZ(value: number);
    get rotation(): Float32Array;
    get boundingOBB(): OBB;
    get boundingAABB(): AABB;
    get combinedBoundingAABB(): AABB;
    setEnableDebuggerRecursively(enableDebugger?: boolean): void;
    setCastShadowRecursively(value?: boolean): void;
    setReceiveShadowRecursively(value?: boolean): void;
    setIgnoreFrustumCullingRecursively(value?: boolean): void;
    getCombinedOpacity(): number;
    addListener(eventName: string, callback: Function): void;
    lookAt(targetX: number | [number, number, number], targetY?: number, targetZ?: number): void;
    setScale(x: number, y?: number, z?: number): void;
    setPosition(x: number, y?: number, z?: number): void;
    setRotation(rotationX: number, rotationY?: number, rotationZ?: number): void;
    /**
     * @experimental
     */
    clone(): Mesh;
    render(renderViewStateData: RenderViewStateData): void;
    initGPURenderInfos(): void;
    createMeshVertexShaderModuleBASIC: (VERTEX_SHADER_MODULE_NAME: any, SHADER_INFO: any, UNIFORM_STRUCT_BASIC: any, vertexModuleSource: any) => GPUShaderModule;
}
export default Mesh;
