/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.11 18:20:56
 *
 */

"use strict";

import UUID from "./UUID.js";
import UTIL from "../util/UTIL.js";
import BaseObject3D from "./BaseObject3D.js";

export default class DisplayContainer extends UUID {
	children = [];
	constructor() {
		super()
	}
	addChild(...child) {
		child.forEach(v=>{
			v instanceof BaseObject3D || UTIL.throwFunc(`addChild - only allow BaseObject3D Instance. - inputValue : ${v} { type : ${typeof v} }`);
			if (this.children.includes(v)) UTIL.throwFunc(`${v} : Already registered object. - inputValue : ${v} { type : ${typeof v} }`);
			else this.children.push(v)
		})
	}
	addChildAt(child, index) {
		child instanceof BaseObject3D || UTIL.throwFunc(`addChildAt - only allow BaseObject3D Instance. - inputValue : ${child}, ${index} { type : ${typeof child}, ${typeof index} }`);
		if (this.children.includes(child)) this.removeChild(child);
		if (this.children.length < index) index = this.children.length;
		if (index != undefined) this.children.splice(index, 0, child);
		else this.children.push(child);
	}
	removeChild(child) {
		if (this.children.includes(child)) this.children.splice(this.children.indexOf(child), 1);
		else UTIL.throwFunc(`removeChild - Attempt to delete an object that does not exist. - inputValue : ${child} { type : ${typeof child} }`);
	}
	removeChildAt(index) {
		if (this.children[index]) this.children.splice(index, 1);
		else UTIL.throwFunc(`removeChildAt - No object at index. - inputValue : ${index} { type : ${typeof index} }`);
	}
	removeChildAll() { this.children.length = 0}
	getChildAt(index) { return this.children[index] }
	getChildIndex(child) { this.children.indexOf(child) }
	numChildren() { return this.children.length }
}