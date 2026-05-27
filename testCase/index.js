import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js'

RedUnit.pageLoader('RedGPU', [
	{title: 'initialize', src: './initialize'},
	{title: 'antialiasingManager', src: './antialiasing/antialiasingManager'},
	{title: 'renderState', src: './renderState'},
	{title: 'runtimeChecker', src: './runtimeChecker'},
	{title: 'shadow', src: './shadow'},
	{title: 'toneMappingManager', src: './toneMapping/toneMappingManager'},
	{title: 'postEffectManager', src: './postEffect/postEffectManager'},
	{title: 'postEffectCore', src: './postEffect/core'},
	{title: 'postEffectTexturePool', src: './postEffect/postEffectTexturePool'},
	{title: 'formatBytes', src: './util/formatBytes'},
	{title: 'copyGPUBuffer', src: './util/copyGPUBuffer'},
	{title: 'textureUtils', src: './util/texture'},
	// util
	{title: 'file', src: './util/file'},
	{title: 'uuid', src: './util/uuid'},
])