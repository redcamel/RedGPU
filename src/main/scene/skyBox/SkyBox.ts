import RedGPUContext from "../../../context/RedGPUContext";
import SkyBoxMaterial from "../../../material/skyboxMaterial/SkyBoxMaterial";
import {Mesh} from "../../../object3d";
import Box from "../../../resource/geometry/primitives/Box";
import BitmapCubeTexture from "../../../resource/texture/BitmapCubeTexture";

class SkyBox extends Mesh {
	constructor(redGPUContext: RedGPUContext, srcList: string[]) {
		const scale = 100000 //TODO 이거 카메라에서 받아와야함
		super(redGPUContext, new Box(redGPUContext, scale, scale, scale), new SkyBoxMaterial(redGPUContext, new BitmapCubeTexture(redGPUContext, srcList)))
	}
}

export default SkyBox
