import{r as x,g as R}from"./react-vendor-COd4auuD.js";function d(s,u){for(var o=0;o<u.length;o++){const t=u[o];if(typeof t!="string"&&!Array.isArray(t)){for(const r in t)if(r!=="default"&&!(r in s)){const e=Object.getOwnPropertyDescriptor(t,r);e&&Object.defineProperty(s,r,e.get?e:{enumerable:!0,get:()=>t[r]})}}}return Object.freeze(Object.defineProperty(s,Symbol.toStringTag,{value:"Module"}))}var c={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var f;function v(){if(f)return n;f=1;var s=Symbol.for("react.transitional.element"),u=Symbol.for("react.fragment");function o(t,r,e){var a=null;if(e!==void 0&&(a=""+e),r.key!==void 0&&(a=""+r.key),"key"in r){e={};for(var i in r)i!=="key"&&(e[i]=r[i])}else e=r;return r=e.ref,{$$typeof:s,type:t,key:a,ref:r!==void 0?r:null,props:e}}return n.Fragment=u,n.jsx=o,n.jsxs=o,n}var l;function _(){return l||(l=1,c.exports=v()),c.exports}var m=_(),p=x();const j=R(p),k=d({__proto__:null,default:j},[p]);export{j as R,k as a,m as j,p as r};
