import formatBytes from "../../../utils/formatBytes";

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
const getArrayBufferFromSrc = async (
    src: string,
    onLoad: LoaderCallback,
    onError: ErrorCallback = () => {
    },
    onProgress: ProgressCallback = () => {
    }
): Promise<void> => {
    try {
        const response = await fetch(src);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        const lengthComputable = total > 0;
        const totalSizeStr = lengthComputable ? formatBytes(total) : 'Unknown';


        if (!response.body) {
            const emptyBuffer = new ArrayBuffer(0);
            onLoad(emptyBuffer);
            return;
        }

        const reader = response.body.getReader();
        let loaded = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
            const {done, value} = await reader.read();

            if (done) break;

            if (value) {
                chunks.push(value);
                loaded += value.length;

                onProgress({
                    loaded,
                    total,
                    lengthComputable,
                    percent: lengthComputable ? Math.min(100, parseFloat(((loaded / total) * 100).toFixed(2))) : 0,
                    transferred: formatBytes(loaded),
                    totalSize: totalSizeStr
                });
            }
        }

        if (loaded === 0) {
            onLoad(new ArrayBuffer(0));
            return;
        }

        const blob = new Blob(chunks as unknown as BlobPart[]);
        const arrayBuffer = await blob.arrayBuffer();

        onLoad(arrayBuffer);

    } catch (error) {
        if (onError) {
            onError(error);
        } else {
            console.error('getArrayBufferFromSrc 로딩 중 오류 발생:', error);
        }
    }
};

export default getArrayBufferFromSrc;