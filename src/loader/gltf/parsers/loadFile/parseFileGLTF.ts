import {keepLog} from "../../../../utils";
import getAbsoluteURL from "../../../../utils/file/getAbsoluteURL";
import {GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import parseGLTF from "../parseGLTF";

const cacheMap: Map<string, GLTF> = new Map();
const pendingMap: Map<string, Promise<object>> = new Map();
const parseFileGLTF = async (gltfLoader: GLTFLoader, callBack) => {
	const loadFilePath = getAbsoluteURL(window.location.href, gltfLoader.filePath + gltfLoader.fileName);
	// keepLog(loadFilePath,gltfLoader.filePath + gltfLoader.fileName)
	// 1. 캐싱된 데이터가 있으면 바로 파싱
	if (cacheMap.has(loadFilePath)) {
		gltfLoader.gltfData = cacheMap.get(loadFilePath);
		parseGLTF(gltfLoader, gltfLoader.gltfData, callBack);
		return;
	}
	// 2. 진행 중 Promise 있으면 그것이 끝날 때까지 대기 후 파싱
	if (pendingMap.has(loadFilePath)) {
		await pendingMap.get(loadFilePath);
		gltfLoader.gltfData = cacheMap.get(loadFilePath);
		parseGLTF(gltfLoader, gltfLoader.gltfData, callBack);
		return;
	}
	// 3. 신규 요청은 Promise를 pendingMap에 추가, 완료시 cacheMap에 데이터 저장, finally에서 pendingMap 삭제
	const promise = new Promise<GLTF>(async (resolve, reject) => {
		try {
			const response = await fetch(gltfLoader.url);
			if (!response.ok) throw new Error('GLTF 네트워크 오류: ' + response.status);
			const json = await response.json();
			cacheMap.set(loadFilePath, json);
			resolve(json);
		} catch (e) {
			reject(e);
		} finally {
			pendingMap.delete(loadFilePath);
		}
	});
	pendingMap.set(loadFilePath, promise);
	const gltfData = await promise;
	gltfLoader.gltfData = gltfData;
	parseGLTF(gltfLoader, gltfLoader.gltfData, callBack);
};
export default parseFileGLTF;

