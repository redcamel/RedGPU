import GLTFParseContext from "../core/GLTFParseContext";
import {GLTF, GlTfId} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import parseSkin_GLTF from "./animation/parseSkin_GLTF";
import parseNode_GLTF from "./parseNode_GLTF";

/**
 * [KO] GLTF 데이터의 기본 씬(Scene)을 2-Pass(Pass 1: 노드·메쉬 생성, Pass 2: 스킨 일괄 링크)로 파싱합니다.
 * [EN] Parses the default scene of GLTF data in 2 passes (Pass 1: node/mesh construction, Pass 2: deferred skin binding).
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param gltfData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param parseContext -
 * [KO] 현재 파싱 세션의 `GLTFParseContext` 인스턴스
 * [EN] `GLTFParseContext` instance for the current parse session
 * @category Loader
 */
const parseScene_GLTF = (gltfLoader: GLTFLoader, gltfData: GLTF, parseContext: GLTFParseContext) => {
    const SCENE_INDEX = gltfData.scene ?? 0;
    const {scenes: SCENES, skins} = gltfData;
    const nodesInScene = SCENES[SCENE_INDEX].nodes;
    // Pass 1: create full node/mesh hierarchy and collect pending skins
    for (let i = 0, len = nodesInScene.length; i < len; i++) {
        const nodeGlTfId: GlTfId = nodesInScene[i];
        parseNode_GLTF(
            gltfLoader,
            gltfData,
            nodeGlTfId,
            gltfLoader.resultMesh,
            parseContext
        );
    }
    // Pass 2: resolve all skin bindings after every joint node exists in parseContext.nodeObjectMap
    if (skins && parseContext.pendingSkins.length > 0) {
        const pendingSkins = parseContext.pendingSkins;
        for (let i = 0, len = pendingSkins.length; i < len; i++) {
            const {skinId, mesh} = pendingSkins[i];
            const skin = skins[skinId];
            if (skin) {
                parseSkin_GLTF(gltfLoader, gltfData, skin, mesh, parseContext);
            }
        }
        pendingSkins.length = 0;
    }
};
export default parseScene_GLTF;
