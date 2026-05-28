import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Light');

redUnit.testGroup(
    'RedGPU.Light.Core.ABaseLight',
    (runner) => {
        runner.defineTest('Success: Base properties check (via AmbientLight)', (run) => {
            try {
                const light = new RedGPU.Light.AmbientLight('#ffffff', 100);
                light.intensityMultiplier = 2.5;
                light.enableDebugger = true;

                const color = light.color;
                const checkColorInstance = color instanceof RedGPU.Color.ColorRGB;
                const checkColorValues =
                    color.r === 255 && color.g === 255 && color.b === 255 &&
                    color.rgb[0] === 255 && color.rgb[1] === 255 && color.rgb[2] === 255 &&
                    color.rgbNormal[0] === 1 && color.rgbNormal[1] === 1 && color.rgbNormal[2] === 1 &&
                    color.hex === '#FFFFFF';

                const checkIntensity = light.intensityMultiplier === 2.5;
                const checkDebugger = light.enableDebugger === true;

                run(checkColorInstance && checkColorValues && checkIntensity && checkDebugger);
            } catch (e) {
                run(false, e);
            }
        }, true);        
        runner.defineTest('Failure: Negative intensityMultiplier', (run) => {
            try {
                const light = new RedGPU.Light.AmbientLight();
                light.intensityMultiplier = -1;
                run(true);
            } catch (e) {
                run(false, e);
            }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Light.AmbientLight',
    (runner) => {
        runner.defineTest('Success: lux property', (run) => {
            try {
                const light = new RedGPU.Light.AmbientLight('#fff', 500);
                const check = light.lux === 500;
                light.lux = 1000;
                run(check && light.lux === 1000);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Light.DirectionalLight',
    (runner) => {
        runner.defineTest('Success: direction and lux', (run) => {
            try {
                const light = new RedGPU.Light.DirectionalLight([-1, -2, -3], '#ffffff', 50000);
                const checkDir = light.direction[0] === -1 && light.direction[1] === -2 && light.direction[2] === -3;
                const checkLux = light.lux === 50000;
                const checkColor = light.color.hex === '#FFFFFF';
                run(checkDir && checkLux && checkColor);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success: Spherical coordinates sync', (run) => {
            try {
                const light = new RedGPU.Light.DirectionalLight();
                light.elevation = 90; // Up (inverse dir is down [0, -1, 0])
                const dir = light.direction;
                // direction is inverse of spherical to point from light to ground
                // if elevation is 90,nx=0, ny=1, nz=0 -> dir = [0, -1, 0]
                const check = Math.abs(dir[0]) < 0.0001 && dir[1] === -1 && Math.abs(dir[2]) < 0.0001;
                run(check);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Light.PointLight',
    (runner) => {
        runner.defineTest('Success: position, radius, lumen', (run) => {
            try {
                const light = new RedGPU.Light.PointLight('#ffffff', 2000);
                light.setPosition(10, 20, 30);
                light.radius = 50;
                
                const checkPos = light.x === 10 && light.y === 20 && light.z === 30;
                const checkRadius = light.radius === 50;
                const checkLumen = light.lumen === 2000;
                const checkColor = light.color.hex === '#FFFFFF';
                run(checkPos && checkRadius && checkLumen && checkColor);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Light.SpotLight',
    (runner) => {
        runner.defineTest('Success: cutoff and lookAt', (run) => {
            try {
                const light = new RedGPU.Light.SpotLight('#ffffff');
                light.innerCutoff = 10;
                light.outerCutoff = 30;
                
                light.setPosition(0, 10, 0);
                light.lookAt(0, 0, 0); // Pointing straight down [0, -1, 0]
                
                const checkCutoff = light.innerCutoff === 10 && light.outerCutoff === 30;
                const dir = light.direction;
                const checkDir = dir[0] === 0 && dir[1] === -1 && dir[2] === 0;
                const checkColor = light.color.hex === '#FFFFFF';
                
                run(checkCutoff && checkDir && checkColor);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Light.LightManager',
    (runner) => {
        runner.defineTest('Success: Adding and removing lights', (run) => {
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

        runner.defineTest('Success: removeAllLight', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene(redGPUContext);
                    const manager = scene.lightManager;
                    
                    manager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
                    manager.addPointLight(new RedGPU.Light.PointLight());
                    manager.ambientLight = new RedGPU.Light.AmbientLight();
                    
                    manager.removeAllLight();
                    
                    const check = manager.directionalLightCount === 0 && 
                                  manager.pointLightCount === 0 && 
                                  manager.ambientLight === null;
                                  
                    redGPUContext.destroy();
                    run(check);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Failure: directionalLight limit check', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene(redGPUContext);
                    const manager = scene.lightManager;
                    const limit = manager.limitDirectionalLightCount;
                    
                    for(let i=0; i <= limit; i++) {
                        manager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
                    }
                    // Should throw on the (limit + 1)-th addition
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, false);
    }
);
