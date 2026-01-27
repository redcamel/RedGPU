import consoleAndThrowError from "../../utils/consoleAndThrowError";

/**
 * [KO] 주어진 값이 RedGPUContext 인스턴스인지 검증합니다.
 * [EN] Validates if the given value is a RedGPUContext instance.
 *
 * [KO] 값의 생성자 이름이 'RedGPUContext'가 아니면 예외를 발생시킵니다.
 * [EN] Throws an exception if the constructor name of the value is not 'RedGPUContext'.
 *
 * * ### Example
 * ```typescript
 * RedGPU.RuntimeChecker.validateRedGPUContext(redGPUContext);
 * ```
 *
 * @param value - 
 * [KO] 검증할 객체 
 * [EN] Value to validate
 * @returns 
 * [KO] RedGPUContext 인스턴스이면 true 
 * [EN] True if the value is a RedGPUContext instance
 * @throws 
 * [KO] RedGPUContext 인스턴스가 아닐 경우 Error 발생 
 * [EN] Throws Error if the value is not a RedGPUContext instance
 * @category Validation
 */
const validateRedGPUContext = (value: any) => {
    if (!(value?.constructor?.name === 'RedGPUContext')) {
        const errorMsg = `from ${value?.constructor?.name} : requires a RedGPUContext instance, but received : ${value}`
        console.log('------ msg ------')
        console.log('but received : ', value)
        consoleAndThrowError(errorMsg)
        return false
    }
    return true
}
export default validateRedGPUContext;