import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Color');

redUnit.testGroup(
    'RedGPU.Color.ColorRGB',
    (runner) => {
        // Constructor & Getters
        runner.defineTest('Success Test Test: default constructor', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB();
                run(color.r === 255 && color.g === 255 && color.b === 255);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: constructor with values', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB(100, 150, 200);
                run(color.r === 100 && color.g === 150 && color.b === 200);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: constructor with onChange callback', (run) => {
            try {
                let changed = false;
                const color = new RedGPU.Color.ColorRGB(100, 150, 200, () => { changed = true; });
                color.r = 50;
                run(changed);
            } catch (e) {
                run(false, e);
            }
        }, true);

        // Setters
        ['r', 'g', 'b'].forEach(prop => {
            runner.defineTest(`Success Test Test: set ${prop}`, (run) => {
                try {
                    const color = new RedGPU.Color.ColorRGB();
                    color[prop] = 128;
                    run(color[prop]);
                } catch (e) {
                    run(false, e);
                }
            }, 128);
        });

        // Computed Properties
        runner.defineTest('Success Test Test: rgb getter', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB(10, 20, 30);
                const rgb = color.rgb;
                run(rgb[0] === 10 && rgb[1] === 20 && rgb[2] === 30);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: rgbNormal getter', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB(255, 128, 0);
                const rgbNormal = color.rgbNormal;
                run(Math.abs(rgbNormal[0] - 1) < 0.001 && Math.abs(rgbNormal[1] - 128/255) < 0.001 && rgbNormal[2] === 0);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: rgbNormalLinear getter', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB(255, 128, 0);
                const linear = color.rgbNormalLinear;
                run(Math.abs(linear[0] - 1) < 0.001 && Math.abs(linear[1] - Math.pow(128/255, 2.2)) < 0.001 && linear[2] === 0);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: hex getter', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB(255, 0, 0);
                run(color.hex);
            } catch (e) {
                run(false, e);
            }
        }, '#FF0000');

        // Methods
        runner.defineTest('Success Test Test: setColorByRGB', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB();
                color.setColorByRGB(10, 20, 30);
                run(color.r === 10 && color.g === 20 && color.b === 30);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: setColorByHEX string', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB();
                color.setColorByHEX('#FF0000');
                run(color.r === 255 && color.g === 0 && color.b === 0);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: setColorByHEX number', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB();
                color.setColorByHEX(0x00FF00);
                run(color.r === 0 && color.g === 255 && color.b === 0);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: setColorByRGBString', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB();
                color.setColorByRGBString('rgb(10, 20, 30)');
                run(color.r === 10 && color.g === 20 && color.b === 30);
            } catch (e) {
                run(false, e);
            }
        }, true);

        // Negative Tests
        const invalidValues = [null, undefined, NaN, -1, 256, 300, '255', {}, [], true, false];
        ['r', 'g', 'b'].forEach(prop => {
            invalidValues.forEach((invalidValue, index) => {
                runner.defineTest(`Failure Test Test: Invalid ${prop} setter [${index}] - ${invalidValue}`, (run) => {
                    try {
                        const color = new RedGPU.Color.ColorRGB();
                        color[prop] = invalidValue;
                        run(true);
                    } catch (e) {
                        run(false, e);
                    }
                }, false);
            });
        });

        invalidValues.forEach((invalidValue, index) => {
            runner.defineTest(`Failure Test Test: Invalid setColorByRGB [${index}] - ${invalidValue}`, (run) => {
                try {
                    const color = new RedGPU.Color.ColorRGB();
                    color.setColorByRGB(invalidValue, 0, 0);
                    run(true);
                } catch (e) {
                    run(false, e);
                }
            }, false);
        });

        runner.defineTest('Failure Test Test: Invalid setColorByHEX', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB();
                color.setColorByHEX('invalid_hex');
                run(true);
            } catch (e) {
                run(false, e);
            }
        }, false);

        runner.defineTest('Failure Test Test: Invalid setColorByRGBString', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB();
                color.setColorByRGBString('rgb(255, 0)');
                run(true);
            } catch (e) {
                run(false, e);
            }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Color.ColorRGBA',
    (runner) => {
        // Constructor & Getters
        runner.defineTest('Success Test Test: default constructor', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA();
                run(color.r === 255 && color.g === 255 && color.b === 255 && color.a === 1);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: constructor with values', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA(100, 150, 200, 0.5);
                run(color.r === 100 && color.g === 150 && color.b === 200 && color.a === 0.5);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: constructor with onChange callback', (run) => {
            try {
                let changed = false;
                const color = new RedGPU.Color.ColorRGBA(100, 150, 200, 1, () => { changed = true; });
                color.a = 0.5;
                run(changed);
            } catch (e) {
                run(false, e);
            }
        }, true);

        // Setters
        runner.defineTest('Success Test Test: set a', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA();
                color.a = 0.75;
                run(color.a);
            } catch (e) {
                run(false, e);
            }
        }, 0.75);

        // Computed Properties
        runner.defineTest('Success Test Test: rgba getter', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA(10, 20, 30, 0.4);
                const rgba = color.rgba;
                run(rgba[0] === 10 && rgba[1] === 20 && rgba[2] === 30 && rgba[3] === 0.4);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: rgbaNormal getter', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.5);
                const normal = color.rgbaNormal;
                run(Math.abs(normal[0] - 1) < 0.001 && Math.abs(normal[1] - 128/255) < 0.001 && normal[2] === 0 && normal[3] === 0.5);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: rgbaNormalLinear getter', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.5);
                const linear = color.rgbaNormalLinear;
                run(Math.abs(linear[0] - 1) < 0.001 && Math.abs(linear[1] - Math.pow(128/255, 2.2)) < 0.001 && linear[2] === 0 && linear[3] === 0.5);
            } catch (e) {
                run(false, e);
            }
        }, true);

        // Methods
        runner.defineTest('Success Test Test: setColorByRGBA', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA();
                color.setColorByRGBA(10, 20, 30, 0.5);
                run(color.r === 10 && color.g === 20 && color.b === 30 && color.a === 0.5);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test Test: setColorByRGBAString', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA();
                color.setColorByRGBAString('rgba(10, 20, 30, 0.5)');
                run(color.r === 10 && color.g === 20 && color.b === 30 && color.a === 0.5);
            } catch (e) {
                run(false, e);
            }
        }, true);

        // Negative Tests
        const invalidAlphaValues = [null, undefined, NaN, -0.1, 1.1, 2, '0.5', {}, [], true, false];
        
        invalidAlphaValues.forEach((invalidValue, index) => {
            runner.defineTest(`Failure Test Test: Invalid 'a' setter [${index}] - ${invalidValue}`, (run) => {
                try {
                    const color = new RedGPU.Color.ColorRGBA();
                    color.a = invalidValue;
                    run(true);
                } catch (e) {
                    run(false, e);
                }
            }, false);

            runner.defineTest(`Failure Test Test: Invalid setColorByRGBA [${index}] - ${invalidValue}`, (run) => {
                try {
                    const color = new RedGPU.Color.ColorRGBA();
                    color.setColorByRGBA(255, 0, 0, invalidValue);
                    run(true);
                } catch (e) {
                    run(false, e);
                }
            }, false);
        });

        runner.defineTest('Failure Test Test: Invalid setColorByRGBAString', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGBA();
                color.setColorByRGBAString('rgba(255, 0)');
                run(true);
            } catch (e) {
                run(false, e);
            }
        }, false);
    }
);
