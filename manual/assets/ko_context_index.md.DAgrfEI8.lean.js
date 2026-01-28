import{D as i,o as h,c as p,a2 as a,G as t,w as k}from"./chunks/framework.Dn9yU8Jh.js";const g=JSON.parse('{"title":"RedGPU Context","description":"RedGPU 엔진의 시작점이자 리소스 관리자인 RedGPUContext에 대해 알아봅니다.","frontmatter":{"title":"RedGPU Context","description":"RedGPU 엔진의 시작점이자 리소스 관리자인 RedGPUContext에 대해 알아봅니다.","order":2},"headers":[],"relativePath":"ko/context/index.md","filePath":"ko/context/index.md","lastUpdated":1769586579000}'),d={name:"ko/context/index.md"},c=Object.assign(d,{setup(r){const n=`
    graph LR
        Init["RedGPU.init() 호출"] -->|비동기| Callback["onSuccess 콜백"]
        Callback -->|인스턴스 획득| Setup["씬 및 뷰 설정"]
        Setup -->|루프 시작| Render["Renderer.start()"]
        
        %% 커스텀 클래스 적용
        class Init,Render mermaid-system;
        class Callback mermaid-main;
`;return(o,s)=>{const e=i("MermaidResponsive"),l=i("ClientOnly");return h(),p("div",null,[s[0]||(s[0]=a("",7)),t(l,null,{default:k(()=>[t(e,{definition:n})]),_:1}),s[1]||(s[1]=a("",19))])}}});export{g as __pageData,c as default};
