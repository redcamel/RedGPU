/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 10:30:31
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

	constructor(redGPU) {
		super(redGPU);
		let tArrowMesh;
		let tAxis;
		let tBox, tArrow;
		let tMatX, tMatY, tMatZ;
		tBox = new RedBox(redGPU);
		tArrow = new RedCylinder(redGPU, 0, 0.5);
		tMatX = new RedColorMaterial(redGPU, '#ff0000');
		tMatY = new RedColorMaterial(redGPU, '#00ff00');
		tMatZ = new RedColorMaterial(redGPU, '#0000ff');
		////////////////////////////////////////////
		// xAxis
		tArrowMesh = new RedMesh(redGPU, tArrow, tMatX);
		tAxis = new RedMesh(redGPU, tBox, tMatX);
		tAxis.scaleX = tAxis.scaleY = tAxis.scaleZ = 0.1;
		tAxis.scaleX = 5;
		tArrowMesh.x = 5;
		tArrowMesh.rotationZ = 90;
		tAxis.x = 2.5;
		this['children'].push(tAxis);
		this['children'].push(tArrowMesh);
		////////////////////////////////////////////
		// yAxis
		tArrowMesh = new RedMesh(redGPU, tArrow, tMatY);
		tAxis = new RedMesh(redGPU, tBox, tMatY);
		tAxis.scaleX = tAxis.scaleY = tAxis.scaleZ = 0.1;
		tAxis.scaleY = 5;
		tArrowMesh.y = 5;
		tAxis.y = 2.5;
		this['children'].push(tAxis);
		this['children'].push(tArrowMesh);
		////////////////////////////////////////////
		// zAxis
		tArrowMesh = new RedMesh(redGPU, tArrow, tMatZ);
		tAxis = new RedMesh(redGPU, tBox, tMatZ);
		tAxis.scaleX = tAxis.scaleY = tAxis.scaleZ = 0.1;
		tAxis.scaleZ = 5;
		tArrowMesh.z = 5;
		tArrowMesh.rotationX = -90;
		tAxis.z = 2.5;
		this['children'].push(tAxis);
		this['children'].push(tArrowMesh);
		////////////////////////////////////////////
		this['children'].push(new RedMesh(redGPU, new RedSphere(redGPU, 0.25, 16, 16, 16), new RedColorMaterial(redGPU, '#ff00ff')));
		console.log(this)
	}

}