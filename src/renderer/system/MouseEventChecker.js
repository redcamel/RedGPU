/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.7 16:13:31
 *
 */

"use strict";

import UUID from "../../base/UUID.js";


let fireEvent = function (fireList) {
  if (fireList.length) {
    // console.log(fireList)
    let v = fireList.shift();
    v['info'][v['type']].call(v['info']['target'], {
      target: v['info']['target'],
      type: 'out'
    });
  }

};
export default class MouseEventChecker extends UUID {

  static mouseMAP = {};
  #currentPickedArrayBuffer;
  #currentPickedMouseID;
  #fireList = [];
  #redView;
  #prevInfo;

  constructor(redView) {
    super();
    this.#redView = redView;
  };

  #_mouseEventInfo = [];

  get mouseEventInfo() {
    return this.#_mouseEventInfo;
  }

  checkMouseEvent = function (redGPUContext, pickedMouseID) {

    let i, len;
    i = 0;
    len = this.#_mouseEventInfo.length;
    // console.log(this.#mouseEventInfo.length,this.#mouseEventInfo)
    for (i; i < len; i++) {
      let canvasMouseEvent = this.#_mouseEventInfo[i];
      // 마우스 이벤트 체크
      let meshEventData;
      if (pickedMouseID) meshEventData = MouseEventChecker.mouseMAP[pickedMouseID];
      let tEventType;
      if (meshEventData) {
        if (canvasMouseEvent['type'] == redGPUContext.detector.down) {
          tEventType = 'down';
          console.log('다운', tEventType, meshEventData);
          if (tEventType && meshEventData[tEventType]) {
            meshEventData[tEventType].call(meshEventData['target'], {
              target: meshEventData['target'],
              type: tEventType,
              nativeEvent: canvasMouseEvent.nativeEvent
            });
          }
        }
        if (canvasMouseEvent['type'] == redGPUContext.detector.up) {
          tEventType = 'up';
          // console.log('업');
          if (tEventType && meshEventData[tEventType]) {
            meshEventData[tEventType].call(meshEventData['target'], {
              target: meshEventData['target'],
              type: tEventType,
              nativeEvent: canvasMouseEvent.nativeEvent
            });
          }
        }
        if (this.#prevInfo && this.#prevInfo != meshEventData) {
          tEventType = 'out';
          // console.log('아웃');
          if (tEventType && this.#prevInfo[tEventType]) {
            this.#prevInfo[tEventType].call(this.#prevInfo['target'], {
              target: this.#prevInfo['target'],
              type: tEventType
            });
          }
        }
        if (this.#prevInfo != meshEventData) {
          tEventType = 'over';
          if (tEventType && meshEventData[tEventType]) {
            meshEventData[tEventType].call(meshEventData['target'], {
              target: meshEventData['target'],
              type: tEventType,
              nativeEvent: canvasMouseEvent.nativeEvent
            });
          }
          // console.log('오버')
        }
        this.#prevInfo = meshEventData;
      } else {
        tEventType = 'out';
        if (this.#prevInfo && this.#prevInfo[tEventType]) {
          // console.log('아웃');
          this.#fireList.push(
            {
              info: this.#prevInfo,
              type: tEventType,
              nativeEvent: canvasMouseEvent.nativeEvent
            }
          );
        }
        this.#prevInfo = null;
      }
      fireEvent(this.#fireList);
    }
    if (this.#prevInfo) this.cursorState = 'pointer';
    else this.cursorState = 'default';
    this.#_mouseEventInfo.length = 0;
    // console.log(this.#mouseEventInfo)

  };

  check = (redGPUContext) => {
    if (!this.#currentPickedArrayBuffer) {
      this.#currentPickedArrayBuffer = this.#redView.readPixelArrayBuffer(redGPUContext, this.#redView, this.#redView.baseAttachment_mouseColorID_depth_ResolveTarget, this.#redView.mouseX, this.#redView.mouseY);


      this.#currentPickedArrayBuffer.then(arrayBuffer => {

        const {
          Float16Array
        } = float16;
        this.#currentPickedArrayBuffer = null;
        this.#currentPickedMouseID = Math.round(new Float16Array(arrayBuffer || new ArrayBuffer(256))[0]);
        console.log(this.#currentPickedMouseID)
        this.checkMouseEvent(redGPUContext, this.#currentPickedMouseID);
      });
    }
    return this.cursorState;
  };
}
/**
 * Minified by jsDelivr using Terser v5.10.0.
 * Original file: /npm/@petamoriken/float16@3.6.3/browser/float16.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/*! @petamoriken/float16 v3.6.3 | MIT License - https://git.io/float16 */
