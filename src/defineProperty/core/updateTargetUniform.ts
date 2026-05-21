/**
 * [KO] 타겟 객체(Material, PostEffect 등)로부터 유니폼 정보와 버퍼를 추출하는 내부 유틸리티입니다.
 * [EN] Internal utility that extracts uniform information and buffer from target objects (Material, PostEffect, etc.).
 *
 * @param target - [KO] 유니폼 정보를 추출할 대상 인스턴스 [EN] Target instance to extract uniform information from

 */
const updateTargetUniform = (target: any, propertyKey: string, newValue: any) => {
    let targetUniformInfo;
    let targetUniformBuffer;
    const {gpuRenderInfo} = target
    if (target.isInstanceofMaterial) {
        targetUniformInfo = gpuRenderInfo.fragmentUniformInfo
        targetUniformBuffer = gpuRenderInfo.fragmentUniformBuffer
    } else if (target.isInstanceofPostEffect) {
        targetUniformInfo = target.uniformsInfo
        targetUniformBuffer = target.uniformBuffer
    } else if (gpuRenderInfo?.vertexUniformInfo) {
        targetUniformInfo = gpuRenderInfo.vertexUniformInfo
        targetUniformBuffer = gpuRenderInfo.vertexUniformBuffer
    }

    if (targetUniformBuffer && targetUniformInfo.members[propertyKey]) {
        targetUniformBuffer.writeOnlyBuffer(
            targetUniformInfo.members[propertyKey],
            newValue
        );
    }
}
export default updateTargetUniform
