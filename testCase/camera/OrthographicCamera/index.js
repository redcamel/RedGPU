import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - OrthographicCamera');

redUnit.testGroup(
    'RedGPU.Camera.OrthographicCamera',
    (runner) => {
        runner.defineTest('Success Test: Default Properties', (run) => {
            try {
                const cam = new RedGPU.Camera.OrthographicCamera();
                const checkBoundaries = cam.top === 1 && cam.bottom === -1 && cam.left === -1 && cam.right === 1;
                const checkZoom = cam.zoom === 1 && cam.minZoom === 0.1 && cam.maxZoom === 10;
                const checkClipping = cam.nearClipping === 0.01 && cam.farClipping === 10000;
                run(checkBoundaries && checkZoom && checkClipping);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: Boundaries Setters/Getters', (run) => {
            try {
                const cam = new RedGPU.Camera.OrthographicCamera();
                cam.top = 10; cam.bottom = -10; cam.left = -20; cam.right = 20;
                run(cam.top === 10 && cam.bottom === -10 && cam.left === -20 && cam.right === 20);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: Zoom management', (run) => {
            try {
                const cam = new RedGPU.Camera.OrthographicCamera();
                cam.minZoom = 0.5;
                cam.maxZoom = 5.0;
                cam.zoom = 2.0;
                const check1 = cam.zoom === 2.0;
                cam.setZoom(3.0);
                const check2 = cam.zoom === 3.0;
                run(check1 && check2);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: Boundaries - NaN', (run) => {
            try { new RedGPU.Camera.OrthographicCamera().top = NaN; run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: zoom - out of range', (run) => {
            try {
                const cam = new RedGPU.Camera.OrthographicCamera();
                cam.minZoom = 1;
                cam.maxZoom = 2;
                cam.zoom = 3;
                run(true);
            } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: minZoom - negative', (run) => {
            try { new RedGPU.Camera.OrthographicCamera().minZoom = -1; run(true); } catch (e) { run(false, e); }
        }, false);
    }
);
