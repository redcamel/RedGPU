/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 13:21:22
 *
 */

"use strict";
export default class RedDetectorGPU {
	#redGPU;
	constructor() {
		this.#getBrowserInfo();
		// console.log = function(){}
		// console.time = function(){}
		// console.timeEnd = function(){}
		if (this.browser === 'ie') console.table = console.log;
	};
	detectGPU = _ => { console.log('TODO - 추후 GPU 디텍팅을 해야한다.') };
	#getBrowserInfo = _ => {
		let navi = window.navigator,
			agent = navi.userAgent.toLowerCase(),
			platform = navi.platform.toLowerCase(),
			app = navi.appVersion.toLowerCase(),
			device = 'pc',
			isMobile = 0,
			browser, bv, os, osv,
			i, t0,
			ie = _ => {
				if (agent.includes('edge')) {
					if (agent.includes('iemobile')) os = 'winMobile';
					return browser = 'edge', bv = (/edge\/([\d]+)/.exec(agent)[1]);
				} else {
					if (!agent.includes('msie') && !agent.includes('trident')) return;
					if (agent.includes('iemobile')) os = 'winMobile';
					return browser = 'ie', bv = agent.includes('msie 7') && agent.includes('trident') ? -1 : !agent.includes('msie') ? 11 : parseFloat(/msie ([\d]+)/.exec(agent)[1]);
				}
			},
			whale = _ => { return agent.includes('whale') ? (bv = parseFloat(/whale\/([\d]+)/.exec(agent)[1]), browser = 'whale') : 0 },
			chrome = _ => {
				if (!agent.includes(i = 'chrome') && !agent.includes(i = 'crios')) return;
				return browser = 'chrome', bv = parseFloat((i === 'chrome' ? /chrome\/([\d]+)/ : /crios\/([\d]+)/).exec(agent)[1]);
			},
			firefox = _ => { return agent.includes('firefox') ? (browser = 'firefox', bv = parseFloat(/firefox\/([\d]+)/.exec(agent)[1])) : 0 },
			safari = _ => { return agent.includes('safari') ? (browser = 'safari', bv = parseFloat(/safari\/([\d]+)/.exec(agent)[1])) : 0 },
			opera = _ => {
				let i;
				return (!agent.includes(i = 'opera') && !agent.includes(i = 'opr')) ? 0 : (browser = 'opera', bv = (i === 'opera') ? parseFloat(/version\/([\d]+)/.exec(agent)[1]) : parseFloat(/opr\/([\d]+)/.exec(agent)[1]));
			},
			naver = _ => {return agent.includes('naver') ? browser = 'naver' : 0 };
		if (agent.includes('android')) {
			browser = os = 'android',
				device = agent.includes('mobile') ? (browser += 'Tablet', 'tablet') : 'mobile',
				osv = (i = /android ([\d.]+)/.exec(agent)) ? (i = i[1].split('.'), parseFloat(i[0] + '.' + i[1])) : 0,
				isMobile = 1,
			whale() || naver() || opera() || chrome() || firefox() || (bv = i = /safari\/([\d.]+)/.exec(agent) ? parseFloat(i[1]) : 0);
		} else if (agent.includes(i = 'ipad') || agent.includes(i = 'iphone')) {
			device = i === 'ipad' ? 'tablet' : 'mobile',
				browser = os = i,
				osv = (i = /os ([\d_]+)/.exec(agent)) ? (i = i[1].split('_'), parseFloat(i[0] + '.' + i[1])) : 0,
				isMobile = 1,
			whale() || naver() || opera() || chrome() || firefox() || (bv = (i = /mobile\/([\S]+)/.exec(agent)) ? parseFloat(i[1]) : 0);
		} else if (platform.includes('win')) {
			for (i in t0 = {'5.1': 'xp', '6.0': 'vista', '6.1': '7', '6.2': '8', '6.3': '8.1', '10.0': '10'}) {
				if (agent.includes('windows nt ' + i)) {
					osv = t0[i];
					break;
				}
			}
			os = 'win', ie() || whale() || opera() || chrome() || firefox() || safari();
		} else if (platform.includes('mac')) {
			os = 'mac',
				i = /os x ([\d._]+)/.exec(agent)[1].replace('_', '.').split('.'),
				osv = parseFloat(i[0] + '.' + i[1]), whale() || opera() || chrome() || firefox() || safari();
		} else os = app.includes('x11') ? 'unix' : app.includes('linux') ? 'linux' : 0, whale() || chrome() || firefox();
		for (i in t0 = {
			device: device,
			isMobile: isMobile,
			browser: browser,
			browserVer: bv,
			os: os,
			osVer: osv,
			down: isMobile ? 'touchstart' : 'mousedown',
			move: isMobile ? 'touchmove' : 'mousemove',
			up: isMobile ? 'touchend' : 'mouseup',
			click: 'click',
			over: 'mouseover',
			out: 'mouseout'
		}) if (t0.hasOwnProperty(i)) this[i] = t0[i];
	};
}