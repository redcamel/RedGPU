import{aB as ye,aC as ve,g as ge,s as pe,t as Te,q as xe,a as be,b as we,_ as l,c as ot,d as gt,aG as _e,aH as De,aI as Se,e as Me,Q as Ce,aJ as Ee,aK as R,l as it,aL as Ie,aM as Gt,aN as jt,aO as Ye,aP as Ae,aQ as Fe,aR as $e,aS as Le,aT as We,aU as Oe,aV as Ut,aW as Xt,aX as qt,aY as Zt,aZ as Qt,a_ as Pe,k as Ve,j as ze,z as Ne,u as Re}from"./theme.DXoRS02K.js";import"./framework.Dn9yU8Jh.js";var St="day",He="week",Be="year",Ge="YYYY-MM-DDTHH:mm:ssZ",je="isoweek";const Ue=function(t,r,s){var i=function(D,C){var b=(C?s.utc:s)().year(D).startOf(Be),A=4-b.isoWeekday();return b.isoWeekday()>4&&(A+=7),b.add(A,St)},n=function(D){return D.add(4-D.isoWeekday(),St)},o=r.prototype;o.isoWeekYear=function(){var g=n(this);return g.year()},o.isoWeek=function(g){if(!this.$utils().u(g))return this.add((g-this.isoWeek())*7,St);var D=n(this),C=i(this.isoWeekYear(),this.$u);return D.diff(C,He)+1},o.isoWeekday=function(g){return this.$utils().u(g)?this.day()||7:this.day(this.day()%7?g:g-7)};var d=o.startOf;o.startOf=function(g,D){var C=this.$utils(),b=C.u(D)?!0:D,A=C.p(g);return A===je?b?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):d.bind(this)(g,D)}};var Xe=function(r){return r.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,function(s,i,n){return i||n.slice(1)})},qe={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},Ze=function(r,s){return r.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,function(i,n,o){var d=o&&o.toUpperCase();return n||s[o]||qe[o]||Xe(s[d])})},Qe=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,Kt=/\d/,dt=/\d\d/,Ke=/\d{3}/,Je=/\d{4}/,Q=/\d\d?/,ts=/[+-]?\d+/,es=/[+-]\d\d:?(\d\d)?|Z/,ft=/\d*[^-_:/,()\s\d]+/,st={},ie=function(r){return r=+r,r+(r>68?1900:2e3)};function ss(t){if(!t||t==="Z")return 0;var r=t.match(/([+-]|\d\d)/g),s=+(r[1]*60)+(+r[2]||0);return s===0?0:r[0]==="+"?-s:s}var B=function(r){return function(s){this[r]=+s}},Jt=[es,function(t){var r=this.zone||(this.zone={});r.offset=ss(t)}],Mt=function(r){var s=st[r];return s&&(s.indexOf?s:s.s.concat(s.f))},te=function(r,s){var i,n=st,o=n.meridiem;if(!o)i=r===(s?"pm":"PM");else for(var d=1;d<=24;d+=1)if(r.indexOf(o(d,0,s))>-1){i=d>12;break}return i},rs={A:[ft,function(t){this.afternoon=te(t,!1)}],a:[ft,function(t){this.afternoon=te(t,!0)}],Q:[Kt,function(t){this.month=(t-1)*3+1}],S:[Kt,function(t){this.milliseconds=+t*100}],SS:[dt,function(t){this.milliseconds=+t*10}],SSS:[Ke,function(t){this.milliseconds=+t}],s:[Q,B("seconds")],ss:[Q,B("seconds")],m:[Q,B("minutes")],mm:[Q,B("minutes")],H:[Q,B("hours")],h:[Q,B("hours")],HH:[Q,B("hours")],hh:[Q,B("hours")],D:[Q,B("day")],DD:[dt,B("day")],Do:[ft,function(t){var r=st,s=r.ordinal,i=t.match(/\d+/);if(this.day=i[0],!!s)for(var n=1;n<=31;n+=1)s(n).replace(/\[|\]/g,"")===t&&(this.day=n)}],w:[Q,B("week")],ww:[dt,B("week")],M:[Q,B("month")],MM:[dt,B("month")],MMM:[ft,function(t){var r=Mt("months"),s=Mt("monthsShort"),i=(s||r.map(function(n){return n.slice(0,3)})).indexOf(t)+1;if(i<1)throw new Error;this.month=i%12||i}],MMMM:[ft,function(t){var r=Mt("months"),s=r.indexOf(t)+1;if(s<1)throw new Error;this.month=s%12||s}],Y:[ts,B("year")],YY:[dt,function(t){this.year=ie(t)}],YYYY:[Je,B("year")],Z:Jt,ZZ:Jt};function is(t){var r=t.afternoon;if(r!==void 0){var s=t.hours;r?s<12&&(t.hours+=12):s===12&&(t.hours=0),delete t.afternoon}}function as(t){t=Ze(t,st&&st.formats);for(var r=t.match(Qe),s=r.length,i=0;i<s;i+=1){var n=r[i],o=rs[n],d=o&&o[0],g=o&&o[1];g?r[i]={regex:d,parser:g}:r[i]=n.replace(/^\[|\]$/g,"")}return function(D){for(var C={},b=0,A=0;b<s;b+=1){var W=r[b];if(typeof W=="string")A+=W.length;else{var $=W.regex,L=W.parser,S=D.slice(A),z=$.exec(S),P=z[0];L.call(C,P),D=D.replace(P,"")}}return is(C),C}}var ns=function(r,s,i,n){try{if(["x","X"].indexOf(s)>-1)return new Date((s==="X"?1e3:1)*r);var o=as(s),d=o(r),g=d.year,D=d.month,C=d.day,b=d.hours,A=d.minutes,W=d.seconds,$=d.milliseconds,L=d.zone,S=d.week,z=new Date,P=C||(!g&&!D?z.getDate():1),Z=g||z.getFullYear(),N=0;g&&!D||(N=D>0?D-1:z.getMonth());var j=b||0,X=A||0,E=W||0,v=$||0;if(L)return new Date(Date.UTC(Z,N,P,j,X,E,v+L.offset*60*1e3));if(i)return new Date(Date.UTC(Z,N,P,j,X,E,v));var h;return h=new Date(Z,N,P,j,X,E,v),S&&(h=n(h).week(S).toDate()),h}catch{return new Date("")}};const os=function(t,r,s){s.p.customParseFormat=!0,t&&t.parseTwoDigitYear&&(ie=t.parseTwoDigitYear);var i=r.prototype,n=i.parse;i.parse=function(o){var d=o.date,g=o.utc,D=o.args;this.$u=g;var C=D[1];if(typeof C=="string"){var b=D[2]===!0,A=D[3]===!0,W=b||A,$=D[2];A&&($=D[2]),st=this.$locale(),!b&&$&&(st=s.Ls[$]),this.$d=ns(d,C,g,s),this.init(),$&&$!==!0&&(this.$L=this.locale($).$L),W&&d!=this.format(C)&&(this.$d=new Date("")),st={}}else if(C instanceof Array)for(var L=C.length,S=1;S<=L;S+=1){D[1]=C[S-1];var z=s.apply(this,D);if(z.isValid()){this.$d=z.$d,this.$L=z.$L,this.init();break}S===L&&(this.$d=new Date(""))}else n.call(this,o)}},cs=function(t,r){var s=r.prototype,i=s.format;s.format=function(n){var o=this,d=this.$locale();if(!this.isValid())return i.bind(this)(n);var g=this.$utils(),D=n||Ge,C=D.replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,function(b){switch(b){case"Q":return Math.ceil((o.$M+1)/3);case"Do":return d.ordinal(o.$D);case"gggg":return o.weekYear();case"GGGG":return o.isoWeekYear();case"wo":return d.ordinal(o.week(),"W");case"w":case"ww":return g.s(o.week(),b==="w"?1:2,"0");case"W":case"WW":return g.s(o.isoWeek(),b==="W"?1:2,"0");case"k":case"kk":return g.s(String(o.$H===0?24:o.$H),b==="k"?1:2,"0");case"X":return Math.floor(o.$d.getTime()/1e3);case"x":return o.$d.getTime();case"z":return"["+o.offsetName()+"]";case"zzz":return"["+o.offsetName("long")+"]";default:return b}});return i.bind(this)(C)}};var ae={exports:{}};(function(t,r){(function(s,i){t.exports=i()})(ye,function(){var s,i,n=1e3,o=6e4,d=36e5,g=864e5,D=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,C=31536e6,b=2628e6,A=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,W={years:C,months:b,days:g,hours:d,minutes:o,seconds:n,milliseconds:1,weeks:6048e5},$=function(E){return E instanceof j},L=function(E,v,h){return new j(E,h,v.$l)},S=function(E){return i.p(E)+"s"},z=function(E){return E<0},P=function(E){return z(E)?Math.ceil(E):Math.floor(E)},Z=function(E){return Math.abs(E)},N=function(E,v){return E?z(E)?{negative:!0,format:""+Z(E)+v}:{negative:!1,format:""+E+v}:{negative:!1,format:""}},j=function(){function E(h,f,p){var T=this;if(this.$d={},this.$l=p,h===void 0&&(this.$ms=0,this.parseFromMilliseconds()),f)return L(h*W[S(f)],this);if(typeof h=="number")return this.$ms=h,this.parseFromMilliseconds(),this;if(typeof h=="object")return Object.keys(h).forEach(function(c){T.$d[S(c)]=h[c]}),this.calMilliseconds(),this;if(typeof h=="string"){var x=h.match(A);if(x){var y=x.slice(2).map(function(c){return c!=null?Number(c):0});return this.$d.years=y[0],this.$d.months=y[1],this.$d.weeks=y[2],this.$d.days=y[3],this.$d.hours=y[4],this.$d.minutes=y[5],this.$d.seconds=y[6],this.calMilliseconds(),this}}return this}var v=E.prototype;return v.calMilliseconds=function(){var h=this;this.$ms=Object.keys(this.$d).reduce(function(f,p){return f+(h.$d[p]||0)*W[p]},0)},v.parseFromMilliseconds=function(){var h=this.$ms;this.$d.years=P(h/C),h%=C,this.$d.months=P(h/b),h%=b,this.$d.days=P(h/g),h%=g,this.$d.hours=P(h/d),h%=d,this.$d.minutes=P(h/o),h%=o,this.$d.seconds=P(h/n),h%=n,this.$d.milliseconds=h},v.toISOString=function(){var h=N(this.$d.years,"Y"),f=N(this.$d.months,"M"),p=+this.$d.days||0;this.$d.weeks&&(p+=7*this.$d.weeks);var T=N(p,"D"),x=N(this.$d.hours,"H"),y=N(this.$d.minutes,"M"),c=this.$d.seconds||0;this.$d.milliseconds&&(c+=this.$d.milliseconds/1e3,c=Math.round(1e3*c)/1e3);var u=N(c,"S"),k=h.negative||f.negative||T.negative||x.negative||y.negative||u.negative,m=x.format||y.format||u.format?"T":"",w=(k?"-":"")+"P"+h.format+f.format+T.format+m+x.format+y.format+u.format;return w==="P"||w==="-P"?"P0D":w},v.toJSON=function(){return this.toISOString()},v.format=function(h){var f=h||"YYYY-MM-DDTHH:mm:ss",p={Y:this.$d.years,YY:i.s(this.$d.years,2,"0"),YYYY:i.s(this.$d.years,4,"0"),M:this.$d.months,MM:i.s(this.$d.months,2,"0"),D:this.$d.days,DD:i.s(this.$d.days,2,"0"),H:this.$d.hours,HH:i.s(this.$d.hours,2,"0"),m:this.$d.minutes,mm:i.s(this.$d.minutes,2,"0"),s:this.$d.seconds,ss:i.s(this.$d.seconds,2,"0"),SSS:i.s(this.$d.milliseconds,3,"0")};return f.replace(D,function(T,x){return x||String(p[T])})},v.as=function(h){return this.$ms/W[S(h)]},v.get=function(h){var f=this.$ms,p=S(h);return p==="milliseconds"?f%=1e3:f=p==="weeks"?P(f/W[p]):this.$d[p],f||0},v.add=function(h,f,p){var T;return T=f?h*W[S(f)]:$(h)?h.$ms:L(h,this).$ms,L(this.$ms+T*(p?-1:1),this)},v.subtract=function(h,f){return this.add(h,f,!0)},v.locale=function(h){var f=this.clone();return f.$l=h,f},v.clone=function(){return L(this.$ms,this)},v.humanize=function(h){return s().add(this.$ms,"ms").locale(this.$l).fromNow(!h)},v.valueOf=function(){return this.asMilliseconds()},v.milliseconds=function(){return this.get("milliseconds")},v.asMilliseconds=function(){return this.as("milliseconds")},v.seconds=function(){return this.get("seconds")},v.asSeconds=function(){return this.as("seconds")},v.minutes=function(){return this.get("minutes")},v.asMinutes=function(){return this.as("minutes")},v.hours=function(){return this.get("hours")},v.asHours=function(){return this.as("hours")},v.days=function(){return this.get("days")},v.asDays=function(){return this.as("days")},v.weeks=function(){return this.get("weeks")},v.asWeeks=function(){return this.as("weeks")},v.months=function(){return this.get("months")},v.asMonths=function(){return this.as("months")},v.years=function(){return this.get("years")},v.asYears=function(){return this.as("years")},E}(),X=function(E,v,h){return E.add(v.years()*h,"y").add(v.months()*h,"M").add(v.days()*h,"d").add(v.hours()*h,"h").add(v.minutes()*h,"m").add(v.seconds()*h,"s").add(v.milliseconds()*h,"ms")};return function(E,v,h){s=h,i=h().$utils(),h.duration=function(T,x){var y=h.locale();return L(T,{$l:y},x)},h.isDuration=$;var f=v.prototype.add,p=v.prototype.subtract;v.prototype.add=function(T,x){return $(T)?X(this,T,1):f.bind(this)(T,x)},v.prototype.subtract=function(T,x){return $(T)?X(this,T,-1):p.bind(this)(T,x)}}})})(ae);var ls=ae.exports;const us=ve(ls);var Et=function(){var t=l(function(y,c,u,k){for(u=u||{},k=y.length;k--;u[y[k]]=c);return u},"o"),r=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],s=[1,26],i=[1,27],n=[1,28],o=[1,29],d=[1,30],g=[1,31],D=[1,32],C=[1,33],b=[1,34],A=[1,9],W=[1,10],$=[1,11],L=[1,12],S=[1,13],z=[1,14],P=[1,15],Z=[1,16],N=[1,19],j=[1,20],X=[1,21],E=[1,22],v=[1,23],h=[1,25],f=[1,35],p={trace:l(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:l(function(c,u,k,m,w,a,O){var e=a.length-1;switch(w){case 1:return a[e-1];case 2:this.$=[];break;case 3:a[e-1].push(a[e]),this.$=a[e-1];break;case 4:case 5:this.$=a[e];break;case 6:case 7:this.$=[];break;case 8:m.setWeekday("monday");break;case 9:m.setWeekday("tuesday");break;case 10:m.setWeekday("wednesday");break;case 11:m.setWeekday("thursday");break;case 12:m.setWeekday("friday");break;case 13:m.setWeekday("saturday");break;case 14:m.setWeekday("sunday");break;case 15:m.setWeekend("friday");break;case 16:m.setWeekend("saturday");break;case 17:m.setDateFormat(a[e].substr(11)),this.$=a[e].substr(11);break;case 18:m.enableInclusiveEndDates(),this.$=a[e].substr(18);break;case 19:m.TopAxis(),this.$=a[e].substr(8);break;case 20:m.setAxisFormat(a[e].substr(11)),this.$=a[e].substr(11);break;case 21:m.setTickInterval(a[e].substr(13)),this.$=a[e].substr(13);break;case 22:m.setExcludes(a[e].substr(9)),this.$=a[e].substr(9);break;case 23:m.setIncludes(a[e].substr(9)),this.$=a[e].substr(9);break;case 24:m.setTodayMarker(a[e].substr(12)),this.$=a[e].substr(12);break;case 27:m.setDiagramTitle(a[e].substr(6)),this.$=a[e].substr(6);break;case 28:this.$=a[e].trim(),m.setAccTitle(this.$);break;case 29:case 30:this.$=a[e].trim(),m.setAccDescription(this.$);break;case 31:m.addSection(a[e].substr(8)),this.$=a[e].substr(8);break;case 33:m.addTask(a[e-1],a[e]),this.$="task";break;case 34:this.$=a[e-1],m.setClickEvent(a[e-1],a[e],null);break;case 35:this.$=a[e-2],m.setClickEvent(a[e-2],a[e-1],a[e]);break;case 36:this.$=a[e-2],m.setClickEvent(a[e-2],a[e-1],null),m.setLink(a[e-2],a[e]);break;case 37:this.$=a[e-3],m.setClickEvent(a[e-3],a[e-2],a[e-1]),m.setLink(a[e-3],a[e]);break;case 38:this.$=a[e-2],m.setClickEvent(a[e-2],a[e],null),m.setLink(a[e-2],a[e-1]);break;case 39:this.$=a[e-3],m.setClickEvent(a[e-3],a[e-1],a[e]),m.setLink(a[e-3],a[e-2]);break;case 40:this.$=a[e-1],m.setLink(a[e-1],a[e]);break;case 41:case 47:this.$=a[e-1]+" "+a[e];break;case 42:case 43:case 45:this.$=a[e-2]+" "+a[e-1]+" "+a[e];break;case 44:case 46:this.$=a[e-3]+" "+a[e-2]+" "+a[e-1]+" "+a[e];break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(r,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:s,13:i,14:n,15:o,16:d,17:g,18:D,19:18,20:C,21:b,22:A,23:W,24:$,25:L,26:S,27:z,28:P,29:Z,30:N,31:j,33:X,35:E,36:v,37:24,38:h,40:f},t(r,[2,7],{1:[2,1]}),t(r,[2,3]),{9:36,11:17,12:s,13:i,14:n,15:o,16:d,17:g,18:D,19:18,20:C,21:b,22:A,23:W,24:$,25:L,26:S,27:z,28:P,29:Z,30:N,31:j,33:X,35:E,36:v,37:24,38:h,40:f},t(r,[2,5]),t(r,[2,6]),t(r,[2,17]),t(r,[2,18]),t(r,[2,19]),t(r,[2,20]),t(r,[2,21]),t(r,[2,22]),t(r,[2,23]),t(r,[2,24]),t(r,[2,25]),t(r,[2,26]),t(r,[2,27]),{32:[1,37]},{34:[1,38]},t(r,[2,30]),t(r,[2,31]),t(r,[2,32]),{39:[1,39]},t(r,[2,8]),t(r,[2,9]),t(r,[2,10]),t(r,[2,11]),t(r,[2,12]),t(r,[2,13]),t(r,[2,14]),t(r,[2,15]),t(r,[2,16]),{41:[1,40],43:[1,41]},t(r,[2,4]),t(r,[2,28]),t(r,[2,29]),t(r,[2,33]),t(r,[2,34],{42:[1,42],43:[1,43]}),t(r,[2,40],{41:[1,44]}),t(r,[2,35],{43:[1,45]}),t(r,[2,36]),t(r,[2,38],{42:[1,46]}),t(r,[2,37]),t(r,[2,39])],defaultActions:{},parseError:l(function(c,u){if(u.recoverable)this.trace(c);else{var k=new Error(c);throw k.hash=u,k}},"parseError"),parse:l(function(c){var u=this,k=[0],m=[],w=[null],a=[],O=this.table,e="",_=0,F=0,Y=2,I=1,H=a.slice.call(arguments,1),M=Object.create(this.lexer),J={yy:{}};for(var ut in this.yy)Object.prototype.hasOwnProperty.call(this.yy,ut)&&(J.yy[ut]=this.yy[ut]);M.setInput(c,J.yy),J.yy.lexer=M,J.yy.parser=this,typeof M.yylloc>"u"&&(M.yylloc={});var wt=M.yylloc;a.push(wt);var me=M.options&&M.options.ranges;typeof J.yy.parseError=="function"?this.parseError=J.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function ke(U){k.length=k.length-2*U,w.length=w.length-U,a.length=a.length-U}l(ke,"popStack");function Ht(){var U;return U=m.pop()||M.lex()||I,typeof U!="number"&&(U instanceof Array&&(m=U,U=m.pop()),U=u.symbols_[U]||U),U}l(Ht,"lex");for(var G,rt,q,_t,nt={},yt,tt,Bt,vt;;){if(rt=k[k.length-1],this.defaultActions[rt]?q=this.defaultActions[rt]:((G===null||typeof G>"u")&&(G=Ht()),q=O[rt]&&O[rt][G]),typeof q>"u"||!q.length||!q[0]){var Dt="";vt=[];for(yt in O[rt])this.terminals_[yt]&&yt>Y&&vt.push("'"+this.terminals_[yt]+"'");M.showPosition?Dt="Parse error on line "+(_+1)+`:
`+M.showPosition()+`
Expecting `+vt.join(", ")+", got '"+(this.terminals_[G]||G)+"'":Dt="Parse error on line "+(_+1)+": Unexpected "+(G==I?"end of input":"'"+(this.terminals_[G]||G)+"'"),this.parseError(Dt,{text:M.match,token:this.terminals_[G]||G,line:M.yylineno,loc:wt,expected:vt})}if(q[0]instanceof Array&&q.length>1)throw new Error("Parse Error: multiple actions possible at state: "+rt+", token: "+G);switch(q[0]){case 1:k.push(G),w.push(M.yytext),a.push(M.yylloc),k.push(q[1]),G=null,F=M.yyleng,e=M.yytext,_=M.yylineno,wt=M.yylloc;break;case 2:if(tt=this.productions_[q[1]][1],nt.$=w[w.length-tt],nt._$={first_line:a[a.length-(tt||1)].first_line,last_line:a[a.length-1].last_line,first_column:a[a.length-(tt||1)].first_column,last_column:a[a.length-1].last_column},me&&(nt._$.range=[a[a.length-(tt||1)].range[0],a[a.length-1].range[1]]),_t=this.performAction.apply(nt,[e,F,_,J.yy,q[1],w,a].concat(H)),typeof _t<"u")return _t;tt&&(k=k.slice(0,-1*tt*2),w=w.slice(0,-1*tt),a=a.slice(0,-1*tt)),k.push(this.productions_[q[1]][0]),w.push(nt.$),a.push(nt._$),Bt=O[k[k.length-2]][k[k.length-1]],k.push(Bt);break;case 3:return!0}}return!0},"parse")},T=function(){var y={EOF:1,parseError:l(function(u,k){if(this.yy.parser)this.yy.parser.parseError(u,k);else throw new Error(u)},"parseError"),setInput:l(function(c,u){return this.yy=u||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:l(function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var u=c.match(/(?:\r\n?|\n).*/g);return u?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},"input"),unput:l(function(c){var u=c.length,k=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-u),this.offset-=u;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),k.length-1&&(this.yylineno-=k.length-1);var w=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:k?(k.length===m.length?this.yylloc.first_column:0)+m[m.length-k.length].length-k[0].length:this.yylloc.first_column-u},this.options.ranges&&(this.yylloc.range=[w[0],w[0]+this.yyleng-u]),this.yyleng=this.yytext.length,this},"unput"),more:l(function(){return this._more=!0,this},"more"),reject:l(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:l(function(c){this.unput(this.match.slice(c))},"less"),pastInput:l(function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:l(function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:l(function(){var c=this.pastInput(),u=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+u+"^"},"showPosition"),test_match:l(function(c,u){var k,m,w;if(this.options.backtrack_lexer&&(w={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(w.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],k=this.performAction.call(this,this.yy,this,u,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),k)return k;if(this._backtrack){for(var a in w)this[a]=w[a];return!1}return!1},"test_match"),next:l(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,u,k,m;this._more||(this.yytext="",this.match="");for(var w=this._currentRules(),a=0;a<w.length;a++)if(k=this._input.match(this.rules[w[a]]),k&&(!u||k[0].length>u[0].length)){if(u=k,m=a,this.options.backtrack_lexer){if(c=this.test_match(k,w[a]),c!==!1)return c;if(this._backtrack){u=!1;continue}else return!1}else if(!this.options.flex)break}return u?(c=this.test_match(u,w[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:l(function(){var u=this.next();return u||this.lex()},"lex"),begin:l(function(u){this.conditionStack.push(u)},"begin"),popState:l(function(){var u=this.conditionStack.length-1;return u>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:l(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:l(function(u){return u=this.conditionStack.length-1-Math.abs(u||0),u>=0?this.conditionStack[u]:"INITIAL"},"topState"),pushState:l(function(u){this.begin(u)},"pushState"),stateStackSize:l(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:l(function(u,k,m,w){switch(m){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 43;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 21:this.popState();break;case 22:return 42;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}};return y}();p.lexer=T;function x(){this.yy={}}return l(x,"Parser"),x.prototype=p,p.Parser=x,new x}();Et.parser=Et;var ds=Et;R.extend(Ue);R.extend(os);R.extend(cs);var ee={friday:5,saturday:6},K="",Ft="",$t=void 0,Lt="",ht=[],mt=[],Wt=new Map,Ot=[],xt=[],lt="",Pt="",ne=["active","done","crit","milestone","vert"],Vt=[],kt=!1,zt=!1,Nt="sunday",bt="saturday",It=0,fs=l(function(){Ot=[],xt=[],lt="",Vt=[],pt=0,At=void 0,Tt=void 0,V=[],K="",Ft="",Pt="",$t=void 0,Lt="",ht=[],mt=[],kt=!1,zt=!1,It=0,Wt=new Map,Ne(),Nt="sunday",bt="saturday"},"clear"),hs=l(function(t){Ft=t},"setAxisFormat"),ms=l(function(){return Ft},"getAxisFormat"),ks=l(function(t){$t=t},"setTickInterval"),ys=l(function(){return $t},"getTickInterval"),vs=l(function(t){Lt=t},"setTodayMarker"),gs=l(function(){return Lt},"getTodayMarker"),ps=l(function(t){K=t},"setDateFormat"),Ts=l(function(){kt=!0},"enableInclusiveEndDates"),xs=l(function(){return kt},"endDatesAreInclusive"),bs=l(function(){zt=!0},"enableTopAxis"),ws=l(function(){return zt},"topAxisEnabled"),_s=l(function(t){Pt=t},"setDisplayMode"),Ds=l(function(){return Pt},"getDisplayMode"),Ss=l(function(){return K},"getDateFormat"),Ms=l(function(t){ht=t.toLowerCase().split(/[\s,]+/)},"setIncludes"),Cs=l(function(){return ht},"getIncludes"),Es=l(function(t){mt=t.toLowerCase().split(/[\s,]+/)},"setExcludes"),Is=l(function(){return mt},"getExcludes"),Ys=l(function(){return Wt},"getLinks"),As=l(function(t){lt=t,Ot.push(t)},"addSection"),Fs=l(function(){return Ot},"getSections"),$s=l(function(){let t=se();const r=10;let s=0;for(;!t&&s<r;)t=se(),s++;return xt=V,xt},"getTasks"),oe=l(function(t,r,s,i){const n=t.format(r.trim()),o=t.format("YYYY-MM-DD");return i.includes(n)||i.includes(o)?!1:s.includes("weekends")&&(t.isoWeekday()===ee[bt]||t.isoWeekday()===ee[bt]+1)||s.includes(t.format("dddd").toLowerCase())?!0:s.includes(n)||s.includes(o)},"isInvalidDate"),Ls=l(function(t){Nt=t},"setWeekday"),Ws=l(function(){return Nt},"getWeekday"),Os=l(function(t){bt=t},"setWeekend"),ce=l(function(t,r,s,i){if(!s.length||t.manualEndTime)return;let n;t.startTime instanceof Date?n=R(t.startTime):n=R(t.startTime,r,!0),n=n.add(1,"d");let o;t.endTime instanceof Date?o=R(t.endTime):o=R(t.endTime,r,!0);const[d,g]=Ps(n,o,r,s,i);t.endTime=d.toDate(),t.renderEndTime=g},"checkTaskDates"),Ps=l(function(t,r,s,i,n){let o=!1,d=null;for(;t<=r;)o||(d=r.toDate()),o=oe(t,s,i,n),o&&(r=r.add(1,"d")),t=t.add(1,"d");return[r,d]},"fixTaskDates"),Yt=l(function(t,r,s){if(s=s.trim(),l(g=>{const D=g.trim();return D==="x"||D==="X"},"isTimestampFormat")(r)&&/^\d+$/.test(s))return new Date(Number(s));const o=/^after\s+(?<ids>[\d\w- ]+)/.exec(s);if(o!==null){let g=null;for(const C of o.groups.ids.split(" ")){let b=at(C);b!==void 0&&(!g||b.endTime>g.endTime)&&(g=b)}if(g)return g.endTime;const D=new Date;return D.setHours(0,0,0,0),D}let d=R(s,r.trim(),!0);if(d.isValid())return d.toDate();{it.debug("Invalid date:"+s),it.debug("With date format:"+r.trim());const g=new Date(s);if(g===void 0||isNaN(g.getTime())||g.getFullYear()<-1e4||g.getFullYear()>1e4)throw new Error("Invalid date:"+s);return g}},"getStartDate"),le=l(function(t){const r=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return r!==null?[Number.parseFloat(r[1]),r[2]]:[NaN,"ms"]},"parseDuration"),ue=l(function(t,r,s,i=!1){s=s.trim();const o=/^until\s+(?<ids>[\d\w- ]+)/.exec(s);if(o!==null){let b=null;for(const W of o.groups.ids.split(" ")){let $=at(W);$!==void 0&&(!b||$.startTime<b.startTime)&&(b=$)}if(b)return b.startTime;const A=new Date;return A.setHours(0,0,0,0),A}let d=R(s,r.trim(),!0);if(d.isValid())return i&&(d=d.add(1,"d")),d.toDate();let g=R(t);const[D,C]=le(s);if(!Number.isNaN(D)){const b=g.add(D,C);b.isValid()&&(g=b)}return g.toDate()},"getEndDate"),pt=0,ct=l(function(t){return t===void 0?(pt=pt+1,"task"+pt):t},"parseId"),Vs=l(function(t,r){let s;r.substr(0,1)===":"?s=r.substr(1,r.length):s=r;const i=s.split(","),n={};Rt(i,n,ne);for(let d=0;d<i.length;d++)i[d]=i[d].trim();let o="";switch(i.length){case 1:n.id=ct(),n.startTime=t.endTime,o=i[0];break;case 2:n.id=ct(),n.startTime=Yt(void 0,K,i[0]),o=i[1];break;case 3:n.id=ct(i[0]),n.startTime=Yt(void 0,K,i[1]),o=i[2];break}return o&&(n.endTime=ue(n.startTime,K,o,kt),n.manualEndTime=R(o,"YYYY-MM-DD",!0).isValid(),ce(n,K,mt,ht)),n},"compileData"),zs=l(function(t,r){let s;r.substr(0,1)===":"?s=r.substr(1,r.length):s=r;const i=s.split(","),n={};Rt(i,n,ne);for(let o=0;o<i.length;o++)i[o]=i[o].trim();switch(i.length){case 1:n.id=ct(),n.startTime={type:"prevTaskEnd",id:t},n.endTime={data:i[0]};break;case 2:n.id=ct(),n.startTime={type:"getStartDate",startData:i[0]},n.endTime={data:i[1]};break;case 3:n.id=ct(i[0]),n.startTime={type:"getStartDate",startData:i[1]},n.endTime={data:i[2]};break}return n},"parseData"),At,Tt,V=[],de={},Ns=l(function(t,r){const s={section:lt,type:lt,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:r},task:t,classes:[]},i=zs(Tt,r);s.raw.startTime=i.startTime,s.raw.endTime=i.endTime,s.id=i.id,s.prevTaskId=Tt,s.active=i.active,s.done=i.done,s.crit=i.crit,s.milestone=i.milestone,s.vert=i.vert,s.order=It,It++;const n=V.push(s);Tt=s.id,de[s.id]=n-1},"addTask"),at=l(function(t){const r=de[t];return V[r]},"findTaskById"),Rs=l(function(t,r){const s={section:lt,type:lt,description:t,task:t,classes:[]},i=Vs(At,r);s.startTime=i.startTime,s.endTime=i.endTime,s.id=i.id,s.active=i.active,s.done=i.done,s.crit=i.crit,s.milestone=i.milestone,s.vert=i.vert,At=s,xt.push(s)},"addTaskOrg"),se=l(function(){const t=l(function(s){const i=V[s];let n="";switch(V[s].raw.startTime.type){case"prevTaskEnd":{const o=at(i.prevTaskId);i.startTime=o.endTime;break}case"getStartDate":n=Yt(void 0,K,V[s].raw.startTime.startData),n&&(V[s].startTime=n);break}return V[s].startTime&&(V[s].endTime=ue(V[s].startTime,K,V[s].raw.endTime.data,kt),V[s].endTime&&(V[s].processed=!0,V[s].manualEndTime=R(V[s].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),ce(V[s],K,mt,ht))),V[s].processed},"compileTask");let r=!0;for(const[s,i]of V.entries())t(s),r=r&&i.processed;return r},"compileTasks"),Hs=l(function(t,r){let s=r;ot().securityLevel!=="loose"&&(s=ze(r)),t.split(",").forEach(function(i){at(i)!==void 0&&(he(i,()=>{window.open(s,"_self")}),Wt.set(i,s))}),fe(t,"clickable")},"setLink"),fe=l(function(t,r){t.split(",").forEach(function(s){let i=at(s);i!==void 0&&i.classes.push(r)})},"setClass"),Bs=l(function(t,r,s){if(ot().securityLevel!=="loose"||r===void 0)return;let i=[];if(typeof s=="string"){i=s.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let o=0;o<i.length;o++){let d=i[o].trim();d.startsWith('"')&&d.endsWith('"')&&(d=d.substr(1,d.length-2)),i[o]=d}}i.length===0&&i.push(t),at(t)!==void 0&&he(t,()=>{Re.runFunc(r,...i)})},"setClickFun"),he=l(function(t,r){Vt.push(function(){const s=document.querySelector(`[id="${t}"]`);s!==null&&s.addEventListener("click",function(){r()})},function(){const s=document.querySelector(`[id="${t}-text"]`);s!==null&&s.addEventListener("click",function(){r()})})},"pushFun"),Gs=l(function(t,r,s){t.split(",").forEach(function(i){Bs(i,r,s)}),fe(t,"clickable")},"setClickEvent"),js=l(function(t){Vt.forEach(function(r){r(t)})},"bindFunctions"),Us={getConfig:l(()=>ot().gantt,"getConfig"),clear:fs,setDateFormat:ps,getDateFormat:Ss,enableInclusiveEndDates:Ts,endDatesAreInclusive:xs,enableTopAxis:bs,topAxisEnabled:ws,setAxisFormat:hs,getAxisFormat:ms,setTickInterval:ks,getTickInterval:ys,setTodayMarker:vs,getTodayMarker:gs,setAccTitle:we,getAccTitle:be,setDiagramTitle:xe,getDiagramTitle:Te,setDisplayMode:_s,getDisplayMode:Ds,setAccDescription:pe,getAccDescription:ge,addSection:As,getSections:Fs,getTasks:$s,addTask:Ns,findTaskById:at,addTaskOrg:Rs,setIncludes:Ms,getIncludes:Cs,setExcludes:Es,getExcludes:Is,setClickEvent:Gs,setLink:Hs,getLinks:Ys,bindFunctions:js,parseDuration:le,isInvalidDate:oe,setWeekday:Ls,getWeekday:Ws,setWeekend:Os};function Rt(t,r,s){let i=!0;for(;i;)i=!1,s.forEach(function(n){const o="^\\s*"+n+"\\s*$",d=new RegExp(o);t[0].match(d)&&(r[n]=!0,t.shift(1),i=!0)})}l(Rt,"getTaskTags");R.extend(us);var Xs=l(function(){it.debug("Something is calling, setConf, remove the call")},"setConf"),re={monday:Oe,tuesday:We,wednesday:Le,thursday:$e,friday:Fe,saturday:Ae,sunday:Ye},qs=l((t,r)=>{let s=[...t].map(()=>-1/0),i=[...t].sort((o,d)=>o.startTime-d.startTime||o.order-d.order),n=0;for(const o of i)for(let d=0;d<s.length;d++)if(o.startTime>=s[d]){s[d]=o.endTime,o.order=d+r,d>n&&(n=d);break}return n},"getMaxIntersections"),et,Ct=1e4,Zs=l(function(t,r,s,i){const n=ot().gantt,o=ot().securityLevel;let d;o==="sandbox"&&(d=gt("#i"+r));const g=o==="sandbox"?gt(d.nodes()[0].contentDocument.body):gt("body"),D=o==="sandbox"?d.nodes()[0].contentDocument:document,C=D.getElementById(r);et=C.parentElement.offsetWidth,et===void 0&&(et=1200),n.useWidth!==void 0&&(et=n.useWidth);const b=i.db.getTasks();let A=[];for(const f of b)A.push(f.type);A=h(A);const W={};let $=2*n.topPadding;if(i.db.getDisplayMode()==="compact"||n.displayMode==="compact"){const f={};for(const T of b)f[T.section]===void 0?f[T.section]=[T]:f[T.section].push(T);let p=0;for(const T of Object.keys(f)){const x=qs(f[T],p)+1;p+=x,$+=x*(n.barHeight+n.barGap),W[T]=x}}else{$+=b.length*(n.barHeight+n.barGap);for(const f of A)W[f]=b.filter(p=>p.type===f).length}C.setAttribute("viewBox","0 0 "+et+" "+$);const L=g.select(`[id="${r}"]`),S=_e().domain([De(b,function(f){return f.startTime}),Se(b,function(f){return f.endTime})]).rangeRound([0,et-n.leftPadding-n.rightPadding]);function z(f,p){const T=f.startTime,x=p.startTime;let y=0;return T>x?y=1:T<x&&(y=-1),y}l(z,"taskCompare"),b.sort(z),P(b,et,$),Me(L,$,et,n.useMaxWidth),L.append("text").text(i.db.getDiagramTitle()).attr("x",et/2).attr("y",n.titleTopMargin).attr("class","titleText");function P(f,p,T){const x=n.barHeight,y=x+n.barGap,c=n.topPadding,u=n.leftPadding,k=Ce().domain([0,A.length]).range(["#00B9FA","#F95002"]).interpolate(Ee);N(y,c,u,p,T,f,i.db.getExcludes(),i.db.getIncludes()),X(u,c,p,T),Z(f,y,c,u,x,k,p),E(y,c),v(u,c,p,T)}l(P,"makeGantt");function Z(f,p,T,x,y,c,u){f.sort((e,_)=>e.vert===_.vert?0:e.vert?1:-1);const m=[...new Set(f.map(e=>e.order))].map(e=>f.find(_=>_.order===e));L.append("g").selectAll("rect").data(m).enter().append("rect").attr("x",0).attr("y",function(e,_){return _=e.order,_*p+T-2}).attr("width",function(){return u-n.rightPadding/2}).attr("height",p).attr("class",function(e){for(const[_,F]of A.entries())if(e.type===F)return"section section"+_%n.numberSectionStyles;return"section section0"}).enter();const w=L.append("g").selectAll("rect").data(f).enter(),a=i.db.getLinks();if(w.append("rect").attr("id",function(e){return e.id}).attr("rx",3).attr("ry",3).attr("x",function(e){return e.milestone?S(e.startTime)+x+.5*(S(e.endTime)-S(e.startTime))-.5*y:S(e.startTime)+x}).attr("y",function(e,_){return _=e.order,e.vert?n.gridLineStartPadding:_*p+T}).attr("width",function(e){return e.milestone?y:e.vert?.08*y:S(e.renderEndTime||e.endTime)-S(e.startTime)}).attr("height",function(e){return e.vert?b.length*(n.barHeight+n.barGap)+n.barHeight*2:y}).attr("transform-origin",function(e,_){return _=e.order,(S(e.startTime)+x+.5*(S(e.endTime)-S(e.startTime))).toString()+"px "+(_*p+T+.5*y).toString()+"px"}).attr("class",function(e){const _="task";let F="";e.classes.length>0&&(F=e.classes.join(" "));let Y=0;for(const[H,M]of A.entries())e.type===M&&(Y=H%n.numberSectionStyles);let I="";return e.active?e.crit?I+=" activeCrit":I=" active":e.done?e.crit?I=" doneCrit":I=" done":e.crit&&(I+=" crit"),I.length===0&&(I=" task"),e.milestone&&(I=" milestone "+I),e.vert&&(I=" vert "+I),I+=Y,I+=" "+F,_+I}),w.append("text").attr("id",function(e){return e.id+"-text"}).text(function(e){return e.task}).attr("font-size",n.fontSize).attr("x",function(e){let _=S(e.startTime),F=S(e.renderEndTime||e.endTime);if(e.milestone&&(_+=.5*(S(e.endTime)-S(e.startTime))-.5*y,F=_+y),e.vert)return S(e.startTime)+x;const Y=this.getBBox().width;return Y>F-_?F+Y+1.5*n.leftPadding>u?_+x-5:F+x+5:(F-_)/2+_+x}).attr("y",function(e,_){return e.vert?n.gridLineStartPadding+b.length*(n.barHeight+n.barGap)+60:(_=e.order,_*p+n.barHeight/2+(n.fontSize/2-2)+T)}).attr("text-height",y).attr("class",function(e){const _=S(e.startTime);let F=S(e.endTime);e.milestone&&(F=_+y);const Y=this.getBBox().width;let I="";e.classes.length>0&&(I=e.classes.join(" "));let H=0;for(const[J,ut]of A.entries())e.type===ut&&(H=J%n.numberSectionStyles);let M="";return e.active&&(e.crit?M="activeCritText"+H:M="activeText"+H),e.done?e.crit?M=M+" doneCritText"+H:M=M+" doneText"+H:e.crit&&(M=M+" critText"+H),e.milestone&&(M+=" milestoneText"),e.vert&&(M+=" vertText"),Y>F-_?F+Y+1.5*n.leftPadding>u?I+" taskTextOutsideLeft taskTextOutside"+H+" "+M:I+" taskTextOutsideRight taskTextOutside"+H+" "+M+" width-"+Y:I+" taskText taskText"+H+" "+M+" width-"+Y}),ot().securityLevel==="sandbox"){let e;e=gt("#i"+r);const _=e.nodes()[0].contentDocument;w.filter(function(F){return a.has(F.id)}).each(function(F){var Y=_.querySelector("#"+F.id),I=_.querySelector("#"+F.id+"-text");const H=Y.parentNode;var M=_.createElement("a");M.setAttribute("xlink:href",a.get(F.id)),M.setAttribute("target","_top"),H.appendChild(M),M.appendChild(Y),M.appendChild(I)})}}l(Z,"drawRects");function N(f,p,T,x,y,c,u,k){if(u.length===0&&k.length===0)return;let m,w;for(const{startTime:Y,endTime:I}of c)(m===void 0||Y<m)&&(m=Y),(w===void 0||I>w)&&(w=I);if(!m||!w)return;if(R(w).diff(R(m),"year")>5){it.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}const a=i.db.getDateFormat(),O=[];let e=null,_=R(m);for(;_.valueOf()<=w;)i.db.isInvalidDate(_,a,u,k)?e?e.end=_:e={start:_,end:_}:e&&(O.push(e),e=null),_=_.add(1,"d");L.append("g").selectAll("rect").data(O).enter().append("rect").attr("id",Y=>"exclude-"+Y.start.format("YYYY-MM-DD")).attr("x",Y=>S(Y.start.startOf("day"))+T).attr("y",n.gridLineStartPadding).attr("width",Y=>S(Y.end.endOf("day"))-S(Y.start.startOf("day"))).attr("height",y-p-n.gridLineStartPadding).attr("transform-origin",function(Y,I){return(S(Y.start)+T+.5*(S(Y.end)-S(Y.start))).toString()+"px "+(I*f+.5*y).toString()+"px"}).attr("class","exclude-range")}l(N,"drawExcludeDays");function j(f,p,T,x){if(T<=0||f>p)return 1/0;const y=p-f,c=R.duration({[x??"day"]:T}).asMilliseconds();return c<=0?1/0:Math.ceil(y/c)}l(j,"getEstimatedTickCount");function X(f,p,T,x){const y=i.db.getDateFormat(),c=i.db.getAxisFormat();let u;c?u=c:y==="D"?u="%d":u=n.axisFormat??"%Y-%m-%d";let k=Ie(S).tickSize(-x+p+n.gridLineStartPadding).tickFormat(Gt(u));const w=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(i.db.getTickInterval()||n.tickInterval);if(w!==null){const a=parseInt(w[1],10);if(isNaN(a)||a<=0)it.warn(`Invalid tick interval value: "${w[1]}". Skipping custom tick interval.`);else{const O=w[2],e=i.db.getWeekday()||n.weekday,_=S.domain(),F=_[0],Y=_[1],I=j(F,Y,a,O);if(I>Ct)it.warn(`The tick interval "${a}${O}" would generate ${I} ticks, which exceeds the maximum allowed (${Ct}). This may indicate an invalid date or time range. Skipping custom tick interval.`);else switch(O){case"millisecond":k.ticks(Qt.every(a));break;case"second":k.ticks(Zt.every(a));break;case"minute":k.ticks(qt.every(a));break;case"hour":k.ticks(Xt.every(a));break;case"day":k.ticks(Ut.every(a));break;case"week":k.ticks(re[e].every(a));break;case"month":k.ticks(jt.every(a));break}}}if(L.append("g").attr("class","grid").attr("transform","translate("+f+", "+(x-50)+")").call(k).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),i.db.topAxisEnabled()||n.topAxis){let a=Pe(S).tickSize(-x+p+n.gridLineStartPadding).tickFormat(Gt(u));if(w!==null){const O=parseInt(w[1],10);if(isNaN(O)||O<=0)it.warn(`Invalid tick interval value: "${w[1]}". Skipping custom tick interval.`);else{const e=w[2],_=i.db.getWeekday()||n.weekday,F=S.domain(),Y=F[0],I=F[1];if(j(Y,I,O,e)<=Ct)switch(e){case"millisecond":a.ticks(Qt.every(O));break;case"second":a.ticks(Zt.every(O));break;case"minute":a.ticks(qt.every(O));break;case"hour":a.ticks(Xt.every(O));break;case"day":a.ticks(Ut.every(O));break;case"week":a.ticks(re[_].every(O));break;case"month":a.ticks(jt.every(O));break}}}L.append("g").attr("class","grid").attr("transform","translate("+f+", "+p+")").call(a).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}l(X,"makeGrid");function E(f,p){let T=0;const x=Object.keys(W).map(y=>[y,W[y]]);L.append("g").selectAll("text").data(x).enter().append(function(y){const c=y[0].split(Ve.lineBreakRegex),u=-(c.length-1)/2,k=D.createElementNS("http://www.w3.org/2000/svg","text");k.setAttribute("dy",u+"em");for(const[m,w]of c.entries()){const a=D.createElementNS("http://www.w3.org/2000/svg","tspan");a.setAttribute("alignment-baseline","central"),a.setAttribute("x","10"),m>0&&a.setAttribute("dy","1em"),a.textContent=w,k.appendChild(a)}return k}).attr("x",10).attr("y",function(y,c){if(c>0)for(let u=0;u<c;u++)return T+=x[c-1][1],y[1]*f/2+T*f+p;else return y[1]*f/2+p}).attr("font-size",n.sectionFontSize).attr("class",function(y){for(const[c,u]of A.entries())if(y[0]===u)return"sectionTitle sectionTitle"+c%n.numberSectionStyles;return"sectionTitle"})}l(E,"vertLabels");function v(f,p,T,x){const y=i.db.getTodayMarker();if(y==="off")return;const c=L.append("g").attr("class","today"),u=new Date,k=c.append("line");k.attr("x1",S(u)+f).attr("x2",S(u)+f).attr("y1",n.titleTopMargin).attr("y2",x-n.titleTopMargin).attr("class","today"),y!==""&&k.attr("style",y.replace(/,/g,";"))}l(v,"drawToday");function h(f){const p={},T=[];for(let x=0,y=f.length;x<y;++x)Object.prototype.hasOwnProperty.call(p,f[x])||(p[f[x]]=!0,T.push(f[x]));return T}l(h,"checkUnique")},"draw"),Qs={setConf:Xs,draw:Zs},Ks=l(t=>`
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
`,"getStyles"),Js=Ks,sr={parser:ds,db:Us,renderer:Qs,styles:Js};export{sr as diagram};
