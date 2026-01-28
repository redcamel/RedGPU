import{D as h,o as d,c as E,a2 as e,G as n,w as t,k as i,a}from"./chunks/framework.Dn9yU8Jh.js";const F=JSON.parse('{"title":"Scene Graph","description":"","frontmatter":{"title":"Scene Graph","order":2},"headers":[],"relativePath":"ko/basic-objects/scene-graph.md","filePath":"ko/basic-objects/scene-graph.md","lastUpdated":1769586187000}'),g={name:"ko/basic-objects/scene-graph.md"},C=Object.assign(g,{setup(o){const k=`
    Scene["Scene (Root)"] --> ParentMesh["부모 메시 (Parent)"]
    ParentMesh --> ChildMesh1["자식 메시 A (Child)"]
    ParentMesh --> ChildMesh2["자식 메시 B (Child)"]
    ChildMesh2 --> GrandChild["손자 메시 (Grandchild)"]
`;return(y,s)=>{const p=h("MermaidResponsive"),l=h("ClientOnly"),r=h("CodePen");return d(),E("div",null,[s[1]||(s[1]=e("",5)),n(l,null,{default:t(()=>[n(p,{definition:k})]),_:1}),s[2]||(s[2]=e("",10)),n(l,null,{default:t(()=>[n(r,{title:"RedGPU Basics - Mesh Hierarchy",slugHash:"mesh-hierarchy"},{default:t(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
camera.z = -15; camera.y = 5;
camera.lookAt(0, 0, 0);`),a(`
`),i("pre",null,[i("code",null,`const sun = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 2),
    new RedGPU.Material.ColorMaterial(redGPUContext, '#ff4500')
);
scene.addChild(sun);

const earth = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 0.7),
    new RedGPU.Material.ColorMaterial(redGPUContext, '#1890ff')
);
earth.x = 7;
sun.addChild(earth);

const moon = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 0.3),
    new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
);
moon.x = 2;
earth.addChild(moon);

const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    sun.rotationY += 1;
    earth.rotationY += 2;
});
`)]),a(`
`),i("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),s[3]||(s[3]=e("",5))])}}});export{F as __pageData,C as default};
