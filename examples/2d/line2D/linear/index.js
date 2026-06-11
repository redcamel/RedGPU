import * as RedGPU from "../../../../dist/index.js?t=1781143364605";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781143364605";

/**
 * [KO] Line2D (Linear) 예제
 * [EN] Line2D (Linear) example
 *
 * [KO] Line2D를 사용하여 직선을 그리는 방법을 보여줍니다.
 * [EN] Demonstrates how to draw straight lines using Line2D.
 */

const canvas = document.createElement("canvas");
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

        // 3. [KO] 라인 설정을 위한 초기화
        // [EN] Initialization for line configuration
        const groups = [];
        let pointsPerLine = 35;

        const centerLineSettings = [
            {title: "White Line", offsetX: -200, offsetY: -200, color: "#ffffff", rainbow: false},
            {title: "Red Line", offsetX: -200, offsetY: 200, color: "#ff0000", rainbow: false},
            {title: "Green Line", offsetX: 200, offsetY: -200, color: "#00ff00", rainbow: false},
            {title: "Blue Line", offsetX: 200, offsetY: 200, color: "#0000ff", rainbow: false},
            {title: "Rainbow Line", offsetX: 0, offsetY: 0, color: "#ffffff", rainbow: true},
        ];

        // 4. [KO] 라인 업데이트 함수 정의
        // [EN] Define line update function
        const updateLines = () => {
            const {width, height} = view.screenRectObject;
            const centerX = width / 2;
            const centerY = height / 2;

            // 기존 그룹 제거
            groups.splice(0).forEach(group => scene.removeChild(group));

            // 새로운 라인 그룹 생성
            centerLineSettings.forEach(({title, offsetX, offsetY, color, rainbow}) => {
                const group = createLineGroup(
                    redGPUContext,
                    title,
                    centerX + offsetX,
                    centerY + offsetY,
                    color,
                    rainbow,
                    pointsPerLine
                );
                groups.push(group);
                scene.addChild(group);
            });
        };

        // 5. [KO] 리사이즈 이벤트 처리
        // [EN] Handle resize event
        view.onResize = updateLines;
        updateLines();

        // 6. [KO] 렌더러 시작
        // [EN] Start renderer
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 7. [KO] 테스트 GUI 구성
        // [EN] Configure test GUI
        renderTestPane(redGPUContext, groups, updateLines, () => pointsPerLine, (val) => pointsPerLine = val);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 처리
        // [EN] Handle initialization failure
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] Group2D 기반 라인 및 텍스트 생성 함수
 * [EN] Function to create line group based on Group2D
 */
function createLineGroup(redGPUContext, title, posX, posY, baseColor, useRainbow, pointsPerLine) {
    const group = new RedGPU.Display.Group2D();

    // 라인 생성
    const line2D = new RedGPU.Display.Line2D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR, baseColor);
    generatePoints(line2D, baseColor, useRainbow, pointsPerLine);
    group.addChild(line2D);

    // 라벨 생성
    const label = new RedGPU.Display.TextField2D(redGPUContext);
    label.text = title;
    label.fontSize = 14;
    group.addChild(label);

    group.x = posX;
    group.y = posY;

    return group;
}

/**
 * [KO] 라인의 포인트 생성
 * [EN] Generate points for the line
 */
function generatePoints(line2D, baseColor, useRainbow, pointsPerLine) {
    line2D.removeAllPoint();

    const baseRadius = 75;
    const waveAmplitude = 50;

    for (let i = 0; i <= pointsPerLine; i++) {
        const t = (i / pointsPerLine) * Math.PI * 2;
        const radius = baseRadius + Math.sin(t * 4) * waveAmplitude;
        const x = Math.cos(t) * radius;
        const y = Math.sin(t) * radius;
        const color = useRainbow ? getRainbowColor(i / pointsPerLine) : baseColor;

        line2D.addPoint(x, y, color);
    }
}

/**
 * [KO] 무지개 색상 계산
 * [EN] Calculate rainbow color
 */
function getRainbowColor(t) {
    const r = Math.floor(255 * Math.abs(Math.sin(Math.PI * t)));
    const g = Math.floor(255 * Math.abs(Math.sin(Math.PI * t + (2 * Math.PI) / 3)));
    const b = Math.floor(255 * Math.abs(Math.sin(Math.PI * t + (4 * Math.PI) / 3)));
    return RedGPU.Color.convertRgbToHex(r, g, b);
}

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
function renderTestPane(redGPUContext, groups, updateLinesCallback, getPointsPerLine, setPointsPerLine) {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const debugOptions = {
                showDebugPoints: false,
                pointsPerLine: getPointsPerLine(),
            };
            let debugPoints = [];

            const recreateDebugPoints = () => {
                debugPoints.forEach(point => point.parent.removeChild(point));
                debugPoints = [];

                groups.forEach(group => {
                    const line = group.children.find(child => child instanceof RedGPU.Display.Line2D);
                    if (!line) return;

                    const debugMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, "#ff0");
                    line.originalPoints.forEach((point) => {
                        const debugPoint = new RedGPU.Display.Sprite2D(redGPUContext, debugMaterial);
                        debugPoint.setSize(5, 5);
                        debugPoint.setPosition(...point.linePoint.position);
                        debugPoint.setScale(debugOptions.showDebugPoints ? 1 : 0);
                        group.addChild(debugPoint);
                        debugPoints.push(debugPoint);
                    });
                });
            };

            pane.addBinding(debugOptions, "showDebugPoints", {label: "Show Debug Points"}).on("change", () => {
                debugPoints.forEach(point => point.setScale(debugOptions.showDebugPoints ? 1 : 0));
            });

            pane.addBinding(debugOptions, "pointsPerLine", {
                label: "Points Per Line",
                min: 5,
                max: 50,
                step: 1
            }).on('change', (ev) => {
                setPointsPerLine(ev.value);
                updateLinesCallback();
                recreateDebugPoints();
            });

            recreateDebugPoints();
        }
    });
}
