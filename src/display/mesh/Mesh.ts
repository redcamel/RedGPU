import {mat4} from "gl-matrix";
import {OrthographicCamera} from "../../camera";
import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import {ABaseMaterial} from "../../material/core";
import Primitive from "../../primitive/core/Primitive";
import DrawBufferManager, {DrawCommandSlot} from "../../renderer/core/DrawBufferManager";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import AABB from "../../bound/AABB";
import calculateMeshAABB from "../../bound/math/calculateMeshAABB";
import calculateMeshCombinedAABB from "../../bound/math/calculateMeshCombinedAABB";
import calculateMeshOBB from "../../bound/math/calculateMeshOBB";
import OBB from "../../bound/OBB";
import mat4ToEuler from "../../math/mat4ToEuler";
import uuidToUint from "../../utils/uuid/uuidToUint";
import DrawDebuggerMesh from "../drawDebugger/DrawDebuggerMesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
import View3D from "../view/View3D";
import createMeshVertexUniformBuffers from "./core/createMeshVertexUniformBuffers";
import LODManager from "./core/LODManager";
import MeshBase from "./core/MeshBase";
import Object3DContainer from "./core/Object3DContainer";
import createBasePipeline from "./core/pipeline/createBasePipeline";
import updateMeshDirtyPipeline from "./core/pipeline/updateMeshDirtyPipeline";
import getBasicMeshVertexBindGroupDescriptor from "./core/shader/getBasicMeshVertexBindGroupDescriptor";
import VertexGPURenderInfo from "./core/VertexGPURenderInfo";
import defineBoolean from "../../defineProperty/funcs/defineBoolean";
import WaterInteractionRegistry from "../../water/interaction/WaterInteractionRegistry";


const VERTEX_SHADER_MODULE_NAME_PBR_SKIN = 'VERTEX_MODULE_MESH_PBR_SKIN'
const CONVERT_RADIAN = Math.PI / 180;
const CPI = 3.141592653589793, CPI2 = 6.283185307179586, C225 = 0.225, C127 = 1.27323954, C045 = 0.405284735,
    C157 = 1.5707963267948966;
const tempFloat32_1 = new Float32Array(1);
const tempFloat32_4 = new Float32Array(4);
const up = new Float32Array([0, 1, 0]);

interface Mesh {
    /**
     * [KO] 그림자 수신 여부
     * [EN] Whether to receive shadows
     */
    receiveShadow: boolean
    /**
     * [KO] TAA 지터(Jitter) 비활성화 여부
     * [EN] Whether to disable TAA jitter
     */
    disableJitter: boolean
    /**
     * [KO] 변위 텍스처(Displacement Texture) 사용 여부
     * [EN] Whether to use displacement texture
     */
    useDisplacementTexture: boolean
    /**
     * [KO] Mesh 인스턴스 여부 판별 식별자
     * [EN] Identifier to determine if it is a Mesh instance
     */
    isInstanceofMesh: boolean
}

interface LODGPURenderInfo {
    vertexUniformBindGroup: GPUBindGroup;
    pipeline: GPURenderPipeline;
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
 * <iframe src="/RedGPU/examples/3d/mesh/basicMesh/"></iframe>
 *
 * @see [Mesh Hierarchy example](/RedGPU/examples/3d/mesh/hierarchy/)
 * @see [Mesh Pivot example](/RedGPU/examples/3d/mesh/pivot/)
 * @see [Mesh Child Methods example](/RedGPU/examples/3d/mesh/childMethod/)
 * @see [Mesh lookAt Methods example](/RedGPU/examples/3d/mesh/lookAt/)
 * @see [Mesh CPU LOD](/RedGPU/examples/3d/lod/MeshCPULOD/)
 * @category Mesh
 */
class Mesh extends MeshBase {

    /**
     * [KO] 그림자 캐스팅 여부
     * [EN] Whether to cast shadows
     */
    castShadow: boolean = false;
    /**
     * [KO] LOD 정보 변경 필요 여부
     * [EN] Whether LOD info needs update
     */
    dirtyLOD: boolean = false;
    /**
     * [KO] 프러스텀 컬링 통과 여부
     * [EN] Whether it passed frustum culling
     */
    passFrustumCulling: boolean = true
    /**
     * [KO] 커스텀 버텍스 셰이더 모듈 생성 함수
     * [EN] Function to create custom vertex shader module
     */
    createCustomMeshVertexShaderModule?: () => GPUShaderModule;

    #lastUpdateMSAAID: string;

    #enableWaterInteraction: boolean = false;
    #waterWaveStrength: number = 1.0;
    #waterInteractionStatic: boolean = false;

