import * as RedGPU from "../../../../dist/index.js?t=1783496184998";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783496184998";

/**
 * [KO] Material Opacity 예제
 * [EN] Material Opacity example
 *
 * [KO] 다양한 3D 객체(Sprite, TextField, SpriteSheet)의 투명도(opacity)를 개별적으로 제어하는 방법을 시연합니다.
 * [EN] Demonstrates how to individually control the opacity of various 3D objects (Sprite, TextField, SpriteSheet).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 다양한 타입의 테스트 객체 생성
        // [EN] Create Various Types of Test Objects
        const bitmapSprite = createChildSprite3D(redGPUContext, scene, 0, 4, '../../../assets/UV_Grid_Sm.jpg');
        const colorSprite = createChildSprite3D(redGPUContext, scene, 0, 1.5);
        const textField = createChildTextField3D(redGPUContext, scene, 0, -0.5);
        const spriteSheet = createChildSpriteSheet3D(redGPUContext, scene, 0, -3);

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, bitmapSprite, [colorSprite, textField, spriteSheet]);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 자식 Sprite3D를 생성합니다.
 * [EN] Creates a child Sprite3D.
 */
const createChildSprite3D = (redGPUContext, parent, x = 0, y = 0, textureUrl = null) => {
    let material;
    if (textureUrl) {
        material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, textureUrl));
    } else {
        material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    }

    const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite3D.x = x;
    sprite3D.y = y;
    parent.addChild(sprite3D);

    const title = new RedGPU.Display.TextField3D(redGPUContext);
    title.y = 1;
    title.fontSize = '36px';
    title.worldSize = 0.5
    sprite3D.addChild(title);

    return sprite3D;
};

/**
 * [KO] 자식 SpriteSheet3D를 생성합니다.
 * [EN] Creates a child SpriteSheet3D.
 */
const createChildSpriteSheet3D = (redGPUContext, parent, x = 0, y = 0) => {
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
    const sprite3D = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
    sprite3D.x = x;
    sprite3D.y = y;
    parent.addChild(sprite3D);

    const title = new RedGPU.Display.TextField3D(redGPUContext);
    title.y = 1;
    title.fontSize = '36px';
    title.worldSize = 0.5
    sprite3D.addChild(title);

    return sprite3D;
};

/**
 * [KO] 자식 TextField3D를 생성합니다.
 * [EN] Creates a child TextField3D.
 */
const createChildTextField3D = (redGPUContext, parent, x = 0, y = 0) => {
    const textField3D = new RedGPU.Display.TextField3D(redGPUContext);
    textField3D.x = x;
    textField3D.y = y;
    textField3D.fontSize = '36px';
    textField3D.worldSize = 0.5
    parent.addChild(textField3D);

    return textField3D;
};

/**
 * [KO] 투명도 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for opacity control.
 */
const renderTestPane = (redGPUContext, parent, children) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const allObjects = [parent, ...children];

            allObjects.forEach((obj) => {
                let objType = '';
                if (obj instanceof RedGPU.Display.TextField3D) {
                    objType = 'TextField3D';
                } else if (obj instanceof RedGPU.Display.SpriteSheet3D) {
                    objType = 'SpriteSheet3D';
                } else if (obj.material instanceof RedGPU.Material.BitmapMaterial) {
                    objType = 'BitmapMaterial';
                } else if (obj.material instanceof RedGPU.Material.ColorMaterial) {
                    objType = 'ColorMaterial';
                }

                const title = `${objType} Material`;
                const objConfig = {
                    opacity: obj.material.opacity,
                };

                const objFolder = pane.addFolder({title: title, expanded: true});

                // [KO] 투명도 업데이트 및 라벨 텍스트 변경
                // [EN] Update opacity and change label text
                const update = (targetObj, evt) => {
                    targetObj.material.opacity = evt.value;
                    const opacityText = `${objType} material.opacity: ${targetObj.material.opacity.toFixed(2)}`;

                    if (targetObj instanceof RedGPU.Display.TextField3D) {
                        targetObj.text = opacityText;
                    } else {
                        targetObj.getChildAt(0).text = opacityText;
                    }
                };

                objFolder.addBinding(objConfig, 'opacity', {
                    min: 0,
                    max: 1,
                    step: 0.01
                }).on('change', (evt) => {
                    update(obj, evt);
                });

                update(obj, {value: objConfig.opacity});
            });
        }
    });
};
