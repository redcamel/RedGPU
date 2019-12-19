/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.19 11:29:32
 *
 */
"use strict"
import RedBaseObject3D from "../base/RedBaseObject3D.js";
import RedSprite3DMaterial from "../material/RedSprite3DMaterial.js";
import RedUTIL from "../util/RedUTIL.js";

export default class RedSprite3D extends RedBaseObject3D {
	perspectiveScale = true;
	constructor(redGPUContext, geometry, material) {
		super(redGPUContext);
		this.geometry = geometry;
		this.material = material;
		this.cullMode = 'none';
	}
	addChild(child) {
		// RedSprite3D에는 추가불가
	}
	set material(v) {
		if(v instanceof RedSprite3DMaterial){
			this._material = v;
			this.dirtyPipeline = true;
		}else{
			RedUTIL.throwFunc(`addChild - only allow RedSprite3DMaterial Instance. - inputValue : ${v} { type : ${typeof v} }`);
		}

	}
	get rotationX() {return this._rotationX;}
	set rotationX(v) {}
	get rotationY() {return this._rotationY;}
	set rotationY(v) {}
	get rotationZ() {return this._rotationZ;}
	set rotationZ(v) {}
}