import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - PerspectiveCamera');

redUnit.testGroup(
    'PerspectiveCamera Default Values Test (UE5 Defaults)',
    (runner) => {
        runner.defineTest('Check ISO Default Value (100)', (run) => {
            const camera = new RedGPU.Camera.PerspectiveCamera();
            run(camera.iso === 100);
        }, true);

        runner.defineTest('Check Aperture Default Value (2.8)', (run) => {
            const camera = new RedGPU.Camera.PerspectiveCamera();
            run(camera.aperture === 2.8);
        }, true);

        runner.defineTest('Check Shutter Speed Default Value (1/60)', (run) => {
            const camera = new RedGPU.Camera.PerspectiveCamera();
            // Floating point comparison might be tricky, but 1/60 is a simple fraction
            run(Math.abs(camera.shutterSpeed - (1 / 60)) < 0.0001);
        }, true);
    }
);
