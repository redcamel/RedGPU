/**
 * ArrayBuffer 로딩 성공 시 호출되는 콜백 함수 타입
 * @callback LoaderCallback
 */
type LoaderCallback = (buffer: ArrayBuffer) => void;
/**
 * 에러 발생 시 호출되는 콜백 함수 타입
 * @callback ErrorCallback
 */
type ErrorCallback = (err: any) => void;
export type LoadingProgressInfo = {
    loaded: number;
    total: number;
    lengthComputable: boolean;
    percent: number;
    transferred: string;
    totalSize: string;
};
/**
 * 로딩 진행 상태를 추적하는 콜백 함수 타입
 * @callback ProgressCallback
 */
export type ProgressCallback = (event: LoadingProgressInfo) => void;
/**
 * fetch API를 사용하여 지정된 URL에서 ArrayBuffer를 로드하고 진행 상태를 추적합니다.
 *
 * @param {string} src - 데이터를 가져올 소스 URL
 * @param {LoaderCallback} onLoad - 성공 시 실행할 콜백
 * @param {ErrorCallback} [onError] - 실패 시 실행할 콜백
 * @param {ProgressCallback} [onProgress] - 로딩 진행 시 실행할 콜백
 * @returns {Promise<void>}
 *
 * @throws {Error} 응답이 성공적이지 않거나 스트림 읽기 중 오류 발생 시 에러를 던집니다.
 */
declare const getArrayBufferFromSrc: (src: string, onLoad: LoaderCallback, onError?: ErrorCallback, onProgress?: ProgressCallback) => Promise<void>;
export default getArrayBufferFromSrc;
