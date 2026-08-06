import Terrain, {TerrainLayerConfig} from "./Terrain";
import TerrainMaterial from "./core/material/TerrainMaterial";
import TerrainRVT from "./core/rvt/TerrainRVT";
import {SpatialTileInfo, TerrainSpatialGrid} from "./core/TerrainSpatialGrid";
import TERRAIN_VERTICES_PER_SIDE, {TerrainVerticesPerSide} from "./const/TERRAIN_VERTICES_PER_SIDE";
import VegetationMesh from "./core/VegetationMesh";

// 🌲 GrassMesh는 VegetationMesh로 통합/대체됨 (하위 호환 별칭 제공)
const GrassMesh = VegetationMesh;

export {
    Terrain,
    TerrainMaterial,
    TerrainRVT,
    TerrainSpatialGrid,
    TERRAIN_VERTICES_PER_SIDE,
    VegetationMesh,
    GrassMesh
};
export type {TerrainLayerConfig, SpatialTileInfo, TerrainVerticesPerSide};



