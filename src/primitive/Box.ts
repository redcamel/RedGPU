import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

class Box extends Primitive {
    #makeData = (function () {
        let numberOfVertices;
        let groupStart;
        let buildPlane;
        buildPlane = function (
            interleaveData, indexData,
            componentIndexU, componentIndexV, componentIndexW,
            directionComponentU, directionComponentV,
            width, height, depth,
            gridResolutionX, gridResolutionY,
            uvSize
        ) {
            let segmentWidth = width / gridResolutionX;
            let segmentHeight = height / gridResolutionY;
            let widthHalf = width / 2, heightHalf = height / 2;
            let depthHalf = depth / 2;
            let gridX1 = gridResolutionX + 1, gridY1 = gridResolutionY + 1;
            let vertexCounter = 0;
            let groupCount = 0;
            let ix, iy;
            let vector = [];
            for (iy = 0; iy < gridY1; iy++) {
                let y = iy * segmentHeight - heightHalf;
                for (ix = 0; ix < gridX1; ix++) {
                    let x = ix * segmentWidth - widthHalf;
                    // set values to correct vector component
                    vector[componentIndexU] = x * directionComponentU;
                    vector[componentIndexV] = y * directionComponentV;
                    vector[componentIndexW] = depthHalf;
                    //
                    interleaveData.push(vector['x'], vector['y'], vector['z']); // position
                    vector[componentIndexU] = 0;
                    vector[componentIndexV] = 0;
                    vector[componentIndexW] = depth > 0 ? 1 : -1;
                    interleaveData.push(vector['x'], vector['y'], vector['z']); // normal
                    interleaveData.push(ix / gridResolutionX * uvSize, (iy / gridResolutionY * uvSize)); // uv
                    vertexCounter += 1; // counters
                }
            }
            // indices
            for (iy = 0; iy < gridResolutionY; iy++) {
                for (ix = 0; ix < gridResolutionX; ix++) {
                    let a = numberOfVertices + ix + gridX1 * iy;
                    let b = numberOfVertices + ix + gridX1 * (iy + 1);
                    let c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
                    let d = numberOfVertices + (ix + 1) + gridX1 * iy;
                    indexData.push(a, b, d, b, c, d);
                    groupCount += 6;
                }
            }
            groupStart += groupCount;
            numberOfVertices += vertexCounter;
        };
        return function (uniqueKey, redGPUContext, width, height, depth, wSegments, hSegments, dSegments, uvSize) {
            ////////////////////////////////////////////////////////////////////////////
            // 데이터 생성!
            // vertexBuffer Data
            let interleaveData = [];
            let indexData = [];
            numberOfVertices = 0;
            groupStart = 0;
            buildPlane(interleaveData, indexData, 'z', 'y', 'x', -1, -1, depth, height, width, dSegments, hSegments, uvSize); // px
            buildPlane(interleaveData, indexData, 'z', 'y', 'x', 1, -1, depth, height, -width, dSegments, hSegments, uvSize); // nx
            buildPlane(interleaveData, indexData, 'x', 'z', 'y', 1, 1, width, depth, height, wSegments, dSegments, uvSize); // py
            buildPlane(interleaveData, indexData, 'x', 'z', 'y', 1, -1, width, depth, -height, wSegments, dSegments, uvSize); // ny
            buildPlane(interleaveData, indexData, 'x', 'y', 'z', 1, -1, width, height, depth, wSegments, hSegments, uvSize); // pz
            buildPlane(interleaveData, indexData, 'x', 'y', 'z', -1, -1, width, height, -depth, wSegments, hSegments, uvSize); // nz
            return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey)
        };
    })()

    constructor(
        redGPUContext: RedGPUContext,
        width: number = 1,
        height: number = 1,
        depth: number = 1,
        wSegments: number = 1,
        hSegments: number = 1,
        dSegments: number = 1,
        uvSize: number = 1
    ) {
        super(redGPUContext);
        const uniqueKey = `PRIMITIVE_BOX_W${width}_H${height}_D${depth}_WS${wSegments}_HS${hSegments}_DS${dSegments}_UV${uvSize}`;
        const cachedBufferState = redGPUContext.resourceManager.cachedBufferState
        let geometry = cachedBufferState[uniqueKey]
        if (!geometry) {
            geometry = cachedBufferState[uniqueKey] = this.#makeData(uniqueKey, redGPUContext, width, height, depth, wSegments, hSegments, dSegments, uvSize)
        }
        this._setData(geometry)
    }
}

export default Box
