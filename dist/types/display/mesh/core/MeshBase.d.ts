import { mat4 } from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import MorphInfo_GLTF from "../../../loader/gltf/cls/MorphInfo_GLTF";
import ParsedSkinInfo_GLTF from "../../../loader/gltf/cls/ParsedSkinInfo_GLTF";
import GLTFLoader from "../../../loader/gltf/GLTFLoader";
import { ClipAnimState } from "../../../loader/gltf/animationLooper/AnimStateMachine";
import DepthStencilState from "../../../renderState/DepthStencilState";
import PrimitiveState from "../../../renderState/PrimitiveState";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import View3D from "../../view/View3D";
import Object3DContainer from "./Object3DContainer";
import VertexGPURenderInfo from "./VertexGPURenderInfo";
/**
 * [KO] Mesh 및 기타 디스플레이 객체의 공통 렌더링 상태와 행렬 변환을 정의하는 기본 클래스입니다.
 * [EN] Base class defining common rendering states and matrix transformations for Mesh and other display objects.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @see [World to local example](/RedGPU/examples/3d/coordinateTransformation/worldToLocal/)
 * @see [Screen to world example](/RedGPU/examples/3d/coordinateTransformation/screenToWorld/)
 * @category Core
 */
declare class MeshBase extends Object3DContainer {
    #private;
    /**
     * [KO] GPU 버텍스 렌더링 정보 객체입니다.
     * [EN] GPU vertex render information object.
     */
    gpuRenderInfo: VertexGPURenderInfo;
    /**
     * [KO] GLTF 모프, 스킨 및 클립 애니메이션 정보입니다.
     * [EN] GLTF morph, skin, and clip animation information.
     */
    animationInfo: {
        morphInfo: MorphInfo_GLTF;
        skinInfo: ParsedSkinInfo_GLTF;
        weightBuffer: VertexBuffer;
        jointBuffer: IndexBuffer;
        animationsList: ClipAnimState[];
    };
    /**
     * [KO] 이 객체를 로드한 GLTFLoader 인스턴스 정보입니다.
     * [EN] GLTFLoader instance information that loaded this object.
     */
    gltfLoaderInfo: GLTFLoader;
    /**
     * [KO] 렌더 파이프라인 갱신이 필요한지 여부입니다.
     * [EN] Whether the render pipeline needs to be updated.
     */
    dirtyPipeline: boolean;
    /**
     * [KO] 트랜스폼 행렬 갱신이 필요한지 여부입니다.
     * [EN] Whether the transform matrix needs to be updated.
     */
    dirtyTransform: boolean;
    /**
     * [KO] 불투명도(Opacity) 갱신이 필요한지 여부입니다.
     * [EN] Whether the opacity needs to be updated.
     */
    dirtyOpacity: boolean;
    /**
     * [KO] 월드 변환이 적용된 모델 행렬입니다.
     * [EN] Model matrix with world transformation applied.
     */
    modelMatrix: mat4;
    /**
     * [KO] 부모 기준 로컬 변환 행렬입니다.
     * [EN] Local transformation matrix relative to the parent.
     */
    localMatrix: mat4;
    /**
     * [KO] 법선 벡터 변환에 사용되는 노멀 모델 행렬입니다.
     * [EN] Normal model matrix used for normal vector transformation.
     */
    normalModelMatrix: mat4;
    /**
     * [KO] MeshBase 인스턴스를 생성합니다.
     * [EN] Creates a MeshBase instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 현재 적용된 버텍스 셰이더 모듈의 이름을 가져오거나 설정합니다.
     * [EN] Gets or sets the name of the currently applied vertex shader module.
     *
     * @returns
     * [KO] 현재 버텍스 셰이더 모듈 이름
     * [EN] Current vertex shader module name
     */
    get currentShaderModuleName(): string;
    set currentShaderModuleName(value: string);
    /**
     * [KO] 객체의 프리미티브 렌더링 상태(`PrimitiveState`)를 반환합니다.
     * [EN] Returns the primitive rendering state (`PrimitiveState`) of the object.
     *
     * @returns
     * [KO] PrimitiveState 인스턴스
     * [EN] PrimitiveState instance
     */
    get primitiveState(): PrimitiveState;
    /**
     * [KO] 객체의 깊이/스텐실 렌더링 상태(`DepthStencilState`)를 반환합니다.
     * [EN] Returns the depth/stencil rendering state (`DepthStencilState`) of the object.
     *
     * @returns
     * [KO] DepthStencilState 인스턴스
     * [EN] DepthStencilState instance
     */
    get depthStencilState(): DepthStencilState;
    /**
     * [KO] 현재 인스턴스에 연결된 WebGPU 디바이스를 반환합니다.
     * [EN] Returns the WebGPU device associated with the current instance.
     *
     * @returns
     * [KO] GPUDevice 인스턴스
     * [EN] GPUDevice instance
     */
    get gpuDevice(): GPUDevice;
    /**
     * [KO] 현재 인스턴스에 연결된 RedGPUContext를 반환합니다.
     * [EN] Returns the RedGPUContext associated with the current instance.
     *
     * @returns
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    get redGPUContext(): RedGPUContext;
    /**
     * [KO] 월드 공간 좌표를 이 객체의 로컬 공간 좌표로 변환합니다.
     * [EN] Converts world space coordinates to this object's local space coordinates.
     *
     * ### Example
     * ```typescript
     * const localPos = mesh.worldToLocal(10, 5, 0);
     * ```
     *
     * @param x -
     * [KO] 월드 X 좌표
     * [EN] World X coordinate
     * @param y -
     * [KO] 월드 Y 좌표
     * [EN] World Y coordinate
     * @param z -
     * [KO] 월드 Z 좌표
     * [EN] World Z coordinate
     * @returns
     * [KO] 변환된 로컬 좌표 `[x, y, z]`
     * [EN] Converted local coordinates `[x, y, z]`
     */
    worldToLocal(x: number, y: number, z: number): [number, number, number];
    /**
     * [KO] 이 객체의 로컬 공간 좌표를 월드 공간 좌표로 변환합니다.
     * [EN] Converts this object's local space coordinates to world space coordinates.
     *
     * ### Example
     * ```typescript
     * const worldPos = mesh.localToWorld(0, 1, 0);
     * ```
     *
     * @param x -
     * [KO] 로컬 X 좌표
     * [EN] Local X coordinate
     * @param y -
     * [KO] 로컬 Y 좌표
     * [EN] Local Y coordinate
     * @param z -
     * [KO] 로컬 Z 좌표
     * [EN] Local Z coordinate
     * @returns
     * [KO] 변환된 월드 좌표 `[x, y, z]`
     * [EN] Converted world coordinates `[x, y, z]`
     */
    localToWorld(x: number, y: number, z: number): [number, number, number];
    /**
     * [KO] 지정된 뷰를 기준으로 이 객체의 2D 화면 좌표를 반환합니다.
     * [EN] Returns the 2D screen coordinates of this object based on the specified view.
     *
     * ### Example
     * ```typescript
     * const screenPos = mesh.getScreenPoint(view3D);
     * ```
     *
     * @param view -
     * [KO] 기준이 되는 View3D 인스턴스
     * [EN] Reference View3D instance
     * @returns
     * [KO] 화면 좌표 `[x, y]`
     * [EN] Screen coordinates `[x, y]`
     */
    getScreenPoint(view: View3D): [number, number];
}
export default MeshBase;
