/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */

"use strict";
import BaseObject3D from "../base/BaseObject3D.js";
import Box from "../primitives/Box.js";
import Cylinder from "../primitives/Cylinder.js";
import ColorMaterial from "../material/ColorMaterial.js"
import Mesh from "./Mesh.js"
import Sphere from "../primitives/Sphere.js";
import RedGPUContext from "../RedGPUContext.js";

export default class Axis extends BaseObject3D {
	constructor(redGPUContext) {
		super(redGPUContext);
		let tArrowMesh;
		let tAxis;
		let tBox, tArrow;
		let tMatX, tMatY, tMatZ;
		tBox = new Box(redGPUContext);
		tArrow = new Cylinder(redGPUContext, 0, 0.5);
		tMatX = new ColorMaterial(redGPUContext, '#ff0000');
		tMatY = new ColorMaterial(redGPUContext, '#00ff00');
		tMatZ = new ColorMaterial(redGPUContext, '#0000ff');
		////////////////////////////////////////////
		// xAxis
		tArrowMesh = new Mesh(redGPUContext, tArrow, tMatX);
		tAxis = new Mesh(redGPUContext, tBox, tMatX);
		tAxis.setScale(5, 0.1, 0.1);
		tArrowMesh.x = 5;
		tArrowMesh.rotationZ = 90;
		tAxis.x = 2.5;
		this.addChild(tAxis, tArrowMesh);
		////////////////////////////////////////////
		// yAxis
		tArrowMesh = new Mesh(redGPUContext, tArrow, tMatY);
		tAxis = new Mesh(redGPUContext, tBox, tMatY);
		tAxis.setScale(0.1, 5, 0.1);
		tArrowMesh.y = 5;
		tAxis.y = 2.5;
		this.addChild(tAxis, tArrowMesh);
		////////////////////////////////////////////
		// zAxis
		tArrowMesh = new Mesh(redGPUContext, tArrow, tMatZ);
		tAxis = new Mesh(redGPUContext, tBox, tMatZ);
		tAxis.setScale(0.1, 0.1, 5);
		tArrowMesh.z = 5;
		tArrowMesh.rotationX = -90;
		tAxis.z = 2.5;
		this.addChild(tAxis, tArrowMesh);
		////////////////////////////////////////////
		this.addChild(new Mesh(redGPUContext, new Sphere(redGPUContext, 0.25, 16, 16, 16), new ColorMaterial(redGPUContext, '#ff00ff')));
		if (RedGPUContext.useDebugConsole) console.log(this)
	}
}