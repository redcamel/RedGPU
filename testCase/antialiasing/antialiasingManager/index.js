import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - AntialiasingManager');

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - Initialization',
    (runner) => {
        runner.defineTest('Constructor: useTAA or useMSAA based on devicePixelRatio', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            if (window.devicePixelRatio > 1.0) {
                run(manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false);
            } else {
                run(manager.useTAA === false && manager.useMSAA === true && manager.useFXAA === false);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - TAA',
    (runner) => {
        runner.defineTest('Set useTAA = true', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            manager.useTAA = true;
            run(manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false);
        }, true);
        runner.defineTest('Set useTAA = false', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            manager.useTAA = true;
            manager.useTAA = false;
            run(manager.useTAA === false);
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - MSAA',
    (runner) => {
        runner.defineTest('Set useMSAA = true', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            manager.useMSAA = true;
            run(manager.useMSAA === true && manager.useTAA === false && manager.useFXAA === false);
        }, true);
        runner.defineTest('msaaID update on useMSAA change', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            const oldID = manager.msaaID;
            manager.useMSAA = true;
            run(manager.msaaID !== oldID);
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - FXAA',
    (runner) => {
        runner.defineTest('Set useFXAA = true', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            manager.useFXAA = true;
            run(manager.useFXAA === true && manager.useTAA === false && manager.useMSAA === false);
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager - Exclusive Selection',
    (runner) => {
        runner.defineTest('Switching TAA -> MSAA', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            manager.useTAA = true;
            manager.useMSAA = true;
            run(manager.useTAA === false && manager.useMSAA === true);
        }, true);
        runner.defineTest('Switching MSAA -> FXAA', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            manager.useMSAA = true;
            manager.useFXAA = true;
            run(manager.useMSAA === false && manager.useFXAA === true);
        }, true);
    }
);