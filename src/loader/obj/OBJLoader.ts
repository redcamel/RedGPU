import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import createUUID from "../../utils/uuid/createUUID";
import getFileName from "../../utils/file/getFileName";
import getFilePath from "../../utils/file/getFilePath";
import OBJMTLLoader from "./OBJMTLLoader";
import parserOBJ from "./parser/parserOBJ";
//TODO: 환경맵 파싱
//TODO: bump 값 상세파싱
class OBJLoader {
	modelParsingComplete: boolean = false
	resultMesh
	result
	callback
	mtlLoader: OBJMTLLoader
	readonly #path: string
	readonly #fileName: string
	readonly #url: string

	constructor(redGPUContext: RedGPUContext, url: string, callback?) {
		validateRedGPUContext(redGPUContext)
		if (url) {
			fetch(url)
				.then(response => response.text())
				.then(data => {
					this.result = parserOBJ(redGPUContext, this, data);
					this.modelParsingComplete = true;
					this.resultMesh = data;
					if (callback) {
						if (this.mtlLoader) {
							if (this.mtlLoader['complete']) {
								// 모델 파싱 종료 & 재질 파싱 종료
								callback(this.result);
							} else {
								// 모델 파싱 종료 & 재질 파싱중
							}
						} else {
							// 모델 파싱 종료 & 재질 없음
							callback(this.result);
						}
					}
				}).catch(error => console.error('Error:', error));
			this.#path = getFilePath(url);
			this.#fileName = getFileName(url);
			this.#url = url
			this.mtlLoader = null;
			this.callback = callback;
			this.resultMesh = new Mesh(redGPUContext);
			this.resultMesh.name = 'instanceOfOBJLoader_' + createUUID()
			this.result = null;
		}
	}

	get path(): string {
		return this.#path;
	}

	get fileName(): string {
		return this.#fileName;
	}

	get url(): string {
		return this.#url;
	}
}

Object.freeze(OBJLoader)
export default OBJLoader
