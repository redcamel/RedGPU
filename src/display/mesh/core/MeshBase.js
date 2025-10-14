import { mat4 } from "gl-matrix";
import DepthStencilState from "../../../renderState/DepthStencilState";
import PrimitiveState from "../../../renderState/PrimitiveState";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import getScreenPoint from "../../../utils/math/coordinates/getScreenPoint";
import localToWorld from "../../../utils/math/coordinates/localToWorld";
import worldToLocal from "../../../utils/math/coordinates/worldToLocal";
import createUUID from "../../../utils/uuid/createUUID";
import Object3DContainer from "./Object3DContainer";
/**
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 */
class MeshBase extends Object3DContainer {
    gpuRenderInfo;
    animationInfo = {
        skinInfo: null,
        morphInfo: null,
        weightBuffer: null,
        jointBuffer: null,
        animationsList: null
    };
    gltfLoaderInfo;
    dirtyPipeline = true;
    dirtyTransform = true;
    dirtyOpacity = true;
    modelMatrix = mat4.create();
    localMatrix = mat4.create();
    normalModelMatrix = mat4.create();
    #redGPUContext;
    #gpuDevice;
    #primitiveState;
    #depthStencilState;
    #currentShaderModuleName;
    #dirtyListeners = [];
    #uuid = createUUID();
    constructor(redGPUContext) {
        super();
        validateRedGPUContext(redGPUContext);
        this.#redGPUContext = redGPUContext;
        this.#gpuDevice = redGPUContext.gpuDevice;
        this.#primitiveState = new PrimitiveState(this);
        this.#depthStencilState = new DepthStencilState(this);
    }
    /**
     * Retrieves the UUID of the object.
     *
     * @returns {string} The UUID of the object.
     */
    get uuid() {
        return this.#uuid;
    }
    get currentShaderModuleName() {
        return this.#currentShaderModuleName;
    }
    set currentShaderModuleName(value) {
        //TODO - 이걸 getter만 허용하게 해야함
        this.#currentShaderModuleName = value;
    }
    get primitiveState() {
        return this.#primitiveState;
    }
    get depthStencilState() {
        return this.#depthStencilState;
    }
    /** Retrieves the GPU device associated with the current instance.
     *
     * @returns {GPUDevice} The GPU device.
     */
    get gpuDevice() {
        return this.#gpuDevice;
    }
    /**
     * Retrieves the RedGPUContext instance.
     *
     * @returns {RedGPUContext} The RedGPUContext instance.
     */
    get redGPUContext() {
        return this.#redGPUContext;
    }
    worldToLocal(x, y, z) {
        return worldToLocal(this.modelMatrix, x, y, z);
    }
    localToWorld(x, y, z) {
        return localToWorld(this.modelMatrix, x, y, z);
    }
    getScreenPoint(view) {
        return getScreenPoint(view, this.modelMatrix);
    }
    /**
     * Fires the dirty listeners list.
     *
     * @param {boolean} [resetList=false] - Indicates whether to reset the dirty listeners list after firing.
     */
    __fireListenerList(resetList = false) {
        // console.log('this.#dirtyListeners', this, this.#dirtyListeners)
        for (const listener of this.#dirtyListeners)
            listener(this);
        if (resetList)
            this.#dirtyListeners.length = 0;
    }
}
export default MeshBase;
