/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 10:30:31
 *
 */

"use strict";

import RedUUID from "./RedUUID.js";
import RedUTIL from "../util/RedUTIL.js";
import RedBaseObject3D from "./RedBaseObject3D.js";

export default class RedDisplayContainer extends RedUUID {
	children = [];
	constructor() {
		super()
	}
	addChild(child) {
		child instanceof RedBaseObject3D || RedUTIL.throwFunc(`addChild - only allow RedBaseObject3D Instance. - inputValue : ${child} { type : ${typeof child} }`);
		if (this.children.includes(child)) RedUTIL.throwFunc(`${child} : Already registered object. - inputValue : ${child} { type : ${typeof child} }`);
		else this.children.push(child)

	}
	addChildAt(child, index) {
		child instanceof RedBaseObject3D || RedUTIL.throwFunc(`addChildAt - only allow RedBaseObject3D Instance. - inputValue : ${child}, ${index} { type : ${typeof child}, ${typeof index} }`);
		if (this.children.includes(child)) this.removeChild(child);
		if (this.children.length < index) index = this.children.length;
		if (index != undefined) this.children.splice(index, 0, child);
		else this.children.push(child);
	}
	removeChild(child) {
		if (this.children.includes(child)) this.children.splice(t0, 1);
		else RedUTIL.throwFunc(`removeChild - Attempt to delete an object that does not exist. - inputValue : ${child} { type : ${typeof child} }`);
	}
	removeChildAt(index) {
		if (this.children[index]) this.children.splice(index, 1);
		else RedUTIL.throwFunc(`removeChildAt - No object at index. - inputValue : ${index} { type : ${typeof index} }`);
	}
	removeChildAll() { this.children.length = 0}
	getChildAt(index) { return this.children[index] }
	getChildIndex(child) { this.children.indexOf(child) }
	numChildren() { return this.children.length }
}