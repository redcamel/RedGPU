import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - File');

redUnit.testGroup(
    'RedGPU.Util.getFilePath',
    (runner) => {
        runner.defineTest('Success: Standard URL', (run) => {
            try {
                const url = 'https://example.com/assets/textures/diffuse.png';
                if (RedGPU.Util.getFilePath(url) === 'https://example.com/assets/textures/') run(true);
                else run(false);
            } catch (e) { run(e); }
        }, true);

        runner.defineTest('Success: Filename only', (run) => {
            try {
                const url = 'diffuse.png';
                if (RedGPU.Util.getFilePath(url) === '') run(true);
                else run(false);
            } catch (e) { run(e); }
        }, true);

        runner.defineTest('Failure: Empty string URL', (run) => {
            try { RedGPU.Util.getFilePath(''); run(true); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Util.getFileName',
    (runner) => {
        runner.defineTest('Success: With extension', (run) => {
            try { if (RedGPU.Util.getFileName('path/to/image.png') === 'image.png') run(true); else run(false); } catch (e) { run(e); }
        }, true);

        runner.defineTest('Success: Without extension', (run) => {
            try { if (RedGPU.Util.getFileName('path/to/image.png', false) === 'image') run(true); else run(false); } catch (e) { run(e); }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.getFileExtension',
    (runner) => {
        runner.defineTest('Success: Standard extension', (run) => {
            try { if (RedGPU.Util.getFileExtension('model.gltf') === 'gltf') run(true); else run(false); } catch (e) { run(e); }
        }, true);

        runner.defineTest('Success: Case sensitivity', (run) => {
            try { if (RedGPU.Util.getFileExtension('IMAGE.PNG') === 'png') run(true); else run(false); } catch (e) { run(e); }
        }, true);

        runner.defineTest('Failure: Empty string URL', (run) => {
            try { RedGPU.Util.getFileExtension(''); run(true); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Util.getAbsoluteURL',
    (runner) => {
        runner.defineTest('Success: Basic relative', (run) => {
            try {
                const base = 'https://example.com/path/';
                const relative = 'image.png';
                if (RedGPU.Util.getAbsoluteURL(base, relative) === 'https://example.com/path/image.png') run(true);
                else run(false);
            } catch (e) { run(e); }
        }, true);

        runner.defineTest('Success: Parent directory', (run) => {
            try {
                const base = 'https://example.com/path/sub/';
                const relative = '../image.png';
                if (RedGPU.Util.getAbsoluteURL(base, relative) === 'https://example.com/path/image.png') run(true);
                else run(false);
            } catch (e) { run(e); }
        }, true);
    }
);