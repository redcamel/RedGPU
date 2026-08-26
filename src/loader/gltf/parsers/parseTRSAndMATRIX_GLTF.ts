import {mat4, vec3} from "gl-matrix";
import Mesh from "../../../display/mesh/Mesh";
import GPU_FRONT_FACE from "../../../gpuConst/GPU_FRONT_FACE";
import mat4ToEuler from "../../../math/mat4ToEuler";
import quaternionToRotationMat4 from "../../../math/quaternionToRotationMat4";
import {Node} from "../GLTF";

const RAD_TO_DEG = 180 / Math.PI;
/**
 * Sets the rotation of a mesh using the given rotation values.
 * The rotation values should be in radians.
 *
 * @param {number[]} tRotation - The rotation values in radians along the x, y, and z axes.
 * @param {Mesh} mesh - The mesh to set the rotation of.
 *
 * @returns {void}
 */
const setMeshRotation = (tRotation: number[], mesh: Mesh) => {
    mesh.setRotation(
        (tRotation[0] * RAD_TO_DEG),
        (tRotation[1] * RAD_TO_DEG),
        (tRotation[2] * RAD_TO_DEG)
    );

}
/**
 * Parses the transformation and matrix information from `nodeInfo` and applies it to the `mesh`.
 *
 * @param {Mesh} mesh - The mesh to apply the transformations to.
 * @param {Node} nodeInfo - The information about the node containing the transformation data.
 * @returns {void}
 */
const parseTRSAndMATRIX_GLTF = (mesh: Mesh, nodeInfo: Node) => {
    const {matrix, rotation: quaternion, translation, scale} = nodeInfo;
    let rotationMTX = mat4.create();
    let tRotation: any;

    if ('matrix' in nodeInfo) {
        const matrix = nodeInfo.matrix;
        const tempScale = vec3.fromValues(1, 1, 1);
        mat4.getScaling(tempScale, matrix);
        mesh.setScale(tempScale[0], tempScale[1], tempScale[2]);
        mesh.setPosition(matrix[12], matrix[13], matrix[14]);

        const unscaledRot = mat4.clone(matrix);
        const invSx = tempScale[0] !== 0 ? (1 / tempScale[0]) : 1;
        const invSy = tempScale[1] !== 0 ? (1 / tempScale[1]) : 1;
        const invSz = tempScale[2] !== 0 ? (1 / tempScale[2]) : 1;

        unscaledRot[0] *= invSx;
        unscaledRot[1] *= invSx;
        unscaledRot[2] *= invSx;
        unscaledRot[4] *= invSy;
        unscaledRot[5] *= invSy;
        unscaledRot[6] *= invSy;
        unscaledRot[8] *= invSz;
        unscaledRot[9] *= invSz;
        unscaledRot[10] *= invSz;
        unscaledRot[12] = 0;
        unscaledRot[13] = 0;
        unscaledRot[14] = 0;
        unscaledRot[15] = 1;

        tRotation = vec3.create();
        mat4ToEuler(unscaledRot, tRotation, 'XYZ');
        setMeshRotation(tRotation, mesh);
    } else {
        if ('rotation' in nodeInfo) {
            tRotation = vec3.create();
            quaternionToRotationMat4(quaternion, rotationMTX);
            mat4ToEuler(rotationMTX, tRotation);
            setMeshRotation(tRotation, mesh);
        }
        if ('translation' in nodeInfo)
            mesh.setPosition(translation[0], translation[1], translation[2]);
        if ('scale' in nodeInfo) {
            // console.log('scale', scale)
            mesh.setScale(scale[0], scale[1], scale[2]);
            if (scale[0] < 0 || scale[1] < 0 || scale[2] < 0) {
                mesh.primitiveState.frontFace = GPU_FRONT_FACE.CW
            }
        }
    }

}
export default parseTRSAndMATRIX_GLTF;
