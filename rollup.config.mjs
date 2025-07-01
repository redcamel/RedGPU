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
						.replace(/\\n /g, '')
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
					.replace(/\/\/.*/g, '')
				newCode = JSON.stringify(newCode)
				return {
					code: `export default ${newCode};`,
					map: {mappings: ""}
				};
			}
		}
	};
}
