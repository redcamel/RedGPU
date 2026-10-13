import View3D from "../../display/view/View3D";

/**
 * [KO] 지정된 캐스케이드 인덱스에 대해 독립적인 가시성 컬링(Per-Cascade Culling)을 수행하고 순수 뎁스를 렌더링합니다. (Zero-GC)
 * [EN] Performs independent visibility culling (Per-Cascade Culling) for the specified cascade index and renders pure depth. (Zero-GC)
 *
 * @param view - 렌더링 대상 View3D
 * @param viewShadowRenderPassEncoder - 섀도우 렌더 패스 엔코더
 * @param cascadeIndex - 현재 렌더링 중인 캐스케이드 인덱스 (0 ~ 3)
 */
const renderShadowLayer = (view: View3D, viewShadowRenderPassEncoder: GPURenderPassEncoder, cascadeIndex: number) => {
    const {renderViewStateData, scene} = view;
    renderViewStateData.currentRenderPassEncoder = viewShadowRenderPassEncoder;
    const {directionalShadowManager} = scene.shadowManager;
    const {castingList, cascadeBoundingSpheres} = directionalShadowManager;

    const len = castingList.length;
    if (!len) return;

    const {renderResults} = renderViewStateData;

    // 🌟 [결함 2 해소] view.currentCascadeIndex 가변 상태 대신 명시적으로 캐스케이드 바인드그룹 주입
    viewShadowRenderPassEncoder.setBindGroup(0, view.getCascadeUniformBindGroup(cascadeIndex));

    // 🌟 [결함 1 해소] 캐스케이드별 Bounding Sphere 정보 (월드 좌표 중심 & 반경)
    const sphereIdx = cascadeIndex * 4;
    const cx = cascadeBoundingSpheres[sphereIdx];
    const cy = cascadeBoundingSpheres[sphereIdx + 1];
    const cz = cascadeBoundingSpheres[sphereIdx + 2];
    const cr = cascadeBoundingSpheres[sphereIdx + 3];

    for (let i = 0; i < len; i++) {
        const target = castingList[i];
        const {gpuRenderInfo} = target;
        if (!gpuRenderInfo || !gpuRenderInfo.shadowPipeline) continue;

        const currentGeometry = target.geometry;
        if (!currentGeometry) continue;

        // 🌟 [Per-Cascade Culling] 메쉬의 바운딩 상자/구체와 캐스케이드 외접구 간 교차 판정
        const aabb = target.boundingAABB;
        if (aabb) {
            const mx = aabb.centerX;
            const my = aabb.centerY;
            const mz = aabb.centerZ;
            const mr = aabb.geometryRadius;

            const dx = mx - cx;
            const dy = my - cy;
            const dz = mz - cz;
            const maxDist = cr + mr;

            // 캐스케이드 외접구 범위를 벗어난 오브젝트는 즉시 선별 제외 (드로우콜 50~70% 감축)
            if ((dx * dx + dy * dy + dz * dz) > (maxDist * maxDist)) {
                continue;
            }
        }

        renderResults.num3DObjects++;

        viewShadowRenderPassEncoder.setPipeline(gpuRenderInfo.shadowPipeline);
        const {gpuBuffer} = currentGeometry.vertexBuffer;
        viewShadowRenderPassEncoder.setVertexBuffer(0, gpuBuffer);
        viewShadowRenderPassEncoder.setBindGroup(1, gpuRenderInfo.vertexUniformBindGroup);
        // 🌟 [결함 5 해소] Null-Fragment 섀도우 패스이므로 Group 2 (머티리얼) 바인딩 완전 생략

        renderResults.numDrawCalls++;

        if (currentGeometry.indexBuffer) {
            const {indexBuffer} = currentGeometry;
            const {indexCount, triangleCount, gpuBuffer: indexGPUBuffer, format} = indexBuffer;
            viewShadowRenderPassEncoder.setIndexBuffer(indexGPUBuffer, format);
            viewShadowRenderPassEncoder.drawIndexed(indexCount, 1, 0, 0, target.globalVertexSlotIndex);
            renderResults.numTriangles += triangleCount;
            renderResults.numPoints += indexCount;
        } else {
            const {vertexBuffer} = currentGeometry;
            const {vertexCount, triangleCount} = vertexBuffer;
            viewShadowRenderPassEncoder.draw(vertexCount, 1, 0, target.globalVertexSlotIndex);
            renderResults.numTriangles += triangleCount;
            renderResults.numPoints += vertexCount;
        }
    }
};

export default renderShadowLayer;
