import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Color.convertHexToRgb');

redUnit.testGroup(
    'RedGPU.Color.convertHexToRgb',
    (runner) => {
        // Success Cases: '#' Prefixed Strings
        runner.defineTest('Success: #fff', (run) => {
            try {
                const res = RedGPU.Color.convertHexToRgb('#fff');
                run(res.r === 255 && res.g === 255 && res.b === 255);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: #ffffff', (run) => {
            try {
                const res = RedGPU.Color.convertHexToRgb('#ffffff');
                run(res.r === 255 && res.g === 255 && res.b === 255);
            } catch (e) { run(false, e); }
        }, true);

        // Success Cases: Numbers
        runner.defineTest('Success: Number (0xfff)', (run) => {
            try {
                const res = RedGPU.Color.convertHexToRgb(0xfff);
                run(res.r === 0 && res.g === 15 && res.b === 255);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: Number (0xffffff)', (run) => {
            try {
                const res = RedGPU.Color.convertHexToRgb(0xffffff);
                run(res.r === 255 && res.g === 255 && res.b === 255);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: Number with leading zeros (0x00FF00)', (run) => {
            try {
                const res = RedGPU.Color.convertHexToRgb(0x00FF00);
                run(res.r === 0 && res.g === 255 && res.b === 0);
            } catch (e) { run(false, e); }
        }, true);

        // Failure Cases: Stricter Rules
        runner.defineTest('Failure: String with 0x prefix ("0xfff")', (run) => {
            try { RedGPU.Color.convertHexToRgb('0xfff'); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: String with 0x prefix ("0xffffff")', (run) => {
            try { RedGPU.Color.convertHexToRgb('0xffffff'); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: String without prefix ("ffffff")', (run) => {
            try { RedGPU.Color.convertHexToRgb('ffffff'); run(true); } catch (e) { run(false, e); }
        }, false);

        // Failure Cases: Other invalid inputs
        runner.defineTest('Failure: NaN', (run) => {
            try { RedGPU.Color.convertHexToRgb(NaN); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: null', (run) => {
            try { RedGPU.Color.convertHexToRgb(null); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: undefined', (run) => {
            try { RedGPU.Color.convertHexToRgb(undefined); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);
