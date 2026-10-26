import{D as n,o as d,c as E,a2 as t,G as e,w as l,k as i,a}from"./chunks/framework.n5RLHRfo.js";const C=JSON.parse('{"title":"Camera","description":"","frontmatter":{"title":"Camera","order":4},"headers":[],"relativePath":"ko/view-system/camera.md","filePath":"ko/view-system/camera.md","lastUpdated":1792987289000}'),o={name:"ko/view-system/camera.md"},m=Object.assign(o,{setup(g){const k=`
    graph LR
        World["3D 월드 좌표계 (Scene)"]
        ViewMat["뷰 행렬 (position, lookAt)"]
        ProjMat["투영 행렬 (FOV / 직교 영역, Clipping)"]
        Screen["2D 화면 좌표계 (View3D)"]

        World -->|시점 변환| ViewMat
        ViewMat -->|투영 변환| ProjMat
        ProjMat -->|최종 출력| Screen

        %% 회색조 스타일 일괄 적용
        style World fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style ViewMat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style ProjMat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Screen fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(c,s)=>{const p=n("MermaidResponsive"),h=n("ClientOnly"),r=n("CodePen");return d(),E("div",null,[s[1]||(s[1]=t("",4)),e(h,null,{default:l(()=>[e(p,{definition:k})]),_:1}),s[2]||(s[2]=t("",12)),e(h,null,{default:l(()=>[e(r,{title:"RedGPU Basics - Camera lookAt",slugHash:"camera-lookat"},{default:l(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),i("pre",null,[i("code",null,`const mesh = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.TorusKnot(redGPUContext),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#00adb5')
);
scene.addChild(mesh);

const dirLight = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(dirLight);

const camera = new RedGPU.Camera.PerspectiveCamera();
camera.y = 8;
camera.fieldOfView = 45;

const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
view.grid = true;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, (time) => {
    const angle = time / 1000;
    camera.x = Math.sin(angle) * 15;
    camera.z = Math.cos(angle) * 15;
    camera.lookAt(0, 0, 0);
});
`)]),a(`
`),i("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),s[3]||(s[3]=t("",7))])}}});export{C as __pageData,m as default};
