import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js'

RedUnit.pageLoader('RedGPU', [
	{title: 'initialize', src: './initialize'},
	{title: 'object3DContainer', src: './object3DContainer'},
	{title: 'test1', src: './test'},
	{title: 'formatBytes', src: './util/formatBytes'},
	{title: 'matToEuler', src: './util/matToEuler'},
	{title: 'quaternionToRotationMat4', src: './util/quaternionToRotationMat4'},
	{title: 'file', src: './util/file'},
	{title: 'convertColor', src: './convertColor'},
	{title: 'colorRgb', src: './colorRgb'},
	{title: 'colorRgba', src: './colorRgba'},
	{title: 'runtimeChecker', src: './runtimeChecker'},
])
