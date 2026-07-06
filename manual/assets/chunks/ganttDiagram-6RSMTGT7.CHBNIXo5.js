import{t as ve,Q as ge,M as pe,aE as Te,S as xe,aH as be,N as we,aF as De,a as l,P as ct,aC as pt,aM as _e,an as Se,ak as Ce,x as Me,ag as Ee,a9 as Ie,F as z,ai as it,d as Ye,aO as Ut,aT as Xt,aV as $e,aU as Fe,aP as Le,aW as Ae,aY as Oe,aX as We,aS as Pe,aN as jt,aQ as qt,aR as Zt,aB as Qt,am as Kt,e as Ve,s as Re,aA as Ne,m as ze,b2 as He}from"./theme.D38CmidC.js";import"./framework.D5MFXpji.js";var Ct="day",Be="week",Ge="year",Ue="YYYY-MM-DDTHH:mm:ssZ",Xe="isoweek";const je=(function(t,e,r){var i=function(_,M){var b=(M?r.utc:r)().year(_).startOf(Ge),$=4-b.isoWeekday();return b.isoWeekday()>4&&($+=7),b.add($,Ct)},n=function(_){return _.add(4-_.isoWeekday(),Ct)},o=e.prototype;o.isoWeekYear=function(){var v=n(this);return v.year()},o.isoWeek=function(v){if(!this.$utils().u(v))return this.add((v-this.isoWeek())*7,Ct);var _=n(this),M=i(this.isoWeekYear(),this.$u);return _.diff(M,Be)+1},o.isoWeekday=function(v){return this.$utils().u(v)?this.day()||7:this.day(this.day()%7?v:v-7)};var d=o.startOf;o.startOf=function(v,_){var M=this.$utils(),b=M.u(_)?!0:_,$=M.p(v);return $===Xe?b?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):d.bind(this)(v,_)}});var qe=function(e){return e.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,function(r,i,n){return i||n.slice(1)})},Ze={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},Qe=function(e,r){return e.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,function(i,n,o){var d=o&&o.toUpperCase();return n||r[o]||Ze[o]||qe(r[d])})},Ke=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,Jt=/\d/,ft=/\d\d/,Je=/\d{3}/,ts=/\d{4}/,Q=/\d\d?/,es=/[+-]?\d+/,ss=/[+-]\d\d:?(\d\d)?|Z/,ht=/\d*[^-_:/,()\s\d]+/,st={},ae=function(e){return e=+e,e+(e>68?1900:2e3)};function rs(t){if(!t||t==="Z")return 0;var e=t.match(/([+-]|\d\d)/g),r=+(e[1]*60)+(+e[2]||0);return r===0?0:e[0]==="+"?-r:r}var B=function(e){return function(r){this[e]=+r}},te=[ss,function(t){var e=this.zone||(this.zone={});e.offset=rs(t)}],Mt=function(e){var r=st[e];return r&&(r.indexOf?r:r.s.concat(r.f))},ee=function(e,r){var i,n=st,o=n.meridiem;if(!o)i=e===(r?"pm":"PM");else for(var d=1;d<=24;d+=1)if(e.indexOf(o(d,0,r))>-1){i=d>12;break}return i},is={A:[ht,function(t){this.afternoon=ee(t,!1)}],a:[ht,function(t){this.afternoon=ee(t,!0)}],Q:[Jt,function(t){this.month=(t-1)*3+1}],S:[Jt,function(t){this.milliseconds=+t*100}],SS:[ft,function(t){this.milliseconds=+t*10}],SSS:[Je,function(t){this.milliseconds=+t}],s:[Q,B("seconds")],ss:[Q,B("seconds")],m:[Q,B("minutes")],mm:[Q,B("minutes")],H:[Q,B("hours")],h:[Q,B("hours")],HH:[Q,B("hours")],hh:[Q,B("hours")],D:[Q,B("day")],DD:[ft,B("day")],Do:[ht,function(t){var e=st,r=e.ordinal,i=t.match(/\d+/);if(this.day=i[0],!!r)for(var n=1;n<=31;n+=1)r(n).replace(/\[|\]/g,"")===t&&(this.day=n)}],w:[Q,B("week")],ww:[ft,B("week")],M:[Q,B("month")],MM:[ft,B("month")],MMM:[ht,function(t){var e=Mt("months"),r=Mt("monthsShort"),i=(r||e.map(function(n){return n.slice(0,3)})).indexOf(t)+1;if(i<1)throw new Error;this.month=i%12||i}],MMMM:[ht,function(t){var e=Mt("months"),r=e.indexOf(t)+1;if(r<1)throw new Error;this.month=r%12||r}],Y:[es,B("year")],YY:[ft,function(t){this.year=ae(t)}],YYYY:[ts,B("year")],Z:te,ZZ:te};function as(t){var e=t.afternoon;if(e!==void 0){var r=t.hours;e?r<12&&(t.hours+=12):r===12&&(t.hours=0),delete t.afternoon}}function ns(t){t=Qe(t,st&&st.formats);for(var e=t.match(Ke),r=e.length,i=0;i<r;i+=1){var n=e[i],o=is[n],d=o&&o[0],v=o&&o[1];v?e[i]={regex:d,parser:v}:e[i]=n.replace(/^\[|\]$/g,"")}return function(_){for(var M={},b=0,$=0;b<r;b+=1){var O=e[b];if(typeof O=="string")$+=O.length;else{var L=O.regex,A=O.parser,S=_.slice($),R=L.exec(S),P=R[0];A.call(M,P),_=_.replace(P,"")}}return as(M),M}}var os=function(e,r,i,n){try{if(["x","X"].indexOf(r)>-1)return new Date((r==="X"?1e3:1)*e);var o=ns(r),d=o(e),v=d.year,_=d.month,M=d.day,b=d.hours,$=d.minutes,O=d.seconds,L=d.milliseconds,A=d.zone,S=d.week,R=new Date,P=M||(!v&&!_?R.getDate():1),Z=v||R.getFullYear(),N=0;v&&!_||(N=_>0?_-1:R.getMonth());var U=b||0,j=$||0,E=O||0,g=L||0;if(A)return new Date(Date.UTC(Z,N,P,U,j,E,g+A.offset*60*1e3));if(i)return new Date(Date.UTC(Z,N,P,U,j,E,g));var h;return h=new Date(Z,N,P,U,j,E,g),S&&(h=n(h).week(S).toDate()),h}catch{return new Date("")}};const cs=(function(t,e,r){r.p.customParseFormat=!0,t&&t.parseTwoDigitYear&&(ae=t.parseTwoDigitYear);var i=e.prototype,n=i.parse;i.parse=function(o){var d=o.date,v=o.utc,_=o.args;this.$u=v;var M=_[1];if(typeof M=="string"){var b=_[2]===!0,$=_[3]===!0,O=b||$,L=_[2];$&&(L=_[2]),st=this.$locale(),!b&&L&&(st=r.Ls[L]),this.$d=os(d,M,v,r),this.init(),L&&L!==!0&&(this.$L=this.locale(L).$L),O&&d!=this.format(M)&&(this.$d=new Date("")),st={}}else if(M instanceof Array)for(var A=M.length,S=1;S<=A;S+=1){_[1]=M[S-1];var R=r.apply(this,_);if(R.isValid()){this.$d=R.$d,this.$L=R.$L,this.init();break}S===A&&(this.$d=new Date(""))}else n.call(this,o)}}),ls=(function(t,e){var r=e.prototype,i=r.format;r.format=function(n){var o=this,d=this.$locale();if(!this.isValid())return i.bind(this)(n);var v=this.$utils(),_=n||Ue,M=_.replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,function(b){switch(b){case"Q":return Math.ceil((o.$M+1)/3);case"Do":return d.ordinal(o.$D);case"gggg":return o.weekYear();case"GGGG":return o.isoWeekYear();case"wo":return d.ordinal(o.week(),"W");case"w":case"ww":return v.s(o.week(),b==="w"?1:2,"0");case"W":case"WW":return v.s(o.isoWeek(),b==="W"?1:2,"0");case"k":case"kk":return v.s(String(o.$H===0?24:o.$H),b==="k"?1:2,"0");case"X":return Math.floor(o.$d.getTime()/1e3);case"x":return o.$d.getTime();case"z":return"["+o.offsetName()+"]";case"zzz":return"["+o.offsetName("long")+"]";default:return b}});return i.bind(this)(M)}});var ne={exports:{}};(function(t,e){(function(r,i){t.exports=i()})(ve,(function(){var r,i,n=1e3,o=6e4,d=36e5,v=864e5,_=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M=31536e6,b=2628e6,$=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,O={years:M,months:b,days:v,hours:d,minutes:o,seconds:n,milliseconds:1,weeks:6048e5},L=function(E){return E instanceof U},A=function(E,g,h){return new U(E,h,g.$l)},S=function(E){return i.p(E)+"s"},R=function(E){return E<0},P=function(E){return R(E)?Math.ceil(E):Math.floor(E)},Z=function(E){return Math.abs(E)},N=function(E,g){return E?R(E)?{negative:!0,format:""+Z(E)+g}:{negative:!1,format:""+E+g}:{negative:!1,format:""}},U=(function(){function E(h,f,p){var T=this;if(this.$d={},this.$l=p,h===void 0&&(this.$ms=0,this.parseFromMilliseconds()),f)return A(h*O[S(f)],this);if(typeof h=="number")return this.$ms=h,this.parseFromMilliseconds(),this;if(typeof h=="object")return Object.keys(h).forEach((function(c){T.$d[S(c)]=h[c]})),this.calMilliseconds(),this;if(typeof h=="string"){var x=h.match($);if(x){var y=x.slice(2).map((function(c){return c!=null?Number(c):0}));return this.$d.years=y[0],this.$d.months=y[1],this.$d.weeks=y[2],this.$d.days=y[3],this.$d.hours=y[4],this.$d.minutes=y[5],this.$d.seconds=y[6],this.calMilliseconds(),this}}return this}var g=E.prototype;return g.calMilliseconds=function(){var h=this;this.$ms=Object.keys(this.$d).reduce((function(f,p){return f+(h.$d[p]||0)*O[p]}),0)},g.parseFromMilliseconds=function(){var h=this.$ms;this.$d.years=P(h/M),h%=M,this.$d.months=P(h/b),h%=b,this.$d.days=P(h/v),h%=v,this.$d.hours=P(h/d),h%=d,this.$d.minutes=P(h/o),h%=o,this.$d.seconds=P(h/n),h%=n,this.$d.milliseconds=h},g.toISOString=function(){var h=N(this.$d.years,"Y"),f=N(this.$d.months,"M"),p=+this.$d.days||0;this.$d.weeks&&(p+=7*this.$d.weeks);var T=N(p,"D"),x=N(this.$d.hours,"H"),y=N(this.$d.minutes,"M"),c=this.$d.seconds||0;this.$d.milliseconds&&(c+=this.$d.milliseconds/1e3,c=Math.round(1e3*c)/1e3);var u=N(c,"S"),k=h.negative||f.negative||T.negative||x.negative||y.negative||u.negative,m=x.format||y.format||u.format?"T":"",w=(k?"-":"")+"P"+h.format+f.format+T.format+m+x.format+y.format+u.format;return w==="P"||w==="-P"?"P0D":w},g.toJSON=function(){return this.toISOString()},g.format=function(h){var f=h||"YYYY-MM-DDTHH:mm:ss",p={Y:this.$d.years,YY:i.s(this.$d.years,2,"0"),YYYY:i.s(this.$d.years,4,"0"),M:this.$d.months,MM:i.s(this.$d.months,2,"0"),D:this.$d.days,DD:i.s(this.$d.days,2,"0"),H:this.$d.hours,HH:i.s(this.$d.hours,2,"0"),m:this.$d.minutes,mm:i.s(this.$d.minutes,2,"0"),s:this.$d.seconds,ss:i.s(this.$d.seconds,2,"0"),SSS:i.s(this.$d.milliseconds,3,"0")};return f.replace(_,(function(T,x){return x||String(p[T])}))},g.as=function(h){return this.$ms/O[S(h)]},g.get=function(h){var f=this.$ms,p=S(h);return p==="milliseconds"?f%=1e3:f=p==="weeks"?P(f/O[p]):this.$d[p],f||0},g.add=function(h,f,p){var T;return T=f?h*O[S(f)]:L(h)?h.$ms:A(h,this).$ms,A(this.$ms+T*(p?-1:1),this)},g.subtract=function(h,f){return this.add(h,f,!0)},g.locale=function(h){var f=this.clone();return f.$l=h,f},g.clone=function(){return A(this.$ms,this)},g.humanize=function(h){return r().add(this.$ms,"ms").locale(this.$l).fromNow(!h)},g.valueOf=function(){return this.asMilliseconds()},g.milliseconds=function(){return this.get("milliseconds")},g.asMilliseconds=function(){return this.as("milliseconds")},g.seconds=function(){return this.get("seconds")},g.asSeconds=function(){return this.as("seconds")},g.minutes=function(){return this.get("minutes")},g.asMinutes=function(){return this.as("minutes")},g.hours=function(){return this.get("hours")},g.asHours=function(){return this.as("hours")},g.days=function(){return this.get("days")},g.asDays=function(){return this.as("days")},g.weeks=function(){return this.get("weeks")},g.asWeeks=function(){return this.as("weeks")},g.months=function(){return this.get("months")},g.asMonths=function(){return this.as("months")},g.years=function(){return this.get("years")},g.asYears=function(){return this.as("years")},E})(),j=function(E,g,h){return E.add(g.years()*h,"y").add(g.months()*h,"M").add(g.days()*h,"d").add(g.hours()*h,"h").add(g.minutes()*h,"m").add(g.seconds()*h,"s").add(g.milliseconds()*h,"ms")};return function(E,g,h){r=h,i=h().$utils(),h.duration=function(T,x){var y=h.locale();return A(T,{$l:y},x)},h.isDuration=L;var f=g.prototype.add,p=g.prototype.subtract;g.prototype.add=function(T,x){return L(T)?j(this,T,1):f.bind(this)(T,x)},g.prototype.subtract=function(T,x){return L(T)?j(this,T,-1):p.bind(this)(T,x)}}}))})(ne);var us=ne.exports;const ds=ge(us);var It=(function(){var t=l(function(y,c,u,k){for(u=u||{},k=y.length;k--;u[y[k]]=c);return u},"o"),e=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],r=[1,26],i=[1,27],n=[1,28],o=[1,29],d=[1,30],v=[1,31],_=[1,32],M=[1,33],b=[1,34],$=[1,9],O=[1,10],L=[1,11],A=[1,12],S=[1,13],R=[1,14],P=[1,15],Z=[1,16],N=[1,19],U=[1,20],j=[1,21],E=[1,22],g=[1,23],h=[1,25],f=[1,35],p={trace:l(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:l(function(c,u,k,m,w,a,W){var s=a.length-1;switch(w){case 1:return a[s-1];case 2:this.$=[];break;case 3:a[s-1].push(a[s]),this.$=a[s-1];break;case 4:case 5:this.$=a[s];break;case 6:case 7:this.$=[];break;case 8:m.setWeekday("monday");break;case 9:m.setWeekday("tuesday");break;case 10:m.setWeekday("wednesday");break;case 11:m.setWeekday("thursday");break;case 12:m.setWeekday("friday");break;case 13:m.setWeekday("saturday");break;case 14:m.setWeekday("sunday");break;case 15:m.setWeekend("friday");break;case 16:m.setWeekend("saturday");break;case 17:m.setDateFormat(a[s].substr(11)),this.$=a[s].substr(11);break;case 18:m.enableInclusiveEndDates(),this.$=a[s].substr(18);break;case 19:m.TopAxis(),this.$=a[s].substr(8);break;case 20:m.setAxisFormat(a[s].substr(11)),this.$=a[s].substr(11);break;case 21:m.setTickInterval(a[s].substr(13)),this.$=a[s].substr(13);break;case 22:m.setExcludes(a[s].substr(9)),this.$=a[s].substr(9);break;case 23:m.setIncludes(a[s].substr(9)),this.$=a[s].substr(9);break;case 24:m.setTodayMarker(a[s].substr(12)),this.$=a[s].substr(12);break;case 27:m.setDiagramTitle(a[s].substr(6)),this.$=a[s].substr(6);break;case 28:this.$=a[s].trim(),m.setAccTitle(this.$);break;case 29:case 30:this.$=a[s].trim(),m.setAccDescription(this.$);break;case 31:m.addSection(a[s].substr(8)),this.$=a[s].substr(8);break;case 33:m.addTask(a[s-1],a[s]),this.$="task";break;case 34:this.$=a[s-1],m.setClickEvent(a[s-1],a[s],null);break;case 35:this.$=a[s-2],m.setClickEvent(a[s-2],a[s-1],a[s]);break;case 36:this.$=a[s-2],m.setClickEvent(a[s-2],a[s-1],null),m.setLink(a[s-2],a[s]);break;case 37:this.$=a[s-3],m.setClickEvent(a[s-3],a[s-2],a[s-1]),m.setLink(a[s-3],a[s]);break;case 38:this.$=a[s-2],m.setClickEvent(a[s-2],a[s],null),m.setLink(a[s-2],a[s-1]);break;case 39:this.$=a[s-3],m.setClickEvent(a[s-3],a[s-1],a[s]),m.setLink(a[s-3],a[s-2]);break;case 40:this.$=a[s-1],m.setLink(a[s-1],a[s]);break;case 41:case 47:this.$=a[s-1]+" "+a[s];break;case 42:case 43:case 45:this.$=a[s-2]+" "+a[s-1]+" "+a[s];break;case 44:case 46:this.$=a[s-3]+" "+a[s-2]+" "+a[s-1]+" "+a[s];break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:r,13:i,14:n,15:o,16:d,17:v,18:_,19:18,20:M,21:b,22:$,23:O,24:L,25:A,26:S,27:R,28:P,29:Z,30:N,31:U,33:j,35:E,36:g,37:24,38:h,40:f},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:36,11:17,12:r,13:i,14:n,15:o,16:d,17:v,18:_,19:18,20:M,21:b,22:$,23:O,24:L,25:A,26:S,27:R,28:P,29:Z,30:N,31:U,33:j,35:E,36:g,37:24,38:h,40:f},t(e,[2,5]),t(e,[2,6]),t(e,[2,17]),t(e,[2,18]),t(e,[2,19]),t(e,[2,20]),t(e,[2,21]),t(e,[2,22]),t(e,[2,23]),t(e,[2,24]),t(e,[2,25]),t(e,[2,26]),t(e,[2,27]),{32:[1,37]},{34:[1,38]},t(e,[2,30]),t(e,[2,31]),t(e,[2,32]),{39:[1,39]},t(e,[2,8]),t(e,[2,9]),t(e,[2,10]),t(e,[2,11]),t(e,[2,12]),t(e,[2,13]),t(e,[2,14]),t(e,[2,15]),t(e,[2,16]),{41:[1,40],43:[1,41]},t(e,[2,4]),t(e,[2,28]),t(e,[2,29]),t(e,[2,33]),t(e,[2,34],{42:[1,42],43:[1,43]}),t(e,[2,40],{41:[1,44]}),t(e,[2,35],{43:[1,45]}),t(e,[2,36]),t(e,[2,38],{42:[1,46]}),t(e,[2,37]),t(e,[2,39])],defaultActions:{},parseError:l(function(c,u){if(u.recoverable)this.trace(c);else{var k=new Error(c);throw k.hash=u,k}},"parseError"),parse:l(function(c){var u=this,k=[0],m=[],w=[null],a=[],W=this.table,s="",D=0,F=0,Y=2,I=1,H=a.slice.call(arguments,1),C=Object.create(this.lexer),J={yy:{}};for(var dt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,dt)&&(J.yy[dt]=this.yy[dt]);C.setInput(c,J.yy),J.yy.lexer=C,J.yy.parser=this,typeof C.yylloc>"u"&&(C.yylloc={});var Dt=C.yylloc;a.push(Dt);var ke=C.options&&C.options.ranges;typeof J.yy.parseError=="function"?this.parseError=J.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function ye(X){k.length=k.length-2*X,w.length=w.length-X,a.length=a.length-X}l(ye,"popStack");function Bt(){var X;return X=m.pop()||C.lex()||I,typeof X!="number"&&(X instanceof Array&&(m=X,X=m.pop()),X=u.symbols_[X]||X),X}l(Bt,"lex");for(var G,rt,q,_t,nt={},vt,tt,Gt,gt;;){if(rt=k[k.length-1],this.defaultActions[rt]?q=this.defaultActions[rt]:((G===null||typeof G>"u")&&(G=Bt()),q=W[rt]&&W[rt][G]),typeof q>"u"||!q.length||!q[0]){var St="";gt=[];for(vt in W[rt])this.terminals_[vt]&&vt>Y&&gt.push("'"+this.terminals_[vt]+"'");C.showPosition?St="Parse error on line "+(D+1)+`:
`+C.showPosition()+`
Expecting `+gt.join(", ")+", got '"+(this.terminals_[G]||G)+"'":St="Parse error on line "+(D+1)+": Unexpected "+(G==I?"end of input":"'"+(this.terminals_[G]||G)+"'"),this.parseError(St,{text:C.match,token:this.terminals_[G]||G,line:C.yylineno,loc:Dt,expected:gt})}if(q[0]instanceof Array&&q.length>1)throw new Error("Parse Error: multiple actions possible at state: "+rt+", token: "+G);switch(q[0]){case 1:k.push(G),w.push(C.yytext),a.push(C.yylloc),k.push(q[1]),G=null,F=C.yyleng,s=C.yytext,D=C.yylineno,Dt=C.yylloc;break;case 2:if(tt=this.productions_[q[1]][1],nt.$=w[w.length-tt],nt._$={first_line:a[a.length-(tt||1)].first_line,last_line:a[a.length-1].last_line,first_column:a[a.length-(tt||1)].first_column,last_column:a[a.length-1].last_column},ke&&(nt._$.range=[a[a.length-(tt||1)].range[0],a[a.length-1].range[1]]),_t=this.performAction.apply(nt,[s,F,D,J.yy,q[1],w,a].concat(H)),typeof _t<"u")return _t;tt&&(k=k.slice(0,-1*tt*2),w=w.slice(0,-1*tt),a=a.slice(0,-1*tt)),k.push(this.productions_[q[1]][0]),w.push(nt.$),a.push(nt._$),Gt=W[k[k.length-2]][k[k.length-1]],k.push(Gt);break;case 3:return!0}}return!0},"parse")},T=(function(){var y={EOF:1,parseError:l(function(u,k){if(this.yy.parser)this.yy.parser.parseError(u,k);else throw new Error(u)},"parseError"),setInput:l(function(c,u){return this.yy=u||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:l(function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var u=c.match(/(?:\r\n?|\n).*/g);return u?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},"input"),unput:l(function(c){var u=c.length,k=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-u),this.offset-=u;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),k.length-1&&(this.yylineno-=k.length-1);var w=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:k?(k.length===m.length?this.yylloc.first_column:0)+m[m.length-k.length].length-k[0].length:this.yylloc.first_column-u},this.options.ranges&&(this.yylloc.range=[w[0],w[0]+this.yyleng-u]),this.yyleng=this.yytext.length,this},"unput"),more:l(function(){return this._more=!0,this},"more"),reject:l(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:l(function(c){this.unput(this.match.slice(c))},"less"),pastInput:l(function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:l(function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:l(function(){var c=this.pastInput(),u=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+u+"^"},"showPosition"),test_match:l(function(c,u){var k,m,w;if(this.options.backtrack_lexer&&(w={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(w.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],k=this.performAction.call(this,this.yy,this,u,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),k)return k;if(this._backtrack){for(var a in w)this[a]=w[a];return!1}return!1},"test_match"),next:l(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,u,k,m;this._more||(this.yytext="",this.match="");for(var w=this._currentRules(),a=0;a<w.length;a++)if(k=this._input.match(this.rules[w[a]]),k&&(!u||k[0].length>u[0].length)){if(u=k,m=a,this.options.backtrack_lexer){if(c=this.test_match(k,w[a]),c!==!1)return c;if(this._backtrack){u=!1;continue}else return!1}else if(!this.options.flex)break}return u?(c=this.test_match(u,w[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:l(function(){var u=this.next();return u||this.lex()},"lex"),begin:l(function(u){this.conditionStack.push(u)},"begin"),popState:l(function(){var u=this.conditionStack.length-1;return u>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:l(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:l(function(u){return u=this.conditionStack.length-1-Math.abs(u||0),u>=0?this.conditionStack[u]:"INITIAL"},"topState"),pushState:l(function(u){this.begin(u)},"pushState"),stateStackSize:l(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:l(function(u,k,m,w){switch(m){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 43;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 21:this.popState();break;case 22:return 42;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}};return y})();p.lexer=T;function x(){this.yy={}}return l(x,"Parser"),x.prototype=p,p.Parser=x,new x})();It.parser=It;var fs=It;z.extend(je);z.extend(cs);z.extend(ls);var se={friday:5,saturday:6},K="",Lt="",At=void 0,Ot="",mt=[],kt=[],Wt=new Map,Pt=[],bt=[],ut="",Vt="",oe=["active","done","crit","milestone","vert"],Rt=[],ot="",yt=!1,Nt=!1,zt="sunday",wt="saturday",Yt=0,hs=l(function(){Pt=[],bt=[],ut="",Rt=[],Tt=0,Ft=void 0,xt=void 0,V=[],K="",Lt="",Vt="",At=void 0,Ot="",mt=[],kt=[],yt=!1,Nt=!1,Yt=0,Wt=new Map,ot="",ze(),zt="sunday",wt="saturday"},"clear"),ms=l(function(t){ot=t},"setDiagramId"),ks=l(function(t){Lt=t},"setAxisFormat"),ys=l(function(){return Lt},"getAxisFormat"),vs=l(function(t){At=t},"setTickInterval"),gs=l(function(){return At},"getTickInterval"),ps=l(function(t){Ot=t},"setTodayMarker"),Ts=l(function(){return Ot},"getTodayMarker"),xs=l(function(t){K=t},"setDateFormat"),bs=l(function(){yt=!0},"enableInclusiveEndDates"),ws=l(function(){return yt},"endDatesAreInclusive"),Ds=l(function(){Nt=!0},"enableTopAxis"),_s=l(function(){return Nt},"topAxisEnabled"),Ss=l(function(t){Vt=t},"setDisplayMode"),Cs=l(function(){return Vt},"getDisplayMode"),Ms=l(function(){return K},"getDateFormat"),Es=l(function(t){mt=t.toLowerCase().split(/[\s,]+/)},"setIncludes"),Is=l(function(){return mt},"getIncludes"),Ys=l(function(t){kt=t.toLowerCase().split(/[\s,]+/)},"setExcludes"),$s=l(function(){return kt},"getExcludes"),Fs=l(function(){return Wt},"getLinks"),Ls=l(function(t){ut=t,Pt.push(t)},"addSection"),As=l(function(){return Pt},"getSections"),Os=l(function(){let t=re();const e=10;let r=0;for(;!t&&r<e;)t=re(),r++;return bt=V,bt},"getTasks"),ce=l(function(t,e,r,i){const n=t.format(e.trim()),o=t.format("YYYY-MM-DD");return i.includes(n)||i.includes(o)?!1:r.includes("weekends")&&(t.isoWeekday()===se[wt]||t.isoWeekday()===se[wt]+1)||r.includes(t.format("dddd").toLowerCase())?!0:r.includes(n)||r.includes(o)},"isInvalidDate"),Ws=l(function(t){zt=t},"setWeekday"),Ps=l(function(){return zt},"getWeekday"),Vs=l(function(t){wt=t},"setWeekend"),le=l(function(t,e,r,i){if(!r.length||t.manualEndTime)return;let n;t.startTime instanceof Date?n=z(t.startTime):n=z(t.startTime,e,!0),n=n.add(1,"d");let o;t.endTime instanceof Date?o=z(t.endTime):o=z(t.endTime,e,!0);const[d,v]=Rs(n,o,e,r,i);t.endTime=d.toDate(),t.renderEndTime=v},"checkTaskDates"),Rs=l(function(t,e,r,i,n){let o=!1,d=null;const v=e.add(1e4,"d");for(;t<=e;){if(o||(d=e.toDate()),o=ce(t,r,i,n),o&&(e=e.add(1,"d"),e>v))throw new Error("Failed to find a valid date that was not excluded by `excludes` after 10,000 iterations.");t=t.add(1,"d")}return[e,d]},"fixTaskDates"),$t=l(function(t,e,r){if(r=r.trim(),l(v=>{const _=v.trim();return _==="x"||_==="X"},"isTimestampFormat")(e)&&/^\d+$/.test(r))return new Date(Number(r));const o=/^after\s+(?<ids>[\d\w- ]+)/.exec(r);if(o!==null){let v=null;for(const M of o.groups.ids.split(" ")){let b=at(M);b!==void 0&&(!v||b.endTime>v.endTime)&&(v=b)}if(v)return v.endTime;const _=new Date;return _.setHours(0,0,0,0),_}let d=z(r,e.trim(),!0);if(d.isValid())return d.toDate();{it.debug("Invalid date:"+r),it.debug("With date format:"+e.trim());const v=new Date(r);if(v===void 0||isNaN(v.getTime())||v.getFullYear()<-1e4||v.getFullYear()>1e4)throw new Error("Invalid date:"+r);return v}},"getStartDate"),ue=l(function(t){const e=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return e!==null?[Number.parseFloat(e[1]),e[2]]:[NaN,"ms"]},"parseDuration"),de=l(function(t,e,r,i=!1){r=r.trim();const o=/^until\s+(?<ids>[\d\w- ]+)/.exec(r);if(o!==null){let b=null;for(const O of o.groups.ids.split(" ")){let L=at(O);L!==void 0&&(!b||L.startTime<b.startTime)&&(b=L)}if(b)return b.startTime;const $=new Date;return $.setHours(0,0,0,0),$}let d=z(r,e.trim(),!0);if(d.isValid())return i&&(d=d.add(1,"d")),d.toDate();let v=z(t);const[_,M]=ue(r);if(!Number.isNaN(_)){const b=v.add(_,M);b.isValid()&&(v=b)}return v.toDate()},"getEndDate"),Tt=0,lt=l(function(t){return t===void 0?(Tt=Tt+1,"task"+Tt):t},"parseId"),Ns=l(function(t,e){let r;e.substr(0,1)===":"?r=e.substr(1,e.length):r=e;const i=r.split(","),n={};Ht(i,n,oe);for(let d=0;d<i.length;d++)i[d]=i[d].trim();let o="";switch(i.length){case 1:n.id=lt(),n.startTime=t.endTime,o=i[0];break;case 2:n.id=lt(),n.startTime=$t(void 0,K,i[0]),o=i[1];break;case 3:n.id=lt(i[0]),n.startTime=$t(void 0,K,i[1]),o=i[2];break}return o&&(n.endTime=de(n.startTime,K,o,yt),n.manualEndTime=z(o,"YYYY-MM-DD",!0).isValid(),le(n,K,kt,mt)),n},"compileData"),zs=l(function(t,e){let r;e.substr(0,1)===":"?r=e.substr(1,e.length):r=e;const i=r.split(","),n={};Ht(i,n,oe);for(let o=0;o<i.length;o++)i[o]=i[o].trim();switch(i.length){case 1:n.id=lt(),n.startTime={type:"prevTaskEnd",id:t},n.endTime={data:i[0]};break;case 2:n.id=lt(),n.startTime={type:"getStartDate",startData:i[0]},n.endTime={data:i[1]};break;case 3:n.id=lt(i[0]),n.startTime={type:"getStartDate",startData:i[1]},n.endTime={data:i[2]};break}return n},"parseData"),Ft,xt,V=[],fe={},Hs=l(function(t,e){const r={section:ut,type:ut,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:e},task:t,classes:[]},i=zs(xt,e);r.raw.startTime=i.startTime,r.raw.endTime=i.endTime,r.id=i.id,r.prevTaskId=xt,r.active=i.active,r.done=i.done,r.crit=i.crit,r.milestone=i.milestone,r.vert=i.vert,r.order=Yt,Yt++;const n=V.push(r);xt=r.id,fe[r.id]=n-1},"addTask"),at=l(function(t){const e=fe[t];return V[e]},"findTaskById"),Bs=l(function(t,e){const r={section:ut,type:ut,description:t,task:t,classes:[]},i=Ns(Ft,e);r.startTime=i.startTime,r.endTime=i.endTime,r.id=i.id,r.active=i.active,r.done=i.done,r.crit=i.crit,r.milestone=i.milestone,r.vert=i.vert,Ft=r,bt.push(r)},"addTaskOrg"),re=l(function(){const t=l(function(r){const i=V[r];let n="";switch(V[r].raw.startTime.type){case"prevTaskEnd":{const o=at(i.prevTaskId);i.startTime=o.endTime;break}case"getStartDate":n=$t(void 0,K,V[r].raw.startTime.startData),n&&(V[r].startTime=n);break}return V[r].startTime&&(V[r].endTime=de(V[r].startTime,K,V[r].raw.endTime.data,yt),V[r].endTime&&(V[r].processed=!0,V[r].manualEndTime=z(V[r].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),le(V[r],K,kt,mt))),V[r].processed},"compileTask");let e=!0;for(const[r,i]of V.entries())t(r),e=e&&i.processed;return e},"compileTasks"),Gs=l(function(t,e){let r=e;ct().securityLevel!=="loose"&&(r=Ne(e)),t.split(",").forEach(function(i){at(i)!==void 0&&(me(i,()=>{window.open(r,"_self")}),Wt.set(i,r))}),he(t,"clickable")},"setLink"),he=l(function(t,e){t.split(",").forEach(function(r){let i=at(r);i!==void 0&&i.classes.push(e)})},"setClass"),Us=l(function(t,e,r){if(ct().securityLevel!=="loose"||e===void 0)return;let i=[];if(typeof r=="string"){i=r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let o=0;o<i.length;o++){let d=i[o].trim();d.startsWith('"')&&d.endsWith('"')&&(d=d.substr(1,d.length-2)),i[o]=d}}i.length===0&&i.push(t),at(t)!==void 0&&me(t,()=>{He.runFunc(e,...i)})},"setClickFun"),me=l(function(t,e){Rt.push(function(){const r=ot?`${ot}-${t}`:t,i=document.querySelector(`[id="${r}"]`);i!==null&&i.addEventListener("click",function(){e()})},function(){const r=ot?`${ot}-${t}`:t,i=document.querySelector(`[id="${r}-text"]`);i!==null&&i.addEventListener("click",function(){e()})})},"pushFun"),Xs=l(function(t,e,r){t.split(",").forEach(function(i){Us(i,e,r)}),he(t,"clickable")},"setClickEvent"),js=l(function(t){Rt.forEach(function(e){e(t)})},"bindFunctions"),qs={getConfig:l(()=>ct().gantt,"getConfig"),clear:hs,setDateFormat:xs,getDateFormat:Ms,enableInclusiveEndDates:bs,endDatesAreInclusive:ws,enableTopAxis:Ds,topAxisEnabled:_s,setAxisFormat:ks,getAxisFormat:ys,setTickInterval:vs,getTickInterval:gs,setTodayMarker:ps,getTodayMarker:Ts,setAccTitle:De,getAccTitle:we,setDiagramTitle:be,getDiagramTitle:xe,setDiagramId:ms,setDisplayMode:Ss,getDisplayMode:Cs,setAccDescription:Te,getAccDescription:pe,addSection:Ls,getSections:As,getTasks:Os,addTask:Hs,findTaskById:at,addTaskOrg:Bs,setIncludes:Es,getIncludes:Is,setExcludes:Ys,getExcludes:$s,setClickEvent:Xs,setLink:Gs,getLinks:Fs,bindFunctions:js,parseDuration:ue,isInvalidDate:ce,setWeekday:Ws,getWeekday:Ps,setWeekend:Vs};function Ht(t,e,r){let i=!0;for(;i;)i=!1,r.forEach(function(n){const o="^\\s*"+n+"\\s*$",d=new RegExp(o);t[0].match(d)&&(e[n]=!0,t.shift(1),i=!0)})}l(Ht,"getTaskTags");z.extend(ds);var Zs=l(function(){it.debug("Something is calling, setConf, remove the call")},"setConf"),ie={monday:Pe,tuesday:We,wednesday:Oe,thursday:Ae,friday:Le,saturday:Fe,sunday:$e},Qs=l((t,e)=>{let r=[...t].map(()=>-1/0),i=[...t].sort((o,d)=>o.startTime-d.startTime||o.order-d.order),n=0;for(const o of i)for(let d=0;d<r.length;d++)if(o.startTime>=r[d]){r[d]=o.endTime,o.order=d+e,d>n&&(n=d);break}return n},"getMaxIntersections"),et,Et=1e4,Ks=l(function(t,e,r,i){const n=ct().gantt;i.db.setDiagramId(e);const o=ct().securityLevel;let d;o==="sandbox"&&(d=pt("#i"+e));const v=o==="sandbox"?pt(d.nodes()[0].contentDocument.body):pt("body"),_=o==="sandbox"?d.nodes()[0].contentDocument:document,M=_.getElementById(e);et=M.parentElement.offsetWidth,et===void 0&&(et=1200),n.useWidth!==void 0&&(et=n.useWidth);const b=i.db.getTasks();let $=[];for(const f of b)$.push(f.type);$=h($);const O={};let L=2*n.topPadding;if(i.db.getDisplayMode()==="compact"||n.displayMode==="compact"){const f={};for(const T of b)f[T.section]===void 0?f[T.section]=[T]:f[T.section].push(T);let p=0;for(const T of Object.keys(f)){const x=Qs(f[T],p)+1;p+=x,L+=x*(n.barHeight+n.barGap),O[T]=x}}else{L+=b.length*(n.barHeight+n.barGap);for(const f of $)O[f]=b.filter(p=>p.type===f).length}M.setAttribute("viewBox","0 0 "+et+" "+L);const A=v.select(`[id="${e}"]`),S=_e().domain([Se(b,function(f){return f.startTime}),Ce(b,function(f){return f.endTime})]).rangeRound([0,et-n.leftPadding-n.rightPadding]);function R(f,p){const T=f.startTime,x=p.startTime;let y=0;return T>x?y=1:T<x&&(y=-1),y}l(R,"taskCompare"),b.sort(R),P(b,et,L),Me(A,L,et,n.useMaxWidth),A.append("text").text(i.db.getDiagramTitle()).attr("x",et/2).attr("y",n.titleTopMargin).attr("class","titleText");function P(f,p,T){const x=n.barHeight,y=x+n.barGap,c=n.topPadding,u=n.leftPadding,k=Ee().domain([0,$.length]).range(["#00B9FA","#F95002"]).interpolate(Ie);N(y,c,u,p,T,f,i.db.getExcludes(),i.db.getIncludes()),j(u,c,p,T),Z(f,y,c,u,x,k,p),E(y,c),g(u,c,p,T)}l(P,"makeGantt");function Z(f,p,T,x,y,c,u){f.sort((s,D)=>s.vert===D.vert?0:s.vert?1:-1);const m=[...new Set(f.map(s=>s.order))].map(s=>f.find(D=>D.order===s));A.append("g").selectAll("rect").data(m).enter().append("rect").attr("x",0).attr("y",function(s,D){return D=s.order,D*p+T-2}).attr("width",function(){return u-n.rightPadding/2}).attr("height",p).attr("class",function(s){for(const[D,F]of $.entries())if(s.type===F)return"section section"+D%n.numberSectionStyles;return"section section0"}).enter();const w=A.append("g").selectAll("rect").data(f).enter(),a=i.db.getLinks();if(w.append("rect").attr("id",function(s){return e+"-"+s.id}).attr("rx",3).attr("ry",3).attr("x",function(s){return s.milestone?S(s.startTime)+x+.5*(S(s.endTime)-S(s.startTime))-.5*y:S(s.startTime)+x}).attr("y",function(s,D){return D=s.order,s.vert?n.gridLineStartPadding:D*p+T}).attr("width",function(s){return s.milestone?y:s.vert?.08*y:S(s.renderEndTime||s.endTime)-S(s.startTime)}).attr("height",function(s){return s.vert?b.length*(n.barHeight+n.barGap)+n.barHeight*2:y}).attr("transform-origin",function(s,D){return D=s.order,(S(s.startTime)+x+.5*(S(s.endTime)-S(s.startTime))).toString()+"px "+(D*p+T+.5*y).toString()+"px"}).attr("class",function(s){const D="task";let F="";s.classes.length>0&&(F=s.classes.join(" "));let Y=0;for(const[H,C]of $.entries())s.type===C&&(Y=H%n.numberSectionStyles);let I="";return s.active?s.crit?I+=" activeCrit":I=" active":s.done?s.crit?I=" doneCrit":I=" done":s.crit&&(I+=" crit"),I.length===0&&(I=" task"),s.milestone&&(I=" milestone "+I),s.vert&&(I=" vert "+I),I+=Y,I+=" "+F,D+I}),w.append("text").attr("id",function(s){return e+"-"+s.id+"-text"}).text(function(s){return s.task}).attr("font-size",n.fontSize).attr("x",function(s){let D=S(s.startTime),F=S(s.renderEndTime||s.endTime);if(s.milestone&&(D+=.5*(S(s.endTime)-S(s.startTime))-.5*y,F=D+y),s.vert)return S(s.startTime)+x;const Y=this.getBBox().width;return Y>F-D?F+Y+1.5*n.leftPadding>u?D+x-5:F+x+5:(F-D)/2+D+x}).attr("y",function(s,D){return s.vert?n.gridLineStartPadding+b.length*(n.barHeight+n.barGap)+60:(D=s.order,D*p+n.barHeight/2+(n.fontSize/2-2)+T)}).attr("text-height",y).attr("class",function(s){const D=S(s.startTime);let F=S(s.endTime);s.milestone&&(F=D+y);const Y=this.getBBox().width;let I="";s.classes.length>0&&(I=s.classes.join(" "));let H=0;for(const[J,dt]of $.entries())s.type===dt&&(H=J%n.numberSectionStyles);let C="";return s.active&&(s.crit?C="activeCritText"+H:C="activeText"+H),s.done?s.crit?C=C+" doneCritText"+H:C=C+" doneText"+H:s.crit&&(C=C+" critText"+H),s.milestone&&(C+=" milestoneText"),s.vert&&(C+=" vertText"),Y>F-D?F+Y+1.5*n.leftPadding>u?I+" taskTextOutsideLeft taskTextOutside"+H+" "+C:I+" taskTextOutsideRight taskTextOutside"+H+" "+C+" width-"+Y:I+" taskText taskText"+H+" "+C+" width-"+Y}),ct().securityLevel==="sandbox"){let s;s=pt("#i"+e);const D=s.nodes()[0].contentDocument;w.filter(function(F){return a.has(F.id)}).each(function(F){var Y=D.querySelector("#"+CSS.escape(e+"-"+F.id)),I=D.querySelector("#"+CSS.escape(e+"-"+F.id+"-text"));const H=Y.parentNode;var C=D.createElement("a");C.setAttribute("xlink:href",a.get(F.id)),C.setAttribute("target","_top"),H.appendChild(C),C.appendChild(Y),C.appendChild(I)})}}l(Z,"drawRects");function N(f,p,T,x,y,c,u,k){if(u.length===0&&k.length===0)return;let m,w;for(const{startTime:Y,endTime:I}of c)(m===void 0||Y<m)&&(m=Y),(w===void 0||I>w)&&(w=I);if(!m||!w)return;if(z(w).diff(z(m),"year")>5){it.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}const a=i.db.getDateFormat(),W=[];let s=null,D=z(m);for(;D.valueOf()<=w;)i.db.isInvalidDate(D,a,u,k)?s?s.end=D:s={start:D,end:D}:s&&(W.push(s),s=null),D=D.add(1,"d");A.append("g").selectAll("rect").data(W).enter().append("rect").attr("id",Y=>e+"-exclude-"+Y.start.format("YYYY-MM-DD")).attr("x",Y=>S(Y.start.startOf("day"))+T).attr("y",n.gridLineStartPadding).attr("width",Y=>S(Y.end.endOf("day"))-S(Y.start.startOf("day"))).attr("height",y-p-n.gridLineStartPadding).attr("transform-origin",function(Y,I){return(S(Y.start)+T+.5*(S(Y.end)-S(Y.start))).toString()+"px "+(I*f+.5*y).toString()+"px"}).attr("class","exclude-range")}l(N,"drawExcludeDays");function U(f,p,T,x){if(T<=0||f>p)return 1/0;const y=p-f,c=z.duration({[x??"day"]:T}).asMilliseconds();return c<=0?1/0:Math.ceil(y/c)}l(U,"getEstimatedTickCount");function j(f,p,T,x){const y=i.db.getDateFormat(),c=i.db.getAxisFormat();let u;c?u=c:y==="D"?u="%d":u=n.axisFormat??"%Y-%m-%d";let k=Ye(S).tickSize(-x+p+n.gridLineStartPadding).tickFormat(Ut(u));const w=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(i.db.getTickInterval()||n.tickInterval);if(w!==null){const a=parseInt(w[1],10);if(isNaN(a)||a<=0)it.warn(`Invalid tick interval value: "${w[1]}". Skipping custom tick interval.`);else{const W=w[2],s=i.db.getWeekday()||n.weekday,D=S.domain(),F=D[0],Y=D[1],I=U(F,Y,a,W);if(I>Et)it.warn(`The tick interval "${a}${W}" would generate ${I} ticks, which exceeds the maximum allowed (${Et}). This may indicate an invalid date or time range. Skipping custom tick interval.`);else switch(W){case"millisecond":k.ticks(Kt.every(a));break;case"second":k.ticks(Qt.every(a));break;case"minute":k.ticks(Zt.every(a));break;case"hour":k.ticks(qt.every(a));break;case"day":k.ticks(jt.every(a));break;case"week":k.ticks(ie[s].every(a));break;case"month":k.ticks(Xt.every(a));break}}}if(A.append("g").attr("class","grid").attr("transform","translate("+f+", "+(x-50)+")").call(k).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),i.db.topAxisEnabled()||n.topAxis){let a=Ve(S).tickSize(-x+p+n.gridLineStartPadding).tickFormat(Ut(u));if(w!==null){const W=parseInt(w[1],10);if(isNaN(W)||W<=0)it.warn(`Invalid tick interval value: "${w[1]}". Skipping custom tick interval.`);else{const s=w[2],D=i.db.getWeekday()||n.weekday,F=S.domain(),Y=F[0],I=F[1];if(U(Y,I,W,s)<=Et)switch(s){case"millisecond":a.ticks(Kt.every(W));break;case"second":a.ticks(Qt.every(W));break;case"minute":a.ticks(Zt.every(W));break;case"hour":a.ticks(qt.every(W));break;case"day":a.ticks(jt.every(W));break;case"week":a.ticks(ie[D].every(W));break;case"month":a.ticks(Xt.every(W));break}}}A.append("g").attr("class","grid").attr("transform","translate("+f+", "+p+")").call(a).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}l(j,"makeGrid");function E(f,p){let T=0;const x=Object.keys(O).map(y=>[y,O[y]]);A.append("g").selectAll("text").data(x).enter().append(function(y){const c=y[0].split(Re.lineBreakRegex),u=-(c.length-1)/2,k=_.createElementNS("http://www.w3.org/2000/svg","text");k.setAttribute("dy",u+"em");for(const[m,w]of c.entries()){const a=_.createElementNS("http://www.w3.org/2000/svg","tspan");a.setAttribute("alignment-baseline","central"),a.setAttribute("x","10"),m>0&&a.setAttribute("dy","1em"),a.textContent=w,k.appendChild(a)}return k}).attr("x",10).attr("y",function(y,c){if(c>0)for(let u=0;u<c;u++)return T+=x[c-1][1],y[1]*f/2+T*f+p;else return y[1]*f/2+p}).attr("font-size",n.sectionFontSize).attr("class",function(y){for(const[c,u]of $.entries())if(y[0]===u)return"sectionTitle sectionTitle"+c%n.numberSectionStyles;return"sectionTitle"})}l(E,"vertLabels");function g(f,p,T,x){const y=i.db.getTodayMarker();if(y==="off")return;const c=A.append("g").attr("class","today"),u=new Date,k=c.append("line");k.attr("x1",S(u)+f).attr("x2",S(u)+f).attr("y1",n.titleTopMargin).attr("y2",x-n.titleTopMargin).attr("class","today"),y!==""&&k.attr("style",y.replace(/,/g,";"))}l(g,"drawToday");function h(f){const p={},T=[];for(let x=0,y=f.length;x<y;++x)Object.prototype.hasOwnProperty.call(p,f[x])||(p[f[x]]=!0,T.push(f[x]));return T}l(h,"checkUnique")},"draw"),Js={setConf:Zs,draw:Ks},tr=l(t=>`
  .mermaid-main-font {
        font-family: ${t.fontFamily};
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: ${t.fontFamily};
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  /* Done task text displayed outside the bar sits against the diagram background,
     not against the done-task bar, so it must use the outside/contrast color. */
  .doneText0.taskTextOutsideLeft,
  .doneText0.taskTextOutsideRight,
  .doneText1.taskTextOutsideLeft,
  .doneText1.taskTextOutsideRight,
  .doneText2.taskTextOutsideLeft,
  .doneText2.taskTextOutsideRight,
  .doneText3.taskTextOutsideLeft,
  .doneText3.taskTextOutsideRight {
    fill: ${t.taskTextOutsideColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  /* Done-crit task text outside the bar — same reasoning as doneText above. */
  .doneCritText0.taskTextOutsideLeft,
  .doneCritText0.taskTextOutsideRight,
  .doneCritText1.taskTextOutsideLeft,
  .doneCritText1.taskTextOutsideRight,
  .doneCritText2.taskTextOutsideLeft,
  .doneCritText2.taskTextOutsideRight,
  .doneCritText3.taskTextOutsideLeft,
  .doneCritText3.taskTextOutsideRight {
    fill: ${t.taskTextOutsideColor} !important;
  }

  .vert {
    stroke: ${t.vertLineColor};
  }

  .vertText {
    font-size: 15px;
    text-anchor: middle;
    fill: ${t.vertLineColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: ${t.fontFamily};
  }
`,"getStyles"),er=tr,ir={parser:fs,db:qs,renderer:Js,styles:er};export{ir as diagram};
