module.exports = {
	entryPoints: ["src/indexDoc.ts"],
	out: `manual/${process.env.DOC_LANG || 'ko'}/api`,
	plugin: ["typedoc-plugin-markdown"],
	hideGenerator: true,
	name:"RedGPU API",
	includeVersion: true,
	readme: "none",

};
