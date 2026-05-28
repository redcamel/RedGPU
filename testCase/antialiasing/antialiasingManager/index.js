import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - AntialiasingManager');

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - Initialization',
    (runner) => {
        runner.defineTest('Success Test: Default values based on devicePixelRatio', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                if (window.devicePixelRatio > 1.0) {
                    run(manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false);
                } else {
                    run(manager.useTAA === false && manager.useMSAA === true && manager.useFXAA === false);
                }
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test: msaaID is a valid UUID string', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                run(typeof manager.msaaID === 'string' && manager.msaaID.length > 0);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - useTAA',
    (runner) => {
        runner.defineTest('Success Test: Set useTAA = true', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useTAA = true;
                run(manager.useTAA);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test: Set useTAA = false', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useTAA = true;
                manager.useTAA = false;
                run(manager.useTAA);
            } catch (e) {
                run(false, e);
            }
        }, false);

        runner.defineTest('Success Test: useTAA is exclusive (clears MSAA, FXAA)', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useMSAA = true;
                manager.useTAA = true;
                run(manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - useMSAA',
    (runner) => {
        runner.defineTest('Success Test: Set useMSAA = true', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useMSAA = true;
                run(manager.useMSAA);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test: Set useMSAA = false', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useMSAA = true;
                manager.useMSAA = false;
                run(manager.useMSAA);
            } catch (e) {
                run(false, e);
            }
        }, false);

        runner.defineTest('Success Test: useMSAA is exclusive (clears TAA, FXAA)', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useTAA = true;
                manager.useMSAA = true;
                run(manager.useMSAA === true && manager.useTAA === false && manager.useFXAA === false);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test: msaaID changes when useMSAA is set to a different value', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                const initialID = manager.msaaID;
                manager.useMSAA = !manager.useMSAA;
                run(manager.msaaID !== initialID);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - useFXAA',
    (runner) => {
        runner.defineTest('Success Test: Set useFXAA = true', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useFXAA = true;
                run(manager.useFXAA);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test: Set useFXAA = false', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useFXAA = true;
                manager.useFXAA = false;
                run(manager.useFXAA);
            } catch (e) {
                run(false, e);
            }
        }, false);

        runner.defineTest('Success Test: useFXAA is exclusive (clears TAA, MSAA)', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useTAA = true;
                manager.useFXAA = true;
                run(manager.useFXAA === true && manager.useTAA === false && manager.useMSAA === false);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);
