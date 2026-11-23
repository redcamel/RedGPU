import {defineConfig} from 'vitest/config';

function rawWgslPlugin() {
    return {
        name: 'redgpu-raw-wgsl',
        transform(code: string, id: string) {
            if (id.endsWith('.wgsl')) {
                return {
                    code: `export default ${JSON.stringify(code)};`,
                    map: null,
                };
            }
        },
    };
}

export default defineConfig({
    plugins: [rawWgslPlugin()],
    resolve: {
        extensions: ['.ts', '.mts', '.js', '.mjs', '.json'],
    },
    test: {
        include: ['tests/unit/**/*.test.ts'],
        environment: 'node',
        globals: false,
    },
});
