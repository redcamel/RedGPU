import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Landscape Basic LOD & Full Feature 테스트 예제
 * [EN] Landscape Basic LOD & Full Feature Test Example
 *
 * [KO] 신규 Landscape 지형 시스템의 모든 get/set 속성 실시간 검증 예제입니다.
 * [EN] Real-time test example for all get/set properties of the new Landscape terrain system.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 설정 (FreeController - 자유 관람 및 탐색)
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.x = 0;
        controller.y = 1150;
        controller.z = 0;
        controller.moveSpeed = 5000;
        // 2. Scene & View3D 초기화
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. 태양 광원 (Directional Light)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 4. 신규 Landscape 인스턴스 생성 (16x16 256개 타일 에셋 대응)
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [16000, 16000];
        landscape.componentCount = [16, 16];
        landscape.heightScale = 1500;
        landscape.maxLODLevel = 5;
        landscape.loadingRadius = 4000;

        // 4-1. 지형 기본 바탕 색상 설정
        landscape.baseColor.setColorByHEX('#387d42');

        // Multi-Layer PBR 지형 레이어 4종 (Grass, Rock, Gravel, Leave) 등록
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const linearFormat = navigator.gpu.getPreferredCanvasFormat();

        // 1장의 Channel-Packed Splatmap 텍스처 경로 (R: Layer0, G: Layer1, B: Layer2, A: Layer3)
        const splatMapPath = '../../../assets/terrain/terrainTest_001/splatMap.jpg';

        // 1. Grass (주 광활한 초원/산맥 레이어 - 🔴 R 채널: 전체 지형의 65% 최대 면적 차지)
        const grassLayer = new RedGPU.Display.Landscape.LandscapeLayer({
            name: 'Grass',
            baseColorTexture: `${assetPath}grass.jpg`,
            normalTexture: `${assetPath}grass_normal.jpg`,
            ormTexture: `${assetPath}grass_orm.jpg`,
            weightTexture: splatMapPath,
            weightChannel: 'R',
            uvScale: [50, 50],
            roughness: 0.85,
            metallic: 0.0,
            normalIntensity: 1.5,
            aoIntensity: 1.0,
            tintColor: '#ffffff'
        });

        // 2. Gravel (오솔길/흙길 레이어 - 🔵 B 채널: 좁은 오솔길 10%)
        const gravelLayer = new RedGPU.Display.Landscape.LandscapeLayer({
            name: 'Gravel',
            baseColorTexture: `${assetPath}gravel.jpg`,
            normalTexture: `${assetPath}gravel_normal.jpg`,
            ormTexture: `${assetPath}gravel_orm.jpg`,
            weightTexture: splatMapPath,
            weightChannel: 'B',
            uvScale: [40, 40],
            roughness: 0.9,
            metallic: 0.0,
            normalIntensity: 1.8,
            aoIntensity: 1.2,
            tintColor: '#ffffff'
        });

        // 3. Rock (절벽/암벽 레이어 - 🟢 G 채널: 능선 및 절벽 포인트 20%)
        const rockLayer = new RedGPU.Display.Landscape.LandscapeLayer({
            name: 'Rock',
            baseColorTexture: `${assetPath}rock.jpg`,
            normalTexture: `${assetPath}rock_normal.jpg`,
            ormTexture: `${assetPath}rock_orm.jpg`,
            weightTexture: splatMapPath,
            weightChannel: 'G',
            uvScale: [15, 15],
            roughness: 0.7,
            metallic: 0.05,
            normalIntensity: 2.2,
            aoIntensity: 1.5,
            tintColor: '#ffffff'
        });

        // 4. Leave (골짜기/숲속 레이어 - ⚫ A / Black 채널: 그늘진 골짜기 5%)
        const leaveLayer = new RedGPU.Display.Landscape.LandscapeLayer({
            name: 'Leave',
            baseColorTexture: `${assetPath}leave.jpg`,
            normalTexture: `${assetPath}leave_normal.jpg`,
            ormTexture: `${assetPath}leave_orm.jpg`,
            weightTexture: splatMapPath,
            weightChannel: 'A',
            uvScale: [50, 50],
            roughness: 0.8,
            metallic: 0.0,
            normalIntensity: 1.4,
            aoIntensity: 1.0,
            tintColor: '#ffffff'
        });

        landscape.addLayer(grassLayer);
        landscape.addLayer(gravelLayer);
        landscape.addLayer(rockLayer);
        landscape.addLayer(leaveLayer);

        landscape.tileUrlResolver = (row, col) => {
            const BASE_HOST = 'https://redcamel.github.io/testAsset/terrain/tile_001/';
            const rStr = String(row).padStart(2, '0');
            const cStr = String(col).padStart(2, '0');

            // [KO] tile_001 에셋의 외곽(15번째) 타일 해상도 파일명 처리
            let sizeStr = '512_512';
            if (row === 15 && col === 15) {
                sizeStr = '449_449';
            } else if (col === 15) {
                sizeStr = '449_512';
            } else if (row === 15) {
                sizeStr = '512_449';
            }

            return `${BASE_HOST}28_134_86_730_13_${sizeStr}_16bit_tile_${rStr}_${cStr}.png`;
        };

        scene.addLandscape(landscape);

        // 5. LandscapeFoliageManager 생성 및 리얼 3D 잔디 식생 테스트 파퓰레이션
        const foliageManager = landscape.foliageManager;
        const grassMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        grassMaterial.baseColorTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/terrain/terrainTest_001/layer/grass.jpg'
        );
        grassMaterial.normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/terrain/terrainTest_001/layer/grass_normal.jpg'
        );
        grassMaterial.metallicRoughnessTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/terrain/terrainTest_001/layer/grass_orm.jpg'
        );
        grassMaterial.baseColorFactor = [0.85, 1.25, 0.75, 1.0];
        grassMaterial.roughnessFactor = 0.55;
        grassMaterial.metallicFactor = 0.0;

        // 🌿 3D 리얼 잔디풀 클러스터 지오메트리 생성 함수 (3-Way Star Curved Double-Sided Blades)
        function createGrassClumpGeometry(context, width = 2.0, height = 3.8, numBlades = 3) {
            const interleaveData = [];
            const indexData = [];
            let vertexOffset = 0;

            for (let b = 0; b < numBlades; b++) {
                const baseAngle = (b * Math.PI) / numBlades + (b * 0.25);
                const cosA = Math.cos(baseAngle);
                const sinA = Math.sin(baseAngle);

                // 블레이드 가로 방향 (X, Z 평면)
                const sideX = -sinA * (width * 0.5);
                const sideZ = cosA * (width * 0.5);

                // 활처럼 휘어지는 방향
                const bendX = cosA * (width * 0.45);
                const bendZ = sinA * (width * 0.45);

                // 4단계 높이 세그먼트 (뿌리 -> 하단 -> 중단 -> 뾰족한 끝)
                const segments = [
                    {yRatio: 0.0, widthScale: 1.0, bend: 0.0, v: 0.0},
                    {yRatio: 0.35, widthScale: 0.85, bend: 0.25, v: 0.35},
                    {yRatio: 0.7, widthScale: 0.55, bend: 0.65, v: 0.7},
                    {yRatio: 1.0, widthScale: 0.05, bend: 1.2, v: 1.0}
                ];

                const baseVOffset = vertexOffset;

                for (let s = 0; s < segments.length; s++) {
                    const seg = segments[s];
                    const y = height * seg.yRatio;
                    const bx = bendX * seg.bend;
                    const bz = bendZ * seg.bend;
                    const w = seg.widthScale;

                    const lx = -sideX * w + bx;
                    const lz = -sideZ * w + bz;
                    const rx = sideX * w + bx;
                    const rz = sideZ * w + bz;

                    // 자연스러운 상향 확산 노멀
                    const nx = cosA * 0.25;
                    const nz = sinA * 0.25;
                    const ny = 0.95;
                    const normLen = Math.sqrt(nx * nx + ny * ny + nz * nz);

                    // 좌측 정점 (x, y, z, nx, ny, nz, u, v, tx, ty, tz, tw)
                    interleaveData.push(
                        lx, y, lz,
                        nx / normLen, ny / normLen, nz / normLen,
                        0.0, seg.v,
                        1.0, 0.0, 0.0, 1.0
                    );

                    // 우측 정점
                    interleaveData.push(
                        rx, y, rz,
                        nx / normLen, ny / normLen, nz / normLen,
                        1.0, seg.v,
                        1.0, 0.0, 0.0, 1.0
                    );

                    vertexOffset += 2;
                }

                // 양면 렌더링 인덱스 (Double-Sided Quad Indices)
                for (let s = 0; s < segments.length - 1; s++) {
                    const i0 = baseVOffset + s * 2;
                    const i1 = baseVOffset + s * 2 + 1;
                    const i2 = baseVOffset + (s + 1) * 2;
                    const i3 = baseVOffset + (s + 1) * 2 + 1;

                    // 앞면
                    indexData.push(i0, i1, i2);
                    indexData.push(i1, i3, i2);
                    // 뒷면
                    indexData.push(i0, i2, i1);
                    indexData.push(i1, i2, i3);
                }
            }

            return RedGPU.Primitive.Core.createPrimitiveGeometry(
                context,
                interleaveData,
                indexData,
                `GrassClumpGeometry_${width}_${height}_${numBlades}`
            );
        }


        const grassGeometry = createGrassClumpGeometry(redGPUContext, 2.2, 4.2, 3);
        const dummyGrassMesh = new RedGPU.Display.Mesh(
            redGPUContext,
            grassGeometry,
            grassMaterial
        );

        const grassType = foliageManager.addFoliageType({
            name: 'BasicGrass',
            mesh: dummyGrassMesh,
            maxInstances: 1000000,
            cullingDistance: 2500,
            fadeStartDistance: 1000,
            minScale: [0.8, 0.3, 0.8],
            maxScale: [1.3, 0.3, 1.3],
            randomRotationY: true
        });

        let treeType = null;

        // 🌟 [GLB 수목 로드 및 Multi-Submesh Foliage 인스턴싱 등록]
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/tree_elm.glb',
            (loader) => {
                const treeMesh = loader.resultMesh;

                // 🌲 지형 전역 대량 인스턴싱 FoliageType으로 등록! (현실적인 수목 스케일 & LOD 파라미터)
                treeType = foliageManager.addFoliageType({
                    name: 'ElmTree',
                    mesh: treeMesh,
                    maxInstances: 1000000,
                    cullingDistance: 3500,
                    fadeStartDistance: 3000,
                    minScale: [1, 1, 1],        // 현실적인 성목 높이 (약 7~8m)
                    maxScale: [1, 1, 1],   // 대형 거목 높이 (약 12~14m)
                    // randomRotationY: true,
                    // 🌟 언리얼 엔진 5 스타일 SpeedTree Cross-Billboard Impostor LOD & Dithered Crossfade
                    billboard: {
                        enabled: true,
                        lodDistance: 250, // 90m 전환 중심 거리
                        fadeRange: 30    // 75m ~ 105m 구간에서 3D 모델과 십자 빌보드가 부드럽게 디더링 크로스페이드 (팝핑 0%!)
                    }
                });


                console.log('[Foliage Example 🌳] Extracted SubMeshes in treeType:', treeType.subMeshes.map(s => ({
                    name: s.mesh.name,
                    alphaBlend: s.material.alphaBlend,
                    useCutOff: s.material.useCutOff,
                    cutOff: s.material.cutOff,
                    transparent: s.material.transparent,
                    indexCount: s.indexCount,
                    vertexCount: s.vertexCount,
                    isIndexed: s.isIndexed,
                    hasVB: !!s.geometry.vertexBuffer?.gpuBuffer,
                    hasIB: !!s.geometry.indexBuffer?.gpuBuffer,
                })));
                console.log('[Foliage Example 🌳] activeInstanceCount:', treeType.activeInstanceCount);
                console.log('[Foliage Example 🌳] ElmTree FoliageType registered successfully! SubMeshes:', treeType.subMeshes.length);
            }
        );


        // 5-1. Landscape 내장 디버거 관리자(debuggerManager) 활성화 (Spatial Grid 디버거만 기본 활성화)
        landscape.debuggerManager.spatialGrid = true;

        // 6. RedGPU 정식 Renderer 생성 및 렌더 루프 시작 (디버거는 landscape.update 내부에서 자동 갱신됨)
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        // 7. Landscape 모든 get/set 속성 및 2D 디버거 전면 제어 테스트 패널 렌더링
        renderTestPane(redGPUContext, landscape, controller, directionalLight, [grassLayer, rockLayer, gravelLayer, leaveLayer], foliageManager, treeType);

    }
);

