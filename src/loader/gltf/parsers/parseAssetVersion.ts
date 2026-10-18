import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import {GLTF} from "../GLTF";

/**
 * [KO] GLTF 데이터의 `asset.version`을 파싱하고 2.0 이상인지 검증합니다.
 * [EN] Parses `asset.version` of the GLTF data and validates that it is 2.0 or higher.
 *
 * @param gltfData -
 * [KO] 파싱할 GLTF 데이터
 * [EN] GLTF data to parse
 * @returns
 * [KO] 숫자로 변환된 에셋 버전
 * [EN] Asset version converted to a number
 * @throws
 * [KO] asset 또는 version이 없거나, 숫자가 아니거나, 2.0 미만인 경우
 * [EN] If asset or version is missing, non-numeric, or lower than 2.0
 */
const parseAssetVersion = (gltfData: GLTF) => {
    const requiredAssetVersion = 2;
    const asset = gltfData?.asset;
    if (!asset) consoleAndThrowError('GLTFLoader - asset must be defined');
    if (!asset.version) consoleAndThrowError('GLTFLoader - asset version must be defined');
    const versionNumber = parseFloat(asset.version);
    if (isNaN(versionNumber)) consoleAndThrowError('GLTFLoader - asset version must be a numerical value');
    if (versionNumber < requiredAssetVersion) consoleAndThrowError('GLTFLoader - asset version must be 2.0 or higher');
    return versionNumber;
}
export default parseAssetVersion
