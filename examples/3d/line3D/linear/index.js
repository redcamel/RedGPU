// RedGPU 사용을 위한 모듈 임포트
import * as RedGPU from "../../../../dist/index.js?t=1769512410570";

/* 1. 캔버스 생성 */
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

/* 2. RedGPU 초기화 */
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 2-1. 카메라 컨트롤 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 30; // 카메라의 줌/거리
        controller.speed = 0.5;   // 카메라 회전 속도

        // 2-2. 씬(Scene) 및 뷰(View3D) 설정
        const scene = new RedGPU.Display.Scene(); // 객체들이 추가될 씬
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller); // 카메라와 연결된 보기
        view.grid = true; // 배경 그리드 표시
        redGPUContext.addView(view); // 뷰를 렌더링에 추가

        // 2-3. 샘플 라인(Line3D) 생성 및 배치
        const gap = 10; // 오브젝트 간의 간격
        createSampleLine3D("basicColor = '#ffffff'", view, 35, -gap, -gap, "#ffffff");
        createSampleLine3D("basicColor = '#ff0000'", view, 35, -gap, gap, "#ff0000");
        createSampleLine3D("basicColor = '#00ff00'", view, 35, gap, -gap, "#00ff00");
        createSampleLine3D("basicColor = '#0000ff'", view, 35, gap, gap, "#0000ff");
        createSampleLine3D("custom pointColor", view, 35, 0, 0, "#ffffff", true);
        createSampleLine3D("custom pointColor", view, 25, -gap * 2, 0, "#ffffff", true);
        createSampleLine3D("custom pointColor", view, 10, gap * 2, 0, "#ffffff", true);

        // 2-4. 렌더링 시작 (애니메이션 없음)
        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
        });
        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        // 초기화 실패 시 처리
        console.error("RedGPU 초기화 실패:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/* 3. Line3D 샘플을 생성하는 함수 */
function createSampleLine3D(title, view, pointsPerLayer, posX, posZ, baseColor, useRainbowColor = false) {
    // 뷰에서 씬(Scene) 및 RedGPU Context를 참조
    const {scene, redGPUContext} = view;

    // Line3D 생성을 위한 기본 설정
    const layers = 7;           // 층 개수 (레인보우 효과의 층)
    const radiusBase = 5;       // 기본 반지름
    const heightBase = 3;       // 기본 높이

    // 3-1. 다중 색상 레이어를 생성
    for (let layer = 0; layer < layers; layer++) {
        // Line3D 객체 생성
        const line3D = new RedGPU.Display.Line3D(
            redGPUContext,
            RedGPU.Display.LINE_TYPE.LINEAR, // 선의 연결 방식
            baseColor                            // 기본 색상
        );

        // 3-2. 각 라인에 레이블 추가
        if (layer === 0) {
            const label = new RedGPU.Display.TextField3D(redGPUContext);
            label.text = `${title}<br/><span style="color:#dc631d">point num : ${pointsPerLayer}</span>`;          // 라벨 텍스트 설정
            label.fontSize = 32;         // 폰트 크기
            label.color = baseColor
            // label.x = Math.random() -0.5
            label.useBillboard = true;   // 항상 카메라를 바라보도록 설정
            line3D.addChild(label);      // Line3D에 라벨 추가
        }

        // 3-3. 반지름과 높이 계산
        const radius = radiusBase + layer * 0.5; // 각 층마다 반지름 증가
        const height = radiusBase + heightBase * ((radius - radiusBase) / radiusBase); // 높이 비율
        const color = rainbowHex(layer / (layers - 1)); // 무지개 색상 계산

        // 3-4. 각 레이어에 반원을 이루는 포인트 추가
        for (let i = 0; i <= pointsPerLayer; i++) {
            const t = (i / pointsPerLayer) * Math.PI; // 0부터 π까지의 각도
            const x = Math.cos(t) * radius;          // X 좌표 계산
            const y = Math.sin(t) * height;          // Y 좌표 계산
            const z = Math.sin(t * 2) * 2 + t;       // Z 좌표 (왜곡 추가)

            // 포인트에 색상 추가 (Rainbow 모드 여부에 따라 결정)
            if (useRainbowColor) {
                line3D.addPoint(x, y, z, color); // 무지개 색상
            } else {
                line3D.addPoint(x, y, z, baseColor); // 기본 색상
            }
        }

        // 3-5. Line3D의 위치 설정
        line3D.x = posX; // X 위치
        line3D.z = posZ; // Z 위치

        // 3-6. 씬(Scene)에 Line3D 추가
        scene.addChild(line3D);
    }
}

/* 4. 무지개 색상 계산 함수 */
function rainbowHex(t) {
    // T 값에 따라 RGB를 계산
    const r = Math.floor(255 * Math.abs(Math.sin(Math.PI * t))); // R 값
    const g = Math.floor(255 * Math.abs(Math.sin(Math.PI * t + (2 * Math.PI) / 3))); // G 값
    const b = Math.floor(255 * Math.abs(Math.sin(Math.PI * t + (4 * Math.PI) / 3))); // B 값
    return RedGPU.Color.convertRgbToHex(r, g, b); // RGB를 HEX 형식으로 변환
}

const renderTestPane = async (redGPUContext, view) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769512410570");
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769512410570");
    setDebugButtons(RedGPU, redGPUContext);
    // 옵션 초기화
    const debugOptions = {
        showDebugPoints: false // 디버그 포인트 표시 여부
    };
    // RedGPU 뷰에서 Line3D 객체들 참조
    const lineObjects = [];
    redGPUContext.viewList[0].scene.children.forEach((child) => {
        if (child instanceof RedGPU.Display.Line3D) {
            lineObjects.push(child); // Line3D 객체를 추출
        }
    });
    // **** 디버그 포인트 생성 및 추가 ****
    const debugPoints = []
    const debugGeometry = new RedGPU.Primitive.Box(redGPUContext, 0.05, 0.05, 0.05) // Sphere 형태
    const debugMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, "#FF5733") // 강조 색상
    lineObjects.forEach((line3D) => {
        line3D.originalPoints.forEach((point) => {
            if (point instanceof RedGPU.Display.TextField3D) return; // 레이블은 제외

            // 디버그 포인트 구체 생성
            const debugMesh = new RedGPU.Display.Mesh(
                redGPUContext,
                debugGeometry,
                debugMaterial
            );

            // 구체 위치 할당
            debugMesh.setPosition(...point.linePoint.position);
            debugMesh.setScale(0);
            // Line3D에 디버그 포인트 추가
            line3D.addChild(debugMesh);
            debugPoints.push(debugMesh); // 디버그 포인트 배열에 추가
        });
    });

    // **** 디버그 포인트 토글 옵션 추가 ****
    pane.addFolder({title: "Debug Options"}).addBinding(debugOptions, "showDebugPoints", {label: "Show Debug Points"})
        .on("change", (ev) => {
            updateDebugVisible()
        });

    const updateDebugVisible = () => {
        // 초기 상태에 따라 디버그 포인트 표시
        lineObjects.forEach((line3D) => {
            debugPoints.forEach((debugPoint) => {
                if (!(debugPoint instanceof RedGPU.Display.TextField3D)) { // 구체 디버그 포인트
                    debugPoint.setScale(debugOptions.showDebugPoints ? 1 : 0); // 초기 상태 정의
                }
            });
        });
    }
    updateDebugVisible()

};
