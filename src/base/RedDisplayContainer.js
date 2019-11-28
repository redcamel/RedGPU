/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.28 17:31:6
 *
 */

"use strict";

import RedUUID from "./RedUUID.js";

export default class RedDisplayContainer extends RedUUID {
	children = [];

	constructor() {
		super()
	}

	addChild(v) {
		this.children.push(v)
	}

}