import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Core.ACamera');

redUnit.testGroup(
    'RedGPU.Camera.Core.ACamera',
    (runner) => {
        class MockCamera extends RedGPU.Camera.Core.ACamera {
            constructor() { super(); }
        }

        runner.defineTest('Success Test: Default Properties', (run) => {
            try {
                const cam = new MockCamera();
                const checkAperture = cam.aperture === 16.0;
                const checkShutter = cam.shutterSpeed === 1/3200;
                const checkISO = cam.iso === 100;
                const checkAuto = cam.useAutoExposure === true;
                run(checkAperture && checkShutter && checkISO && checkAuto);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: aperture Setter/Getter', (run) => {
            try {
                const cam = new MockCamera();
                cam.aperture = 2.8;
                run(cam.aperture);
            } catch (e) { run(null, e); }
        }, 2.8);

        runner.defineTest('Failure Test: aperture - NaN', (run) => {
            try { new MockCamera().aperture = NaN; run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Success Test: shutterSpeed Setter/Getter', (run) => {
            try {
                const cam = new MockCamera();
                cam.shutterSpeed = 1/125;
                run(cam.shutterSpeed);
            } catch (e) { run(null, e); }
        }, 1/125);

        runner.defineTest('Success Test: iso Setter/Getter', (run) => {
            try {
                const cam = new MockCamera();
                cam.iso = 800;
                run(cam.iso);
            } catch (e) { run(null, e); }
        }, 800);

        runner.defineTest('Success Test: EV100 calculation', (run) => {
            try {
                const cam = new MockCamera();
                cam.useAutoExposure = false;
                cam.aperture = 16.0;
                cam.shutterSpeed = 1/125;
                cam.iso = 100;
                // log2( (16*16 / (1/125)) * (100/100) ) = log2(256 * 125) = log2(32000)
                const expected = Math.log2(16*16 / (1/125));
                run(Math.abs(cam.ev100 - expected) < 0.0001);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: useAutoExposure toggle', (run) => {
            try {
                const cam = new MockCamera();
                cam.useAutoExposure = false;
                const checkOff = cam.useAutoExposure === false && cam.iso === 100;
                cam.useAutoExposure = true;
                const checkOn = cam.useAutoExposure === true;
                run(checkOff && checkOn);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: updateExposure access', (run) => {
            try {
                const cam = new MockCamera();
                cam.updateExposure();
                run(true);
            } catch (e) { run(false, e); }
        }, true);
    }
);
