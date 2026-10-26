import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Tint Basic 예제
 * [EN] Tint Basic example
 *
 * [KO] 다양한 머티리얼(Color, Bitmap, Phong, PBR)에 틴트(Tint) 색상을 일괄 적용하고 제어하는 방법을 시연합니다.
 * [EN] Demonstrates how to batch apply and control tint colors on various materials (Color, Bitmap, Phong, PBR).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 18;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr', 10000);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        const light = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff');
        scene.lightManager.addDirectionalLight(light);

        // [KO] 각 머티리얼별 테스트 메시 생성 (순서: Color, Bitmap, Phong, PBR)
        // [EN] Create test meshes for each material type (Order: Color, Bitmap, Phong, PBR)
        const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32);
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const spacing = 5;
        const startX = -7.5;

        const materialColor = new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff');
        const meshColor = new RedGPU.Display.Mesh(redGPUContext, geometry, materialColor);
        meshColor.x = startX;
        scene.addChild(meshColor);

        const materialBitmap = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
        const meshBitmap = new RedGPU.Display.Mesh(redGPUContext, geometry, materialBitmap);
        meshBitmap.x = startX + spacing;
        scene.addChild(meshBitmap);

        const materialPhong = new RedGPU.Material.PhongMaterial(redGPUContext, '#ffffff');
        materialPhong.diffuseTexture = texture;
        const meshPhong = new RedGPU.Display.Mesh(redGPUContext, geometry, materialPhong);
        meshPhong.x = startX + spacing * 2;
        scene.addChild(meshPhong);

        const materialPBR = new RedGPU.Material.PBRMaterial(redGPUContext);
        materialPBR.baseColorTexture = texture;
        materialPBR.roughnessFactor = 0.2;
        materialPBR.metallicFactor = 0.5;
        const meshPBR = new RedGPU.Display.Mesh(redGPUContext, geometry, materialPBR);
        meshPBR.x = startX + spacing * 3;
        scene.addChild(meshPBR);

        // [KO] 초기 틴트 설정 및 재질 이름 라벨 배치
        // [EN] Initial tint setup and material name label placement
        const meshes = [meshColor, meshBitmap, meshPhong, meshPBR];
        meshes.forEach((mesh) => {
            mesh.material.useTint = true;
            mesh.material.tint.setColorByRGBA(255, 128, 0, 1);

            const label = new RedGPU.Display.TextField3D(redGPUContext, mesh.material.constructor.name);
            label.setPosition(mesh.x, 2, 0);
            scene.addChild(label);
        });

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            meshes.forEach((mesh) => {
                mesh.rotationX += 0.5;
                mesh.rotationY += 0.5;
            });
        });

        renderTestPane(redGPUContext, meshes);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, meshes) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'Global Tint Control', expanded: true});

            const materials = meshes.map((m) => m.material);
            const firstMat = materials[0];

            const tintConfig = {
                tint: {
                    r: firstMat.tint.r,
                    g: firstMat.tint.g,
                    b: firstMat.tint.b,
                    a: firstMat.tint.a
                },
                useTint: firstMat.useTint,
                tintBlendMode: RedGPU.Material.TINT_BLEND_MODE[firstMat.tintBlendMode]
            };

            folder.addBinding(tintConfig, 'useTint').on('change', (ev) => {
                materials.forEach((mat) => (mat.useTint = ev.value));
            });

            folder.addBinding(tintConfig, 'tintBlendMode', {
                options: RedGPU.Material.TINT_BLEND_MODE
            }).on('change', (ev) => {
                materials.forEach((mat) => (mat.tintBlendMode = ev.value));
            });

            folder.addBlade({view: 'separator'});

            folder.addBinding(tintConfig, 'tint', {
                picker: 'inline',
                view: 'color',
                expanded: true
            }).on('change', (ev) => {
                const {r, g, b, a} = ev.value;
                const ir = Math.floor(r);
                const ig = Math.floor(g);
                const ib = Math.floor(b);
                materials.forEach((mat) => {
                    mat.tint.setColorByRGBA(ir, ig, ib, a);
                });
            });
        }
    });
};
