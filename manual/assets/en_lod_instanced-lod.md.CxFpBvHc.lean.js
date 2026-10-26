import{f as r,D as n,o as d,c as p,a2 as o,G as i,w as t,k as s,a}from"./chunks/framework.n5RLHRfo.js";const u=JSON.parse('{"title":"Instancing Mesh LOD","description":"","frontmatter":{"title":"Instancing Mesh LOD","order":3},"headers":[],"relativePath":"en/lod/instanced-lod.md","filePath":"en/lod/instanced-lod.md","lastUpdated":1792993711000}'),k={name:"en/lod/instanced-lod.md"};function c(g,e,E,m,y,P){const l=n("CodePen"),h=n("ClientOnly");return d(),p("div",null,[e[1]||(e[1]=o("",9)),i(h,null,{default:t(()=>[i(l,{title:"RedGPU - Instancing LOD Example",slugHash:"lod-instancing"},{default:t(()=>[...e[0]||(e[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`// Add Lights
const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);

const ambientLight = new RedGPU.Light.AmbientLight();
ambientLight.intensity = 0.5;
scene.lightManager.ambientLight = ambientLight;

// 1. Create InstancingMesh
// Base detail (distance 0~30): Sphere High (32x32)
const maxCount = 2000;
const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32);

const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
material.diffuseTexture = texture;

const mesh = new RedGPU.Display.InstancingMesh(
    redGPUContext,
    maxCount,
    maxCount,
    geometry,
    material
);
scene.addChild(mesh);

// 2. Add LOD Levels
// Level 1 (distance 30 or more): Sphere Low (8x8)
mesh.LODManager.addLOD(30, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));

// Level 2 (distance 60 or more): Box
mesh.LODManager.addLOD(60, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

// 3. Randomly place instances
const range = 100;
for (let i = 0; i < maxCount; i++) {
    const instance = mesh.instanceChildren[i];
    instance.setPosition(
        Math.random() * range * 2 - range,
        Math.random() * range * 2 - range,
        Math.random() * range * 2 - range
    );
    instance.scale = Math.random() * 1.5 + 1.0;
}

// 4. Camera Settings
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 150;
controller.speedDistance = 5;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 5. Render Loop
const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    // Full scene rotation
    mesh.rotationY += 0.002;
});
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),e[2]||(e[2]=s("h2",{id:"related-examples",tabindex:"-1"},[a("Related Examples "),s("a",{class:"header-anchor",href:"#related-examples","aria-label":'Permalink to "Related Examples"'},"​")],-1)),e[3]||(e[3]=s("ul",null,[s("li",null,[s("a",{href:"/RedGPU/examples/3d/lod/InstanceMeshGPULOD/",target:"_blank",rel:"noopener noreferrer"},"InstancingMesh GPU LOD")]),s("li",null,[s("a",{href:"/RedGPU/examples/3d/lod/InstanceMeshGPULOD_material/",target:"_blank",rel:"noopener noreferrer"},"InstancingMesh GPU LOD (Per-Level Material)")])],-1))])}const U=r(k,[["render",c]]);export{u as __pageData,U as default};
