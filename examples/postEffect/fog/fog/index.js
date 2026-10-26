import * as RedGPU from "../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] Fog 예제
 * [EN] Fog example
 *
 * [KO] 포스트 이펙트를 사용하여 거리 기반 안개(Fog) 효과를 적용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to apply distance-based fog effects using post effects.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.speedDistance = 0.3;
        controller.tilt = -10;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        // [KO] Fog 포스트 이펙트 생성 및 뷰에 추가
        // [EN] Create Fog post effect and add it to the view
        const fogEffect = new RedGPU.PostEffect.Fog(redGPUContext);
        fogEffect.farDistance = 30;
        view.postEffectManager.addEffect(fogEffect);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        createTestScene(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, view, fogEffect);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createTestScene = (redGPUContext, scene) => {
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (result) => {
            const mainMesh = scene.addChild(result.resultMesh);
            mainMesh.setScale(2);
        }
    );

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const radius = 7;
        const sphere = new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 16, 16);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext, colors[i]);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, sphere, material);
        mesh.setPosition(Math.cos(angle) * radius, Math.sin(i * 0.5) * 2, Math.sin(angle) * radius);
        scene.addChild(mesh);
    }

    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const radius = 17;
        const box = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext, colors[i % colors.length]);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, box, material);
        mesh.setPosition(Math.cos(angle) * radius, Math.sin(i * 0.8) * 3, Math.sin(angle) * radius);
        scene.addChild(mesh);
    }

    for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10;
        const radius = 30;
        const cylinder = new RedGPU.Primitive.Cylinder(redGPUContext, 0.5, 2, 12);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext, colors[i % colors.length]);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, cylinder, material);
        mesh.setPosition(Math.cos(angle) * radius, (i % 3) * 2 - 2, Math.sin(angle) * radius);
        scene.addChild(mesh);
    }

    const groundPlane = new RedGPU.Primitive.Plane(redGPUContext, 100, 100, 1, 1);
    const groundMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, '#8FBC8F');
    const groundMesh = new RedGPU.Display.Mesh(redGPUContext, groundPlane, groundMaterial);
    groundMesh.rotationX = -90;
    groundMesh.y = -3;
    groundMesh.alpha = 0.3;
    scene.addChild(groundMesh);
};

const renderTestPane = (redGPUContext, view, fogEffect) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            const config = {
                Fog: true,
                fogColor: {
                    r: fogEffect.fogColor.r,
                    g: fogEffect.fogColor.g,
                    b: fogEffect.fogColor.b
                }
            };

            const fogFolder = pane.addFolder({title: 'PostEffect', expanded: true});

            fogFolder.addBinding(config, 'Fog').on('change', (ev) => {
                if (ev.value) {
                    view.postEffectManager.addEffect(fogEffect);
                } else {
                    view.postEffectManager.removeAllEffect();
                }
                controls.forEach((c) => c.disabled = !ev.value);
                presetFolder.disabled = !ev.value;
            });

            const controls = [
                fogFolder.addBinding(fogEffect, 'fogType', {
                    options: {
                        EXPONENTIAL: RedGPU.PostEffect.Fog.EXPONENTIAL,
                        EXPONENTIAL_SQUARED: RedGPU.PostEffect.Fog.EXPONENTIAL_SQUARED
                    }
                }),
                fogFolder.addBinding(fogEffect, 'density', {
                    min: 0,
                    max: 1,
                    step: 0.001
                }),
                fogFolder.addBinding(fogEffect, 'nearDistance', {
                    min: 0,
                    max: 50,
                    step: 0.1
                }).on('change', (ev) => {
                    if (fogEffect.farDistance <= ev.value) {
                        fogEffect.farDistance = ev.value + 1;
                        pane.refresh();
                    }
                }),
                fogFolder.addBinding(fogEffect, 'farDistance', {
                    min: 0.1,
                    max: 100,
                    step: 0.1
                }).on('change', (ev) => {
                    if (ev.value <= fogEffect.nearDistance) {
                        fogEffect.farDistance = fogEffect.nearDistance + 1;
                        pane.refresh();
                    }
                }),
                fogFolder.addBinding(config, 'fogColor').on('change', (ev) => {
                    fogEffect.fogColor.setColorByRGB(
                        Math.floor(ev.value.r),
                        Math.floor(ev.value.g),
                        Math.floor(ev.value.b)
                    );
                })
            ];

            const presetFolder = fogFolder.addFolder({title: 'Presets', expanded: true});

            const applyPreset = (type, density, near, far, color) => {
                fogEffect.fogType = type;
                fogEffect.density = density;
                fogEffect.nearDistance = near;
                fogEffect.farDistance = far;
                fogEffect.fogColor.setColorByRGB(color.r, color.g, color.b);
                config.fogColor = color;
                pane.refresh();
            };

            presetFolder.addButton({title: 'Light Mist'}).on('click', () => {
                applyPreset(RedGPU.PostEffect.Fog.EXPONENTIAL, 0.05, 8, 50, {r: 230, g: 235, b: 255});
            });
            presetFolder.addButton({title: 'Medium Fog'}).on('click', () => {
                applyPreset(RedGPU.PostEffect.Fog.EXPONENTIAL, 0.15, 5, 35, {r: 200, g: 210, b: 230});
            });
            presetFolder.addButton({title: 'Dense Fog'}).on('click', () => {
                applyPreset(RedGPU.PostEffect.Fog.EXPONENTIAL_SQUARED, 0.25, 3, 25, {r: 180, g: 180, b: 200});
            });
            presetFolder.addButton({title: 'Ocean Mist'}).on('click', () => {
                applyPreset(RedGPU.PostEffect.Fog.EXPONENTIAL, 0.08, 10, 60, {r: 180, g: 200, b: 255});
            });
        }
    });
};
