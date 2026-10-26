/**
 * [KO] 값이 RedGPUContext 인스턴스인지 생성자 이름으로 검증하며, 실패 시 예외를 발생시킵니다.
 * [EN] Validates that the value is a RedGPUContext instance by its constructor name and throws an exception on failure.
 *
 * ### Example
 * ```typescript
 * RedGPU.RuntimeChecker.validateRedGPUContext(redGPUContext);
 * ```
 *
 * @param value -
 * [KO] 검증할 객체
 * [EN] Object to validate
 * @returns
 * [KO] RedGPUContext 인스턴스이면 true
 * [EN] True if the value is a RedGPUContext instance
 * @throws
 * [KO] 생성자 이름이 'RedGPUContext'가 아닌 경우 Error 발생
 * [EN] Throws Error if the constructor name is not 'RedGPUContext'
 * @category Validation
 */
declare const validateRedGPUContext: (value: any) => boolean;
export default validateRedGPUContext;
