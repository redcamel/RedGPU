import getAbsoluteURL from "../../../../utils/file/getAbsoluteURL";
import parseGLTF from "../parseGLTF";
const cacheMap = new Map();
const pendingMap = new Map();
const getData = (gltfData) => {
    return {
        ...gltfData,
        meshes: JSON.parse(JSON.stringify(gltfData.meshes)),
    };
};
const parseFileGLTF = async (gltfLoader, callBack) => {
    const loadFilePath = getAbsoluteURL(window.location.href, gltfLoader.filePath + gltfLoader.fileName);
    // 캐싱된 데이터가 있으면 바로 파싱
    if (cacheMap.has(loadFilePath)) {
        gltfLoader.gltfData = getData(cacheMap.get(loadFilePath));
        requestAnimationFrame(() => {
            parseGLTF(gltfLoader, gltfLoader.gltfData, callBack);
        });
        return;
    }
    // 진행 중 Promise 있으면 그것이 끝날 때까지 대기 후 파싱
    if (pendingMap.has(loadFilePath)) {
        await pendingMap.get(loadFilePath);
        gltfLoader.gltfData = getData(cacheMap.get(loadFilePath));
        requestAnimationFrame(() => {
            parseGLTF(gltfLoader, gltfLoader.gltfData, callBack);
        });
        return;
    }
    // 신규 요청은 Promise를 pendingMap에 추가
    const promise = new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(gltfLoader.url);
            if (!response.ok)
                throw new Error('GLTF 네트워크 오류: ' + response.status);
            const json = await response.json();
            cacheMap.set(loadFilePath, json);
            resolve(json);
        }
        catch (e) {
            reject(e);
        }
        finally {
            pendingMap.delete(loadFilePath);
        }
    });
    pendingMap.set(loadFilePath, promise);
    const gltfData = await promise;
    gltfLoader.gltfData = getData(gltfData);
    requestAnimationFrame(() => {
        parseGLTF(gltfLoader, gltfLoader.gltfData, callBack);
    });
};
export default parseFileGLTF;
