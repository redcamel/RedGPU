import Mesh from "../../../../display/mesh/Mesh";
import AccessorInfo_GLTF from "../../cls/AccessorInfo_GLTF";
import ParsedSkinInfo_GLTF from "../../cls/ParsedSkinInfo_GLTF";
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
 * @category Loader
 */
const parseSkin_GLTF = (gltfLoader: GLTFLoader, scenesData: GLTF, skin: Skin, mesh: Mesh) => {
    const parsedSkinInfo = new ParsedSkinInfo_GLTF()
    const inverseBindMatrices = []
    const {nodes: NODES} = scenesData;
    const {joints, skeleton} = skin
    {
        let i = 0
        const len = joints.length
        for (i; i < len; i++) {
            const jointGlTfId = joints[i]
            parseJoint_GLTF(gltfLoader, parsedSkinInfo, NODES, jointGlTfId);
        }
    }
    if (skeleton) {
        parsedSkinInfo.skeletonMesh = NODES[skeleton]['Mesh'];
    }
    const accessorGlTfId = skin.inverseBindMatrices;
    const accessorInfo = new AccessorInfo_GLTF(gltfLoader, scenesData, accessorGlTfId);
    const {
        startIndex,
        accessor,
        componentType_BYTES_PER_ELEMENT,
        bufferViewByteStride,
        bufferURIDataView,
        getMethod
    } = accessorInfo;
    const {type, count,} = accessor
    let strideIndex = 0;
    const stridePerElement = bufferViewByteStride / componentType_BYTES_PER_ELEMENT;
    let i = startIndex;
    let len;
    switch (type) {
        case 'MAT4' :
            if (bufferViewByteStride) {
                len = i + count * (bufferViewByteStride / componentType_BYTES_PER_ELEMENT);
                for (i; i < len; i++) {
                    if (strideIndex % stridePerElement < 16) {
                        inverseBindMatrices.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                    }
                    strideIndex++;
                }
            } else {
                len = i + count * 16;
                for (i; i < len; i++) {
                    inverseBindMatrices.push(bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true));
                    strideIndex++;
                }
            }
            break;
        default :
            console.log('알수없는 형식 엑세서 타입', type);
            break;
    }
    parsedSkinInfo.inverseBindMatrices = []
    for (let i = 0; i < joints.length; i++) {
        parsedSkinInfo.inverseBindMatrices.push(
            new Float32Array(
                [
                    inverseBindMatrices[i * 16],
                    inverseBindMatrices[i * 16 + 1],
                    inverseBindMatrices[i * 16 + 2],
                    inverseBindMatrices[i * 16 + 3],
                    inverseBindMatrices[i * 16 + 4],
                    inverseBindMatrices[i * 16 + 5],
                    inverseBindMatrices[i * 16 + 6],
                    inverseBindMatrices[i * 16 + 7],
                    inverseBindMatrices[i * 16 + 8],
                    inverseBindMatrices[i * 16 + 9],
                    inverseBindMatrices[i * 16 + 10],
                    inverseBindMatrices[i * 16 + 11],
                    inverseBindMatrices[i * 16 + 12],
                    inverseBindMatrices[i * 16 + 13],
                    inverseBindMatrices[i * 16 + 14],
                    inverseBindMatrices[i * 16 + 15],
                ]
            )
        )
    }
    mesh.animationInfo.skinInfo = parsedSkinInfo;
    mesh.material.useSkin = !!mesh.animationInfo.skinInfo;
};
export default parseSkin_GLTF;
