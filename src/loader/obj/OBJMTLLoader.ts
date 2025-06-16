import RedGPUContext from "../../context/RedGPUContext";
import getFileName from "../../utils/file/getFileName";
import getFilePath from "../../utils/file/getFilePath";
import parserMLT_OBJ from "./parser/parserMLT_OBJ";

class OBJMTLLoader {
	complete: boolean
	parseData
	readonly #path: string
	readonly #fileName: string
	readonly #url: string

	constructor(redGPUContext: RedGPUContext, url: string, callback) {
		this.#path = getFilePath(url);
		this.#fileName = getFileName(url);
		this.#url = url
		this.#fetchAndParseFile(url, callback);
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

	#fetchAndParseFile(url: string, callback) {
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP 오류! 상태값: ${response.status}`);
				}
				return response.text();
			})
			.then(response => {
				this.complete = true;
				this.parseData = parserMLT_OBJ(this, response);
				callback?.(this.parseData);
			})
			.catch(error => {
				this.complete = true;
				this.parseData = {};
				callback?.(this.parseData);
				console.log('에러 발생', error);
			});
	}
}

Object.freeze(OBJMTLLoader);
export default OBJMTLLoader;
