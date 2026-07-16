import getAbsoluteURL from "../../../utils/file/getAbsoluteURL";
import {GLTF} from "../GLTF";
import GLTFLoader, {GLTFLoadingProgressInfo} from "../GLTFLoader";

const checkProgress = (gltfLoader: GLTFLoader, gltfData: GLTF, loadedBuffers: number) => {
    const buffers = gltfData.buffers
    const totalBuffers = buffers.length;

    gltfLoader.loadingProgressInfo.buffers = {
        loaded: loadedBuffers,
        total: totalBuffers,
        percent: Math.min(100, parseFloat(((loadedBuffers / totalBuffers) * 100).toFixed(2)))
    }
}
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

