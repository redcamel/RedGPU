/**
 * [KO] 옥타헤드럴 임포스터 빌보드 지오메트리 생성 모듈입니다.
 * [EN] Module for creating octahedral impostor billboard geometry.
 * @packageDocumentation
 */

import RedGPUContext from "../../../../../../context/RedGPUContext";
import Geometry from "../../../../../../geometry/Geometry";
import VertexBuffer from "../../../../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../../../../resources/buffer/indexBuffer/IndexBuffer";
import {PBR_INTERLEAVED_STRUCT} from "../../../../../core/scatter/ScatterVertexFormats";

/**
 * [KO] 옥타헤드럴(Octahedral) 임포스터 렌더링을 위한 4정점 2삼각형 평면 빌보드 지오메트리를 생성합니다.
 * [EN] Creates a 4-vertex 2-triangle planar billboard geometry for octahedral impostor rendering.
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트 인스턴스
 * [EN] RedGPU context instance
 * @param width -
 * [KO] 빌보드 가로 너비 (기본값: 6.0)
 * [EN] Billboard width (default: 6.0)
 * @param height -
 * [KO] 빌보드 세로 높이 (기본값: 6.0)
 * [EN] Billboard height (default: 6.0)
 * @param bottomOffset -
 * [KO] 밑둥 피벗 보정 오프셋 (기본값: 0.0)
 * [EN] Bottom pivot correction offset (default: 0.0)
 * @returns
 * [KO] 생성된 임포스터 빌보드 Geometry 인스턴스
 * [EN] Created impostor billboard Geometry instance
 */
export function createOctahedralImpostorGeometry(
    redGPUContext: RedGPUContext,
    width: number = 6.0,
    height: number = 6.0,
    bottomOffset: number = 0.0
): Geometry {
    const halfW = width * 0.5;
    const halfH = height * 0.5;
    const centerY = bottomOffset + halfH;

    const interleaved = new Float32Array([
        -halfW, -halfH, centerY, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0,
        halfW, -halfH, centerY, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0,
        halfW, halfH, centerY, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0,
        -halfW, halfH, centerY, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0
    ]);

    const indices = new Uint32Array([0, 1, 2, 0, 2, 3]);

    const vertexBuffer = new VertexBuffer(
        redGPUContext,
        interleaved,
        PBR_INTERLEAVED_STRUCT
    );

    const indexBuffer = new IndexBuffer(
        redGPUContext,
        indices
    );

    return new Geometry(redGPUContext, vertexBuffer, indexBuffer);
}

export default createOctahedralImpostorGeometry;
