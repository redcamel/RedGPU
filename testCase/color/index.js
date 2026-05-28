import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Color');

redUnit.testGroup(
    'RedGPU.Color.ColorRGB',
    (runner) => {
        // Exhaustive: Constructor & Defaults
        runner.defineTest('Success: Default constructor', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB();
                run(color.r === 255 && color.g === 255 && color.b === 255);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: Custom constructor', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB(100, 150, 200);
                run(color.r === 100 && color.g === 150 && color.b === 200);
            } catch (e) { run(false, e); }
        }, true);

        // Exhaustive: Getters & Setters
        runner.defineTest('Success: Setters and Getters (r, g, b)', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB();
                color.r = 10; color.g = 20; color.b = 30;
                run(color.r === 10 && color.g === 20 && color.b === 30);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: rgb property', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB(1, 2, 3);
                const rgb = color.rgb;
                run(rgb[0] === 1 && rgb[1] === 2 && rgb[2] === 3);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: rgbNormal property', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB(255, 128, 0);
                const normal = color.rgbNormal;
                run(normal[0] === 1 && Math.abs(normal[1] - 128 / 255) < 0.0001 && normal[2] === 0);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: rgbNormalLinear property', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB(255, 128, 0);
                const linear = color.rgbNormalLinear;
                const expectedG = Math.pow(128 / 255, 2.2);
                run(linear[0] === 1 && Math.abs(linear[1] - expectedG) < 0.0001 && linear[2] === 0);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: hex property', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB(255, 0, 255);
                run(color.hex);
            } catch (e) { run(null, e); }
        }, '#FF00FF');

        // Exhaustive: Methods
        runner.defineTest('Success: setColorByRGB', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB();
                color.setColorByRGB(50, 60, 70);
                run(color.r === 50 && color.g === 60 && color.b === 70);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: setColorByHEX (string)', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB();
                color.setColorByHEX('#00FF00');
                run(color.hex);
            } catch (e) { run(null, e); }
        }, '#00FF00');

        runner.defineTest('Success: setColorByRGBString', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB();
                color.setColorByRGBString('rgb(10, 20, 30)');
                run(color.r === 10 && color.g === 20 && color.b === 30);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: onChange callback', (run) => {
            try {
                let called = 0;
                const color = new RedGPU.Color.ColorRGB(255, 255, 255, () => called++);
                color.r = 0;
                color.setColorByRGB(1, 2, 3);
                color.setColorByHEX('#ffffff');
                run(called);
            } catch (e) { run(null, e); }
        }, 3);

        // Rigorous: Negative Testing (r, g, b)
        runner.defineTest('Failure: r setter - NaN', (run) => {
            try { const c = new RedGPU.Color.ColorRGB(); c.r = NaN; run(true); } catch (e) { run(false, e); }
        }, false);
        runner.defineTest('Failure: g setter - null', (run) => {
            try { const c = new RedGPU.Color.ColorRGB(); c.g = null; run(true); } catch (e) { run(false, e); }
        }, false);
        runner.defineTest('Failure: b setter - out of range (256)', (run) => {
            try { const c = new RedGPU.Color.ColorRGB(); c.b = 256; run(true); } catch (e) { run(false, e); }
        }, false);
        runner.defineTest('Failure: r setter - negative (-1)', (run) => {
            try { const c = new RedGPU.Color.ColorRGB(); c.r = -1; run(true); } catch (e) { run(false, e); }
        }, false);
        runner.defineTest('Failure: b setter - wrong type (string)', (run) => {
            try { const c = new RedGPU.Color.ColorRGB(); c.b = "100"; run(true); } catch (e) { run(false, e); }
        }, false);
        runner.defineTest('Failure: r setter - float value (127.5)', (run) => {
            try { const c = new RedGPU.Color.ColorRGB(); c.r = 127.5; run(true); } catch (e) { run(false, e); }
        }, false);

        // Rigorous: Negative Testing (Methods)
        runner.defineTest('Failure: setColorByRGB - NaN in G', (run) => {
            try { new RedGPU.Color.ColorRGB().setColorByRGB(0, NaN, 0); run(true); } catch (e) { run(false, e); }
        }, false);
        runner.defineTest('Failure: setColorByHEX - invalid string', (run) => {
            try { new RedGPU.Color.ColorRGB().setColorByHEX('not-a-color'); run(true); } catch (e) { run(false, e); }
        }, false);
        runner.defineTest('Failure: setColorByRGBString - invalid format', (run) => {
            try { new RedGPU.Color.ColorRGB().setColorByRGBString('rgba(0,0,0,1)'); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Color.ColorRGBA',
    (runner) => {
        // Exhaustive: Constructor & Defaults
        runner.defineTest('Success: Default constructor', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA();
                run(color.r === 255 && color.g === 255 && color.b === 255 && color.a === 1);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: Custom constructor', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA(100, 150, 200, 0.5);
                run(color.r === 100 && color.g === 150 && color.b === 200 && color.a === 0.5);
            } catch (e) { run(false, e); }
        }, true);

        // Exhaustive: Getters & Setters
        runner.defineTest('Success: a setter/getter', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA();
                color.a = 0.2;
                run(color.a);
            } catch (e) { run(null, e); }
        }, 0.2);

        runner.defineTest('Success: rgba property', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA(10, 20, 30, 0.4);
                const rgba = color.rgba;
                run(rgba[0] === 10 && rgba[1] === 20 && rgba[2] === 30 && rgba[3] === 0.4);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: rgbaNormal property', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA(255, 0, 0, 0.5);
                const normal = color.rgbaNormal;
                run(normal[0] === 1 && normal[1] === 0 && normal[2] === 0 && normal[3] === 0.5);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: rgbaNormalLinear property', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA(255, 0, 0, 0.5);
                const linear = color.rgbaNormalLinear;
                run(linear[0] === 1 && linear[1] === 0 && linear[2] === 0 && linear[3] === 0.5);
            } catch (e) { run(false, e); }
        }, true);

        // Exhaustive: Methods
        runner.defineTest('Success: setColorByRGBA', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA();
                color.setColorByRGBA(1, 2, 3, 0.1);
                run(color.r === 1 && color.g === 2 && color.b === 3 && color.a === 0.1);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success: setColorByRGBAString', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA();
                color.setColorByRGBAString('rgba(10, 20, 30, 0.5)');
                run(color.r === 10 && color.g === 20 && color.b === 30 && color.a === 0.5);
            } catch (e) { run(false, e); }
        }, true);

        // Rigorous: Negative Testing
        runner.defineTest('Failure: a setter - NaN', (run) => {
            try { const c = new RedGPU.Color.ColorRGBA(); c.a = NaN; run(true); } catch (e) { run(false, e); }
        }, false);
        runner.defineTest('Failure: a setter - out of range (1.1)', (run) => {
            try { const c = new RedGPU.Color.ColorRGBA(); c.a = 1.1; run(true); } catch (e) { run(false, e); }
        }, false);
        runner.defineTest('Failure: a setter - negative (-0.1)', (run) => {
            try { const c = new RedGPU.Color.ColorRGBA(); c.a = -0.1; run(true); } catch (e) { run(false, e); }
        }, false);
        runner.defineTest('Failure: ColorRGBA - float value in R (127.5)', (run) => {
            try { new RedGPU.Color.ColorRGBA(127.5, 0, 0, 1); run(true); } catch (e) { run(false, e); }
        }, false);
        runner.defineTest('Failure: setColorByRGBAString - invalid format', (run) => {
            try { new RedGPU.Color.ColorRGBA().setColorByRGBAString('rgb(0,0,0)'); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);
