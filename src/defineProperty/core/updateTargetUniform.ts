import ResourceManager from "../../resources/core/resourceManager/ResourceManager";


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
    if (target.globalVertexBufferSlotIndex !== undefined && target.globalVertexBufferSlotIndex !== -1) {
        const redGPUContext = target.redGPUContext;
        const memberInfo = ResourceManager.GLOBAL_SSAO_VERTEX_STRUCT.members[propertyKey];
        if (memberInfo) {
            const floatOffset = memberInfo.uniformOffset / 4;
            const isArrayLike = Array.isArray(newValue) || ArrayBuffer.isView(newValue);
            if (memberInfo.View === Uint32Array) {
                const uploadValue = isArrayLike
                    ? (newValue instanceof Uint32Array ? newValue : new Uint32Array(newValue as any))
                    : new Uint32Array([newValue]);
                redGPUContext.globalVertexUniformBuffer.updateUintData(
                    target.globalVertexBufferSlotIndex, uploadValue, floatOffset
                );
            } else {
                const uploadValue = isArrayLike
                    ? (newValue instanceof Float32Array ? newValue : new Float32Array(newValue as any))
                    : new Float32Array([newValue]);
                redGPUContext.globalVertexUniformBuffer.updateFloatData(
                    target.globalVertexBufferSlotIndex, uploadValue, floatOffset
                );
            }

            return
        }

    }

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

    if (targetUniformBuffer && targetUniformInfo && targetUniformInfo.members[propertyKey]) {
        targetUniformBuffer.writeOnlyBuffer(
            targetUniformInfo.members[propertyKey],
            newValue
        );
    }
}
export default updateTargetUniform
