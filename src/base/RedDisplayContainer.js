/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.26 19:46:12
 *
 */

"use strict";

export default class RedDisplayContainer {
	children = [];

	constructor() {

	}

	addChild(v) {
		this.children.push(v)
	}

}