/**
 * [KO] `ArrayBuffer` 로딩 완료 시 호출되는 콜백 함수 타입입니다.
 * [EN] Callback function type invoked when `ArrayBuffer` loading completes.
 */
type LoaderCallback = (buffer: ArrayBuffer) => void;
/**
 * [KO] 로딩 중 에러 발생 시 호출되는 콜백 함수 타입입니다.
 * [EN] Callback function type invoked when an error occurs during loading.
 */
type ErrorCallback = (err: any) => void;
/**
 * [KO] 로딩 진행 상태를 전달받는 콜백 함수 타입입니다.
 * [EN] Callback function type that receives loading progress status.
 *
 * @category GLTF
 */
export type ProgressCallback = (event: {
    loaded: number;
    total: number;
    lengthComputable: boolean;
    percent: number;
    transferred: string;
    totalSize: string;
}) => void;
/**
 * [KO] 지정된 URL에서 `fetch` 스트림을 통해 `ArrayBuffer`를 로드하고 진행 상태를 추적합니다.
 * [EN] Loads an `ArrayBuffer` from the specified URL via a `fetch` stream and tracks loading progress.
 *
 * @param src -
 * [KO] 로드할 리소스 URL
 * [EN] Resource URL to load
 * @param onLoad -
 * [KO] 로드 완료 시 호출될 콜백 함수
 * [EN] Callback function invoked when loading completes
 * @param onError -
 * [KO] 에러 발생 시 호출될 콜백 함수
 * [EN] Callback function invoked when an error occurs
 * @param onProgress -
 * [KO] 로딩 진행률 갱신 시 호출될 콜백 함수
 * [EN] Callback function invoked when loading progress updates
 * @returns
 * [KO] 로딩 완료를 나타내는 `Promise<void>`
 * [EN] `Promise<void>` representing completion of loading
 * @category GLTF
 */
declare const getArrayBufferFromSrc: (src: string, onLoad: LoaderCallback, onError?: ErrorCallback, onProgress?: ProgressCallback) => Promise<void>;
export default getArrayBufferFromSrc;
