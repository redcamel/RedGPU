import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {createFilter} from '@rollup/pluginutils';
import postcss from 'rollup-plugin-postcss'

export default [
	// {
	// 	input: './src/index.ts',
	// 	output: {
	// 		file: './dist/index.js',
	// 		format: 'es',
	// 	},
	// 	plugins: [
	// 		stringWgsl(),
	// 		nodeResolve(),
	// 		json(),
	// 		postcss({
	// 			inject: true, // 기본값입니다. 이 결과를 JavaScript 번들에 주입합니다.
	// 			extensions: ['.css'],
	// 			minimize: true
	// 		}),
	// 		strip({
	// 			include: ['**/*.ts'],   // 모든 TypeScript 파일을 대상으로 함
	// 			exclude: ["./init.ts"], // 특정 파일은 제거 대상에서 제외
	// 			functions: ['console.log'], // 제거할 함수 지정
	// 			debugger: true,         // debugger 문 제거
	// 		}),
	// 		typescript({
	// 				tsconfig: 'tsconfig.json'
	// 			}
	// 		),
	// 		terser({
	// 			format: {
	// 				comments: false,
	// 			},
	// 			mangle: false,
	// 			compress: {
	// 				dead_code: true,
	// 				if_return: true
	// 			},
	// 		}),
	// 		removeSpacesAndTabs()
	// 	]
	// },

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
				inject: true, // 기본값입니다. 이 결과를 JavaScript 번들에 주입합니다.
				extensions: ['.css'],
				minimize: true
			}),
			strip(
				{
					include: ['**/*.ts'],
					exclude: ["./init.ts"],
					functions: ['console.log'], // 제거할 함수 지정
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
					// .replace(/(\s|\\t){1,}/g, ' ')
					// .replace(/\\t/g, ' ')
					// .replace(/(\s?)=(\s?)/g, '=')
					// .replace(/(\s?):(\s?)/g, ':')
					// .replace(/(\s?);(\s?)/g, ';')
					// .replace(/(\s?),(\s?)/g, ',')
					// .replace(/(\s?)\/(\s?)/g, '/')
					// .replace(/(\s?)\*(\s?)/g, '*')
					// .replace(/\s-|-\s|\s-\s/g, '-')
					// .replace(/(\s?)\+(\s?)/g, '+')
					// .replace(/(\s?)\{(\s?)/g, '{')
					// .replace(/(\s?)}(\s?)/g, '}')
					// .replace(/(\s?)>(\s?)/g, '>')
					// .replace(/(\s?)<(\s?)/g, '<')
					// .replace(/(\s?)\((\s?)/g, '(')
					// .replace(/(\s?)\)(\s?)/g, ')')
				// newCode = newCode.replace(/return/g, 'return ');
				newCode = JSON.stringify(newCode)
				return {
					code: `export default ${newCode};`,
					map: {mappings: ""}
				};
			}
		}
	};
}
