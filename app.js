!function(e){function t(t){for(var o,i,l=t[0],c=t[1],p=t[2],d=0,u=[];d<l.length;d++)i=l[d],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&u.push(r[i][0]),r[i]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(e[o]=c[o]);for(s&&s(t);u.length;)u.shift()();return a.push.apply(a,p||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],o=!0,l=1;l<n.length;l++){var c=n[l];0!==r[c]&&(o=!1)}o&&(a.splice(t--,1),e=i(i.s=n[0]))}return e}var o={},r={0:0},a=[];function i(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var l=window.webpackJsonp=window.webpackJsonp||[],c=l.push.bind(l);l.push=t,l=l.slice();for(var p=0;p<l.length;p++)t(l[p]);var s=c;a.push([65,1]),n()}({39:function(e,t){},41:function(e,t){},59:function(e,t){},61:function(e,t,n){var o=n(62);"string"==typeof o&&(o=[[e.i,o,""]]);var r={hmr:!0,transform:void 0};n(16)(o,r);o.locals&&(e.exports=o.locals)},62:function(e,t,n){(e.exports=n(14)(!1)).push([e.i,".map-title {\n    background-color: rgba(96, 210, 255, 0.2);\n    border-color: rgb(98, 179, 255);\n    border-style: solid;\n    border-width: 1px;\n    padding: 2px 10px;\n    color: rgb(98, 179, 255);\n}\n\n.map-title h1 {\n    font-size: 48pt;\n    margin: 0;\n}\n\n.map-indicator {\n    background-color: rgba(96, 210, 255, 0.2);\n    border-color: rgb(98, 179, 255);\n    border-style: solid;\n    border-width: 1px;\n    padding: 2px 10px;\n    color: white;\n    padding: 2px 10px;\n    width: 500px;\n}\n\n.map-indicator .datetime {\n    font-size: 42pt;\n}\n\n.map-indicator .selector {\n    width: 100%;\n}\n\ninput[type=range] {\n    -webkit-appearance: none;\n    background: rgba(0, 0, 0, 0.7);\n    height: 24px;\n    width: 240px;\n    border-radius: 8px;\n}\n\ninput[type=range]::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    background: rgb(98, 179, 255);\n    height: 20px;\n    width: 20px;\n    border-radius: 50%;\n}\n\ninput[type=range]::-ms-tooltip {\n    display: none;\n}\n\ninput[type=range]::-moz-range-track {\n    height: 0;\n}\n\ninput[type=range]::-moz-range-thumb {\n    background: rgb(98, 179, 255);\n    height: 20px;\n    width: 20px;\n    border: none;\n    border-radius: 50%;\n}\n\n.leaflet-tile-container img {\n    filter: invert(100%) hue-rotate(180deg);\n}",""])},65:function(e,t,n){"use strict";n.r(t);var o=n(24),r=n.n(o),a=n(0),i=n.n(a);n(28);delete i.a.Icon.Default.prototype._getIconUrl,i.a.Icon.Default.mergeOptions({iconRetinaUrl:n(34),iconUrl:n(15),shadowUrl:n(35)}),i.a.Control.Title=i.a.Control.extend({onAdd:function(e){const t=i.a.DomUtil.create("div");return t.className="map-title",t.innerHTML=`<h1>${this.options.title}</h1>`,t},onRemove:function(e){}}),i.a.control.title=function(e){return new i.a.Control.Title(e)},i.a.Control.EmptyDiv=i.a.Control.extend({onAdd:function(e){const t=i.a.DomUtil.create("div");return t.className=this.options.className,t},onRemove:function(e){}}),i.a.control.emptyDiv=function(e){return new i.a.Control.EmptyDiv(e)};var l=n(13),c=n.n(l);n(61);var p=n(25);const s=i.a.map("map",{zoom:11,center:[35.758771,139.794158],zoomControl:!1}),d=['Tiles &copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>','River log &copy; <a href="http://www1.river.go.jp/">国土交通省 水文水質データベース</a>','Visualization &copy; <a href="https://github.com/colspan">@colspan</a>','Typhoon Track Log &copy; <a href="http://agora.ex.nii.ac.jp/digital-typhoon/summary/wnp/s/201919.html.ja">国立情報学研究所「デジタル台風」</a>'].join(" | ");i.a.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",{attribution:d}).addTo(s);i.a.control.title({title:"2019年 台風19号 各河川水位可視化",position:"topleft"}).addTo(s);i.a.control.zoom({position:"bottomright"}).addTo(s),Promise.all([new Promise((e,t)=>{fetch("./siteinfo.csv").then(e=>e.text()).then(e=>c()(e,{mapValues:({header:e,index:t,value:n})=>{if("coordinate"===e){function o(e){const t=new RegExp("[度分秒]"),n=e.split(t);return+n[0]+ +n[1]/60+ +n[2]/60/60}const e=n.split(" ");return[o(e[1]),o(e[3])]}return n}})).then(e).catch(t)}),new Promise((e,t)=>{fetch("./riverlog_201910.csv").then(e=>e.text()).then(e=>c()(e,{mapValues:({header:e,index:t,value:n})=>"datetime"===e?n:""===n?NaN:+n})).then(e).catch(t)}),new Promise((e,t)=>{fetch("./201919.ja.json").then(e=>e.json()).then(t=>{const n=t.features.map(e=>{const t=e.properties.time,n=e.geometry.coordinates;return{[t]:[n[1],n[0]]}}).reduce((e,t)=>Object.assign(e,t),{});e(n)}).catch(t)})]).then(e=>{const[t,n,o]=e,a=t.filter(e=>16===e.site_id.length),l=a.map(e=>{const t=n.map(t=>t[e.site_id]).filter(e=>!isNaN(e)),o=t.reduce((e,t)=>e>t?e:t),r=t.reduce((e,t)=>e<t?e:t);return t.forEach((e,t)=>{isNaN(e)&&(n[t][e.site_id]=r)}),[o,r]});let c=0;const d=r()({colormap:"portland",nshades:30,format:"hex",alpha:1}),u=a.map(e=>{const t=i.a.circleMarker(e.coordinate,{weight:1}).addTo(s),n=`${e.site_name}`;return t.bindTooltip(n),t.site_id=e.site_id,t});const h=Object.keys(o).map(e=>+e),m=Object.values(o);i.a.polyline(m,{color:"yellow",weight:1}).addTo(s);const g=i.a.marker(m[0]);g.addTo(s);const f=i.a.control.emptyDiv({position:"bottomleft",className:"map-indicator"}).addTo(s),b=document.createElement("div");b.className="datetime",f.getContainer().appendChild(b);const v=document.createElement("input");v.className="selector",v.type="range",v.min=0,v.max=n.length-1,f.getContainer().appendChild(v);let y;const x=e=>{Object(p.isUndefined)(e)?c+=1:c=e,(n.length<=c||c<0)&&(c=0),u.forEach((e,t)=>{let o=n[c][e.site_id];const[r,a]=l[t],i=d[parseInt((o-a)/(r-a)*(d.length-1),10)];isNaN(o)?e.setRadius(1):(e.setRadius(10*(o-a)+5),e.setStyle({color:i,fillColor:i}))}),b.innerHTML=n[c].datetime,f.value=c,v.value=c,function(){const e=Date.parse(n[c].datetime)/1e3,t=h.reduce((t,n,o)=>n<=e?o:t,0);let o;if(0===t||t===m.length-1)o=m[t];else{m[t],m[t+1];const n=(e,t,n,o)=>(t[n+1]-t[n])/(e[n+1]-e[n])*(o-e[n])+t[n];o=[n(h,m.map(e=>e[0]),t,e),n(h,m.map(e=>e[1]),t,e)]}g.setLatLng(o)}()};v.addEventListener("input",e=>{clearInterval(y),s.dragging.disable(),c=+e.target.value,x(c)}),v.addEventListener("change",()=>{y=setInterval(x,100),s.dragging.enable()}),y=setInterval(x,100)}).catch(console.error)}});