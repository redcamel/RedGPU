/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.6 19:2:34
 *
 */

"use strict"

import RedBitmapTexture from "../src/resources/RedBitmapTexture.js";
import RedUTIL from "../src/util/RedUTIL.js";
import RedBitmapCubeTexture from "../src/resources/RedBitmapCubeTexture.js";

const mix = (Base, ...texture) => {
	return [Base, ...texture].reduce((parent, extender) => { return extender(parent)})
}
const defineBitmapTextureClass = function (keyName) {
	let t0;
	t0 = Base => class extends Base {
		[`_${keyName}`] = null
		set [keyName](value) {
			if (!(value instanceof RedBitmapTexture)) RedUTIL.throwFunc(`only allow RedBitmapTexture Instance.- inputValue : ${value} { type : ${typeof value} }`);
			this[`_${keyName}`] = null;
			this.checkTexture(value, keyName)
		}
		get [keyName]() {
			return this[`_${keyName}`]
		}
	};
	return t0
}

const defineBitmapCubeTextureClass = function (keyName) {
	let t0;
	t0 = Base => class extends Base {
		[`_${keyName}`] = null
		set [keyName](value) {
			if (!(value instanceof RedBitmapCubeTexture)) RedUTIL.throwFunc(`only allow defineBitmapCubeTextureClass Instance.- inputValue : ${value} { type : ${typeof value} }`);
			this[`_${keyName}`] = null;
			this.checkTexture(value, keyName)
		}
		get [keyName]() {
			return this[`_${keyName}`]
		}
	};
	return t0
}

const defineHexClass = function (keyName, option = {}) {
	let t0;
	t0 = Base => class extends Base {
		[`_${keyName}`] = null
		set [keyName](value) {
			typeof value == 'string' || RedUTIL.throwFunc(`${keyName} : only allow HEX. - inputValue : ${value} { type : ${typeof value} }`);
			RedUTIL.regHex(value) || RedUTIL.throwFunc(`${keyName} : only allow HEX. - inputValue : ${value} { type : ${typeof value} }`);
			this['_' + keyName] = value;
			if (option['callback']) option['callback'].call(this, value);
		}
		get [keyName]() {
			return this[`_${keyName}`]
		}
	};
	return t0
}
const defineBooleanClass = function (keyName, option = {}) {
	let t0;
	t0 = Base => class extends Base {
		[`_${keyName}`] = option['value']
		set [keyName](value) {
			if (typeof value != 'boolean') RedUTIL.throwFunc(`${keyName} : only allow Boolean. - inputValue : ${value} { type : ${typeof value} }`);
			this['_' + keyName] = value;
			if (option['callback']) option['callback'].call(this, value);
		}
		get [keyName]() {
			return this[`_${keyName}`]
		}
	};
	return t0
}
const defineNumberClass = function (keyName, option = {}) {
	let t0;
	let hasMin = option.hasOwnProperty('min');
	let hsaMax = option.hasOwnProperty('max');
	let min = option['min'];
	let max = option['max'];
	t0 = Base => class extends Base {
		#range = {min: min, max: max};
		[`#${keyName}`] = option['value']
		set [keyName](value) {
			this[`#${keyName}`] = null;
			if (typeof value != 'number') RedUTIL.throwFunc(`${keyName} : only allow Number. - inputValue : ${value} { type : ${typeof value} }`);
			if (hasMin && value < min) value = min;
			if (hsaMax && value > max) value = max;
			this[`#${keyName}`] = value;
			if (option['callback']) option['callback'].call(this, value);
		}
		get [keyName]() {
			return this[`#${keyName}`]
		}
	};
	return t0
}
const defineIntUintClass = function (keyName, option = {}, isUint = false) {
	let t0;
	let hasMin = option.hasOwnProperty('min');
	let hsaMax = option.hasOwnProperty('max');
	let min = option['min'];
	let max = option['max'];
	if (isUint) {
		min = min || 0;
		hasMin = true;
		if (hasMin && min < 0) RedUTIL.throwFunc(`${keyName} : min option must be greater than or equal to zero. - inputValue(min) : ${min}`);
		if (hsaMax && max < 0) RedUTIL.throwFunc(`${keyName} : max option must be greater than or equal to zero. - inputValue(max) : ${max}`);
	}
	if (hasMin && hsaMax && max <= min) RedUTIL.throwFunc(`${keyName} : max option option must be greater than or equal to min option. - inputValue(min) : ${min} , inputValue(max) : ${max}`);
	t0 = Base => class extends Base {
		#range = {min: min, max: max};
		[`#${keyName}`] = option['value'];
		set [keyName](value) {
			this[`#${keyName}`] = null;
			if (typeof value != 'number') RedUTIL.throwFunc(`${keyName} : only allow int. - inputValue : ${value} { type : ${typeof value} }`);
			if (hasMin && value < min) value = min;
			if (hsaMax && value > max) value = max;
			if (!(Math.floor(value) == value)) RedUTIL.throwFunc(`${keyName} : only allow int. - inputValue : ${value} { type : ${typeof value} }`);
			this[`#${keyName}`] = value;
			if (option['callback']) option['callback'].call(this, value);
		}
		get [keyName]() {
			return this[`#${keyName}`]
		}
	};
	return t0
}


class NumberTest extends mix(
	class {
	},
	defineNumberClass('opacity', {value: 1, min: 0, max: 1, callback: v => console.log(v)})
) {
	constructor() {
		super()
	}
}

class IntTest extends mix(
	class {
	},
	defineIntUintClass('opacity', {value: 1, callback: v => console.log(v)})
) {
	constructor() {
		super()
	}
}

class UintTest extends mix(
	class {
	},
	defineIntUintClass('opacity', {value: 1, callback: v => console.log(v)}, true)
) {
	constructor() {
		super()
	}
}

class BooleanTest extends mix(
	class {
	},
	defineBooleanClass('useFlat', {value: 1, callback: v => console.log(v)}, true)
) {
	constructor() {
		super()
	}
}

class HexTest extends mix(
	class {
	},
	defineHexClass('hex', {value: '#ff0000', callback: v => console.log(v)}, true)
) {
	constructor() {
		super()
	}
}

let testNumber = new NumberTest()
console.log(testNumber)
testNumber.opacity = 0.1
console.log(testNumber)

let testInt = new IntTest()
console.log(testInt)
testInt.opacity = 1
console.log(testInt)

let testUint = new UintTest()
console.log(testUint)
testUint.opacity = -1
console.log(testUint)

let testBoolean = new BooleanTest()
console.log(testBoolean)
testBoolean.useFlat = true
console.log(testBoolean)

let testHex = new HexTest()
console.log(testHex)
testHex.hex = '#fff'
console.log(testHex)

// const TestTexture = defineTextureClass('baseTexture')
// console.log(TestTexture)
//
// class Test {
// 	constructor() {
//
// 	}
// }
//
// let t0 = TestTexture(Test)
// console.log(new t0)



