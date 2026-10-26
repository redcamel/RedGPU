[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [billboard](../README.md) / getBillboardResult

# Variable: getBillboardResult

> `const` **getBillboardResult**: `string` = `getBillboardResult_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:625](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L625)

Billboard calculation result structure.

```wgsl
struct BillboardResult {
    position: vec4<f32>,       // Clip space position
    vertexPosition: vec3<f32>, // View space position
    vertexNormal: vec3<f32>,   // View space normal
}

/**
 * Returns common vertex transformation result data supporting billboard and pixel size modes.
 *
 * @param input_position Input vertex position
 * @param input_normal Input vertex normal
 * @param modelMatrix Model matrix
 * @param viewMatrix View matrix
 * @param projectionMatrix Projection matrix
 * @param resolution Screen resolution
 * @param useBillboard Whether to use billboard (1u: yes)
 * @param usePixelSize Whether to use pixel size mode (1u: yes)
 * @param pixelSize Pixel size
 * @param renderRatioX Rendering horizontal ratio
 * @param renderRatioY Rendering vertical ratio
 * @returns Billboard calculation result data
 *
 */
fn getBillboardResult(
    input_position: vec3<f32>,
    input_normal: vec3<f32>,
    modelMatrix: mat4x4<f32>,
    viewMatrix: mat4x4<f32>,
    projectionMatrix: mat4x4<f32>,
    resolution: vec2<f32>,
    useBillboard: u32,
    usePixelSize: u32,
    pixelSize: f32,
    renderRatioX: f32,
    renderRatioY: f32
) -> BillboardResult {
    var result: BillboardResult;

    let ratioScaleMatrix = mat4x4<f32>(
        renderRatioX, 0, 0, 0,
        0, renderRatioY, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    var viewPos: vec4<f32>;
    var viewNormal: vec4<f32>;

    if (useBillboard == 1u) {
        let billboardMatrix = getBillboardMatrix(viewMatrix, modelMatrix, 1u);

        if (usePixelSize == 1u) {
            // [빌보드 + Pixel Size 모드] - 피벗 기반 클립 공간 확장 및 W-보정 적용
            let viewCenter = billboardMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0);
            let clipCenter = projectionMatrix * viewCenter;

            let scaleX = (pixelSize / resolution.x) * 2.0 * renderRatioX;
            let scaleY = (pixelSize / resolution.y) * 2.0 * renderRatioY;

            result.position = vec4<f32>(
                clipCenter.xy + input_position.xy * vec2<f32>(scaleX, scaleY) * clipCenter.w,
                clipCenter.zw
            );
            viewPos = viewCenter;
            viewNormal = vec4<f32>(0.0, 0.0, 1.0, 0.0);
        } else {
            // [빌보드 + World Size 모드]
            viewPos = billboardMatrix * ratioScaleMatrix * vec4<f32>(input_position, 1.0);
            viewNormal = vec4<f32>(0.0, 0.0, 1.0, 0.0);
            result.position = projectionMatrix * viewPos;
        }
    } else {
        if (usePixelSize == 1u) {
            // [일반 3D 평면 + Pixel Size 모드] - 3D 회전 유지 및 거리(W) 비례 스케일 보정
            let viewCenter = viewMatrix * modelMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0);
            let clipCenter = projectionMatrix * viewCenter;
            let pixelWorldScale = (pixelSize / resolution.y) * (2.0 * clipCenter.w / abs(projectionMatrix[1][1]));
            let pixelRatioScaleMatrix = mat4x4<f32>(
                renderRatioX * pixelWorldScale, 0, 0, 0,
                0, renderRatioY * pixelWorldScale, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
            viewPos = viewMatrix * modelMatrix * pixelRatioScaleMatrix * vec4<f32>(input_position, 1.0);
        } else {
            // [일반 3D 평면 + World Size 모드]
            viewPos = viewMatrix * modelMatrix * ratioScaleMatrix * vec4<f32>(input_position, 1.0);
        }
        viewNormal = viewMatrix * modelMatrix * ratioScaleMatrix * vec4<f32>(input_normal, 0.0);
        result.position = projectionMatrix * viewPos;
    }

    result.vertexPosition = viewPos.xyz;
    result.vertexNormal = normalize(viewNormal.xyz);

    return result;
}
```
