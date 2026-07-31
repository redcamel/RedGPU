/**
 * [KO] 빌드 시 제거되지 않는 콘솔 로그 함수입니다.
 * [EN] Console log function that is not removed during build.
 * * ### Example
 * ```typescript
 * RedGPU.Util.keepLog("Important debug message");
 * ```
 * @category Log
 */
const keepLog = console.log.bind(console);

export default keepLog;
