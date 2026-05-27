import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - File');

redUnit.testGroup(
    'RedGPU.Util.getFilePath',
    (runner) => {
        runner.defineTest('Standard URL', (run) => {
            const url = 'https://example.com/assets/textures/diffuse.png';
            run(RedGPU.Util.getFilePath(url) === 'https://example.com/assets/textures/');
        }, true);

        runner.defineTest('Path without filename (ending in /)', (run) => {
            const url = 'https://example.com/assets/';
            run(RedGPU.Util.getFilePath(url) === 'https://example.com/assets/');
        }, true);

        runner.defineTest('Filename only', (run) => {
            const url = 'diffuse.png';
            run(RedGPU.Util.getFilePath(url) === '');
        }, true);

        runner.defineTest('Empty string failure', (run) => {
            try {
                RedGPU.Util.getFilePath('');
                run(false);
            } catch (e) {
                run(true);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.getFileName',
    (runner) => {
        runner.defineTest('With extension (default)', (run) => {
            const url = 'path/to/image.png';
            run(RedGPU.Util.getFileName(url) === 'image.png');
        }, true);

        runner.defineTest('Without extension', (run) => {
            const url = 'path/to/image.png';
            run(RedGPU.Util.getFileName(url, false) === 'image');
        }, true);

        runner.defineTest('No extension in filename', (run) => {
            const url = 'path/to/README';
            run(RedGPU.Util.getFileName(url) === 'README');
        }, true);

        runner.defineTest('Multiple dots in filename', (run) => {
            const url = 'path/to/archive.tar.gz';
            run(RedGPU.Util.getFileName(url, false) === 'archive.tar');
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.getFileExtension',
    (runner) => {
        runner.defineTest('Standard extension', (run) => {
            const url = 'https://example.com/assets/model.gltf';
            run(RedGPU.Util.getFileExtension(url) === 'gltf');
        }, true);

        runner.defineTest('Case sensitivity (lowercase conversion)', (run) => {
            const url = 'IMAGE.PNG';
            run(RedGPU.Util.getFileExtension(url) === 'png');
        }, true);

        runner.defineTest('No extension', (run) => {
            const url = 'path/to/README';
            run(RedGPU.Util.getFileExtension(url) === '');
        }, true);

        runner.defineTest('Multiple dots', (run) => {
            const url = 'archive.tar.gz';
            run(RedGPU.Util.getFileExtension(url) === 'gz');
        }, true);

        runner.defineTest('Empty string failure', (run) => {
            try {
                RedGPU.Util.getFileExtension('');
                run(false);
            } catch (e) {
                run(true);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.getAbsoluteURL',
    (runner) => {
        runner.defineTest('Basic relative path', (run) => {
            const base = 'https://example.com/path/';
            const relative = 'image.png';
            run(RedGPU.Util.getAbsoluteURL(base, relative) === 'https://example.com/path/image.png');
        }, true);

        runner.defineTest('Parent directory relative path', (run) => {
            const base = 'https://example.com/path/sub/';
            const relative = '../image.png';
            run(RedGPU.Util.getAbsoluteURL(base, relative) === 'https://example.com/path/image.png');
        }, true);

        runner.defineTest('Absolute relative path', (run) => {
            const base = 'https://example.com/path/';
            const relative = '/root.png';
            run(RedGPU.Util.getAbsoluteURL(base, relative) === 'https://example.com/root.png');
        }, true);

        runner.defineTest('Invalid base (return relative)', (run) => {
            const base = 'invalid-base';
            const relative = 'image.png';
            run(RedGPU.Util.getAbsoluteURL(base, relative) === 'image.png');
        }, true);
    }
);