/**
 * [KO] Landscape 모든 get/set 속성 전면 제어 테스트 패널(GUI)을 렌더링합니다.
 * [EN] Renders a test panel (GUI) for full control of all get/set properties of Landscape.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Landscape.Landscape} landscape
 * @param {RedGPU.Camera.FreeController} controller
 * @param {RedGPU.Light.DirectionalLight} directionalLight
 * @param {Array<RedGPU.Display.Landscape.LandscapeLayer>} layers
 * @param {RedGPU.Display.Landscape.LandscapeFoliageManager} foliageManager
 * @param {RedGPU.Display.Landscape.FoliageType} grassType
 */
const renderTestPane = (redGPUContext, landscape, controller, directionalLight, layers, foliageManager, grassType) => {
    const [wsX, wsZ] = landscape ? landscape.worldSize : [8000, 8000];
    const [tcX, tcZ] = landscape ? landscape.componentCount : [8, 8];
    const [tsX, tsZ] = landscape ? landscape.tileSize : [1000, 1000];

    const config = {
        // Foliage Controls
        foliageCount: grassType ? grassType.activeInstanceCount : 0,
        foliageCullingDist: grassType ? grassType.options.cullingDistance : 600,
        foliageFadeStartDist: grassType ? grassType.options.fadeStartDistance : 400,
        billboardWireframe: false,
        // 1. Terrain Dimensions & Transform
        worldSizeX: wsX,
        worldSizeZ: wsZ,
        componentCountX: tcX,
        componentCountZ: tcZ,
        totalComponents: tcX * tcZ,
        tileSizeStr: `[${Math.round(tsX)}m, ${Math.round(tsZ)}m]`,

        // 2. Component & Mesh Specs
        componentSizeQuads: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_64,
        maxLODLevel: landscape ? landscape.maxLODLevel : 4,
        lodFadeStartRatio: landscape ? landscape.lodFadeStartRatio : 0.7,
        lodGeomorphStartRatio: landscape ? landscape.lodGeomorphStartRatio : 0.85,

        // 3. Height & Displacement
        heightScale: landscape ? landscape.heightScale : 1000,

        // 4. Display
        wireframe: landscape ? landscape.wireframe : false,
        lodColoration: landscape ? landscape.lodColoration : false,
        baseColor: '#387d42',
        textureArraySize: 1024,

        // 4-1. Directional Light (Sun)
        sunElevation: directionalLight ? directionalLight.elevation : 45,
        sunAzimuth: directionalLight ? directionalLight.azimuth : 45,
        sunColor: '#ffffff',

        // 5. Tile Streaming & VHT
        loadingRadius: landscape ? landscape.loadingRadius : 2500,
        maxLoadsPerFrame: landscape ? landscape.maxLoadsPerFrame : 2,
        loadedTileCount: landscape ? landscape.loadedTileCount : 0,
        pendingQueueSize: landscape ? landscape.pendingQueueSize : 0,

        // 6. Camera Controls
        moveSpeed: controller ? controller.moveSpeed : 5000,

        // 7. Debuggers
        boxSize: 100
    };

    let activePane = null;

    const updateConfigValues = () => {
        if (landscape) {
            const [wX, wZ] = landscape.worldSize;
            const [tX, tZ] = landscape.componentCount;
            const [sX, sZ] = landscape.tileSize;

            config.worldSizeX = wX;
            config.worldSizeZ = wZ;
            config.componentCountX = tX;
            config.componentCountZ = tZ;
            config.totalComponents = tX * tZ;
            config.tileSizeStr = `[${Math.round(sX)}m, ${Math.round(sZ)}m]`;
            config.loadedTileCount = landscape.loadedTileCount;
            config.pendingQueueSize = landscape.pendingQueueSize;

            if (activePane) activePane.refresh();
        }
    };

    setInterval(updateConfigValues, 500);

    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            activePane = pane;

            // Folder 0: Foliage System Controls
            const currentFoliageType = grassType || foliageManager?.getFoliageType('ElmTree') || foliageManager?.getFoliageType('BasicGrass');
            if (currentFoliageType || foliageManager) {
                const folderFoliage = pane.addFolder({title: 'Foliage', expanded: true});
                folderFoliage.addBinding(config, 'foliageCount', {readonly: true});
                folderFoliage.addBinding(config, 'foliageCullingDist', {
                    min: 500,
                    max: 8000,
                    step: 50
                }).on('change', (ev) => {
                    const target = grassType || foliageManager?.getFoliageType('ElmTree');
                    if (target) target.options.cullingDistance = ev.value;
                });
                folderFoliage.addBinding(config, 'foliageFadeStartDist', {
                    min: 200,
                    max: 6000,
                    step: 50
                }).on('change', (ev) => {
                    const target = grassType || foliageManager?.getFoliageType('ElmTree');
                    if (target) target.options.fadeStartDistance = ev.value;
                });
                folderFoliage.addBinding(config, 'billboardWireframe').on('change', (ev) => {
                    const target = grassType || foliageManager?.getFoliageType('ElmTree');
                    if (target) {
                        target.setBillboardWireframe(ev.value);
                        console.log('[Foliage Example 📐] Billboard Wireframe toggled:', ev.value);
                    }
                });
            }


            // Folder 1: Spatial System (Dimensions & LOD)
            const folderSpatial = pane.addFolder({title: 'Spatial', expanded: true});
            const folderDimensions = folderSpatial.addFolder({title: 'Dimensions', expanded: true});

            folderDimensions.addBinding(config, 'worldSizeX', {
                min: 1000,
                max: 30000,
                step: 500
            }).on('change', (ev) => {
                config.worldSizeX = ev.value;
                if (landscape) {
                    landscape.worldSize = [config.worldSizeX, config.worldSizeZ];
                    updateConfigValues();
                }
            });

            folderDimensions.addBinding(config, 'worldSizeZ', {
                min: 1000,
                max: 30000,
                step: 500
            }).on('change', (ev) => {
                config.worldSizeZ = ev.value;
                if (landscape) {
                    landscape.worldSize = [config.worldSizeX, config.worldSizeZ];
                    updateConfigValues();
                }
            });

            const maxTilesAllowed = Math.floor((redGPUContext.gpuDevice?.limits?.maxTextureDimension2D ?? 8192) / 512);

            folderDimensions.addBinding(config, 'componentCountX', {
                min: 1,
                max: maxTilesAllowed,
                step: 1
            }).on('change', (ev) => {
                config.componentCountX = ev.value;
                if (landscape) {
                    landscape.componentCount = [config.componentCountX, config.componentCountZ];
                    updateConfigValues();
                }
            });

            folderDimensions.addBinding(config, 'componentCountZ', {
                min: 1,
                max: maxTilesAllowed,
                step: 1
            }).on('change', (ev) => {
                config.componentCountZ = ev.value;
                if (landscape) {
                    landscape.componentCount = [config.componentCountX, config.componentCountZ];
                    updateConfigValues();
                }
            });

            folderDimensions.addBinding(config, 'tileSizeStr', {readonly: true});
            folderDimensions.addBinding(config, 'totalComponents', {readonly: true});

            const folderLOD = folderSpatial.addFolder({title: 'LOD', expanded: true});

            folderLOD.addBinding(config, 'componentSizeQuads', {
                options: {
                    16: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_16,
                    32: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_32,
                    64: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_64,
                    128: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_128,
                    256: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_256,
                    512: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_512
                }
            }).on('change', (ev) => {
                if (landscape) {
                    landscape.componentSizeQuads = ev.value;
                    updateConfigValues();
                }
            });

            folderLOD.addBinding(config, 'maxLODLevel', {
                min: 1,
                max: 8,
                step: 1
            }).on('change', (ev) => {
                if (landscape) {
                    landscape.maxLODLevel = ev.value;
                    updateConfigValues();
                }
            });

            folderLOD.addBinding(config, 'lodFadeStartRatio', {
                min: 0.1,
                max: 0.99,
                step: 0.05
            }).on('change', (ev) => {
                if (landscape) landscape.lodFadeStartRatio = ev.value;
            });

            folderLOD.addBinding(config, 'lodGeomorphStartRatio', {
                min: 0.1,
                max: 0.99,
                step: 0.05
            }).on('change', (ev) => {
                if (landscape) landscape.lodGeomorphStartRatio = ev.value;
            });

            if (landscape) {
                const folderStream = folderSpatial.addFolder({title: 'Tile Streaming', expanded: true});

                folderStream.addBinding(config, 'loadedTileCount', {readonly: true});
                folderStream.addBinding(config, 'pendingQueueSize', {readonly: true});

                folderStream.addBinding(config, 'loadingRadius', {
                    min: 500,
                    max: 20000,
                    step: 100
                }).on('change', (ev) => {
                    if (landscape) landscape.loadingRadius = ev.value;
                });

                folderStream.addBinding(config, 'maxLoadsPerFrame', {
                    min: 1,
                    max: 10,
                    step: 1
                }).on('change', (ev) => {
                    if (landscape) landscape.maxLoadsPerFrame = ev.value;
                });

                folderStream.addButton({title: 'Rebake All Loaded VBT'}).on('click', () => {
                    landscape.requestVBTRebake(true);
                });

                folderStream.addButton({title: 'Reset Tile Streaming Cache'}).on('click', () => {
                    if (landscape && landscape.tileStreamer) {
                        landscape.tileStreamer.resetTileState();
                    }
                });
            }

            // Folder 2: Display Options
            const folderDisplay = pane.addFolder({title: 'Display', expanded: true});

            folderDisplay.addBinding(config, 'heightScale', {
                min: 0,
                max: 3000,
                step: 25
            }).on('change', (ev) => {
                if (landscape) landscape.heightScale = ev.value;
            });

            folderDisplay.addBinding(config, 'wireframe').on('change', (ev) => {
                if (landscape) landscape.wireframe = ev.value;
            });

            folderDisplay.addBinding(config, 'lodColoration').on('change', (ev) => {
                if (landscape) landscape.lodColoration = ev.value;
            });

            folderDisplay.addBinding(config, 'baseColor').on('change', (ev) => {
                if (landscape) {
                    landscape.baseColor.setColorByHEX(ev.value);
                }
            });

            folderDisplay.addBinding(config, 'textureArraySize', {
                readonly: true
            });

            // Folder 3: Multi-Layer PBR Controls (Grass, Rock, Gravel, Leave)
            if (layers && layers.length) {
                const folderLayers = pane.addFolder({title: 'Layers', expanded: true});

                layers.forEach((layer) => {
                    const subFolder = folderLayers.addFolder({
                        title: layer.name,
                        expanded: layer.name === 'Grass'
                    });

                    subFolder.addBinding(layer, 'enabled');
                    subFolder.addBinding(layer, 'weightChannel', {
                        options: {R: 'R', G: 'G', B: 'B', A: 'A'}
                    });

                    const tintObj = {tintColor: layer.tintColor ? layer.tintColor.hex : '#ffffff'};
                    subFolder.addBinding(tintObj, 'tintColor').on('change', (e) => {
                        layer.tintColor = e.value;
                    });

                    subFolder.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.01});
                    subFolder.addBinding(layer, 'metallic', {min: 0, max: 1, step: 0.01});
                    subFolder.addBinding(layer, 'normalIntensity', {min: 0, max: 3, step: 0.01});
                    subFolder.addBinding(layer, 'aoIntensity', {min: 0, max: 2, step: 0.01});

                    const layerScaleObj = {uvScale: layer.uvScale[0]};
                    subFolder.addBinding(layerScaleObj, 'uvScale', {
                        min: 1,
                        max: 200,
                        step: 1
                    }).on('change', (e) => {
                        layer.uvScale = [e.value, e.value];
                    });
                });
            }

            // Folder 4: Directional Light Controls
            const folderSun = pane.addFolder({title: 'Directional Light', expanded: true});

            folderSun.addBinding(config, 'sunElevation', {
                min: -90,
                max: 90,
                step: 1
            }).on('change', (ev) => {
                if (directionalLight) directionalLight.elevation = ev.value;
            });

            folderSun.addBinding(config, 'sunAzimuth', {
                min: 0,
                max: 360,
                step: 1
            }).on('change', (ev) => {
                if (directionalLight) directionalLight.azimuth = ev.value;
            });


            folderSun.addBinding(config, 'sunColor').on('change', (ev) => {
                if (directionalLight && directionalLight.color) {
                    directionalLight.color.setColorByHEX(ev.value);
                }
            });

            // Folder 6: Camera Controls
            if (controller) {
                const folderCam = pane.addFolder({title: 'Camera', expanded: true});
                folderCam.addBinding(config, 'moveSpeed', {
                    min: 500,
                    max: 20000,
                    step: 500
                }).on('change', (ev) => {
                    controller.moveSpeed = ev.value;
                });

                folderCam.addButton({title: 'resetCamera'}).on('click', () => {
                    controller.x = 0;
                    controller.y = 800;
                    controller.z = 2500;
                    controller.pan = 0;
                    controller.tilt = -25;
                    console.log('[Landscape Example 🎮] Camera view reset to initial position!');
                });
            }

            // Folder 7: Debugger Controls
            if (landscape?.debuggerManager) {
                const dbg = landscape.debuggerManager;
                const folderDebuggers = pane.addFolder({title: 'debuggerManager', expanded: true});

                folderDebuggers.addBinding(dbg, 'hud');
                folderDebuggers.addBinding(dbg, 'spatialGrid');
                folderDebuggers.addBinding(dbg, 'vht');
                folderDebuggers.addBinding(dbg, 'vnt');
                folderDebuggers.addBinding(dbg, 'vbt');
                folderDebuggers.addBinding(dbg, 'vbtNormal');
                folderDebuggers.addBinding(dbg, 'vbtORM');

                folderDebuggers.addBinding(config, 'boxSize', {
                    min: 60,
                    max: 300,
                    step: 10
                }).on('change', (ev) => {
                    const sz = ev.value;
                    if (dbg.spatialGridDebugger) {
                        dbg.spatialGridDebugger.setSize(sz, sz);
                    }
                    if (dbg.vhtDebugger) {
                        dbg.vhtDebugger.setSize(sz, sz);
                        dbg.vhtDebugger.setPosition(12 + sz + 10, 12);
                    }
                    if (dbg.vntDebugger) {
                        dbg.vntDebugger.setSize(sz, sz);
                        dbg.vntDebugger.setPosition(12 + (sz + 10) * 2, 12);
                    }
                    if (dbg.vbtDebugger) {
                        dbg.vbtDebugger.setSize(sz, sz);
                        dbg.vbtDebugger.setPosition(12 + (sz + 10) * 3, 12);
                    }
                    if (dbg.vbtNormalDebugger) {
                        dbg.vbtNormalDebugger.setSize(sz, sz);
                        dbg.vbtNormalDebugger.setPosition(12 + (sz + 10) * 4, 12);
                    }
                    if (dbg.vbtORMDebugger) {
                        dbg.vbtORMDebugger.setSize(sz, sz);
                        dbg.vbtORMDebugger.setPosition(12 + (sz + 10) * 5, 12);
                    }
                });
            }
        }
    });
};
