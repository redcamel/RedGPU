import{f as k,D as n,o as r,c as d,a2 as e,G as t,w as h,k as s,a}from"./chunks/framework.DZW1bhNM.js";const u=JSON.parse('{"title":"Shadow System","description":"","frontmatter":{"title":"Shadow System","order":3},"headers":[],"relativePath":"en/lighting-and-shadow/shadow.md","filePath":"en/lighting-and-shadow/shadow.md","lastUpdated":1770713971000}'),o={name:"en/lighting-and-shadow/shadow.md"};function g(E,i,c,y,F,C){const l=n("CodePen"),p=n("ClientOnly");return r(),d("div",null,[i[1]||(i[1]=e("",16)),t(p,null,{default:h(()=>[t(l,{title:"RedGPU Basics - Shadow",slugHash:"shadow-basic"},{default:h(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`// Light
const light = new RedGPU.Light.DirectionalLight();
light.x = -3; light.y = 5; light.z = 3;
scene.lightManager.addDirectionalLight(light);

scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.3);

// Floor (Receiver)
const floor = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#555555')
);
floor.receiveShadow = true;
scene.addChild(floor);

// Box (Caster)
const box = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#ffcc00')
);
box.y = 3;
box.castShadow = true;
scene.addChild(box);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    box.rotationY += 1;
    box.rotationZ += 1;
});
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[2]||(i[2]=e("",5))])}const m=k(o,[["render",g]]);export{u as __pageData,m as default};
