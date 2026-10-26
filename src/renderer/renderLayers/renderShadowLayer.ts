import View3D from "../../display/view/View3D";

/**
 * [KO] 지정된 캐스케이드 인덱스에 대해 가시성 컬링을 수행하고 그림자 깊이 맵을 렌더링합니다.
 * [EN] Performs visibility culling for the specified cascade index and renders the shadow depth map.
 *
 * @param view -
 * [KO] 렌더링 대상 View3D 인스턴스
 * [EN] Target View3D instance for rendering
 * @param viewShadowRenderPassEncoder -
 * [KO] 그림자 렌더 패스 인코더
 * [EN] Shadow render pass encoder
 * @param cascadeIndex -
 * [KO] 렌더링할 캐스케이드 인덱스
 * [EN] Cascade index to render
 * @category Renderer
 */
const renderShadowLayer = (view: View3D, viewShadowRenderPassEncoder: GPURenderPassEncoder, cascadeIndex: number) => {
    const {renderViewStateData, scene} = view;
    renderViewStateData.currentRenderPassEncoder = viewShadowRenderPassEncoder;
    const {directionalShadowManager} = scene.shadowManager;
    const {castingList, cascadeBoundingSpheres, cascadeLightDistances} = directionalShadowManager;

    const len = castingList.length;
    if (!len) return;

    const {renderResults} = renderViewStateData;

    viewShadowRenderPassEncoder.setBindGroup(0, view.getCascadeUniformBindGroup(cascadeIndex));

    const sphereIdx = cascadeIndex * 4;
    const cx = cascadeBoundingSpheres[sphereIdx];
    const cy = cascadeBoundingSpheres[sphereIdx + 1];
    const cz = cascadeBoundingSpheres[sphereIdx + 2];
    const cr = cascadeBoundingSpheres[sphereIdx + 3];
    const lightDistance = cascadeLightDistances[cascadeIndex];

    const directionalLight = scene.lightManager?.directionalLights?.[0];
    let lx = 0;
    let ly = -1;
    let lz = 0;
    if (directionalLight) {
        const dir = directionalLight.direction;
        const d0 = dir[0];
        const d1 = dir[1];
        const d2 = dir[2];
        const invLen = 1.0 / (Math.sqrt(d0 * d0 + d1 * d1 + d2 * d2) || 1.0);
        lx = d0 * invLen;
        ly = d1 * invLen;
        lz = d2 * invLen;
    }

    for (let i = 0; i < len; i++) {
        const target = castingList[i];
        const {gpuRenderInfo} = target;
        if (!gpuRenderInfo || !gpuRenderInfo.shadowPipeline) continue;

        const currentGeometry = target.geometry;
        if (!currentGeometry) continue;

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

            const alongLight = dx * lx + dy * ly + dz * lz;
            if (alongLight > maxDist || alongLight < -(lightDistance + mr)) {
                continue;
            }

            const perpDistSq = (dx * dx + dy * dy + dz * dz) - (alongLight * alongLight);
            if (perpDistSq > (maxDist * maxDist)) {
                continue;
            }
        }

        renderResults.num3DObjects++;

        viewShadowRenderPassEncoder.setPipeline(gpuRenderInfo.shadowPipeline);
        const {gpuBuffer} = currentGeometry.vertexBuffer;
        viewShadowRenderPassEncoder.setVertexBuffer(0, gpuBuffer);
        viewShadowRenderPassEncoder.setBindGroup(1, gpuRenderInfo.vertexUniformBindGroup);

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
