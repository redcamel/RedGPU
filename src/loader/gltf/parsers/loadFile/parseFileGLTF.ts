import GLTFLoader from "../../GLTFLoader";
import parseGLTF from "../parseGLTF";

const parseFileGLTF = async (gltfLoader: GLTFLoader, callBack) => {
	const response = await fetch(gltfLoader.url);
	gltfLoader.gltfData = await response.json();
	parseGLTF(gltfLoader, gltfLoader.gltfData, callBack)
}
export default parseFileGLTF
