/**
 * [KO] 씬 구성을 위한 다양한 3D 기본 도형(Primitive)들을 제공합니다.
 * [EN] Provides various 3D primitive geometries for scene composition.
 *
 * [KO] Box, Sphere, Plane, Torus 등 표준 기하 도형들을 손쉽게 생성하고 Mesh의 지오메트리로 사용할 수 있습니다.
 * [EN] Easily create standard geometric shapes like Box, Sphere, Plane, and Torus to use as Mesh geometry.
 *
 * @packageDocumentation
 * <iframe src="/RedGPU/examples/3d/primitive/primitives/"></iframe>
 */
export * as Core from './core';
import Box from "./Box";
import Circle from "./Circle";
import Cylinder from "./Cylinder";
import Ground from "./Ground";
import Plane from "./Plane";
import Sphere from "./Sphere";
import Torus from "./Torus";
import TorusKnot from "./TorusKnot";
export { Plane, Sphere, Torus, TorusKnot, Circle, Cylinder, Box, Ground };
