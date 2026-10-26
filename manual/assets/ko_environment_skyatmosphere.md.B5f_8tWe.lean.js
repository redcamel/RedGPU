import{D as t,o as d,c as o,k as s,a,G as e,w as n,a2 as h}from"./chunks/framework.n5RLHRfo.js";const m=JSON.parse('{"title":"SkyAtmosphere","description":"","frontmatter":{"title":"SkyAtmosphere","order":3},"headers":[],"relativePath":"ko/environment/skyatmosphere.md","filePath":"ko/environment/skyatmosphere.md","lastUpdated":1792993711000}'),c={name:"ko/environment/skyatmosphere.md"},A=Object.assign(c,{setup(g){const p=`
    Sun["Sun (DirectionalLight)"] -->|빛의 방향 제공| Atmosphere["SkyAtmosphere (대기 산란 계산)"]
    Atmosphere -->|배경 및 대기 광원| View["View3D (배경·IBL·공중 원근법 적용)"]

    %% 회색조 스타일 적용
    style Sun fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Atmosphere fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(y,i)=>{const k=t("MermaidResponsive"),l=t("ClientOnly"),r=t("CodePen");return d(),o("div",null,[i[1]||(i[1]=s("h1",{id:"skyatmosphere",tabindex:"-1"},[a("SkyAtmosphere "),s("a",{class:"header-anchor",href:"#skyatmosphere","aria-label":'Permalink to "SkyAtmosphere"'},"​")],-1)),i[2]||(i[2]=s("p",null,[s("a",{href:"/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/SkyAtmosphere.html"},[s("code",null,"SkyAtmosphere")]),a(" 는 물리 기반 대기 산란 (Atmospheric Scattering) 시뮬레이션 시스템입니다. 레일리 산란 (Rayleigh Scattering), 미 산란 (Mie Scattering), 오존 흡수 (Ozone Absorption) 등을 실시간으로 계산하여 사실적인 하늘, 저녁 노을, 그리고 거리에 따른 공중 원근법 (Aerial Perspective) 효과를 제공합니다.")],-1)),e(l,null,{default:n(()=>[e(k,{definition:p})]),_:1}),i[3]||(i[3]=h("",17)),e(l,null,{default:n(()=>[e(r,{title:"RedGPU Basics - SkyAtmosphere",slugHash:"skyatmosphere-basic"},{default:n(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById ("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();`),a(`
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
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=h("",10))])}}});export{m as __pageData,A as default};
