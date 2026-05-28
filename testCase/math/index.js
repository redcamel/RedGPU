import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Math');

redUnit.testGroup(
    'RedGPU.Math.Ray',
    (runner) => {
        runner.defineTest('Success: Constructor defaults', (run) => {
            try {
                const ray = new RedGPU.Math.Ray();
                run(ray.origin[0] === 0 && ray.origin[1] === 0 && ray.origin[2] === 0 &&
                    ray.direction[0] === 0 && ray.direction[1] === 0 && ray.direction[2] === -1);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: Custom constructor', (run) => {
            try {
                const ray = new RedGPU.Math.Ray([1, 2, 3], [0, 1, 0]);
                run(ray.origin[0] === 1 && ray.origin[1] === 2 && ray.origin[2] === 3 &&
                    ray.direction[0] === 0 && ray.direction[1] === 1 && ray.direction[2] === 0);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: clone()', (run) => {
            try {
                const ray = new RedGPU.Math.Ray([1, 2, 3], [0, 1, 0]);
                const clone = ray.clone();
                run(clone !== ray && clone.origin[0] === 1 && clone.direction[1] === 1);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: applyMatrix4()', (run) => {
            try {
                const ray = new RedGPU.Math.Ray([0, 0, 0], [1, 0, 0]);
                const mtx = RedGPU.Math.mat4.create();
                RedGPU.Math.mat4.translate(mtx, mtx, [10, 0, 0]);
                ray.applyMatrix4(mtx);
                run(ray.origin[0] === 10 && ray.direction[0] === 1);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: intersectBox() - Hit', (run) => {
            try {
                const ray = new RedGPU.Math.Ray([0, 0, 5], [0, 0, -1]);
                const box = { minX: -1, minY: -1, minZ: -1, maxX: 1, maxY: 1, maxZ: 1 };
                run(ray.intersectBox(box));
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: intersectBox() - Miss', (run) => {
            try {
                const ray = new RedGPU.Math.Ray([0, 5, 5], [0, 0, -1]);
                const box = { minX: -1, minY: -1, minZ: -1, maxX: 1, maxY: 1, maxZ: 1 };
                run(ray.intersectBox(box));
            } catch (e) { run(true, e); }
        }, false);

        runner.defineTest('Success: intersectTriangle() - Hit', (run) => {
            try {
                const ray = new RedGPU.Math.Ray([0, 0, 5], [0, 0, -1]);
                const v0 = [-1, -1, 0], v1 = [1, -1, 0], v2 = [0, 1, 0];
                const pt = ray.intersectTriangle(v0, v1, v2);
                run(pt !== null && pt[0] === 0 && pt[1] === 0 && pt[2] === 0);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: intersectTriangleBarycentric() - Hit', (run) => {
            try {
                const ray = new RedGPU.Math.Ray([0, 0, 5], [0, 0, -1]);
                const v0 = [-1, -1, 0], v1 = [1, -1, 0], v2 = [0, 1, 0];
                const res = ray.intersectTriangleBarycentric(v0, v1, v2);
                run(res !== null && res.point[2] === 0 && typeof res.u === 'number');
            } catch (e) { run(false, e); }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Math.Coordinates',
    (runner) => {
        runner.defineTest('Success: localToWorld', (run) => {
            try {
                const mtx = RedGPU.Math.mat4.create();
                RedGPU.Math.mat4.translate(mtx, mtx, [10, 0, 0]);
                const res = RedGPU.Math.localToWorld(mtx, 5, 0, 0);
                run(res[0] === 15 && res[1] === 0 && res[2] === 0);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure: localToWorld - NaN', (run) => {
            try {
                const mtx = RedGPU.Math.mat4.create();
                RedGPU.Math.localToWorld(mtx, NaN, 0, 0);
                run(true);
            } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Success: worldToLocal', (run) => {
            try {
                const mtx = RedGPU.Math.mat4.create();
                RedGPU.Math.mat4.translate(mtx, mtx, [10, 0, 0]);
                const res = RedGPU.Math.worldToLocal(mtx, 15, 0, 0);
                // Due to floating point math, check approximate
                run(Math.abs(res[0] - 5) < 0.0001 && res[1] === 0 && res[2] === 0);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure: worldToLocal - NaN', (run) => {
            try {
                const mtx = RedGPU.Math.mat4.create();
                RedGPU.Math.worldToLocal(mtx, NaN, 0, 0);
                run(true);
            } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Success: getScreenPoint access', (run) => {
            try {
                // Testing actual View3D conversion requires context setup.
                // We test failure on invalid view first.
                RedGPU.Math.getScreenPoint({}, RedGPU.Math.mat4.create());
                run(true);
            } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Math.Utilities',
    (runner) => {
        runner.defineTest('Success: matToEuler', (run) => {
            try {
                const mtx = RedGPU.Math.mat4.create();
                RedGPU.Math.mat4.rotateX(mtx, mtx, Math.PI / 2);
                const euler = RedGPU.Math.matToEuler(mtx, [0, 0, 0], 'XYZ');
                run(Math.abs(euler[0] - Math.PI / 2) < 0.0001);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: quaternionToRotationMat4', (run) => {
            try {
                const q = [0, 0, 0, 1]; // Identity
                const mtx = RedGPU.Math.mat4.create();
                RedGPU.Math.quaternionToRotationMat4(q, mtx);
                run(mtx[0] === 1 && mtx[5] === 1 && mtx[10] === 1 && mtx[15] === 1);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: computeViewFrustumPlanes', (run) => {
            try {
                const proj = RedGPU.Math.mat4.create();
                const view = RedGPU.Math.mat4.create();
                const planes = RedGPU.Math.computeViewFrustumPlanes(proj, view);
                run(Array.isArray(planes) && planes.length === 6 && planes[0].length === 4);
            } catch (e) { run(false, e); }
        }, true);
    }
);
