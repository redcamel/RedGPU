
/**
 * [KO] 시스템 유니폼 데이터를 업데이트합니다.
 * [EN] Updates system uniform data.
 *
 * @param targetMembers -
 * [KO] 대상 멤버 정보
 * [EN] Target member information
 * @param uniformDataF32 -
 * [KO] Float32 유니폼 데이터
 * [EN] Float32 uniform data
 * @param uniformDataU32 -
 * [KO] Uint32 유니폼 데이터
 * [EN] Uint32 uniform data
 * @param valueList -
 * [KO] 업데이트할 값 리스트
 * [EN] List of values to update
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
