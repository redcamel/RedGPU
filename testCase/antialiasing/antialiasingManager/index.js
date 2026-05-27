import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - AntialiasingManager');

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - Initialization',
    (runner) => {
        runner.defineTest('Success: Constructor initialization', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                let pass = false;
                if (window.devicePixelRatio > 1.0) {
                    pass = (manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false);
                } else {
                    pass = (manager.useTAA === false && manager.useMSAA === true && manager.useFXAA === false);
                }
                if (pass) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - TAA',
    (runner) => {
        runner.defineTest('Success: Set useTAA = true', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useTAA = true;
                if (manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);
        runner.defineTest('Success: Set useTAA = false', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useTAA = true;
                manager.useTAA = false;
                if (manager.useTAA === false) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - MSAA',
    (runner) => {
        runner.defineTest('Success: Set useMSAA = true', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useMSAA = true;
                if (manager.useMSAA === true && manager.useTAA === false && manager.useFXAA === false) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);
        runner.defineTest('Success: msaaID update on change', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                const oldID = manager.msaaID;
                manager.useMSAA = !manager.useMSAA;
                if (manager.msaaID !== oldID) run(true);
                else run(false);
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
                if (manager.useFXAA === true && manager.useTAA === false && manager.useMSAA === false) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - Exclusive Selection',
    (runner) => {
        runner.defineTest('Success: Switching TAA -> MSAA', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useTAA = true;
                manager.useMSAA = true;
                if (manager.useTAA === false && manager.useMSAA === true) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);
        runner.defineTest('Success: Switching MSAA -> FXAA', (run) => {
            try {
                const manager = new RedGPU.Antialiasing.AntialiasingManager();
                manager.useMSAA = true;
                manager.useFXAA = true;
                if (manager.useMSAA === false && manager.useFXAA === true) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);
    }
);