import{$ as n,Q as d,j as g,m as h,o as t,ax as l,g as i,n as a}from"./chunks/framework.D5MFXpji.js";const F=JSON.parse('{"title":"Light","description":"","frontmatter":{"title":"Light","order":1},"headers":[],"relativePath":"ko/lighting-and-shadow/light.md","filePath":"ko/lighting-and-shadow/light.md","lastUpdated":1783496413000}'),E={name:"ko/lighting-and-shadow/light.md"},C=Object.assign(E,{setup(o){const k=`
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
        
        %% 회색조 스타일 적용
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style LightMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style DirLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style PointLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style SpotLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(y,s)=>{const p=n("MermaidResponsive"),e=n("ClientOnly"),r=n("CodePen");return d(),g("div",null,[s[1]||(s[1]=h("",9)),t(e,null,{default:l(()=>[t(p,{definition:k})]),_:1}),s[2]||(s[2]=h("",24)),t(e,null,{default:l(()=>[t(r,{title:"RedGPU Basics - Multi Lights",slugHash:"multi-lights-demo"},{default:l(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),i("pre",null,[i("code",null,`const blueLight = new RedGPU.Light.PointLight('#0000ff');
blueLight.radius = 15;
scene.lightManager.addPointLight(blueLight);

const redLight = new RedGPU.Light.PointLight('#ff0000');
redLight.radius = 15;
scene.lightManager.addPointLight(redLight);

const material = new RedGPU.Material.PhongMaterial(redGPUContext,'#ffffff');

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
`),i("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),s[3]||(s[3]=h("",5))])}}});export{F as __pageData,C as default};
