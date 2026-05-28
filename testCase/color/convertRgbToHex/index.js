import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - convertRgbToHex');

redUnit.testGroup(
    'RedGPU.Color.convertRgbToHex',
    (runner) => {
        // Normal Cases
        runner.defineTest('Success: 255, 255, 255 to #FFFFFF', (run) => {
            try {
                run(RedGPU.Color.convertRgbToHex(255, 255, 255));
            } catch (e) { run(null, e); }
        }, '#FFFFFF');

        runner.defineTest('Success: 0, 128, 255 to #0080FF', (run) => {
            try {
                run(RedGPU.Color.convertRgbToHex(0, 128, 255));
            } catch (e) { run(null, e); }
        }, '#0080FF');

        runner.defineTest('Success: Boundary check (0, 0, 0)', (run) => {
            try {
                run(RedGPU.Color.convertRgbToHex(0, 0, 0));
            } catch (e) { run(null, e); }
        }, '#000000');

        // Rigorous: Negative Testing
        runner.defineTest('Failure: Out of range (256) in R', (run) => {
            try { RedGPU.Color.convertRgbToHex(256, 0, 0); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: Negative value (-1) in G', (run) => {
            try { RedGPU.Color.convertRgbToHex(0, -1, 0); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: NaN in B', (run) => {
            try { RedGPU.Color.convertRgbToHex(0, 0, NaN); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: null in R', (run) => {
            try { RedGPU.Color.convertRgbToHex(null, 0, 0); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: undefined in G', (run) => {
            try { RedGPU.Color.convertRgbToHex(0, undefined, 0); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: string type in B', (run) => {
            try { RedGPU.Color.convertRgbToHex(0, 0, "255"); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: float value in R (should be uint)', (run) => {
            try { RedGPU.Color.convertRgbToHex(127.5, 0, 0); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);
