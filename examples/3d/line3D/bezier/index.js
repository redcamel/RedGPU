// RedGPU 사용을 위한 모듈 임포트
import * as RedGPU from "../../../../dist/index.js";

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
        createSampleLine3D("basicColor = '#ffffff'", view, 10, -gap, -gap, "#ffffff");
        createSampleLine3D("basicColor = '#ff0000'", view, 10, -gap, gap, "#ff0000");
        createSampleLine3D("basicColor = '#00ff00'", view, 10, gap, -gap, "#00ff00");
        createSampleLine3D("basicColor = '#0000ff'", view, 10, gap, gap, "#0000ff");
        createSampleLine3D("custom pointColor", view, 10, 0, 0, "#ffffff", true);
        createSampleLine3D("custom pointColor", view, 5, -gap * 2, 0, "#ffffff", true);
        createSampleLine3D("custom pointColor", view, 3, gap * 2, 0, "#ffffff", true);

        // 2-4. 렌더링 시작 (애니메이션 없음)
        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
        });
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        // 초기화 실패 시 처리
        console.error("RedGPU 초기화 실패:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

function createSampleLine3D(title, view, pointsPerLayer, posX, posZ, baseColor, useRainbowColor = false) {
    // 뷰에서 씬(Scene) 및 RedGPU Context를 참조
    const {scene, redGPUContext} = view;
    posZ -= 4
    // Line3D 객체 생성
    const line3D = new RedGPU.Display.Line3D(
        redGPUContext,
        RedGPU.Display.LINE_TYPE.BEZIER, // Bezier 선 연결 방식
        baseColor                        // 기본 색상
    );
    // 라벨 생성
    const label = new RedGPU.Display.TextField3D(redGPUContext);
    label.text = `${title}<br/><span style="color:#dc631d">point num: ${pointsPerLayer}</span>`;
    label.fontSize = 42;
    label.color = baseColor
    label.useBillboard = true;   // 항상 카메라를 바라보도록 설정
    label.z = 4
    line3D.addChild(label);      // 라벨을 Line3D에 추가

    function generatePoints(pointsPerLayer) {
        const controlPoints = [];
        const radius = 5; // 최대 반경
        const step = (Math.PI * 2) / pointsPerLayer; // 포인트 간 각도 차이

        for (let i = 0; i < pointsPerLayer; i++) {
            const angle = step * i;

            // 현재 포인트의 좌표
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = Math.sin(angle / 2) * radius; // 예: z축 비틀림

            // 제어를 위한 in/out 값 설정
            const inX = x - Math.cos(angle - step / 3) * 1.5;
            const inY = y - Math.sin(angle - step / 3) * 1.5;
            const inZ = z - Math.sin((angle - step / 3) / 2) * 1.2;

            const outX = x + Math.cos(angle + step / 3) * 1.5;
            const outY = y + Math.sin(angle + step / 3) * 1.5;
            const outZ = z + Math.sin((angle + step / 3) / 2) * 1.2;

            // 생성한 포인트 추가
            controlPoints.push({x, y, z, inX, inY, inZ, outX, outY, outZ});
        }

        return controlPoints;
    }

    const controlPoints = generatePoints(pointsPerLayer);
    console.log(controlPoints);
    // 제어점을 기반으로 Bezier 곡선 생성
    controlPoints.forEach((point, idx) => {
        const pointColor = useRainbowColor ? rainbowHex(idx / (controlPoints.length - 1)) : baseColor;
        line3D.addPoint(
            point.x, point.y, point.z,         // 기본 좌표
            pointColor, 1,                     // 색상과 투명도
            point.inX, point.inY, point.inZ,   // in 벡터
            point.outX, point.outY, point.outZ // out 벡터
        );
    });

    // Line3D 위치 설정
    line3D.x = posX;
    line3D.z = posZ;

    // 씬(Scene)에 Line3D 추가
    scene.addChild(line3D);

}

/* 무지개 색상 계산 함수 */
function rainbowHex(t) {
    const r = Math.floor(255 * Math.abs(Math.sin(Math.PI * t))); // R 값
    const g = Math.floor(255 * Math.abs(Math.sin(Math.PI * t + (2 * Math.PI) / 3))); // G 값
    const b = Math.floor(255 * Math.abs(Math.sin(Math.PI * t + (4 * Math.PI) / 3))); // B 값
    return RedGPU.Util.convertRgbToHex(r, g, b); // RGB를 HEX 형식으로 변환
}

const renderTestPane = async (redGPUContext) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js");
    setDebugButtons(redGPUContext);
    // **** UI 동작 대상이 되는 Line3D 오브젝트 및 디버그 마커 모음 ****
    const debugOptions = {
        showDebugPoints: false, // 디버그 포인트 표시 여부
        tolerance: redGPUContext.viewList[0].scene.children[0].tolerance,       // Bezier 곡선의 허용 오차 조정
        distance: redGPUContext.viewList[0].scene.children[0].distance       // 곡선의 디테일 조정
    };

    // **** `debugPointMarkers` 리스트 정의 (Line3D 오브젝트와 매핑) ****
    const lineObjects = [];
    redGPUContext.viewList[0].scene.children.forEach((child) => {
        lineObjects.push(child);
    });
    // **** 디버그 포인트 생성 및 추가 ****
    const debugPoints = []
    const debugGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.2) // Sphere 형태
    const debugGeometryInOut = new RedGPU.Primitive.Box(redGPUContext, 0.1, 0.1, 0.1) // Sphere 형태
    const debugMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, "#FF5733") // 강조 색상
    const debugMaterialIn = new RedGPU.Material.ColorMaterial(redGPUContext, "#FF5733") // 강조 색상
    const debugMaterialOut = new RedGPU.Material.ColorMaterial(redGPUContext, "#3399ff") // 강조 색상
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

            {
                // 디버그 포인트 구체 생성
                const debugMeshIn = new RedGPU.Display.Mesh(
                    redGPUContext,
                    debugGeometryInOut,
                    debugMaterialIn
                );

                // 구체 위치 할당
                debugMeshIn.setPosition(...point.inLinePoint.position);
                debugMeshIn.setScale(0);
                // Line3D에 디버그 포인트 추가
                line3D.addChild(debugMeshIn);
                debugPoints.push(debugMeshIn); // 디버그 포인트 배열에 추가

                const subLine = new RedGPU.Display.Line3D(
                    redGPUContext,
                    RedGPU.Display.LINE_TYPE.LINEAR,
                    '#888'
                );

                subLine.addPoint(...point.linePoint.position)
                subLine.addPoint(...point.inLinePoint.position)
                line3D.addChild(subLine);
                debugPoints.push(subLine); // 디버그 포인트 배열에 추가
            }

            {
                // 디버그 포인트 구체 생성
                const debugMeshOut = new RedGPU.Display.Mesh(
                    redGPUContext,
                    debugGeometryInOut,
                    debugMaterialOut
                );

                // 구체 위치 할당
                debugMeshOut.setPosition(...point.outLinePoint.position);
                debugMeshOut.setScale(0);
                // Line3D에 디버그 포인트 추가
                line3D.addChild(debugMeshOut);
                debugPoints.push(debugMeshOut); // 디버그 포인트 배열에 추가

                const subLine = new RedGPU.Display.Line3D(
                    redGPUContext,
                    RedGPU.Display.LINE_TYPE.LINEAR,
                    '#888'
                );

                subLine.addPoint(...point.linePoint.position)
                subLine.addPoint(...point.outLinePoint.position)
                line3D.addChild(subLine);
                debugPoints.push(subLine); // 디버그 포인트 배열에 추가
            }
        });
    });
    // **** Line3D 디버그 포인트 토글 옵션 ****
    const debugFolder = pane.addFolder({title: "Debug Options"});
    debugFolder.addBinding(debugOptions, "showDebugPoints", {label: "Show Debug Points"})
        .on("change", (ev) => {
            updateDebugVisible()
        });

    // **** Line3D 설정 옵션 (tension, tolerance, distance) ****
    const parameterFolder = pane.addFolder({title: "Line Parameters"});

    parameterFolder.addBinding(debugOptions, "tolerance", {min: 0.0, max: 1, step: 0.001, label: "Tolerance"})
        .on("change", (ev) => {
            lineObjects.forEach((line3D) => {
                line3D.tolerance = ev.value; // tolerance 업데이트
            });
        });

    parameterFolder.addBinding(debugOptions, "distance", {min: 0.0, max: 1, step: 0.001, label: "Distance"})
        .on("change", (ev) => {
            lineObjects.forEach((line3D) => {
                line3D.distance = ev.value; // distance 업데이트
            });
        });
    //
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
