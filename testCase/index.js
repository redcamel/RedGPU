import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js'

RedUnit.pageLoader('RedGPU', [
	{title: 'initialize', src: './initialize'},
	{title: 'object3DContainer', src: './object3DContainer'},
	{title: 'test1', src: './test'},
	{title: 'formatBytes', src: './util/formatBytes'},
	{title: 'matToEuler', src: './util/matToEuler'},
	{title: 'quaternionToRotationMat4', src: './util/quaternionToRotationMat4'},
	{title: 'file', src: './util/file'},
	{title: 'convertColor', src: './color/convertColor'},
	{title: 'colorRgb', src: './color/colorRgb'},
	{title: 'colorRgba', src: './color/colorRgba'},
	{title: 'runtimeChecker', src: './runtimeChecker'},
])
