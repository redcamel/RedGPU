import{$ as t,Q as d,j as E,g as s,n as a,o as n,ax as e,m as l}from"./chunks/framework.D5MFXpji.js";const F=JSON.parse('{"title":"Shadow System","description":"","frontmatter":{"title":"Shadow System","order":3},"headers":[],"relativePath":"ko/lighting-and-shadow/shadow.md","filePath":"ko/lighting-and-shadow/shadow.md","lastUpdated":1783496413000}'),o={name:"ko/lighting-and-shadow/shadow.md"},C=Object.assign(o,{setup(g){const k=`
    Light["Light (광원: DirectionalLight)"] -->|빛 방사| Caster["Caster (그림자 생성 물체: castShadow = true)"]
    Caster -->|그림자 투사| Receiver["Receiver (그림자 받는 물체: receiveShadow = true)"]

    %% 회색조 스타일 적용
    style Light fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Caster fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Receiver fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(y,i)=>{const p=t("MermaidResponsive"),h=t("ClientOnly"),r=t("CodePen");return d(),E("div",null,[i[1]||(i[1]=s("h1",{id:"그림자-시스템",tabindex:"-1"},[a("그림자 시스템 "),s("a",{class:"header-anchor",href:"#그림자-시스템","aria-label":'Permalink to "그림자 시스템"'},"​")],-1)),i[2]||(i[2]=s("p",null,"3D 공간에서 그림자는 물체의 입체감과 공간 내 위치 관계를 결정짓는 핵심 요소입니다. RedGPU는 물리 기반의 그림자 시스템을 제공하며, 간단한 설정만으로 사실적인 그림자를 표현할 수 있습니다.",-1)),n(h,null,{default:e(()=>[n(p,{definition:k})]),_:1}),i[3]||(i[3]=l("",14)),n(h,null,{default:e(()=>[n(r,{title:"RedGPU Basics - Shadow",slugHash:"shadow-basic"},{default:e(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
