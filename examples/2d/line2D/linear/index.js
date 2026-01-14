// RedGPU 사용을 위한 모듈 임포트
import * as RedGPU from "../../../../dist/index.js?t=1768301050717";

/* 1. 캔버스 생성 */
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

/* 2. RedGPU 초기화 */
RedGPU.init(
    canvas,
    (redGPUContext) => {
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View2D(redGPUContext, scene);
        redGPUContext.addView(view);

        const groups = []; // Group2D 배열 관리
        let pointsPerLine = 35; // 포인트 갯수 기본값

        const centerLines = [
            {title: "White Line", offsetX: -200, offsetY: -200, color: "#ffffff", rainbow: false},
            {title: "Red Line", offsetX: -200, offsetY: 200, color: "#ff0000", rainbow: false},
            {title: "Green Line", offsetX: 200, offsetY: -200, color: "#00ff00", rainbow: false},
            {title: "Blue Line", offsetX: 200, offsetY: 200, color: "#0000ff", rainbow: false},
            {title: "Rainbow Line", offsetX: 0, offsetY: 0, color: "#ffffff", rainbow: true},
        ];

        // 라인 업데이트 함수
        const updateCenterLines = () => {
            const {width, height} = redGPUContext.screenRectObject;
            const centerX = width / 2;
            const centerY = height / 2;

            // 기존 그룹 제거
            groups.splice(0).forEach(group => scene.removeChild(group));

            // 새로운 그룹 생성
            centerLines.forEach(({title, offsetX, offsetY, color, rainbow}) => {
                const group = createLineGroup(redGPUContext, title, centerX + offsetX, centerY + offsetY, color, rainbow, pointsPerLine);
                groups.push(group);
                scene.addChild(group);
            });
        };

        updateCenterLines(); // 초기 라인 배치
        redGPUContext.onResize = updateCenterLines; // 화면 크기 변경 시 갱신

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

        // 디버그 패널 설정
        setupDebugPanel(redGPUContext, groups, updateCenterLines, () => pointsPerLine, value => pointsPerLine = value);
    },
    (failReason) => {
        console.error("RedGPU 초기화 실패:", failReason);
        document.body.innerHTML += `<div>${failReason}</div>`;
    }
);

/* 3. Group2D 기반 라인 및 텍스트 생성 함수 */
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
    label.y = 0; // 라인 아래 위치
    group.addChild(label);

    // 그룹 위치 설정
    group.x = posX;
    group.y = posY;

    return group;
}

/* 4. 라인의 포인트 생성 */
function generatePoints(line2D, baseColor, useRainbow, pointsPerLine) {
    line2D.removeAllPoint(); // 기존 포인트 초기화

    // 곡선 강도 및 반지름 값 설정
    const baseRadius = 75; // 기본 반지름
    const waveAmplitude = 50; // 파형의 높이 (곡선의 부드러움을 결정)

    for (let i = 0; i <= pointsPerLine; i++) {
        // t는 0에서 2 * Pi를 오가는 값으로 라인의 모양을 형성
        const t = (i / pointsPerLine) * Math.PI * 2;

        // 곡선을 부드럽게 하기 위해 반지름에 파형 추가
        const radius = baseRadius + Math.sin(t * 4) * waveAmplitude; // 4는 파형 반복 횟수

        // x, y 좌표 계산 (부드러운 원형 + 파형 생성)
        const x = Math.cos(t) * radius;
        const y = Math.sin(t) * radius;

        // 컬러 설정 (useRainbow에 따라 결정)
        const color = useRainbow ? getRainbowColor(i / pointsPerLine) : baseColor;

        // 포인트 추가
        line2D.addPoint(x, y, color);
    }
}

/* 5. 무지개 색상 계산 */
function getRainbowColor(t) {
    const r = Math.floor(255 * Math.abs(Math.sin(Math.PI * t)));
    const g = Math.floor(255 * Math.abs(Math.sin(Math.PI * t + (2 * Math.PI) / 3)));
    const b = Math.floor(255 * Math.abs(Math.sin(Math.PI * t + (4 * Math.PI) / 3)));
    return RedGPU.Util.convertRgbToHex(r, g, b);
}

/* 6. 디버그 UI 패널 */
async function setupDebugPanel(redGPUContext, groups, updateLinesCallback, getPointsPerLine, setPointsPerLine) {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1768301050717");
    const pane = new Pane();

    const debugOptions = {
        showDebugPoints: false,
        pointsPerLine: getPointsPerLine(),
    };
    let debugPoints = [];

    // 디버그 포인트 재생성 함수
    const recreateDebugPoints = () => {
        // 기존 디버그 포인트 제거
        debugPoints.forEach(point => point.parent.removeChild(point));
        debugPoints = []; // 초기화

        // 새 디버그 포인트 생성
        groups.forEach(group => {
            const line = group.children.find(child => child instanceof RedGPU.Display.Line2D);
            if (!line) return;

            const debugMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, "#ff0");
            line.originalPoints.forEach((point) => {
                const debugPoint = new RedGPU.Display.Sprite2D(redGPUContext, debugMaterial);
                debugPoint.setSize(5, 5);
                debugPoint.setPosition(...point.linePoint.position);
                debugPoint.setScale(debugOptions.showDebugPoints ? 1 : 0); // 표시 여부
                group.addChild(debugPoint);
                debugPoints.push(debugPoint);
            });
        });
    };

    // 디버그 옵션: 포인트 표시 토글
    pane.addBinding(debugOptions, "showDebugPoints", {label: "Show Debug Points"}).on("change", () => {
        debugPoints.forEach(point => point.setScale(debugOptions.showDebugPoints ? 1 : 0));
    });

    // 디버그 옵션: 포인트 갯수 조정
    pane.addBinding(debugOptions, "pointsPerLine", {
        label: "Points Per Line",
        min: 5,
        max: 50,
        step: 1
    }).on("change", (ev) => {
        setPointsPerLine(ev.value); // 포인트 갯수 반영
        updateLinesCallback(); // 라인 업데이트
        recreateDebugPoints(); // 디버그 포인트 재생성
    });

    // 초기 디버그 포인트 생성
    recreateDebugPoints();
}
