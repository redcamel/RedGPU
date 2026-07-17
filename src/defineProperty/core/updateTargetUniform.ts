/**
 * [KO] 타겟 객체(Material, PostEffect 등)로부터 유니폼 정보와 버퍼를 추출하여 새로운 값을 유니폼 버퍼에 기록하는 내부 유틸리티입니다.
 * [EN] Internal utility that extracts globalStruct information and buffer from target objects (Material, PostEffect, etc.) and writes the new value to the globalStruct buffer.
 *
 * @param target - [KO] 유니폼 정보를 추출할 대상 인스턴스 [EN] Target instance to extract globalStruct information from
 * @param propertyKey - [KO] 업데이트할 유니폼 멤버의 속성 키 [EN] Property key of the globalStruct member to update
 * @param newValue - [KO] 버퍼에 기록할 새 값 [EN] New value to write to the buffer
 */
const updateTargetUniform = (target: any, propertyKey: string, newValue: any) => {
    let targetUniformInfo;
    let targetUniformBuffer;
    const {gpuRenderInfo, redGPUContext} = target
    const {globalVertexSSBO, globalFragmentSSBO_PBR, globalFragmentSSBO_BuiltIn, resourceManager} = redGPUContext
    const {globalVertexSlotIndex, globalFragmentSlotIndex} = target
    if (globalVertexSlotIndex !== undefined && globalVertexSlotIndex !== -1) {
        const memberInfo = resourceManager.GLOBAL_VERTEX_STRUCT.members[propertyKey];
        if (memberInfo) {
            const floatOffset = memberInfo.uniformOffset / 4;
            const isArrayLike = Array.isArray(newValue) || ArrayBuffer.isView(newValue);
            if (memberInfo.View === Uint32Array) {
                const uploadValue = isArrayLike
                    ? (newValue instanceof Uint32Array ? newValue : new Uint32Array(newValue as any))
                    : new Uint32Array([newValue]);
                globalVertexSSBO.updateUintData(
                    globalVertexSlotIndex, uploadValue, floatOffset
                );
            } else {
                const uploadValue = isArrayLike
                    ? (newValue instanceof Float32Array ? newValue : new Float32Array(newValue as any))
                    : new Float32Array([newValue]);
                globalVertexSSBO.updateFloatData(
                    globalVertexSlotIndex, uploadValue, floatOffset
                );
            }

            return
        }

    }

    if (globalFragmentSlotIndex !== undefined && globalFragmentSlotIndex !== -1) {
        const {members} = target['isPBRMaterial'] ? resourceManager.GLOBAL_FRAGMENT_STRUCT_PBR : target['isBuiltInMaterial'] ? resourceManager.GLOBAL_FRAGMENT_STRUCT_BUILT_IN : target.gpuRenderInfo.fragmentUniformInfo
        const targetFragmentUniformBuffer = target['isPBRMaterial'] ? globalFragmentSSBO_PBR : globalFragmentSSBO_BuiltIn

        const memberInfo = members[propertyKey];
        if (memberInfo) {
            const floatOffset = memberInfo.uniformOffset / 4;
            const isArrayLike = Array.isArray(newValue) || ArrayBuffer.isView(newValue);
            if (memberInfo.View === Uint32Array) {
                const uploadValue = isArrayLike
                    ? (newValue instanceof Uint32Array ? newValue : new Uint32Array(newValue as any))
                    : new Uint32Array([newValue]);
                targetFragmentUniformBuffer.updateUintData(
                    globalFragmentSlotIndex, uploadValue, floatOffset
                );
            } else {
                const uploadValue = isArrayLike
                    ? (newValue instanceof Float32Array ? newValue : new Float32Array(newValue as any))
                    : new Float32Array([newValue]);
                targetFragmentUniformBuffer.updateFloatData(
                    globalFragmentSlotIndex, uploadValue, floatOffset
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
