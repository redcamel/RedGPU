import{$ as n,Q as d,j as g,g as s,n as a,o as t,ax as e,m as h}from"./chunks/framework.D5MFXpji.js";const F=JSON.parse('{"title":"Phong Material","description":"","frontmatter":{"title":"Phong Material","order":2},"headers":[],"relativePath":"ko/lighting-and-shadow/phong-material.md","filePath":"ko/lighting-and-shadow/phong-material.md","lastUpdated":1781137916000}'),E={name:"ko/lighting-and-shadow/phong-material.md"},C=Object.assign(E,{setup(o){const p=`
    Ambient["Ambient (환경광)"] --> Phong["Phong Reflection (퐁 재질)"]
    Diffuse["Diffuse (난반사)"] --> Phong
    Specular["Specular (정반사)"] --> Phong

    %% 회색조 스타일 적용
    style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Diffuse fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Specular fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Phong fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(y,i)=>{const k=n("MermaidResponsive"),l=n("ClientOnly"),r=n("CodePen");return d(),g("div",null,[i[1]||(i[1]=s("h1",{id:"phong-material",tabindex:"-1"},[a("Phong Material "),s("a",{class:"header-anchor",href:"#phong-material","aria-label":'Permalink to "Phong Material"'},"​")],-1)),i[2]||(i[2]=s("p",null,[s("strong",null,"Phong Material"),a(" 은 3D 그래픽스에서 가장 널리 사용되는 라이팅 모델 중 하나인 "),s("strong",null,"퐁 리플렉션 모델"),a("(Phong Reflection Model) 을 구현한 재질입니다. 단순히 색상을 칠하는 것을 넘어, 다양한 "),s("strong",null,"텍스처 맵"),a(" 을 활용하여 물체의 질감을 사실적으로 조절할 수 있습니다.")],-1)),t(l,null,{default:e(()=>[t(k,{definition:p})]),_:1}),i[3]||(i[3]=h("",11)),t(l,null,{default:e(()=>[t(r,{title:"RedGPU Basics - Phong Material Texture",slugHash:"phong-material-texture"},{default:e(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);
scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.1);

const material = new RedGPU.Material.PhongMaterial(redGPUContext);
const assetPath = 'https://redcamel.github.io/RedGPU/examples/assets/phongMaterial/';

material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_diffuseMap.jpg');
material.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_normalMap.jpg');
material.specularTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_specularMap.jpg');
material.displacementTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_displacementMap.jpg');

material.displacementScale = 0.5;
material.shininess = 32;

const mesh = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.Sphere(redGPUContext, 4, 64, 64), 
    material
);
scene.addChild(mesh);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    mesh.rotationY += 1;
});
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=h("",6))])}}});export{F as __pageData,C as default};
