import {GLTF, GlTfId} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import parseNode_GLTF from "./parseNode_GLTF";

/**
 * [KO] GLTF 데이터의 기본 씬(Scene)을 파싱하고 포함된 노드들을 순회합니다.
 * [EN] Parses the default scene of GLTF data and traverses its nodes.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param gltfData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param callback -
 * [KO] 씬 파싱 완료 후 호출될 콜백 함수
 * [EN] Optional callback function invoked after parsing the scene
 * @category Loader
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
