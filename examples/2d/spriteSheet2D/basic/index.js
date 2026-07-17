import * as RedGPU from "../../../../dist/index.js?t=1784264152422";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1784264152422";

/**
 * [KO] SpriteSheet2D Basic 예제
 * [EN] SpriteSheet2D Basic example
 *
 * [KO] SpriteSheet2D의 기본 사용법과 애니메이션 제어 방법을 보여줍니다.
 * [EN] Demonstrates the basic usage and animation control of SpriteSheet2D.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] Scene 생성
        // [EN] Create Scene
        const scene = new RedGPU.Display.Scene();

        // 2. [KO] 2D View 생성 및 등록
        // [EN] Create and register 2D View
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        // 3. [KO] SpriteSheetInfo 및 SpriteSheet2D 생성
        // [EN] Create SpriteSheetInfo and SpriteSheet2D
        const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
        const spriteCount = 4;
        for (let i = 0; i < spriteCount; i++) {
            const spriteSheet = new RedGPU.Display.SpriteSheet2D(redGPUContext, spriteSheetInfo);
            scene.addChild(spriteSheet);
        }

        let centerX = redGPUContext.screenRectObject.width / 2;
        let centerY = view.screenRectObject.height / 2;

        // 4. [KO] 리사이즈 이벤트 처리
        // [EN] Handle resize event
        redGPUContext.onResize = (resizeEvent) => {
            const {width, height} = resizeEvent.screenRectObject;
            centerX = width / 2;
            centerY = height / 2;
        };

        // 5. [KO] 렌더러 시작 및 루프 정의
        // [EN] Start renderer and define loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
            const radius = 250;
            const numChildren = view.scene.children.length;

            view.scene.children.forEach((spriteSheet2D, index) => {
                const angle = (index / numChildren) * Math.PI * 2;
                const endX = centerX + Math.cos(angle) * radius;
                const endY = centerY + Math.sin(angle) * radius;

                spriteSheet2D.x += (endX - spriteSheet2D.x) * 0.3;
                spriteSheet2D.y += (endY - spriteSheet2D.y) * 0.3;
            });
        });

        // 6. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(scene, redGPUContext);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 처리
        // [EN] Handle initialization failure
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = (scene, redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const controls = {
                testSpriteSheetInfo: 0,
                loop: true,
                frameRate: 24,
                state: '',
                currentIndex: 0,
                totalFrame: 0,
                segmentW: 0,
                segmentH: 0,
                scaleX: 1,
                scaleY: 1,
                width: 0,
                height: 0
            };

            const updateTestData = () => {
                const child = scene.children[0];
                controls.loop = child.loop;
                controls.frameRate = child.frameRate;
                controls.state = child.state;
                controls.currentIndex = child.currentIndex || 0;
                controls.totalFrame = child.totalFrame || 0;
                controls.segmentW = child.segmentW || 0;
                controls.segmentH = child.segmentH || 0;
                controls.scaleX = child.scaleX;
                controls.scaleY = child.scaleY;
                controls.width = child.width;
                controls.height = child.height;
                pane.refresh();
            };

            const spriteSheetInfos = [
                new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24),
                new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/walk.png', 8, 1, 8, 0, true, 24),
                new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/jump.png', 8, 1, 8, 0, true, 24),
                new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/actionTest/attack.png', 6, 1, 6, 0, true, 24)
            ];

            const spriteSheet3DFolder = pane.addFolder({title: 'SpriteSheet2D', expanded: true});

            spriteSheet3DFolder.addBinding(controls, 'loop').on('change', (evt) => {
                scene.children.forEach((child) => {
                    child.loop = evt.value;
                    child.play();
                });
            });

            spriteSheet3DFolder.addBinding(controls, 'frameRate', {min: 0, max: 60, step: 1}).on('change', (evt) => {
                scene.children.forEach((child) => {
                    child.frameRate = evt.value;
                });
            });

            const spriteSelectorOptions = spriteSheetInfos.map((_, index) => ({
                text: `SpriteSheet ${index + 1}`, value: index,
            }));

            spriteSheet3DFolder.addBinding(controls, 'testSpriteSheetInfo', {
                options: spriteSelectorOptions,
            }).on('change', (evt) => {
                const selectedSpriteSheetInfo = spriteSheetInfos[evt.value];
                scene.children.forEach((child) => {
                    child.spriteSheetInfo = selectedSpriteSheetInfo;
                });
                updateTestData();
            });

            pane.addBlade({view: 'separator'});

            const playControlsFolder = pane.addFolder({title: 'Play Controls', expanded: true});

            playControlsFolder.addButton({title: 'Play'}).on('click', () => {
                scene.children.forEach((child) => child.play());
            });

            playControlsFolder.addButton({title: 'Pause'}).on('click', () => {
                scene.children.forEach((child) => child.pause());
            });

            playControlsFolder.addButton({title: 'Stop'}).on('click', () => {
                scene.children.forEach((child) => child.stop());
            });

            pane.addBlade({view: 'separator'});

            const scaleFolder = pane.addFolder({title: 'Scale Controls', expanded: true});

            scaleFolder.addBinding(controls, 'scaleX', {min: 0, max: 1, step: 0.1}).on('change', () => {
                scene.children.forEach((child) => {
                    child.scaleX = controls.scaleX;
                });
            });

            scaleFolder.addBinding(controls, 'scaleY', {min: 0, max: 1, step: 0.1}).on('change', () => {
                scene.children.forEach((child) => {
                    child.scaleY = controls.scaleY;
                });
            });

            const monitoringFolder = pane.addFolder({title: 'Monitoring', expanded: true});

            const child = scene.children[0];
            monitoringFolder.addBinding(child, 'state', {readonly: true, interval: 100});
            monitoringFolder.addBinding(child, 'currentIndex', {readonly: true, interval: 100});
            monitoringFolder.addBinding(child, 'totalFrame', {readonly: true, interval: 100});
            monitoringFolder.addBinding(child, 'segmentW', {readonly: true, interval: 100});
            monitoringFolder.addBinding(child, 'segmentH', {readonly: true, interval: 100});

            updateTestData();
        }
    });
};
