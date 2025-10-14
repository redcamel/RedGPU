/**
 * 다양한 3D 기본 도형(Box, Sphere, Plane, Circle, Torus, TorusKnot, Cylinder, Ground 등)을 제공합니다.
 *
 * 각 도형 객체를 통해 씬(Scene) 내에 다양한 기하학적 형태의 오브젝트를 손쉽게 생성하고 배치할 수 있습니다.
 *
 * @packageDocumentation
 *
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
export { 
// Primitive,
Plane, Sphere, Torus, TorusKnot, Circle, Cylinder, Box, Ground };
