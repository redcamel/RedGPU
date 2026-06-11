import * as RedGPU from "../../../../dist/index.js?t=1781141623471";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781141623471";

/**
 * [KO] Phong Material 예제
 * [EN] Phong Material example
 *
 * [KO] 고전적인 Phong 조명 모델을 구현한 PhongMaterial의 다양한 속성(색상, 텍스처, 광택 등)을 시연합니다.
 * [EN] Demonstrates various properties (color, textures, shininess, etc.) of PhongMaterial, which implements the classic Phong lighting model.
 */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const texturePaths = {
    diffuse: "../../../assets/phongMaterial/test_diffuseMap.jpg",
    alpha: "../../../assets/phongMaterial/test_alphaMap.png",
    ao: "../../../assets/phongMaterial/test_aoMap.jpg",
    normal: "../../../assets/phongMaterial/test_normalMap.jpg",
    emissive: "../../../assets/phongMaterial/test_emissiveMap.jpg",
    // displacement: "../../../assets/phongMaterial/test_displacementMap.jpg",
    specular: "../../../assets/phongMaterial/test_specularMap.jpg",
};

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 40;
        controller.speedDistance = 0.5;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#5259c3');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 조명 설정
        // [EN] Setup Lighting
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // 4. [KO] 다양한 지오메트리를 가진 메시 생성
        // [EN] Create Meshes with Various Geometries
        const geometries = [
            new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),
            new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3, 10, 10, 10),
            new RedGPU.Primitive.Torus(redGPUContext, 1.5, 0.5, 32, 32),
            new RedGPU.Primitive.Plane(redGPUContext, 5, 5, 10, 10),
            new RedGPU.Primitive.Cylinder(redGPUContext, 2, 2, 5, 32, 2),
            new RedGPU.Primitive.TorusKnot(redGPUContext, 1.5, 0.4, 128, 64)
        ];

        // [KO] 모든 메시가 단일 머티리얼 인스턴스를 공유함
        // [EN] All meshes share a single material instance
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        const radius = 10;
        const total = geometries.length;

        geometries.forEach((geometry, index) => {
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            const angle = (Math.PI * 2 * index) / total;
            mesh.x = radius * Math.cos(angle);
            mesh.z = radius * Math.sin(angle);
            scene.addChild(mesh);
        });

        // 5. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderUI(redGPUContext, scene.children[0]);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

/**
 * [KO] 텍스처 리소스들을 생성합니다.
 * [EN] Creates texture resources.
 */
const createTextures = (redGPUContext) => {
    return Object.fromEntries(
        Object.entries(texturePaths).map(([key, path]) => [
            key,
            new RedGPU.Resource.BitmapTexture(redGPUContext, path),
        ])
    );
};

/**
 * [KO] 실시간 속성 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time property control.
 */
const renderUI = (redGPUContext, mesh) => {
    const material = mesh.material;
    const textures = createTextures(redGPUContext);

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const params = {
                color: {r: material.color.r, g: material.color.g, b: material.color.b},
                aoStrength: material.aoStrength,
                emissiveColor: {r: material.emissiveColor.r, g: material.emissiveColor.g, b: material.emissiveColor.b},
                emissiveStrength: material.emissiveStrength,
                specularColor: {r: material.specularColor.r, g: material.specularColor.g, b: material.specularColor.b},
                specularStrength: material.specularStrength,
                shininess: material.shininess,
                normalScale: material.normalScale,
                // displacementScale: material.displacementScale,
                textures: {
                    useDiffuse: !!material.diffuseTexture,
                    useAlpha: !!material.alphaTexture,
                    useAo: !!material.aoTexture,
                    useSpecular: !!material.specularTexture,
                    useNormal: !!material.normalTexture,
                    useEmissive: !!material.emissiveTexture,
                    // useDisplacement: !!material.displacementTexture,
                },
            };

            const defaultValues = JSON.parse(JSON.stringify(params));

            // [KO] 색상 속성 설정
            // [EN] Color Properties Settings
            const colorFolder = pane.addFolder({title: 'Colors', expanded: true});
            colorFolder.addBinding(params, "color", {picker: "inline", view: "color", expanded: false})
                .on("change", (ev) => {
                    const {r, g, b} = ev.value;
                    material.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
                });

            colorFolder.addBinding(params, "emissiveColor", {picker: "inline", view: "color", expanded: false})
                .on("change", (ev) => {
                    const {r, g, b} = ev.value;
                    material.emissiveColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
                });

            colorFolder.addBinding(params, "specularColor", {picker: "inline", view: "color", expanded: false})
                .on("change", (ev) => {
                    const {r, g, b} = ev.value;
                    material.specularColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
                });

            pane.addBinding(material, 'opacity', {min: 0, max: 1, step: 0.01});

            // [KO] 수치 속성 설정
            // [EN] Numerical Properties Settings
            const propertiesFolder = pane.addFolder({title: 'Properties', expanded: true});
            const properties = [
                {key: "aoStrength", min: 0, max: 5, step: 0.01},
                {key: "emissiveStrength", min: 0, max: 1, step: 0.01},
                {key: "specularStrength", min: 0, max: 20, step: 0.01},
                {key: "shininess", min: 0, max: 128, step: 1},
                {key: "normalScale", min: 0, max: 2, step: 0.01},
                // {key: "displacementScale", min: 0, max: 5, step: 0.01},
            ];

            properties.forEach(({key, min, max, step}) =>
                propertiesFolder.addBinding(params, key, {min, max, step}).on("change", (ev) => {
                    material[key] = ev.value;
                })
            );

            // [KO] 텍스처 맵 토글
            // [EN] Texture Map Toggles
            const textureFolder = pane.addFolder({title: 'Texture Maps', expanded: true});
            Object.keys(params.textures).forEach((key) => {
                textureFolder.addBinding(params.textures, key).on("change", (ev) => {
                    const textureType = key.replace("use", "").toLowerCase();
                    material[`${textureType}Texture`] = ev.value ? textures[textureType] : null;
                });
            });

            // [KO] 리셋 버튼
            // [EN] Reset Button
            pane.addButton({title: "Reset All"}).on('click', () => {
                Object.assign(params, JSON.parse(JSON.stringify(defaultValues)));
                material.color.setColorByRGB(params.color.r, params.color.g, params.color.b);
                material.emissiveColor.setColorByRGB(params.emissiveColor.r, params.emissiveColor.g, params.emissiveColor.b);
                material.specularColor.setColorByRGB(params.specularColor.r, params.specularColor.g, params.specularColor.b);
                properties.forEach(({key}) => material[key] = params[key]);
                Object.keys(params.textures).forEach(k => {
                    const type = k.replace("use", "").toLowerCase();
                    material[`${type}Texture`] = params.textures[k] ? textures[type] : null;
                });
                pane.refresh();
            });

            // [KO] 초기 텍스처 활성화
            // [EN] Initial Texture Activation
            material.diffuseTexture = textures.diffuse;
            // material.displacementTexture = textures.displacement;
            material.normalTexture = textures.normal;
            params.textures.useDisplacement = true;
            params.textures.useNormal = true;
            params.textures.useDiffuse = true;

            pane.refresh();
        }
    });
};
