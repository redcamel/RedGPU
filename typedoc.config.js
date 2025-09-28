const fs = require("fs");
const path = require("path");

const footerHtml = fs.readFileSync(path.resolve(__dirname, "./typedoc-theme/footer.html"), "utf-8");

module.exports = {
	entryPoints: ["src/index.ts"],
	customCss: "./typedoc-theme/style.css",
	customFooterHtml: footerHtml,
	hideGenerator: true,
	customFooterHtmlDisableWrapper:false,

};
