import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import MorphInfo_GLTF from "../../../loader/gltf/cls/MorphInfo_GLTF";
import ParsedSkinInfo_GLTF from "../../../loader/gltf/cls/ParsedSkinInfo_GLTF";
import GLTFLoader from "../../../loader/gltf/GLTFLoader";
import {GLTFParsedSingleClip} from "../../../loader/gltf/parsers/animation/parseAnimations";
import DepthStencilState from "../../../renderState/DepthStencilState";
import PrimitiveState from "../../../renderState/PrimitiveState";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import getScreenPoint from "../../../utils/math/coordinates/getScreenPoint";
import localToWorld from "../../../utils/math/coordinates/localToWorld";
import worldToLocal from "../../../utils/math/coordinates/worldToLocal";
import createUUID from "../../../utils/uuid/createUUID";
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
class MeshBase extends Object3DContainer {
    gpuRenderInfo: VertexGPURenderInfo
    animationInfo: {
        morphInfo: MorphInfo_GLTF
        skinInfo: ParsedSkinInfo_GLTF,
        weightBuffer: VertexBuffer,
        jointBuffer: IndexBuffer,
        animationsList: GLTFParsedSingleClip[]
    } = {
        skinInfo: null,
        morphInfo: null,
        weightBuffer: null,
        jointBuffer: null,
        animationsList: null
    }
    gltfLoaderInfo: GLTFLoader
    dirtyPipeline: boolean = true
    dirtyTransform: boolean = true
    dirtyOpacity: boolean = true
    modelMatrix = mat4.create()
    localMatrix = mat4.create()
    normalModelMatrix = mat4.create()
    readonly #redGPUContext: RedGPUContext
    readonly #gpuDevice: GPUDevice
    readonly #primitiveState: PrimitiveState
    readonly #depthStencilState: DepthStencilState
    #currentShaderModuleName: string
    readonly #dirtyListeners: any[] = [];
    #uuid: string = createUUID()

    constructor(redGPUContext: RedGPUContext) {
        super()
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this.#gpuDevice = redGPUContext.gpuDevice
        this.#primitiveState = new PrimitiveState(this)
        this.#depthStencilState = new DepthStencilState(this)
    }

    /**
     * Retrieves the UUID of the object.
     *
     * @returns {string} The UUID of the object.
     */
    get uuid(): string {
        return this.#uuid;
    }

    get currentShaderModuleName(): string {
        return this.#currentShaderModuleName;
    }

    set currentShaderModuleName(value: string) {
        //TODO - 이걸 getter만 허용하게 해야함
        this.#currentShaderModuleName = value;
    }

    get primitiveState(): PrimitiveState {
        return this.#primitiveState;
    }

    get depthStencilState(): DepthStencilState {
        return this.#depthStencilState;
    }

    /** Retrieves the GPU device associated with the current instance.
     *
     * @returns {GPUDevice} The GPU device.
     */
    get gpuDevice(): GPUDevice {
        return this.#gpuDevice;
    }

    /**
     * Retrieves the RedGPUContext instance.
     *
     * @returns {RedGPUContext} The RedGPUContext instance.
     */
    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    worldToLocal(x: number, y: number, z: number): [number, number, number] {
        return worldToLocal(this.modelMatrix, x, y, z)
    }

    localToWorld(x: number, y: number, z: number): [number, number, number] {
        return localToWorld(this.modelMatrix, x, y, z)
    }

    getScreenPoint(view: View3D): [number, number] {
        return getScreenPoint(view, this.modelMatrix)
    }

    /**
     * Fires the dirty listeners list.
     *
     * @param {boolean} [resetList=false] - Indicates whether to reset the dirty listeners list after firing.
     */
    __fireListenerList(resetList: boolean = false) {
        // console.log('this.#dirtyListeners', this, this.#dirtyListeners)
        for (const listener of this.#dirtyListeners) listener(this);
        if (resetList) this.#dirtyListeners.length = 0
    }
}

export default MeshBase
