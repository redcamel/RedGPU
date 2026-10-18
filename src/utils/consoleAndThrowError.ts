/**
 * [KO] 전달된 인자들을 공백으로 연결하여 콘솔에 출력한 뒤 `Error`를 던집니다.
 * [EN] Joins the given arguments with spaces, logs them to the console, and throws an `Error`.
 *
 * ### Example
 * ```typescript
 * // [KO] 'Invalid parameter 42' 메시지로 예외 발생
 * // [EN] Throws an exception with the message 'Invalid parameter 42'
 * consoleAndThrowError('Invalid', 'parameter', 42);
 * ```
 *
 * @param arg -
 * [KO] 출력할 메시지 인자 목록
 * [EN] List of message arguments to log
 * @throws
 * [KO] 연결된 메시지를 담은 `Error`
 * [EN] `Error` containing the joined message
 * @category Utility
 */
const consoleAndThrowError = (...arg: any[]) => {
    const msg = Array.prototype.slice.call(arg).join(' ')
    console.log('//////////////////////////////////////////////////////////')
    console.log(msg)
    throw new Error(msg) ;
}
export default consoleAndThrowError