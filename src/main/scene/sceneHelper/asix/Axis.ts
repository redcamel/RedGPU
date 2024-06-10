import RedGPUContext from "../../../../context/RedGPUContext";
import ColorMaterial from "../../../../material/colorMaterial/ColorMaterial";
import {Mesh} from "../../../../object3d";
import Box from "../../../../resource/geometry/primitives/Box";
import Sphere from "../../../../resource/geometry/primitives/Sphere";

class Axis extends Mesh {
	constructor(
		redGPUContext: RedGPUContext
	) {
		super(redGPUContext, null, null)
		const centerMesh = new Mesh(
			redGPUContext,
			new Sphere(redGPUContext, 0.5),
			new ColorMaterial(redGPUContext)
		)
		this.addChild(centerMesh)
		let tAxis
		const tGeo = new Box(redGPUContext)
		const tMatX = new ColorMaterial(redGPUContext, 0xff0000);
		const tMatY = new ColorMaterial(redGPUContext, 0x00ff00);
		const tMatZ = new ColorMaterial(redGPUContext, 0x0000ff);
		// xAxis
		tAxis = new Mesh(redGPUContext, tGeo, tMatX);
		tAxis.setScale(5, 0.1, 0.1);
		tAxis.x = 2.5;
		this.addChild(tAxis);
		////////////////////////////////////////////
		// yAxis
		tAxis = new Mesh(redGPUContext, tGeo, tMatY);
		tAxis.setScale(0.1, 5, 0.1);
		tAxis.y = 2.5;
		this.addChild(tAxis);
		////////////////////////////////////////////
		// zAxis
		tAxis = new Mesh(redGPUContext, tGeo, tMatZ);
		tAxis.setScale(0.1, 0.1, 5);
		tAxis.z = 2.5;
		this.addChild(tAxis);
	}
}

export default Axis
