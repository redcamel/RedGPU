import * as RedGPU from "../../../../dist/index.js?t=1794646734270";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1794646734270";

/**
 * [KO] Line3D (Catmull-Rom) 예제
 * [EN] Line3D (Catmull-Rom) example
 *
 * [KO] Line3D를 사용하여 Catmull-Rom 스플라인을 그리는 방법을 보여줍니다.
 * [EN] Demonstrates how to draw Catmull-Rom splines using Line3D.
 */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 30;


        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const gap = 10;
        createSampleLine3D("basicColor = '#ffffff'", view, 5, -gap, -gap, "#ffffff");
        createSampleLine3D("basicColor = '#ff0000'", view, 5, -gap, gap, "#ff0000");
        createSampleLine3D("basicColor = '#00ff00'", view, 5, gap, -gap, "#00ff00");
        createSampleLine3D("basicColor = '#0000ff'", view, 5, gap, gap, "#0000ff");
        createSampleLine3D("custom pointColor", view, 20, 0, 0, "#ffffff", true);
        createSampleLine3D("custom pointColor", view, 10, -gap * 2, 0, "#ffffff", true);
        createSampleLine3D("custom pointColor", view, 3, gap * 2, 0, "#ffffff", true);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error("RedGPU 초기화 실패:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

function createSampleLine3D(title, view, pointsPerLayer, posX, posZ, baseColor, useRainbowColor = false) {
    const {scene, redGPUContext} = view;

    const line3D = new RedGPU.Display.Line3D(
        redGPUContext,
        RedGPU.Display.LINE_TYPE.CATMULL_ROM,
        baseColor
    );
    const label = new RedGPU.Display.TextField3D(redGPUContext);
    label.text = `${title}<br/><span style="color:#dc631d">point num: ${pointsPerLayer}</span>`;
    label.fontSize = 42;
    label.color = baseColor;
    label.useBillboard = true;

    line3D.addChild(label);

    function generatePoints(pointsPerLayer) {
        const controlPoints = [];
        const radius = 5;
        const stepHeight = 0.3;

        for (let i = 0; i < pointsPerLayer; i++) {
            const angle = (Math.PI * 2) * (i / pointsPerLayer);
            const x = Math.cos(angle) * (radius + i * 0.2);
            const y = stepHeight * i;
            const z = Math.sin(angle) * (radius - i * 0.1);

            // [KO] CATMULL_ROM은 in/out 핸들 없이 기본 좌표만 추가
            // [EN] CATMULL_ROM only uses base coordinates without in/out handles
            controlPoints.push({x, y, z});
        }

        return controlPoints;
    }

    const controlPoints = generatePoints(pointsPerLayer);
    console.log(controlPoints);
    // [KO] 제어점 기반 Catmull-Rom 곡선 생성
    // [EN] Build Catmull-Rom spline from control points
    controlPoints.forEach((point, idx) => {
        const pointColor = useRainbowColor ? rainbowHex(idx / (controlPoints.length - 1)) : baseColor;
        line3D.addPoint(
            point.x, point.y, point.z,
            pointColor, 1,
            point.inX, point.inY, point.inZ,
            point.outX, point.outY, point.outZ
        );
    });

    line3D.x = posX;
    line3D.z = posZ;

    scene.addChild(line3D);

}

function rainbowHex(t) {
    const r = Math.floor(255 * Math.abs(Math.sin(Math.PI * t)));
    const g = Math.floor(255 * Math.abs(Math.sin(Math.PI * t + (2 * Math.PI) / 3)));
    const b = Math.floor(255 * Math.abs(Math.sin(Math.PI * t + (4 * Math.PI) / 3)));
    return RedGPU.Color.convertRgbToHex(r, g, b);
}

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const debugOptions = {
                showDebugPoints: false,
                tension: redGPUContext.viewList[0].scene.children[0].tension,
                tolerance: redGPUContext.viewList[0].scene.children[0].tolerance,
                distance: redGPUContext.viewList[0].scene.children[0].distance
            };

            const lineObjects = [];
            redGPUContext.viewList[0].scene.children.forEach((child) => {
                lineObjects.push(child);
            });
            // [KO] 제어점 디버그 마커 생성
            // [EN] Create debug markers for control points
            const debugPoints = []
            const debugGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.2)
            const debugGeometryInOut = new RedGPU.Primitive.Box(redGPUContext, 0.1, 0.1, 0.1)
            const debugMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, "#FF5733")
            const debugMaterialIn = new RedGPU.Material.ColorMaterial(redGPUContext, "#FF5733")
            const debugMaterialOut = new RedGPU.Material.ColorMaterial(redGPUContext, "#3399ff")
            lineObjects.forEach((line3D) => {
                line3D.originalPoints.forEach((point) => {
                    if (point instanceof RedGPU.Display.TextField3D) return;

                    const debugMesh = new RedGPU.Display.Mesh(
                        redGPUContext,
                        debugGeometry,
                        debugMaterial
                    );

                    debugMesh.setPosition(...point.linePoint.position);
                    debugMesh.setScale(0);
                    line3D.addChild(debugMesh);
                    debugPoints.push(debugMesh);

                    {
                        const debugMeshIn = new RedGPU.Display.Mesh(
                            redGPUContext,
                            debugGeometryInOut,
                            debugMaterialIn
                        );

                        debugMeshIn.setPosition(...point.inLinePoint.position);
                        debugMeshIn.setScale(0);
                        line3D.addChild(debugMeshIn);
                        debugPoints.push(debugMeshIn);

                        const subLine = new RedGPU.Display.Line3D(
                            redGPUContext,
                            RedGPU.Display.LINE_TYPE.LINEAR,
                            '#888'
                        );

                        subLine.addPoint(...point.linePoint.position)
                        subLine.addPoint(...point.inLinePoint.position)
                        line3D.addChild(subLine);
                        debugPoints.push(subLine);
                    }

                    {
                        const debugMeshOut = new RedGPU.Display.Mesh(
                            redGPUContext,
                            debugGeometryInOut,
                            debugMaterialOut
                        );

                        debugMeshOut.setPosition(...point.outLinePoint.position);
                        debugMeshOut.setScale(0);
                        line3D.addChild(debugMeshOut);
                        debugPoints.push(debugMeshOut);

                        const subLine = new RedGPU.Display.Line3D(
                            redGPUContext,
                            RedGPU.Display.LINE_TYPE.LINEAR,
                            '#888'
                        );

                        subLine.addPoint(...point.linePoint.position)
                        subLine.addPoint(...point.outLinePoint.position)
                        line3D.addChild(subLine);
                        debugPoints.push(subLine);
                    }
                });
            });
            const debugFolder = pane.addFolder({title: "Debug Options"});
            debugFolder.addBinding(debugOptions, "showDebugPoints", {label: "Show Debug Points"})
                .on("change", (ev) => {
                    updateDebugVisible()
                });

            const parameterFolder = pane.addFolder({title: "Line Parameters"});
            parameterFolder.addBinding(debugOptions, "tension", {min: 0.0, max: 3, step: 0.1, label: "Tension"})
                .on("change", (ev) => {
                    lineObjects.forEach((line3D) => {
                        line3D.tension = ev.value;
                    });
                });

            parameterFolder.addBinding(debugOptions, "tolerance", {min: 0.0, max: 1, step: 0.001, label: "Tolerance"})
                .on("change", (ev) => {
                    lineObjects.forEach((line3D) => {
                        line3D.tolerance = ev.value;
                    });
                });

            parameterFolder.addBinding(debugOptions, "distance", {min: 0.0, max: 1, step: 0.001, label: "Distance"})
                .on("change", (ev) => {
                    lineObjects.forEach((line3D) => {
                        line3D.distance = ev.value;
                    });
                });
            const updateDebugVisible = () => {
                lineObjects.forEach((line3D) => {
                    debugPoints.forEach((debugPoint) => {
                        if (!(debugPoint instanceof RedGPU.Display.TextField3D)) {
                            debugPoint.setScale(debugOptions.showDebugPoints ? 1 : 0);
                        }
                    });
                });
            }
            updateDebugVisible()
        }
    });
};
