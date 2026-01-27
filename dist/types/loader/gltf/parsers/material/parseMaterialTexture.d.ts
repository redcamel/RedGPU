import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import { MaterialNormalTextureInfo, MaterialOcclusionTextureInfo, TextureInfo } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
declare const parseMaterialTexture: (gltfLoader: GLTFLoader, tMaterial: PBRMaterial, textureInfo: TextureInfo | MaterialNormalTextureInfo | MaterialOcclusionTextureInfo, targetTextureKey: string, format?: string, useMipmap?: boolean) => void;
export default parseMaterialTexture;
