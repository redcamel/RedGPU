import ParsedSkinInfo_GLTF from "../../cls/ParsedSkinInfo_GLTF";
import { GlTfId, Node } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
declare const parseJoint_GLTF: (gltfLoader: GLTFLoader, skinInfo: ParsedSkinInfo_GLTF, nodes: Node[], jointGlTfId: GlTfId) => void;
export default parseJoint_GLTF;
