import {keepLog} from "../../../../utils";
import getAbsoluteURL from "../../../../utils/file/getAbsoluteURL";
import getArrayBufferFromSrc from "../../core/getArrayBufferFromSrc";
import {GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import parseGLTF from "../parseGLTF";

/**
 * Length of the header for the binpacker data format.
 * @type {number}
 */
const BINPACKER_HEADER_LENGTH = 12;
/**
 * The chunk type for JSON data in the binpacker.
 *
 * @constant {number}
 * @name BINPACKER_CHUNK_TYPE_JSON
 * @description This constant represents the chunk type for JSON data in the binpacker.
 *              It has a hexadecimal value of 0x4e4f534a.
 */
const BINPACKER_CHUNK_TYPE_JSON = 0x4e4f534a;
/**
 * The chunk type constant for binary chunks in BINPACKER.
 *
 * @constant {number}
 */
const BINPACKER_CHUNK_TYPE_BINARY = 0x004e4942;
/**
 * Parses a GLB file using the provided GLTFLoader and invokes the callback with the parsed data.
 *
 * @param {GLTFLoader} gltfLoader - The GLTFLoader used to load the GLB file.
 * @param {function} callBack - The callback function to be invoked with the parsed GLTF data.
 *
 * @returns {Promise<void>} - A promise that resolves when the GLB file has been parsed.
 */
const cacheMap: Map<string, ArrayBuffer> = new Map();
const pendingMap: Map<string, Promise<ArrayBuffer>> = new Map();

const parseFileGLB = async (gltfLoader: GLTFLoader, callBack) => {
	console.log('GLB Model parsing has start.');
	const loadFilePath = getAbsoluteURL(window.location.href, gltfLoader.filePath + gltfLoader.fileName)
	keepLog(loadFilePath,gltfLoader.filePath + gltfLoader.fileName)
	if (cacheMap.has(loadFilePath)) {
		keepLog('GLB Model parsing has cache', loadFilePath);
		await parseArrayBuffer(gltfLoader, cacheMap.get(loadFilePath), callBack);
		return;
	}

	if (pendingMap.has(loadFilePath)) {
		await pendingMap.get(loadFilePath);

		await parseArrayBuffer(gltfLoader, cacheMap.get(loadFilePath), callBack);
		return;
	}

	const promise = new Promise<ArrayBuffer>((resolve, reject) => {
		getArrayBufferFromSrc(
			loadFilePath,
			(buffer) => {
				cacheMap.set(loadFilePath, buffer);
				keepLog('GLB Model parsing set cache', loadFilePath);
				pendingMap.delete(loadFilePath); // 진행중 목록에서 제거
				resolve(buffer);
			},
			(error) => {
				pendingMap.delete(loadFilePath);
				reject(error);
			}
		);
	});
	pendingMap.set(loadFilePath, promise);

	try {
		const buffer = await promise;
		await parseArrayBuffer(gltfLoader, buffer, callBack);
	} catch (error) {
		console.log(error);
	}
}
const parseArrayBuffer = async (gltfLoader:GLTFLoader, buffer: ArrayBuffer, callBack) => {
	const {content, binaryChunk} = parseBuffer(buffer);
	if (content === null) {
		throw new Error('JSON content not found');
	}
	const gltfData: GLTF = JSON.parse(content);
	processImagesIfExist(gltfData, binaryChunk);
	gltfData.buffers[0].uri = binaryChunk;
	gltfLoader.gltfData = gltfData
	parseGLTF(gltfLoader, gltfData, callBack)
}
/**
 * Parses the given buffer and extracts content and binary chunks.
 *
 * @param {ArrayBuffer} buffer - The buffer to parse.
 * @returns {Object} - An object containing the parsed content and binary chunk.
 * - content: The parsed content as a string.
 * - binaryChunk: The extracted binary chunk.
 */
const parseBuffer = (buffer: ArrayBuffer): { content: string, binaryChunk: any } => {
	let content = null;
	let body = null;
	const chunkView = new DataView(buffer, BINPACKER_HEADER_LENGTH);
	const byteLength = chunkView.byteLength;
	let num = 0
	for (let chunkIndex = 0; chunkIndex < byteLength;) {
		const chunkLength = chunkView.getUint32(chunkIndex, true);
		chunkIndex += 4;
		const chunkType = chunkView.getUint32(chunkIndex, true);
		chunkIndex += 4;
		switch (chunkType) {
			case BINPACKER_CHUNK_TYPE_JSON:
				const contentArray = new Uint8Array(
					buffer,
					BINPACKER_HEADER_LENGTH + chunkIndex,
					chunkLength
				);
				content = convertUint8ArrayToString(contentArray);
				num++
				break;
			case BINPACKER_CHUNK_TYPE_BINARY:
				const byteOffset = BINPACKER_HEADER_LENGTH + chunkIndex;
				body = buffer.slice(byteOffset, byteOffset + chunkLength);
				break;
		}
		chunkIndex += chunkLength;
	}
	return {content, binaryChunk: body};
}
/**
 * Process images if they exist in the GLTF data and convert them to object URLs.
 *
 * @param {object} gltfData - The GLTF data object.
 * @param {object} binaryChunk - The binary chunk data.
 * @returns {void}
 */
/**
 * GLTF 이미지 데이터를 처리하고 Object URL을 생성하는 함수
 * 동일한 이미지 버퍼에 대해 동일한 Object URL을 재사용
 */
const processImagesIfExist = (gltfData: GLTF, binaryChunk: any) => {
	const {images, bufferViews} = gltfData;
	const supportedFormats = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

	// 버퍼 해시를 저장할 캐시 맵
	// 전역 변수로 선언하거나 클로저를 통해 유지할 수 있음
	const bufferHashMap = new Map<string, string>();

	if (images) {
		for (let i = 0; i < images.length; i++) {
			const image = images[i];
			const {mimeType, bufferView: bufferViewGlTfId} = image;

			if (supportedFormats.includes(mimeType) && bufferViewGlTfId !== undefined) {
				const sliceStartIndex = bufferViews[bufferViewGlTfId].byteOffset || 0;
				const byteLength = bufferViews[bufferViewGlTfId].byteLength;

				// 버퍼의 고유 식별자 생성 (버퍼 위치 + 길이 + MIME 타입)
				const bufferKey = `${sliceStartIndex}_${byteLength}_${mimeType}`;

				// 이미 동일한 버퍼에 대한 URL이 생성되었는지 확인
				if (bufferHashMap.has(bufferKey)) {
					// 기존 URL 재사용
					image.uri = bufferHashMap.get(bufferKey);
				} else {
					// 새 URL 생성
					const slicedChunk = binaryChunk.slice(sliceStartIndex, sliceStartIndex + byteLength);
					const blob = new Blob([new Uint8Array(slicedChunk)], {type: mimeType});
					const objectURL = URL.createObjectURL(blob);

					// 캐시에 저장
					bufferHashMap.set(bufferKey, objectURL);
					image.uri = objectURL;
				}
			}
		}
	}

	// URL 캐시 정보 반환 (나중에 정리에 사용할 수 있음)
	return bufferHashMap;
};
export default parseFileGLB
/**
 * Convert a Uint8Array to a string.
 *
 * @param {Uint8Array} array - The Uint8Array to convert.
 * @returns {string} - The converted string.
 */
const convertUint8ArrayToString = (array: Uint8Array): string => {
	let str = '';
	for (let item of array) {
		str += String.fromCharCode(item);
	}
	return str;
};
