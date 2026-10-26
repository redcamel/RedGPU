/**
 * [KO] Box, Sphere, Plane, Torus 등 씬 구성을 위한 다양한 3D 기본 도형(Primitive) 클래스들을 제공합니다.
 * [EN] Provides various 3D primitive geometry classes such as Box, Sphere, Plane, and Torus for scene composition.
 *
 * <iframe src="/RedGPU/examples/3d/primitive/primitives/" style="width:100%; height:500px;"></iframe>
 *
 * @packageDocumentation
 */
export * as Core from './core'
import Box from "./Box";
import Capsule from "./Capsule";
import Circle from "./Circle";
import Cone from "./Cone";
import Cylinder from "./Cylinder";
import Ground from "./Ground";
import Plane from "./Plane";
import Ring from "./Ring";
import RoundedBox from "./RoundedBox";
import Sphere from "./Sphere";
import Torus from "./Torus";
import TorusKnot from "./TorusKnot";

export {
    Plane,
    Sphere,
    Torus,
    TorusKnot,
    Circle,
    Cone,
    Cylinder,
    Box,
    RoundedBox,
    Capsule,
    Ground,
    Ring
}