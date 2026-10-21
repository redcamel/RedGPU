import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Basic Terrain 예제
 * [EN] Basic Terrain Example
 *
 * [KO] 단일 16비트 글로벌 하이트맵(globalHeightmapUrl)으로 대규모 지형을 생성하고, 연속 LOD·하이트맵 레이마칭 그림자 및 디버그 모드를 제어하는 기본 예제입니다.
 * [EN] Basic example creating a large-scale terrain from a single 16-bit global heightmap (globalHeightmapUrl) and controlling continuous LOD, raymarched heightmap shadows, and debug modes.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 2000;
        controller.minDistance = 400;
        controller.maxDistance = 3000;
        controller.tilt = -25;
        controller.pan = 35;
        controller.speedDistance = 50;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 14;
        directionalLight.azimuth = 135;
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 기본 Landscape 지형 생성 및 16비트 글로벌 하이트맵 설정
        // [EN] Create default Landscape terrain and set 16-bit global heightmap
        const landscape = new RedGPU.Landscape.Landscape(redGPUContext);
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';
        landscape.castHeightmapShadow = true;
        scene.landscape = landscape;

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, landscape, directionalLight);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, landscape, directionalLight) => {
    const params = {
        baseColor: landscape.baseColor.hex,
    };

    const quadOptions = {
        '16': 16,
        '32': 32,
        '64': 64,
        '128': 128,
        '256': 256,
        '512': 512
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const landscapeFolder = pane.addFolder({title: 'Landscape', expanded: true});
            landscapeFolder.addBinding(params, 'baseColor').on('change', (ev) => {
                landscape.baseColor.setColorByHEX(ev.value);
            });
            landscapeFolder.addBinding(landscape, 'heightScale', {min: 0, max: 600, step: 5});
            landscapeFolder.addBinding(landscape, 'receiveShadow');

            const lodFolder = landscapeFolder.addFolder({title: 'LOD', expanded: true});
            lodFolder.addBinding(landscape, 'lodMetric', {
                options: {
                    screenSize: 'screenSize',
                    distance: 'distance'
                }
            });
            lodFolder.addBinding(landscape, 'componentSizeQuads', {options: quadOptions});
            lodFolder.addBinding(landscape, 'lod0SizeQuads', {options: quadOptions});

            const shadowFolder = landscapeFolder.addFolder({title: 'Heightmap Shadow', expanded: true});
            shadowFolder.addBinding(landscape, 'castHeightmapShadow');
            shadowFolder.addBinding(landscape, 'heightmapShadowSteps', {min: 4, max: 32, step: 1});
            shadowFolder.addBinding(landscape, 'heightmapShadowSoftness', {min: 1, max: 20, step: 0.5});
            shadowFolder.addBinding(landscape, 'heightmapShadowDistance', {min: 200, max: 3000, step: 50});

            const debugFolder = landscapeFolder.addFolder({title: 'Debug', expanded: true});
            debugFolder.addBinding(landscape.debuggerManager, 'landscapeDebugMode', {
                options: {
                    'None (Full PBR)': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.NONE,
                    'Final Normal': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.FINAL_NORMAL,
                    'Macro Normal': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.MACRO_NORMAL,
                    'Albedo': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.ALBEDO,
                    'Roughness': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.ROUGHNESS,
                    'Ambient Occlusion': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.AMBIENT_OCCLUSION,
                    'Heightmap Shadow Mask': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.HEIGHTMAP_SHADOW_MASK,
                    'CSM Shadow Mask': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.CSM_SHADOW_MASK,
                    'Total Shadow Visibility': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.TOTAL_SHADOW_VISIBILITY,
                    'Elevation Heatmap': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.ELEVATION_HEATMAP,
                    'LOD Level': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.LOD_LEVEL
                }
            });
            debugFolder.addBinding(landscape.debuggerManager, 'landscapeWireframe');
            debugFolder.addBinding(landscape.debuggerManager, 'landscapeLodColoration');

            const lightFolder = pane.addFolder({title: 'Light', expanded: false});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
        }
    });
};
