import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - AntialiasingManager');

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - Initialization',
    (runner) => {
        runner.defineTest('Success: Constructor: check useTAA logic', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                const expectedTAA = window.devicePixelRatio > 1.0;
                run(manager.useTAA);
            } catch (e) {
                run(e);
            }
        }, window.devicePixelRatio > 1.0);

        runner.defineTest('Success: Constructor: check useMSAA logic', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                const expectedMSAA = window.devicePixelRatio <= 1.0;
                run(manager.useMSAA);
            } catch (e) {
                run(e);
            }
        }, window.devicePixelRatio <= 1.0);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - TAA',
    (runner) => {
        runner.defineTest('Success: Set useTAA = true', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useTAA = true;
                run(manager.useTAA);
            } catch (e) {
                run(e);
            }
        }, true);
        runner.defineTest('Success: Set useTAA = false', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useTAA = true;
                manager.useTAA = false;
                run(manager.useTAA);
            } catch (e) {
                run(e);
            }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - MSAA',
    (runner) => {
        runner.defineTest('Success: Set useMSAA = true', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useMSAA = true;
                run(manager.useMSAA);
            } catch (e) {
                run(e);
            }
        }, true);
        runner.defineTest('Success: msaaID uniqueness check', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                const oldID = manager.msaaID;
                manager.useMSAA = !manager.useMSAA;
                run(manager.msaaID !== oldID);
            } catch (e) {
                run(e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - FXAA',
    (runner) => {
        runner.defineTest('Success: Set useFXAA = true', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useFXAA = true;
                run(manager.useFXAA);
            } catch (e) {
                run(e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - Exclusive Selection',
    (runner) => {
        runner.defineTest('Success: Switching TAA -> MSAA clears TAA', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useTAA = true;
                manager.useMSAA = true;
                run(manager.useTAA);
            } catch (e) {
                run(e);
            }
        }, false);
        runner.defineTest('Success: Switching MSAA -> FXAA clears MSAA', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useMSAA = true;
                manager.useFXAA = true;
                run(manager.useMSAA);
            } catch (e) {
                run(e);
            }
        }, false);
    }
);