import getAbsoluteURL from "../../../utils/file/getAbsoluteURL";
import {GLTF} from "../GLTF";
import GLTFLoader, {GLTFLoadingProgressInfo} from "../GLTFLoader";

/**
 * [KO] glTF 버퍼 로딩 진행률을 계산하여 로더의 진행 상태 정보를 갱신합니다.
 * [EN] Calculates glTF buffer loading progress and updates the loader's progress status information.
 *
 * @param gltfLoader -
 * [KO] 대상 GLTF 로더 인스턴스
 * [EN] Target GLTF loader instance
 * @param gltfData -
 * [KO] 파싱된 glTF 데이터 객체
 * [EN] Parsed glTF data object
 * @param loadedBuffers -
 * [KO] 현재까지 로드 완료된 버퍼 개수
 * [EN] Number of buffers loaded so far
 */
const checkProgress = (gltfLoader: GLTFLoader, gltfData: GLTF, loadedBuffers: number) => {
    const buffers = gltfData.buffers
    const totalBuffers = buffers.length;

    gltfLoader.loadingProgressInfo.buffers = {
        loaded: loadedBuffers,
        total: totalBuffers,
        percent: Math.min(100, parseFloat(((loadedBuffers / totalBuffers) * 100).toFixed(2)))
    }
}

/**
 * [KO] glTF 데이터에 정의된 모든 버퍼 리소스를 로드하고 `DataView`로 변환하여 저장합니다.
 * [EN] Loads all buffer resources defined in the glTF data, converts them into `DataView` instances, and stores them.
 *
 * @param gltfLoader -
 * [KO] 대상 GLTF 로더 인스턴스
 * [EN] Target GLTF loader instance
 * @param gltfData -
 * [KO] 파싱된 glTF 데이터 객체
 * [EN] Parsed glTF data object
 * @param callback -
 * [KO] 모든 버퍼 로드가 완료되었을 때 호출될 콜백 함수
 * [EN] Callback function invoked when all buffers have finished loading
 * @param onProgress -
 * [KO] 버퍼 로딩 진행 상태가 갱신될 때 호출될 콜백 함수
 * [EN] Callback function invoked when buffer loading progress updates
 * @category GLTF
 */
const getGLTFBuffersResources = (gltfLoader: GLTFLoader, gltfData: GLTF, callback, onProgress: (info: GLTFLoadingProgressInfo) => void) => {
    const {parsingResult} = gltfLoader
    const {uris} = parsingResult
    const bufferKey = 'buffers';
    const resultContainer = uris[bufferKey]
    const buffers = gltfData.buffers
    const totalBuffers = buffers.length;
    let loadedBuffers = 0;
    checkProgress(gltfLoader, gltfData, loadedBuffers)


    buffers.forEach((buffer, bufferIndex) => {
        buffer['_redURIkey'] = bufferKey;
        buffer['_redURIIndex'] = bufferIndex;
        if (buffer.uri instanceof ArrayBuffer) {
            const uriDataView = new DataView(buffer.uri);
            processArrayBuffer(uriDataView);
        } else processNonArrayBuffer(buffer.uri);

        function processArrayBuffer(uriDataView: DataView) {
            loadedBuffers++;
            resultContainer[bufferIndex] = uriDataView;
            checkLoadingStatus();
        }

        function processNonArrayBuffer(uri: string) {
            const tSrc = uri.startsWith('data:') ? uri : gltfLoader.filePath + uri;
            arrayBufferLoader(
                gltfLoader,
                tSrc,
                function (request) {
                    loadedBuffers++;
                    resultContainer[bufferIndex] = new DataView(request);
                    checkLoadingStatus()
                },
                function (request, error) {
                    console.log(request, error);
                }
            );
        }

        function checkLoadingStatus() {

            checkProgress(gltfLoader, gltfData, loadedBuffers)
            onProgress?.(gltfLoader.loadingProgressInfo);
            if (loadedBuffers === totalBuffers) {
                if (callback) callback();
            }
        }
    });
};
export default getGLTFBuffersResources

/**
 * [KO] URL로부터 `ArrayBuffer`를 비동기로 로드하며, 캐시 매니저를 통해 중복 요청을 방지합니다.
 * [EN] Asynchronously loads an `ArrayBuffer` from a URL and prevents duplicate requests through the cache manager.
 *
 * @param gltfLoader -
 * [KO] 대상 GLTF 로더 인스턴스
 * [EN] Target GLTF loader instance
 * @param url -
 * [KO] 로드할 버퍼 리소스 URL
 * [EN] Buffer resource URL to load
 * @param onSuccess -
 * [KO] 로드 성공 시 호출될 콜백 함수
 * [EN] Callback function invoked on successful load
 * @param onError -
 * [KO] 로드 실패 시 호출될 콜백 함수
 * [EN] Callback function invoked on load failure
 */
const arrayBufferLoader = (gltfLoader: GLTFLoader, url: string, onSuccess, onError) => {
    const {cache, pending} = gltfLoader.redGPUContext.resourceManager.gltfCacheManager.bufferCache;

    url = getAbsoluteURL(window.location.href, url)
    if (cache.has(url)) {
        onSuccess?.(cache.get(url)!);
        return;
    }
    if (pending.has(url)) {
        pending.get(url)!.then(data => onSuccess?.(data)).catch(err => onError?.(err));
        return;
    }
    const promise = fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            return response.arrayBuffer();
        })
        .then(data => {
            cache.set(url, data);
            return data;
        })
        .finally(() => {
            pending.delete(url);
        });
    pending.set(url, promise);
    promise.then(data => onSuccess?.(data)).catch(err => onError?.(err));
};

