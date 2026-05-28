import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js'

RedUnit.pageLoader('RedGPU', [
	{title: 'antialiasingManager', src: './antialiasing/antialiasingManager'},
	{title: 'baseObject', src: './base'},
	{title: 'color', src: './color'},
	{title: 'convertHexToRgb', src: './color/convertHexToRgb'},
	{title: 'convertRgbToHex', src: './color/convertRgbToHex'},
	{title: 'copyGPUBuffer', src: './util/copyGPUBuffer'},
	{title: 'file', src: './util/file'},
	{title: 'formatBytes', src: './util/formatBytes'},
	{title: 'initialize', src: './initialize'},
	{title: 'light', src: './light'},
	{title: 'postEffectCore', src: './postEffect/core'},
	{title: 'postEffectManager', src: './postEffect/postEffectManager'},
	{title: 'postEffectTexturePool', src: './postEffect/postEffectTexturePool'},
	{title: 'renderState', src: './renderState'},
	{title: 'runtimeChecker', src: './runtimeChecker'},
	{title: 'shadow', src: './shadow'},
	{title: 'textureUtils', src: './util/texture'},
	{title: 'toneMappingManager', src: './toneMapping/toneMappingManager'},
	{title: 'uuid', src: './util/uuid'},
])
