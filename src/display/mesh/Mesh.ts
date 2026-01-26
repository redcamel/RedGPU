import {mat4} from "gl-matrix";
import {Function} from "wgsl_reflect";
import {OrthographicCamera} from "../../camera";
import IsometricController from "../../camera/controller/IsometricController";
import RedGPUContext from "../../context/RedGPUContext";
import DefineForVertex from "../../defineProperty/DefineForVertex";
import Geometry from "../../geometry/Geometry";
import {ABaseMaterial} from "../../material/core";
import Primitive from "../../primitive/core/Primitive";
import DrawBufferManager, {DrawCommandSlot} from "../../renderer/core/DrawBufferManager";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import AABB from "../../bound/AABB";
import calculateMeshAABB from "../../bound/math/calculateMeshAABB";
import calculateMeshCombinedAABB from "../../bound/math/calculateMeshCombinedAABB";
import calculateMeshOBB from "../../bound/math/calculateMeshOBB";
import OBB from "../../bound/OBB";
import mat4ToEuler from "../../utils/math/mat4ToEuler";
import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
import uuidToUint from "../../utils/uuid/uuidToUint";
import DrawDebuggerMesh from "../drawDebugger/DrawDebuggerMesh";
import MESH_TYPE from "../MESH_TYPE";
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

const VERTEX_SHADER_MODULE_NAME_PBR_SKIN = 'VERTEX_MODULE_MESH_PBR_SKIN'
const CONVERT_RADIAN = Math.PI / 180;
const CPI = 3.141592653589793, CPI2 = 6.283185307179586, C225 = 0.225, C127 = 1.27323954, C045 = 0.405284735,
    C157 = 1.5707963267948966;
const tempFloat32_1 = new Float32Array(1);
const up = new Float32Array([0, 1, 0]);

