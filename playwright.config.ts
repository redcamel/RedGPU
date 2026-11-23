import {defineConfig, devices} from '@playwright/test';

const PORT = 4173;

export default defineConfig({
    testDir: './tests/e2e',
    testMatch: '**/*.spec.ts',
    fullyParallel: false,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    workers: 1,
    reporter: [['list'], ['html', {open: 'never'}]],
    use: {
        baseURL: `http://127.0.0.1:${PORT}`,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium-webgpu',
            use: {
                ...devices['Desktop Chrome'],
                launchOptions: {
                    args: [
                        '--enable-unsafe-webgpu',
                        '--ignore-gpu-blocklist',
                        '--enable-gpu-rasterization',
                    ],
                },
            },
        },
    ],
    webServer: {
        command: `node tests/e2e/fixtures/staticServer.mjs ${PORT}`,
        url: `http://127.0.0.1:${PORT}/tests/e2e/fixtures/webgpu-harness.html`,
        reuseExistingServer: !process.env.CI,
        timeout: 15000,
    },
});
