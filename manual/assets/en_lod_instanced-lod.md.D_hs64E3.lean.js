import{f as r,D as e,c as d,o as p,a2 as o,H as a,k as s,w as t,a as i}from"./chunks/framework.cYGcyyTy.js";const P=JSON.parse('{"title":"Instancing Mesh LOD","description":"","frontmatter":{"title":"Instancing Mesh LOD","order":3},"headers":[],"relativePath":"en/lod/instanced-lod.md","filePath":"en/lod/instanced-lod.md","lastUpdated":1769496586000}'),k={name:"en/lod/instanced-lod.md"};function c(g,n,E,m,y,u){const l=e("CodePen"),h=e("ClientOnly");return p(),d("div",null,[n[1]||(n[1]=o("",9)),a(h,null,{default:t(()=>[a(l,{title:"RedGPU - Instancing LOD Example",slugHash:"lod-instancing"},{default:t(()=>[...n[0]||(n[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[i(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),i(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),i(`
`),s("pre",null,[s("code",null,`// Add Lights
const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);

const ambientLight = new RedGPU.Light.AmbientLight();
ambientLight.intensity = 0.5;
scene.lightManager.ambientLight = ambientLight;

// 1. Create InstancingMesh
// Base(0~30): Sphere High (32x32)
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
// 30 or more: Sphere Low (8x8)
mesh.LODManager.addLOD(30, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));

// 60 or more: Box
mesh.LODManager.addLOD(60, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

// 3. Random placement of instances
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

// 5. Render
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext, () => {
    // Full rotation
    mesh.rotationY += 0.002;
});
`)]),i(`
`),s("p",null,"});"),i(`
`)],-1)])]),_:1})]),_:1}),n[2]||(n[2]=s("h2",{id:"key-summary",tabindex:"-1"},[i("Key Summary "),s("a",{class:"header-anchor",href:"#key-summary","aria-label":'Permalink to "Key Summary"'},"​")],-1)),n[3]||(n[3]=s("ul",null,[s("li",null,[s("strong",null,"GPU Acceleration"),i(": Since the GPU determines the distance without CPU calculation, there is almost no performance degradation even with massive amounts of objects.")]),s("li",null,[s("strong",null,"Memory Saving"),i(": Using low-resolution models for distant objects dramatically reduces vertex processing costs.")])],-1))])}const F=r(k,[["render",c]]);export{P as __pageData,F as default};
