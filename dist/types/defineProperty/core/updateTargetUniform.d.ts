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
declare const updateTargetUniform: (target: any, propertyKey: string, newValue: any) => void;
export default updateTargetUniform;
