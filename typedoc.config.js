module.exports = {
	entryPoints: ["src/indexDoc.ts"],
	out: "manual/api",
	plugin: ["typedoc-plugin-markdown"],
	hideGenerator: true,
	name:"RedGPU API",
	includeVersion: true,
	readme: "none",

};
