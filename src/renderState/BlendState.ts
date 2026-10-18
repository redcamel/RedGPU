import GPU_BLEND_FACTOR from "../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../gpuConst/GPU_BLEND_OPERATION";
import consoleAndThrowError from "../utils/consoleAndThrowError";

const BLEND_FACTOR_LIST = Object.values(GPU_BLEND_FACTOR)
const BLEND_OPERATION_LIST = Object.values(GPU_BLEND_OPERATION)

/**
 * [KO] 머티리얼의 색상 및 알파 블렌딩 동작을 제어하는 렌더 상태 클래스입니다.
 * [EN] Render state class that controls color and alpha blending behavior for materials.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const blendState = material.blendStateColor;
 * blendState.operation = RedGPU.GPU_BLEND_OPERATION.ADD;
 * blendState.srcFactor = RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA;
 * blendState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
 * ```
 *
 * @category RenderState
 */
class BlendState {
    /**
     * [KO] 최종 생성된 `GPUBlendComponent` 상태 객체
     * [EN] Final generated `GPUBlendComponent` state object
     */
    state: GPUBlendComponent;
    #srcFactor: GPUBlendFactor;
    #dstFactor: GPUBlendFactor;
    #operation: GPUBlendOperation;
    #targetMaterial;

    /**
     * [KO] BlendState 인스턴스를 생성합니다.
     * [EN] Creates a BlendState instance.
     *
     * @param targetMaterial -
     * [KO] 블렌드 상태가 적용될 대상 머티리얼
     * [EN] Target material to which the blend state is applied
     * @param srcFactor -
     * [KO] 소스 블렌드 팩터 (기본값: `GPU_BLEND_FACTOR.SRC_ALPHA`)
     * [EN] Source blend factor (default: `GPU_BLEND_FACTOR.SRC_ALPHA`)
     * @param dstFactor -
     * [KO] 대상 블렌드 팩터 (기본값: `GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA`)
     * [EN] Destination blend factor (default: `GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA`)
     * @param operation -
     * [KO] 블렌드 연산 방식 (기본값: `GPU_BLEND_OPERATION.ADD`)
     * [EN] Blend operation mode (default: `GPU_BLEND_OPERATION.ADD`)
     */
    constructor(targetMaterial, srcFactor: GPUBlendFactor = GPU_BLEND_FACTOR.SRC_ALPHA, dstFactor: GPUBlendFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, operation: GPUBlendOperation = GPU_BLEND_OPERATION.ADD) {
        this.#targetMaterial = targetMaterial;
        this.srcFactor = srcFactor;
        this.dstFactor = dstFactor;
        this.operation = operation;
    }

    /**
     * [KO] 블렌드 연산 방식을 반환하거나 설정합니다.
     * [EN] Gets or sets the blend operation mode.
     *
     * @returns
     * [KO] 현재 설정된 `GPUBlendOperation` 값
     * [EN] Currently configured `GPUBlendOperation` value
     */
    get operation(): GPUBlendOperation {
        return this.#operation;
    }

    set operation(newOperation: GPUBlendOperation) {
        if (!BLEND_OPERATION_LIST.includes(newOperation)) {
            consoleAndThrowError(`Invalid GPUBlendOperation: ${newOperation}. Valid operations are ${BLEND_OPERATION_LIST.join(', ')}`);
        }
        this.#operation = newOperation;
        this.#update();
    }

    /**
     * [KO] 소스(Source) 블렌드 팩터를 반환하거나 설정합니다.
     * [EN] Gets or sets the source blend factor.
     *
     * @returns
     * [KO] 현재 설정된 소스 `GPUBlendFactor` 값
     * [EN] Currently configured source `GPUBlendFactor` value
     */
    get srcFactor(): GPUBlendFactor {
        return this.#srcFactor;
    }

    set srcFactor(newSrcFactor: GPUBlendFactor) {
        if (!BLEND_FACTOR_LIST.includes(newSrcFactor)) {
            consoleAndThrowError(`Invalid GPUBlendFactor: ${newSrcFactor}. Valid srcFactor factors are ${BLEND_FACTOR_LIST.join(', ')}`);
        }
        this.#srcFactor = newSrcFactor;
        this.#update();
    }

    /**
     * [KO] 대상(Destination) 블렌드 팩터를 반환하거나 설정합니다.
     * [EN] Gets or sets the destination blend factor.
     *
     * @returns
     * [KO] 현재 설정된 대상 `GPUBlendFactor` 값
     * [EN] Currently configured destination `GPUBlendFactor` value
     */
    get dstFactor(): GPUBlendFactor {
        return this.#dstFactor;
    }

    set dstFactor(newDstFactor: GPUBlendFactor) {
        if (!BLEND_FACTOR_LIST.includes(newDstFactor)) {
            consoleAndThrowError(`Invalid GPUBlendFactor: ${newDstFactor}. Valid dstFactor factors are ${BLEND_FACTOR_LIST.join(', ')}`);
        }
        this.#dstFactor = newDstFactor;
        this.#update();
    }

    #update() {
        const operationValue = this.#operation ? {operation: this.#operation} : {};
        const srcFactorValue = this.#srcFactor ? {srcFactor: this.#srcFactor} : {};
        const dstFactorValue = this.#dstFactor ? {dstFactor: this.#dstFactor} : {};
        this.state = {...operationValue, ...srcFactorValue, ...dstFactorValue};
        this.#targetMaterial.dirtyPipeline = true;
    }
}

export default BlendState;