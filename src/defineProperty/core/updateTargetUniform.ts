import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ShaderLibrary from "../../systemCodeManager/ShaderLibrary";

const SHADER_INFO = parseWGSL('VIEW3D_SYSTEM_UNIFORM', ShaderLibrary.SYSTEM_UNIFORM)
const UNIFORM_STRUCT = SHADER_INFO.storage.globalSSAOVertexBuffer.type.format;
/**
 * [KO] 타겟 객체(Material, PostEffect 등)로부터 유니폼 정보와 버퍼를 추출하여 새로운 값을 유니폼 버퍼에 기록하는 내부 유틸리티입니다.
 * [EN] Internal utility that extracts uniform information and buffer from target objects (Material, PostEffect, etc.) and writes the new value to the uniform buffer.
 *
 * @param target - [KO] 유니폼 정보를 추출할 대상 인스턴스 [EN] Target instance to extract uniform information from
 * @param propertyKey - [KO] 업데이트할 유니폼 멤버의 속성 키 [EN] Property key of the uniform member to update
 * @param newValue - [KO] 버퍼에 기록할 새 값 [EN] New value to write to the buffer
 */
const updateTargetUniform = (target: any, propertyKey: string, newValue: any) => {
    let targetUniformInfo;
    let targetUniformBuffer;
    const {gpuRenderInfo} = target
    if (target.globalBufferSlotIndex !== undefined && target.globalBufferSlotIndex !== -1) {
        const redGPUContext = target.redGPUContext;
        const memberInfo = UNIFORM_STRUCT.members[propertyKey];
        const floatOffset = memberInfo.uniformOffset / 4;
        if (memberInfo.View === Uint32Array) {
            redGPUContext.globalSSAOVertexBuffer.updateUintData(
                target.globalBufferSlotIndex, new Uint32Array([newValue]), floatOffset
            );
        } else {
            redGPUContext.globalSSAOVertexBuffer.updateFloatData(
                target.globalBufferSlotIndex, new Float32Array([newValue]), floatOffset
            );
        }

        return
    }

    if (target.isInstanceofMaterial) {
        targetUniformInfo = gpuRenderInfo.fragmentUniformInfo
        targetUniformBuffer = gpuRenderInfo.fragmentUniformBuffer
    } else if (target.isInstanceofPostEffect) {
        targetUniformInfo = target.uniformsInfo
        targetUniformBuffer = target.uniformBuffer
    } else if (gpuRenderInfo?.vertexUniformInfo) {
        targetUniformInfo = gpuRenderInfo.vertexUniformInfo
        targetUniformInfo = targetUniformInfo.members[propertyKey]
        targetUniformBuffer = gpuRenderInfo.vertexUniformBuffer

    }

    if (targetUniformBuffer && targetUniformInfo && targetUniformInfo.members[propertyKey]) {
        targetUniformBuffer.writeOnlyBuffer(
            targetUniformInfo.members[propertyKey],
            newValue
        );
    }
}
export default updateTargetUniform
