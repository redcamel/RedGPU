import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Color.convertRgbToHex');

redUnit.testGroup(
    'convertRgbToHex(r: number, g: number, b: number)',
    (runner) => {
        // Success Test Cases
        runner.defineTest('Success Test Test: convert red', (run) => {
            try {
                const hex = RedGPU.Color.convertRgbToHex(255, 0, 0);
                run(hex);
            } catch (e) {
                run(false, e);
            }
        }, '#FF0000');

        runner.defineTest('Success Test Test: convert green', (run) => {
            try {
                const hex = RedGPU.Color.convertRgbToHex(0, 255, 0);
                run(hex);
            } catch (e) {
                run(false, e);
            }
        }, '#00FF00');

        runner.defineTest('Success Test Test: convert blue', (run) => {
            try {
                const hex = RedGPU.Color.convertRgbToHex(0, 0, 255);
                run(hex);
            } catch (e) {
                run(false, e);
            }
        }, '#0000FF');

        runner.defineTest('Success Test Test: convert white', (run) => {
            try {
                const hex = RedGPU.Color.convertRgbToHex(255, 255, 255);
                run(hex);
            } catch (e) {
                run(false, e);
            }
        }, '#FFFFFF');

        runner.defineTest('Success Test Test: convert black', (run) => {
            try {
                const hex = RedGPU.Color.convertRgbToHex(0, 0, 0);
                run(hex);
            } catch (e) {
                run(false, e);
            }
        }, '#000000');
        
        runner.defineTest('Success Test Test: mid values', (run) => {
            try {
                const hex = RedGPU.Color.convertRgbToHex(128, 128, 128);
                run(hex);
            } catch (e) {
                run(false, e);
            }
        }, '#808080');

        // Failure Test Cases
        const invalidValues = [
            null, undefined, NaN, 
            {}, [], true, false, 
            '255', -1, 256, 300
        ];

        invalidValues.forEach((invalidValue, index) => {
            runner.defineTest(`Failure Test Test: Invalid R value [${index}] - ${invalidValue}`, (run) => {
                try {
                    RedGPU.Color.convertRgbToHex(invalidValue, 0, 0);
                    run(true);
                } catch (e) {
                    run(false, e);
                }
            }, false);

            runner.defineTest(`Failure Test Test: Invalid G value [${index}] - ${invalidValue}`, (run) => {
                try {
                    RedGPU.Color.convertRgbToHex(0, invalidValue, 0);
                    run(true);
                } catch (e) {
                    run(false, e);
                }
            }, false);

            runner.defineTest(`Failure Test Test: Invalid B value [${index}] - ${invalidValue}`, (run) => {
                try {
                    RedGPU.Color.convertRgbToHex(0, 0, invalidValue);
                    run(true);
                } catch (e) {
                    run(false, e);
                }
            }, false);
        });
    }
);
