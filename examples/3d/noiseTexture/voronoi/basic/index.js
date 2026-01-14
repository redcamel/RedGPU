import * as RedGPU from "../../../../../dist/index.js?t=1768401228425";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 55;
        controller.speedDistance = 2;

        const scene = new RedGPU.Display.Scene();

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.intensity = 2;
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const geometry = new RedGPU.Primitive.Ground(redGPUContext, 50, 50, 1000, 1000);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = new RedGPU.Resource.VoronoiTexture(redGPUContext);

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

        mesh.setPosition(0, 0, 0);
        scene.addChild(mesh);

        const testData = {useAnimation: true};
        renderTestPane(redGPUContext, material.diffuseTexture, testData);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, (time) => {
            if (testData.useAnimation) {
                if (material.diffuseTexture) material.diffuseTexture.time = time;
            }
        });
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "18px";
        errorMessage.style.padding = "20px";
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = async (redGPUContext, targetNoiseTexture, testData) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1768401228425');
    const {
        setSeparator,
        setDebugButtons
    } = await import("../../../../exampleHelper/createExample/panes/index.js?t=1768401228425");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    setSeparator(pane, "Voronoi Presets");

    pane.addButton({title: '🔲 Classic Cells'}).on('click', () => {
        targetNoiseTexture.frequency = 8.0;
        targetNoiseTexture.distanceScale = 1.0;
        targetNoiseTexture.octaves = 1;
        targetNoiseTexture.persistence = 0.5;
        targetNoiseTexture.lacunarity = 2.0;
        targetNoiseTexture.seed = 0;
        targetNoiseTexture.setEuclideanDistance();
        targetNoiseTexture.setF1Output();
        targetNoiseTexture.jitter = 1.0;
        pane.refresh();
    });

    pane.addButton({title: '🕸️ Crack Pattern'}).on('click', () => {
        targetNoiseTexture.frequency = 12.0;
        targetNoiseTexture.distanceScale = 2.0;
        targetNoiseTexture.octaves = 2;
        targetNoiseTexture.persistence = 0.4;
        targetNoiseTexture.lacunarity = 2.5;
        targetNoiseTexture.seed = 123;
        targetNoiseTexture.setEuclideanDistance();
        targetNoiseTexture.setCrackPattern();
        targetNoiseTexture.jitter = 0.8;
        pane.refresh();
    });

    // 🎨 셀 ID 관련 프리셋 추가
    pane.addButton({title: '🎨 Stained Glass'}).on('click', () => {
        targetNoiseTexture.frequency = 6.0;
        targetNoiseTexture.distanceScale = 1.0;
        targetNoiseTexture.octaves = 1;
        targetNoiseTexture.persistence = 0.5;
        targetNoiseTexture.lacunarity = 2.0;
        targetNoiseTexture.seed = 42;
        targetNoiseTexture.setEuclideanDistance();
        targetNoiseTexture.setCellIdColorOutput();
        targetNoiseTexture.jitter = 0.7;
        targetNoiseTexture.cellIdColorIntensity = 0.8;
        pane.refresh();
    });

    pane.addButton({title: '🗺️ Biome Map'}).on('click', () => {
        targetNoiseTexture.frequency = 4.0;
        targetNoiseTexture.distanceScale = 1.0;
        targetNoiseTexture.octaves = 1;
        targetNoiseTexture.persistence = 0.5;
        targetNoiseTexture.lacunarity = 2.0;
        targetNoiseTexture.seed = 100;
        targetNoiseTexture.setEuclideanDistance();
        targetNoiseTexture.setCellIdOutput();
        targetNoiseTexture.jitter = 0.8;
        pane.refresh();
    });

    pane.addButton({title: '🌈 Colorful Mosaic'}).on('click', () => {
        targetNoiseTexture.frequency = 15.0;
        targetNoiseTexture.distanceScale = 1.0;
        targetNoiseTexture.octaves = 1;
        targetNoiseTexture.persistence = 0.5;
        targetNoiseTexture.lacunarity = 2.0;
        targetNoiseTexture.seed = 777;
        targetNoiseTexture.setManhattanDistance();
        targetNoiseTexture.setCellIdColorOutput();
        targetNoiseTexture.jitter = 0.3;
        targetNoiseTexture.cellIdColorIntensity = 1.0;
        pane.refresh();
    });

    pane.addButton({title: '🏺 Ceramic Tiles'}).on('click', () => {
        targetNoiseTexture.frequency = 15.0;
        targetNoiseTexture.distanceScale = 1.5;
        targetNoiseTexture.octaves = 1;
        targetNoiseTexture.persistence = 0.3;
        targetNoiseTexture.lacunarity = 2.0;
        targetNoiseTexture.seed = 456;
        targetNoiseTexture.setManhattanDistance();
        targetNoiseTexture.setF1Output();
        targetNoiseTexture.jitter = 0.6;
        pane.refresh();
    });

    pane.addButton({title: '🎲 Circuit Board'}).on('click', () => {
        targetNoiseTexture.frequency = 20.0;
        targetNoiseTexture.distanceScale = 1.2;
        targetNoiseTexture.octaves = 3;
        targetNoiseTexture.persistence = 0.6;
        targetNoiseTexture.lacunarity = 2.2;
        targetNoiseTexture.seed = 789;
        targetNoiseTexture.setChebyshevDistance();
        targetNoiseTexture.setF2Output();
        targetNoiseTexture.jitter = 0.4;
        pane.refresh();
    });

    pane.addButton({title: '🪨 Stone Wall'}).on('click', () => {
        targetNoiseTexture.frequency = 6.0;
        targetNoiseTexture.distanceScale = 2.5;
        targetNoiseTexture.octaves = 4;
        targetNoiseTexture.persistence = 0.7;
        targetNoiseTexture.lacunarity = 1.8;
        targetNoiseTexture.seed = 999;
        targetNoiseTexture.setEuclideanDistance();
        targetNoiseTexture.setSmoothBlend();
        targetNoiseTexture.jitter = 0.9;
        pane.refresh();
    });

    pane.addButton({title: '🧊 Ice Crystals'}).on('click', () => {
        targetNoiseTexture.frequency = 10.0;
        targetNoiseTexture.distanceScale = 1.8;
        targetNoiseTexture.octaves = 2;
        targetNoiseTexture.persistence = 0.5;
        targetNoiseTexture.lacunarity = 3.0;
        targetNoiseTexture.seed = 333;
        targetNoiseTexture.setEuclideanDistance();
        targetNoiseTexture.setF2Output();
        targetNoiseTexture.jitter = 0.2;
        pane.refresh();
    });

    pane.addButton({title: '🌐 Honeycomb'}).on('click', () => {
        targetNoiseTexture.frequency = 25.0;
        targetNoiseTexture.distanceScale = 0.8;
        targetNoiseTexture.octaves = 1;
        targetNoiseTexture.persistence = 0.3;
        targetNoiseTexture.lacunarity = 2.0;
        targetNoiseTexture.seed = 666;
        targetNoiseTexture.setEuclideanDistance();
        targetNoiseTexture.setCrackPattern();
        targetNoiseTexture.jitter = 0.1;
        pane.refresh();
    });

    pane.addButton({title: '🗿 Volcanic Rock'}).on('click', () => {
        targetNoiseTexture.frequency = 4.0;
        targetNoiseTexture.distanceScale = 3.0;
        targetNoiseTexture.octaves = 5;
        targetNoiseTexture.persistence = 0.8;
        targetNoiseTexture.lacunarity = 2.1;
        targetNoiseTexture.seed = 555;
        targetNoiseTexture.setManhattanDistance();
        targetNoiseTexture.setSmoothBlend();
        targetNoiseTexture.jitter = 1.0;
        pane.refresh();
    });

    setSeparator(pane, "Basic Parameters");

    pane.addBinding(targetNoiseTexture, 'frequency', {
        min: 0.1,
        max: 50,
        step: 0.1
    });

    pane.addBinding(targetNoiseTexture, 'distanceScale', {
        min: 0.1,
        max: 5,
        step: 0.01
    });

    pane.addBinding(targetNoiseTexture, 'octaves', {
        min: 1,
        max: 8,
        step: 1
    });

    pane.addBinding(targetNoiseTexture, 'persistence', {
        min: 0,
        max: 1,
        step: 0.01
    });

    pane.addBinding(targetNoiseTexture, 'lacunarity', {
        min: 1,
        max: 5,
        step: 0.01
    });

    pane.addBinding(targetNoiseTexture, 'seed', {
        min: 0,
        max: 1000,
        step: 1
    });

    setSeparator(pane, "Voronoi Specific");

    pane.addBinding(targetNoiseTexture, 'distanceType', {
        options: {
            'Euclidean (원형)': RedGPU.Resource.VORONOI_DISTANCE_TYPE.EUCLIDEAN,
            'Manhattan (다이아몬드)': RedGPU.Resource.VORONOI_DISTANCE_TYPE.MANHATTAN,
            'Chebyshev (사각형)': RedGPU.Resource.VORONOI_DISTANCE_TYPE.CHEBYSHEV
        }
    });

    pane.addBinding(targetNoiseTexture, 'outputType', {
        options: {
            'F1 (첫번째 거리)': RedGPU.Resource.VORONOI_OUTPUT_TYPE.F1,
            'F2 (두번째 거리)': RedGPU.Resource.VORONOI_OUTPUT_TYPE.F2,
            'F2-F1 (크랙 패턴)': RedGPU.Resource.VORONOI_OUTPUT_TYPE.F2_MINUS_F1,
            'F1+F2 (블렌딩)': RedGPU.Resource.VORONOI_OUTPUT_TYPE.F1_PLUS_F2,
            'Cell ID (셀 ID)': RedGPU.Resource.VORONOI_OUTPUT_TYPE.CELL_ID,
            'Cell ID Color (컬러 셀 ID)': RedGPU.Resource.VORONOI_OUTPUT_TYPE.CELL_ID_COLOR
        }
    });

    pane.addBinding(targetNoiseTexture, 'jitter', {
        min: 0,
        max: 1,
        step: 0.01
    });

    // 셀 ID 컬러 강도 컨트롤 추가
    pane.addBinding(targetNoiseTexture, 'cellIdColorIntensity', {
        min: 0.1,
        max: 2.0,
        step: 0.01,
        label: 'Color Intensity'
    });

    setSeparator(pane, "Quick Actions");

    const quickActions = pane.addFolder({title: 'Distance Types', expanded: true});
    quickActions.addButton({title: '🔵 Euclidean'}).on('click', () => {
        targetNoiseTexture.setEuclideanDistance();
        pane.refresh();
    });
    quickActions.addButton({title: '💎 Manhattan'}).on('click', () => {
        targetNoiseTexture.setManhattanDistance();
        pane.refresh();
    });
    quickActions.addButton({title: '🔲 Chebyshev'}).on('click', () => {
        targetNoiseTexture.setChebyshevDistance();
        pane.refresh();
    });

    // 셀 ID 전용 프리셋 폴더 추가
    const cellIdActions = pane.addFolder({title: 'Cell ID Presets', expanded: true});
    cellIdActions.addButton({title: '🎨 Stained Glass'}).on('click', () => {
        targetNoiseTexture.setStainedGlassPattern();
        pane.refresh();
    });
    cellIdActions.addButton({title: '🌈 Mosaic'}).on('click', () => {
        targetNoiseTexture.setMosaicPattern();
        pane.refresh();
    });
    cellIdActions.addButton({title: '🗺️ Biome Map'}).on('click', () => {
        targetNoiseTexture.setBiomeMapPattern();
        pane.refresh();
    });

    const utilActions = pane.addFolder({title: 'Utilities', expanded: true});
    utilActions.addButton({title: '🎲 Random Seed'}).on('click', () => {
        targetNoiseTexture.randomizeSeed();
        pane.refresh();
    });

    const animation = pane.addFolder({title: 'Animation', expanded: true});
    animation.addBinding(testData, 'useAnimation');
    animation.addBinding(targetNoiseTexture, 'animationSpeed', {
        min: 0,
        max: 1,
        step: 0.001
    });
    animation.addBinding(targetNoiseTexture, 'animationX', {
        min: -1,
        max: 1,
        step: 0.001
    });
    animation.addBinding(targetNoiseTexture, 'animationY', {
        min: -1,
        max: 1,
        step: 0.001
    });
};
