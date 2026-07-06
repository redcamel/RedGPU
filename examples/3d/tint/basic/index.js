import * as RedGPU from "../../../../dist/index.js?t=1783324689986";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783324689986";

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
        // 1. [KO] 카메라 및 컨트롤러 설정
        // [EN] Setup Camera and Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 18;
        controller.speedDistance = 0.3;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 환경 및 라이트 설정
        // [EN] Configure Environment and Light
        
        // [KO] IBL 및 스카이박스 추가 (PBR 및 Phong 재질 시각화 강화)
        // [EN] Add IBL and Skybox (Enhance visualization for PBR and Phong materials)
        const iblUrl = '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr';
        const ibl = new RedGPU.Resource.IBL(redGPUContext, iblUrl, 10000);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        const light = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff');
        scene.lightManager.addDirectionalLight(light);

        // 4. [KO] 각 머티리얼별 테스트 메시 생성 (순서: Color, Bitmap, Phong, PBR)
        // [EN] Create Test Meshes for each Material Type (Order: Color, Bitmap, Phong, PBR)
        // const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
        const geometry = new RedGPU.Primitive.Sphere(redGPUContext,1,32,32);
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const spacing = 5;
        const startX = -7.5;

        // [KO] A. ColorMaterial 메시
        // [EN] A. ColorMaterial Mesh
        const materialColor = new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff');
        const meshColor = new RedGPU.Display.Mesh(redGPUContext, geometry, materialColor);
        meshColor.x = startX;
        scene.addChild(meshColor);

        // [KO] B. BitmapMaterial 메시
        // [EN] B. BitmapMaterial Mesh
        const materialBitmap = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
        const meshBitmap = new RedGPU.Display.Mesh(redGPUContext, geometry, materialBitmap);
        meshBitmap.x = startX + spacing;
        scene.addChild(meshBitmap);

        // [KO] C. PhongMaterial 메시
        // [EN] C. PhongMaterial Mesh
        const materialPhong = new RedGPU.Material.PhongMaterial(redGPUContext, '#ffffff');
        materialPhong.diffuseTexture = texture;

        const meshPhong = new RedGPU.Display.Mesh(redGPUContext, geometry, materialPhong);
        meshPhong.x = startX + spacing * 2;
        scene.addChild(meshPhong);

        // [KO] D. PBRMaterial 메시
        // [EN] D. PBRMaterial Mesh
        const materialPBR = new RedGPU.Material.PBRMaterial(redGPUContext);
        materialPBR.baseColorTexture = texture;
        materialPBR.roughnessFactor = 0.2;
        materialPBR.metallicFactor = 0.5;
        const meshPBR = new RedGPU.Display.Mesh(redGPUContext, geometry, materialPBR);
        meshPBR.x = startX + spacing * 3;
        scene.addChild(meshPBR);
        console.log(materialPBR)

        // 5. [KO] 초기 틴트 설정
        // [EN] Initial Tint Setup
        const meshes = [meshColor, meshBitmap, meshPhong, meshPBR];
        meshes.forEach(mesh => {
            mesh.material.useTint = true;
            mesh.material.tint.setColorByRGBA(255, 128, 0, 1);
        });

        // 6. [KO] 렌더러 생성 및 애니메이션 루프 시작
        // [EN] Create Renderer and Start Animation Loop
        const renderer = new RedGPU.Renderer();
        const render = () => {
            // [KO] 모든 메시 회전
            // [EN] Rotate all meshes
            meshes.forEach(mesh => {
                mesh.rotationX += 0.5;
                mesh.rotationY += 0.5;
            });
        };
        renderer.start(redGPUContext, render);

        // 7. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, meshes);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

/**
 * [KO] 틴트 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for tint control.
 */
const renderTestPane = (redGPUContext, meshes) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: "Global Tint Control", expanded: true});
            
            const materials = meshes.map(m => m.material);
            const firstMat = materials[0];

            const tintConfig = {
                color: { 
                    r: firstMat.tint.r, 
                    g: firstMat.tint.g, 
                    b: firstMat.tint.b, 
                    a: firstMat.tint.a 
                },
                useTint: firstMat.useTint,
                tintBlendMode: RedGPU.Material.TINT_BLEND_MODE[firstMat.tintBlendMode]
            };

            // [KO] 모든 머티리얼에 일괄 적용되는 틴트 설정
            // [EN] Tint settings applied globally to all materials

            // [KO] 틴트 사용 여부
            // [EN] Toggle Tint
            folder.addBinding(tintConfig, 'useTint', {label: 'useTint'}).on('change', (ev) => {
                materials.forEach(mat => mat.useTint = ev.value);
            });

            // [KO] 틴트 블렌드 모드
            // [EN] Tint Blend Mode
            folder.addBinding(tintConfig, 'tintBlendMode', {
                label: 'tintBlendMode',
                options: RedGPU.Material.TINT_BLEND_MODE
            }).on('change', (ev) => {
                materials.forEach(mat => mat.tintBlendMode = ev.value);
            });

            folder.addBlade({view: 'separator'});

            // [KO] 틴트 색상 제어
            // [EN] Tint Color Control
            folder.addBinding(tintConfig, 'color', {
                picker: 'inline',
                view: 'color',
                expanded: true,
                label: 'Tint Color'
            }).on('change', (ev) => {
                const {r, g, b, a} = ev.value;
                const ir = Math.floor(r), ig = Math.floor(g), ib = Math.floor(b);
                materials.forEach(mat => {
                    mat.tint.setColorByRGBA(ir, ig, ib, a);
                });
                pane.refresh();
            });

            // [KO] 개별 채널 제어
            // [EN] Individual Channel Control
            const channels = folder.addFolder({title: 'Individual Channels', expanded: false});
            ['r', 'g', 'b'].forEach(key => {
                channels.addBinding(tintConfig.color, key, {min: 0, max: 255, step: 1}).on('change', () => {
                    const val = Math.floor(tintConfig.color[key]);
                    materials.forEach(mat => mat.tint[key] = val);
                    pane.refresh();
                });
            });
            channels.addBinding(tintConfig.color, 'a', {min: 0, max: 1, step: 0.01, label: 'alpha'}).on('change', () => {
                materials.forEach(mat => mat.tint.a = tintConfig.color.a);
                pane.refresh();
            });
        }
    });
};
