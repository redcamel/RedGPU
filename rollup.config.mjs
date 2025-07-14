import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {createFilter} from '@rollup/pluginutils';
import postcss from 'rollup-plugin-postcss'

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
			terser({
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
			}),
			removeSpacesAndTabs()
		]
	},
]

function removeSpacesAndTabs() {
	return {
		generateBundle(_, bundle) {
			for (const filename in bundle) {
				const file = bundle[filename];
				if (file.type === 'chunk') {
					file.code = file.code
						.replace(/(\\t){2,}/g, '\t')
						.replace(/(\s?)=(\s?)/g, '=')
						.replace(/(\s?):(\s?)/g, ':')
						.replace(/(\s?);(\s?)/g, ';')
						.replace(/(\s?),(\s?)/g, ',')
						.replace(/(\s?)\/(\s?)/g, '/')
						.replace(/\s{1,}/g, ' ')
						.replace(/\\n /g, ' ')
					;
				}
			}
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
					// 블록 주석 제거 (/* */)
					.replace(/\/\*[\s\S]*?\*\//g, '')
					// 라인 주석 제거 (//)
					.replace(/\/\/.*/g, '')
					// 캐리지 리턴 제거
					.replace(/\r/g, '')
					// 연속된 개행문자를 하나로 치환
					.replace(/\n\s*\n/g, '\n')
					// 연속된 공백을 하나로 치환
					.replace(/[ \t]+/g, ' ')
				newCode = JSON.stringify(newCode)
				return {
					code: `export default ${newCode};`,
					map: {mappings: ""}
				};
			}
		}
	};
}
