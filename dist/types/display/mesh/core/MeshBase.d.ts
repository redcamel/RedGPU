import { mat4 } from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import MorphInfo_GLTF from "../../../loader/gltf/cls/MorphInfo_GLTF";
import ParsedSkinInfo_GLTF from "../../../loader/gltf/cls/ParsedSkinInfo_GLTF";
import GLTFLoader from "../../../loader/gltf/GLTFLoader";
import { GLTFParsedSingleClip } from "../../../loader/gltf/parsers/animation/parseAnimations";
import DepthStencilState from "../../../renderState/DepthStencilState";
import PrimitiveState from "../../../renderState/PrimitiveState";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import View3D from "../../view/View3D";
import Object3DContainer from "./Object3DContainer";
import VertexGPURenderInfo from "./VertexGPURenderInfo";
/**
 * [KO] Mesh 및 기타 디스플레이 객체의 공통 기능을 정의하는 추상 베이스 클래스입니다.
 * [EN] Abstract base class defining common functionality for Mesh and other display objects.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 기본 클래스입니다.<br/>직접 인스턴스를 생성하여 사용하지 마십시오.
 * [EN] This class is a base class used internally by the system.<br/>Do not create or use instances directly.
 * :::
 *
 * @category Core
 */
declare class MeshBase extends Object3DContainer {
    #private;
    gpuRenderInfo: VertexGPURenderInfo;
    animationInfo: {
        morphInfo: MorphInfo_GLTF;
        skinInfo: ParsedSkinInfo_GLTF;
        weightBuffer: VertexBuffer;
        jointBuffer: IndexBuffer;
        animationsList: GLTFParsedSingleClip[];
    };
    gltfLoaderInfo: GLTFLoader;
    dirtyPipeline: boolean;
    dirtyTransform: boolean;
    dirtyOpacity: boolean;
    modelMatrix: mat4;
    localMatrix: mat4;
    normalModelMatrix: mat4;
    constructor(redGPUContext: RedGPUContext);
    /**
     * Retrieves the UUID of the object.
     *
     * @returns {string} The UUID of the object.
     */
    get uuid(): string;
    get currentShaderModuleName(): string;
    set currentShaderModuleName(value: string);
    get primitiveState(): PrimitiveState;
    get depthStencilState(): DepthStencilState;
    /** Retrieves the GPU device associated with the current instance.
     *
     * @returns {GPUDevice} The GPU device.
     */
    get gpuDevice(): GPUDevice;
    /**
     * Retrieves the RedGPUContext instance.
     *
     * @returns {RedGPUContext} The RedGPUContext instance.
     */
    get redGPUContext(): RedGPUContext;
    worldToLocal(x: number, y: number, z: number): [number, number, number];
    localToWorld(x: number, y: number, z: number): [number, number, number];
    getScreenPoint(view: View3D): [number, number];
    /**
     * Fires the dirty listeners list.
     *
     * @param {boolean} [resetList=false] - Indicates whether to reset the dirty listeners list after firing.
     */
    __fireListenerList(resetList?: boolean): void;
}
export default MeshBase;
