/**
 * [KO] 에러 메시지를 콘솔에 출력하고 예외를 발생시킵니다.
 * [EN] Logs error messages to the console and throws an exception.
 *
 * [KO] 전달된 모든 인자를 합쳐 콘솔에 출력하고 Error를 throw합니다.
 * [EN] Joins all arguments, logs them to the console, and throws an Error.
 *
 * * ### Example
 * ```typescript
 * RedGPU.Util.consoleAndThrowError('Invalid', 'parameter', 42);
 * ```
 *
 * @param arg -
 * [KO] 출력할 메시지 인자들
 * [EN] Message arguments to log
 * @throws
 * [KO] 합쳐진 메시지를 포함한 Error 객체
 * [EN] Error object containing the joined message
 * @category Utility
 */
declare const consoleAndThrowError: (...arg: any[]) => never;
export default consoleAndThrowError;
