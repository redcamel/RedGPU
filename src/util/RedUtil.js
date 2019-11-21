"use strict"

export default {
	hexToRGB_ZeroToOne: hex => {
		let t0, t1;
		if (hex.indexOf('rgba') > -1) {
			hex = hex.replace('rgba(', '')
			hex = hex.replace(')', '')
			hex = hex.split(',')
			hex = RedGLUtil.rgb2hex(hex[0], hex[1], hex[2])
		}
		if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
			t1 = [];
			t0 = hex.substring(1).split('');
			if (t0.length === 3) t0 = [t0[0], t0[0], t0[1], t0[1], t0[2], t0[2]];
			t0 = '0x' + t0.join('');
			t1[0] = ((t0 >> 16) & 255) / 255;
			t1[1] = ((t0 >> 8) & 255) / 255;
			t1[2] = (t0 & 255) / 255;
			return t1
		} else throw new Error(`must hex - input : ${hex}`)
	}
}