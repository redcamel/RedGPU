/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 11:31:50
 *
 */
"use strict";
let info;
let _visible = false;
let debuggerBox;
let style_bgColor = `rgba(0, 0, 0, 0.5)`;
let setDebugBox = _ => {
	if (!debuggerBox) {
		debuggerBox = document.createElement('div');
		debuggerBox.style.cssText = `
			position:fixed;
			bottom:0; left:0;
			width : 200px;
			overflow : hidden;
			background:${style_bgColor};
			padding:5px;
			font-size:11px;
			color:#fff;
		`
	}
};
const Debugger = {
	LEFT_TOP: 'leftTop',
	RIGHT_TOP: 'rightTop',
	LEFT_BOTTOM: 'leftBottom',
	RIGHT_BOTTOM: 'rightBottom',
	resetData: viewList => {
		info = [];
		viewList.forEach(view => info.push({
			view: view,
			object3DNum: 0,
			dirtyTransformNum: 0,
			drawCallNum: 0,
			triangleNum: 0,
			dirtyPipelineNum: 0,

			x: view.x, y: view.y, width: view.width, height: view.height, viewRect: view.viewRect,
			baseRenderTime: 0,
			postEffectRenderTime: 0,
			finalRenderTime: 0,

		}));
		return info;
	},
	visible: (v, location = Debugger.LEFT_BOTTOM) => {
		_visible = v;
		setDebugBox();
		if (_visible) {
			document.body.appendChild(debuggerBox);
			Debugger.setLocation(location)
		} else {
			if (debuggerBox.parentNode) document.body.removeChild(debuggerBox)
		}
	},
	setLocation: (location = Debugger.LEFT_BOTTOM) => {
		debuggerBox.style.top = '';
		debuggerBox.style.bottom = '';
		debuggerBox.style.left = '';
		debuggerBox.style.right = '';
		switch (location) {
			case Debugger.LEFT_TOP :
				debuggerBox.style.left = debuggerBox.style.top = 0;
				break;
			case Debugger.LEFT_BOTTOM :
				debuggerBox.style.left = debuggerBox.style.bottom = 0;
				break;
			case Debugger.RIGHT_TOP :
				debuggerBox.style.right = debuggerBox.style.top = 0;
				break;
			case Debugger.RIGHT_BOTTOM :
				debuggerBox.style.right = debuggerBox.style.bottom = 0;
				break;
		}
	},
	update: _ => {
		setDebugBox();
		if (_visible) {
			debuggerBox.innerHTML = '';
			info.forEach(data => {
				let container, t0, t1;
				let noBR = {'x': 1, 'width': 1};
				let tData;
				container = document.createElement('div');
				container.style.cssText = `
					background : rgba(0,0,0,0.75);
					margin-bottom : 1px;
					padding : 8px;
				`;
				debuggerBox.appendChild(container);
				t0 = document.createElement('div');
				t0.style.color = '#fff';
				container.appendChild(t0);
				t1 = '';
				for (let k in data) {
					tData = data[k];
					if (typeof tData == 'number') {
						if (k.includes('Time')) tData = tData.toFixed(5);
						tData = tData.toLocaleString()
					}
					t1 += `<span style="color:rgba(255,255,255,0.5)">${k}</span> : ${tData}`;
					t1 += noBR[k] ? ' / ' : '<br>'
				}
				t0.innerHTML = t1
			})
		}
	}
};
export default Debugger;