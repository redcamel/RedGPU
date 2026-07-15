import getAbsoluteURL from "../../../../utils/file/getAbsoluteURL";
import {GLTF} from "../../GLTF";
import GLTFLoader, {GLTFLoadingProgressInfo} from "../../GLTFLoader";
import parseGLTF from "../parseGLTF";
import formatBytes from "../../../../utils/formatBytes";
import {keepLog} from "../../../../utils";

const getData = (gltfData) => {
    return {
        ...gltfData,
        meshes: JSON.parse(JSON.stringify(gltfData.meshes)),
    }
}
const parseFileGLTF = async (gltfLoader: GLTFLoader, callBack, onProgress?: (info: GLTFLoadingProgressInfo) => void) => {
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
    // 캐싱된 데이터가 있으면 바로 파싱
    if (cache.has(loadFilePath)) {
        gltfLoader.gltfData = getData(cache.get(loadFilePath))
        cachedProgress()
        requestAnimationFrame(() => {
            parseGLTF(gltfLoader, gltfLoader.gltfData, callBack, onProgress);
        });
        return;
    }
    // 진행 중 Promise 있으면 그것이 끝날 때까지 대기 후 파싱
    if (pending.has(loadFilePath)) {
        await pending.get(loadFilePath);
        cachedProgress()
        gltfLoader.gltfData = getData(cache.get(loadFilePath))
        requestAnimationFrame(() => {
            parseGLTF(gltfLoader, gltfLoader.gltfData, callBack, onProgress);
        });
        return;
    }
    // 신규 요청은 Promise를 pendingMap에 추가
    const promise = new Promise<GLTF>(async (resolve, reject) => {
        try {
            const response = await fetch(gltfLoader.url);
            if (!response.ok) throw new Error('GLTF 네트워크 오류: ' + response.status);

            const contentLength = response.headers.get('content-length');
            const totalSize = contentLength ? parseInt(contentLength, 10) : 0;

            keepLog(`전체 사이즈: ${totalSize} bytes`);
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
                keepLog(gltfData)
                const buffers = gltfData.buffers
                const totalBuffers = buffers.length;
                if (totalBuffers) {
                    let loadedBuffers = 0;
                    gltfLoader.loadingProgressInfo.buffers = {
                        loaded: loadedBuffers,
                        total: totalBuffers,
                        percent: Math.min(100, parseFloat(((loadedBuffers / totalBuffers) * 100).toFixed(2)))
                    }
                }
            }
            onProgress?.(gltfLoader.loadingProgressInfo);
            resolve(gltfData);
        } catch (e) {
            reject(e);
        } finally {
            pending.delete(loadFilePath);
        }
    });
    pending.set(loadFilePath, promise);
    const gltfData = await promise;
    gltfLoader.gltfData = getData(gltfData)
    requestAnimationFrame(() => {
        parseGLTF(gltfLoader, gltfLoader.gltfData, callBack, onProgress);
    });
};
export const destroyFileGLTFCache = () => {
    // [호환성 유지] 이제 GLTFCacheManager가 해제 관리하므로 본 전역 함수는 빈 함수로 동작합니다.
};
export default parseFileGLTF;
