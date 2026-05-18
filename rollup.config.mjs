import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {createFilter} from '@rollup/pluginutils';
import postcss from 'rollup-plugin-postcss'
const terserOptions = {
	format: {
		comments: false,
	},
	mangle: {
		properties: false,
		keep_classnames: true,
		keep_fnames: true,
	},
	compress: {
		dead_code: true,
		if_return: true
	},
}
export default [
	{
		input: './src/index.ts',
		output: {
			file: './dist/index.js',
			format: "es",
		},
		plugins: [
			stringWgsl(),
			nodeResolve(),
			json(),
			postcss({
				inject: true,
				extensions: ['.css'],
				minimize: true
			}),
			strip(
				{
					include: ['**/*.ts'],
					exclude: ["./init.ts"],
					functions: ['console.log'],
					debugger: true,
				}
			),
			typescript({
					tsconfig: 'tsconfig.json'
				}
			),
			terser(terserOptions),
			removeSpacesAndTabs()
		]
	},
	{
		input: './src/plugins/rapier/index.ts',
		output: {
			file: './dist/plugins/physics/rapier/index.js',
			format: "es",
		},
		plugins: [
			stringWgsl(),
			nodeResolve(),
			json(),
			typescript({
				tsconfig: 'tsconfig.json',
				declaration: false,
				declarationDir: null
			}),
			terser(terserOptions),
			removeSpacesAndTabs()
		]
	}
]

function removeSpacesAndTabs() {
	return {
		name: 'remove-spaces-and-tabs',
		renderChunk(code) {
			return code.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, (match) => {

				let content = match.substring(1, match.length - 1);
				content.replace(/\/\*[\s\S]*?\*\//g, '')
					.replace(/\/\/.*?(\\n|\\r|$)/g, '$1')
					.replace(/\\r\\n|\\n|\\r|\\t/g, ' ')
					.replace(/\s+/g, ' ')
					.replace(/\s*(&&|\|\||[=+\-*/<>:;,{}()[\]])\s*/g, '$1')
					.trim();
				return match;
			});
		}
	};
}
function stringWgsl() {
	const filter = createFilter('**/*.wgsl');
	return {
		name: 'remove-tab-characters-from-wgsl',
		transform(code, id) {
			if (filter(id)) {
				let newCode = code
					// 주석 제거 (블록 및 라인)
					.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
					// 모든 종류의 공백(개행 포함)을 하나의 공백으로 치환
					.replace(/\s+/g, ' ')
					// 연산자 및 기호 주변 공백 제거
					.replace(/\s*(&&|\|\||[=+\-*/<>:;,{}()[\]])\s*/g, '$1')
					.trim();
				newCode = JSON.stringify(newCode)
				return {
					code: `export default ${newCode};`,
					map: {mappings: ""}
				};
			}
		}
	};
}
