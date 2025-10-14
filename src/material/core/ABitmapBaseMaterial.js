import ABaseMaterial from "./ABaseMaterial";
/**
 * 비트맵/큐브/노이즈 텍스처 기반 머티리얼의 공통 속성 및 기능을 제공하는 추상 클래스입니다.
 * 텍스처/샘플러의 변경 감지 및 파이프라인 갱신, 텍스처 리스너 관리 등 텍스처 기반 머티리얼의 핵심 로직을 구현합니다.
 *
 * @extends ABaseMaterial
 */
class ABitmapBaseMaterial extends ABaseMaterial {
    /**
     * 파이프라인 갱신 시 호출되는 콜백 리스트
     */
    __packingList;
    /**
     * ABitmapBaseMaterial 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param moduleName - 머티리얼 모듈명
     * @param SHADER_INFO - 파싱된 WGSL 셰이더 정보
     * @param targetGroupIndex - 바인드 그룹 인덱스
     */
    constructor(redGPUContext, moduleName, SHADER_INFO, targetGroupIndex) {
        super(redGPUContext, moduleName, SHADER_INFO, targetGroupIndex);
    }
    /**
     * 텍스처 객체 변경 및 DirtyPipeline 리스너 관리
     * @param prevTexture - 이전 텍스처(BitmapTexture|CubeTexture|ANoiseTexture)
     * @param texture - 새 텍스처(BitmapTexture|CubeTexture|ANoiseTexture)
     */
    updateTexture(prevTexture, texture) {
        if (prevTexture)
            prevTexture.__removeDirtyPipelineListener(this.#updateFragmentState);
        if (texture)
            texture.__addDirtyPipelineListener(this.#updateFragmentState);
        this.#updateFragmentState();
    }
    /**
     * 샘플러 객체 변경 및 DirtyPipeline 리스너 관리
     * @param prevSampler - 이전 샘플러
     * @param newSampler - 새 샘플러
     */
    updateSampler(prevSampler, newSampler) {
        if (prevSampler)
            prevSampler.__removeDirtyPipelineListener(this.#updateFragmentState);
        if (newSampler)
            newSampler.__addDirtyPipelineListener(this.#updateFragmentState);
        this.#updateFragmentState();
    }
    /**
     * 파이프라인 갱신 및 fragmentState/유니폼 갱신
     * 내부적으로 packingList 콜백 실행, fragmentShaderModule 유무에 따라 _updateFragmentState 또는 initGPURenderInfos 호출
     * @private
     */
    #updateFragmentState = () => {
        this.dirtyPipeline = true;
        // console.log('this.__packingList',this.__packingList)
        {
            let i = (this.__packingList || []).length;
            while (i--) {
                this.__packingList[i]();
            }
        }
        if (this.gpuRenderInfo?.fragmentShaderModule)
            this._updateFragmentState();
        else
            this.initGPURenderInfos();
    };
}
Object.freeze(ABitmapBaseMaterial);
export default ABitmapBaseMaterial;