interface Mesh {
    receiveShadow: boolean
    disableJitter: boolean
    meshType: string
    useDisplacementTexture: boolean
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
class Mesh extends MeshBase {
	/**
	 * [KO] 메시의 디스플레이스먼트 텍스처
	 * [EN] Displacement texture of the mesh
	 */
	displacementTexture: BitmapTexture;
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
	passFrustumCulling: boolean = true;
	/**
	 * [KO] 커스텀 버텍스 셰이더 모듈 생성 함수
	 * [EN] Function to create custom vertex shader module
	 */
	createCustomMeshVertexShaderModule?: () => GPUShaderModule;
    /**
     * [KO] 인스턴스 고유 ID
     * [EN] Instance unique ID
     */
    #instanceId: number
    /**
     * [KO] 메시 이름
     * [EN] Mesh name
     */
    #name: string
    /**
     * [KO] 부모 객체
     * [EN] Parent object
     */
    #parent: Object3DContainer
    /**
     * [KO] X 좌표
     * [EN] X coordinate
     */
    #x: number = 0
    /**
     * [KO] Y 좌표
     * [EN] Y coordinate
     */
    #y: number = 0
    /**
     * [KO] Z 좌표
     * [EN] Z coordinate
     */
    #z: number = 0
    /**
     * [KO] 위치 배열 [x, y, z]
     * [EN] Position array [x, y, z]
     */
    #positionArray: Float32Array = new Float32Array([0, 0, 0])
    /**
     * [KO] 피벗 X
     * [EN] Pivot X
     */
    #pivotX: number = 0
    /**
     * [KO] 피벗 Y
     * [EN] Pivot Y
     */
    #pivotY: number = 0
    /**
     * [KO] 피벗 Z
     * [EN] Pivot Z
     */
    #pivotZ: number = 0
    /**
     * [KO] 피킹 ID
     * [EN] Picking ID
     */
    readonly #pickingId: number
    /**
     * [KO] X 스케일
     * [EN] X scale
     */
    #scaleX: number = 1
    /**
     * [KO] Y 스케일
     * [EN] Y scale
     */
    #scaleY: number = 1
    /**
     * [KO] Z 스케일
     * [EN] Z scale
     */
    #scaleZ: number = 1
    /**
     * [KO] 스케일 배열 [x, y, z]
     * [EN] Scale array [x, y, z]
     */
    #scaleArray: Float32Array = new Float32Array([1, 1, 1])
    /**
     * [KO] X축 회전 (deg)
     * [EN] X-axis rotation (deg)
     */
    #rotationX: number = 0
    /**
     * [KO] Y축 회전 (deg)
     * [EN] Y-axis rotation (deg)
     */
    #rotationY: number = 0
    /**
     * [KO] Z축 회전 (deg)
     * [EN] Z-axis rotation (deg)
     */
    #rotationZ: number = 0
    /**
     * [KO] 회전 배열 [x, y, z] (deg)
     * [EN] Rotation array [x, y, z] (deg)
     */
    #rotationArray: Float32Array = new Float32Array([0, 0, 0])
    /**
     * [KO] 이벤트 핸들러 객체
     * [EN] Event handler object
     */
    #events: any = {}
    /**
     * [KO] 등록된 이벤트 개수
     * [EN] Number of registered events
     */
    #eventsNum: number = 0
    /**
     * [KO] 프러스텀 컬링 무시 여부
     * [EN] Whether to ignore frustum culling
     */
    #ignoreFrustumCulling: boolean = false
	/**
	 * [KO] 메시 투명도
	 * [EN] Mesh opacity
	 */
	#opacity: number = 1;
	/**
	 * [KO] 디버그 메시 객체
	 * [EN] Debug mesh object
	 */
	#drawDebugger: DrawDebuggerMesh;
	/**
	 * [KO] 디버그 활성화 여부
	 * [EN] Whether to enable debugging
	 */
	#enableDebugger: boolean = false;
	/**
	 * [KO] 캐싱된 AABB
	 * [EN] Cached AABB
	 */
	#cachedBoundingAABB: AABB;
	/**
	 * [KO] 캐싱된 OBB
	 * [EN] Cached OBB
	 */
	#cachedBoundingOBB: OBB;
	/**
	 * [KO] 이전 프레임의 모델 행렬
	 * [EN] Model matrix of the previous frame
	 */
	#prevModelMatrix: Float32Array;
	/**
	 * [KO] 렌더 번들 인코더
	 * [EN] Render bundle encoder
	 */
	#bundleEncoder: GPURenderBundleEncoder;
	/**
	 * [KO] 렌더 번들
	 * [EN] Render bundle
	 */
	#renderBundle: GPURenderBundle;
	#renderBundle_LODList: GPURenderBundle[] = [];
	/**
	 * [KO] 이전 시스템 바인드 그룹
	 * [EN] Previous system bind group
	 */
	#prevSystemBindGroupList: GPUBindGroup[] = [];
	/**
	 * [KO] 이전 프래그먼트 바인드 그룹
	 * [EN] Previous fragment bind group
	 */
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
	constructor(redGPUContext: RedGPUContext, geometry?: Geometry | Primitive, material?, name?: string) {
		super(redGPUContext);
		if (name) this.name = name;
		this._geometry = geometry;
		this._material = material;
		this.#pickingId = uuidToUint(this.uuid);
		this.#drawBufferManager = DrawBufferManager.getInstance(redGPUContext);
		this.#checkDrawCommandSlot();
		this.#LODManager = new LODManager(this, () => {
			this.dirtyLOD = true;
		});
	}

	/**
	 * [KO] LOD(Level of Detail) 매니저를 반환합니다.
	 * [EN] Returns the LOD (Level of Detail) manager.
	 * @returns
	 * [KO] LODManager 인스턴스
	 * [EN] LODManager instance
	 */
	get LODManager(): LODManager {
		return this.#LODManager;
	}

	/**
	 * [KO] 디버거 활성화 여부를 반환합니다.
	 * [EN] Returns whether the debugger is enabled.
	 */
	get enableDebugger(): boolean {
		return this.#enableDebugger;
	}

	/**
	 * [KO] 디버거 활성화 여부를 설정합니다.
	 * [EN] Sets whether the debugger is enabled.
	 * @param value -
	 * [KO] 활성화 여부
	 * [EN] Whether to enable
	 */
	set enableDebugger(value: boolean) {
		this.#enableDebugger = value;
		if (value && !this.#drawDebugger) this.#drawDebugger = new DrawDebuggerMesh(this.redGPUContext, this);
	}

	/**
	 * [KO] 디버그 메시 객체를 반환합니다.
	 * [EN] Returns the debug mesh object.
	 */
	get drawDebugger(): DrawDebuggerMesh {
		return this.#drawDebugger;
	}

	_material;
	/**
	 * [KO] 머티리얼을 반환합니다.
	 * [EN] Returns the material.
	 */
	get material() {
		return this._material;
	}

	/**
	 * [KO] 머티리얼을 설정합니다.
	 * [EN] Sets the material.
	 * @param value -
	 * [KO] 설정할 머티리얼
	 * [EN] Material to set
	 */
	set material(value) {
		this._material = value;
		this.dirtyPipeline = true;
		// blendMode 키가 있는 경우 블렌드 모드 재적용
		if ("blendMode" in this) {
			this.blendMode = this.blendMode;
		}
	}

	_geometry: Geometry | Primitive;
	/**
	 * [KO] 지오메트리를 반환합니다.
	 * [EN] Returns the geometry.
	 */
	get geometry(): Geometry | Primitive {
		return this._geometry;
	}

	/**
	 * [KO] 지오메트리를 설정합니다.
	 * [EN] Sets the geometry.
	 * @param value -
	 * [KO] 설정할 지오메트리
	 * [EN] Geometry to set
	 */
	set geometry(value: Geometry | Primitive) {
		this._geometry = value;
		this.dirtyPipeline = true;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] 메시의 투명도를 반환합니다. (0~1)
	 * [EN] Returns the opacity of the mesh. (0~1)
	 */
	get opacity(): number {
		return this.#opacity;
	}

	/**
	 * [KO] 메시의 투명도를 설정합니다. (0~1)
	 * [EN] Sets the opacity of the mesh. (0~1)
	 * @param value -
	 * [KO] 투명도 값
	 * [EN] Opacity value
	 */
	set opacity(value: number) {
		validatePositiveNumberRange(value, 0, 1);
		this.#opacity = value;
		this.dirtyOpacity = true;
	}

	/**
	 * [KO] 프러스텀 컬링 무시 여부를 반환합니다.
	 * [EN] Returns whether to ignore frustum culling.
	 */
	get ignoreFrustumCulling(): boolean {
		return this.#ignoreFrustumCulling;
	}

	/**
	 * [KO] 프러스텀 컬링 무시 여부를 설정합니다.
	 * [EN] Sets whether to ignore frustum culling.
	 * @param value -
	 * [KO] 무시 여부
	 * [EN] Whether to ignore
	 */
	set ignoreFrustumCulling(value: boolean) {
		this.#ignoreFrustumCulling = value;
	}

	/**
	 * [KO] 피킹 ID를 반환합니다.
	 * [EN] Returns the picking ID.
	 */
	get pickingId(): number {
		return this.#pickingId;
	}

	/**
	 * [KO] 등록된 이벤트들을 반환합니다.
	 * [EN] Returns the registered events.
	 */
	get events(): any {
		return this.#events;
	}

	/**
	 * [KO] 메시의 이름을 반환합니다.
	 * [EN] Returns the name of the mesh.
	 */
	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	/**
	 * [KO] 메시의 이름을 설정합니다.
	 * [EN] Sets the name of the mesh.
	 * @param value -
	 * [KO] 메시 이름
	 * [EN] Mesh name
	 */
	set name(value: string) {
		this.#name = value;
	}

	/**
	 * [KO] 버텍스 상태 버퍼 레이아웃을 반환합니다.
	 * [EN] Returns the vertex state buffer layouts.
	 */
	get vertexStateBuffers(): GPUVertexBufferLayout[] {
		return this._geometry.gpuRenderInfo.buffers;
	}

	/**
	 * [KO] 설정된 부모 객체를 반환합니다.
	 * [EN] Returns the set parent object.
	 */
	get parent(): Object3DContainer {
		return this.#parent;
	}

	/**
	 * [KO] 부모 객체를 설정합니다.
	 * [EN] Sets the parent object.
	 * @param value -
	 * [KO] 부모 컨테이너
	 * [EN] Parent container
	 */
	set parent(value: Object3DContainer) {
		this.#parent = value;
	}

	/**
	 * [KO] 피벗 X 좌표를 반환합니다.
	 * [EN] Returns the pivot X coordinate.
	 */
	get pivotX(): number {
		return this.#pivotX;
	}

	/**
	 * [KO] 피벗 X 좌표를 설정합니다.
	 * [EN] Sets the pivot X coordinate.
	 * @param value -
	 * [KO] X 좌표
	 * [EN] X coordinate
	 */
	set pivotX(value: number) {
		this.#pivotX = value;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] 피벗 Y 좌표를 반환합니다.
	 * [EN] Returns the pivot Y coordinate.
	 */
	get pivotY(): number {
		return this.#pivotY;
	}

	/**
	 * [KO] 피벗 Y 좌표를 설정합니다.
	 * [EN] Sets the pivot Y coordinate.
	 * @param value -
	 * [KO] Y 좌표
	 * [EN] Y coordinate
	 */
	set pivotY(value: number) {
		this.#pivotY = value;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] 피벗 Z 좌표를 반환합니다.
	 * [EN] Returns the pivot Z coordinate.
	 */
	get pivotZ(): number {
		return this.#pivotZ;
	}

	/**
	 * [KO] 피벗 Z 좌표를 설정합니다.
	 * [EN] Sets the pivot Z coordinate.
	 * @param value -
	 * [KO] Z 좌표
	 * [EN] Z coordinate
	 */
	set pivotZ(value: number) {
		this.#pivotZ = value;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] X 위치 좌표를 반환합니다.
	 * [EN] Returns the X position coordinate.
	 */
	get x(): number {
		return this.#x;
	}

	/**
	 * [KO] X 위치 좌표를 설정합니다.
	 * [EN] Sets the X position coordinate.
	 * @param value -
	 * [KO] X 좌표
	 * [EN] X coordinate
	 */
	set x(value: number) {
		this.#x = this.#positionArray[0] = value;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] Y 위치 좌표를 반환합니다.
	 * [EN] Returns the Y position coordinate.
	 */
	get y(): number {
		return this.#y;
	}

	/**
	 * [KO] Y 위치 좌표를 설정합니다.
	 * [EN] Sets the Y position coordinate.
	 * @param value -
	 * [KO] Y 좌표
	 * [EN] Y coordinate
	 */
	set y(value: number) {
		this.#y = this.#positionArray[1] = value;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] Z 위치 좌표를 반환합니다.
	 * [EN] Returns the Z position coordinate.
	 */
	get z(): number {
		return this.#z;
	}

	/**
	 * [KO] Z 위치 좌표를 설정합니다.
	 * [EN] Sets the Z position coordinate.
	 * @param value -
	 * [KO] Z 좌표
	 * [EN] Z coordinate
	 */
	set z(value: number) {
		this.#z = this.#positionArray[2] = value;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] 현재 위치를 반환합니다. [x, y, z]
	 * [EN] Returns the current position. [x, y, z]
	 * @returns
	 * [KO] 위치 배열
	 * [EN] Position array
	 */
	get position(): Float32Array {
		return this.#positionArray;
	}

	/**
	 * [KO] X축 스케일을 반환합니다.
	 * [EN] Returns the X-axis scale.
	 */
	get scaleX(): number {
		return this.#scaleX;
	}

	/**
	 * [KO] X축 스케일을 설정합니다.
	 * [EN] Sets the X-axis scale.
	 * @param value -
	 * [KO] 스케일 값
	 * [EN] Scale value
	 */
	set scaleX(value: number) {
		this.#scaleX = this.#scaleArray[0] = value;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] Y축 스케일을 반환합니다.
	 * [EN] Returns the Y-axis scale.
	 */
	get scaleY(): number {
		return this.#scaleY;
	}

	/**
	 * [KO] Y축 스케일을 설정합니다.
	 * [EN] Sets the Y-axis scale.
	 * @param value -
	 * [KO] 스케일 값
	 * [EN] Scale value
	 */
	set scaleY(value: number) {
		this.#scaleY = this.#scaleArray[1] = value;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] Z축 스케일을 반환합니다.
	 * [EN] Returns the Z-axis scale.
	 */
	get scaleZ(): number {
		return this.#scaleZ;
	}

	/**
	 * [KO] Z축 스케일을 설정합니다.
	 * [EN] Sets the Z-axis scale.
	 * @param value -
	 * [KO] 스케일 값
	 * [EN] Scale value
	 */
	set scaleZ(value: number) {
		this.#scaleZ = this.#scaleArray[2] = value;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] 현재 스케일을 반환합니다. [x, y, z]
	 * [EN] Returns the current scale. [x, y, z]
	 */
	get scale(): Float32Array {
		return this.#scaleArray;
	}

	/**
	 * [KO] X축 회전값을 반환합니다. (도)
	 * [EN] Returns the X-axis rotation value. (degrees)
	 */
	get rotationX(): number {
		return this.#rotationX;
	}

	/**
	 * [KO] X축 회전값을 설정합니다. (도)
	 * [EN] Sets the X-axis rotation value. (degrees)
	 * @param value -
	 * [KO] 회전값
	 * [EN] Rotation value
	 */
	set rotationX(value: number) {
		this.#rotationX = this.#rotationArray[0] = value % 360;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] Y축 회전값을 반환합니다. (도)
	 * [EN] Returns the Y-axis rotation value. (degrees)
	 */
	get rotationY(): number {
		return this.#rotationY;
	}

	/**
	 * [KO] Y축 회전값을 설정합니다. (도)
	 * [EN] Sets the Y-axis rotation value. (degrees)
	 * @param value -
	 * [KO] 회전값
	 * [EN] Rotation value
	 */
	set rotationY(value: number) {
		this.#rotationY = this.#rotationArray[1] = value % 360;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] Z축 회전값을 반환합니다. (도)
	 * [EN] Returns the Z-axis rotation value. (degrees)
	 */
	get rotationZ(): number {
		return this.#rotationZ;
	}

	/**
	 * [KO] Z축 회전값을 설정합니다. (도)
	 * [EN] Sets the Z-axis rotation value. (degrees)
	 * @param value -
	 * [KO] 회전값
	 * [EN] Rotation value
	 */
	set rotationZ(value: number) {
		this.#rotationZ = this.#rotationArray[2] = value % 360;
		this.dirtyTransform = true;
	}

	/**
	 * [KO] 현재 회전값을 반환합니다. [x, y, z] (도)
	 * [EN] Returns the current rotation values. [x, y, z] (degrees)
	 */
	get rotation(): Float32Array {
		return this.#rotationArray;
	}

	/**
	 * [KO] OBB(Oriented Bounding Box) 정보를 반환합니다.
	 * [EN] Returns the OBB (Oriented Bounding Box) information.
	 */
	get boundingOBB(): OBB {
		if (!this.#cachedBoundingOBB || this.dirtyTransform) {
			this.#cachedBoundingOBB = null;
			this.#cachedBoundingAABB = null;
			this.#cachedBoundingOBB = calculateMeshOBB(this);
		}
		return this.#cachedBoundingOBB;
	}

	/**
	 * [KO] AABB(Axis-Aligned Bounding Box) 정보를 반환합니다.
	 * [EN] Returns the AABB (Axis-Aligned Bounding Box) information.
	 */
	get boundingAABB(): AABB {
		if (!this.#cachedBoundingAABB || this.dirtyTransform) {
			this.#cachedBoundingOBB = null;
			this.#cachedBoundingAABB = null;
			this.#cachedBoundingAABB = calculateMeshAABB(this);
		}
		return this.#cachedBoundingAABB;
	}

	/**
	 * [KO] 자식 객체들을 포함한 통합 AABB 정보를 반환합니다.
	 * [EN] Returns the combined AABB information including child objects.
	 */
	get combinedBoundingAABB(): AABB {
		return calculateMeshCombinedAABB(this);
	}

	/**
	 * [KO] 하위 계층의 모든 객체에 디버거 활성화 여부를 설정합니다.
	 * [EN] Sets the debugger visibility for all objects in the hierarchy.
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
	 * [KO] 부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.
	 * [EN] Calculates and returns the combined opacity considering the parent hierarchy.
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
		var tPosition = [];
		var tRotation = [];
		tPosition[0] = targetX;
		tPosition[1] = targetY;
		tPosition[2] = targetZ;
		//out, eye, center, up
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
		// cloneMesh.geometry = this._geometry
		// cloneMesh.material = this._material
		//TODO 추가로 먼가 더해야할것 같으디..
		let i = this.children.length;
		while (i--) {
			cloneMesh.addChild(this.children[i].clone());
		}
		return cloneMesh;
	}

	/**
	 * [KO] 메시를 렌더링합니다.
	 * [EN] Renders the mesh.
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
        } = renderViewStateData
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
                const {pixelRectObject} = view
                const parent = this.parent
                const tLocalMatrix = this.localMatrix;
                let aX, aY, aZ;
                // tLocalMatrix translate
                tLocalMatrix[12] = this.#x;
                tLocalMatrix[13] = this.#y;
                tLocalMatrix[14] = this.#z;
                tLocalMatrix[15] = 1;
                // tLocalMatrix rotate
                aX = this.#rotationX * CONVERT_RADIAN;
                aY = this.#rotationY * CONVERT_RADIAN;
                aZ = this.#rotationZ * CONVERT_RADIAN;
                /////////////////////////
                let aSx, aSy, aSz, aCx, aCy, aCz;
                let b0, b1, b2, b3;
                let b00, b01, b02, b10, b11, b12, b20, b21, b22;
                // sin,cos 관련
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
                /////////////////////////
                b00 = aCy * aCz;
                b01 = aCx * aSz + aSx * aSy * aCz;
                b02 = aSx * aSz - aCx * aSy * aCz;

                b10 = -aCy * aSz;
                b11 = aCx * aCz - aSx * aSy * aSz;
                b12 = aSx * aCz + aCx * aSy * aSz;

                b20 = aSy;
                b21 = -aSx * aCy;
                b22 = aCx * aCy;
                // tLocalMatrix scale
                let sX = this.#scaleX, sY = this.#scaleY, sZ = this.#scaleZ;
                //@ts-ignore
                if (this.renderTextureWidth) {
                    //@ts-ignore
                    sX *= this.renderTextureWidth;
                    //@ts-ignore
                    sY *= this.renderTextureHeight;
                }

// 4. Local Matrix 조립 (Translate + Rotation * Scale)
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
                        // 피봇처리
                        // 매트립스 곱
                        a00 = tLocalMatrix[0], a01 = tLocalMatrix[1], a02 = tLocalMatrix[2], a03 = tLocalMatrix[3],
                            a10 = tLocalMatrix[4], a11 = tLocalMatrix[5], a12 = tLocalMatrix[6], a13 = tLocalMatrix[7],
                            a20 = tLocalMatrix[8], a21 = tLocalMatrix[9], a22 = tLocalMatrix[10], a23 = tLocalMatrix[11],
                            a30 = tLocalMatrix[12], a31 = tLocalMatrix[13], a32 = tLocalMatrix[14], a33 = tLocalMatrix[15],
                            // Cache only the current line of the second matrix
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
                        // mat4.multiply(this.modelMatrix, parent.modelMatrix, this.localMatrix);
                        const p = parent.modelMatrix
                        const l = this.localMatrix
                        const out = this.modelMatrix
                        const a00 = p[0], a01 = p[1], a02 = p[2], a03 = p[3];
                        const a10 = p[4], a11 = p[5], a12 = p[6], a13 = p[7];
                        const a20 = p[8], a21 = p[9], a22 = p[10], a23 = p[11];
                        const a30 = p[12], a31 = p[13], a32 = p[14], a33 = p[15];
                        // Cache only the current line of the second matrix
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
                        // this.modelMatrix = mat4.clone(this.localMatrix)
                        const {modelMatrix, localMatrix} = this
                        modelMatrix[0] = localMatrix[0], modelMatrix[1] = localMatrix[1], modelMatrix[2] = localMatrix[2], modelMatrix[3] = localMatrix[3];
                        modelMatrix[4] = localMatrix[4], modelMatrix[5] = localMatrix[5], modelMatrix[6] = localMatrix[6], modelMatrix[7] = localMatrix[7];
                        modelMatrix[8] = localMatrix[8], modelMatrix[9] = localMatrix[9], modelMatrix[10] = localMatrix[10], modelMatrix[11] = localMatrix[11];
                        modelMatrix[12] = localMatrix[12], modelMatrix[13] = localMatrix[13], modelMatrix[14] = localMatrix[14], modelMatrix[15] = localMatrix[15];
                    }
                }
                // const localMatrix = this.modelMatrix;
                // //
                // mat4.identity(localMatrix)
                // mat4.translate(localMatrix, localMatrix, [this.x, this.y, this.z]);
                // mat4.rotateX(localMatrix, localMatrix, this.rotationX * Math.PI / 180);
                // mat4.rotateY(localMatrix, localMatrix, this.rotationY * Math.PI / 180);
                // mat4.rotateZ(localMatrix, localMatrix, this.rotationZ * Math.PI / 180);
                // mat4.scale(localMatrix, localMatrix, [this.scaleX, this.scaleY, this.scaleZ]);
                // mat4.copy(this.localMatrix, localMatrix);
                // //
                // if (this.parent) {
                //     mat4.multiply(this.modelMatrix, this.parent?.modelMatrix, localMatrix);
                // } else {
                //     mat4.copy(this.modelMatrix, localMatrix);
                // }

            }
            if (!currentGeometry) this.#needUpdateMatrixUniform = false

            this.dirtyTransform = false
            this.#cachedBoundingAABB = null
            this.#cachedBoundingOBB = null
        }
        {
            // 변경시만 이전 모델 메트릭스 업데이트
            if (antialiasingManager.useTAA && this.#uniformDataMatrixList) {

                const {gpuRenderInfo} = this
                const {vertexUniformBuffer, vertexUniformInfo} = gpuRenderInfo
                const {members: vertexUniformInfoMembers} = vertexUniformInfo
                const {members: vertexUniformInfoMatrixListMembers} = vertexUniformInfoMembers.matrixList
                if (this.#prevModelMatrix && vertexUniformInfoMatrixListMembers.prevModelMatrix) {
                    this.#uniformDataMatrixList.set(this.#prevModelMatrix, vertexUniformInfoMatrixListMembers.prevModelMatrix.uniformOffsetForData / Float32Array.BYTES_PER_ELEMENT)
                    if (!this.#needUpdateMatrixUniform) {
                        redGPUContext.gpuDevice.queue.writeBuffer(
                            vertexUniformBuffer.gpuBuffer,
                            vertexUniformInfoMatrixListMembers.prevModelMatrix.uniformOffset,
                            this.#prevModelMatrix,
                        )
                    }
                }
                // 브랜치가 먼가 꼬였네
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
        }
        // check distanceCulling
        let passFrustumCulling = this.passFrustumCulling = true
        let distanceSquared = 0
        const lodList = this.#LODManager.LODList;
        const lodLen = lodList.length;
        if (useDistanceCulling && currentGeometry || this.#LODManager.LODList.length) {
            const {rawCamera} = view
            const aabb = this.boundingAABB;
            // AABB 중심점과 카메라 위치 간의 거리 계산
            const dx = rawCamera.x - aabb.centerX;
            const dy = rawCamera.y - aabb.centerY;
            const dz = rawCamera.z - aabb.centerZ;
            // 거리 제곱 계산
            distanceSquared = dx * dx + dy * dy + dz * dz;
        }
        if (useDistanceCulling && currentGeometry) {
            const geometryRadius = this.boundingAABB.geometryRadius;
            // AABB의 반지름을 고려한 컬링 거리 계산
            const cullingDistanceWithRadius = cullingDistanceSquared + (geometryRadius * geometryRadius);
            if (distanceSquared > cullingDistanceWithRadius) {
                passFrustumCulling = false;
            }
        }
        // check frustumCulling
        if (frustumPlanes && passFrustumCulling && !this.#ignoreFrustumCulling) {
            const {rawCamera} = view
            const combinedAABB = this.boundingAABB;

            const isIsometricController = rawCamera instanceof IsometricController;

            if (isIsometricController) {
                // ==================== AABB 정보 추출 ====================
                const {centerX, centerY, centerZ, geometryRadius: radius} = combinedAABB;

                // ==================== 카메라 정보 추출 ====================
                const orthoCamera = rawCamera as OrthographicCamera;
                const {left, right, top, bottom, nearClipping: near, farClipping: far} = orthoCamera;
                const {x: camX, y: camY, z: camZ} = orthoCamera;

                // ==================== 각도 기반 컬링 ====================
                const cameraAngle = 45;

                if (cameraAngle) {
                    // 상대 좌표 계산
                    const relX = centerX - camX;
                    const relY = centerY - camY;
                    const relZ = centerZ - camZ;

                    // 회전 적용
                    const angleRad = cameraAngle * (Math.PI / 180);
                    const cos = Math.cos(angleRad);
                    const sin = Math.sin(angleRad);

                    const rotatedX = relX * cos + relZ * sin;
                    const rotatedZ = -relX * sin + relZ * cos;

                    // 뷰 범위 확인
                    if (rotatedX + radius < left || rotatedX - radius > right ||
                        relY + radius < bottom || relY - radius > top ||
                        rotatedZ + radius < near || rotatedZ - radius > far) {
                        passFrustumCulling = false;
                    }
                } else {
                    // 각도 없음 (기본 처리)
                    if (centerX + radius < left || centerX - radius > right ||
                        centerY + radius < bottom || centerY - radius > top ||
                        centerZ + radius < near || centerZ - radius > far) {
                        passFrustumCulling = false;
                    }
                }
            } else {
                const frustumPlanes0 = frustumPlanes[0];
                const frustumPlanes1 = frustumPlanes[1];
                const frustumPlanes2 = frustumPlanes[2];
                const frustumPlanes3 = frustumPlanes[3];
                const frustumPlanes4 = frustumPlanes[4];
                const frustumPlanes5 = frustumPlanes[5];

                const centerX = combinedAABB.centerX;
                const centerY = combinedAABB.centerY;
                const centerZ = combinedAABB.centerZ;
                const radius = combinedAABB.geometryRadius;

                frustumPlanes0[0] * centerX + frustumPlanes0[1] * centerY + frustumPlanes0[2] * centerZ + frustumPlanes0[3] <= -radius ? passFrustumCulling = false
                    : frustumPlanes1[0] * centerX + frustumPlanes1[1] * centerY + frustumPlanes1[2] * centerZ + frustumPlanes1[3] <= -radius ? passFrustumCulling = false
                        : frustumPlanes2[0] * centerX + frustumPlanes2[1] * centerY + frustumPlanes2[2] * centerZ + frustumPlanes2[3] <= -radius ? passFrustumCulling = false
                            : frustumPlanes3[0] * centerX + frustumPlanes3[1] * centerY + frustumPlanes3[2] * centerZ + frustumPlanes3[3] <= -radius ? passFrustumCulling = false
                                : frustumPlanes4[0] * centerX + frustumPlanes4[1] * centerY + frustumPlanes4[2] * centerZ + frustumPlanes4[3] <= -radius ? passFrustumCulling = false
                                    : frustumPlanes5[0] * centerX + frustumPlanes5[1] * centerY + frustumPlanes5[2] * centerZ + frustumPlanes5[3] <= -radius ? passFrustumCulling = false : 0;
            }
        }
        if (passFrustumCulling) {
            if (this.gltfLoaderInfo?.activeAnimations?.length) {
                renderViewStateData.animationList[renderViewStateData.animationList.length] = this.gltfLoaderInfo?.activeAnimations
            }
            if (skinInfo) {
                if (!this.currentShaderModuleName.includes(VERTEX_SHADER_MODULE_NAME_PBR_SKIN)) {
                    currentDirtyPipeline = true
                }
                if (this.currentShaderModuleName === `${VERTEX_SHADER_MODULE_NAME_PBR_SKIN}_${skinInfo.joints?.length}`) {
                    renderViewStateData.skinList[renderViewStateData.skinList.length] = this
                    dirtyTransformForChildren = false
                }
            }
        } else {
        }
        this.passFrustumCulling = passFrustumCulling
        // render
        const {displacementTexture, displacementScale} = currentMaterial || {}
        if (currentDirtyPipeline || currentMaterial?.dirtyPipeline || dirtyVertexUniformFromMaterial[currentMaterialUUID]) {
            dirtyVertexUniformFromMaterial[currentMaterialUUID] = true
        }
        // keepLog(this.gpuRenderInfo?.vertexStructInfo)
        if (currentGeometry) {
            renderViewStateData.num3DObjects++
            if (antialiasingManager.changedMSAA) {
                currentDirtyPipeline = true
                this.dirtyLOD = true
            }
            if (!this.gpuRenderInfo) this.initGPURenderInfos()
            const currentUseDisplacementTexture = !!displacementTexture
            if (this.useDisplacementTexture !== currentUseDisplacementTexture) {
                this.useDisplacementTexture = currentUseDisplacementTexture
                currentDirtyPipeline = true
            }
            if (currentDirtyPipeline || dirtyVertexUniformFromMaterial[currentMaterialUUID]) {
                updateMeshDirtyPipeline(this, renderViewStateData)
                this.#bundleEncoder = null
                this.#renderBundle = null

            }
        } else {
            renderViewStateData.num3DGroups++
        }
        if (currentGeometry && passFrustumCulling) {
            const {gpuRenderInfo} = this
            const {vertexUniformBuffer, vertexUniformInfo} = gpuRenderInfo
            const {members: vertexUniformInfoMembers} = vertexUniformInfo
            const {members: vertexUniformInfoMatrixListMembers} = vertexUniformInfoMembers.matrixList
            const {gpuBuffer: vertexUniformGPUBuffer} = vertexUniformBuffer
            if (!this.#uniformDataMatrixList) {
                this.#uniformDataMatrixList = new Float32Array(vertexUniformInfoMembers.matrixList.endOffset / Float32Array.BYTES_PER_ELEMENT)
            }
            {
                if (vertexUniformInfoMembers.displacementScale !== undefined &&
                    this.#displacementScale !== displacementScale
                ) {
                    this.#displacementScale = displacementScale
                    // keepLog('실행을 하나보네',displacementScale)
                    tempFloat32_1[0] = displacementScale
                    gpuDevice.queue.writeBuffer(
                        vertexUniformGPUBuffer,
                        vertexUniformInfoMembers.displacementScale.uniformOffset,
                        // new vertexUniformInfoMembers.displacementScale.View([displacementScale])
                        tempFloat32_1
                    );
                }
            }
            if (this.#needUpdateMatrixUniform) {
                {
                    const modelMatrix = (
                        //TODO - Sprite2D떄문에 처리했지만 이거 일반화해야함
                        // TODO - renderTextureWidth 이놈도 같이 처리해야할듯
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
                    //
                    // gpuDevice.queue.writeBuffer(
                    // 	vertexUniformGPUBuffer,
                    // 	vertexUniformInfoMatrixListMembers.modelMatrix.uniformOffset,
                    // 	modelMatrix
                    // )
                    this.#uniformDataMatrixList.set(modelMatrix, vertexUniformInfoMatrixListMembers.modelMatrix.uniformOffsetForData / Float32Array.BYTES_PER_ELEMENT)
                }
                {
                    if (this.#needUpdateNormalMatrixUniform && vertexUniformInfoMatrixListMembers.normalModelMatrix) {
                        this.#needUpdateNormalMatrixUniform = false
                        // calculate NormalMatrix
                        const m = this.modelMatrix;
                        const n = this.normalModelMatrix;
                        const a00 = m[0], a01 = m[1], a02 = m[2];
                        const a10 = m[4], a11 = m[5], a12 = m[6];
                        const a20 = m[8], a21 = m[9], a22 = m[10];
                        const det = a00 * (a11 * a22 - a12 * a21) - a01 * (a10 * a22 - a12 * a20) + a02 * (a10 * a21 - a11 * a20);
                        if (det === 0) {
                            // 역행렬 없음 → 단위 행렬로 대체
                            n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 1, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 1, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1;
                        } else {
                            const invDet = 1 / det;
                            // 역행렬의 전치 (transpose of inverse)
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
                            // 하단 행은 단위 행렬처럼 설정
                            n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1;
                        }
                    }
                    // gpuDevice.queue.writeBuffer(
                    // 	vertexUniformGPUBuffer,
                    // 	vertexUniformInfoMatrixListMembers.normalModelMatrix.uniformOffset,
                    // 	// new vertexUniformInfoMatrixListMembers.normalModelMatrix.View(this.normalModelMatrix),
                    // 	this.normalModelMatrix as Float32Array
                    // )
                    this.#uniformDataMatrixList.set(this.normalModelMatrix, vertexUniformInfoMatrixListMembers.normalModelMatrix.uniformOffsetForData / Float32Array.BYTES_PER_ELEMENT)
                }
                if (vertexUniformInfoMatrixListMembers.localMatrix) {
                    // gpuDevice.queue.writeBuffer(
                    // 	vertexUniformGPUBuffer,
                    // 	vertexUniformInfoMatrixListMembers.localMatrix.uniformOffset,
                    // 	// new vertexUniformInfoMatrixListMembers.localMatrix.View(this.localMatrix),
                    // 	this.localMatrix as Float32Array
                    // )
                    this.#uniformDataMatrixList.set(this.localMatrix, vertexUniformInfoMatrixListMembers.localMatrix.uniformOffsetForData / Float32Array.BYTES_PER_ELEMENT)
                }
                dirtyTransformForChildren = true
                this.#needUpdateMatrixUniform = false
                // keepLog('진짜 버퍼업로드', this.name)
                gpuDevice.queue.writeBuffer(
                    vertexUniformGPUBuffer,
                    vertexUniformInfoMembers.matrixList.startOffset,
                    this.#uniformDataMatrixList
                )
            }
            if (this.dirtyOpacity) {
                dirtyOpacityForChildren = true
                if (vertexUniformInfoMembers.combinedOpacity) {
                    tempFloat32_1[0] = this.getCombinedOpacity()
                    gpuDevice.queue.writeBuffer(
                        vertexUniformGPUBuffer,
                        vertexUniformInfoMembers.combinedOpacity.uniformOffset,
                        // new vertexUniformInfoMembers.combinedOpacity.View([this.getCombinedOpacity()])
                        tempFloat32_1
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
            } = renderViewStateData
            {
                {
                    const {fragmentUniformBindGroup} = currentMaterial.gpuRenderInfo
                    if (
                        !this.#bundleEncoder
                        || currentDirtyPipeline
                        || this.#prevFragmentBindGroup !== fragmentUniformBindGroup
                        || this.#prevSystemBindGroupList[renderViewStateData.viewIndex] !== view.systemUniform_Vertex_UniformBindGroup
                        || this.dirtyLOD
                    ) {
                        this.#setRenderBundle(renderViewStateData)
                    }

                    renderViewStateData.numDrawCalls++
                    if (currentGeometry.indexBuffer) {
                        const {indexBuffer} = currentGeometry
                        const {indexCount, triangleCount} = indexBuffer
                        renderViewStateData.numTriangles += triangleCount
                        renderViewStateData.numPoints += indexCount
                    } else {
                        const {vertexBuffer} = currentGeometry
                        const {vertexCount, triangleCount} = vertexBuffer
                        renderViewStateData.numTriangles += triangleCount;
                        renderViewStateData.numPoints += vertexCount
                    }
                    let renderBundle = this.#renderBundle;
                    {
                        if (lodLen) {
                            let idx = this.#currentLODIndex;

                            // 인덱스 범위 검증 수정
                            if (idx < 0 || idx >= lodLen) {
                                idx = -1;
                            }

                            let needUpdate = false;

                            if (idx === -1) {
                                // 기본 번들 → 첫 LOD 경계 체크
                                if (distanceSquared >= lodList[0].distanceSquared) {
                                    needUpdate = true;
                                }
                            } else if (idx === lodLen - 1) {
                                // 마지막 LOD → 아래로 내려가는지 체크
                                if (distanceSquared < lodList[idx].distanceSquared) {
                                    needUpdate = true;
                                }
                            } else {
                                // 중간 LOD
                                const lowerBoundary = lodList[idx].distanceSquared;
                                const upperBoundary = lodList[idx + 1].distanceSquared;
                                if (distanceSquared < lowerBoundary || distanceSquared >= upperBoundary) {
                                    needUpdate = true;
                                }
                            }

                            if (needUpdate) {
                                // LOD 인덱스 재계산
                                let newIdx = -1;
                                for (let i = 0; i < lodLen; i++) {
                                    if (distanceSquared >= lodList[i].distanceSquared) {
                                        newIdx = i;
                                    } else {
                                        break;
                                    }
                                }

                                // 인덱스 업데이트 및 번들 선택
                                if (newIdx !== idx) {
                                    this.#currentLODIndex = newIdx;
                                    if (newIdx >= 0 && newIdx < lodLen) {
                                        renderBundle = this.#renderBundle_LODList[newIdx];
                                    }
                                    // newIdx가 -1이면 기본 renderBundle 사용 (이미 설정됨)
                                }
                            } else if (idx >= 0 && idx < lodLen) {
                                // 현재 LOD 유지
                                renderBundle = this.#renderBundle_LODList[idx];
                            }
                        }
                    }
                    if (currentMaterial.use2PathRender) {
                        bundleListRender2PathLayer[bundleListRender2PathLayer.length] = renderBundle
                    } else if (this.meshType === MESH_TYPE.PARTICLE) {
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
        // children render
        const {children} = this
        let i = 0
        const childNum = children.length
        // while (i--) {
        this.dirtyTransform = false
        for (; i < childNum; i++) {
            const child = children[i]
            if (dirtyTransformForChildren) child.dirtyTransform = dirtyTransformForChildren
            if (dirtyOpacityForChildren) child.dirtyOpacity = dirtyOpacityForChildren
            child.render(renderViewStateData)
        }
    }

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

    #normalizeRotationDelta(prevAngle: number, newAngle: number): number {
        let delta = newAngle - prevAngle;

        // delta가 180도보다 크면 반대 방향으로 회전
        while (delta > 180) delta -= 360;
        while (delta < -180) delta += 360;

        return prevAngle + delta;
    }

    #updateLODPipeline = () => {

        const {gpuDevice, redGPUContext} = this
        const {resourceManager} = redGPUContext
        this.#lodGPURenderInfoList.length = 0;
        const vertexBindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout(
            ResourceManager.PRESET_VERTEX_GPUBindGroupLayout,
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
        const {view} = renderViewStateData
        this.#renderBundle = this.#createRenderBundle(view, this._geometry, this._material)
        if (this.dirtyLOD) {
            this.#updateLODPipeline()
            this.dirtyLOD = false
        }
        this.#renderBundle_LODList.length = 0;
        this.LODManager.LODList.forEach((lod, index) => {
            this.#renderBundle_LODList[index] = this.#createRenderBundle(view, lod.geometry, lod.material || this._material, index)
        });
        // keepLog('렌더번들갱신', this.name)
        // keepLog(this.#renderBundle_LODList)
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
            this.#bundleEncoder = bundleEncoder
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
        //
        let drawCommandSlot = this.#drawCommandSlot
        if (lodIndex !== null) {
            drawCommandSlot = this.#drawCommandSlot_LODList[lodIndex]
            // keepLog('걸리냐',lodIndex,this.#LODManager.LODList[lodIndex])
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
                drawBufferManager.setIndexedIndirectCommand(drawCommandSlot, indexCount, this.particleNum, 0, 0, 0)
            } else {
                drawBufferManager.setIndexedIndirectCommand(drawCommandSlot, indexCount, 1, 0, 0, 0)
                // {
                //     const data = this.#drawCommandSlot.dataArray
                //     const offset = this.#drawCommandSlot.commandOffset
                //     keepLog(`📊 드로우 데이터 설정: ${this.name}`, {
                //         indexCount,
                //         actualData: [data[offset], data[offset + 1], data[offset + 2], data[offset + 3], data[offset + 4]]
                //     })
                // }
            }
        } else {
            const {vertexCount} = vertexBuffer
            drawBufferManager.setIndirectCommand(drawCommandSlot, vertexCount, 1, 0, 0)
        }
    }

    #checkVariant(moduleName: String) {
        const {gpuDevice, resourceManager} = this.redGPUContext
        // 현재 머티리얼 상태에 맞는 바리안트 키 찾기
        const currentVariantKey = this.#findMatchingVariantKey();
        // 바리안트별 셰이더 모듈 확인/생성
        const variantShaderModuleName = `${moduleName}_${currentVariantKey}`;
        let targetShaderModule = resourceManager.getGPUShaderModule(variantShaderModuleName);
        if (!targetShaderModule) {
            // 레이지 바리안트 생성기에서 바리안트 소스 코드 가져오기
            let variantSource = this.gpuRenderInfo.vertexShaderSourceVariant.getVariant(currentVariantKey);
            if (variantSource) {
                // keepLog('버텍스 바리안트 셰이더 모듈 생성:', currentVariantKey, variantShaderModuleName);
                if (this.animationInfo?.skinInfo) {
                    const jointNum = `${this.animationInfo.skinInfo.joints.length}`
                    variantSource = variantSource.replaceAll('#JOINT_NUM', jointNum)
                    this.gpuRenderInfo.vertexShaderSourceVariant.getVariant(currentVariantKey)
                    targetShaderModule = resourceManager.createGPUShaderModule(
                        `${variantShaderModuleName}_${jointNum}`,
                        {code: variantSource}
                    );
                } else {
                    targetShaderModule = resourceManager.createGPUShaderModule(
                        variantShaderModuleName,
                        {code: variantSource}
                    );
                }
            } else {
                console.warn('⚠️ 버텍스 바리안트 소스를 찾을 수 없음:', currentVariantKey);
                targetShaderModule = this.gpuRenderInfo.vertexShaderModule; // 기본값 사용
            }
        } else {
            console.log('🚀 버텍스 바리안트 셰이더 모듈 캐시 히트:', currentVariantKey);
        }
        // 셰이더 모듈 업데이트
        this.gpuRenderInfo.vertexShaderModule = targetShaderModule;
    }

    #findMatchingVariantKey(): string {
        const {vertexShaderVariantConditionalBlocks} = this.gpuRenderInfo;
        // keepLog(this.gpuRenderInfo, vertexShaderVariantConditionalBlocks)
        // 현재 활성화된 기능들 확인 (vertexShaderVariantConditionalBlocks 기반)
        const activeFeatures = new Set<string>();
        // keepLog('vertexShaderVariantConditionalBlocks', vertexShaderVariantConditionalBlocks, this)
        // 실제 셰이더에서 발견된 조건부 블록들만 체크
        for (const uniformName of vertexShaderVariantConditionalBlocks) {
            if (this[uniformName]) {
                activeFeatures.add(uniformName);
            }
        }
        console.log('activeFeatures', activeFeatures, this);
        // 활성화된 기능들로부터 바리안트 키 생성
        const variantKey = activeFeatures.size > 0 ?
            Array.from(activeFeatures).sort().join('+') : 'none';
        if (activeFeatures.size) {
            console.log('선택된 바리안트:', variantKey, '(활성 기능:', Array.from(activeFeatures), ')');
        }
        return variantKey;
    }
}

Object.defineProperty(Mesh.prototype, 'meshType', {
    value: MESH_TYPE.MESH,
    writable: false
});
DefineForVertex.defineByPreset(Mesh, [
    DefineForVertex.PRESET_BOOLEAN.RECEIVE_SHADOW
])
DefineForVertex.defineBoolean(Mesh, [
    ['useDisplacementTexture', false],
    ['disableJitter', false],
])
Object.freeze(Mesh)
export default Mesh