const float16=function(t){"use strict";const n="This constructor is not a subclass of Float16Array",r="The constructor property value is not an object",e="Attempting to access detached ArrayBuffer",o="Cannot convert undefined or null to object",i="Cannot convert a BigInt value to a number",s="Cannot mix BigInt and other types, use explicit conversions",u="@@iterator property is not callable",f="Reduce of empty array with no initial value",c="Offset is out of bounds";function l(t){return(n,...r)=>a(t,n,r)}function h(t,n){return l(g(t,n).get)}const{apply:a,construct:y,defineProperty:w,get:p,getOwnPropertyDescriptor:g,getPrototypeOf:d,has:v,ownKeys:b,set:A,setPrototypeOf:_}=Reflect,E=Proxy,T=Number,{isFinite:m,isNaN:O}=T,{iterator:S,species:j,toStringTag:x,for:P}=Symbol,F=Object,{create:B,defineProperty:I,freeze:L,is:M}=F,R=F.prototype,k=R.__lookupGetter__?l(R.__lookupGetter__):(t,n)=>{if(null==t)throw Pt(o);let r=F(t);do{const t=g(r,n);if(void 0!==t)return N(t,"get")?t.get:void 0}while(null!==(r=d(r)))},N=F.hasOwn||l(R.hasOwnProperty),U=Array,D=U.isArray,W=U.prototype,C=l(W.join),G=l(W.push),V=l(W.toLocaleString),Y=W[S],z=l(Y),K=Math.trunc,X=ArrayBuffer,q=X.isView,H=X.prototype,J=l(H.slice),Q=h(H,"byteLength"),Z="undefined"!=typeof SharedArrayBuffer?SharedArrayBuffer:null,$=Z&&h(Z.prototype,"byteLength"),tt=d(Uint8Array),nt=tt.from,rt=tt.prototype,et=rt[S],ot=l(rt.keys),it=l(rt.values),st=l(rt.entries),ut=l(rt.set),ft=l(rt.reverse),ct=l(rt.fill),lt=l(rt.copyWithin),ht=l(rt.sort),at=l(rt.slice),yt=l(rt.subarray),wt=h(rt,"buffer"),pt=h(rt,"byteOffset"),gt=h(rt,"length"),dt=h(rt,x),vt=Uint16Array,bt=(...t)=>a(nt,vt,t),At=Uint32Array,_t=Float32Array,Et=d([][S]()),Tt=l(Et.next),mt=l(function*(){}().next),Ot=d(Et),St=DataView.prototype,jt=l(St.getUint16),xt=l(St.setUint16),Pt=TypeError,Ft=RangeError,Bt=WeakSet,It=Bt.prototype,Lt=l(It.add),Mt=l(It.has),Rt=WeakMap,kt=Rt.prototype,Nt=l(kt.get),Ut=l(kt.has),Dt=l(kt.set),Wt=new Rt,Ct=B(null,{next:{value:function(){const t=Nt(Wt,this);return Tt(t)}},[S]:{value:function(){return this}}});function Gt(t){if(t[S]===Y)return t;const n=B(Ct);return Dt(Wt,n,z(t)),n}const Vt=new Rt,Yt=B(Ot,{next:{value:function(){const t=Nt(Vt,this);return mt(t)},writable:!0,configurable:!0}});for(const t of b(Et))"next"!==t&&I(Yt,t,g(Et,t));function zt(t){const n=B(Yt);return Dt(Vt,n,t),n}function Kt(t){return null!==t&&"object"==typeof t||"function"==typeof t}function Xt(t){return null!==t&&"object"==typeof t}function qt(t){return void 0!==dt(t)}function Ht(t){const n=dt(t);return"BigInt64Array"===n||"BigUint64Array"===n}function Jt(t){if(null===Z)return!1;try{return $(t),!0}catch(t){return!1}}function Qt(t){if(!D(t))return!1;if(t[S]===Y)return!0;return"Array Iterator"===t[S]()[x]}function Zt(t){if("string"!=typeof t)return!1;const n=T(t);return t===n+""&&(!!m(n)&&n===K(n))}const $t=P("__Float16Array__");const tn=new X(4),nn=new _t(tn),rn=new At(tn),en=new At(512),on=new At(512);for(let t=0;t<256;++t){const n=t-127;n<-27?(en[t]=0,en[256|t]=32768,on[t]=24,on[256|t]=24):n<-14?(en[t]=1024>>-n-14,en[256|t]=1024>>-n-14|32768,on[t]=-n-1,on[256|t]=-n-1):n<=15?(en[t]=n+15<<10,en[256|t]=n+15<<10|32768,on[t]=13,on[256|t]=13):n<128?(en[t]=31744,en[256|t]=64512,on[t]=24,on[256|t]=24):(en[t]=31744,en[256|t]=64512,on[t]=13,on[256|t]=13)}function sn(t){nn[0]=t;const n=rn[0],r=n>>23&511;return en[r]+((8388607&n)>>on[r])}const un=new At(2048),fn=new At(64),cn=new At(64);for(let t=1;t<1024;++t){let n=t<<13,r=0;for(;0==(8388608&n);)n<<=1,r-=8388608;n&=-8388609,r+=947912704,un[t]=n|r}for(let t=1024;t<2048;++t)un[t]=939524096+(t-1024<<13);for(let t=1;t<31;++t)fn[t]=t<<23;fn[31]=1199570944,fn[32]=2147483648;for(let t=33;t<63;++t)fn[t]=2147483648+(t-32<<23);fn[63]=3347054592;for(let t=1;t<64;++t)32!==t&&(cn[t]=1024);function ln(t){const n=t>>10;return rn[0]=un[cn[n]+(1023&t)]+fn[n],nn[0]}const hn=T.MAX_SAFE_INTEGER;function an(t){if("bigint"==typeof t)throw Pt(i);const n=T(t);return O(n)||0===n?0:K(n)}function yn(t){const n=an(t);return n<0?0:n<hn?n:hn}function wn(t,n){if(!Kt(t))throw Pt("This is not an object");const e=t.constructor;if(void 0===e)return n;if(!Kt(e))throw Pt(r);const o=e[j];return null==o?n:o}function pn(t){if(Jt(t))return!1;try{return J(t,0,0),!1}catch(t){}return!0}function gn(t,n){const r=O(t),e=O(n);if(r&&e)return 0;if(r)return 1;if(e)return-1;if(t<n)return-1;if(t>n)return 1;if(0===t&&0===n){const r=M(t,0),e=M(n,0);if(!r&&e)return-1;if(r&&!e)return 1}return 0}const dn=new Rt;function vn(t){return Ut(dn,t)||!q(t)&&function(t){if(!Xt(t))return!1;const n=d(t);if(!Xt(n))return!1;const e=n.constructor;if(void 0===e)return!1;if(!Kt(e))throw Pt(r);return v(e,$t)}(t)}function bn(t){if(!vn(t))throw Pt("This is not a Float16Array object")}function An(t,n){const r=vn(t),e=qt(t);if(!r&&!e)throw Pt("Species constructor didn't return TypedArray object");if("number"==typeof n){let e;if(r){const n=_n(t);e=gt(n)}else e=gt(t);if(e<n)throw Pt("Derived constructor created TypedArray object which was too small length")}if(Ht(t))throw Pt(s)}function _n(t){const n=Nt(dn,t);if(void 0!==n){if(pn(wt(n)))throw Pt(e);return n}const r=t.buffer;if(pn(r))throw Pt(e);const o=y(On,[r,t.byteOffset,t.length],t.constructor);return Nt(dn,o)}function En(t){const n=gt(t),r=[];for(let e=0;e<n;++e)r[e]=ln(t[e]);return r}const Tn=new Bt;for(const t of b(rt)){if(t===x)continue;const n=g(rt,t);N(n,"get")&&"function"==typeof n.get&&Lt(Tn,n.get)}const mn=L({get:(t,n,r)=>Zt(n)&&N(t,n)?ln(p(t,n)):Mt(Tn,k(t,n))?p(t,n):p(t,n,r),set:(t,n,r,e)=>Zt(n)&&N(t,n)?A(t,n,sn(r)):A(t,n,r,e),getOwnPropertyDescriptor(t,n){if(Zt(n)&&N(t,n)){const r=g(t,n);return r.value=ln(r.value),r}return g(t,n)},defineProperty:(t,n,r)=>Zt(n)&&N(t,n)&&N(r,"value")?(r.value=sn(r.value),w(t,n,r)):w(t,n,r)});class On{constructor(t,n,r){let o;if(vn(t))o=y(vt,[_n(t)],new.target);else if(Kt(t)&&!function(t){try{return Q(t),!0}catch(t){return!1}}(t)){let n,r;if(qt(t)){n=t,r=gt(t);const i=wt(t),u=Jt(i)?X:wn(i,X);if(pn(i))throw Pt(e);if(Ht(t))throw Pt(s);const f=new u(2*r);o=y(vt,[f],new.target)}else{const e=t[S];if(null!=e&&"function"!=typeof e)throw Pt(u);null!=e?Qt(t)?(n=t,r=t.length):(n=[...t],r=n.length):(n=t,r=yn(n.length)),o=y(vt,[r],new.target)}for(let t=0;t<r;++t)o[t]=sn(n[t])}else o=y(vt,arguments,new.target);const i=new E(o,mn);return Dt(dn,i,o),i}static from(t,...r){const e=this;if(!v(e,$t))throw Pt(n);if(e===On){if(vn(t)&&0===r.length){const n=_n(t),r=new vt(wt(n),pt(n),gt(n));return new On(wt(at(r)))}if(0===r.length)return new On(wt(bt(t,sn)));const n=r[0],e=r[1];return new On(wt(bt(t,(function(t,...r){return sn(a(n,this,[t,...Gt(r)]))}),e)))}let i,s;const f=t[S];if(null!=f&&"function"!=typeof f)throw Pt(u);if(null!=f)Qt(t)?(i=t,s=t.length):!qt(c=t)||c[S]!==et&&"Array Iterator"!==c[S]()[x]?(i=[...t],s=i.length):(i=t,s=gt(t));else{if(null==t)throw Pt(o);i=F(t),s=yn(i.length)}var c;const l=new e(s);if(0===r.length)for(let t=0;t<s;++t)l[t]=i[t];else{const t=r[0],n=r[1];for(let r=0;r<s;++r)l[r]=a(t,n,[i[r],r])}return l}static of(...t){const r=this;if(!v(r,$t))throw Pt(n);const e=t.length;if(r===On){const n=new On(e),r=_n(n);for(let n=0;n<e;++n)r[n]=sn(t[n]);return n}const o=new r(e);for(let n=0;n<e;++n)o[n]=t[n];return o}keys(){bn(this);const t=_n(this);return ot(t)}values(){bn(this);const t=_n(this);return zt(function*(){for(const n of it(t))yield ln(n)}())}entries(){bn(this);const t=_n(this);return zt(function*(){for(const[n,r]of st(t))yield[n,ln(r)]}())}at(t){bn(this);const n=_n(this),r=gt(n),e=an(t),o=e>=0?e:r+e;if(!(o<0||o>=r))return ln(n[o])}map(t,...n){bn(this);const r=_n(this),e=gt(r),o=n[0],i=wn(r,On);if(i===On){const n=new On(e),i=_n(n);for(let n=0;n<e;++n){const e=ln(r[n]);i[n]=sn(a(t,o,[e,n,this]))}return n}const s=new i(e);An(s,e);for(let n=0;n<e;++n){const e=ln(r[n]);s[n]=a(t,o,[e,n,this])}return s}filter(t,...n){bn(this);const r=_n(this),e=gt(r),o=n[0],i=[];for(let n=0;n<e;++n){const e=ln(r[n]);a(t,o,[e,n,this])&&G(i,e)}const s=new(wn(r,On))(i);return An(s),s}reduce(t,...n){bn(this);const r=_n(this),e=gt(r);if(0===e&&0===n.length)throw Pt(f);let o,i;0===n.length?(o=ln(r[0]),i=1):(o=n[0],i=0);for(let n=i;n<e;++n)o=t(o,ln(r[n]),n,this);return o}reduceRight(t,...n){bn(this);const r=_n(this),e=gt(r);if(0===e&&0===n.length)throw Pt(f);let o,i;0===n.length?(o=ln(r[e-1]),i=e-2):(o=n[0],i=e-1);for(let n=i;n>=0;--n)o=t(o,ln(r[n]),n,this);return o}forEach(t,...n){bn(this);const r=_n(this),e=gt(r),o=n[0];for(let n=0;n<e;++n)a(t,o,[ln(r[n]),n,this])}find(t,...n){bn(this);const r=_n(this),e=gt(r),o=n[0];for(let n=0;n<e;++n){const e=ln(r[n]);if(a(t,o,[e,n,this]))return e}}findIndex(t,...n){bn(this);const r=_n(this),e=gt(r),o=n[0];for(let n=0;n<e;++n){const e=ln(r[n]);if(a(t,o,[e,n,this]))return n}return-1}findLast(t,...n){bn(this);const r=_n(this),e=gt(r),o=n[0];for(let n=e-1;n>=0;--n){const e=ln(r[n]);if(a(t,o,[e,n,this]))return e}}findLastIndex(t,...n){bn(this);const r=_n(this),e=gt(r),o=n[0];for(let n=e-1;n>=0;--n){const e=ln(r[n]);if(a(t,o,[e,n,this]))return n}return-1}every(t,...n){bn(this);const r=_n(this),e=gt(r),o=n[0];for(let n=0;n<e;++n)if(!a(t,o,[ln(r[n]),n,this]))return!1;return!0}some(t,...n){bn(this);const r=_n(this),e=gt(r),o=n[0];for(let n=0;n<e;++n)if(a(t,o,[ln(r[n]),n,this]))return!0;return!1}set(t,...n){bn(this);const r=_n(this),i=an(n[0]);if(i<0)throw Ft(c);if(null==t)throw Pt(o);if(Ht(t))throw Pt(s);if(vn(t))return ut(_n(this),_n(t),i);if(qt(t)){if(pn(wt(t)))throw Pt(e)}const u=gt(r),f=F(t),l=yn(f.length);if(i===1/0||l+i>u)throw Ft(c);for(let t=0;t<l;++t)r[t+i]=sn(f[t])}reverse(){bn(this);const t=_n(this);return ft(t),this}fill(t,...n){bn(this);const r=_n(this);return ct(r,sn(t),...Gt(n)),this}copyWithin(t,n,...r){bn(this);const e=_n(this);return lt(e,t,n,...Gt(r)),this}sort(...t){bn(this);const n=_n(this),r=void 0!==t[0]?t[0]:gn;return ht(n,((t,n)=>r(ln(t),ln(n)))),this}slice(...t){bn(this);const n=_n(this),r=wn(n,On);if(r===On){const r=new vt(wt(n),pt(n),gt(n));return new On(wt(at(r,...Gt(t))))}const o=gt(n),i=an(t[0]),s=void 0===t[1]?o:an(t[1]);let u,f;u=i===-1/0?0:i<0?o+i>0?o+i:0:o<i?o:i,f=s===-1/0?0:s<0?o+s>0?o+s:0:o<s?o:s;const c=f-u>0?f-u:0,l=new r(c);if(An(l,c),0===c)return l;if(pn(wt(n)))throw Pt(e);let h=0;for(;u<f;)l[h]=ln(n[u]),++u,++h;return l}subarray(...t){bn(this);const n=_n(this),r=wn(n,On),e=new vt(wt(n),pt(n),gt(n)),o=yt(e,...Gt(t)),i=new r(wt(o),pt(o),gt(o));return An(i),i}indexOf(t,...n){bn(this);const r=_n(this),e=gt(r);let o=an(n[0]);if(o===1/0)return-1;o<0&&(o+=e,o<0&&(o=0));for(let n=o;n<e;++n)if(N(r,n)&&ln(r[n])===t)return n;return-1}lastIndexOf(t,...n){bn(this);const r=_n(this),e=gt(r);let o=n.length>=1?an(n[0]):e-1;if(o===-1/0)return-1;o>=0?o=o<e-1?o:e-1:o+=e;for(let n=o;n>=0;--n)if(N(r,n)&&ln(r[n])===t)return n;return-1}includes(t,...n){bn(this);const r=_n(this),e=gt(r);let o=an(n[0]);if(o===1/0)return!1;o<0&&(o+=e,o<0&&(o=0));const i=O(t);for(let n=o;n<e;++n){const e=ln(r[n]);if(i&&O(e))return!0;if(e===t)return!0}return!1}join(...t){bn(this);const n=En(_n(this));return C(n,...Gt(t))}toLocaleString(...t){bn(this);const n=En(_n(this));return V(n,...Gt(t))}get[x](){if(vn(this))return"Float16Array"}}I(On,"BYTES_PER_ELEMENT",{value:2}),I(On,$t,{}),_(On,tt);const Sn=On.prototype;return I(Sn,"BYTES_PER_ELEMENT",{value:2}),I(Sn,S,{value:Sn.values,writable:!0,configurable:!0}),_(Sn,rt),t.Float16Array=On,t.getFloat16=function(t,n,...r){return ln(jt(t,n,...Gt(r)))},t.hfround=function(t){if("bigint"==typeof t)throw Pt(i);return t=T(t),m(t)&&0!==t?ln(sn(t)):t},t.isFloat16Array=vn,t.isTypedArray=function(t){return qt(t)||vn(t)},t.setFloat16=function(t,n,r,...e){return xt(t,n,sn(r),...Gt(e))},Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),t}({});
//# sourceMappingURL=/sm/7583f935ac4179ba3c2bca9c0a760fc49ecfa2222d35d983bd08c0939cb9c4eb.map