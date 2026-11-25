import Mesh from "../../../../display/mesh/Mesh";
import AccessorInfo_GLTF from "../../cls/AccessorInfo_GLTF";
import ParsedSkinInfo_GLTF from "../../cls/ParsedSkinInfo_GLTF";
import {tryCopyAlignedFloat32} from "../../core/gltfBufferUtils";
import GLTFParseContext from "../../core/GLTFParseContext";
import {GLTF, Skin} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import parseJoint_GLTF from "./parseJoint_GLTF";

/**
 * [KO] GLTF 스킨(Skin) 정보와 역바인드 행렬(Inverse Bind Matrices)을 파싱하여 메쉬에 할당합니다.
 * [EN] Parses GLTF skin information and inverse bind matrices and assigns them to the mesh.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param scenesData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param skin -
 * [KO] 조인트 및 스켈레톤 정보를 포함하는 GLTF Skin 객체
 * [EN] GLTF Skin object containing joint and skeleton information
 * @param mesh -
 * [KO] 스킨 정보가 할당될 대상 메쉬
 * [EN] Target mesh to which skin information will be assigned
 * @param parseContext -
 * [KO] 현재 파싱 세션의 `GLTFParseContext` 인스턴스
 * [EN] `GLTFParseContext` instance for the current parse session
 * @category Loader
 */
const parseSkin_GLTF = (
    gltfLoader: GLTFLoader,
    scenesData: GLTF,
    skin: Skin,
    mesh: Mesh,
    parseContext: GLTFParseContext
) => {
    const parsedSkinInfo = new ParsedSkinInfo_GLTF();
    const {joints, skeleton} = skin;
    const jointLen = joints.length;
    for (let j = 0; j < jointLen; j++) {
        parseJoint_GLTF(parsedSkinInfo, joints[j], parseContext);
    }
    if (skeleton !== undefined) {
        parsedSkinInfo.skeletonMesh = parseContext.nodeObjectMap.get(skeleton) ?? null;
    }
    const accessorGlTfId = skin.inverseBindMatrices;
    const accessorInfo = new AccessorInfo_GLTF(gltfLoader, scenesData, accessorGlTfId);
    const {
        accessor,
        componentType,
        componentType_BYTES_PER_ELEMENT,
        bufferViewByteStride,
        bufferViewOffset,
        accessorBufferOffset,
        bufferURIDataView,
        getMethod
    } = accessorInfo;
    const {type, count} = accessor;
    const flatMatrices = new Float32Array(Math.max(count, jointLen) * 16);

    if (type === 'MAT4') {
        const baseByteOffset = bufferViewOffset + accessorBufferOffset;
        const packedByteStride = 16 * componentType_BYTES_PER_ELEMENT;
        const byteStride = bufferViewByteStride || packedByteStride;

        if (!tryCopyAlignedFloat32(bufferURIDataView, baseByteOffset, byteStride, packedByteStride, componentType, count * 16, flatMatrices)) {
            let byteOffset = baseByteOffset;
            let outIdx = 0;
            for (let m = 0; m < count; m++) {
                for (let c = 0; c < 16; c++) {
                    flatMatrices[outIdx++] = bufferURIDataView[getMethod](byteOffset + c * componentType_BYTES_PER_ELEMENT, true);
                }
                byteOffset += byteStride;
            }
        }
    } else {
        console.warn('알수없는 형식 엑세서 타입', type);
    }

    parsedSkinInfo.inverseBindMatrices = new Array(jointLen);
    for (let i = 0; i < jointLen; i++) {
        parsedSkinInfo.inverseBindMatrices[i] = flatMatrices.subarray(i * 16, i * 16 + 16);
    }
    mesh.animationInfo.skinInfo = parsedSkinInfo;
};
export default parseSkin_GLTF;
