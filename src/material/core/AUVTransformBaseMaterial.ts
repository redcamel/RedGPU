import RedGPUContext from "../../context/RedGPUContext";
import ABitmapBaseMaterial from "./ABitmapBaseMaterial";

/**
 * [KO] 텍스처 UV 트랜스폼(Offset, Scale) 기능을 제공하는 추상 머티리얼 클래스입니다.
 * [EN] Abstract material class providing texture UV transform (Offset, Scale) functionality.
 *
 * [KO] 이 클래스는 비트맵 기반 머티리얼에서 텍스처의 이동(Offset)과 반복 배율(Scale)을 정밀하게 제어할 수 있는 API를 제공합니다.
 * [EN] This class provides an API for precisely controlling texture translation (Offset) and tiling (Scale) in bitmap-based materials.
 *
 * [KO] 모든 트랜스폼 연산은 버텍스 셰이더 단계에서 완료되어 렌더링 성능이 최적화됩니다.
 * [EN] All transform calculations are completed at the vertex shader stage to optimize rendering performance.
 *
 * ### Example
 * ```typescript
 * // AUVTransformBaseMaterial을 상속받은 머티리얼에서 사용 (In material inheriting from AUVTransformBaseMaterial)
 * material.textureOffset = [0.1, 0.1];
 * material.textureScale = [2.0, 2.0];
 * ```
 * <iframe src="/RedGPU/examples/3d/material/uvTransform/" style="width:100%; height:500px;"></iframe>
 *
 * @category Material
 */
abstract class AUVTransformBaseMaterial extends ABitmapBaseMaterial {
	/**
	 * [KO] 텍스처 트랜스폼 변경 여부 플래그
	 * [EN] Texture transform change status flag
	 */
	dirtyTextureTransform: boolean = false

	#textureOffset: [number, number] = [0, 0];
	#textureScale: [number, number] = [1, 1];

	/**
	 * [KO] 텍스처 오프셋 (u, v)을 반환합니다.
	 * [EN] Returns the texture offset (u, v).
	 *
	 * ### Example
	 * ```typescript
	 * material.textureOffset = [0.5, 0.5];
	 * ```
	 */
	get textureOffset(): [number, number] {
		return this.#textureOffset;
	}

	/**
	 * [KO] 텍스처 오프셋 (u, v)을 설정합니다.
	 * [EN] Sets the texture offset (u, v).
	 * @param value - [KO] 오프셋 값 [EN] Offset value
	 */
	set textureOffset(value: [number, number]) {
		this.dirtyTextureTransform = true;
		this.#textureOffset = value;
	}

	/**
	 * [KO] 텍스처 스케일 (u, v)을 반환합니다.
	 * [EN] Returns the texture scale (u, v).
	 *
	 * ### Example
	 * ```typescript
	 * material.textureScale = [2.0, 2.0];
	 * ```
	 */
	get textureScale(): [number, number] {
		return this.#textureScale;
	}

	/**
	 * [KO] 텍스처 스케일 (u, v)을 설정합니다.
	 * [EN] Sets the texture scale (u, v).
	 * @param value - [KO] 스케일 값 [EN] Scale value
	 */
	set textureScale(value: [number, number]) {
		this.dirtyTextureTransform = true;
		this.#textureScale = value;
	}

	/**
	 * [KO] AUVTransformBaseMaterial 인스턴스를 생성합니다.
	 * [EN] Creates an AUVTransformBaseMaterial instance.
	 *
	 * @param redGPUContext -
	 * [KO] RedGPUContext 인스턴스
	 * [EN] RedGPUContext instance
	 * @param moduleName -
	 * [KO] 머티리얼 모듈명
	 * [EN] Material module name
	 * @param SHADER_INFO -
	 * [KO] 파싱된 WGSL 셰이더 정보
	 * [EN] Parsed WGSL shader info
	 * @param targetGroupIndex -
	 * [KO] 바인드 그룹 인덱스
	 * [EN] Bind group index
	 */
	constructor(
		redGPUContext: RedGPUContext,
		moduleName: string,
		SHADER_INFO: any,
		targetGroupIndex: number
	) {
		super(redGPUContext, moduleName, SHADER_INFO, targetGroupIndex)
	}
}

Object.freeze(AUVTransformBaseMaterial)
export default AUVTransformBaseMaterial
