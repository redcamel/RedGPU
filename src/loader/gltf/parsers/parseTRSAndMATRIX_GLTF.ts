import {mat4, vec3} from "gl-matrix";
import Mesh from "../../../display/mesh/Mesh";
import GPU_FRONT_FACE from "../../../gpuConst/GPU_FRONT_FACE";
import mat4ToEuler from "../../../math/mat4ToEuler";
import quaternionToRotationMat4 from "../../../math/quaternionToRotationMat4";
import {Node} from "../GLTF";

const RAD_TO_DEG = 180 / Math.PI;
const TEMP_ROTATION_MTX = mat4.create();
const TEMP_UNSCALED_ROT = mat4.create();
const TEMP_SCALE = vec3.create();
const TEMP_ROTATION = new Float32Array(3);
/**
 * [KO] 라디안 단위의 회전 배열을 각도(degree)로 변환하여 메쉬의 회전을 설정합니다.
 * [EN] Converts a rotation array in radians to degrees and sets the rotation of the mesh.
 *
 * @param tRotation -
 * [KO] X, Y, Z 축의 회전 값 배열 (라디안 단위)
 * [EN] Array of rotation values along the X, Y, and Z axes (in radians)
 * @param mesh -
 * [KO] 회전을 적용할 대상 메쉬
 * [EN] Target mesh to apply the rotation to
 */
const setMeshRotation = (tRotation: number[] | Float32Array, mesh: Mesh) => {
    mesh.setRotation(
        (tRotation[0] * RAD_TO_DEG),
        (tRotation[1] * RAD_TO_DEG),
        (tRotation[2] * RAD_TO_DEG)
    );
}
/**
 * [KO] GLTF 노드의 변환(TRS) 및 행렬(Matrix) 정보를 파싱하여 메쉬에 적용합니다.
 * [EN] Parses the transformation (TRS) and matrix information of a GLTF node and applies it to the mesh.
 *
 * @param mesh -
 * [KO] 변환을 적용할 대상 메쉬
 * [EN] Target mesh to apply transformations to
 * @param nodeInfo -
 * [KO] 변환 데이터를 포함하는 GLTF 노드 정보
 * [EN] GLTF node information containing transformation data
 * @category GLTF
 */
const parseTRSAndMATRIX_GLTF = (mesh: Mesh, nodeInfo: Node) => {
    const {rotation: quaternion, translation, scale} = nodeInfo;

    if ('matrix' in nodeInfo) {
        const matrix = nodeInfo.matrix;
        mat4.getScaling(TEMP_SCALE, matrix);
        mesh.setScale(TEMP_SCALE[0], TEMP_SCALE[1], TEMP_SCALE[2]);
        mesh.setPosition(matrix[12], matrix[13], matrix[14]);

        mat4.copy(TEMP_UNSCALED_ROT, matrix);
        const invSx = TEMP_SCALE[0] !== 0 ? (1 / TEMP_SCALE[0]) : 1;
        const invSy = TEMP_SCALE[1] !== 0 ? (1 / TEMP_SCALE[1]) : 1;
        const invSz = TEMP_SCALE[2] !== 0 ? (1 / TEMP_SCALE[2]) : 1;

        TEMP_UNSCALED_ROT[0] *= invSx;
        TEMP_UNSCALED_ROT[1] *= invSx;
        TEMP_UNSCALED_ROT[2] *= invSx;
        TEMP_UNSCALED_ROT[4] *= invSy;
        TEMP_UNSCALED_ROT[5] *= invSy;
        TEMP_UNSCALED_ROT[6] *= invSy;
        TEMP_UNSCALED_ROT[8] *= invSz;
        TEMP_UNSCALED_ROT[9] *= invSz;
        TEMP_UNSCALED_ROT[10] *= invSz;
        TEMP_UNSCALED_ROT[12] = 0;
        TEMP_UNSCALED_ROT[13] = 0;
        TEMP_UNSCALED_ROT[14] = 0;
        TEMP_UNSCALED_ROT[15] = 1;

        TEMP_ROTATION[0] = 0;
        TEMP_ROTATION[1] = 0;
        TEMP_ROTATION[2] = 0;
        mat4ToEuler(TEMP_UNSCALED_ROT, TEMP_ROTATION, 'XYZ');
        setMeshRotation(TEMP_ROTATION, mesh);
    } else {
        if ('rotation' in nodeInfo) {
            TEMP_ROTATION[0] = 0;
            TEMP_ROTATION[1] = 0;
            TEMP_ROTATION[2] = 0;
            quaternionToRotationMat4(quaternion, TEMP_ROTATION_MTX);
            mat4ToEuler(TEMP_ROTATION_MTX, TEMP_ROTATION);
            setMeshRotation(TEMP_ROTATION, mesh);
        }
        if ('translation' in nodeInfo)
            mesh.setPosition(translation[0], translation[1], translation[2]);
        if ('scale' in nodeInfo) {
            mesh.setScale(scale[0], scale[1], scale[2]);
            if (scale[0] < 0 || scale[1] < 0 || scale[2] < 0) {
                mesh.primitiveState.frontFace = GPU_FRONT_FACE.CW
            }
        }
    }
}
export default parseTRSAndMATRIX_GLTF;
