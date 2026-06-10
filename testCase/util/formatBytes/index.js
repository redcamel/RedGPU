import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util.formatBytes');

redUnit.testGroup(
    'formatBytes(bytes: number, decimals?: number)',
    (runner) => {
        runner.defineTest('Success Test Test: 0 Bytes', (run) => {
            try {
                run(RedGPU.Util.formatBytes(0));
            } catch (e) {
                run(false, e);
            }
        }, '0 Bytes');

        runner.defineTest('Success Test Test: KB', (run) => {
            try {
                run(RedGPU.Util.formatBytes(1024));
            } catch (e) {
                run(false, e);
            }
        }, '1 KB');

        runner.defineTest('Success Test Test: MB', (run) => {
            try {
                run(RedGPU.Util.formatBytes(1048576));
            } catch (e) {
                run(false, e);
            }
        }, '1 MB');

        runner.defineTest('Success Test Test: GB', (run) => {
            try {
                run(RedGPU.Util.formatBytes(1073741824));
            } catch (e) {
                run(false, e);
            }
        }, '1 GB');

        runner.defineTest('Success Test Test: Decimals 0', (run) => {
            try {
                run(RedGPU.Util.formatBytes(1500, 0));
            } catch (e) {
                run(false, e);
            }
        }, '1 KB');

        runner.defineTest('Success Test Test: Negative decimals treated as 0', (run) => {
            try {
                run(RedGPU.Util.formatBytes(1500, -2));
            } catch (e) {
                run(false, e);
            }
        }, '1 KB');

        // Failure Test tests (Negative testing)
        const invalidValues = [
            null, undefined, NaN, '1024', 
            {}, [], true, false,
            -1, 10.5
        ];

        invalidValues.forEach((invalidValue, index) => {
            runner.defineTest(`Failure Test Test: Invalid bytes value [${index}] - ${invalidValue}`, (run) => {
                try {
                    RedGPU.Util.formatBytes(invalidValue);
                    run(true);
                } catch (e) {
                    run(false, e);
                }
            }, false);
        });
    }
);
