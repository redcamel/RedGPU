/**
 * ArrayBuffer 로딩 성공 시 호출되는 콜백 함수 타입
 */
type LoaderCallback = (buffer: ArrayBuffer) => void;
/**
 * 에러 발생 시 호출되는 콜백 함수 타입
 */
type ErrorCallback = (err: any) => void;
/**
 * 로딩 진행 상태를 추적하는 콜백 함수 타입
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
 * fetch API를 사용하여 지정된 URL에서 ArrayBuffer를 로드하고 진행 상태를 추적합니다.
 * 스트림 완료 후 onLoad가 확실히 호출되도록 구조를 개선했습니다.
 */
declare const getArrayBufferFromSrc: (src: string, onLoad: LoaderCallback, onError?: ErrorCallback, onProgress?: ProgressCallback) => Promise<void>;
export default getArrayBufferFromSrc;
