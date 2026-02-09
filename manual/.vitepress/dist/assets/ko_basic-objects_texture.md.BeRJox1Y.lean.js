import{f as k,D as n,o as r,c as d,a2 as t,G as e,w as l,k as s,a}from"./chunks/framework.DpNgdNqH.js";const m=JSON.parse('{"title":"Texture","description":"","frontmatter":{"title":"Texture","order":3},"headers":[],"relativePath":"ko/basic-objects/texture.md","filePath":"ko/basic-objects/texture.md","lastUpdated":1770637469000}'),E={name:"ko/basic-objects/texture.md"};function o(g,i,c,y,F,u){const h=n("CodePen"),p=n("ClientOnly");return r(),d("div",null,[i[1]||(i[1]=t("",15)),e(p,null,{default:l(()=>[e(h,{title:"RedGPU Basics - Texture",slugHash:"mesh-texture"},{default:l(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`const texture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
);

const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

const mesh = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.TorusKnot(redGPUContext), 
    material
);
scene.addChild(mesh);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    mesh.rotationX += 1;
    mesh.rotationY += 1;
});
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[2]||(i[2]=t("",5))])}const x=k(E,[["render",o]]);export{m as __pageData,x as default};
