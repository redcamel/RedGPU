import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import CubeTexture from "../../resources/texture/CubeTexture";
import HDRTexture from "../../resources/texture/hdr/HDRTexture";
import ANoiseTexture from "../../resources/texture/noiseTexture/core/ANoiseTexture";
import ABaseMaterial from "./ABaseMaterial";

/**
 * [KO] 비트맵/큐브/노이즈 텍스처 기반 머티리얼의 공통 속성 및 기능을 제공하는 추상 클래스입니다.
 * [EN] Abstract class providing common properties and functions for bitmap/cube/noise texture-based materials.
 *
 * [KO] 텍스처/샘플러의 변경 감지 및 파이프라인 갱신, 텍스처 리스너 관리 등 텍스처 기반 머티리얼의 핵심 로직을 구현합니다.
 * [EN] It implements core logic for texture-based materials such as detecting texture/sampler changes, updating pipelines, and managing texture listeners.
 * @category Material
 */
abstract class ABitmapBaseMaterial extends ABaseMaterial {
    /**
     * [KO] 파이프라인 갱신 시 호출되는 콜백 리스트
     * [EN] List of callbacks called when updating the pipeline
     */
    __packingList: any[]

    /**
     * [KO] ABitmapBaseMaterial 인스턴스를 생성합니다.
     * [EN] Creates an ABitmapBaseMaterial instance.
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

    /**
     * [KO] 텍스처 객체 변경 시 DirtyPipeline 리스너를 관리하고 상태를 업데이트합니다.
     * [EN] Manages DirtyPipeline listeners and updates state when the texture object changes.
     * @param prevTexture -
     * [KO] 이전 텍스처 (BitmapTexture|CubeTexture|ANoiseTexture|HDRTexture)
     * [EN] Previous texture (BitmapTexture|CubeTexture|ANoiseTexture|HDRTexture)
     * @param texture -
     * [KO] 새 텍스처 (BitmapTexture|CubeTexture|ANoiseTexture|HDRTexture)
     * [EN] New texture (BitmapTexture|CubeTexture|ANoiseTexture|HDRTexture)
     */
    updateTexture(prevTexture: BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture, texture: BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture) {
        if (prevTexture) prevTexture.__removeDirtyPipelineListener(this.#updateFragmentState);
        if (texture) texture.__addDirtyPipelineListener(this.#updateFragmentState);
        this.#updateFragmentState()
    }

    /**
     * [KO] 샘플러 객체 변경 시 DirtyPipeline 리스너를 관리하고 상태를 업데이트합니다.
     * [EN] Manages DirtyPipeline listeners and updates state when the sampler object changes.
     * @param prevSampler -
     * [KO] 이전 샘플러
     * [EN] Previous sampler
     * @param newSampler -
     * [KO] 새 샘플러
     * [EN] New sampler
     */
    updateSampler(prevSampler: Sampler, newSampler: Sampler) {
        if (prevSampler) prevSampler.__removeDirtyPipelineListener(this.#updateFragmentState);
        if (newSampler) newSampler.__addDirtyPipelineListener(this.#updateFragmentState);
        this.#updateFragmentState()
    }

    /**
     * [KO] 파이프라인 갱신 및 프래그먼트 상태/유니폼을 갱신합니다.
     * [EN] Updates the pipeline and fragment state/uniforms.
     * [KO] 내부적으로 packingList 콜백을 실행하며, 셰이더 모듈 존재 여부에 따라 적절한 갱신 메서드를 호출합니다.
     * [EN] Internally executes packingList callbacks and calls the appropriate update method depending on the existence of the shader module.
     * @private
     */
    #updateFragmentState = () => {
        this.dirtyPipeline = true;
        // console.log('this.__packingList',this.__packingList)
        {
            let i = (this.__packingList || []).length
            while (i--) {
                this.__packingList[i]()
            }
        }
        if (this.gpuRenderInfo?.fragmentShaderModule) this._updateFragmentState()
        else this.initGPURenderInfos();
    }
}

Object.freeze(ABitmapBaseMaterial)
export default ABitmapBaseMaterial
