import formatBytes from "../../../utils/formatBytes";

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
            // Body가 없는 경우 즉시 빈 버퍼 반환하여 완료 처리
            const emptyBuffer = new ArrayBuffer(0);
            onLoad(emptyBuffer);
            return;
        }

        const reader = response.body.getReader();
        let loaded = 0;
        const chunks: Uint8Array[] = [];

        // 스트림 읽기 루프
        while (true) {
            const {done, value} = await reader.read();

            if (done) break;

            if (value) {
                chunks.push(value);
                loaded += value.length;

                // 프로그레스 콜백 호출
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

        // 명시적으로 onLoad 호출
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