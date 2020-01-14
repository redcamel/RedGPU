/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.14 17:51:9
 *
 */

"use strict";

import UUID from "./UUID.js";
import UTIL from "../util/UTIL.js";
import BaseObject3D from "./BaseObject3D.js";

export default class DisplayContainer extends UUID {
	_children = [];
	_parent;
	get children() {return this._children;}
	set children(value) {this._children = value;}
	constructor() {
		super()
	}
	addChild(...child) {
		child.forEach(v => {
			v instanceof BaseObject3D || UTIL.throwFunc(`addChild - only allow BaseObject3D Instance. - inputValue : ${v} { type : ${typeof v} }`);
			if (this._children.includes(v)) UTIL.throwFunc(`${v} : Already registered object. - inputValue : ${v} { type : ${typeof v} }`);
			else {
				v._parent = this.directionalLightList ? null : this
				this._children.push(v)
			}
		})
		DisplayContainer.needFlatListUpdate = true
	}
	addChildAt(child, index) {
		child instanceof BaseObject3D || UTIL.throwFunc(`addChildAt - only allow BaseObject3D Instance. - inputValue : ${child}, ${index} { type : ${typeof child}, ${typeof index} }`);
		if (this._children.includes(child)) this.removeChild(child);
		if (this._children.length < index) index = this._children.length;
		if (index != undefined) this._children.splice(index, 0, child);
		else {
			child._parent = this.directionalLightList ? null : this
			this._children.push(child);
		}
		DisplayContainer.needFlatListUpdate = true
	}
	removeChild(child) {
		if (this._children.includes(child)) {
			child._parent = null;
			this._children.splice(this._children.indexOf(child), 1);
		}
		else UTIL.throwFunc(`removeChild - Attempt to delete an object that does not exist. - inputValue : ${child} { type : ${typeof child} }`);
		DisplayContainer.needFlatListUpdate = true
	}
	removeChildAt(index) {
		if (this._children[index]) {
			this._children[index]._parent = null;
			this._children.splice(index, 1);
		}
		else UTIL.throwFunc(`removeChildAt - No object at index. - inputValue : ${index} { type : ${typeof index} }`);
		DisplayContainer.needFlatListUpdate = true
	}
	removeChildAll() {
		let i = this._children.length;
		while(i--) this._children[i]._parent = null;
		this._children.length = 0;
		DisplayContainer.needFlatListUpdate = true
	}
	getChildAt(index) { return this._children[index] }
	getChildIndex(child) { this._children.indexOf(child) }
	numChildren() { return this._children.length }
}