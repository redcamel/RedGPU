import * as RedGPU from "../../../../dist/index.js?t=1794650694512";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1794650694512";

/**
 * [KO] Line3D (Linear) 예제
 * [EN] Line3D (Linear) example
 *
 * [KO] Line3D를 사용하여 3D 공간에 직선을 그리는 방법을 보여줍니다.
 * [EN] Demonstrates how to draw straight lines in 3D space using Line3D.
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
        createSampleLine3D("basicColor = '#ffffff'", view, 35, -gap, -gap, "#ffffff");
        createSampleLine3D("basicColor = '#ff0000'", view, 35, -gap, gap, "#ff0000");
        createSampleLine3D("basicColor = '#00ff00'", view, 35, gap, -gap, "#00ff00");
        createSampleLine3D("basicColor = '#0000ff'", view, 35, gap, gap, "#0000ff");
        createSampleLine3D("custom pointColor", view, 35, 0, 0, "#ffffff", true);
        createSampleLine3D("custom pointColor", view, 25, -gap * 2, 0, "#ffffff", true);
        createSampleLine3D("custom pointColor", view, 10, gap * 2, 0, "#ffffff", true);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });
        renderTestPane(redGPUContext, view);
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

    const layers = 7;
    const radiusBase = 5;
    const heightBase = 3;

    // [KO] 다중 색상 레이어로 직선 포인트 추가
    // [EN] Add linear line points across multiple colored layers
    for (let layer = 0; layer < layers; layer++) {
        const line3D = new RedGPU.Display.Line3D(
            redGPUContext,
            RedGPU.Display.LINE_TYPE.LINEAR,
            baseColor
        );

        if (layer === 0) {
            const label = new RedGPU.Display.TextField3D(redGPUContext);
            label.text = `${title}<br/><span style="color:#dc631d">point num : ${pointsPerLayer}</span>`;
            label.fontSize = 32;
            label.color = baseColor
            label.useBillboard = true;
            line3D.addChild(label);
        }

        const radius = radiusBase + layer * 0.5;
        const height = radiusBase + heightBase * ((radius - radiusBase) / radiusBase);
        const color = rainbowHex(layer / (layers - 1));

        for (let i = 0; i <= pointsPerLayer; i++) {
            const t = (i / pointsPerLayer) * Math.PI;
            const x = Math.cos(t) * radius;
            const y = Math.sin(t) * height;
            const z = Math.sin(t * 2) * 2 + t;

            if (useRainbowColor) {
                line3D.addPoint(x, y, z, color);
            } else {
                line3D.addPoint(x, y, z, baseColor);
            }
        }

        line3D.x = posX;
        line3D.z = posZ;

        scene.addChild(line3D);
    }
}

function rainbowHex(t) {
    const r = Math.floor(255 * Math.abs(Math.sin(Math.PI * t)));
    const g = Math.floor(255 * Math.abs(Math.sin(Math.PI * t + (2 * Math.PI) / 3)));
    const b = Math.floor(255 * Math.abs(Math.sin(Math.PI * t + (4 * Math.PI) / 3)));
    return RedGPU.Color.convertRgbToHex(r, g, b);
}

const renderTestPane = (redGPUContext, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const debugOptions = {
                showDebugPoints: false
            };
            const lineObjects = [];
            redGPUContext.viewList[0].scene.children.forEach((child) => {
                if (child instanceof RedGPU.Display.Line3D) {
                    lineObjects.push(child);
                }
            });
            // [KO] 디버그 포인트 마커 생성
            // [EN] Create debug point markers
            const debugPoints = []
            const debugGeometry = new RedGPU.Primitive.Box(redGPUContext, 0.05, 0.05, 0.05)
            const debugMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, "#FF5733")
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
                });
            });

            pane.addFolder({title: "Debug Options"}).addBinding(debugOptions, "showDebugPoints", {label: "Show Debug Points"})
                .on("change", (ev) => {
                    updateDebugVisible()
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
