import{$ as n,Q as d,j as g,m as e,o as a,ax as l,g as s,n as t}from"./chunks/framework.D5MFXpji.js";const F=JSON.parse('{"title":"Light","description":"","frontmatter":{"title":"Light","order":1},"headers":[],"relativePath":"en/lighting-and-shadow/light.md","filePath":"en/lighting-and-shadow/light.md","lastUpdated":1784265003000}'),o={name:"en/lighting-and-shadow/light.md"},u=Object.assign(o,{setup(E){const p=`
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
        
        %% Grayscale styles applied
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style LightMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style DirLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style PointLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style SpotLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(y,i)=>{const k=n("MermaidResponsive"),h=n("ClientOnly"),r=n("CodePen");return d(),g("div",null,[i[1]||(i[1]=e("",9)),a(h,null,{default:l(()=>[a(k,{definition:p})]),_:1}),i[2]||(i[2]=e("",24)),a(h,null,{default:l(()=>[a(r,{title:"RedGPU Basics - Multi Lights",slugHash:"multi-lights-demo"},{default:l(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[t(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),t(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),t(`
`),s("pre",null,[s("code",null,`const blueLight = new RedGPU.Light.PointLight('#0000ff', 1000);
blueLight.radius = 15;
scene.lightManager.addPointLight(blueLight);

const redLight = new RedGPU.Light.PointLight('#ff0000', 1000);
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
`)]),t(`
`),s("p",null,"});"),t(`
`)],-1)])]),_:1})]),_:1}),i[3]||(i[3]=e("",5))])}}});export{F as __pageData,u as default};
