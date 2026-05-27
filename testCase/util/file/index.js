import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - File');

redUnit.testGroup(
    'RedGPU.Util.getFilePath',
    (runner) => {
        runner.defineTest('Success: Standard URL path check', (run) => {
            try {
                const url = 'https://example.com/assets/textures/diffuse.png';
                run(RedGPU.Util.getFilePath(url));
            } catch (e) { run(e); }
        }, 'https://example.com/assets/textures/');

        runner.defineTest('Failure: Empty string URL', (run) => {
            try { RedGPU.Util.getFilePath(''); run(true); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Util.getFileName',
    (runner) => {
        runner.defineTest('Success: With extension check', (run) => {
            try { run(RedGPU.Util.getFileName('path/to/image.png')); } catch (e) { run(e); }
        }, 'image.png');
    }
);

redUnit.testGroup(
    'RedGPU.Util.getFileExtension',
    (runner) => {
        runner.defineTest('Success: lower-case extension check', (run) => {
            try { run(RedGPU.Util.getFileExtension('IMAGE.PNG')); } catch (e) { run(e); }
        }, 'png');
    }
);

redUnit.testGroup(
    'RedGPU.Util.getAbsoluteURL',
    (runner) => {
        runner.defineTest('Success: Basic relative resolution', (run) => {
            try {
                const base = 'https://example.com/path/';
                const relative = 'image.png';
                run(RedGPU.Util.getAbsoluteURL(base, relative));
            } catch (e) { run(e); }
        }, 'https://example.com/path/image.png');
    }
);