/**
 * GLTF asset version을 체크하는 함수
 * @param {GLTF} gltfData - GLTFDataType type의 데이터
 * @returns {number} asset version
 * @throws {Error} 에셋이 정의되어 있지 않거나, 버전이 필요 버전보다 낮은 경우 오류를 발생
 */
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
/**
 * Parses the asset version from the given GLTF data.
 * Throws an error if the asset version is invalid or lower than the required version.
 *
 * @param {GLTF} gltfData - The GLTF data to parse.
 * @returns {number} - The parsed asset version.
 * @throws {Error} - If the asset version is invalid or lower than the required version.
 */
const parseAssetVersion = (gltfData) => {
    const requiredAssetVersion = 2;
    const asset = gltfData?.asset;
    if (!asset)
        consoleAndThrowError('GLTFLoader - asset must be defined');
    if (!asset.version)
        consoleAndThrowError('GLTFLoader - asset version must be defined');
    const versionNumber = parseFloat(asset.version);
    if (isNaN(versionNumber))
        consoleAndThrowError('GLTFLoader - asset version must be a numerical value');
    if (versionNumber < requiredAssetVersion)
        consoleAndThrowError('GLTFLoader - asset version must be 2.0 or higher');
    return versionNumber;
};
export default parseAssetVersion;
