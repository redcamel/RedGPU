import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import MeshInfo_OBJ from "../cls/MeshInfo_OBJ";

const parserMesh_OBJ = (redGPUContext: RedGPUContext, parentMesh: Mesh, childrenInfo) => {
    for (let key in childrenInfo) {
        const meshInfo: MeshInfo_OBJ = childrenInfo[key];
        let targetMesh: Mesh;
        if (!meshInfo.use) {
            targetMesh = new Mesh(redGPUContext);
        } else {
            const interleaveBuffer = meshInfo.createVertexBuffer(redGPUContext, key);
            const indexBuffer = meshInfo.createBufferIndex(redGPUContext, key);
            const tempMaterial = meshInfo.createColorMaterial(redGPUContext);
            targetMesh = new Mesh(redGPUContext, new Geometry(redGPUContext, interleaveBuffer, indexBuffer), tempMaterial);
            meshInfo.ableUV = Boolean(meshInfo.resultUV.length);
            meshInfo.ableNormal = Boolean(meshInfo.resultNormal.length);
            meshInfo.ableLight = meshInfo.ableUV && meshInfo.ableNormal;
        }
        targetMesh.name = key;
        meshInfo.mesh = targetMesh;
        parentMesh.addChild(targetMesh);
        parserMesh_OBJ(redGPUContext, targetMesh, meshInfo.childrenInfo);
    }
};
export default parserMesh_OBJ;
