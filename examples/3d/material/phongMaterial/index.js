import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] PhongMaterial 예제
 * [EN] PhongMaterial Example
 *
 * [KO] Phong 조명 모델 기반 PhongMaterial의 색상, 광택(shininess), 노멀 스케일 및 다중 텍스처 맵 제어를 시연합니다.
 * [EN] Demonstrates color, shininess, normalScale, and multi-texture map controls of PhongMaterial based on the Phong lighting model.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const texturePaths = {
    diffuse: '../../../assets/phongMaterial/test_diffuseMap.jpg',
    alpha: '../../../assets/phongMaterial/test_alphaMap.png',
    ao: '../../../assets/phongMaterial/test_aoMap.jpg',
    normal: '../../../assets/phongMaterial/test_normalMap.jpg',
    emissive: '../../../assets/phongMaterial/test_emissiveMap.jpg',
    specular: '../../../assets/phongMaterial/test_specularMap.jpg',
};

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 40;

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#5259c3');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 단일 PhongMaterial 인스턴스를 공유하는 다양한 프리미티브 메시들을 원형으로 배치
        // [EN] Arrange various primitive meshes sharing a single PhongMaterial instance in a circle
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        const geometries = [
            new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),
            new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3, 10, 10, 10),
            new RedGPU.Primitive.Torus(redGPUContext, 1.5, 0.5, 32, 32),
            new RedGPU.Primitive.Plane(redGPUContext, 5, 5, 10, 10),
            new RedGPU.Primitive.Cylinder(redGPUContext, 2, 2, 5, 32, 2),
            new RedGPU.Primitive.TorusKnot(redGPUContext, 1.5, 0.4, 128, 64),
        ];

        const radius = 10;
        const total = geometries.length;
        geometries.forEach((geometry, index) => {
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            const angle = (Math.PI * 2 * index) / total;
            mesh.x = radius * Math.cos(angle);
            mesh.z = radius * Math.sin(angle);
            scene.addChild(mesh);
        });

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, material);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, material) => {
    const textures = Object.fromEntries(
        Object.entries(texturePaths).map(([key, path]) => [
            key,
            new RedGPU.Resource.BitmapTexture(redGPUContext, path),
        ])
    );

    material.diffuseTexture = textures.diffuse;
    material.normalTexture = textures.normal;

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const defaultState = {
                color: {r: material.color.r, g: material.color.g, b: material.color.b},
                emissiveColor: {r: material.emissiveColor.r, g: material.emissiveColor.g, b: material.emissiveColor.b},
                specularColor: {r: material.specularColor.r, g: material.specularColor.g, b: material.specularColor.b},
                opacity: material.opacity,
                aoStrength: material.aoStrength,
                emissiveStrength: material.emissiveStrength,
                specularStrength: material.specularStrength,
                shininess: material.shininess,
                normalScale: material.normalScale,
            };

            const params = {
                color: {...defaultState.color},
                emissiveColor: {...defaultState.emissiveColor},
                specularColor: {...defaultState.specularColor},
                useDiffuse: Boolean(material.diffuseTexture),
                useAlpha: Boolean(material.alphaTexture),
                useAo: Boolean(material.aoTexture),
                useSpecular: Boolean(material.specularTexture),
                useNormal: Boolean(material.normalTexture),
                useEmissive: Boolean(material.emissiveTexture),
            };

            const colorFolder = pane.addFolder({title: 'Colors', expanded: true});
            colorFolder.addBinding(params, 'color', {
                picker: 'inline',
                view: 'color',
                expanded: false
            }).on('change', (ev) => {
                const {r, g, b} = ev.value;
                material.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });
            colorFolder.addBinding(params, 'emissiveColor', {
                picker: 'inline',
                view: 'color',
                expanded: false
            }).on('change', (ev) => {
                const {r, g, b} = ev.value;
                material.emissiveColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });
            colorFolder.addBinding(params, 'specularColor', {
                picker: 'inline',
                view: 'color',
                expanded: false
            }).on('change', (ev) => {
                const {r, g, b} = ev.value;
                material.specularColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });

            pane.addBinding(material, 'opacity', {min: 0, max: 1, step: 0.01});

            const propertiesFolder = pane.addFolder({title: 'Properties', expanded: true});
            propertiesFolder.addBinding(material, 'aoStrength', {min: 0, max: 5, step: 0.01});
            propertiesFolder.addBinding(material, 'emissiveStrength', {min: 0, max: 1, step: 0.01});
            propertiesFolder.addBinding(material, 'specularStrength', {min: 0, max: 20, step: 0.01});
            propertiesFolder.addBinding(material, 'shininess', {min: 0, max: 128, step: 1});
            propertiesFolder.addBinding(material, 'normalScale', {min: 0, max: 2, step: 0.01});

            const textureKeys = ['useDiffuse', 'useAlpha', 'useAo', 'useSpecular', 'useNormal', 'useEmissive'];
            const textureFolder = pane.addFolder({title: 'Texture Maps', expanded: true});
            textureKeys.forEach((key) => {
                textureFolder.addBinding(params, key).on('change', (ev) => {
                    const textureType = key.replace('use', '').toLowerCase();
                    material[`${textureType}Texture`] = ev.value ? textures[textureType] : null;
                });
            });

            pane.addButton({title: 'Reset All'}).on('click', () => {
                params.color = {...defaultState.color};
                params.emissiveColor = {...defaultState.emissiveColor};
                params.specularColor = {...defaultState.specularColor};

                material.color.setColorByRGB(defaultState.color.r, defaultState.color.g, defaultState.color.b);
                material.emissiveColor.setColorByRGB(defaultState.emissiveColor.r, defaultState.emissiveColor.g, defaultState.emissiveColor.b);
                material.specularColor.setColorByRGB(defaultState.specularColor.r, defaultState.specularColor.g, defaultState.specularColor.b);

                material.opacity = defaultState.opacity;
                material.aoStrength = defaultState.aoStrength;
                material.emissiveStrength = defaultState.emissiveStrength;
                material.specularStrength = defaultState.specularStrength;
                material.shininess = defaultState.shininess;
                material.normalScale = defaultState.normalScale;

                textureKeys.forEach((key) => {
                    const isDefaultActive = key === 'useDiffuse' || key === 'useNormal';
                    params[key] = isDefaultActive;
                    const textureType = key.replace('use', '').toLowerCase();
                    material[`${textureType}Texture`] = isDefaultActive ? textures[textureType] : null;
                });

                pane.refresh();
            });
        }
    });
};
