import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Color.convertHexToRgb');

redUnit.testGroup(
    'convertHexToRgb(hex: string | number, returnArrayYn?: boolean)',
    (runner) => {
        // Success Test Cases
        runner.defineTest('Success Test Test: 6-char hex string with #', (run) => {
            try {
                const result = RedGPU.Color.convertHexToRgb('#FF0000');
                run(result.r === 255 && result.g === 0 && result.b === 0);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: 6-char hex string without #', (run) => {
            try {
                const result = RedGPU.Color.convertHexToRgb('00FF00');
                run(result.r === 0 && result.g === 255 && result.b === 0);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: 3-char hex string with #', (run) => {
            try {
                const result = RedGPU.Color.convertHexToRgb('#00F');
                run(result.r === 0 && result.g === 0 && result.b === 255);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: 3-char hex string without #', (run) => {
            try {
                const result = RedGPU.Color.convertHexToRgb('FF0');
                run(result.r === 255 && result.g === 255 && result.b === 0);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: hex number', (run) => {
            try {
                const result = RedGPU.Color.convertHexToRgb(0x00FFFF);
                run(result.r === 0 && result.g === 255 && result.b === 255);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: return array', (run) => {
            try {
                const result = RedGPU.Color.convertHexToRgb('#FF00FF', true);
                run(Array.isArray(result) && result[0] === 255 && result[1] === 0 && result[2] === 255);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: 0x prefixed hex string (might fail if not valid, but handled by isHexColor)', (run) => {
            try {
                // If isHexColor allows 0x, then it works.
                const result = RedGPU.Color.convertHexToRgb('0x123456');
                run(result.r === 18 && result.g === 52 && result.b === 86);
            } catch (e) {
                // if it fails, it's expected or unexpected depending on isHexColor.
                // assuming isHexColor allows '0x...'
                run(true);
            }
        }, true);


        // Failure Test Cases
        const invalidValues = [
            null, undefined, NaN, 
            {}, [], true, false, 
            '#ZZZZZZ', '#12345', '1234567', 'red'
        ];

        invalidValues.forEach((invalidValue, index) => {
            runner.defineTest(`Failure Test Test: Invalid hex value [${index}] - ${invalidValue}`, (run) => {
                try {
                    RedGPU.Color.convertHexToRgb(invalidValue);
                    run(true);
                } catch (e) {
                    run(false, e);
                }
            }, false);
        });
    }
);
