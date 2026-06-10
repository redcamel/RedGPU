import{$ as e,Q as d,j as o,g as s,n as a,o as n,ax as t,m as l}from"./chunks/framework.D5MFXpji.js";const F=JSON.parse('{"title":"Shadow System","description":"","frontmatter":{"title":"Shadow System","order":3},"headers":[],"relativePath":"en/lighting-and-shadow/shadow.md","filePath":"en/lighting-and-shadow/shadow.md","lastUpdated":1781133167000}'),g={name:"en/lighting-and-shadow/shadow.md"},C=Object.assign(g,{setup(E){const p=`
    Light["Light (DirectionalLight)"] -->|Shine| Caster["Caster (castShadow = true)"]
    Caster -->|Project| Receiver["Receiver (receiveShadow = true)"]

    %% Grayscale styles applied
    style Light fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Caster fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Receiver fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(c,i)=>{const k=e("MermaidResponsive"),h=e("ClientOnly"),r=e("CodePen");return d(),o("div",null,[i[1]||(i[1]=s("h1",{id:"shadow-system",tabindex:"-1"},[a("Shadow System "),s("a",{class:"header-anchor",href:"#shadow-system","aria-label":'Permalink to "Shadow System"'},"​")],-1)),i[2]||(i[2]=s("p",null,"In 3D space, shadows are a key element in determining an object's three-dimensionality and its spatial relationship with other objects. RedGPU provides a physically based shadow system, allowing you to express realistic shadows with simple configuration.",-1)),n(h,null,{default:t(()=>[n(k,{definition:p})]),_:1}),i[3]||(i[3]=l("",14)),n(h,null,{default:t(()=>[n(r,{title:"RedGPU Basics - Shadow",slugHash:"shadow-basic"},{default:t(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=l("",5))])}}});export{F as __pageData,C as default};
