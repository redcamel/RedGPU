import{D as a,o as h,c as p,a2 as i,G as e,w as d}from"./chunks/framework.n5RLHRfo.js";const E=JSON.parse('{"title":"RedGPU Context","description":"RedGPU 엔진의 시작점이자 리소스 관리자인 RedGPUContext에 대해 알아봅니다.","frontmatter":{"title":"RedGPU Context","description":"RedGPU 엔진의 시작점이자 리소스 관리자인 RedGPUContext에 대해 알아봅니다.","order":2},"headers":[],"relativePath":"ko/context/index.md","filePath":"ko/context/index.md","lastUpdated":1795745455000}'),k={name:"ko/context/index.md"},g=Object.assign(k,{setup(o){const n=`
    graph LR
        Init["RedGPU.init() 호출"] -->|비동기| Callback["onWebGPUInitialized 콜백"]
        Callback -->|인스턴스 획득| Setup["씬 및 뷰 설정"]
        Setup -->|루프 시작| Render["Renderer.start()"]
        
        %% 회색조 스타일 적용
        style Init fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
        style Callback fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Setup fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Render fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
`;return(r,s)=>{const t=a("MermaidResponsive"),l=a("ClientOnly");return h(),p("div",null,[s[0]||(s[0]=i("",6)),e(l,null,{default:d(()=>[e(t,{definition:n})]),_:1}),s[1]||(s[1]=i("",31))])}}});export{E as __pageData,g as default};
