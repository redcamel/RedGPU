import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Camera2D');

redUnit.testGroup(
    'RedGPU.Camera.Camera2D',
    (runner) => {
        runner.defineTest('Success Test: Default Properties', (run) => {
            try {
                const cam = new RedGPU.Camera.Camera2D();
                run(cam.x === 0 && cam.y === 0 && cam.z === 0);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: x, y Setters/Getters', (run) => {
            try {
                const cam = new RedGPU.Camera.Camera2D();
                cam.x = 100;
                cam.y = 200;
                run(cam.x === 100 && cam.y === 200);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: position property', (run) => {
            try {
                const cam = new RedGPU.Camera.Camera2D();
                cam.x = 50; cam.y = 60;
                const pos = cam.position;
                run(pos[0] === 50 && pos[1] === 60 && pos.length === 2);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: viewMatrix reflection', (run) => {
            try {
                const cam = new RedGPU.Camera.Camera2D();
                cam.x = 123; cam.y = 456;
                const mat = cam.viewMatrix;
                // viewMatrix[12] is x, viewMatrix[13] is y
                run(mat[12] === 123 && mat[13] === 456);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: setPosition (coordinates)', (run) => {
            try {
                const cam = new RedGPU.Camera.Camera2D();
                cam.setPosition(10, 20);
                run(cam.x === 10 && cam.y === 20);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: setPosition (array)', (run) => {
            try {
                const cam = new RedGPU.Camera.Camera2D();
                cam.setPosition([30, 40, 0]);
                run(cam.x === 30 && cam.y === 40);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: z property (read-only 0)', (run) => {
            try {
                const cam = new RedGPU.Camera.Camera2D();
                run(cam.z);
            } catch (e) { run(null, e); }
        }, 0);
    }
);
