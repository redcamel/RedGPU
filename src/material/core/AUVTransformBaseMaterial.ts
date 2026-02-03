import RedGPUContext from "../../context/RedGPUContext";
import ABitmapBaseMaterial from "./ABitmapBaseMaterial";

/**
 * [KO] 비트맵/큐브/노이즈 텍스처 기반 머티리얼의 공통 속성 및 기능을 제공하는 추상 클래스입니다.
 * [EN] Abstract class providing common properties and functions for bitmap/cube/noise texture-based materials.
 *
 * [KO] 텍스처/샘플러의 변경 감지 및 파이프라인 갱신, 텍스처 리스너 관리 등 텍스처 기반 머티리얼의 핵심 로직을 구현합니다.
 * [EN] It implements core logic for texture-based materials such as detecting texture/sampler changes, updating pipelines, and managing texture listeners.
 * @category Material
 */
abstract class AUVTransformBaseMaterial extends ABitmapBaseMaterial {

    dirtyTextureTransform: boolean = false

    #textureOffset: [number, number] = [0, 0];
    #textureScale: [number, number] = [1, 1];

    get textureOffset(): [number, number] {
        return this.#textureOffset;
    }

    set textureOffset(value: [number, number]) {
        this.dirtyTextureTransform = true
        this.#textureOffset = value;
    }

    get textureScale(): [number, number] {
        return this.#textureScale;
    }

    set textureScale(value: [number, number]) {
        this.dirtyTextureTransform = true
        this.#textureScale = value;
    }
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
