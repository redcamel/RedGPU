import getAbsoluteURL from "../../../../utils/file/getAbsoluteURL";
import {nextFrame, throwIfAborted} from "../../core/gltfAsyncUtils";
import {GLTF} from "../../GLTF";
import GLTFLoader, {GLTFLoadingProgressInfo} from "../../GLTFLoader";
import parseGLTF from "../parseGLTF";
import formatBytes from "../../../../utils/formatBytes";


/**
 * [KO] 캐싱된 GLTF 데이터에서 메쉬 배열을 깊은 복사하여 반환합니다.
 * [EN] Deep copies the meshes array from cached GLTF data and returns a new GLTF data object.
 *
 * @param gltfData -
 * [KO] 원본 GLTF 데이터 객체
 * [EN] Source GLTF data object
 * @returns
 * [KO] 복제된 GLTF 데이터 객체
 * [EN] Cloned GLTF data object
 */
const getData = (gltfData) => {
    return {
        ...gltfData,
        meshes: JSON.parse(JSON.stringify(gltfData.meshes)),
    }
}
/**
 * [KO] GLTF(.gltf) JSON 파일을 로드 및 파싱하고 완료 시 콜백 함수를 호출합니다.
 * [EN] Loads and parses a GLTF (.gltf) JSON file and invokes the callback function upon completion.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param callBack -
 * [KO] 파싱 완료 후 호출될 콜백 함수
 * [EN] Callback function invoked after parsing is complete
 * @param onProgress -
 * [KO] 로딩 진행 상태를 전달받는 콜백 함수
 * [EN] Optional callback function receiving loading progress information
 * @returns
 * [KO] 파싱 시작이 완료되면 해결되는 `Promise<void>`
 * [EN] `Promise<void>` that resolves when parsing initialization is complete
 * @category Loader
 */
const parseFileGLTF = async (
    gltfLoader: GLTFLoader,
    callBack?: () => void,
    onProgress?: (info: GLTFLoadingProgressInfo) => void,
    signal?: AbortSignal
): Promise<void> => {
    throwIfAborted(signal);
    const loadFilePath = getAbsoluteURL(window.location.href, gltfLoader.filePath + gltfLoader.fileName);
    const {cache, pending} = gltfLoader.redGPUContext.resourceManager.gltfCacheManager.gltfCache;

    const cachedProgress = () => {
        if (onProgress) {
            const buffer = cache.get(loadFilePath);
            gltfLoader.loadingProgressInfo.model = {
                loaded: (buffer as any)?.byteLength || 0,
                total: (buffer as any)?.byteLength || 0,
                lengthComputable: true,
                percent: 100,
                transferred: 'Cached',
                totalSize: 'Cached'
            }
            onProgress(gltfLoader.loadingProgressInfo);
        }
    }
    if (cache.has(loadFilePath)) {
        gltfLoader.gltfData = getData(cache.get(loadFilePath))
        cachedProgress()
        await nextFrame(signal);
        await parseGLTF(gltfLoader, gltfLoader.gltfData, callBack, onProgress, signal);
        return;
    }
    if (pending.has(loadFilePath)) {
        await pending.get(loadFilePath);
        throwIfAborted(signal);
        cachedProgress()
        gltfLoader.gltfData = getData(cache.get(loadFilePath))
        await nextFrame(signal);
        await parseGLTF(gltfLoader, gltfLoader.gltfData, callBack, onProgress, signal);
        return;
    }
    const promise = new Promise<GLTF>(async (resolve, reject) => {
        try {
            const response = await fetch(gltfLoader.url);
            if (!response.ok) throw new Error('GLTF network error: ' + response.status);

            const contentLength = response.headers.get('content-length');
            const totalSize = contentLength ? parseInt(contentLength, 10) : 0;


            const gltfData = await response.json();
            cache.set(loadFilePath, gltfData);
            gltfLoader.loadingProgressInfo.model = {
                loaded: totalSize,
                total: totalSize,
                lengthComputable: true,
                percent: 100,
                transferred: formatBytes(totalSize),
                totalSize: formatBytes(totalSize)
            }
            {

                const buffers = gltfData.buffers
                const totalBuffers = buffers ? buffers.length : 0;
                if (totalBuffers) {
                    let loadedBuffers = 0;
                    gltfLoader.loadingProgressInfo.buffers = {
                        loaded: loadedBuffers,
                        total: totalBuffers,
                        percent: Math.min(100, parseFloat(((loadedBuffers / totalBuffers) * 100).toFixed(2)))
                    }
                }
            }
            if (!signal?.aborted) {
                onProgress?.(gltfLoader.loadingProgressInfo);
            }
            resolve(gltfData);
        } catch (e) {
            reject(e);
        } finally {
            pending.delete(loadFilePath);
        }
    });
    pending.set(loadFilePath, promise);
    const gltfData = await promise;
    throwIfAborted(signal);
    gltfLoader.gltfData = getData(gltfData)
    await nextFrame(signal);
    await parseGLTF(gltfLoader, gltfLoader.gltfData, callBack, onProgress, signal);
};

export default parseFileGLTF;
