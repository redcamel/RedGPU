import formatBytes from "../../../utils/math/formatBytes";

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
const getArrayBufferFromSrc = async (
    src: string,
    onLoad: LoaderCallback,
    onError: ErrorCallback = () => {},
    onProgress: ProgressCallback = () => {}
): Promise<void> => {
    try {
        const response = await fetch(src);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        const lengthComputable = total !== 0;
        const totalSizeStr = lengthComputable ? formatBytes(total) : 'Unknown';


        if (!response.body) {
            throw new Error('ReadableStream not supported.');
        }

        const reader = response.body.getReader();
        let loaded = 0;
        const chunks: Uint8Array[] = [];

        // 스트림 읽기 루프
        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            if (value) {
                chunks.push(value);
                loaded += value.length;

                // 프로그레스 콜백 호출
                onProgress({
                    loaded,
                    total,
                    lengthComputable,
                    percent: lengthComputable ? parseFloat(((loaded / total) * 100).toFixed(2)) : 0,
                    transferred: formatBytes(loaded),
                    totalSize: totalSizeStr
                });
            }
        }

        // 모든 청크를 하나의 ArrayBuffer로 합치기
        const allChunks = new Uint8Array(loaded);
        let position = 0;
        for (const chunk of chunks) {
            allChunks.set(chunk, position);
            position += chunk.length;
        }

        onLoad(allChunks.buffer);
    } catch (error) {
        onError(error);
    }
};

export default getArrayBufferFromSrc;