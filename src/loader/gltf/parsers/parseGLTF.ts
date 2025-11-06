import TextureLoader, {TextureLoaderData} from "../../TextureLoader";
import getGLTFBuffersResources from "../core/getGLTFBuffersResources";
import {GLTF} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import parseAnimation_GLTF from "./animation/parseAnimations";
import parseAssetVersion from "./parseAssetVersion";
import parseCameras_GLTF from "./parseCameras_GLTF";
import parseScene_GLTF from "./parseScene_GLTF";

const parseGLTF = (gltfLoader: GLTFLoader, gltfData: GLTF, callBack) => {
	//  작업을 여러 프레임에 분산
	requestAnimationFrame(() => {
		parseAssetVersion(gltfData);
		requestAnimationFrame(() => {
			getGLTFBuffersResources(gltfLoader, gltfData, () => {
				requestAnimationFrame(() => {
					parseScene_GLTF(gltfLoader, gltfData, () => {
						requestAnimationFrame(() => {
							parseCameras_GLTF(gltfLoader, gltfData);
							// TextureLoader 실행
							new TextureLoader(
								gltfLoader.redGPUContext,
								Object.values(gltfLoader.parsingResult.textureRawList),
								result => {
									result.textures.forEach((textureLoaderData: TextureLoaderData) => {
										const {
											targetTextureKey,
											targetSamplerKey,
											samplerList
										} = textureLoaderData.srcInfo
										textureLoaderData.srcInfo.materialList.forEach((material: TextureLoaderData, index: number) => {
											material[targetTextureKey] = textureLoaderData.texture;
											if (samplerList[index]) {
												material[targetSamplerKey] = samplerList[index];
											}
										})
									});
									parseAnimation_GLTF(gltfLoader, gltfData).then(_ => {
										if (callBack) callBack();
									});
								}
							);
						});
					});
				});
			});
		});
	});
}
export default parseGLTF
