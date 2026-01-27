import GPU_BLEND_FACTOR from "../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../gpuConst/GPU_BLEND_OPERATION";
import consoleAndThrowError from "../utils/consoleAndThrowError";

const BLEND_FACTOR_LIST = Object.values(GPU_BLEND_FACTOR)
const BLEND_OPERATION_LIST = Object.values(GPU_BLEND_OPERATION)

/**
 * [KO] 머티리얼의 색상 및 알파 블렌딩 동작을 제어하는 상태 클래스입니다.
 * [EN] State class that controls color and alpha blending behavior for materials.
 *
 * [KO] 렌더 파이프라인에서 소스와 대상 색상을 어떻게 혼합할지 정의하며, 투명도나 합성 효과를 구현하는 데 사용됩니다.
 * [EN] Defines how source and destination colors are mixed in the render pipeline, used to implement transparency or compositing effects.
 *
 * * ### Example
 * ```typescript
 * const blendState = material.blendState;
 * blendState.operation = RedGPU.GPU_BLEND_OPERATION.ADD;
 * blendState.srcFactor = RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA;
 * blendState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
 * ```
 * @category RenderState
 */
class BlendState {
	/**
	 * [KO] 최종 GPUBlendComponent 상태 객체
	 * [EN] Final GPUBlendComponent state object
	 */
	state: GPUBlendComponent;
	#srcFactor: GPUBlendFactor;
	#dstFactor: GPUBlendFactor;
	#operation: GPUBlendOperation;
	#targetMaterial;

	/**
	 * [KO] BlendState 인스턴스를 생성합니다.
	 * [EN] Creates an instance of BlendState.
	 * 
	 * @param targetMaterial - 
	 * [KO] 블렌드 상태가 적용될 머티리얼 
	 * [EN] Material to which the blend state is applied
	 * @param srcFactor - 
	 * [KO] 소스 블렌드 팩터 
	 * [EN] Source blend factor
	 * @param dstFactor - 
	 * [KO] 대상 블렌드 팩터 
	 * [EN] Destination blend factor
	 * @param operation - 
	 * [KO] 블렌드 연산 
	 * [EN] Blend operation
	 */
	constructor(targetMaterial, srcFactor?: GPUBlendFactor, dstFactor?: GPUBlendFactor, operation?: GPUBlendOperation) {
		this.#targetMaterial = targetMaterial;
		this.srcFactor = srcFactor;
		this.dstFactor = dstFactor;
		this.operation = operation;
	}

	/**
	 * [KO] 블렌드 연산 방식을 가져오거나 설정합니다.
	 * [EN] Gets or sets the blend operation.
	 * 
	 * @returns 
	 * [KO] 현재 설정된 GPUBlendOperation 
	 * [EN] Current GPUBlendOperation
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
	 * [KO] 소스(Source) 블렌드 팩터를 가져오거나 설정합니다.
	 * [EN] Gets or sets the source blend factor.
	 * 
	 * @returns 
	 * [KO] 현재 설정된 GPUBlendFactor 
	 * [EN] Current GPUBlendFactor
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
	 * [KO] 대상(Destination) 블렌드 팩터를 가져오거나 설정합니다.
	 * [EN] Gets or sets the destination blend factor.
	 * 
	 * @returns 
	 * [KO] 현재 설정된 GPUBlendFactor 
	 * [EN] Current GPUBlendFactor
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

	/**
	 * [KO] 내부 상태를 갱신하고 연관된 머티리얼의 파이프라인을 갱신 대상으로 표시합니다.
	 * [EN] Updates the internal state and marks the associated material's pipeline as dirty.
	 * @internal
	 */
	#update() {
		const operationValue = this.#operation ? {operation: this.#operation} : {};
		const srcFactorValue = this.#srcFactor ? {srcFactor: this.#srcFactor} : {};
		const dstFactorValue = this.#dstFactor ? {dstFactor: this.#dstFactor} : {};
		this.state = {...operationValue, ...srcFactorValue, ...dstFactorValue};
		this.#targetMaterial.dirtyPipeline = true;
	}
}

export default BlendState;