    #parent: Object3DContainer
    #x: number = 0
    #y: number = 0
    #z: number = 0
    #positionArray: Float32Array = new Float32Array([0, 0, 0])
    #pivotX: number = 0
    #pivotY: number = 0
    #pivotZ: number = 0
    readonly #pickingId: number
    #scaleX: number = 1
    #scaleY: number = 1
    #scaleZ: number = 1
    #scaleArray: Float32Array = new Float32Array([1, 1, 1])
    #rotationX: number = 0
    #rotationY: number = 0
    #rotationZ: number = 0
    #rotationArray: Float32Array = new Float32Array([0, 0, 0])
    #events: any = {}
    #eventsNum: number = 0
    #ignoreFrustumCulling: boolean = false
    #useScreenSpaceSizeCulling: boolean = false
    #minScreenSpaceSize: number = 0.01
    #opacity: number = 1;
    #drawDebugger: DrawDebuggerMesh;
    #enableDebugger: boolean = false;
    #cachedBoundingAABB: AABB = new AABB();
    #dirtyBoundingAABB: boolean = true;
    #cachedBoundingOBB: OBB;
    #prevModelMatrix: Float32Array;
    #bundleEncoderList: GPURenderBundleEncoder[] = [];
    #renderBundleList: GPURenderBundle[] = [];
    #renderBundle_LODList: GPURenderBundle[][] = [];
    #prevSystemBindGroupList: GPUBindGroup[] = [];
    #prevFragmentBindGroup: GPUBindGroup;
    #drawCommandSlot: DrawCommandSlot | null = null;
    #drawCommandSlot_LODList: DrawCommandSlot[] = [];
    #drawBufferManager: DrawBufferManager | null = null;
    #needUpdateNormalMatrixUniform: boolean = true;
    #needUpdateMatrixUniform: boolean = true;
    #uniformDataMatrixList: Float32Array;
    #displacementScale: number;
    #LODManager: LODManager;
    #lodGPURenderInfoList: LODGPURenderInfo[] = [];
    #currentLODIndex: number = -1;
    #interleavedCullingID: number = Math.floor(Math.random() * 4)
    #globalVertexSlotIndex: number = -1;
    #prevLodIDX: number;

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
    constructor(redGPUContext: RedGPUContext, geometry?: Geometry | Primitive, material?, name?: string) {
        super(redGPUContext);
        if (name) this.name = name;
        this._geometry = geometry;
        this._material = material;
        this.#pickingId = uuidToUint(this.uuid);
        this.#drawBufferManager = redGPUContext.drawBufferManager;
        this.#checkDrawCommandSlot();
        this.#LODManager = new LODManager(this, () => {
            this.dirtyLOD = true;
            this.#prevLodIDX = -1
        });
        const slot = redGPUContext.globalVertexSSBO.allocateSlot();
        this.#globalVertexSlotIndex = slot.index;
    }

    /**
     * [KO] 글로벌 버퍼 슬롯 인덱스를 반환합니다.
     * [EN] Returns the global buffer slot index.
     *
     * @returns
     * [KO] 글로벌 버텍스 슬롯 인덱스
     * [EN] Global vertex slot index
     */
    get globalVertexSlotIndex(): number {
        return this.#globalVertexSlotIndex;
    }

    /**
     * [KO] 드로우 커맨드 슬롯을 반환합니다.
     * [EN] Returns the draw command slot.
     *
     * @returns
     * [KO] DrawCommandSlot 인스턴스 또는 `null`
     * [EN] DrawCommandSlot instance or `null`
     */
    get drawCommandSlot(): DrawCommandSlot | null {
        return this.#drawCommandSlot;
    }

    /**
     * [KO] 드로우 버퍼 매니저를 반환합니다.
     * [EN] Returns the draw buffer manager.
     *
     * @returns
     * [KO] DrawBufferManager 인스턴스 또는 `null`
     * [EN] DrawBufferManager instance or `null`
     */
    get drawBufferManager(): DrawBufferManager | null {
        return this.#drawBufferManager;
    }

    /**
     * [KO] LOD(Level of Detail) 매니저를 반환합니다.
     * [EN] Returns the LOD (Level of Detail) manager.
     *
     * @returns
     * [KO] LODManager 인스턴스
     * [EN] LODManager instance
     */
    get LODManager(): LODManager {
        return this.#LODManager;
    }

    /**
     * [KO] 디버거 활성화 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether the debugger is enabled.
     *
     * @returns
     * [KO] 디버거 활성화 여부
     * [EN] Whether the debugger is enabled
     */
    get enableDebugger(): boolean {
        return this.#enableDebugger;
    }

    set enableDebugger(value: boolean) {
        this.#enableDebugger = value;
        if (value && !this.#drawDebugger) this.#drawDebugger = new DrawDebuggerMesh(this.redGPUContext, this);
    }

    /**
     * [KO] 디버그 메시 객체를 반환합니다.
     * [EN] Returns the debug mesh object.
     *
     * @returns
     * [KO] DrawDebuggerMesh 인스턴스
     * [EN] DrawDebuggerMesh instance
     */
    get drawDebugger(): DrawDebuggerMesh {
        return this.#drawDebugger;
    }

    _material;

    /**
     * [KO] 머티리얼을 가져오거나 설정합니다.
     * [EN] Gets or sets the material.
     *
     * @returns
     * [KO] 설정된 머티리얼 인스턴스
     * [EN] Configured material instance
     */
    get material() {
        return this._material;
    }

    set material(value) {
        this._material = value;
        this.dirtyPipeline = true;
        if ("blendMode" in this) {
            this.blendMode = this.blendMode;
        }
    }

    _geometry: Geometry | Primitive;

    /**
     * [KO] 지오메트리를 가져오거나 설정합니다.
     * [EN] Gets or sets the geometry.
     *
     * @returns
     * [KO] Geometry 또는 Primitive 인스턴스
     * [EN] Geometry or Primitive instance
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    set geometry(value: Geometry | Primitive) {
        this._geometry = value;
        this.dirtyPipeline = true;
        this.dirtyTransform = true;
    }

    /**
     * [KO] 메시의 투명도를 가져오거나 설정합니다 (0~1).
     * [EN] Gets or sets the opacity of the mesh (0~1).
     *
     * @returns
     * [KO] 투명도 값 (0~1)
     * [EN] Opacity value (0~1)
     */
    get opacity(): number {
        return this.#opacity;
    }

    set opacity(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#opacity = value;
        this.dirtyOpacity = true;
    }

    /**
     * [KO] 프러스텀 컬링 무시 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether to ignore frustum culling.
     *
     * @returns
     * [KO] 프러스텀 컬링 무시 여부
     * [EN] Whether frustum culling is ignored
     */
    get ignoreFrustumCulling(): boolean {
        return this.#ignoreFrustumCulling;
    }

    set ignoreFrustumCulling(value: boolean) {
        this.#ignoreFrustumCulling = value;
    }

    /**
     * [KO] 투영 면적 컬링(Screen Space Size Culling) 사용 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether to use screen space size culling.
     *
     * @returns
     * [KO] 투영 면적 컬링 사용 여부
     * [EN] Whether screen space size culling is used
     */
    get useScreenSpaceSizeCulling(): boolean {
        return this.#useScreenSpaceSizeCulling;
    }

    set useScreenSpaceSizeCulling(value: boolean) {
        this.#useScreenSpaceSizeCulling = value;
    }

    /**
     * [KO] 투영 면적 컬링의 화면상 크기 비율 임계값을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum size ratio threshold for screen space size culling.
     *
     * @returns
     * [KO] 화면상 크기 비율 임계값
     * [EN] Screen space size ratio threshold
     */
    get minScreenSpaceSize(): number {
        return this.#minScreenSpaceSize;
    }

    set minScreenSpaceSize(value: number) {
        this.#minScreenSpaceSize = value;
    }

    /**
     * [KO] 피킹 ID를 반환합니다.
     * [EN] Returns the picking ID.
     *
     * @returns
     * [KO] 피킹 식별자 값
     * [EN] Picking identifier value
     */
    get pickingId(): number {
        return this.#pickingId;
    }

    /**
     * [KO] 등록된 이벤트 맵 객체를 반환합니다.
     * [EN] Returns the registered event map object.
     *
     * @returns
     * [KO] 등록된 이벤트 객체
     * [EN] Registered events object
     */
    get events(): any {
        return this.#events;
    }

    /**
     * [KO] 버텍스 상태 버퍼 레이아웃 배열을 반환합니다.
     * [EN] Returns the array of vertex state buffer layouts.
     *
     * @returns
     * [KO] GPUVertexBufferLayout 배열
     * [EN] Array of GPUVertexBufferLayout
     */
    get vertexStateBuffers(): GPUVertexBufferLayout[] {
        return this._geometry.gpuRenderInfo.buffers;
    }

    /**
     * [KO] 설정된 부모 컨테이너 객체를 가져오거나 설정합니다.
     * [EN] Gets or sets the parent container object.
     *
     * @returns
     * [KO] 부모 Object3DContainer 인스턴스
     * [EN] Parent Object3DContainer instance
     */
    get parent(): Object3DContainer {
        return this.#parent;
    }

    set parent(value: Object3DContainer) {
        this.#parent = value;
    }

    /**
     * [KO] 물(WaterLake)과의 실시간 파동 인터랙션 활성화 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether real-time wave interaction with water (WaterLake) is enabled.
     *
     * @returns
     * [KO] 물 파동 인터랙션 활성화 여부
     * [EN] Whether water wave interaction is enabled
     */
    get enableWaterInteraction(): boolean {
        return this.#enableWaterInteraction;
    }

    set enableWaterInteraction(value: boolean) {
        const boolVal = !!value;
        if (this.#enableWaterInteraction !== boolVal) {
            this.#enableWaterInteraction = boolVal;
            if (boolVal) {
                WaterInteractionRegistry.register(this);
            } else {
                WaterInteractionRegistry.unregister(this);
            }
        }
    }

    /**
     * [KO] 물 파동 생성 강도 배율을 가져오거나 설정합니다 (기본값: 1.0).
     * [EN] Gets or sets the wave generation strength multiplier (default: 1.0).
     *
     * @returns
     * [KO] 물 파동 생성 강도 배율
     * [EN] Water wave generation strength multiplier
     */
    get waterWaveStrength(): number {
        return this.#waterWaveStrength;
    }

    set waterWaveStrength(value: number) {
        this.#waterWaveStrength = Math.max(0, value);
    }

    /**
     * [KO] 물 인터랙션 시 정적 객체(속도 추적 제외)로 처리할지 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether this mesh is treated as a static object (excluding speed tracking) in water interaction.
     *
     * @returns
     * [KO] 정적 객체 처리 여부
     * [EN] Whether treated as a static object
     */
    get waterInteractionStatic(): boolean {
        return this.#waterInteractionStatic;
    }

    set waterInteractionStatic(value: boolean) {
        this.#waterInteractionStatic = !!value;
    }

    /**
     * [KO] 피벗 X 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the pivot X coordinate.
     *
     * @returns
     * [KO] 피벗 X 좌표
     * [EN] Pivot X coordinate
     */
    get pivotX(): number {
        return this.#pivotX;
    }

    set pivotX(value: number) {
        this.#pivotX = value;
        this.dirtyTransform = true;
    }

    /**
     * [KO] 피벗 Y 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the pivot Y coordinate.
     *
     * @returns
     * [KO] 피벗 Y 좌표
     * [EN] Pivot Y coordinate
     */
    get pivotY(): number {
        return this.#pivotY;
    }

    set pivotY(value: number) {
        this.#pivotY = value;
        this.dirtyTransform = true;
    }

    /**
     * [KO] 피벗 Z 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the pivot Z coordinate.
     *
     * @returns
     * [KO] 피벗 Z 좌표
     * [EN] Pivot Z coordinate
     */
    get pivotZ(): number {
        return this.#pivotZ;
    }

    set pivotZ(value: number) {
        this.#pivotZ = value;
        this.dirtyTransform = true;
    }

    /**
     * [KO] X 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the X position coordinate.
     *
     * @returns
     * [KO] X 위치 좌표
     * [EN] X position coordinate
     */
    get x(): number {
        return this.#x;
    }

    set x(value: number) {
        this.#x = this.#positionArray[0] = value;
        this.dirtyTransform = true;
    }

    /**
     * [KO] Y 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y position coordinate.
     *
     * @returns
     * [KO] Y 위치 좌표
     * [EN] Y position coordinate
     */
    get y(): number {
        return this.#y;
    }

    set y(value: number) {
        this.#y = this.#positionArray[1] = value;
        this.dirtyTransform = true;
    }

    /**
     * [KO] Z 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z position coordinate.
     *
     * @returns
     * [KO] Z 위치 좌표
     * [EN] Z position coordinate
     */
    get z(): number {
        return this.#z;
    }

    set z(value: number) {
        this.#z = this.#positionArray[2] = value;
        this.dirtyTransform = true;
    }

    /**
     * [KO] 현재 위치를 반환합니다. [x, y, z]
     * [EN] Returns the current position. [x, y, z]
     *
     * @returns
     * [KO] 위치 배열
     * [EN] Position array
     */
    get position(): Float32Array {
        return this.#positionArray;
    }

    /**
     * [KO] X축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis scale.
     *
     * @returns
     * [KO] X축 스케일 값
     * [EN] X-axis scale value
     */
    get scaleX(): number {
        return this.#scaleX;
    }

    set scaleX(value: number) {
        this.#scaleX = this.#scaleArray[0] = value;
        this.dirtyTransform = true;
    }

    /**
     * [KO] Y축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis scale.
     *
     * @returns
     * [KO] Y축 스케일 값
     * [EN] Y-axis scale value
     */
    get scaleY(): number {
        return this.#scaleY;
    }

    set scaleY(value: number) {
        this.#scaleY = this.#scaleArray[1] = value;
        this.dirtyTransform = true;
    }

    /**
     * [KO] Z축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis scale.
     *
     * @returns
     * [KO] Z축 스케일 값
     * [EN] Z-axis scale value
     */
    get scaleZ(): number {
        return this.#scaleZ;
    }

    set scaleZ(value: number) {
        this.#scaleZ = this.#scaleArray[2] = value;
        this.dirtyTransform = true;
    }

    /**
     * [KO] 현재 스케일을 반환합니다. [x, y, z]
     * [EN] Returns the current scale. [x, y, z]
     *
     * @returns
     * [KO] 스케일 배열
     * [EN] Scale array
     */
    get scale(): Float32Array {
        return this.#scaleArray;
    }

    /**
     * [KO] X축 회전값을 가져오거나 설정합니다 (도).
     * [EN] Gets or sets the X-axis rotation value (degrees).
     *
     * @returns
     * [KO] X축 회전값 (도)
     * [EN] X-axis rotation value (degrees)
     */
    get rotationX(): number {
        return this.#rotationX;
    }

    set rotationX(value: number) {
        this.#rotationX = this.#rotationArray[0] = value % 360;
        this.dirtyTransform = true;
    }

    /**
     * [KO] Y축 회전값을 가져오거나 설정합니다 (도).
     * [EN] Gets or sets the Y-axis rotation value (degrees).
     *
     * @returns
     * [KO] Y축 회전값 (도)
     * [EN] Y-axis rotation value (degrees)
     */
    get rotationY(): number {
        return this.#rotationY;
    }

    set rotationY(value: number) {
        this.#rotationY = this.#rotationArray[1] = value % 360;
        this.dirtyTransform = true;
    }

    /**
     * [KO] Z축 회전값을 가져오거나 설정합니다 (도).
     * [EN] Gets or sets the Z-axis rotation value (degrees).
     *
     * @returns
     * [KO] Z축 회전값 (도)
     * [EN] Z-axis rotation value (degrees)
     */
    get rotationZ(): number {
        return this.#rotationZ;
    }

    set rotationZ(value: number) {
        this.#rotationZ = this.#rotationArray[2] = value % 360;
        this.dirtyTransform = true;
    }

    /**
     * [KO] 현재 회전값을 반환합니다. [x, y, z] (도)
     * [EN] Returns the current rotation values. [x, y, z] (degrees)
     *
     * @returns
     * [KO] 회전값 배열 (도)
     * [EN] Rotation values array (degrees)
     */
    get rotation(): Float32Array {
        return this.#rotationArray;
    }

    /**
     * [KO] OBB(Oriented Bounding Box) 정보를 반환합니다.
     * [EN] Returns the OBB (Oriented Bounding Box) information.
     *
     * @returns
     * [KO] 계산된 OBB 인스턴스
     * [EN] Calculated OBB instance
     */
    get boundingOBB(): OBB {
        if (!this.#cachedBoundingOBB || this.dirtyTransform) {
            this.#cachedBoundingOBB = calculateMeshOBB(this);
        }
        return this.#cachedBoundingOBB;
    }

    /**
     * [KO] AABB(Axis-Aligned Bounding Box) 정보를 반환합니다. (Zero-GC 인플레이스 재사용)
     * [EN] Returns the AABB (Axis-Aligned Bounding Box) information. (Zero-GC in-place reuse)
     *
     * @returns
     * [KO] 계산된 AABB 인스턴스
     * [EN] Calculated AABB instance
     */
    get boundingAABB(): AABB {
        if (!this.#cachedBoundingAABB) {
            this.#cachedBoundingAABB = new AABB();
            this.#dirtyBoundingAABB = true;
        }
        if (this.#dirtyBoundingAABB || this.dirtyTransform) {
            calculateMeshAABB(this, this.#cachedBoundingAABB);
            this.#dirtyBoundingAABB = false;
        }
        return this.#cachedBoundingAABB;
    }

    /**
     * [KO] 자식 객체들을 포함한 통합 AABB 정보를 반환합니다.
     * [EN] Returns the combined AABB information including child objects.
     *
     * @returns
     * [KO] 통합된 AABB 인스턴스
     * [EN] Combined AABB instance
     */
    get combinedBoundingAABB(): AABB {
        return calculateMeshCombinedAABB(this);
    }

    /**
     * [KO] 하위 계층의 모든 객체에 디버거 활성화 여부를 설정합니다.
     * [EN] Sets the debugger visibility for all objects in the hierarchy.
     *
     * @param enableDebugger -
     * [KO] 활성화 여부 (기본값: false)
     * [EN] Whether to enable (default: false)
     */
    setEnableDebuggerRecursively(enableDebugger: boolean = false) {
        if ('enableDebugger' in this) {
            this.enableDebugger = enableDebugger;
        }
        if (this.children) {
            this.children.forEach(child => {
                child.setEnableDebuggerRecursively(enableDebugger);
            });
        }
    }

    /**
     * [KO] 하위 계층의 모든 객체에 그림자 캐스팅 여부를 설정합니다.
     * [EN] Sets shadow casting for all objects in the hierarchy.
     *
     * @param value -
     * [KO] 캐스팅 여부 (기본값: false)
     * [EN] Whether to cast (default: false)
     */
    setCastShadowRecursively(value: boolean = false) {
        if ('castShadow' in this) {
            this.castShadow = value;
        }
        if (this.children) {
            this.children.forEach(child => {
                child.setCastShadowRecursively(value);
            });
        }
    }

    /**
     * [KO] 하위 계층의 모든 객체에 그림자 수신 여부를 설정합니다.
     * [EN] Sets shadow receiving for all objects in the hierarchy.
     *
     * @param value -
     * [KO] 수신 여부 (기본값: false)
     * [EN] Whether to receive (default: false)
     */
    setReceiveShadowRecursively(value: boolean = false) {
        if ('receiveShadow' in this) {
            this.receiveShadow = value;
        }
        if (this.children) {
            this.children.forEach(child => {
                child.setReceiveShadowRecursively(value);
            });
        }
    }

    /**
     * [KO] 하위 계층의 모든 객체에 프러스텀 컬링 무시 여부를 설정합니다.
     * [EN] Sets whether to ignore frustum culling for all objects in the hierarchy.
     *
     * @param value -
     * [KO] 무시 여부 (기본값: false)
     * [EN] Whether to ignore (default: false)
     */
    setIgnoreFrustumCullingRecursively(value: boolean = false) {
        if ('ignoreFrustumCulling' in this) {
            this.ignoreFrustumCulling = value;
        }
        if (this.children) {
            this.children.forEach(child => {
                child.setIgnoreFrustumCullingRecursively(value);
            });
        }
    }

    /**
     * [KO] 하위 계층의 모든 객체에 물 인터랙션 활성화 여부 및 파라미터를 재귀적으로 설정합니다.
     * [EN] Recursively sets water interaction enable status and parameters for all objects in the hierarchy.
     *
     * @param enable -
     * [KO] 활성화 여부 (기본값: true)
     * [EN] Whether to enable (default: true)
     * @param waveStrength -
     * [KO] 파동 생성 강도 (기본값: 1.0)
     * [EN] Wave generation strength (default: 1.0)
     * @param isStatic -
     * [KO] 정적 객체 여부 (기본값: false)
     * [EN] Whether it is a static object (default: false)
     */
    setEnableWaterInteractionRecursively(enable: boolean = true, waveStrength: number = 1.0, isStatic: boolean = false): void {
        this.enableWaterInteraction = enable;
        this.waterWaveStrength = waveStrength;
        this.waterInteractionStatic = isStatic;
        const children = this.children;
        if (children) {
            const len = children.length;
            for (let i = 0; i < len; i++) {
                children[i].setEnableWaterInteractionRecursively(enable, waveStrength, isStatic);
            }
        }
    }

    /**
     * [KO] 부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.
     * [EN] Calculates and returns the combined opacity considering the parent hierarchy.
     *
     * @returns
     * [KO] 통합 투명도 값
     * [EN] Combined opacity value
     */
    getCombinedOpacity(): number {
        if (this['is2DMeshType']) {
            const parent = this.parent as { getCombinedOpacity?: () => number } | undefined;
            return this.#opacity * (parent?.getCombinedOpacity ? parent.getCombinedOpacity() : 1);
        }
        return 1;
    }

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
    addListener(eventName: string, callback: Function) {
        this.#events[eventName] = callback;
        this.#eventsNum = Object.keys(this.#events).length;
    }

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
    lookAt(targetX: number | [number, number, number], targetY?: number, targetZ?: number): void {
        let tPosition = [];
        let tRotation = [];
        tPosition[0] = targetX;
        tPosition[1] = targetY;
        tPosition[2] = targetZ;
        mat4.identity(this.localMatrix);
        mat4.targetTo(this.localMatrix, [this.#x, this.#y, this.#z], tPosition, up);
        tRotation = mat4ToEuler(this.localMatrix, []);
        this.rotationX = tRotation[0] * 180 / Math.PI;
        this.rotationY = tRotation[1] * 180 / Math.PI;
        this.rotationZ = tRotation[2] * 180 / Math.PI;
    }

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
    setScale(x: number, y?: number, z?: number) {
        y = y ?? x;
        z = z ?? x;
        const scaleArray = this.#scaleArray;
        this.#scaleX = scaleArray[0] = x;
        this.#scaleY = scaleArray[1] = y;
        this.#scaleZ = scaleArray[2] = z;
        this.dirtyTransform = true;
    }

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
    setPosition(x: number, y?: number, z?: number) {
        y = y ?? x;
        z = z ?? x;
        const positionArray = this.#positionArray;
        this.#x = positionArray[0] = x;
        this.#y = positionArray[1] = y;
        this.#z = positionArray[2] = z;
        this.dirtyTransform = true;
    }

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
    setRotation(rotationX: number, rotationY?: number, rotationZ?: number) {
        rotationY = rotationY ?? rotationX;
        rotationZ = rotationZ ?? rotationX;
        const rotationArray = this.#rotationArray;
        this.#rotationX = rotationArray[0] = rotationX;
        this.#rotationY = rotationArray[1] = rotationY;
        this.#rotationZ = rotationArray[2] = rotationZ;
        this.dirtyTransform = true;
    }

    /**
     * [KO] 메시를 복제합니다.
     * [EN] Clones the mesh.
     *
     * @experimental
     * @returns
     * [KO] 복제된 Mesh 인스턴스
     * [EN] Cloned Mesh instance
     */
    clone() {
        const cloneMesh = new Mesh(this.redGPUContext, this._geometry, this._material);
        cloneMesh.setPosition(this.#x, this.#y, this.#z);
        cloneMesh.setRotation(this.#rotationX, this.#rotationY, this.#rotationZ);
        cloneMesh.setScale(this.#scaleX, this.#scaleY, this.#scaleZ);
        let i = this.children.length;
        while (i--) {
            cloneMesh.addChild(this.children[i].clone());
        }
        return cloneMesh;
    }

    /**
     * [KO] 메시를 렌더링합니다.
     * [EN] Renders the mesh.
     *
     * @param renderViewStateData -
     * [KO] 렌더 상태 데이터
     * [EN] Render view state data
     */
    render(renderViewStateData: RenderViewStateData) {
        const {redGPUContext,} = this
        const {
            view,
            isScene2DMode,
            frustumPlanes,
            dirtyVertexUniformFromMaterial,
            useDistanceCulling,
            cullingDistanceSquared,
            interleavedCullingInfo,
        } = renderViewStateData
        const {projectionScale, interleavedCullingCheckFrameIndex} = interleavedCullingInfo
        const useScreenSpaceSizeCulling = this.#useScreenSpaceSizeCulling
        const minScreenSpaceSize = this.#minScreenSpaceSize
        const {antialiasingManager, gpuDevice} = redGPUContext
        const {scene} = view
        const {shadowManager} = scene
        const {directionalShadowManager} = shadowManager
        const {pickingManager} = view
        const {castingList} = directionalShadowManager
        const currentGeometry = this._geometry
        const currentMaterial = this._material
        const {uuid: currentMaterialUUID} = currentMaterial || {}
        let dirtyTransformForChildren
        let dirtyOpacityForChildren
        let currentDirtyPipeline = this.dirtyPipeline
        const {skinInfo} = this.animationInfo
        if (isScene2DMode) {
            this.#z = 0
            this.#pivotZ = 0
            if (this.depthStencilState.depthWriteEnabled) {
                this.depthStencilState.depthWriteEnabled = false
            }
        }
        if (this.dirtyTransform) {
            dirtyTransformForChildren = true
            this.#needUpdateNormalMatrixUniform = true
            this.#needUpdateMatrixUniform = true
            {
                const parent = this.parent
                const tLocalMatrix = this.localMatrix;
                let aX, aY, aZ;
                tLocalMatrix[12] = this.#x;
                tLocalMatrix[13] = this.#y;
                tLocalMatrix[14] = this.#z;
                tLocalMatrix[15] = 1;
                aX = this.#rotationX * CONVERT_RADIAN;
                aY = this.#rotationY * CONVERT_RADIAN;
                aZ = this.#rotationZ * CONVERT_RADIAN;
                let aSx, aSy, aSz, aCx, aCy, aCz;
                let b0, b1, b2, b3;
                let b00, b01, b02, b10, b11, b12, b20, b21, b22;
                let a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33;
                let tRadian;
                a00 = 1, a01 = 0, a02 = 0;
                a10 = 0, a11 = 1, a12 = 0;
                a20 = 0, a21 = 0, a22 = 1;
                tRadian = aX % CPI2;
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
                aSx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
                tRadian = (aX + C157) % CPI2;
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
                aCx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
                tRadian = aY % CPI2;
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
                aSy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
                tRadian = (aY + C157) % CPI2;
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
                aCy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
                tRadian = aZ % CPI2;
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
                aSz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
                tRadian = (aZ + C157) % CPI2;
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
                aCz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
                b00 = aCy * aCz;
                b01 = aCx * aSz + aSx * aSy * aCz;
                b02 = aSx * aSz - aCx * aSy * aCz;

                b10 = -aCy * aSz;
                b11 = aCx * aCz - aSx * aSy * aSz;
                b12 = aSx * aCz + aCx * aSy * aSz;

                b20 = aSy;
                b21 = -aSx * aCy;
                b22 = aCx * aCy;
                let sX = this.#scaleX, sY = this.#scaleY, sZ = this.#scaleZ;
                //@ts-ignore
                if (this.renderTextureWidth) {
                    //@ts-ignore
                    sX *= this.renderTextureWidth;
                    //@ts-ignore
                    sY *= this.renderTextureHeight;
                }

                tLocalMatrix[0] = b00 * sX;
                tLocalMatrix[1] = b01 * sX;
                tLocalMatrix[2] = b02 * sX;
                tLocalMatrix[3] = 0;

                tLocalMatrix[4] = b10 * sY;
                tLocalMatrix[5] = b11 * sY;
                tLocalMatrix[6] = b12 * sY;
                tLocalMatrix[7] = 0;

                tLocalMatrix[8] = b20 * sZ;
                tLocalMatrix[9] = b21 * sZ;
                tLocalMatrix[10] = b22 * sZ;
                tLocalMatrix[11] = 0;
                {
                    (this.#pivotX || this.#pivotY || this.#pivotZ) ? (
                        a00 = tLocalMatrix[0], a01 = tLocalMatrix[1], a02 = tLocalMatrix[2], a03 = tLocalMatrix[3],
                            a10 = tLocalMatrix[4], a11 = tLocalMatrix[5], a12 = tLocalMatrix[6], a13 = tLocalMatrix[7],
                            a20 = tLocalMatrix[8], a21 = tLocalMatrix[9], a22 = tLocalMatrix[10], a23 = tLocalMatrix[11],
                            a30 = tLocalMatrix[12], a31 = tLocalMatrix[13], a32 = tLocalMatrix[14], a33 = tLocalMatrix[15],
                            b0 = 1, b1 = 0, b2 = 0, b3 = 0,
                            tLocalMatrix[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
                            tLocalMatrix[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
                            tLocalMatrix[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
                            tLocalMatrix[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
                            b0 = 0, b1 = 1, b2 = 0, b3 = 0,
                            tLocalMatrix[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
                            tLocalMatrix[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
                            tLocalMatrix[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
                            tLocalMatrix[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
                            b0 = 0, b1 = 0, b2 = 1, b3 = 0,
                            tLocalMatrix[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
                            tLocalMatrix[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
                            tLocalMatrix[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
                            tLocalMatrix[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
                            (isScene2DMode
                                ? (
                                    parent?.modelMatrix
                                        ? (b0 = -this.#pivotX, b1 = -this.#pivotY, b2 = -this.#pivotZ, b3 = 1)
                                        : (b0 = -this.#pivotX / aX, b1 = -this.#pivotY / aY, b2 = -this.#pivotZ, b3 = 1)
                                )
                                :
                                (b0 = -this.#pivotX, b1 = -this.#pivotY, b2 = -this.#pivotZ, b3 = 1)),
                            tLocalMatrix[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
                            tLocalMatrix[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
                            tLocalMatrix[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
                            tLocalMatrix[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
                    ) : 0
                }
                {


                    if (parent?.modelMatrix) {
                        const p = parent.modelMatrix
                        const l = this.localMatrix
                        const out = this.modelMatrix
                        const a00 = p[0], a01 = p[1], a02 = p[2], a03 = p[3];
                        const a10 = p[4], a11 = p[5], a12 = p[6], a13 = p[7];
                        const a20 = p[8], a21 = p[9], a22 = p[10], a23 = p[11];
                        const a30 = p[12], a31 = p[13], a32 = p[14], a33 = p[15];
                        let b0 = l[0], b1 = l[1], b2 = l[2], b3 = l[3];
                        out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                        out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                        out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                        out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                        b0 = l[4], b1 = l[5], b2 = l[6], b3 = l[7];
                        out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                        out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                        out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                        out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                        b0 = l[8], b1 = l[9], b2 = l[10], b3 = l[11];
                        out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                        out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                        out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                        out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                        b0 = l[12], b1 = l[13], b2 = l[14], b3 = l[15];
                        out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                        out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                        out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                        out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                    } else {
                        const {modelMatrix, localMatrix} = this
                        modelMatrix[0] = localMatrix[0], modelMatrix[1] = localMatrix[1], modelMatrix[2] = localMatrix[2], modelMatrix[3] = localMatrix[3];
                        modelMatrix[4] = localMatrix[4], modelMatrix[5] = localMatrix[5], modelMatrix[6] = localMatrix[6], modelMatrix[7] = localMatrix[7];
                        modelMatrix[8] = localMatrix[8], modelMatrix[9] = localMatrix[9], modelMatrix[10] = localMatrix[10], modelMatrix[11] = localMatrix[11];
                        modelMatrix[12] = localMatrix[12], modelMatrix[13] = localMatrix[13], modelMatrix[14] = localMatrix[14], modelMatrix[15] = localMatrix[15];
                    }
                }

            }

            this.dirtyTransform = false
            this.#dirtyBoundingAABB = true
            this.#cachedBoundingOBB = null
        }


        const needCheckInterleavedCulling = dirtyTransformForChildren ||
            (interleavedCullingInfo.forceCullingCheck || (this.#interleavedCullingID === interleavedCullingCheckFrameIndex))
        let passFrustumCulling = this.passFrustumCulling = redGPUContext.viewList.length > 1 ? true : this.passFrustumCulling
        let distanceSquared = 0
        const lodList = this.#LODManager.LODList;
        const lodLen = lodList.length;
        distanceSquared = 0
        const aabb = (useDistanceCulling && currentGeometry || lodLen || (frustumPlanes && !this.#ignoreFrustumCulling)) ? this.boundingAABB : null;
        if (aabb) {
            if (useDistanceCulling && currentGeometry || lodLen) {
                const {rawCamera} = view
                const dx = rawCamera.x - aabb.centerX;
                const dy = rawCamera.y - aabb.centerY;
                const dz = rawCamera.z - aabb.centerZ;
                distanceSquared = dx * dx + dy * dy + dz * dz;
            }
        }
        if (needCheckInterleavedCulling) {
            passFrustumCulling = true

            if (useDistanceCulling && currentGeometry && aabb) {
                const geometryRadius = aabb.geometryRadius;
                const cullingDistanceWithRadius = cullingDistanceSquared + (geometryRadius * geometryRadius);
                if (distanceSquared > cullingDistanceWithRadius) {
                    passFrustumCulling = false;
                }
            }
            if (frustumPlanes && passFrustumCulling && !this.#ignoreFrustumCulling && aabb) {
                const {rawCamera} = view
                const combinedAABB = aabb;

                const isIsometricController = rawCamera.constructor.name === 'IsometricController';

                if (isIsometricController) {
                    const {centerX, centerY, centerZ, geometryRadius: radius} = combinedAABB;

                    const orthoCamera = rawCamera as OrthographicCamera;
                    const {left, right, top, bottom, nearClipping: near, farClipping: far} = orthoCamera;
                    const {x: camX, y: camY, z: camZ} = orthoCamera;

                    const cameraAngle = 45;

                    if (cameraAngle) {
                        const relX = centerX - camX;
                        const relY = centerY - camY;
                        const relZ = centerZ - camZ;

                        const angleRad = cameraAngle * (Math.PI / 180);
                        const cos = Math.cos(angleRad);
                        const sin = Math.sin(angleRad);

                        const rotatedX = relX * cos + relZ * sin;
                        const rotatedZ = -relX * sin + relZ * cos;

                        if (rotatedX + radius < left || rotatedX - radius > right ||
                            relY + radius < bottom || relY - radius > top ||
                            rotatedZ + radius < near || rotatedZ - radius > far) {
                            passFrustumCulling = false;
                        }
                    } else {
                        if (centerX + radius < left || centerX - radius > right ||
                            centerY + radius < bottom || centerY - radius > top ||
                            centerZ + radius < near || centerZ - radius > far) {
                            passFrustumCulling = false;
                        }
                    }
                } else {
                    const centerX = combinedAABB.centerX;
                    const centerY = combinedAABB.centerY;
                    const centerZ = combinedAABB.centerZ;
                    const radius = combinedAABB.geometryRadius;

                    const viewMatrix = rawCamera.viewMatrix;
                    const camForwardX = -viewMatrix[2];
                    const camForwardY = -viewMatrix[6];
                    const camForwardZ = -viewMatrix[10];

                    const dx = centerX - rawCamera.x;
                    const dy = centerY - rawCamera.y;
                    const dz = centerZ - rawCamera.z;

                    const dot = dx * camForwardX + dy * camForwardY + dz * camForwardZ;

                    const bias = 1.0;

                    if (dot < -radius - bias) {
                        passFrustumCulling = false;
                    } else {
                        let passedScreenSpaceCulling = true;
                        if (useScreenSpaceSizeCulling && dot > 0) {
                            const screenRatio = (radius * 2.0 / dot) * projectionScale;
                            if (screenRatio < minScreenSpaceSize) {
                                passedScreenSpaceCulling = false;
                                passFrustumCulling = false;
                            }
                        }

                        if (passedScreenSpaceCulling) {
                            const frustumPlanes0 = frustumPlanes[0];
                            const frustumPlanes1 = frustumPlanes[1];
                            const frustumPlanes2 = frustumPlanes[2];
                            const frustumPlanes3 = frustumPlanes[3];
                            const frustumPlanes4 = frustumPlanes[4];
                            const frustumPlanes5 = frustumPlanes[5];

                            frustumPlanes0[0] * centerX + frustumPlanes0[1] * centerY + frustumPlanes0[2] * centerZ + frustumPlanes0[3] <= -radius - bias ? passFrustumCulling = false
                                : frustumPlanes1[0] * centerX + frustumPlanes1[1] * centerY + frustumPlanes1[2] * centerZ + frustumPlanes1[3] <= -radius - bias ? passFrustumCulling = false
                                    : frustumPlanes2[0] * centerX + frustumPlanes2[1] * centerY + frustumPlanes2[2] * centerZ + frustumPlanes2[3] <= -radius - bias ? passFrustumCulling = false
                                        : frustumPlanes3[0] * centerX + frustumPlanes3[1] * centerY + frustumPlanes3[2] * centerZ + frustumPlanes3[3] <= -radius - bias ? passFrustumCulling = false
                                            : frustumPlanes4[0] * centerX + frustumPlanes4[1] * centerY + frustumPlanes4[2] * centerZ + frustumPlanes4[3] <= -radius - bias ? passFrustumCulling = false
                                                : frustumPlanes5[0] * centerX + frustumPlanes5[1] * centerY + frustumPlanes5[2] * centerZ + frustumPlanes5[3] <= -radius - bias ? passFrustumCulling = false : 0;
                        }
                    }
                }
            }
        }
        if (this.castShadow) passFrustumCulling = true
        if (passFrustumCulling) {
            {
                if (antialiasingManager.useTAA && this.#uniformDataMatrixList) {

                    const {redGPUContext} = this
                    const {resourceManager} = redGPUContext
                    const {members: vertexUniformInfoMembers} = resourceManager.GLOBAL_VERTEX_STRUCT
                    const {members: vertexUniformInfoMatrixListMembers} = vertexUniformInfoMembers.matrixList
                    if (this.#prevModelMatrix && vertexUniformInfoMatrixListMembers.prevModelMatrix) {
                        this.#uniformDataMatrixList.set(this.#prevModelMatrix, vertexUniformInfoMatrixListMembers.prevModelMatrix.uniformOffsetForData / Float32Array.BYTES_PER_ELEMENT)
                        if (!this.#needUpdateMatrixUniform) {
                            redGPUContext.globalVertexSSBO.updateFloatData(
                                this.#globalVertexSlotIndex,
                                this.#prevModelMatrix,
                                vertexUniformInfoMatrixListMembers.prevModelMatrix.uniformOffset / 4
                            )
                        }
                    }
                    {
                        if (!this.#prevModelMatrix) this.#prevModelMatrix = new Float32Array(16)
                        const prev = this.#prevModelMatrix
                        const current = this.modelMatrix
                        prev[0] = current[0], prev[1] = current[1], prev[2] = current[2], prev[3] = current[3];
                        prev[4] = current[4], prev[5] = current[5], prev[6] = current[6], prev[7] = current[7];
                        prev[8] = current[8], prev[9] = current[9], prev[10] = current[10], prev[11] = current[11];
                        prev[12] = current[12], prev[13] = current[13], prev[14] = current[14], prev[15] = current[15];
                    }
                } else {
                    this.#prevModelMatrix = null
                }
                {
                    const {redGPUContext} = this
                    const {resourceManager} = redGPUContext
                    const {members: vertexUniformInfoMembers} = resourceManager.GLOBAL_VERTEX_STRUCT
                    const {members: vertexUniformInfoMatrixListMembers} = vertexUniformInfoMembers.matrixList
                    if (!this.#uniformDataMatrixList) {
                        this.#uniformDataMatrixList = new Float32Array(vertexUniformInfoMembers.matrixList.endOffset / Float32Array.BYTES_PER_ELEMENT)
                    }

                    if (this.#needUpdateMatrixUniform) {
                        {
                            const modelMatrix = (
                                // @ts-ignore
                                this.is2DMeshType ? mat4.multiply(
                                    mat4.create(),
                                    this.modelMatrix,
                                    mat4.fromValues(
                                        // @ts-ignore
                                        this.width, 0, 0, 0, 0, this.height, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                                    ),
                                ) : this.modelMatrix
                            )
                            this.#uniformDataMatrixList.set(modelMatrix, vertexUniformInfoMatrixListMembers.modelMatrix.uniformOffsetForData / Float32Array.BYTES_PER_ELEMENT)
                        }
                        {
                            if (this.#needUpdateNormalMatrixUniform && vertexUniformInfoMatrixListMembers.normalModelMatrix) {
                                this.#needUpdateNormalMatrixUniform = false
                                const m = this.modelMatrix;
                                const n = this.normalModelMatrix;
                                const a00 = m[0], a01 = m[1], a02 = m[2];
                                const a10 = m[4], a11 = m[5], a12 = m[6];
                                const a20 = m[8], a21 = m[9], a22 = m[10];
                                const det = a00 * (a11 * a22 - a12 * a21) - a01 * (a10 * a22 - a12 * a20) + a02 * (a10 * a21 - a11 * a20);
                                if (det === 0) {
                                    n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1;
                                } else {
                                    const invDet = 1 / det;
                                    n[0] = (a11 * a22 - a12 * a21) * invDet;
                                    n[1] = (a12 * a20 - a10 * a22) * invDet;
                                    n[2] = (a10 * a21 - a11 * a20) * invDet;
                                    n[3] = 0;
                                    n[4] = (a02 * a21 - a01 * a22) * invDet;
                                    n[5] = (a00 * a22 - a02 * a20) * invDet;
                                    n[6] = (a01 * a20 - a00 * a21) * invDet;
                                    n[7] = 0;
                                    n[8] = (a01 * a12 - a02 * a11) * invDet;
                                    n[9] = (a02 * a10 - a00 * a12) * invDet;
                                    n[10] = (a00 * a11 - a01 * a10) * invDet;
                                    n[11] = 0;
                                    n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1;
                                }
                            }
                            this.#uniformDataMatrixList.set(this.normalModelMatrix, vertexUniformInfoMatrixListMembers.normalModelMatrix.uniformOffsetForData / Float32Array.BYTES_PER_ELEMENT)
                        }
                        if (vertexUniformInfoMatrixListMembers.localMatrix) {
                            this.#uniformDataMatrixList.set(this.localMatrix, vertexUniformInfoMatrixListMembers.localMatrix.uniformOffsetForData / Float32Array.BYTES_PER_ELEMENT)
                        }
                        dirtyTransformForChildren = true
                        this.#needUpdateMatrixUniform = false
                        redGPUContext.globalVertexSSBO.updateFloatData(
                            this.#globalVertexSlotIndex,
                            this.#uniformDataMatrixList,
                            vertexUniformInfoMembers.matrixList.startOffset / 4
                        )
                    }
                }
            }
            if (this.gltfLoaderInfo?.activeAnimations?.length) {
                renderViewStateData.animationList[renderViewStateData.animationList.length] = this.gltfLoaderInfo?.activeAnimations
            }
            if (skinInfo) {
            
                if (this.currentShaderModuleName === VERTEX_SHADER_MODULE_NAME_PBR_SKIN) {
                    renderViewStateData.skinList[renderViewStateData.skinList.length] = this
                    dirtyTransformForChildren = false
                } else if (!this.currentShaderModuleName.includes(VERTEX_SHADER_MODULE_NAME_PBR_SKIN)) {
                    currentDirtyPipeline = true
                }
            }
        } else {
        }
        this.passFrustumCulling = passFrustumCulling
        const {displacementTexture, displacementScale} = currentMaterial || {}
        if (currentDirtyPipeline || currentMaterial?.dirtyPipeline || dirtyVertexUniformFromMaterial[currentMaterialUUID]) {
            dirtyVertexUniformFromMaterial[currentMaterialUUID] = true
        }
        if (currentGeometry) {
            renderViewStateData.renderResults.num3DObjects++
            if (this.#lastUpdateMSAAID !== antialiasingManager.msaaID) {
                currentDirtyPipeline = true
                this.dirtyLOD = true
                this.#lastUpdateMSAAID = antialiasingManager.msaaID
            }
            if (!this.gpuRenderInfo) this.initGPURenderInfos()
            const currentUseDisplacementTexture = !!displacementTexture
            if (this.useDisplacementTexture !== currentUseDisplacementTexture) {
                this.useDisplacementTexture = currentUseDisplacementTexture
                currentDirtyPipeline = true
            }
            if (currentDirtyPipeline || dirtyVertexUniformFromMaterial[currentMaterialUUID]) {
                updateMeshDirtyPipeline(this, renderViewStateData)
                this.#bundleEncoderList.length = 0
                this.#renderBundleList.length = 0
                this.#renderBundle_LODList.length = 0
                this.#prevSystemBindGroupList.length = 0

            }

            {
                const {redGPUContext} = this
                const {resourceManager} = redGPUContext
                const {members: vertexUniformInfoMembers} = resourceManager.GLOBAL_VERTEX_STRUCT
                if (!this.#uniformDataMatrixList) {
                    this.#uniformDataMatrixList = new Float32Array(vertexUniformInfoMembers.matrixList.endOffset / Float32Array.BYTES_PER_ELEMENT)
                }
                if (vertexUniformInfoMembers.uvTransform && (currentMaterial.dirtyTextureTransform || dirtyVertexUniformFromMaterial[currentMaterialUUID])) {
                    const material = currentMaterial as any;
                    const offset = material.textureOffset || [0, 0];
                    const scale = material.textureScale || [1, 1];

                    if (offset) {

                        dirtyVertexUniformFromMaterial[currentMaterialUUID] = true
                        tempFloat32_4[0] = offset[0];
                        tempFloat32_4[1] = offset[1];
                        tempFloat32_4[2] = scale[0];
                        tempFloat32_4[3] = scale[1];

                        redGPUContext.globalVertexSSBO.updateFloatData(
                            this.#globalVertexSlotIndex,
                            tempFloat32_4,
                            vertexUniformInfoMembers.uvTransform.uniformOffset / 4
                        );

                        currentMaterial.dirtyTextureTransform = false
                    }

                }
            }
        } else {
            renderViewStateData.renderResults.num3DGroups++
        }

        if (currentGeometry && passFrustumCulling) {
            const {redGPUContext} = this
            const {resourceManager} = redGPUContext
            const {members: vertexUniformInfoMembers} = resourceManager.GLOBAL_VERTEX_STRUCT


            {
                if (vertexUniformInfoMembers.displacementScale !== undefined &&
                    this.#displacementScale !== displacementScale
                ) {
                    this.#displacementScale = displacementScale
                    tempFloat32_1[0] = displacementScale
                    redGPUContext.globalVertexSSBO.updateFloatData(
                        this.#globalVertexSlotIndex,
                        tempFloat32_1,
                        vertexUniformInfoMembers.displacementScale.uniformOffset / 4
                    );
                }
            }

            if (this.dirtyOpacity) {
                dirtyOpacityForChildren = true
                if (vertexUniformInfoMembers.combinedOpacity) {
                    tempFloat32_1[0] = this.getCombinedOpacity()
                    redGPUContext.globalVertexSSBO.updateFloatData(
                        this.#globalVertexSlotIndex,
                        tempFloat32_1,
                        vertexUniformInfoMembers.combinedOpacity.uniformOffset / 4
                    );
                }
                this.dirtyOpacity = false
            }
            const {
                bundleListRender2PathLayer,
                bundleListParticleLayer,
                bundleListTransparentLayer,
                bundleListAlphaLayer,
                bundleListBasicList
            } = renderViewStateData.renderBundleResults
            {
                {
                    const {viewIndex} = renderViewStateData
                    const {fragmentUniformBindGroup} = currentMaterial.gpuRenderInfo
                    if (
                        currentDirtyPipeline
                        || this.#prevFragmentBindGroup !== fragmentUniformBindGroup
                        || this.dirtyLOD
                    ) {
                        this.#bundleEncoderList.length = 0
                        this.#renderBundleList.length = 0
                        this.#renderBundle_LODList.length = 0
                        this.#prevSystemBindGroupList.length = 0
                    }
                    if (
                        !this.#bundleEncoderList[viewIndex]
                        || this.#prevSystemBindGroupList[viewIndex] !== view.systemUniform_Vertex_UniformBindGroup
                    ) {
                        this.#setRenderBundle(renderViewStateData)
                    }

                    renderViewStateData.renderResults.numDrawCalls++
                    if (currentGeometry.indexBuffer) {
                        const {indexBuffer} = currentGeometry
                        const {indexCount, triangleCount} = indexBuffer
                        renderViewStateData.renderResults.numTriangles += triangleCount
                        renderViewStateData.renderResults.numPoints += indexCount
                    } else {
                        const {vertexBuffer} = currentGeometry
                        const {vertexCount, triangleCount} = vertexBuffer
                        renderViewStateData.renderResults.numTriangles += triangleCount;
                        renderViewStateData.renderResults.numPoints += vertexCount
                    }
                    let renderBundle = this.#renderBundleList[viewIndex];
                    {
                        if (lodLen) {
                            const viewLODBundleList = this.#renderBundle_LODList[viewIndex];
                            let idx = this.#currentLODIndex;

                            if (idx < 0 || idx >= lodLen) {
                                idx = -1;
                            }

                            let needUpdate = false;

                            if (idx === -1) {
                                if (distanceSquared >= lodList[0].distanceSquared) {
                                    needUpdate = true;
                                }
                            } else if (idx === lodLen - 1) {
                                if (distanceSquared < lodList[idx].distanceSquared) {
                                    needUpdate = true;
                                }
                            } else {
                                const lowerBoundary = lodList[idx].distanceSquared;
                                const upperBoundary = lodList[idx + 1].distanceSquared;
                                if (distanceSquared < lowerBoundary || distanceSquared >= upperBoundary) {
                                    needUpdate = true;
                                }
                            }

                            if (needUpdate) {
                                let newIdx = -1;
                                for (let i = 0; i < lodLen; i++) {
                                    if (distanceSquared >= lodList[i].distanceSquared) {
                                        newIdx = i;
                                    } else {
                                        break;
                                    }
                                }

                                if (newIdx !== idx) {
                                    this.#currentLODIndex = newIdx;
                                    if (newIdx >= 0 && newIdx < lodLen) {
                                        renderBundle = viewLODBundleList[newIdx];
                                    }
                                }

                            } else if (idx >= 0 && idx < lodLen) {
                                renderBundle = viewLODBundleList[idx];

                            }
                            let targetIdx = viewLODBundleList.indexOf(renderBundle)
                            const lodMaterial = this.#LODManager.LODList[targetIdx]?.material || currentMaterial
                            if (this.#prevLodIDX !== targetIdx && lodMaterial.globalFragmentSlotIndex !== undefined && lodMaterial.globalFragmentSlotIndex > -1) {

                                redGPUContext.globalVertexSSBO.updateUintData(
                                    this.#globalVertexSlotIndex,
                                    new Uint32Array([lodMaterial.globalFragmentSlotIndex]),
                                    resourceManager.GLOBAL_VERTEX_STRUCT.members.globalFragmentSlotIndex.uniformOffset / 4
                                );
                                redGPUContext.globalVertexSSBO.flush();
                                this.#prevLodIDX = targetIdx
                            }
                        }
                    }
                    if (currentMaterial.use2PathRender) {
                        bundleListRender2PathLayer[bundleListRender2PathLayer.length] = renderBundle
                    } else if (this['isInstanceofParticle']) {
                        bundleListParticleLayer[bundleListParticleLayer.length] = renderBundle
                    } else if (currentMaterial.transparent) {
                        bundleListTransparentLayer[bundleListTransparentLayer.length] = renderBundle
                        // @ts-ignore
                        renderBundle.mesh = this
                    } else if (currentMaterial.alphaBlend === 2 || currentMaterial.opacity < 1 || !this.depthStencilState.depthWriteEnabled) {
                        bundleListAlphaLayer[bundleListAlphaLayer.length] = renderBundle
                    } else {
                        bundleListBasicList[bundleListBasicList.length] = renderBundle
                    }
                }
            }
            {
                if (this.#eventsNum) {
                    pickingManager.castingList[pickingManager.castingList.length] = this
                }
            }
        } else {
        }
        {
            if (this.castShadow || (this.castShadow && !currentGeometry)) castingList[castingList.length] = this
            if (this.#enableDebugger) this.#drawDebugger.render(renderViewStateData)
        }
        const {children} = this
        let i = 0
        const childNum = children.length
        this.dirtyTransform = false
        for (; i < childNum; i++) {
            const child = children[i]
            if (dirtyTransformForChildren) child.dirtyTransform = dirtyTransformForChildren
            if (dirtyOpacityForChildren) child.dirtyOpacity = dirtyOpacityForChildren
            child.render(renderViewStateData)
        }
    }

    /**
     * [KO] 메시의 GPU 렌더링 정보(VertexGPURenderInfo)를 초기화하고 파이프라인을 갱신합니다.
     * [EN] Initializes the mesh's GPU render info (VertexGPURenderInfo) and updates the pipeline.
     */
    initGPURenderInfos() {
        this.gpuRenderInfo = new VertexGPURenderInfo(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        )
        updateMeshDirtyPipeline(this)
    }

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
    createMeshVertexShaderModuleBASIC = (VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT_BASIC, vertexModuleSource): GPUShaderModule => {
        const {redGPUContext} = this
        const {gpuRenderInfo} = this
        if (gpuRenderInfo.vertexUniformInfo !== UNIFORM_STRUCT_BASIC) {
            gpuRenderInfo.vertexUniformInfo = UNIFORM_STRUCT_BASIC
            gpuRenderInfo.vertexStructInfo = SHADER_INFO
            createMeshVertexUniformBuffers(this)
        }
        gpuRenderInfo.vertexShaderSourceVariant = SHADER_INFO.shaderSourceVariant
        gpuRenderInfo.vertexShaderVariantConditionalBlocks = SHADER_INFO.conditionalBlocks
        gpuRenderInfo.vertexUniformBindGroup = redGPUContext.gpuDevice.createBindGroup(getBasicMeshVertexBindGroupDescriptor(this));
        this.#checkVariant(VERTEX_SHADER_MODULE_NAME)
        return this.gpuRenderInfo.vertexShaderModule
    }

    /**
     * [KO] Mesh 인스턴스를 파기하고 할당된 드로우 커맨드 슬롯, 전역 버퍼 슬롯 및 리소스를 즉시 해제합니다.
     * [EN] Destroys the Mesh instance and immediately releases the allocated draw command slots, global buffer slots, and resources.
     */
    destroy() {
        if (this.#enableWaterInteraction) {
            WaterInteractionRegistry.unregister(this);
            this.#enableWaterInteraction = false;
        }

        super.destroy();

        if (this.#parent) {
            this.#parent.removeChild(this);
            this.#parent = null;
        }

        if (this.#globalVertexSlotIndex !== -1) {
            this.redGPUContext.globalVertexSSBO.freeSlot(this.#globalVertexSlotIndex);
            this.#globalVertexSlotIndex = -1;
        }

        if (this.#drawCommandSlot && this.#drawBufferManager) {
            this.#drawBufferManager.setInstanceNum(this.#drawCommandSlot, 0);
            this.#drawCommandSlot = null;
        }
        if (this.#drawCommandSlot_LODList && this.#drawBufferManager) {
            for (const slot of this.#drawCommandSlot_LODList) {
                if (slot) {
                    this.#drawBufferManager.setInstanceNum(slot, 0);
                }
            }
            this.#drawCommandSlot_LODList = [];
        }
        this.#drawBufferManager = null;

        this.#lodGPURenderInfoList = [];
        this.#bundleEncoderList = [];
        this.#renderBundleList = [];
        this.#renderBundle_LODList = [];
        this.#prevSystemBindGroupList = [];
        this.#prevFragmentBindGroup = null;
        this.#cachedBoundingAABB = null;
        this.#cachedBoundingOBB = null;

        if (this._geometry) {
            // @ts-ignore
            if (typeof this._geometry.destroy === 'function') {
                // @ts-ignore
                this._geometry.destroy();
            }
            this._geometry = null;
        }
        if (this._material) {
            // @ts-ignore
            if (typeof this._material.destroy === 'function') {
                // @ts-ignore
                this._material.destroy();
            }
            this._material = null;
        }

        if (this.animationInfo) {
            this.animationInfo.morphInfo = null;
            this.animationInfo.weightBuffer = null;
            this.animationInfo.jointBuffer = null;
            this.animationInfo.animationsList = null;
            if (this.animationInfo.skinInfo) {
                this.animationInfo.skinInfo.destroy();
                this.animationInfo.skinInfo = null;
            }
        }
        if (this.gltfLoaderInfo) {
            this.gltfLoaderInfo.destroy();
            this.gltfLoaderInfo = null;
        }

        this.#events = {};
        this.#eventsNum = 0;

        console.log(`🧹 Mesh destroy 완료: ${this.name || '무명'}`);
    }

    #updateLODPipeline = () => {

        const {redGPUContext} = this
        const {resourceManager} = redGPUContext
        this.#lodGPURenderInfoList.length = 0;
        const vertexBindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout(
            ResourceManager.PRESET_GLOBAL_VERTEX_GPUBindGroupLayout,
        );

        this.LODManager.LODList.forEach((lod, index) => {
            const vModuleDescriptor: GPUShaderModuleDescriptor = {
                code: lod.source
            };
            const vertexShaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(
                lod.label,
                vModuleDescriptor,
            );
            this.#lodGPURenderInfoList[index] = {
                pipeline: createBasePipeline(
                    //@ts-ignore
                    {
                        vertexStateBuffers: lod.geometry.gpuRenderInfo.buffers,
                        primitiveState: this.primitiveState,
                        depthStencilState: this.depthStencilState,
                        geometry: lod.geometry,
                        material: lod.material || this.material,
                        redGPUContext: redGPUContext,
                        gpuRenderInfo: this.gpuRenderInfo
                    },
                    vertexShaderModule,
                    vertexBindGroupLayout,
                ),
                vertexUniformBindGroup: redGPUContext.gpuDevice.createBindGroup(getBasicMeshVertexBindGroupDescriptor({
                    redGPUContext: redGPUContext,
                    material: lod.material || this.material,
                    //@ts-ignore
                    gpuRenderInfo: {
                        vertexBindGroupLayout,
                        vertexUniformBuffer: this.gpuRenderInfo.vertexUniformBuffer
                    }
                }))
            };
        });
        this.#currentLODIndex = -1;
    }

    #setRenderBundle(renderViewStateData: RenderViewStateData) {
        const {view, viewIndex} = renderViewStateData
        const {redGPUContext} = this
        const {resourceManager} = redGPUContext
        const currentMaterial = this._material
        if (currentMaterial.globalFragmentSlotIndex !== undefined && currentMaterial.globalFragmentSlotIndex > -1) {
            redGPUContext.globalVertexSSBO.updateUintData(
                this.#globalVertexSlotIndex,
                new Uint32Array([currentMaterial.globalFragmentSlotIndex]),
                resourceManager.GLOBAL_VERTEX_STRUCT.members.globalFragmentSlotIndex.uniformOffset / 4
            );
            redGPUContext.globalVertexSSBO.flush();
        }
        this.#prevLodIDX = -1;
        if (this.dirtyLOD) {
            this.#updateLODPipeline()
            this.dirtyLOD = false
        }
        this.#renderBundleList[viewIndex] = this.#createRenderBundle(view, this._geometry, this._material)
        let viewLODBundleList = this.#renderBundle_LODList[viewIndex]
        if (!viewLODBundleList) {
            viewLODBundleList = this.#renderBundle_LODList[viewIndex] = []
        } else {
            viewLODBundleList.length = 0
        }
        this.LODManager.LODList.forEach((lod, index) => {
            const currentMaterial = lod.material || this._material
            viewLODBundleList[index] = this.#createRenderBundle(view, lod.geometry, currentMaterial, index)
        });
    }

    #createRenderBundle(view: View3D, geometry: Geometry | Primitive, material: ABaseMaterial, lodIndex: number = null): GPURenderBundle {
        const {gpuDevice} = this.redGPUContext
        const {renderViewStateData} = view

        const {vertexBuffer, indexBuffer} = geometry
        const {fragmentUniformBindGroup} = material.gpuRenderInfo
        this.#setDrawBuffer(geometry, lodIndex)
        const isLOD = lodIndex !== null
        const bundleEncoder = gpuDevice.createRenderBundleEncoder({
            ...view.basicRenderBundleEncoderDescriptor,
            label: this.uuid,
        })
        if (isLOD) {

        } else {
            this.#bundleEncoderList[renderViewStateData.viewIndex] = bundleEncoder
            this.#prevSystemBindGroupList[renderViewStateData.viewIndex] = view.systemUniform_Vertex_UniformBindGroup
            this.#prevFragmentBindGroup = fragmentUniformBindGroup
        }

        const {gpuBuffer} = vertexBuffer

        const pipeline = isLOD ? this.#lodGPURenderInfoList[lodIndex].pipeline : this.gpuRenderInfo.pipeline
        const vertexUniformBindGroup = isLOD ? this.#lodGPURenderInfoList[lodIndex].vertexUniformBindGroup : this.gpuRenderInfo.vertexUniformBindGroup

        bundleEncoder.setPipeline(pipeline)
        bundleEncoder.setVertexBuffer(0, gpuBuffer)
        // @ts-ignore
        if (this.particleBuffers?.length) {
            // @ts-ignore
            this.particleBuffers.forEach((v, index) => {
                bundleEncoder.setVertexBuffer(index + 1, v)
            })
        }
        bundleEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
        bundleEncoder.setBindGroup(1, vertexUniformBindGroup);
        bundleEncoder.setBindGroup(2, fragmentUniformBindGroup)
        let drawCommandSlot = this.#drawCommandSlot
        if (lodIndex !== null) {
            drawCommandSlot = this.#drawCommandSlot_LODList[lodIndex]
        }
        if (indexBuffer) {
            const {gpuBuffer: indexGPUBuffer, format} = indexBuffer
            bundleEncoder.setIndexBuffer(indexGPUBuffer, format)
            bundleEncoder.drawIndexedIndirect(drawCommandSlot.buffer, drawCommandSlot.commandOffset * 4)
        } else {
            bundleEncoder.drawIndirect(drawCommandSlot.buffer, drawCommandSlot.commandOffset * 4)
        }
        const renderBundle = (bundleEncoder as GPURenderBundleEncoder).finish({
            label: `${this.name}_LOD${lodIndex || 0}`
        });
        // @ts-ignore
        renderBundle.mesh = null
        return renderBundle
    }

    #checkDrawCommandSlot() {
        if (!this.#drawCommandSlot) {
            this.#drawCommandSlot = this.#drawBufferManager.allocateDrawCommand(this.name)
        }
    }

    #setDrawBuffer(geometry: Geometry | Primitive, lodIndex: number = null) {
        const {vertexBuffer, indexBuffer} = geometry
        const drawBufferManager = this.#drawBufferManager
        let drawCommandSlot = this.#drawCommandSlot
        if (lodIndex !== null) {
            if (!this.#drawCommandSlot_LODList[lodIndex]) {
                this.#drawCommandSlot_LODList[lodIndex] = this.#drawBufferManager.allocateDrawCommand(`${this.name}_LOD${lodIndex}`)
            }
            drawCommandSlot = this.#drawCommandSlot_LODList[lodIndex]
        }
        this.#checkDrawCommandSlot()
        if (indexBuffer) {
            const {indexCount} = indexBuffer
            // @ts-ignore
            if (this.particleBuffers) {
                // @ts-ignore
                drawBufferManager.setIndexedIndirectCommand(drawCommandSlot, indexCount, this.particleNum, 0, 0, this.#globalVertexSlotIndex)
            } else {
                drawBufferManager.setIndexedIndirectCommand(drawCommandSlot, indexCount, 1, 0, 0, this.#globalVertexSlotIndex)
            }
        } else {
            const {vertexCount} = vertexBuffer
            drawBufferManager.setIndirectCommand(drawCommandSlot, vertexCount, 1, 0, this.#globalVertexSlotIndex)
        }
    }

    #checkVariant(moduleName: String) {
        const {resourceManager} = this.redGPUContext
        const currentVariantKey = this.#findMatchingVariantKey();
        const variantShaderModuleName = `${moduleName}_${currentVariantKey}`;
        let targetShaderModule = resourceManager.getGPUShaderModule(variantShaderModuleName);
        if (!targetShaderModule) {
            let variantSource = this.gpuRenderInfo.vertexShaderSourceVariant.getVariant(currentVariantKey);
            if (variantSource) {
                targetShaderModule = resourceManager.createGPUShaderModule(
                    `${variantShaderModuleName}`,
                    {code: variantSource}
                );
            } else {
                console.warn('⚠️ 버텍스 바리안트 소스를 찾을 수 없음:', currentVariantKey);
                targetShaderModule = this.gpuRenderInfo.vertexShaderModule;
            }
        } else {
            console.log('🚀 버텍스 바리안트 셰이더 모듈 캐시 히트:', currentVariantKey);
        }
        this.gpuRenderInfo.vertexShaderModule = targetShaderModule;
    }

    #findMatchingVariantKey(): string {
        const {vertexShaderVariantConditionalBlocks} = this.gpuRenderInfo;
        const activeFeatures = new Set<string>();
        for (const uniformName of vertexShaderVariantConditionalBlocks) {
            if (this[uniformName]) {
                activeFeatures.add(uniformName);
            }
        }
        console.log('activeFeatures', activeFeatures, this);
        const variantKey = activeFeatures.size > 0 ?
            Array.from(activeFeatures).sort().join('+') : 'none';
        if (activeFeatures.size) {
            console.log('선택된 바리안트:', variantKey, '(활성 기능:', Array.from(activeFeatures), ')');
        }
        return variantKey;
    }
}

Object.defineProperty(Mesh.prototype, 'isInstanceofMesh', {
    value: true,
    writable: false
});
defineBoolean(Mesh, [
    {key: 'receiveShadow', value: false},
    {key: 'useDisplacementTexture', value: false},
    {key: 'disableJitter', value: false},
])
Object.freeze(Mesh)
export default Mesh