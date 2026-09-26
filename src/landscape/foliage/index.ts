/**
 * [KO] Landscape 식생(Foliage) 시스템 모듈입니다.
 * [EN] Foliage system module for the Landscape terrain.
 *
 * @packageDocumentation
 */
import LandscapeFoliageManager from "./LandscapeFoliageManager";
import LandscapeFoliage, {LandscapeFoliageOptions} from "./LandscapeFoliage";
import FoliageSubMesh from "./FoliageSubMesh";
import FoliageMegaBuffer from "./core/buffer/FoliageMegaBuffer";
import LandscapeFoliageSpatialGrid from "./core/spatial/LandscapeFoliageSpatialGrid";
import OctahedralImpostorMaterial from "./core/impostor/octahedral/OctahedralImpostorMaterial";
import {createOctahedralImpostorGeometry} from "./core/impostor/octahedral/createOctahedralImpostorGeometry";

export {
    LandscapeFoliageManager,
    LandscapeFoliage,
    FoliageSubMesh,
    FoliageMegaBuffer,
    LandscapeFoliageSpatialGrid,
    OctahedralImpostorMaterial,
    createOctahedralImpostorGeometry
};

export type {
    LandscapeFoliageOptions
};
