import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - AntialiasingManager');

redUnit.testGroup(
    'RedGPU.Antialiasing.AntialiasingManager',
    (runner) => {
        runner.defineTest('Constructor initialization (devicePixelRatio check)', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            if (window.devicePixelRatio > 1.0) {
                run(manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false);
            } else {
                run(manager.useTAA === false && manager.useMSAA === true && manager.useFXAA === false);
            }
        }, true);

        runner.defineTest('useTAA setter/getter', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            manager.useTAA = true;
            const check1 = manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false;
            manager.useTAA = false;
            const check2 = manager.useTAA === false;
            run(check1 && check2);
        }, true);

        runner.defineTest('useMSAA setter/getter', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            const oldMSAAID = manager.msaaID;
            manager.useMSAA = true;
            const check1 = manager.useMSAA === true && manager.useTAA === false && manager.useFXAA === false;
            const check2 = manager.msaaID !== oldMSAAID;
            manager.useMSAA = false;
            const check3 = manager.useMSAA === false;
            run(check1 && check2 && check3);
        }, true);

        runner.defineTest('useFXAA setter/getter', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            manager.useFXAA = true;
            const check1 = manager.useFXAA === true && manager.useTAA === false && manager.useMSAA === false;
            manager.useFXAA = false;
            const check2 = manager.useFXAA === false;
            run(check1 && check2);
        }, true);

        runner.defineTest('Exclusive selection (setting one clears others)', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            
            manager.useTAA = true;
            const check1 = manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false;
            
            manager.useMSAA = true;
            const check2 = manager.useTAA === false && manager.useMSAA === true && manager.useFXAA === false;
            
            manager.useFXAA = true;
            const check3 = manager.useTAA === false && manager.useMSAA === false && manager.useFXAA === true;
            
            run(check1 && check2 && check3);
        }, true);

        runner.defineTest('msaaID uniqueness on change', (run) => {
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            const ids = new Set();
            
            manager.useMSAA = true;
            ids.add(manager.msaaID);
            
            manager.useMSAA = false;
            
            manager.useMSAA = true;
            ids.add(manager.msaaID);
            
            run(ids.size === 2);
        }, true);
    }
);