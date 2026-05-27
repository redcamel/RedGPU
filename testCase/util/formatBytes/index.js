import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - formatBytes');

redUnit.testGroup(
    'RedGPU.Util.formatBytes - Success Cases',
    (runner) => {
        runner.defineTest('0 Bytes', (run) => {
            run(RedGPU.Util.formatBytes(0) === '0 Bytes');
        }, true);

        runner.defineTest('Small value (Bytes)', (run) => {
            run(RedGPU.Util.formatBytes(512) === '512 Bytes');
        }, true);

        runner.defineTest('KB threshold', (run) => {
            run(RedGPU.Util.formatBytes(1024) === '1 KB');
        }, true);

        runner.defineTest('MB threshold', (run) => {
            run(RedGPU.Util.formatBytes(1024 * 1024) === '1 MB');
        }, true);

        runner.defineTest('GB threshold', (run) => {
            run(RedGPU.Util.formatBytes(1024 * 1024 * 1024) === '1 GB');
        }, true);

        runner.defineTest('Decimal precision (default: 2)', (run) => {
            const bytes = 1024 + 512; // 1.5 KB
            run(RedGPU.Util.formatBytes(bytes) === '1.5 KB');
        }, true);

        runner.defineTest('Custom decimal precision', (run) => {
            const bytes = 1234567; // ~1.17737... MB
            // 1234567 / 1024 / 1024 = 1.1773748397827148
            run(RedGPU.Util.formatBytes(bytes, 4) === '1.1774 MB');
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.formatBytes - Failure Cases',
    (runner) => {
        runner.defineTest('Negative value', (run) => {
            try {
                RedGPU.Util.formatBytes(-1);
                run(false);
            } catch (e) {
                run(true);
            }
        }, true);

        runner.defineTest('Float value (should be integer)', (run) => {
            try {
                RedGPU.Util.formatBytes(1024.5);
                run(false);
            } catch (e) {
                run(true);
            }
        }, true);

        runner.defineTest('NaN input', (run) => {
            try {
                RedGPU.Util.formatBytes(NaN);
                run(false);
            } catch (e) {
                run(true);
            }
        }, true);

        runner.defineTest('String input', (run) => {
            try {
                RedGPU.Util.formatBytes("1024");
                run(false);
            } catch (e) {
                run(true);
            }
        }, true);
    }
);