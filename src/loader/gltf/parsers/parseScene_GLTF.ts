import {GLTF, GlTfId} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import parseNode_GLTF from "./parseNode_GLTF";

/**
 * Parses the scene from a GLTF file.
 * @param {GLTFLoader} gltfLoader - The GLTF loader object.
 * @param {GLTF} gltfData - The GLTF data object.
 * @param {Function} [callback] - Optional callback function to be called after parsing the scene.
 */
const parseScene_GLTF = (gltfLoader: GLTFLoader, gltfData: GLTF, callback?: Function) => {
    const SCENE_INDEX = 0;
    const {scenes: SCENES} = gltfData;
    const nodesInScene = SCENES[SCENE_INDEX].nodes;
    nodesInScene.forEach((nodeGlTfId: GlTfId) => {
        parseNode_GLTF(
            gltfLoader,
            gltfData,
            nodeGlTfId,
            gltfLoader.resultMesh
        );
    });
    callback?.();
};
export default parseScene_GLTF;
