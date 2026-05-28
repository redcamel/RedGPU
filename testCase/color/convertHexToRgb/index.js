import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - convertHexToRgb');

redUnit.testGroup(
    'RedGPU.Color.convertHexToRgb',
    (runner) => {
        // Normal Cases
        runner.defineTest('Success: #ffffff to object', (run) => {
            try {
                const res = RedGPU.Color.convertHexToRgb('#ffffff');
                run(res.r === 255 && res.g === 255 && res.b === 255);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: 0xff0000 to array', (run) => {
            try {
                const res = RedGPU.Color.convertHexToRgb(0xff0000, true);
                run(res[0] === 255 && res[1] === 0 && res[2] === 0);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: 3-digit hex #f00', (run) => {
            try {
                const res = RedGPU.Color.convertHexToRgb('#f00');
                run(res.r === 255 && res.g === 0 && res.b === 0);
            } catch (e) { run(false, e); }
        }, true);

        // Rigorous: Negative Testing
        runner.defineTest('Failure: Invalid hex string - "invalid"', (run) => {
            try { RedGPU.Color.convertHexToRgb('invalid'); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: Missing # prefix - "ffffff"', (run) => {
            try { RedGPU.Color.convertHexToRgb('ffffff'); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: Empty string', (run) => {
            try { RedGPU.Color.convertHexToRgb(''); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: null input', (run) => {
            try { RedGPU.Color.convertHexToRgb(null); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: undefined input', (run) => {
            try { RedGPU.Color.convertHexToRgb(undefined); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: NaN input', (run) => {
            try { RedGPU.Color.convertHexToRgb(NaN); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: Too long hex - "#ffffffff"', (run) => {
            try { RedGPU.Color.convertHexToRgb('#ffffffff'); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: Invalid characters - "#gggggg"', (run) => {
            try { RedGPU.Color.convertHexToRgb('#gggggg'); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);
