import{D as l,o as E,c as g,a2 as h,G as n,w as t,k as i,a}from"./chunks/framework.Dn9yU8Jh.js";const C=JSON.parse('{"title":"Getting Started","description":"","frontmatter":{"title":"Getting Started","order":1},"headers":[],"relativePath":"ko/introduction/index.md","filePath":"ko/introduction/index.md","lastUpdated":1769512807000}'),o={name:"ko/introduction/index.md"},m=Object.assign(o,{setup(y){const p=`
    Renderer["RedGPU.Renderer"] -->|Draws| View["RedGPU.Display.View3D"]
    View -->|Composes| Scene["RedGPU.Display.Scene"]
    View -->|Uses| Camera["RedGPU.Camera"]
    Scene -->|Contains| Mesh["RedGPU.Display.Mesh"]
    Mesh -->|Combines| Geo["Geometry"] & Mat["Material"]

    %% 커스텀 클래스 적용
    class Renderer mermaid-system;
    class View mermaid-main;
    class Geo,Mat mermaid-component;
`,r=`
    Start(["시작"]) --> Init["RedGPU.init 초기화"] 
    Init -->|성공| Context["redGPUContext 획득"]
    Context --> Create["리소스 생성<br/>Scene, Camera, Mesh"]
    Create --> SetupView["View3D 설정"]
    SetupView --> StartLoop["렌더링 루프 시작"]
    StartLoop -->|Loop| Update["프레임 업데이트"]
    Update --> Render["화면 렌더링"]
    Render --> Update
`;return(c,s)=>{const d=l("CodePen"),e=l("ClientOnly"),k=l("MermaidResponsive");return E(),g("div",null,[s[1]||(s[1]=h("",19)),n(e,null,{default:t(()=>[n(d,{title:"RedGPU Quick Start - Rotating Cube",slugHash:"getting-started"},{default:t(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(
canvas,
(redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
camera.z = -5;`),a(`
`),i("pre",null,[i("code",null,`    const geometry = new RedGPU.Primitive.Box(redGPUContext); 
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00CC99");
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    
    scene.addChild(mesh);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        mesh.rotationX += 1;
        mesh.rotationY += 1;
    });
},
(error) => {
    console.error("RedGPU 초기화 실패:", error);
}
`)]),a(`
`),i("p",null,");"),a(`
`)],-1)])]),_:1})]),_:1}),s[2]||(s[2]=i("br",null,null,-1)),s[3]||(s[3]=i("h2",{id:"시스템-구조-및-실행-흐름",tabindex:"-1"},[a("시스템 구조 및 실행 흐름 "),i("a",{class:"header-anchor",href:"#시스템-구조-및-실행-흐름","aria-label":'Permalink to "시스템 구조 및 실행 흐름"'},"​")],-1)),s[4]||(s[4]=i("p",null,"RedGPU의 주요 클래스 관계와 애플리케이션 생명 주기를 도식화한 내용입니다.",-1)),s[5]||(s[5]=i("h3",{id:"실행-프로세스",tabindex:"-1"},[a("실행 프로세스 "),i("a",{class:"header-anchor",href:"#실행-프로세스","aria-label":'Permalink to "실행 프로세스"'},"​")],-1)),n(e,null,{default:t(()=>[n(k,{definition:r})]),_:1}),s[6]||(s[6]=h("",2)),n(e,null,{default:t(()=>[n(k,{definition:p})]),_:1}),s[7]||(s[7]=h("",3))])}}});export{C as __pageData,m as default};
