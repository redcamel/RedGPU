/**
 * [KO] WGSL 시스템 유니폼 구조체 멤버 오프셋에 맞춰 `Float32Array` 또는 `Uint32Array` 버퍼에 값 목록을 기록합니다.
 * [EN] Writes a list of values into the `Float32Array` or `Uint32Array` buffer according to the WGSL system uniform structure member offsets.
 *
 * @param targetMembers -
 * [KO] 대상 WGSL 구조체 멤버 오프셋 및 뷰 정보
 * [EN] Target WGSL structure member offset and view information
 * @param uniformDataF32 -
 * [KO] 대상 `Float32Array` 유니폼 데이터 버퍼
 * [EN] Target `Float32Array` uniform data buffer
 * @param uniformDataU32 -
 * [KO] 대상 `Uint32Array` 유니폼 데이터 버퍼
 * [EN] Target `Uint32Array` uniform data buffer
 * @param valueList -
 * [KO] 업데이트할 키-값 쌍(`{ key: string, value: any }[]`) 목록
 * [EN] List of key-value pairs (`{ key: string, value: any }[]`) to update
 * @category Renderer
 */
const updateSystemUniformData = (
    targetMembers: any,
    uniformDataF32: Float32Array,
    uniformDataU32: Uint32Array,
    valueList: { key: string, value: any }[]
) => {
    valueList.forEach(({key, value}) => {
        const info = targetMembers[key]
        if (!info) return;
        const dataView = info.View === Float32Array ? uniformDataF32 : uniformDataU32;
        if (info.View) {
            dataView.set(typeof value === 'number' ? [value] : value, info.uniformOffset / info.View.BYTES_PER_ELEMENT)
        }
    })
}

export default updateSystemUniformData;
