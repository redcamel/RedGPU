import TextureLoader, {TextureLoaderData} from "../../TextureLoader";
import getGLTFBuffersResources from "../core/getGLTFBuffersResources";
import {GLTF} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import parseAnimation_GLTF from "./animation/parseAnimations";
import parseAssetVersion from "./parseAssetVersion";
import parseCameras_GLTF from "./parseCameras_GLTF";
import parseScene_GLTF from "./parseScene_GLTF";

const parseGLTF = (gltfLoader: GLTFLoader, gltfData: GLTF, callBack) => {
    parseAssetVersion(gltfData)
    getGLTFBuffersResources(gltfLoader, gltfData,
        () => {
            // 리소스 로딩이 완료되면 다음 진행
            parseScene_GLTF(gltfLoader, gltfData, () => {
                parseCameras_GLTF(gltfLoader, gltfData);
                // console.log('GLTFLoader start', gltfLoader)
                //
                // Initialize a new instance of the TextureLoader.
                new TextureLoader(
                    gltfLoader.redGPUContext,
                    Object.values(gltfLoader.parsingResult.textureRawList),
                    result => {
                        result.textures.forEach((textureLoaderData: TextureLoaderData) => {
                            // console.log('Texture loading complete', textureLoaderData)
                            const {targetTextureKey, targetSamplerKey, samplerList} = textureLoaderData.srcInfo
                            textureLoaderData.srcInfo.materialList.forEach((material: TextureLoaderData, index: number) => {
                                material[targetTextureKey] = textureLoaderData.texture;
                                if (samplerList[index]) {
                                    material[targetSamplerKey] = samplerList[index];
                                    // console.log('targetSamplerKey', material)
                                }
                            })
                        });
                        // Parse the animation data.
                        parseAnimation_GLTF(gltfLoader, gltfData).then(_ => {
                            // Execute the callback if it exists.
                            if (callBack) callBack();
                        });
                    }
                );
            });
        }
    )
}
export default parseGLTF
