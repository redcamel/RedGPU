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
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
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
