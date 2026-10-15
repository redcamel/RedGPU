import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import ABaseMaterial from "./ABaseMaterial";

/**
 * [KO] 텍스처 및 샘플러 기반 머티리얼의 공통 기능을 제공하는 추상 클래스입니다.
 * [EN] Abstract class providing common functionality for texture and sampler-based materials.
 *
 * [KO] 텍스처와 샘플러 교체 시 파이프라인 더티 리스너(DirtyPipelineListener) 등록·해제 및 프래그먼트 상태 갱신을 수행합니다.
 * [EN] Handles registration and removal of pipeline dirty listeners (DirtyPipelineListener) and updates fragment states when textures or samplers are replaced.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Material
 */
abstract class ABitmapBaseMaterial extends ABaseMaterial {
    /**
     * [KO] 프래그먼트 상태 갱신 시 실행되는 텍스처 패킹 콜백 함수 목록
     * [EN] List of texture packing callback functions executed when updating fragment state
     */
    __packingList: any[]

    /**
     * [KO] ABitmapBaseMaterial 인스턴스를 초기화합니다.
     * [EN] Initializes an ABitmapBaseMaterial instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param moduleName -
     * [KO] 머티리얼 모듈 이름
     * [EN] Material module name
     * @param fragmentSource -
     * [KO] 프래그먼트 셰이더 WGSL 소스 코드
     * [EN] Fragment shader WGSL source code
     * @param targetGroupIndex -
     * [KO] 바인드 그룹 타겟 인덱스
     * [EN] Bind group target index
     */
    protected constructor(
        redGPUContext: RedGPUContext,
        moduleName: string,
        fragmentSource: string,
        targetGroupIndex: number
    ) {
        super(redGPUContext, moduleName, fragmentSource, targetGroupIndex)
    }

    /**
     * [KO] 텍스처 변경에 따른 파이프라인 더티 리스너를 교체하고 프래그먼트 상태를 갱신합니다.
     * [EN] Updates pipeline dirty listeners upon texture change and refreshes the fragment state.
     *
     * @param prevTexture -
     * [KO] 이전에 바인딩된 텍스처 객체
     * [EN] Previously bound texture object
     * @param texture -
     * [KO] 새로 바인딩할 텍스처 객체
     * [EN] New texture object to bind
     */
    updateTexture(prevTexture: any, texture: any) {
        if (prevTexture) prevTexture.__removeDirtyPipelineListener(this.#updateFragmentState);
        if (texture) texture.__addDirtyPipelineListener(this.#updateFragmentState);
        this.#updateFragmentState()
    }

    /**
     * [KO] 샘플러 변경에 따른 파이프라인 더티 리스너를 교체하고 프래그먼트 상태를 갱신합니다.
     * [EN] Updates pipeline dirty listeners upon sampler change and refreshes the fragment state.
     *
     * @param prevSampler -
     * [KO] 이전에 바인딩된 Sampler 인스턴스
     * [EN] Previously bound Sampler instance
     * @param newSampler -
     * [KO] 새로 바인딩할 Sampler 인스턴스
     * [EN] New Sampler instance to bind
     */
    updateSampler(prevSampler: Sampler, newSampler: Sampler) {
        if (prevSampler) prevSampler.__removeDirtyPipelineListener(this.#updateFragmentState);
        if (newSampler) newSampler.__addDirtyPipelineListener(this.#updateFragmentState);
        this.#updateFragmentState()
    }

    #updateFragmentState = () => {
        this.dirtyPipeline = true;
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
