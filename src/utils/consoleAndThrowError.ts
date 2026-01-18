/**
 * [KO] 에러 메시지를 콘솔에 출력하고 예외를 발생시킵니다.
 * [EN] Logs error messages to the console and throws an exception.
 *
 * [KO] 전달된 모든 인자를 공백으로 구분하여 하나의 메시지로 합친 후, 콘솔에 구분선과 함께 출력하고 Error 객체를 throw합니다.
 * [EN] Joins all arguments into a single message separated by spaces, logs it to the console with a separator line, and throws an Error object.
 *
 * * ### Example
 * ```typescript
 * consoleAndThrowError('Invalid', 'parameter', 42);
 * ```
 *
 * @param arg
 * [KO] 출력할 메시지 인자들
 * [EN] Message arguments to log
 *
 * @throws
 * [KO] 합쳐진 메시지를 포함한 Error 객체
 * [EN] Error object containing the joined message
 *
 * @category Utility
 */
const consoleAndThrowError = (...arg: any[]) => {
    const msg = Array.prototype.slice.call(arg).join(' ')
    console.log('//////////////////////////////////////////////////////////')
    console.log(msg)
    throw new Error(msg) ;
}
export default consoleAndThrowError