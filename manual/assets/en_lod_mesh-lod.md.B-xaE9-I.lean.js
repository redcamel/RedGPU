import{f as r,D as a,o as d,c as p,a2 as o,G as n,w as t,k as e,a as s}from"./chunks/framework.Dn9yU8Jh.js";const x=JSON.parse('{"title":"Mesh LOD","description":"","frontmatter":{"title":"Mesh LOD","order":2},"headers":[],"relativePath":"en/lod/mesh-lod.md","filePath":"en/lod/mesh-lod.md","lastUpdated":1769586579000}'),k={name:"en/lod/mesh-lod.md"};function c(g,i,E,m,y,u){const l=a("CodePen"),h=a("ClientOnly");return d(),p("div",null,[i[1]||(i[1]=o("",9)),n(h,null,{default:t(()=>[n(l,{title:"RedGPU - Mesh LOD Example",slugHash:"lod-mesh-basic"},{default:t(()=>[...i[0]||(i[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[s(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),s(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),s(`
`),e("pre",null,[e("code",null,`// Add Lights
const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);

const ambientLight = new RedGPU.Light.AmbientLight();
ambientLight.intensity = 0.5;
scene.lightManager.ambientLight = ambientLight;

// 1. Setup Material and Texture
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
material.diffuseTexture = texture;

// 2. Create Base Mesh (Distance 0 ~ 10)
// High Detail: Sphere (radius 2, segments 32x32)
const mesh = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),
    material
);
scene.addChild(mesh);

// 3. Add LOD Levels
// Level 1: Distance 10 or more (Mid Detail - Sphere 2, 8x8)
mesh.LODManager.addLOD(10, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));

// Level 2: Distance 20 or more (Low Detail - Box 3x3x3)
mesh.LODManager.addLOD(20, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

// 4. Status Display UI
const label = document.createElement('div');
Object.assign(label.style, {
    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
    color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: '8px',
    fontFamily: 'monospace', fontSize: '16px', textAlign: 'center'
});
document.body.appendChild(label);

// 5. Camera Settings
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 10;
controller.speedDistance = 0.5;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 6. Render Loop
const renderer = new RedGPU.Renderer(redGPUContext);
const render = () => {
    // Calculate distance and update UI (for visual confirmation)
    const dist = Math.sqrt(
        Math.pow(view.rawCamera.x - mesh.x, 2) +
        Math.pow(view.rawCamera.y - mesh.y, 2) +
        Math.pow(view.rawCamera.z - mesh.z, 2)
    );
    
    let currentLevel = "High (Sphere 32)";
    if (dist >= 20) currentLevel = "Low (Box)";
    else if (dist >= 10) currentLevel = "Mid (Sphere 8)";

    label.innerHTML = \`Distance: \${dist.toFixed(1)}m <br/> Geometry: \${currentLevel}\`;
};

renderer.start(redGPUContext, render);
`)]),s(`
`),e("p",null,"});"),s(`
`)],-1)])]),_:1})]),_:1})])}const D=r(k,[["render",c]]);export{x as __pageData,D as default};
