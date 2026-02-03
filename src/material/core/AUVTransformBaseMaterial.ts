import RedGPUContext from "../../context/RedGPUContext";
import ABitmapBaseMaterial from "./ABitmapBaseMaterial";

/**
 * [KO] 텍스처 UV 트랜스폼(Offset, Scale) 기능을 제공하는 추상 머티리얼 클래스입니다.
 * [EN] Abstract material class providing texture UV transform (Offset, Scale) functionality.
 *
 * [KO] 이 클래스는 비트맵 기반 머티리얼에서 텍스처의 이동(Offset)과 반복 배율(Scale)을 정밀하게 제어할 수 있는 API를 제공합니다.
 * [EN] This class provides an API for precisely controlling texture translation (Offset) and tiling (Scale) in bitmap-based materials.
 *
 * [KO] 모든 트랜스폼 연산은 버텍스 쉐이더 단계에서 완료되어 렌더링 성능이 최적화됩니다.
 * [EN] All transform calculations are completed at the vertex shader stage to optimize rendering performance.
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
	 * [KO] 텍스처 오프셋 (u, v)
	 * [EN] Texture offset (u, v)
	 */
	get textureOffset(): [number, number] {
		return this.#textureOffset;
	}

	set textureOffset(value: [number, number]) {
		this.dirtyTextureTransform = true;
		this.#textureOffset = value;
	}

	/**
	 * [KO] 텍스처 스케일 (u, v)
	 * [EN] Texture scale (u, v)
	 */
	get textureScale(): [number, number] {
		return this.#textureScale;
	}

	set textureScale(value: [number, number]) {
		this.dirtyTextureTransform = true;
		this.#textureScale = value;
	}

	/**
	 * [KO] AUVTransformBaseMaterial 생성자
	 * [EN] AUVTransformBaseMaterial constructor
	 * @param redGPUContext -
	 * [KO] RedGPUContext 인스턴스
	 * [EN] RedGPUContext instance
	 * @param moduleName -
	 * [KO] 머티리얼 모듈명
	 * [EN] Material module name
	 * @param SHADER_INFO -
	 * [KO] 파싱된 WGSL 쉐이더 정보
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
