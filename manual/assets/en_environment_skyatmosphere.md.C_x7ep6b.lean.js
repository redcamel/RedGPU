import{D as t,o as k,c as o,k as s,a as e,G as a,w as n,a2 as h}from"./chunks/framework.n5RLHRfo.js";const E=JSON.parse('{"title":"SkyAtmosphere","description":"","frontmatter":{"title":"SkyAtmosphere","order":3},"headers":[],"relativePath":"en/environment/skyatmosphere.md","filePath":"en/environment/skyatmosphere.md","lastUpdated":1792993711000}'),c={name:"en/environment/skyatmosphere.md"},u=Object.assign(c,{setup(g){const p=`
    Sun["Sun (DirectionalLight)"] -->|Provide Light Direction| Atmosphere["SkyAtmosphere (Atmospheric Scattering)"]
    Atmosphere -->|Background & Sky Light| View["View3D (Background, IBL & Aerial Perspective)"]

    %% Grayscale styles applied
    style Sun fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Atmosphere fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(y,i)=>{const r=t("MermaidResponsive"),l=t("ClientOnly"),d=t("CodePen");return k(),o("div",null,[i[1]||(i[1]=s("h1",{id:"skyatmosphere",tabindex:"-1"},[e("SkyAtmosphere "),s("a",{class:"header-anchor",href:"#skyatmosphere","aria-label":'Permalink to "SkyAtmosphere"'},"​")],-1)),i[2]||(i[2]=s("p",null,[s("a",{href:"/RedGPU/manual/en/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/SkyAtmosphere.html"},[s("code",null,"SkyAtmosphere")]),e(" is a physically-based atmospheric scattering simulation system. It calculates Rayleigh scattering, Mie scattering, and Ozone absorption in real time to provide realistic skies, evening sunsets, and distance-based aerial perspective effects.")],-1)),a(l,null,{default:n(()=>[a(r,{definition:p})]),_:1}),i[3]||(i[3]=h("",17)),a(l,null,{default:n(()=>[a(d,{title:"RedGPU Basics - SkyAtmosphere",slugHash:"skyatmosphere-basic"},{default:n(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[e(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById ("redgpu-canvas");'),e(`
`),s("p",null,`RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();`),e(`
`),s("pre",null,[s("code",null,`const sunLight = new RedGPU.Light.DirectionalLight();
sunLight.azimuth = 180;
scene.lightManager.addDirectionalLight(sunLight);

const sphere = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 2, 64, 64),
    new RedGPU.Material.PBRMaterial(redGPUContext)
);
sphere.material.metallicFactor = 0.9;
sphere.material.roughnessFactor = 0.15;
scene.addChild(sphere);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.tilt = 5;
controller.distance = 10;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, (time) => {
    sunLight.elevation = Math.sin(time * 0.0006) * 25 + 20;
});
`)]),e(`
`),s("p",null,"});"),e(`
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=h("",10))])}}});export{E as __pageData,u as default};
