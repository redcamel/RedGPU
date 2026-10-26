/**
 * [KO] 대상 객체(`Material`, `PostEffect` 등)의 유니폼 버퍼 또는 전역 SSBO 슬롯에 변경된 프로퍼티 값을 기록합니다.
 * [EN] Writes the updated property value to the uniform buffer or global SSBO slot of the target object (`Material`, `PostEffect`, etc.).
 *
 * @param target -
 * [KO] 유니폼 데이터를 갱신할 대상 인스턴스
 * [EN] Target instance whose uniform data will be updated
 * @param propertyKey -
 * [KO] 갱신할 유니폼 멤버의 프로퍼티 키 이름
 * [EN] Property key name of the uniform member to update
 * @param newValue -
 * [KO] 버퍼에 기록할 새 값
 * [EN] New value to write to the buffer
 * @category DefineProperty
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
