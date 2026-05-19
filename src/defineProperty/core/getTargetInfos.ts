import ABaseMaterial from "../../material/core/ABaseMaterial";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";

/**
 * [KO] 타겟 객체(Material, PostEffect 등)로부터 유니폼 정보와 버퍼를 추출하는 내부 유틸리티입니다.
 * [EN] Internal utility that extracts uniform information and buffer from target objects (Material, PostEffect, etc.).
 *
 * @param target - [KO] 유니폼 정보를 추출할 대상 인스턴스 [EN] Target instance to extract uniform information from
 * @returns { {targetUniformInfo: any, targetUniformBuffer: any} }
 */
const getTargetInfos = (target: any) => {
    let targetUniformInfo;
    let targetUniformBuffer;
    const {gpuRenderInfo} = target
    if (target instanceof ABaseMaterial) {
        targetUniformInfo = gpuRenderInfo.fragmentUniformInfo
        targetUniformBuffer = gpuRenderInfo.fragmentUniformBuffer
    } else if (target instanceof ASinglePassPostEffect) {
        targetUniformInfo = target.uniformsInfo
        targetUniformBuffer = target.uniformBuffer
    } else if (gpuRenderInfo?.vertexUniformInfo) {
        targetUniformInfo = gpuRenderInfo.vertexUniformInfo
        targetUniformBuffer = gpuRenderInfo.vertexUniformBuffer
    }
    return {targetUniformInfo, targetUniformBuffer}
}
export default getTargetInfos
