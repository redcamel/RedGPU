/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:11:47
 *
 */

"use strict";
import RedBaseObject3D from "../base/RedBaseObject3D.js";
import RedBox from "../primitives/RedBox.js";
import RedCylinder from "../primitives/RedCylinder.js";
import RedColorMaterial from "../material/RedColorMaterial.js"
import RedMesh from "./RedMesh.js"
import RedSphere from "../primitives/RedSphere.js";

export default class RedAxis extends RedBaseObject3D {

	constructor(redGPUContext) {
		super(redGPUContext);
		let tArrowMesh;
		let tAxis;
		let tBox, tArrow;
		let tMatX, tMatY, tMatZ;
		tBox = new RedBox(redGPUContext);
		tArrow = new RedCylinder(redGPUContext, 0, 0.5);
		tMatX = new RedColorMaterial(redGPUContext, '#ff0000');
		tMatY = new RedColorMaterial(redGPUContext, '#00ff00');
		tMatZ = new RedColorMaterial(redGPUContext, '#0000ff');
		////////////////////////////////////////////
		// xAxis
		tArrowMesh = new RedMesh(redGPUContext, tArrow, tMatX);
		tAxis = new RedMesh(redGPUContext, tBox, tMatX);
		tAxis.scaleX = tAxis.scaleY = tAxis.scaleZ = 0.1;
		tAxis.scaleX = 5;
		tArrowMesh.x = 5;
		tArrowMesh.rotationZ = 90;
		tAxis.x = 2.5;
		this['children'].push(tAxis);
		this['children'].push(tArrowMesh);
		////////////////////////////////////////////
		// yAxis
		tArrowMesh = new RedMesh(redGPUContext, tArrow, tMatY);
		tAxis = new RedMesh(redGPUContext, tBox, tMatY);
		tAxis.scaleX = tAxis.scaleY = tAxis.scaleZ = 0.1;
		tAxis.scaleY = 5;
		tArrowMesh.y = 5;
		tAxis.y = 2.5;
		this['children'].push(tAxis);
		this['children'].push(tArrowMesh);
		////////////////////////////////////////////
		// zAxis
		tArrowMesh = new RedMesh(redGPUContext, tArrow, tMatZ);
		tAxis = new RedMesh(redGPUContext, tBox, tMatZ);
		tAxis.scaleX = tAxis.scaleY = tAxis.scaleZ = 0.1;
		tAxis.scaleZ = 5;
		tArrowMesh.z = 5;
		tArrowMesh.rotationX = -90;
		tAxis.z = 2.5;
		this['children'].push(tAxis);
		this['children'].push(tArrowMesh);
		////////////////////////////////////////////
		this['children'].push(new RedMesh(redGPUContext, new RedSphere(redGPUContext, 0.25, 16, 16, 16), new RedColorMaterial(redGPUContext, '#ff00ff')));
		console.log(this)
	}

}