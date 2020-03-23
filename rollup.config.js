/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.23 18:29:56
 *
 */

import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
import strip from '@rollup/plugin-strip';
const config ={
    input: 'src/RedGPU.js',
    output: [
        {
            file: 'dist/RedGPU.min.mjs',
            format: 'es',
            name : 'RedGPU'
        }
    ],
    plugins: [
        resolve(),
        babel({
            plugins: ["@babel/plugin-proposal-class-properties"],
            exclude: 'node_modules/**' // only transpile our source code
        }),
        strip({}),
        terser({
            module: true,
            mangle: {
                reserved: ['Rich']
            },
            // toplevel:true,
            // keep_classnames:true,
            keep_fnames :true
        })
    ]
};

export default config