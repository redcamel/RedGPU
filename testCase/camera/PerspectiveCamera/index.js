import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - PerspectiveCamera');

redUnit.testGroup(
    'RedGPU.Camera.PerspectiveCamera',
    (runner) => {
        runner.defineTest('Success Test: Default Properties', (run) => {
            try {
                const cam = new RedGPU.Camera.PerspectiveCamera();
                const checkPos = cam.x === 0 && cam.y === 0 && cam.z === 0;
                const checkRot = cam.rotationX === 0 && cam.rotationY === 0 && cam.rotationZ === 0;
                const checkFOV = cam.fieldOfView === 60;
                const checkClipping = cam.nearClipping === 0.01 && cam.farClipping === 100000;
                run(checkPos && checkRot && checkFOV && checkClipping);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: x, y, z Setters/Getters', (run) => {
            try {
                const cam = new RedGPU.Camera.PerspectiveCamera();
                cam.x = 1; cam.y = 2; cam.z = 3;
                run(cam.x === 1 && cam.y === 2 && cam.z === 3);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: rotationX, rotationY, rotationZ Setters/Getters', (run) => {
            try {
                const cam = new RedGPU.Camera.PerspectiveCamera();
                cam.rotationX = 0.5; cam.rotationY = 1.0; cam.rotationZ = 1.5;
                run(cam.rotationX === 0.5 && cam.rotationY === 1.0 && cam.rotationZ === 1.5);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: fieldOfView, nearClipping, farClipping Setters/Getters', (run) => {
            try {
                const cam = new RedGPU.Camera.PerspectiveCamera();
                cam.fieldOfView = 75;
                cam.nearClipping = 0.1;
                cam.farClipping = 5000;
                run(cam.fieldOfView === 75 && cam.nearClipping === 0.1 && cam.farClipping === 5000);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: fieldOfView - NaN', (run) => {
            try { new RedGPU.Camera.PerspectiveCamera().fieldOfView = NaN; run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Success Test: position property', (run) => {
            try {
                const cam = new RedGPU.Camera.PerspectiveCamera();
                cam.setPosition(10, 20, 30);
                const pos = cam.position;
                run(pos[0] === 10 && pos[1] === 20 && pos[2] === 30);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: lookAt method', (run) => {
            try {
                const cam = new RedGPU.Camera.PerspectiveCamera();
                cam.setPosition(0, 0, 10);
                cam.lookAt(0, 0, 0); // Pointing towards origin
                run(true); // lookAt modifies viewMatrix internally
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: viewMatrix access', (run) => {
            try {
                const cam = new RedGPU.Camera.PerspectiveCamera();
                run(cam.viewMatrix instanceof Float32Array && cam.viewMatrix.length === 16);
            } catch (e) { run(false, e); }
        }, true);
    }
);
