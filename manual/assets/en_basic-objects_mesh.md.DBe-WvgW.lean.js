import{D as e,o as k,c as d,a2 as n,G as t,w as l,k as i,a}from"./chunks/framework.Dn9yU8Jh.js";const m=JSON.parse('{"title":"Mesh","description":"","frontmatter":{"title":"Mesh","order":1},"headers":[],"relativePath":"en/basic-objects/mesh.md","filePath":"en/basic-objects/mesh.md","lastUpdated":1769585107000}'),g={name:"en/basic-objects/mesh.md"},u=Object.assign(g,{setup(c){const r=`
    Geometry["Geometry (Shape)"] -->|Compose| Mesh["Mesh (Object)"]
    Material["Material (Surface)"] -->|Compose| Mesh
`;return(y,s)=>{const p=e("MermaidResponsive"),h=e("ClientOnly"),o=e("CodePen");return k(),d("div",null,[s[1]||(s[1]=n("",5)),t(h,null,{default:l(()=>[t(p,{definition:r})]),_:1}),s[2]||(s[2]=n("",18)),t(h,null,{default:l(()=>[t(o,{title:"RedGPU Basics - Mesh Playground",slugHash:"mesh-playground"},{default:l(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
camera.z = -15; camera.y = 8;
camera.lookAt(0, 0, 0);`),a(`
`),i("pre",null,[i("code",null,`// 1. Ground (White)
const floor = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Ground(redGPUContext, 50, 50),
    new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
);
scene.addChild(floor);

// 2. Torus (Yellow)
const torus = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Torus(redGPUContext, 3, 0.5),
    new RedGPU.Material.ColorMaterial(redGPUContext, '#ffcc00')
);
torus.y = 2;
scene.addChild(torus);

// 3. Box (Blue)
const box = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Box(redGPUContext),
    new RedGPU.Material.ColorMaterial(redGPUContext, '#1890ff')
);
box.x = -6; box.y = 1;
scene.addChild(box);

// 4. TorusKnot (Red)
const knot = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.TorusKnot(redGPUContext, 1.5, 0.4),
    new RedGPU.Material.ColorMaterial(redGPUContext, '#ff4d4f')
);
knot.x = 6; knot.y = 2.5;
scene.addChild(knot);

const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    torus.rotationX += 0.5;
    torus.rotationY += 1;
    box.rotationY += 1;
    knot.rotationY += 2;
});
`)]),a(`
`),i("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),s[3]||(s[3]=n("",5))])}}});export{m as __pageData,u as default};
