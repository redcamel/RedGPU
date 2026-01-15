module.exports = {
	entryPoints: ["src/index.ts"],
	out: "manual/api",
	plugin: ["typedoc-plugin-markdown"],
	hideGenerator: true,
	name:"RedGPU API",
	includeVersion: true,
	readme: "none",
	// VitePress compatibility options
	sanitizeComments: true,
	preserveAnchorCasing: true,
};
