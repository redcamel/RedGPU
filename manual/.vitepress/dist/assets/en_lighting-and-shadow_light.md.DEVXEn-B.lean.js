import{D as n,o as g,c as d,a2 as h,G as t,w as e,k as s,a}from"./chunks/framework.Dn9yU8Jh.js";const F=JSON.parse('{"title":"Light","description":"","frontmatter":{"title":"Light","order":2},"headers":[],"relativePath":"en/lighting-and-shadow/light.md","filePath":"en/lighting-and-shadow/light.md","lastUpdated":1769502195000}'),o={name:"en/lighting-and-shadow/light.md"},C=Object.assign(o,{setup(E){const k=`
    graph TD
        Scene["Scene (Stage)"]
        LightMgr["LightManager (Director)"]
        Ambient["AmbientLight (All Directions)"]
        DirLight["DirectionalLight (Sun)"]
        PointLight["PointLight (Bulb)"]
        SpotLight["SpotLight (Flashlight)"]

        Scene -->|Has| LightMgr
        LightMgr -->|Manages| Ambient
        LightMgr -->|Manages| DirLight
        LightMgr -->|Manages| PointLight
        LightMgr -->|Manages| SpotLight
`;return(y,i)=>{const p=n("MermaidResponsive"),l=n("ClientOnly"),r=n("CodePen");return g(),d("div",null,[i[1]||(i[1]=h("",4)),t(l,null,{default:e(()=>[t(p,{definition:k})]),_:1}),i[2]||(i[2]=h("",23)),t(l,null,{default:e(()=>[t(r,{title:"RedGPU Basics - Multi Lights",slugHash:"multi-lights-demo"},{default:e(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`const blueLight = new RedGPU.Light.PointLight('#0000ff', 2.0);
blueLight.radius = 15;
scene.lightManager.addPointLight(blueLight);

const redLight = new RedGPU.Light.PointLight('#ff0000', 2.0);
redLight.radius = 15;
scene.lightManager.addPointLight(redLight);

const material = new RedGPU.Material.PhongMaterial(redGPUContext);

const floor = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
    material
);
scene.addChild(floor);

const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32);
for (let i = 0; i < 25; i++) {
    const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, material);
    mesh.x = (i % 5 - 2) * 4;
    mesh.z = (Math.floor(i / 5) - 2) * 4;
    scene.addChild(mesh);
}

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 25;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, (time) => {
    const t = time / 1000;
    blueLight.x = Math.sin(t) * 10;
    blueLight.z = Math.cos(t) * 10;
    blueLight.y = Math.sin(t * 0.5) * 5 + 5;

    redLight.x = Math.sin(t + 3.14) * 10;
    redLight.z = Math.cos(t + 3.14) * 10;
    redLight.y = Math.cos(t * 0.5) * 5 + 5;
});
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[3]||(i[3]=h("",5))])}}});export{F as __pageData,C as default};
