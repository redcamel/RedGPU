import getAbsoluteURL from "../../../../utils/file/getAbsoluteURL";
import {GLTF} from "../../GLTF";
import GLTFLoader, {GLTFLoadingProgressInfo} from "../../GLTFLoader";
import parseGLTF from "../parseGLTF";
import formatBytes from "../../../../utils/math/formatBytes";
import {keepLog} from "../../../../utils";

const cacheMap: Map<string, GLTF> = new Map();
const pendingMap: Map<string, Promise<object>> = new Map();
const getData = (gltfData) => {
    return {
        ...gltfData,
        meshes: JSON.parse(JSON.stringify(gltfData.meshes)),
    }
}
const parseFileGLTF = async (gltfLoader: GLTFLoader, callBack, onProgress?: (info: GLTFLoadingProgressInfo) => void) => {
    const loadFilePath = getAbsoluteURL(window.location.href, gltfLoader.filePath + gltfLoader.fileName);
    const cachedProgress = () => {
        if (onProgress) {
            const buffer = cacheMap.get(loadFilePath);
            gltfLoader.loadingProgressInfo.model = {
                loaded: buffer.byteLength,
                total: buffer.byteLength,
                lengthComputable: true,
                percent: 100,
                transferred: 'Cached',
                totalSize: 'Cached'
            }
            onProgress(gltfLoader.loadingProgressInfo);
        }
    }
    // 캐싱된 데이터가 있으면 바로 파싱
    if (cacheMap.has(loadFilePath)) {
        gltfLoader.gltfData = getData(cacheMap.get(loadFilePath))
        cachedProgress()
        requestAnimationFrame(() => {
            parseGLTF(gltfLoader, gltfLoader.gltfData, callBack, onProgress);
        });
        return;
    }
    // 진행 중 Promise 있으면 그것이 끝날 때까지 대기 후 파싱
    if (pendingMap.has(loadFilePath)) {
        await pendingMap.get(loadFilePath);
        cachedProgress()
        gltfLoader.gltfData = getData(cacheMap.get(loadFilePath))
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
            cacheMap.set(loadFilePath, gltfData);
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
            pendingMap.delete(loadFilePath);
        }
    });
    pendingMap.set(loadFilePath, promise);
    const gltfData = await promise;
    gltfLoader.gltfData = getData(gltfData)
    requestAnimationFrame(() => {
        parseGLTF(gltfLoader, gltfLoader.gltfData, callBack, onProgress);
    });
};
export default parseFileGLTF;

