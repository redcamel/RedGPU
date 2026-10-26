import{D as a,o as c,c as m,k as r,a as l,G as t,w as p,a2 as n}from"./chunks/framework.n5RLHRfo.js";const x=JSON.parse('{"title":"Camera Controller","description":"","frontmatter":{"title":"Camera Controller","order":5},"headers":[],"relativePath":"ko/view-system/controller.md","filePath":"ko/view-system/controller.md","lastUpdated":1792987289000}'),h={name:"ko/view-system/controller.md"},b=Object.assign(h,{setup(f){const s=`
    graph LR
        Input["사용자 입력 (마우스 · 터치 · 키보드)"]
        Controller["Controller (Orbit / Free / Follow / Isometric)"]
        Camera["내장 Camera (뷰 · 투영 행렬 갱신)"]
        View["View3D (화면 렌더링)"]

        Input -->|이벤트 감지| Controller
        Controller -->|실시간 제어| Camera
        Controller -.->|뷰에 직접 등록| View

        %% 회색조 스타일 일괄 적용
        style Input fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Camera fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style View fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
`;return(C,e)=>{const d=a("MermaidResponsive"),i=a("ClientOnly"),o=a("ExampleFrame");return c(),m("div",null,[e[0]||(e[0]=r("h1",{id:"camera-controller",tabindex:"-1"},[l("Camera Controller "),r("a",{class:"header-anchor",href:"#camera-controller","aria-label":'Permalink to "Camera Controller"'},"​")],-1)),e[1]||(e[1]=r("p",null,[l("앞서 배운 "),r("code",null,"Camera"),l(" 가 '눈'이라면, "),r("strong",null,"Controller"),l(" 는 그 눈을 움직이는 '조종간'입니다. 사용자 입력 (마우스, 터치, 키보드)을 감지하여 카메라의 위치와 회전을 실시간으로 제어하는 "),r("strong",null,"상호작용 모듈"),l("(Interaction Module)이며, 복잡한 행렬 연산 없이도 직관적인 3D 내비게이션 환경을 구축할 수 있습니다.")],-1)),e[2]||(e[2]=r("h2",{id:"_1-아키텍처-및-역할",tabindex:"-1"},[l("1. 아키텍처 및 역할 "),r("a",{class:"header-anchor",href:"#_1-아키텍처-및-역할","aria-label":'Permalink to "1. 아키텍처 및 역할"'},"​")],-1)),t(i,null,{default:p(()=>[t(d,{definition:s})]),_:1}),e[3]||(e[3]=n("",8)),t(o,{src:"/RedGPU/examples/3d/controller/orbitController/",style:{width:"100%",height:"400px",border:"none","border-radius":"8px"}}),e[4]||(e[4]=r("h3",{id:"freecontroller",tabindex:"-1"},[l("FreeController "),r("a",{class:"header-anchor",href:"#freecontroller","aria-label":'Permalink to "FreeController"'},"​")],-1)),e[5]||(e[5]=r("p",null,[l("1인칭 시점에서 "),r("strong",null,"W, A, S, D"),l(" 키와 마우스를 이용해 공간을 자유롭게 탐색합니다.")],-1)),t(o,{src:"/RedGPU/examples/3d/controller/freeController/",style:{width:"100%",height:"400px",border:"none","border-radius":"8px"}}),e[6]||(e[6]=r("h3",{id:"isometriccontroller",tabindex:"-1"},[l("IsometricController "),r("a",{class:"header-anchor",href:"#isometriccontroller","aria-label":'Permalink to "IsometricController"'},"​")],-1)),e[7]||(e[7]=r("p",null,"고정된 각도를 유지하여 전략 시뮬레이션이나 인포그래픽에 적합합니다.",-1)),t(o,{src:"/RedGPU/examples/3d/controller/isometricController/",style:{width:"100%",height:"400px",border:"none","border-radius":"8px"}}),e[8]||(e[8]=r("h3",{id:"followcontroller",tabindex:"-1"},[l("FollowController "),r("a",{class:"header-anchor",href:"#followcontroller","aria-label":'Permalink to "FollowController"'},"​")],-1)),e[9]||(e[9]=r("p",null,"캐릭터나 움직이는 물체를 부드럽게 따라가는 시점을 제공합니다.",-1)),t(o,{src:"/RedGPU/examples/3d/controller/followController/",style:{width:"100%",height:"400px",border:"none","border-radius":"8px"}}),e[10]||(e[10]=n("",7))])}}});export{x as __pageData,b as default};
