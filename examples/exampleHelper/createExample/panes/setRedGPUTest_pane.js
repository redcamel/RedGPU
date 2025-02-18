/**
 * Sets the size of the GPU context test pane.
 *
 * @param {Object} pane - The pane object to set the size for.
 * @param {Object} redGPUContext - The redGPU context object.
 * @param {boolean} [openYn=false] - Determines whether the pane should be initially expanded.
 *
 * @return {void}
 */
const setRedGPUTest_pane = (pane, redGPUContext, openYn = false) => {
	const TEST_DATA = {
		width: 100,
		height: 100,
		widthUnit: '%',
		heightUnit: '%',
		backgroundColor: {
			r: redGPUContext.backgroundColor.r,
			g: redGPUContext.backgroundColor.g,
			b: redGPUContext.backgroundColor.b,
			a: redGPUContext.backgroundColor.a,
		},
		debug: ''
	};
	// console.log(TEST_DATA)
	const TEST_SET_SIZE_DATA = [['300', '300'], ['600', '300'], ['50%', '300'], ['300', '50%'], ['100%', '100%']]
	const folder = pane.addFolder({
		title: 'redGPUContext',
		expanded: openYn
	});
	const folderDebug = folder.addFolder({
		title: 'Debug',
		expanded: false
	});
	// console.log(redGPUContext.sizeManager)
	folderDebug.addBinding(TEST_DATA, 'debug', {
			readonly: true,
			multiline: true,
			rows: 12,
		}
	)
	pane.on('change', () => {
		const newDebug = [
			`renderScale : ${redGPUContext.renderScale}`,
			`width : ${redGPUContext.width}`,
			`height : ${redGPUContext.height}`,
			`pixelRectArray : ${redGPUContext.sizeManager.pixelRectArray}`,
			`pixelRectObject : ${[
				'{',
				` x : ${redGPUContext.sizeManager.pixelRectObject.x}, y : ${redGPUContext.sizeManager.pixelRectObject.y},`,
				` width : ${redGPUContext.sizeManager.pixelRectObject.width}, height : ${redGPUContext.sizeManager.pixelRectObject.height}`,
				'}',
			].join('\n')}`,
			`parentDomRect : ${[
				'{',
				` x : ${redGPUContext.sizeManager.parentDomRect.x}, y : ${redGPUContext.sizeManager.parentDomRect.y},`,
				` width : ${redGPUContext.sizeManager.parentDomRect.width}, height : ${redGPUContext.sizeManager.parentDomRect.height}`,
				'}',
			].join('\n')}`,
		].join('\n')
		if (JSON.stringify(TEST_DATA.debug) !== JSON.stringify(newDebug)) {
			TEST_DATA.debug = newDebug
			// console.log('체크', redGPUContext)
		}

	});

	folder.addBinding(redGPUContext, 'useMSAA')
	folder.addBinding(redGPUContext, 'useDebugPanel')
	folder.addBinding(redGPUContext, 'renderScale', {min: 0.01, max: 1, step: 0.01})
	folder.addBinding(TEST_DATA, 'backgroundColor', {
		picker: 'inline',
		view: 'color',
		expanded: true,
		color: {
			alpha: true,
		},
	}).on('change', v => {
		const color = v.value;
		redGPUContext.backgroundColor.r = Math.floor(color.r)
		redGPUContext.backgroundColor.g = Math.floor(color.g)
		redGPUContext.backgroundColor.b = Math.floor(color.b)
		redGPUContext.backgroundColor.a = color.a
		// console.log(redGPUContext.backgroundColor)
	})
	folder.addBinding(redGPUContext, 'alphaMode', {
		options: {
			'opaque': 'opaque',
			'premultiplied': 'premultiplied',
		}
	}).on('change', () => console.log('체크', redGPUContext))

	const controllerWidth = folder.addBinding(TEST_DATA, 'width', {
		min: 0,
		max: 200,
		step: 0.01
	}).on('change', (info) => {
		redGPUContext.width = `${info.value}${TEST_DATA.widthUnit.replace('number', '')}`
	});
	const controllerHeight = folder.addBinding(TEST_DATA, 'height', {
		min: 0,
		max: 200,
		step: 0.01
	}).on('change', (info) => {
		redGPUContext.height = `${info.value}${TEST_DATA.heightUnit.replace('number', '')}`
	});
	// console.log('controllerWidth', controllerWidth)

	const updateDimension = (controller, dimensionKey, unit) => {
		const prevPercentModeYn = typeof redGPUContext[dimensionKey] === "number" ? false : redGPUContext[dimensionKey].includes('%');
		const parentDomRect = redGPUContext.sizeManager.parentDomRect;
		let newValue;
		if (unit === '%' && !prevPercentModeYn) {
			newValue = TEST_DATA[dimensionKey] / parentDomRect[dimensionKey] * 100;
		} else if (unit !== '%' && prevPercentModeYn) {
			newValue = (+TEST_DATA[dimensionKey] / 100) * parentDomRect[dimensionKey];
		}
		if (newValue !== undefined) {
			TEST_DATA[dimensionKey] = newValue;
			redGPUContext[dimensionKey] = unit === 'number' ? newValue : `${newValue}${unit}`;
			controller.refresh();
		}
	};

	folder.addBinding(TEST_DATA, 'widthUnit', {
		options: {
			'%': '%',
			'px': 'px',
			'number': 'number'
		}
	}).on('change', (info) => {
		const unit = info.value
		controllerWidth.max = unit === '%' ? 200 : 2048;
		updateDimension(controllerWidth, 'width', unit, TEST_DATA.width);
	});

	folder.addBinding(TEST_DATA, 'heightUnit', {
		options: {
			'%': '%',
			'px': 'px',
			'number': 'number'
		}
	}).on('change', (info) => {
		const unit = info.value
		controllerHeight.max = unit === '%' ? 200 : 2048;
		updateDimension(controllerHeight, 'height', unit, TEST_DATA.height);
	});
	//
	const folderSetSize = folder.addFolder({
		title: 'setSize method test',
		expanded: false
	});
	TEST_SET_SIZE_DATA.forEach((size, index) => {
		const [w, h] = size
		const testName = `setSize(${w},${h})`
		folderSetSize.addButton({
			title: testName
		}).on('click', () => redGPUContext.setSize(w, h));
	});

}
export default setRedGPUTest_pane
