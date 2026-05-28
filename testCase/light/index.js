import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Light');

redUnit.testGroup(
    'RedGPU.Light.Core.ABaseLight',
    (runner) => {
        class MockLight extends RedGPU.Light.Core.ABaseLight {
            constructor(color, intensity) { super(color, intensity); }
        }

        runner.defineTest('Success Test: Constructor and Base Properties', (run) => {
            try {
                const color = new RedGPU.Color.ColorRGB(100, 100, 100);
                const light = new MockLight(color, 2.5);
                const checkColor = light.color === color;
                const checkIntensity = light.intensityMultiplier === 2.5;
                const checkDebugger = light.enableDebugger === false;
                run(checkColor && checkIntensity && checkDebugger);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: color Setter/Getter', (run) => {
            try {
                const light = new MockLight(new RedGPU.Color.ColorRGB());
                const newColor = new RedGPU.Color.ColorRGB(255, 0, 0);
                light.color = newColor;
                run(light.color === newColor);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: color setter - null', (run) => {
            try { new MockLight(new RedGPU.Color.ColorRGB()).color = null; run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: color setter - wrong type', (run) => {
            try { new MockLight(new RedGPU.Color.ColorRGB()).color = '#ffffff'; run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Success Test: intensityMultiplier Setter/Getter', (run) => {
            try {
                const light = new MockLight(new RedGPU.Color.ColorRGB());
                light.intensityMultiplier = 5;
                run(light.intensityMultiplier);
            } catch (e) { run(null, e); }
        }, 5);

        runner.defineTest('Failure Test: intensityMultiplier setter - NaN', (run) => {
            try { new MockLight(new RedGPU.Color.ColorRGB()).intensityMultiplier = NaN; run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: intensityMultiplier setter - negative', (run) => {
            try { new MockLight(new RedGPU.Color.ColorRGB()).intensityMultiplier = -0.1; run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Success Test: enableDebugger Setter/Getter', (run) => {
            try {
                const light = new MockLight(new RedGPU.Color.ColorRGB());
                light.enableDebugger = true;
                run(light.enableDebugger);
            } catch (e) { run(null, e); }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Light.AmbientLight',
    (runner) => {
        runner.defineTest('Success Test: Constructor defaults', (run) => {
            try {
                const light = new RedGPU.Light.AmbientLight();
                run(light.color.hex === '#ADD8E6' && light.lux === 0);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: lux property', (run) => {
            try {
                const light = new RedGPU.Light.AmbientLight('#fff', 500);
                light.lux = 1000;
                run(light.lux);
            } catch (e) { run(null, e); }
        }, 1000);
    }
);

redUnit.testGroup(
    'RedGPU.Light.DirectionalLight',
    (runner) => {
        runner.defineTest('Success Test: direction and lux', (run) => {
            try {
                const light = new RedGPU.Light.DirectionalLight([-1, -2, -3], '#ffffff', 50000);
                const checkDir = light.direction[0] === -1 && light.direction[1] === -2 && light.direction[2] === -3;
                const checkLux = light.lux === 50000;
                run(checkDir && checkLux);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: Spherical coordinates (elevation/azimuth)', (run) => {
            try {
                const light = new RedGPU.Light.DirectionalLight();
                light.elevation = 90; 
                light.azimuth = 0;
                const dir = light.direction;
                // elevation 90 is straight up, so direction from light to surface is [0, -1, 0]
                const check = Math.abs(dir[0]) < 0.0001 && dir[1] === -1 && Math.abs(dir[2]) < 0.0001;
                run(check);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: Individual direction components (X, Y, Z)', (run) => {
            try {
                const light = new RedGPU.Light.DirectionalLight();
                light.directionX = -1; light.directionY = 0; light.directionZ = 0;
                const dir = light.direction;
                run(dir[0] === -1 && dir[1] === 0 && dir[2] === 0);
            } catch (e) { run(false, e); }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Light.PointLight',
    (runner) => {
        runner.defineTest('Success Test: position, radius, lumen', (run) => {
            try {
                const light = new RedGPU.Light.PointLight('#ffffff', 2000);
                light.setPosition(10, 20, 30);
                light.radius = 50;
                const checkPos = light.x === 10 && light.y === 20 && light.z === 30;
                const checkRadius = light.radius === 50;
                const checkLumen = light.lumen === 2000;
                run(checkPos && checkRadius && checkLumen);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: setPosition with array', (run) => {
            try {
                const light = new RedGPU.Light.PointLight();
                light.setPosition([100, 200, 300]);
                const pos = light.position;
                run(pos[0] === 100 && pos[1] === 200 && pos[2] === 300);
            } catch (e) { run(false, e); }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Light.SpotLight',
    (runner) => {
        runner.defineTest('Success Test: cutoff and lookAt', (run) => {
            try {
                const light = new RedGPU.Light.SpotLight('#ffffff');
                light.innerCutoff = 10;
                light.outerCutoff = 30;
                light.setPosition(0, 10, 0);
                light.lookAt(0, 0, 0); 
                const checkCutoff = light.innerCutoff === 10 && light.outerCutoff === 30;
                const checkDir = light.direction[1] === -1; // Pointing down
                run(checkCutoff && checkDir);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: inner/outer cutoff cosine', (run) => {
            try {
                const light = new RedGPU.Light.SpotLight();
                light.innerCutoff = 45;
                const expected = Math.cos(45 * Math.PI / 180);
                run(Math.abs(light.innerCutoffCos - expected) < 0.0001);
            } catch (e) { run(false, e); }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Light.LightManager',
    (runner) => {
        runner.defineTest('Success Test: Adding and removing lights', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene(redGPUContext);
                    const manager = scene.lightManager;
                    const d1 = new RedGPU.Light.DirectionalLight();
                    const p1 = new RedGPU.Light.PointLight();
                    const s1 = new RedGPU.Light.SpotLight();
                    const a1 = new RedGPU.Light.AmbientLight();
                    
                    manager.addDirectionalLight(d1);
                    manager.addPointLight(p1);
                    manager.addSpotLight(s1);
                    manager.ambientLight = a1;
                    
                    const checkAdd = manager.directionalLightCount === 1 && 
                                     manager.pointLightCount === 1 && 
                                     manager.spotLightCount === 1 &&
                                     manager.ambientLight === a1;
                                     
                    manager.removeDirectionalLight(d1);
                    manager.removePointLight(p1);
                    manager.removeSpotLight(s1);
                    
                    const checkRemove = manager.directionalLightCount === 0 && 
                                        manager.pointLightCount === 0 && 
                                        manager.spotLightCount === 0;
                    
                    redGPUContext.destroy();
                    run(checkAdd && checkRemove);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Failure Test: ambientLight setter - null', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene(redGPUContext);
                    scene.lightManager.ambientLight = null;
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, false);

        runner.defineTest('Failure Test: directionalLight limit check', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene(redGPUContext);
                    const manager = scene.lightManager;
                    const limit = manager.limitDirectionalLightCount;
                    for(let i=0; i <= limit; i++) {
                        manager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
                    }
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, false);

        runner.defineTest('Success Test: removeAll...Light methods', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene(redGPUContext);
                    const manager = scene.lightManager;
                    manager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
                    manager.addPointLight(new RedGPU.Light.PointLight());
                    manager.addSpotLight(new RedGPU.Light.SpotLight());
                    
                    manager.removeAllDirectionalLight();
                    manager.removeAllPointLight();
                    manager.removeAllSpotLight();
                    
                    const check = manager.directionalLightCount === 0 && 
                                  manager.pointLightCount === 0 && 
                                  manager.spotLightCount === 0;
                    redGPUContext.destroy();
                    run(check);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);
    }
);
