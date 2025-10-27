import GPU_BLEND_FACTOR from "../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../gpuConst/GPU_BLEND_OPERATION";
import consoleAndThrowError from "../utils/consoleAndThrowError";

const BLEND_FACTOR_LIST = Object.values(GPU_BLEND_FACTOR)
const BLEND_OPERATION_LIST = Object.values(GPU_BLEND_OPERATION)

/**
 * 머티리얼(Material)의 GPU 렌더 파이프라인에서 색상 및 알파 블렌딩 동작을 제어하는 상태 객체입니다.
 *
 * BlendState를 통해 머티리얼별로 다양한 블렌드 팩터와 연산을 설정하여, 투명/반투명 효과 및 다양한 합성 효과를 구현할 수 있습니다.
 *
 */
class BlendState {
    /** GPUBlendComponent 상태 객체 */
    state: GPUBlendComponent
    /** 소스 블렌드 팩터 */
    #srcFactor: GPUBlendFactor
    /** 대상 블렌드 팩터 */
    #dstFactor: GPUBlendFactor
    /** 블렌드 연산 */
    #operation: GPUBlendOperation
    /** 연결된 머티리얼 객체 */
    #targetMaterial

    /**
     * BlendState 생성자
     * @param targetMaterial - 블렌드 상태가 적용될 머티리얼 객체
     * @param srcFactor - 소스 블렌드 팩터
     * @param dstFactor - 대상 블렌드 팩터
     * @param operation - 블렌드 연산
     * @category Buffer
     */
    constructor(targetMaterial, srcFactor?: GPUBlendFactor, dstFactor?: GPUBlendFactor, operation?: GPUBlendOperation) {
        this.#targetMaterial = targetMaterial
        this.srcFactor = srcFactor
        this.dstFactor = dstFactor
        this.operation = operation
    }

    /**
     * 블렌드 연산 반환
     * @category Buffer
     */
    get operation(): GPUBlendOperation {
        return this.#operation;
    }

    /**
     * 블렌드 연산 설정
     * @param newOperation - GPUBlendOperation 값
     * @category Buffer
     */
    set operation(newOperation: GPUBlendOperation) {
        if (!BLEND_OPERATION_LIST.includes(newOperation)) {
            consoleAndThrowError(`Invalid GPUBlendOperation: ${newOperation}. Valid operations are ${BLEND_OPERATION_LIST.join(', ')}`);
        }
        this.#operation = newOperation;
        this.#update();
    }

    /**
     * 소스 블렌드 팩터 반환
     * @category Buffer
     */
    get srcFactor(): GPUBlendFactor {
        return this.#srcFactor;
    }

    /**
     * 소스 블렌드 팩터 설정
     * @param newSrcFactor - GPUBlendFactor 값
     * @category Buffer
     */
    set srcFactor(newSrcFactor: GPUBlendFactor) {
        if (!BLEND_FACTOR_LIST.includes(newSrcFactor)) {
            consoleAndThrowError(`Invalid GPUBlendFactor: ${newSrcFactor}. Valid srcFactor factors are ${BLEND_FACTOR_LIST.join(', ')}`);
        }
        this.#srcFactor = newSrcFactor;
        this.#update();
    }

    /**
     * 대상 블렌드 팩터 반환
     * @category Buffer
     */
    get dstFactor(): GPUBlendFactor {
        return this.#dstFactor;
    }

    /**
     * 대상 블렌드 팩터 설정
     * @param newDstFactor - GPUBlendFactor 값
     * @category Buffer
     */
    set dstFactor(newDstFactor: GPUBlendFactor) {
        if (!BLEND_FACTOR_LIST.includes(newDstFactor)) {
            consoleAndThrowError(`Invalid GPUBlendFactor: ${newDstFactor}. Valid dstFactor factors are ${BLEND_FACTOR_LIST.join(', ')}`);
        }
        this.#dstFactor = newDstFactor;
        this.#update();
    }

    /**
     * 내부 상태를 갱신하고, 머티리얼의 파이프라인을 dirty 상태로 표시
     * @private
     * @category Buffer
     */
    #update() {
        const operationValue = this.#operation ? {operation: this.#operation} : {};
        const srcFactorValue = this.#srcFactor ? {srcFactor: this.#srcFactor} : {};
        const dstFactorValue = this.#dstFactor ? {dstFactor: this.#dstFactor} : {};
        this.state = {...operationValue, ...srcFactorValue, ...dstFactorValue};
        this.#targetMaterial.dirtyPipeline = true
    }
}

export default BlendState
