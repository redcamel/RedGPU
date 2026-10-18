/**
 * [KO] 프로덕션 빌드에서도 제거되지 않도록 `console`에 바인딩된 `console.log` 함수입니다.
 * [EN] A `console.log` function bound to `console` so that it is not stripped in production builds.
 *
 * ### Example
 * ```typescript
 * RedGPU.Util.keepLog('Important debug message');
 * ```
 *
 * @category Log
 */
const keepLog = console.log.bind(console);

export default keepLog;
