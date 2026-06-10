import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - File');

redUnit.testGroup(
    'RedGPU.Util.getFilePath',
    (runner) => {
        runner.defineTest('Success Test: Valid URL', (run) => {
            run(RedGPU.Util.getFilePath('https://example.com/assets/textures/diffuse.png'));
        }, 'https://example.com/assets/textures/');

        runner.defineTest('Failure Test: Empty string', (run) => {
            try { RedGPU.Util.getFilePath(''); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: NaN', (run) => {
            try { RedGPU.Util.getFilePath(NaN); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: null', (run) => {
            try { RedGPU.Util.getFilePath(null); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Util.getFileName',
    (runner) => {
        runner.defineTest('Success Test: Valid path', (run) => {
            run(RedGPU.Util.getFileName('path/to/image.png'));
        }, 'image.png');

        runner.defineTest('Failure Test: null', (run) => {
            try { RedGPU.Util.getFileName(null); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Util.getFileExtension',
    (runner) => {
        runner.defineTest('Success Test: Lowercase check', (run) => {
            run(RedGPU.Util.getFileExtension('IMAGE.PNG'));
        }, 'png');

        runner.defineTest('Failure Test: No extension', (run) => {
            run(RedGPU.Util.getFileExtension('filename'));
        }, '');

        runner.defineTest('Failure Test: undefined', (run) => {
            try { RedGPU.Util.getFileExtension(undefined); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Util.getAbsoluteURL',
    (runner) => {
        runner.defineTest('Success: Resolve relative path', (run) => {
            run(RedGPU.Util.getAbsoluteURL('https://example.com/path/', 'image.png'));
        }, 'https://example.com/path/image.png');

        runner.defineTest('Success: With URL object as base', (run) => {
            const base = new URL('https://example.com/path/');
            run(RedGPU.Util.getAbsoluteURL(base, 'image.png'));
        }, 'https://example.com/path/image.png');

        runner.defineTest('Success: Parent directory traversal (../)', (run) => {
            run(RedGPU.Util.getAbsoluteURL('https://example.com/a/b/', '../image.png'));
        }, 'https://example.com/a/image.png');

        runner.defineTest('Failure: null base', (run) => {
            try { RedGPU.Util.getAbsoluteURL(null, 'file.txt'); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: empty relative', (run) => {
            try { RedGPU.Util.getAbsoluteURL('https://a.com', ''); run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure: invalid URL combination', (run) => {
            try { RedGPU.Util.getAbsoluteURL('invalid-base', 'relative'); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);
