import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {createFilter} from '@rollup/pluginutils';
import postcss from 'rollup-plugin-postcss'

export default {
	input: './src/index.ts',
	output: {
		file: './dist/index.js',
		format: "es",
		sourcemap: true
	},
	plugins: [
		stringWgsl(),
		nodeResolve(),
		typescript({
			tsconfig: './tsconfig.json',
			declaration: true,
			declarationDir: null
		}),
		json(),
		postcss({
			inject: true,
			extensions: ['.css'],
			minimize: true
		}),
		strip({
			include: ['**/*.ts'],
			functions: ['console.log'],
			debugger: true,
		}),
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
	]
};

function stringWgsl() {
	const filter = createFilter('**/*.wgsl');
	return {
		name: 'remove-tab-characters-from-wgsl',
		transform(code, id) {
			if (filter(id)) {
				let newCode = code
					.replace(/\/\*[\s\S]*?\*\//g, '')
					.replace(/\/\/.*/g, '')
					.replace(/\r/g, '')
					.replace(/\n\s*\n/g, '\n')
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
