var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,o)=>(o=n==null?{}:e(i(n)),c(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u=`gtky.v1`,d={player:{name:``},lastGuest:{player2:``},settings:{theme:`system`,music:!1,sfx:!0,timer:!1,skipAllowed:!0,animations:!0,predictionScoring:!0,revealAnimations:!0},stats:{answered:{surface:0,personal:0,deep:0,together:0},duoSessions:0,wheelSpins:0,cardsDrawn:0,predictMatches:0,predictTotal:0,matchSame:0,matchTotal:0},notes:[],zines:[],albums:[],lastRoomCode:``,paused:null,veto:[],later:[],letter:null,morning:{streak:0,lastDay:0,lastCard:null},lastNight:null};function f(e){return JSON.parse(JSON.stringify(e))}var p=null,m=0;function h(e){return{...f(d),...e,player:{...d.player,...e.player},lastGuest:{...d.lastGuest,...e.lastGuest},settings:{...d.settings,...e.settings},stats:{...d.stats,...e.stats,answered:{...d.stats.answered,...e.stats?.answered}},notes:Array.isArray(e.notes)?e.notes:[],zines:Array.isArray(e.zines)?e.zines:[],albums:Array.isArray(e.albums)?e.albums:[],lastRoomCode:e.lastRoomCode||``,paused:e.paused||null,veto:Array.isArray(e.veto)?e.veto:[],later:Array.isArray(e.later)?e.later:[],letter:e.letter||null,morning:{streak:0,lastDay:0,lastCard:null,...e.morning},lastNight:e.lastNight||null}}function g(){if(p)return p;try{let e=localStorage.getItem(u);p=e?h(JSON.parse(e)):f(d)}catch{p=f(d)}return p}function _(e){p=e,window.clearTimeout(m),m=window.setTimeout(ee,120)}function ee(){if(window.clearTimeout(m),m=0,p)try{localStorage.setItem(u,JSON.stringify(p))}catch{}}function v(e){let t=g();return e(t),_(t),t}typeof window<`u`&&(window.addEventListener(`pagehide`,ee),document.addEventListener(`visibilitychange`,()=>{document.visibilityState===`hidden`&&ee()}));function y(){return g().player.name.trim()}function te(e){v(t=>{t.player.name=e.trim()})}function ne(){return g().lastGuest.player2.trim()}function re(e){v(t=>{t.lastGuest.player2=e.trim()})}function ie(){return g().stats}function b(e){v(t=>{t.stats.answered[e]!=null&&(t.stats.answered[e]+=1)})}function ae(){v(e=>{e.stats.cardsDrawn+=1})}function oe(){v(e=>{e.stats.wheelSpins+=1})}function se(){v(e=>{e.stats.duoSessions+=1})}function ce(e){v(t=>{t.stats.predictTotal+=1,e&&(t.stats.predictMatches+=1)})}function le(e){v(t=>{t.stats.matchTotal+=1,e&&(t.stats.matchSame+=1)})}function ue(e=ie()){return(e.answered.surface||0)+(e.answered.personal||0)+(e.answered.deep||0)+(e.answered.together||0)}function de(e){let t=[];e.note1?.trim()&&t.push({from:e.player1,to:e.player2,text:e.note1.trim(),at:Date.now()}),e.note2?.trim()&&t.push({from:e.player2,to:e.player1,text:e.note2.trim(),at:Date.now()}),t.length&&v(e=>{e.notes=[...t,...e.notes||[]].slice(0,24)})}function fe(){return g().notes||[]}var pe=[],me=null,he={lockDeep:!1};function ge(e={}){he={lockDeep:!1,...e}}function _e(){return pe.length>0}function ve(){try{return new Set(g().veto||[])}catch{return new Set}}function x({level:e,category:t,allowDeep:n}={}){let r=ve(),i=n??!he.lockDeep;return pe.filter(n=>!(r.has(n.id)||!i&&n.level===`deep`||e&&e!==`random`&&n.level!==e||t&&n.category!==t))}function ye(e){let t=[...e];for(let e=t.length-1;e>0;--e){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}async function be(){let e=await fetch(`./data/questions.json`);if(!e.ok)throw Error(`Could not load questions`);return e.json()}async function xe(){return pe.length?pe:me||(me=be().then(e=>(pe=e,e)),me)}function Se(){return pe}function Ce(e){return x({level:e})}function we(e,{category:t}={}){return ye(x({level:e,category:t}))}function S(e){return e.length?e[Math.floor(Math.random()*e.length)]:null}function Te(e,t){let n=Ce(e);return t===`match`?n.filter(e=>e.choices?.length===2||e.duoTypes?.includes(`match`)):t===`predict`?n.filter(e=>e.duoTypes?.includes(`predict`)):t===`connect`?n.filter(e=>e.duoTypes?.includes(`connect`)&&e.duoCompatible!==!1):n.filter(e=>e.duoCompatible!==!1)}function Ee(e,t=[]){let n=Te(e,`connect`).filter(e=>!t.includes(e.id)),r=new Map;for(let e of n){let t=`${e.level}:${e.category}`;r.has(t)||r.set(t,[]),r.get(t).push(e)}let i=[...r.values()].filter(e=>e.length>=2);if(!i.length)return null;let a=ye(S(i));return[a[0],a[1]]}function De(){let e=Ce(`surface`);return e.length?e[Math.floor(Date.now()/864e5)%e.length]:null}xe().catch(()=>{});var Oe={surface:{hobbies:{label:`Hobbies`,emoji:`🎯`},music:{label:`Music`,emoji:`🎵`},movies:{label:`Movies & TV`,emoji:`🎬`},food:{label:`Food`,emoji:`🍕`},travel:{label:`Travel`,emoji:`✈️`},interests:{label:`Interests`,emoji:`🎨`},sports:{label:`Sports`,emoji:`⚽`},animals:{label:`Animals`,emoji:`🐶`},games:{label:`Games`,emoji:`🎮`},school:{label:`School`,emoji:`🏫`},work:{label:`Work`,emoji:`💼`},places:{label:`Places`,emoji:`🌎`},lifestyle:{label:`Lifestyle`,emoji:`☀️`},fun:{label:`Fun / Random`,emoji:`😂`}},personal:{personality:{label:`Personality`,emoji:`🧠`},friendship:{label:`Friendship`,emoji:`👥`},relationships:{label:`Relationships`,emoji:`❤️`},goals:{label:`Goals`,emoji:`🎯`},accomplishments:{label:`Accomplishments`,emoji:`🏆`},memories:{label:`Memories`,emoji:`📖`},growth:{label:`Growth`,emoji:`🌱`},family:{label:`Family`,emoji:`👨‍👩‍👧`},opinions:{label:`Opinions`,emoji:`💭`},embarrassing:{label:`Embarrassing Moments`,emoji:`😅`},habits:{label:`Habits`,emoji:`🧩`},emotions:{label:`Emotions`,emoji:`🎭`},experiences:{label:`Life Experiences`,emoji:`🛤️`}},deep:{love:{label:`Love`,emoji:`❤️`},connection:{label:`Connection`,emoji:`🫂`},identity:{label:`Identity`,emoji:`🧠`},selfImage:{label:`Self-Image`,emoji:`🪞`},vulnerability:{label:`Vulnerability`,emoji:`😔`},fear:{label:`Fear`,emoji:`😨`},growth:{label:`Personal Growth`,emoji:`🌱`},regret:{label:`Regret`,emoji:`🕰️`},meaning:{label:`Meaning`,emoji:`🌎`},purpose:{label:`Purpose`,emoji:`🎯`},future:{label:`Future`,emoji:`🔮`},values:{label:`Values & Beliefs`,emoji:`💭`},relationships:{label:`Relationships`,emoji:`💗`},needs:{label:`Emotional Needs`,emoji:`🧠`}},together:{everyday:{label:`Everyday`,emoji:`🛒`},comfort:{label:`Comfort`,emoji:`🫧`},noticing:{label:`Noticing`,emoji:`👀`},hope:{label:`Hope`,emoji:`🕯️`},play:{label:`Play`,emoji:`🎈`},care:{label:`Care`,emoji:`🫶`},us:{label:`Us`,emoji:`💌`},future:{label:`Future`,emoji:`🌙`}}},ke={surface:{label:`Surface`,blurb:`What do you like?`,emoji:`🟢`},personal:{label:`Personal`,blurb:`Who are you?`,emoji:`🟡`},deep:{label:`Deep`,blurb:`What makes you, you?`,emoji:`🔴`},together:{label:`Together`,blurb:`What are we, to each other?`,emoji:`💗`},random:{label:`Random`,blurb:`Every question, shuffled together.`,emoji:`🎲`}};function Ae(e,t){return Oe[e]?.[t]||{label:t,emoji:`💬`}}var je,Me=[];function Ne(){return je||=new(window.AudioContext||window.webkitAudioContext),je}function C(e,t,n=`sine`,r=.05,i=0){let a=Ne(),o=a.createOscillator(),s=a.createGain();o.type=n,o.frequency.value=e,s.gain.value=0,o.connect(s),s.connect(a.destination);let c=a.currentTime+i;s.gain.linearRampToValueAtTime(r,c+.02),s.gain.exponentialRampToValueAtTime(1e-4,c+t),o.start(c),o.stop(c+t+.02)}function Pe(){try{Ne().resume()}catch{}}function Fe(e,t){t&&(Pe(),e===`flip`?(C(240,.12,`triangle`,.04),C(420,.16,`sine`,.03,.05)):e===`draw`?C(180,.1,`sawtooth`,.02):e===`tick`?C(880,.04,`square`,.02):e===`match`?(C(523,.16,`sine`,.05),C(659,.18,`sine`,.04,.08),C(784,.28,`sine`,.04,.16)):e===`miss`?C(220,.2,`triangle`,.04):e===`spin`?C(160,.2,`sine`,.03):e===`skip`?C(140,.08,`sine`,.025):e===`bark`?Le():e===`whoosh`?(C(180,.18,`sine`,.04),C(320,.22,`triangle`,.03,.08)):e===`chime`?(C(523,.14,`sine`,.05),C(784,.2,`sine`,.04,.08),C(1046,.28,`sine`,.035,.16)):e===`pop`?(C(640,.08,`square`,.03),C(880,.1,`sine`,.025,.04)):e===`page`?(C(200,.06,`sawtooth`,.015),C(140,.1,`triangle`,.02,.04)):e===`party`&&(C(392,.12,`triangle`,.05),C(523,.14,`sine`,.045,.1),C(659,.16,`sine`,.04,.2),C(784,.28,`triangle`,.05,.32)))}function Ie(e){let t=Ne(),n=t.currentTime+e,r=t.createBufferSource(),i=t.createBuffer(1,t.sampleRate*.16,t.sampleRate),a=i.getChannelData(0);for(let e=0;e<a.length;e+=1)a[e]=(Math.random()*2-1)*(1-e/a.length);r.buffer=i;let o=t.createBiquadFilter();o.type=`bandpass`,o.frequency.setValueAtTime(980,n),o.frequency.exponentialRampToValueAtTime(260,n+.14);let s=t.createGain();s.gain.setValueAtTime(1e-4,n),s.gain.linearRampToValueAtTime(.24,n+.015),s.gain.exponentialRampToValueAtTime(1e-4,n+.16),r.connect(o),o.connect(s),s.connect(t.destination),r.start(n),r.stop(n+.18),C(240,.1,`triangle`,.09,e),C(150,.14,`sine`,.07,e+.03)}function Le(){Ie(0),Ie(.22)}function Re(e){if(!e){Me.forEach(e=>{try{e.stop()}catch{}}),Me=[];return}if(Pe(),Me.length)return;let t=Ne(),n=t.createOscillator(),r=t.createGain(),i=t.createBiquadFilter();n.type=`sine`,n.frequency.value=110,i.type=`lowpass`,i.frequency.value=420,r.gain.value=.025,n.connect(i),i.connect(r),r.connect(t.destination),n.start(),Me=[n]}function w(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function T({title:e=``,actions:t=``,playHref:n=`#/deck`}={}){return`
    <header class="site-header">
      <nav class="nav container" aria-label="Main">
        <a class="logo" href="#/" aria-label="GTKY home">
          <span class="logo-mark">♡</span>
          GTKY
        </a>
        <div class="nav-actions">
          ${e?`<span class="nav-kicker">${w(e)}</span>`:``}
          ${t}
        </div>
      </nav>
    </header>
  `}function E(){return`
    <a class="icon-button" href="#/" title="Home" aria-label="Home">←</a>
    <a class="icon-button" href="#/stats" title="Statistics" aria-label="Statistics">↗</a>
  `}function D(){return`
    <a class="icon-button" href="#/play" title="Bookshelf" aria-label="Back to bookshelf">←</a>
    <a class="icon-button" href="#/stats" title="Statistics" aria-label="Statistics">↗</a>
  `}function ze(){return`<a class="shelf-return" href="#/play">Return to bookshelf</a>`}function Be(e){return`<span class="dot ${w(e)}"></span>`}function Ve(e){return`<div class="starter-chips">${[`Honestly?`,`Hmm, maybe…`,`A tiny story:`,`I used to think…`].map(t=>`<button type="button" class="chip" data-act="prefill" data-target="${w(e)}" data-value="${w(t)}">${w(t)}</button>`).join(``)}</div>`}function He(){return`
    <button type="button" class="waiting-pup" data-act="pup-woof" aria-label="The cream pup is waiting with you. Tap to hear a bark.">
      <span class="pup-shadow"></span>
      <span class="bark-bubble">woof!</span>
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path class="pup-tail" d="M24 42c-14-6-18 10-8 16" stroke="#3d2418" stroke-width="4.5" stroke-linecap="round"/>
        <rect class="pup-leg pup-leg-bl" x="38" y="50" width="9" height="22" rx="4.5" fill="#fff6ea" stroke="#3d2418" stroke-width="2"/>
        <rect class="pup-leg pup-leg-br" x="52" y="50" width="9" height="22" rx="4.5" fill="#fff6ea" stroke="#3d2418" stroke-width="2"/>
        <ellipse cx="58" cy="42" rx="28" ry="17" fill="#fff6ea" stroke="#3d2418" stroke-width="2.6"/>
        <ellipse cx="44" cy="38" rx="8" ry="6" fill="#c4a07a"/>
        <rect class="pup-leg pup-leg-fl" x="64" y="50" width="9" height="22" rx="4.5" fill="#fff6ea" stroke="#3d2418" stroke-width="2"/>
        <rect class="pup-leg pup-leg-fr" x="78" y="50" width="9" height="22" rx="4.5" fill="#fff6ea" stroke="#3d2418" stroke-width="2"/>
        <g class="pup-head">
          <rect x="74" y="32" width="18" height="7" rx="3.5" fill="#5f82c4" stroke="#3d2418" stroke-width="1.6"/>
          <path d="M86 39l4 6 4-6" fill="#f3c56a" stroke="#3d2418" stroke-width="1.4" stroke-linejoin="round"/>
          <circle cx="96" cy="28" r="15" fill="#fff6ea" stroke="#3d2418" stroke-width="2.6"/>
          <ellipse class="pup-ear" cx="86" cy="24" rx="7" ry="13" fill="#3d2418" transform="rotate(-18 86 24)"/>
          <ellipse cx="107" cy="32" rx="8" ry="6" fill="#fff6ea" stroke="#3d2418" stroke-width="2.2"/>
          <circle cx="111" cy="31" r="2.1" fill="#3d2418"/>
          <circle cx="100" cy="24" r="1.9" fill="#3d2418"/>
          <ellipse class="pup-mouth" cx="110" cy="36" rx="2.2" ry="1.2" fill="#3d2418"/>
        </g>
      </svg>
    </button>`}function Ue(e){return{mode:`deck`,level:e,remaining:we(e),current:null,discarded:[],skipped:[],phase:`idle`,flipped:!1}}function We(e){return e.remaining=we(e.level),e.current=null,e.discarded=[],e.skipped=[],e.phase=`idle`,e.flipped=!1,e}function Ge(e){return Object.assign(e,Ue(e.level))}function Ke(e,t){e.remaining.length||(e.skipped.length?(e.remaining=[...e.skipped],e.skipped=[]):We(e));let[n,...r]=e.remaining;return e.remaining=r,e.current=n,e.phase=`show`,t?.(),n}function qe(e){e.current&&e.skipped.push(e.current),e.current=null,e.phase=`idle`,e.flipped=!1}function Je(e,t){e.current&&(t?.(e.current.level),e.discarded.push(e.current)),e.current=null,e.phase=`idle`,e.flipped=!1}var Ye={balanced:{id:`balanced`,label:`Balanced`,blurb:`Equal odds for every level.`,weights:{surface:25,personal:25,deep:25,together:25}},deeper:{id:`deeper`,label:`Getting Deeper`,blurb:`More personal, more deep.`,weights:{surface:15,personal:30,deep:30,together:25}},chaos:{id:`chaos`,label:`Chaos`,blurb:`The wheel leans into the deep end.`,weights:{surface:10,personal:25,deep:40,together:25}}},Xe=[`surface`,`personal`,`deep`,`together`];function Ze(e){let t=Ye[e]?.weights||Ye.balanced.weights,n=Xe.reduce((e,n)=>e+(t[n]||0),0),r=0;return Xe.map(e=>{let i=t[e]/n*360,a={level:e,start:r,sweep:i,end:r+i};return r+=i,a})}function Qe(e){let t=Ze(e),n={surface:`var(--surface)`,personal:`var(--personal)`,deep:`var(--deep)`,together:`var(--together)`};return t.map(e=>`${n[e.level]} ${e.start}deg ${e.end}deg`).join(`, `)}function $e(e=`balanced`){return{mode:`wheel`,preset:e,rotation:0,spinning:!1,current:null,lastLevel:null,phase:`ready`}}function et(e){let t=Ze(e.preset),n=Math.random()*360,r=`personal`;for(let e of t)if(n>=e.start&&n<e.end){r=e.level;break}let i=5+Math.floor(Math.random()*3),a=360-(t.find(e=>e.level===r).start+t.find(e=>e.level===r).sweep/2-0+360)%360,o=(Math.random()-.5)*Math.min(18,t.find(e=>e.level===r).sweep*.4);return e.rotation+=i*360+a+o-e.rotation%360,e.lastLevel=r,e.spinning=!0,e.phase=`spinning`,oe(),r}function tt(e){let t=S(Ce(e.lastLevel));return e.current=t,e.spinning=!1,e.phase=`show`,t}function nt(e,t){t&&e.current&&b(e.current.level),e.current=null,e.phase=`ready`}function rt(){return{p1:``,p2:``,startedAt:Date.now(),entries:[],notes:{n1:``,n2:``}}}function it(e){e.journal||=rt(),e.journal.p1=e.player1,e.journal.p2=e.player2,e.journal.entries.push({round:e.round,style:e.currentStyle,q1:e.q1,q2:e.q2,a1:e.a1,a2:e.a2})}function at(e){e.journal||=rt(),e.journal.notes={n1:e.note1||``,n2:e.note2||``}}function ot(e){if(!e?.entries?.length&&!e?.notes?.n1&&!e?.notes?.n2)return;let t=JSON.parse(JSON.stringify(e));t.savedAt=Date.now(),v(e=>{e.zines=[t,...e.zines||[]].slice(0,12)})}function st(){return g().zines||[]}var ct={same:{id:`same`,label:`Same`,emoji:`💞`,blurb:`You both answer the same question.`},predict:{id:`predict`,label:`Predict`,emoji:`🪞`,blurb:`Guess how they would answer.`},different:{id:`different`,label:`Different`,emoji:`🔀`,blurb:`Each of you gets a different question.`},connect:{id:`connect`,label:`Connect`,emoji:`🤝`,blurb:`Different questions, same category.`},match:{id:`match`,label:`Match`,emoji:`🎯`,blurb:`A binary choice. Do you pick alike?`},mix:{id:`mix`,label:`Mix`,emoji:`🎲`,blurb:`A surprise mechanic each round.`}},lt=[`same`,`predict`,`different`,`connect`,`match`];function ut({player1:e,player2:t,level:n,style:r,online:i=!1,role:a=`local`,roomCode:o=``}){return se(),{mode:`duo`,player1:e,player2:t,level:n,style:r,online:i,role:a,roomCode:o,peerStatus:i?`hosting`:`idle`,round:0,phase:i?`lobby`:`handoff`,turn:1,currentStyle:r===`mix`?S(lt):r,q1:null,q2:null,a1:``,a2:``,ready1:!1,ready2:!1,scored:null,note1:``,note2:``,journal:{...rt(),p1:e,p2:t}}}function dt(e){return e.style===`mix`?S(lt):e.style}function ft(e){if(e.round+=1,e.currentStyle=dt(e),e.a1=``,e.a2=``,e.scored=null,e.ready1=!1,e.ready2=!1,e.turn=1,e.phase=e.online?`answer`:`handoff`,e.currentStyle===`connect`){let t=Ee(e.level);if(t)return[e.q1,e.q2]=t,e;e.currentStyle=`different`}if(e.currentStyle===`different`){let t=Te(e.level,`different`);return e.q1=S(t),e.q2=S(t.filter(t=>t.id!==e.q1?.id))||e.q1,e}if(e.currentStyle===`match`){let t=S(Te(e.level,`match`).filter(e=>e.choices?.length===2))||S(Te(e.level,`same`));return e.q1=t,e.q2=t,e}let t=S(Te(e.level,e.currentStyle));return e.q1=t,e.q2=t,e}function pt(e){return e.turn===1?e.q1:e.q2}function mt(e){let t=pt(e);return t?e.currentStyle===`predict`&&e.turn===1?`What do you think ${e.player2}'s answer is?\n\n${t.question}`:t.question:``}function ht(e,t){if(e.turn===1){e.a1=t,e.turn=2,e.phase=`handoff`;return}e.a2=t,e.phase=`reveal`,e.q1&&b(e.q1.level),e.q2&&e.q2.id!==e.q1?.id&&b(e.q2.level),it(e)}function gt(e,t){let n=t===1?e.q1:e.q2;return n?e.currentStyle===`predict`&&t===1?`What do you think ${e.player2}'s answer is?\n\n${n.question}`:n.question:``}function O(e){return e.role===`guest`?2:1}function _t(e,t,n){return t===1?(e.a1=n,e.ready1=!0):(e.a2=n,e.ready2=!0),e.ready1&&e.ready2?(e.phase=`reveal`,e.q1&&b(e.q1.level),e.q2&&e.q2.id!==e.q1?.id&&b(e.q2.level),it(e),`reveal`):(e.phase=`waiting`,`waiting`)}function vt(e){e.phase=`note-write`,e.ready1=!1,e.ready2=!1}function yt(e,t,n){let r=String(n||``).trim();return t===1?(e.note1=r,e.ready1=!0):(e.note2=r,e.ready2=!0),e.ready1&&e.ready2?(e.phase=`note-reveal`,`reveal`):(e.phase=`note-waiting`,`waiting`)}function bt(e,t){if(e.currentStyle===`predict`&&t.predictionScoring){let t=xt(e.a1)===xt(e.a2)&&e.a1.trim()!==``;return ce(t),{kind:`predict`,matched:t}}if(e.currentStyle===`match`){let t=e.a1&&e.a1===e.a2;return le(t),{kind:`match`,same:t}}return{kind:e.currentStyle}}function xt(e){return String(e||``).trim().toLowerCase()}function St(e){e.phase=`handoff`,ft(e)}function Ct(e){e.phase=`note-handoff`,e.turn=1}function wt(e){e.phase=`note-write`}function Tt(e,t){let n=String(t||``).trim();if(e.turn===1){e.note1=n,e.turn=2,e.phase=`note-handoff`;return}e.note2=n,e.phase=`note-reveal`}function Et(){return g().paused||null}function Dt(e,t){if(!t)return;let n=JSON.parse(JSON.stringify(t));n.current&&n.mode===`deck`&&n.phase===`show`&&(n.remaining=[n.current,...n.remaining||[]],n.current=null,n.phase=`idle`,n.flipped=!1),n.mode===`wheel`&&n.phase===`show`&&n.current&&(n.phase=`ready`,n.current=null),n.spinning=!1,n.mode===`evenodd`&&n.phase===`spinning`&&(n.phase=`ready`),n.peerStatus=n.online?n.peerStatus:`idle`,v(t=>{t.paused={route:e,session:n,savedAt:Date.now()}})}function k(){v(e=>{e.paused=null})}var Ot=`modulepreload`,kt=function(e,t){return new URL(e,t).href},At={},jt=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=kt(t,n),t=s(t),t in At)return;At[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:Ot,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},Mt=`gtky-`,Nt=`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`,A=null,Pt=null,Ft=new Map,It=()=>{},j=()=>{},Lt=5;function Rt(e=5){let t=``,n=new Uint8Array(e);crypto.getRandomValues(n);for(let e of n)t+=Nt[e%32];return t}function zt(e){let t=new URL(window.location.href);return t.hash=`#/lobby?join=${e}`,t.toString()}function M(e){let t={...e,_from:A?.id||`local`};if(Pt===`host`)for(let e of Ft.values())e.open&&e.send(t);else{let e=[...Ft.values()][0];e?.open&&e.send(t)}}function Bt(){for(let e of Ft.values())try{e.close()}catch{}Ft.clear();try{A?.destroy()}catch{}A=null,Pt=null}var Vt=null,Ht=null;function Ut(){return Vt?Promise.resolve(Vt):(Ht||=jt(()=>import(`./bundler-D6nAnZf1.js`).then(e=>(Vt=e.default,Vt)),[],import.meta.url),Ht)}function Wt(e,{relay:t}={}){let n=e.peer;Ft.set(n,e),e.on(`data`,e=>{if(t&&Pt===`host`)for(let[t,r]of Ft)t!==n&&r.open&&r.send({...e,_from:e?._from||n});It(e,n)}),e.on(`close`,()=>{Ft.delete(n),j(`peer-left`,n)}),e.on(`error`,()=>j(`error`,`A connection hiccuped.`)),e.on(`open`,()=>j(`peer-open`,n)),e.open&&j(`peer-open`,n)}function Gt(e,t,{size:n=4}={}){return Bt(),Pt=`host`,Lt=Math.max(1,Number(n)||4),It=t.onMessage,j=t.onStatus,j(`hosting`),Ut().then(t=>{Pt===`host`&&(A=new t(Mt+e,{debug:0}),A.on(`open`,()=>j(`waiting`)),A.on(`connection`,e=>{if(Ft.size>=Lt+4){try{e.close()}catch{}return}Wt(e,{relay:!0})}),A.on(`error`,e=>{j(`error`,e?.message||`Could not open a room.`)}))}).catch(e=>{j(`error`,e?.message||`Could not open a room.`)}),e}function Kt(e,t){Bt(),Pt=`guest`,It=t.onMessage,j=t.onStatus,j(`connecting`),Ut().then(t=>{Pt===`guest`&&(A=new t({debug:0}),A.on(`open`,()=>{Wt(A.connect(Mt+e,{reliable:!0}),{relay:!1})}),A.on(`error`,e=>{j(`error`,e?.message||`Could not join that room.`)}))}).catch(e=>{j(`error`,e?.message||`Could not join that room.`)})}var qt=o(((e,t)=>{var n=(function(){var e=String.fromCharCode,t=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=`,n=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$`,r={};function i(e,t){if(!r[e]){r[e]={};for(var n=0;n<e.length;n++)r[e][e.charAt(n)]=n}return r[e][t]}var a={compressToBase64:function(e){if(e==null)return``;var n=a._compress(e,6,function(e){return t.charAt(e)});switch(n.length%4){default:case 0:return n;case 1:return n+`===`;case 2:return n+`==`;case 3:return n+`=`}},decompressFromBase64:function(e){return e==null?``:e==``?null:a._decompress(e.length,32,function(n){return i(t,e.charAt(n))})},compressToUTF16:function(t){return t==null?``:a._compress(t,15,function(t){return e(t+32)})+` `},decompressFromUTF16:function(e){return e==null?``:e==``?null:a._decompress(e.length,16384,function(t){return e.charCodeAt(t)-32})},compressToUint8Array:function(e){for(var t=a.compress(e),n=new Uint8Array(t.length*2),r=0,i=t.length;r<i;r++){var o=t.charCodeAt(r);n[r*2]=o>>>8,n[r*2+1]=o%256}return n},decompressFromUint8Array:function(t){if(t==null)return a.decompress(t);for(var n=Array(t.length/2),r=0,i=n.length;r<i;r++)n[r]=t[r*2]*256+t[r*2+1];var o=[];return n.forEach(function(t){o.push(e(t))}),a.decompress(o.join(``))},compressToEncodedURIComponent:function(e){return e==null?``:a._compress(e,6,function(e){return n.charAt(e)})},decompressFromEncodedURIComponent:function(e){return e==null?``:e==``?null:(e=e.replace(/ /g,`+`),a._decompress(e.length,32,function(t){return i(n,e.charAt(t))}))},compress:function(t){return a._compress(t,16,function(t){return e(t)})},_compress:function(e,t,n){if(e==null)return``;for(var r,i,a={},o={},s=``,c=``,l=``,u=2,d=3,f=2,p=[],m=0,h=0,g=0;g<e.length;g+=1)if(s=e.charAt(g),Object.prototype.hasOwnProperty.call(a,s)||(a[s]=d++,o[s]=!0),c=l+s,Object.prototype.hasOwnProperty.call(a,c))l=c;else{if(Object.prototype.hasOwnProperty.call(o,l)){if(l.charCodeAt(0)<256){for(r=0;r<f;r++)m<<=1,h==t-1?(h=0,p.push(n(m)),m=0):h++;for(i=l.charCodeAt(0),r=0;r<8;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1}else{for(i=1,r=0;r<f;r++)m=m<<1|i,h==t-1?(h=0,p.push(n(m)),m=0):h++,i=0;for(i=l.charCodeAt(0),r=0;r<16;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1}u--,u==0&&(u=2**f,f++),delete o[l]}else for(i=a[l],r=0;r<f;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1;u--,u==0&&(u=2**f,f++),a[c]=d++,l=String(s)}if(l!==``){if(Object.prototype.hasOwnProperty.call(o,l)){if(l.charCodeAt(0)<256){for(r=0;r<f;r++)m<<=1,h==t-1?(h=0,p.push(n(m)),m=0):h++;for(i=l.charCodeAt(0),r=0;r<8;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1}else{for(i=1,r=0;r<f;r++)m=m<<1|i,h==t-1?(h=0,p.push(n(m)),m=0):h++,i=0;for(i=l.charCodeAt(0),r=0;r<16;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1}u--,u==0&&(u=2**f,f++),delete o[l]}else for(i=a[l],r=0;r<f;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1;u--,u==0&&(u=2**f,f++)}for(i=2,r=0;r<f;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1;for(;;){if(m<<=1,h==t-1){p.push(n(m));break}h++}return p.join(``)},decompress:function(e){return e==null?``:e==``?null:a._decompress(e.length,32768,function(t){return e.charCodeAt(t)})},_decompress:function(t,n,r){var i=[],a=4,o=4,s=3,c=``,l=[],u,d,f,p,m,h,g,_={val:r(0),position:n,index:1};for(u=0;u<3;u+=1)i[u]=u;for(f=0,m=4,h=1;h!=m;)p=_.val&_.position,_.position>>=1,_.position==0&&(_.position=n,_.val=r(_.index++)),f|=+(p>0)*h,h<<=1;switch(f){case 0:for(f=0,m=256,h=1;h!=m;)p=_.val&_.position,_.position>>=1,_.position==0&&(_.position=n,_.val=r(_.index++)),f|=+(p>0)*h,h<<=1;g=e(f);break;case 1:for(f=0,m=2**16,h=1;h!=m;)p=_.val&_.position,_.position>>=1,_.position==0&&(_.position=n,_.val=r(_.index++)),f|=+(p>0)*h,h<<=1;g=e(f);break;case 2:return``}for(i[3]=g,d=g,l.push(g);;){if(_.index>t)return``;for(f=0,m=2**s,h=1;h!=m;)p=_.val&_.position,_.position>>=1,_.position==0&&(_.position=n,_.val=r(_.index++)),f|=+(p>0)*h,h<<=1;switch(g=f){case 0:for(f=0,m=256,h=1;h!=m;)p=_.val&_.position,_.position>>=1,_.position==0&&(_.position=n,_.val=r(_.index++)),f|=+(p>0)*h,h<<=1;i[o++]=e(f),g=o-1,a--;break;case 1:for(f=0,m=2**16,h=1;h!=m;)p=_.val&_.position,_.position>>=1,_.position==0&&(_.position=n,_.val=r(_.index++)),f|=+(p>0)*h,h<<=1;i[o++]=e(f),g=o-1,a--;break;case 2:return l.join(``)}if(a==0&&(a=2**s,s++),i[g])c=i[g];else if(g===o)c=d+d.charAt(0);else return null;l.push(c),i[o++]=d+c.charAt(0),a--,d=c,a==0&&(a=2**s,s++)}}};return a})();typeof define==`function`&&define.amd?define(function(){return n}):t!==void 0&&t!=null?t.exports=n:typeof angular<`u`&&angular!=null&&angular.module(`LZString`,[]).factory(`LZString`,function(){return n})}))();function Jt(e){return(0,qt.compressToEncodedURIComponent)(JSON.stringify(e))}function Yt(e){try{return JSON.parse((0,qt.decompressFromEncodedURIComponent)(e))}catch{return null}}function Xt(e){let t=Jt(e),n=new URL(window.location.href);return n.hash=`#/zine?d=${t}`,{url:n.toString(),packed:t,tooLong:t.length>1400}}async function Zt(e){let{default:t}=await jt(async()=>{let{default:e}=await import(`./browser-BWwaKOdt.js`).then(e=>l(e.default,1));return{default:e}},[],import.meta.url);return t.toDataURL(e,{margin:1,width:280,color:{dark:`#c43a5a`,light:`#fff8f5`}})}function Qt(e){let t=en(e),n=new Blob([t],{type:`text/html`}),r=document.createElement(`a`);r.href=URL.createObjectURL(n),r.download=`gtky-about-us-${$t(e.p1)}-${$t(e.p2)}.html`,r.click(),URL.revokeObjectURL(r.href)}function $t(e){return String(e||`player`).toLowerCase().replace(/[^a-z0-9]+/g,`-`).slice(0,24)}function en(e){return`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>About us — ${w(e.p1)} & ${w(e.p2)}</title>
<style>
  body{margin:0;background:#fff8f5;color:#2a2422;font-family:Nunito,system-ui,sans-serif;padding:32px 18px}
  h1{font-size:clamp(2rem,7vw,3.4rem);letter-spacing:-.04em}
  .card{background:#fff;border:1px solid #f0ddd8;border-radius:20px;padding:22px;margin:18px 0;box-shadow:0 2px 12px rgba(42,36,34,.06)}
  .card:nth-child(even){box-shadow:inset 8px 0 0 #d7eaf7,0 2px 12px rgba(42,36,34,.06)}
  .who{font-family:Nunito,system-ui,sans-serif;font-size:.8rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#7a6f6a}
  q{display:block;font-size:1.35rem;margin:.4rem 0 1rem}
</style></head><body>
<h1>About us ♡</h1>
<p>${w(e.p1)} & ${w(e.p2)} · GTKY · for a pair of blues</p>
${(e.entries||[]).map(t=>`
  <article class="card">
    <p class="who">${w(e.p1)}</p>
    <q>${w(t.q1?.question||``)}</q>
    <p>${w(t.a1||``)}</p>
    <p class="who" style="margin-top:1.2rem">${w(e.p2)}</p>
    <q>${w(t.q2?.question||``)}</q>
    <p>${w(t.a2||``)}</p>
  </article>`).join(``)}
${e.notes?.n1||e.notes?.n2?`
  <article class="card">
    <p class="who">Notes</p>
    <p><strong>${w(e.p1)}:</strong> ${w(e.notes.n1||`—`)}</p>
    <p><strong>${w(e.p2)}:</strong> ${w(e.notes.n2||`—`)}</p>
  </article>`:``}
</body></html>`}function N(e=`hearts`){if(document.documentElement.classList.contains(`no-anim`)||window.matchMedia(`(prefers-reduced-motion: reduce)`).matches)return;let t=document.createElement(`div`);t.className=`burst-layer`;let n=e===`stars`?[`✦`,`✧`,`⋆`]:e===`party`?[`♡`,`✦`,`★`,`✿`,`⋆`]:[`♡`,`♥`,`♡`],r=e===`party`?16:10;for(let e=0;e<r;e+=1){let r=document.createElement(`span`);r.textContent=n[e%n.length],r.style.setProperty(`--x`,`${(Math.random()*80+10).toFixed(1)}vw`),r.style.setProperty(`--d`,`${(.8+Math.random()*1.2).toFixed(2)}s`),r.style.setProperty(`--s`,`${(.8+Math.random()*1.1).toFixed(2)}`),e%3==0&&r.classList.add(`is-blue`),t.append(r)}document.body.append(t),setTimeout(()=>t.remove(),2200)}var tn=[{id:`deck`,title:`The Deck`,kicker:`draw a card`,color:`#7a4e32`},{id:`wheel`,title:`The Wheel`,kicker:`let it choose`,color:`#c4842c`},{id:`sip`,title:`One Page`,kicker:`just one question`,color:`#6b8a4a`},{id:`nightstand`,title:`The Nightstand`,kicker:`three, then lights out`,color:`#2c4a6b`},{id:`coffee`,title:`Coffee Stains`,kicker:`surface, cozy`,color:`#c47a50`},{id:`midnight`,title:`Midnight Chapter`,kicker:`deep only`,color:`#3d2418`},{id:`morning`,title:`Morning Page`,kicker:`one with coffee`,color:`#c4842c`},{id:`letter`,title:`Unopened Letter`,kicker:`seal for a week`,color:`#5a2c48`},{id:`later`,title:`For Later`,kicker:`the flinch pile`,color:`#4a3a6b`},{id:`category`,title:`Category Night`,kicker:`one shelf only`,color:`#2c4a6b`}],nn=[{id:`duo`,title:`Two of Us`,kicker:`guess & match`,color:`#5a2c48`},{id:`evenodd`,title:`Even & Odd`,kicker:`roulette 1–32`,color:`#1f2a44`,featured:!0},{id:`mug`,title:`Pass the Mug`,kicker:`same question, both`,color:`#8a5a3c`},{id:`dare`,title:`Truth or Dare`,kicker:`kind slips`,color:`#8a2f1e`},{id:`hotseat`,title:`Hot Seat`,kicker:`five, then pass`,color:`#c44a28`},{id:`never`,title:`Never Have I`,kicker:`fingers, then stories`,color:`#3f4a8c`},{id:`bookmark`,title:`The Bookmark`,kicker:`plant a question`,color:`#6b8a4a`},{id:`postcards`,title:`Postcards`,kicker:`sixty seconds each`,color:`#5f82c4`},{id:`whosaid`,title:`Who Said It`,kicker:`old notes, new guess`,color:`#7a4e32`},{id:`slowdance`,title:`Slow Dance`,kicker:`one deep question`,color:`#3d2418`}],rn=[{title:`Firebird`,author:`Kathy Tyers`,color:`#8a2f1e`,set:!0},{title:`Fusion Fire`,author:`Kathy Tyers`,color:`#a33a22`,set:!0},{title:`Crown of Fire`,author:`Kathy Tyers`,color:`#c44a28`,set:!0},{title:`Letters of Enchantment`,author:`Rebecca Ross`,color:`#3f4a8c`,wide:!0},{title:`Six of Crows`,author:`Leigh Bardugo`,color:`#1f2a44`,wide:!0},{title:`A Time to Die`,author:`Out of Time · Nadine Brandes`,color:`#2c4a6b`,set:!0},{title:`A Time to Speak`,author:`Out of Time · Nadine Brandes`,color:`#3a5a7a`,set:!0},{title:`A Time to Rise`,author:`Out of Time · Nadine Brandes`,color:`#4a6a8a`,set:!0},{title:`The False Prince`,author:`Jennifer A. Nielsen`,color:`#5a2c48`,wide:!0},{title:`(I love you)`,author:`for her`,color:`love`,love:!0}],an=[`#6b4e32`,`#8a2f1e`,`#c4842c`,`#4a5a38`,`#3d2418`,`#5f82c4`,`#7a4e32`,`#2c4a6b`,`#5a2c48`,`#8a5a3c`,`#c47a50`,`#4a3a6b`,`#1f2a44`,`#6b8a4a`,`#a33a22`,`#3f4a8c`,`#7a6248`,`#c44a28`,`#5a3828`,`#2c3a4a`];function on(e,t=0){return Array.from({length:e},(e,n)=>({color:an[(n+t)%an.length],height:108+(n*13+t*5)%42}))}function sn(e){return[`deck`,`wheel`,`duo`,`evenodd`,`mug`,`nightstand`,`sip`,`dare`,`hotseat`,`never`,`bookmark`,`postcards`,`whosaid`,`slowdance`,`morning`,`letter`,`later`,`category`].includes(e)}function cn(){return document.documentElement.classList.contains(`no-anim`)||window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function ln(){return g().veto||[]}function un(e){e&&v(t=>{let n=new Set(t.veto||[]);n.add(e),t.veto=[...n]})}function dn(e){v(t=>{t.veto=(t.veto||[]).filter(t=>t!==e)})}function fn(){return g().later||[]}function pn(e){e?.id&&v(t=>{let n=t.later||[];n.some(t=>t.id===e.id)||(t.later=[{...e,pinnedAt:Date.now()},...n].slice(0,80))})}function mn(e){v(t=>{t.later=(t.later||[]).filter(t=>t.id!==e)})}function hn(){return g().letter||null}function gn(e){let t=Date.now();return v(n=>{n.letter={card:e,sealedAt:t,openAt:t+6048e5}}),g().letter}function _n(){v(e=>{e.letter=null})}function vn(e=hn()){return e?Date.now()>=e.openAt:!1}function yn(){return g().morning||{streak:0,lastDay:0,lastCard:null}}function bn(e=Date.now()){return Math.floor(e/864e5)}function xn(e){let t=bn();return v(n=>{let r=n.morning||{streak:0,lastDay:0,lastCard:null},i=r.lastDay===t-1;n.morning={streak:r.lastDay===t?r.streak:i?r.streak+1:1,lastDay:t,lastCard:e}}),g().morning}function Sn(){return yn().lastDay===bn()}function Cn(){return g().lastNight||null}function wn(e){v(t=>{t.lastNight={...t.lastNight||{},...e,savedAt:Date.now()}})}function Tn(){return{lockDeep:!1,skipAllowed:!0,dares:!0}}function En(e){return{...Tn(),...e?.rules||{}}}function Dn({code:e,role:t,size:n,name:r}){return{code:e,role:t,size:Number(n)||4,status:t===`host`?`hosting`:`connecting`,members:[{id:`self`,name:r,host:t===`host`}],error:``,qr:``,rules:Tn()}}function On(e,t){let n=e.members.findIndex(e=>e.id===t.id||e.name===t.name);n>=0?e.members[n]={...e.members[n],...t}:e.members.push(t)}function kn(e,t){e.members=e.members.filter(e=>e.id!==t)}function An(e){v(t=>{t.lastRoomCode=e})}function jn(){return g().lastRoomCode||``}function Mn(e){return(e?.members||[]).map(e=>e.name).filter(Boolean)}var Nn=[`#8a2f1e`,`#c4842c`,`#3f4a8c`,`#5a2c48`,`#2c4a6b`,`#6b8a4a`,`#c47a50`,`#4a3a6b`,`#1f2a44`,`#7a4e32`];function P(){return g().albums||[]}function F(e){return P().find(t=>t.id===e)||null}function I(e){return v(t=>{let n=t.albums||[],r=n.findIndex(t=>t.id===e.id);e.updatedAt=Date.now(),r>=0?n[r]=e:n.push(e),t.albums=n}),e}function Pn(){v(e=>{e.albums=[]})}function Fn(e,t){return I({id:`alb-${Date.now().toString(36)}`,title:String(e||`Untitled`).slice(0,48),color:t||Nn[Math.floor(Math.random()*Nn.length)],favorite:!1,createdAt:Date.now(),updatedAt:Date.now(),pages:[In(),In()]})}function In(){return{items:[]}}function Ln(e,t){let n=(t+1)*2;for(;e.pages.length<n;)e.pages.push(In());return e}function Rn(e,t,n){return Ln(e,Math.floor(t/2)),e.pages[t].items.push(n),I(e)}function zn(e,t,n,r){let i=e.pages[t];return i?(i.items=i.items.map(e=>e.id===n?{...e,...r}:e),I(e)):e}function Bn(e,t,n){let r=e.pages[t];return r?(r.items=r.items.filter(e=>e.id!==n),I(e)):e}function Vn(e,t={}){return{id:`it-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`,type:e,x:t.x??12,y:t.y??16,w:t.w??40,h:t.h??28,...t}}function Hn(e,t,n={}){return e===`sticker`?Vn(`sticker`,{glyph:qn.find(e=>e.id===t)?.glyph||`♡`,w:14,h:12,...n}):e===`text`?Vn(`text`,{style:t,text:`Write something sweet.`,w:42,h:14,...n}):e===`sticky`?Vn(`sticky`,{color:Yn.find(e=>e.id===t)?.color,text:`a little note`,w:30,h:18,...n}):e===`photo`?Vn(`photo`,{src:n.src||``,w:t===`wide`?56:40,h:34,...n}):e===`recipe`?Vn(`recipe`,{heading:`RECIPE`,text:`for us.`,w:32,h:28,...n}):e===`voice`?Vn(`voice`,{src:n.src||``,text:n.text||`Voice memo`,w:44,h:16,...n}):null}function Un(e=P()){return{kind:`gtky-albums`,version:1,exportedAt:Date.now(),albums:e}}function Wn(e){let t=e?.albums||(e?.kind===`gtky-albums`?e.albums:null)||(Array.isArray(e)?e:null);if(!t?.length)throw Error(`That file doesn’t look like a GTKY album.`);v(e=>{let n=new Set((e.albums||[]).map(e=>e.id)),r=[...e.albums||[]];for(let e of t)e?.id&&Array.isArray(e.pages)&&(n.has(e.id)&&(e.id=`${e.id}-copy-${Date.now().toString(36)}`,e.title=`${e.title||`Album`} (copy)`),r.push(e),n.add(e.id));e.albums=r})}function Gn(e=P()){let t=new Blob([JSON.stringify(Un(e),null,2)],{type:`application/json`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`gtky-albums-${new Date().toISOString().slice(0,10)}.json`,r.click(),URL.revokeObjectURL(n)}async function Kn(e){let t=await createImageBitmap(e),n=Math.min(1,900/Math.max(t.width,t.height)),r=document.createElement(`canvas`);return r.width=Math.max(1,Math.round(t.width*n)),r.height=Math.max(1,Math.round(t.height*n)),r.getContext(`2d`).drawImage(t,0,0,r.width,r.height),r.toDataURL(`image/jpeg`,.72)}var qn=[{id:`heart`,glyph:`♡`,label:`Heart`},{id:`star`,glyph:`★`,label:`Star`},{id:`spark`,glyph:`✦`,label:`Spark`},{id:`moon`,glyph:`☾`,label:`Moon`},{id:`paw`,glyph:`🐾`,label:`Paw`},{id:`flower`,glyph:`✿`,label:`Flower`},{id:`honey`,glyph:`🍯`,label:`Honey`},{id:`bow`,glyph:`🎀`,label:`Bow`}],Jn=[{id:`heading`,label:`Heading`},{id:`script`,label:`Handwriting`},{id:`caption`,label:`Caption`},{id:`tape`,label:`Tape label`}],Yn=[{id:`honey`,color:`#f3c56a`,label:`Honey`},{id:`rose`,color:`#f3d0c4`,label:`Blush`},{id:`mint`,color:`#d5e8c8`,label:`Mint`},{id:`sky`,color:`#d7e4f7`,label:`Sky`},{id:`cream`,color:`#fff8ea`,label:`Cream`}];function Xn({albums:e,filter:t,album:n,spread:r,tray:i,selected:a,creating:o}){let s=t===`favorites`?e.filter(e=>e.favorite):e;return o?Zn():n?$n(n,r,i,a):Qn(s,t,e.length)}function Zn(){return`
    <div class="album-desk">
      <div class="open-book" aria-label="New album">
        ${nr()}
        <div class="book-spread">
          <section class="leaf leaf--left">
            <p class="hello">New album</p>
            <h1>Give it a title.</h1>
            <p class="muted">This becomes the spine on the skinny shelf.</p>
            <form id="album-create">
              <div class="field">
                <label for="album-title">Title</label>
                <input id="album-title" name="title" maxlength="48" required placeholder="(I love you)" />
              </div>
              <button class="button button--dark button--large" type="submit">Open the book →</button>
            </form>
          </section>
          <section class="leaf leaf--right leaf--blank">
            <p class="muted center">Blank pages waiting.</p>
          </section>
        </div>
      </div>
      ${rr({tray:`create`,library:!0})}
    </div>`}function Qn(e,t,n){return`
    <div class="album-desk">
      <div class="open-book">
        ${nr()}
        <div class="book-spread">
          <section class="leaf leaf--left">
            <div class="frame-ornament">
              <p class="hello">Albums</p>
              <h2>${n?`Your little library.`:`No albums yet.`}</h2>
              <p>${n?`Open a spine, or create a new book.`:`Tap Create. Name a book. Fill it with photos and scraps.`}</p>
            </div>
            <div class="album-grid">
              ${e.length?e.map(e=>`
                    <button type="button" class="album-tile" data-act="album-open" data-value="${w(e.id)}" style="--spine:${e.color}">
                      <b>${w(e.title)}</b>
                      <small>${e.pages.length} pages${e.favorite?` · ★`:``}</small>
                    </button>`).join(``):`<p class="muted">Nothing in ${t===`favorites`?`favorites`:`all albums`} yet.</p>`}
            </div>
          </section>
          <section class="leaf leaf--right">
            <div class="recipe-pad" aria-hidden="true">
              <p>RECIPE</p>
              <span></span><span></span><span></span>
            </div>
            <p class="muted">Import a JSON keepsake, or export before you close the night.</p>
          </section>
        </div>
      </div>
      ${rr({tray:null,library:!0,filter:t})}
    </div>`}function $n(e,t,n,r){let i=e.pages[t*2]||{items:[]},a=e.pages[t*2+1]||{items:[]};return`
    <div class="album-desk is-editing">
      <div class="open-book is-editing">
        ${nr()}
        <div class="book-spread">
          ${er(i,t*2,`left`,r)}
          ${er(a,t*2+1,`right`,r)}
        </div>
        <div class="page-nav">
          <button type="button" class="button" data-act="album-prev" ${t===0?`disabled`:``}>← Previous</button>
          <span>Pages ${t*2+1}–${t*2+2}</span>
          <button type="button" class="button button--dark" data-act="album-next">Next page →</button>
        </div>
      </div>
      ${rr({tray:n,library:!1,album:e,filter:`all`,selected:r})}
    </div>`}function er(e,t,n,r){return`
    <section class="leaf leaf--${n}" data-page="${t}">
      <div class="leaf-canvas" data-page="${t}">
        ${e.items.map(e=>tr(e,t,r)).join(``)}
      </div>
    </section>`}function tr(e,t,n){let r=n===e.id?` is-on`:``,i=`left:${e.x}%;top:${e.y}%;width:${e.w}%;`;return e.type===`photo`?`
      <figure class="scrap scrap--photo${r}" data-item="${e.id}" data-page="${t}" style="${i}">
        ${e.noteAbove?`<figcaption class="sticky sticky--above" style="background:${e.noteColor||`#f3c56a`}">${w(e.noteAbove)}</figcaption>`:``}
        ${e.src?`<img src="${e.src}" alt="" draggable="false" decoding="async" />`:`<button type="button" class="photo-hole" data-act="album-photo" data-page="${t}" data-item="${e.id}">Add a photo</button>`}
        ${e.noteBelow?`<figcaption class="sticky sticky--below" style="background:${e.noteColor||`#f3c56a`}">${w(e.noteBelow)}</figcaption>`:``}
      </figure>`:e.type===`text`?`<div class="scrap scrap--text scrap--${e.style||`caption`}${r}" data-item="${e.id}" data-page="${t}" style="${i}" contenteditable="true" spellcheck="false">${w(e.text||`Write here`)}</div>`:e.type===`sticky`?`<div class="scrap scrap--sticky${r}" data-item="${e.id}" data-page="${t}" style="${i};background:${e.color||`#f3c56a`}" contenteditable="true" spellcheck="false">${w(e.text||`a little note`)}</div>`:e.type===`sticker`?`<div class="scrap scrap--sticker${r}" data-item="${e.id}" data-page="${t}" style="${i}">${e.glyph||`♡`}</div>`:e.type===`recipe`?`<div class="scrap scrap--recipe${r}" data-item="${e.id}" data-page="${t}" style="${i}"><b>${w(e.heading||`RECIPE`)}</b><p contenteditable="true" spellcheck="false">${w(e.text||``)}</p></div>`:e.type===`voice`?`<div class="scrap scrap--voice${r}" data-item="${e.id}" data-page="${t}" style="${i}">
      <b>Voice</b>
      ${e.src?`<audio controls src="${e.src}"></audio>`:`<span class="muted">Hold to record</span>`}
    </div>`:``}function nr(){return`
    <div class="book-ribbons" aria-hidden="true">
      <span class="ribbon r-red"></span>
      <span class="ribbon r-blue"></span>
      <span class="ribbon r-green"></span>
    </div>`}function rr({tray:e,library:t,filter:n,album:r,selected:i}){return`
    <aside class="album-tools">
      <button type="button" class="tape-btn ${n===`all`||t?`is-on`:``}" data-act="album-filter" data-value="all">All</button>
      <button type="button" class="tape-btn ${n===`favorites`?`is-on`:``}" data-act="album-filter" data-value="favorites">FAVORITES</button>
      <button type="button" class="tape-btn tape-clear" data-act="album-clear">(clear albums)</button>
      <button type="button" class="tape-btn tape-star" data-act="album-star" ${r?``:`disabled`} aria-label="Favorite">★</button>
      <button type="button" class="tape-btn" data-act="album-cancel">Cancel</button>
      <button type="button" class="tape-btn tape-create" data-act="album-new">Create</button>
      <button type="button" class="tape-btn" data-act="album-print">Print this spread</button>
      ${t?`<div class="recipe-pad small"><p>RECIPE</p><span></span><span></span></div>`:`
        <p class="tray-hint">Drag these onto a page. On a phone, tap to add.</p>
        <button type="button" class="tape-btn" data-act="album-delete">Remove selected</button>
        <div class="tool-stack">
          <p class="tray-label">Stickers</p>
          ${ir()}
          <p class="tray-label">Text</p>
          ${ar()}
          <p class="tray-label">Notes</p>
          ${or()}
          <p class="tray-label">Photos</p>
          ${sr()}
          <p class="tray-label">Voice</p>
          <div class="tray"><button type="button" class="tray-item" data-act="album-add" data-kind="voice" data-value="memo">10s memo</button></div>
        </div>`}
    </aside>`}function ir(){return`<div class="tray">${qn.map(e=>`<button type="button" class="tray-item" data-act="album-add" data-kind="sticker" data-value="${e.id}" title="${e.label}">${e.glyph}</button>`).join(``)}</div>`}function ar(){return`<div class="tray">${Jn.map(e=>`<button type="button" class="tray-item" data-act="album-add" data-kind="text" data-value="${e.id}">${w(e.label)}</button>`).join(``)}</div>`}function or(){return`<div class="tray">${Yn.map(e=>`<button type="button" class="tray-item" data-act="album-add" data-kind="sticky" data-value="${e.id}" style="background:${e.color}">${w(e.label)}</button>`).join(``)}
    <button type="button" class="tray-item" data-act="album-add" data-kind="recipe" data-value="recipe">Recipe card</button>
    <button type="button" class="tray-item" data-act="album-note" data-value="above">Note above photo</button>
    <button type="button" class="tray-item" data-act="album-note" data-value="below">Note below photo</button>
  </div>`}function sr(){return`<div class="tray">
    <button type="button" class="tray-item" data-act="album-add" data-kind="photo" data-value="polaroid">Polaroid</button>
    <button type="button" class="tray-item" data-act="album-add" data-kind="photo" data-value="wide">Wide frame</button>
  </div>`}function cr(e,t,n){let r=e.getBoundingClientRect();return{page:Number(e.dataset.page),x:Math.max(2,Math.min(72,(t-r.left)/r.width*100)),y:Math.max(2,Math.min(80,(n-r.top)/r.height*100))}}function lr(e,t){let n=document.elementFromPoint(e,t)?.closest(`.leaf-canvas`);return document.querySelectorAll(`.leaf-canvas.is-drop`).forEach(e=>{e!==n&&e.classList.remove(`is-drop`)}),n?.classList.add(`is-drop`),n}function ur(e,{onMove:t,onDrop:n,onSelect:r,onPhotoFile:i,onText:a,onFetch:o}){e.querySelectorAll(`.tray-item[data-kind]`).forEach(e=>{e.addEventListener(`pointerdown`,t=>{if(t.button&&t.button!==0)return;let r=t.clientX,i=t.clientY,a=e.dataset.kind,o=e.dataset.value,s=null,c=!1,l=0,u=t=>{let n=t.clientX-r,a=t.clientY-i;!c&&n*n+a*a<100||(c||(c=!0,e._skipClick=!0,e.classList.add(`is-dragging`),s=document.createElement(`div`),s.className=`tray-ghost`,s.textContent=e.textContent.trim(),document.body.append(s)),!l&&(l=requestAnimationFrame(()=>{l=0,s.style.transform=`translate3d(${t.clientX-18}px, ${t.clientY-18}px, 0)`,lr(t.clientX,t.clientY)})))},d=t=>{window.removeEventListener(`pointermove`,u),window.removeEventListener(`pointerup`,d),window.removeEventListener(`pointercancel`,d),e.classList.remove(`is-dragging`),s?.remove();let r=c?lr(t.clientX,t.clientY):null;document.querySelectorAll(`.leaf-canvas.is-drop`).forEach(e=>e.classList.remove(`is-drop`)),c&&r&&n?.({kind:a,value:o,...cr(r,t.clientX,t.clientY)})};window.addEventListener(`pointermove`,u),window.addEventListener(`pointerup`,d),window.addEventListener(`pointercancel`,d)}),e.addEventListener(`click`,t=>{e._skipClick&&=(t.preventDefault(),t.stopPropagation(),!1)},!0)}),e.querySelectorAll(`.leaf-canvas`).forEach(e=>{e.addEventListener(`dragover`,t=>{t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect=`copy`),e.classList.add(`is-drop`)}),e.addEventListener(`dragleave`,()=>e.classList.remove(`is-drop`)),e.addEventListener(`drop`,t=>{t.preventDefault(),e.classList.remove(`is-drop`);let n=cr(e,t.clientX,t.clientY),r=t.dataTransfer?.files;r?.length&&[...r].forEach((e,t)=>{e.type.startsWith(`image/`)&&i?.(n.page,e,{x:n.x+t*4,y:n.y+t*4})})})}),e.querySelectorAll(`.scrap`).forEach(e=>{e.addEventListener(`pointerdown`,n=>{if(n.target.closest(`button`)||n.target.closest(`[contenteditable]`))return;n.preventDefault(),r?.(e.dataset.item),e.classList.add(`is-on`,`is-lift`);let i=e.closest(`.leaf-canvas`);if(!i)return;e.setPointerCapture?.(n.pointerId);let a=n.clientX,s=n.clientY,c=i.getBoundingClientRect(),l=0,u=t=>{l||=requestAnimationFrame(()=>{l=0;let n=Math.max(0,Math.min(78,(t.clientX-c.left)/c.width*100)),r=Math.max(0,Math.min(82,(t.clientY-c.top)/c.height*100));e.style.left=`${n}%`,e.style.top=`${r}%`})},d=n=>{e.classList.remove(`is-lift`),e.releasePointerCapture?.(n.pointerId),e.removeEventListener(`pointermove`,u),e.removeEventListener(`pointerup`,d),e.removeEventListener(`pointercancel`,d);let r=parseFloat(e.style.left),i=parseFloat(e.style.top);t?.(e.dataset.page,e.dataset.item,{x:r,y:i});let c=n.clientX-a,l=n.clientY-s;e.classList.contains(`scrap--sticker`)&&c*c+l*l<64&&o?.(e)};e.addEventListener(`pointermove`,u),e.addEventListener(`pointerup`,d),e.addEventListener(`pointercancel`,d)}),e.addEventListener(`focusout`,()=>{if(!e.isContentEditable&&!e.querySelector(`[contenteditable]`))return;let t=e.matches(`[contenteditable]`)?e:e.querySelector(`[contenteditable]`);a?.(e.dataset.page,e.dataset.item,t?.innerText||``)})})}var L={evenodd:{id:`evenodd`,label:`Evens or Odds`,blurb:`She picks even or odd. You automatically get the other.`,sides:[{id:`even`,label:`Evens`,hint:`2, 4, 6 … 32`},{id:`odd`,label:`Odds`,hint:`1, 3, 5 … 31`}],matches(e,t){return t===`even`?e%2==0:e%2==1},color(e){return e%2==0?`#f3c56a`:`#3d2418`},ink(e){return e%2==0?`#3d2418`:`#fff8ea`}},highlow:{id:`highlow`,label:`High or Low`,blurb:`Low is 1–16. High is 17–32.`,sides:[{id:`low`,label:`Low`,hint:`1–16`},{id:`high`,label:`High`,hint:`17–32`}],matches(e,t){return t===`low`?e<=16:e>=17},color(e){return e<=16?`#e8b44a`:`#5f82c4`},ink(e){return e<=16?`#3d2418`:`#fff8ea`}},redblack:{id:`redblack`,label:`Red or Black`,blurb:`Odds wear red. Evens wear black.`,sides:[{id:`red`,label:`Red`,hint:`odd numbers`},{id:`black`,label:`Black`,hint:`even numbers`}],matches(e,t){return t===`red`?e%2==1:e%2==0},color(e){return e%2==1?`#8a2f1e`:`#1a1410`},ink(){return`#fff8ea`}}};function dr(){return{mode:`evenodd`,phase:`pick-variant`,variant:`evenodd`,herSide:null,mySide:null,number:null,rotation:0,spinning:!1,current:null,answerer:null}}function fr(e,t){let n=L[e].sides;return n.find(e=>e.id!==t)?.id||n[0].id}function pr(e,t){e.variant=L[t]?t:`evenodd`,e.herSide=null,e.mySide=null,e.phase=`pick-side`}function mr(e,t){e.herSide=t,e.mySide=fr(e.variant,t),e.phase=`ready`,e.number=null,e.current=null,e.answerer=null}function hr(e){let t=1+Math.floor(Math.random()*32);e.number=t;let n=360/32,r=5+Math.floor(Math.random()*3),i=360-((t-1)*n+n/2);return e.rotation+=r*360+i-e.rotation%360,e.spinning=!0,e.phase=`spinning`,oe(),t}function gr(e){let t=L[e.variant];return e.spinning=!1,e.answerer=t.matches(e.number,e.herSide)?`her`:`me`,e.current=S(Se()),e.phase=`show`,e.current}function _r(e,t){t&&e.current&&b(e.current.level),e.current=null,e.answerer=null,e.phase=`ready`}function vr(e){let t=L[e]||L.evenodd,n=360/32;return Array.from({length:32},(e,r)=>{let i=r+1;return`${t.color(i)} ${r*n}deg ${(r+1)*n}deg`}).join(`, `)}function yr(e,t){return L[e]?.sides.find(e=>e.id===t)?.label||t}function br(e){let t=[...e];for(let e=t.length-1;e>0;--e){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}function xr(){return{mode:`sip`,phase:`show`,current:S(Se())}}function Sr(e){e.current&&b(e.current.level),e.current=S(Se())}function Cr(e){e.current=S(Se())}function wr(){let e=br(Se()).slice(0,3);return{mode:`nightstand`,phase:`show`,queue:e,index:0,current:e[0]||null}}function Tr(e,t){if(t&&e.current&&b(e.current.level),e.index+=1,e.index>=e.queue.length){e.phase=`done`,e.current=null;return}e.current=e.queue[e.index]}function Er(){return{mode:`mug`,phase:`p1`,current:S(Se()),a1:``,a2:``}}function Dr(e,t){let n=String(t||``).trim();return n?e.phase===`p1`?(e.a1=n,e.phase=`handoff`,!0):e.phase===`handoff`?(e.phase=`p2`,!0):(e.a2=n,e.current&&b(e.current.level),e.phase=`done`,!0):!1}function Or(e){Object.assign(e,Er())}var kr=[`dare`,`hotseat`,`never`,`bookmark`,`postcards`,`whosaid`,`slowdance`,`morning`,`letter`,`later`,`category`,`close`],Ar=[{id:`seats`,text:`Swap seats (or pillows) before the next question.`},{id:`today-photo`,text:`Show a photo from today — no scrolling back.`},{id:`six-words`,text:`Write a six-word note for them and read it aloud.`},{id:`eyes`,text:`Hold eye contact while they ask you anything they want.`},{id:`three-lines`,text:`Tell a story from this week in exactly three sentences.`},{id:`portrait`,text:`Draw them in twenty seconds. Keep the paper.`},{id:`noticed`,text:`Name three things you noticed about them today.`},{id:`phones-down`,text:`Both phones face-down until someone kindly skips.`},{id:`face`,text:`Recreate the last face they made. They judge the likeness.`},{id:`compliment`,text:`Give a compliment that has nothing to do with how they look.`},{id:`hum`,text:`Hum five seconds of a song that reminds you of them.`},{id:`secret`,text:`Trade one small secret you’re actually okay sharing.`},{id:`favorite`,text:`Point at something in the room you’d steal for them and say why.`},{id:`hand`,text:`Hold hands for the next answer, even if it’s a Surface question.`},{id:`alias`,text:`Answer the next question as if you were them.`},{id:`margin`,text:`Doodle in the margin while they think. No peeking at theirs.`}];function jr(e){return kr.includes(e)}function Mr(e){return[`dare`,`hotseat`,`never`,`bookmark`,`postcards`,`whosaid`,`slowdance`].includes(e)}function R(e={}){return S(x(e))}function Nr(e,{me:t=`You`,her:n=`them`,roster:r=[],category:i=``}={}){let a=r.length?r:[t,n].filter(Boolean);if(e===`dare`)return{mode:`dare`,phase:`pick`,current:null,slip:null};if(e===`hotseat`)return{mode:`hotseat`,phase:`pick`,seat:a[0]||t,people:a,left:5,current:null};if(e===`never`)return{mode:`never`,phase:`play`,people:a,fingers:Object.fromEntries(a.map(e=>[e,5])),current:R({level:`personal`})||R(),out:[]};if(e===`bookmark`)return{mode:`bookmark`,phase:`plant1`,choices:x().slice().sort(()=>Math.random()-.5).slice(0,3),plant1:null,plant2:null,remaining:[],current:null,planted:!1};if(e===`postcards`)return{mode:`postcards`,phase:`p1`,current:R()||S(Ce(`personal`)),a1:``,a2:``,endsAt:Date.now()+6e4};if(e===`whosaid`)return{mode:`whosaid`,phase:`ask`,quiz:Kr(),score:0,total:0};if(e===`slowdance`)return{mode:`slowdance`,phase:`show`,current:R({level:`deep`})};if(e===`morning`)return{mode:`morning`,phase:Sn()?`done`:`show`,current:R({level:`surface`}),morning:yn()};if(e===`letter`){let e=hn();return e?vn(e)?{mode:`letter`,phase:`open`,letter:e,current:e.card}:{mode:`letter`,phase:`sealed`,letter:e}:{mode:`letter`,phase:`pick`,choices:x({level:`deep`}).slice(0,3),letter:null}}return e===`later`?{mode:`later`,phase:`list`,current:null}:e===`category`?{mode:`category`,phase:`pick`,category:i,remaining:[],current:null}:e===`close`?{mode:`close`,phase:`write`,favoriteQ:``,favoriteA:``}:{mode:e,phase:`show`}}function Pr(){let e=[];for(let[t,n]of Object.entries(Oe))for(let[r,i]of Object.entries(n))e.push({id:r,level:t,...i});return e}function Fr(e,t,n){return e.category=t,e.level=n,e.remaining=we(n,{category:t}),e.current=e.remaining.shift()||null,e.phase=e.current?`show`:`empty`,e}function Ir(e,t){return t===`dare`?(e.slip=`dare`,e.current=S(Ar)):(e.slip=`truth`,e.current=R()||S(Ce(`personal`))),e.phase=`show`,e}function Lr(e){return e.current=R()||S(Ce(`personal`)),e.phase=`show`,e}function Rr(e,t){return t&&e.current&&b(e.current.level),--e.left,e.current=null,e.left<=0?(e.phase=`pass`,e):Lr(e)}function zr(e){let t=e.people.indexOf(e.seat);return e.seat=e.people[(t+1)%e.people.length],e.left=5,Lr(e)}function Br(e){return e.current=R({level:e.current?.level===`deep`?`personal`:`random`})||R(),e}function Vr(e,t,n){n&&(e.fingers[t]=Math.max(0,(e.fingers[t]||0)-1),e.fingers[t]===0&&!e.out.includes(t)&&e.out.push(t)),e.current&&b(e.current.level);let r=e.people.filter(t=>(e.fingers[t]||0)>0);return r.length<=1&&e.people.length>1?(e.phase=`done`,e.winner=r[0]||null,e):Br(e)}function Hr(e,t,n){let r=e.choices.find(e=>e.id===n)||null;if(t===1)e.plant1=r,e.phase=`plant2`,e.handoff=!0,e.choices=x().filter(e=>e.id!==n).sort(()=>Math.random()-.5).slice(0,3);else{e.plant2=r;let t=x().filter(t=>t.id!==e.plant1?.id&&t.id!==e.plant2?.id).sort(()=>Math.random()-.5).slice(0,6);e.remaining=[e.plant1,e.plant2,...t].filter(Boolean).sort(()=>Math.random()-.5),e.phase=`draw`,e.current=e.remaining.shift()||null}return e}function Ur(e,t){return t&&e.current&&b(e.current.level),e.planted=e.current&&(e.current.id===e.plant1?.id||e.current.id===e.plant2?.id),e.current=e.remaining.shift()||null,e.phase=e.current?`draw`:`done`,e}function Wr(e,t,n){let r=String(n||``).trim();return r?t===1?(e.a1=r,e.phase=`handoff`,e.endsAt=Date.now()+6e4,!0):(e.a2=r,e.phase=`reveal`,e.current&&b(e.current.level),!0):!1}function Gr(e){return Object.assign(e,Nr(`postcards`)),e}function Kr(){let e=fe().filter(e=>e.text?.trim());if(e.length<1)return null;let t=S(e),n=[...new Set(e.flatMap(e=>[e.from,e.to]).filter(Boolean))].find(e=>e!==t.from)||`a friend`;return{note:t,options:[t.from,n].sort(()=>Math.random()-.5)}}function qr(e,t){return e.quiz?(e.total+=1,e.correct=t===e.quiz.note.from,e.correct&&(e.score+=1),e.phase=`reveal`,e):e}function Jr(e){return e.quiz=Kr(),e.phase=e.quiz?`ask`:`empty`,e.correct=null,e}function Yr(e){return e.current&&b(`deep`),e.current=R({level:`deep`}),e}function Xr(e){return e.current&&(b(`surface`),e.morning=xn(e.current)),e.phase=`done`,e}function Zr(e,t){return e.letter=gn(e.choices.find(e=>e.id===t)||R({level:`deep`})),e.phase=`sealed`,e}function Qr(e,t){let n=fn();return e.current=t?n.find(e=>e.id===t):n[0],e.phase=e.current?`show`:`list`,e}function $r(e){return e.current&&(b(e.current.level),mn(e.current.id)),e.current=null,e.phase=`list`,e}function ei(e,t,n=`No peeking.`){return`
    <div class="handoff-lock" role="dialog" aria-label="Pass the phone">
      <p class="hello">Pass the phone</p>
      <h1>Hand it to ${w(e)}.</h1>
      <p>${w(n)}</p>
      <button class="button button--dark button--large" data-act="${w(t)}">I’m ${w(e)} →</button>
    </div>`}function ti(e){return!e?.id&&!e?.question?``:`
    <div class="night-tools">
      ${e.id?`<button type="button" class="chip" data-act="pin-later" data-value="${w(e.id)}">For later</button>
      <button type="button" class="chip" data-act="veto-q" data-value="${w(e.id)}">Hide this one</button>`:``}
      <button type="button" class="chip" data-act="stamp-round">Stamp into album</button>
    </div>`}function z(e,t){return`${T({title:e,actions:D()})}<main class="screen container night-screen">${t}</main>`}function B(e,t=``){if(!e?.question&&!e?.text)return`<article class="question-card"><p class="muted">No questions left in this pile.</p></article>`;if(e.text&&!e.question)return`<article class="question-card idle-wiggle"><p class="hello">A kind dare</p><h2>${w(e.text)}</h2>${ti(e)}${t}</article>`;let n=Ae(e.level,e.category);return`<article class="question-card idle-wiggle">
    <span class="question-level ${e.level}">${n.emoji} ${n.label}</span>
    <h2>${w(e.question)}</h2>
    <p>Take your time. Skip is still kind.</p>
    ${ti(e)}
    ${t}
  </article>`}function ni(e,t){let n={dare:ri,hotseat:ii,never:ai,bookmark:oi,postcards:si,whosaid:ci,slowdance:li,morning:ui,letter:di,later:fi,category:pi,close:mi}[e];return n?n(t):null}function ri({session:e,skip:t}){if(e.phase===`pick`)return z(`Truth or Dare`,`<header class="section-heading"><p class="hello">Stationery edition</p><h1>Pick a slip.</h1><p>Dares stay small and kind. Skip still exists.</p></header>
      <div class="question-actions">
        <button class="button button--dark button--large" data-act="dare-pick" data-value="truth">Truth</button>
        <button class="button button--large" data-act="dare-pick" data-value="dare">Dare</button>
      </div>
      <p class="muted">${Ar.length} dares in the envelope.</p>`);let n=t?`<button class="button" data-act="dare-skip">Skip →</button>`:``;return z(`Truth or Dare`,`${B(e.current,`<div class="question-actions">
      <button class="button button--dark button--large" data-act="dare-done">We did it</button>
      ${n}
      <button class="button" data-act="dare-pick" data-value="${e.slip===`dare`?`dare`:`truth`}">Another slip</button>
    </div>`)}`)}function ii({session:e,skip:t,me:n}){if(e.phase===`pick`)return z(`Hot Seat`,`<header class="section-heading"><p class="hello">Five questions</p><h1>Who sits first?</h1></header>
      <div class="party-members" style="justify-content:flex-start">
        ${e.people.map(e=>`<button type="button" class="party-chip" data-act="hotseat-pick" data-value="${w(e)}">${w(e)}</button>`).join(``)}
      </div>`);if(e.phase===`pass`)return z(`Hot Seat`,`<section class="question-card"><p class="hello">${w(e.seat)} answered five.</p><h1>Pass the chair.</h1>
      <div class="question-actions">
        <button class="button button--dark button--large" data-act="hotseat-pass">Next person →</button>
        <a class="button" href="#/play">Back to the shelf</a>
      </div></section>`);let r=t?`<button class="button" data-act="hotseat-skip">Skip →</button>`:``;return z(`Hot Seat`,`<p class="hello">${w(e.seat)} · ${e.left} left</p>
    ${B(e.current,`<div class="question-actions">
      <button class="button button--dark button--large" data-act="hotseat-answer">${w(e.seat===n?`I answered`:`They answered`)}</button>
      ${r}
    </div>`)}`)}function ai({session:e,skip:t}){if(e.phase===`done`)return z(`Never Have I`,`<section class="question-card"><p class="hello">Last fingers standing</p>
      <h1>${e.winner?`${w(e.winner)} still has a finger.`:`You’re out of fingers. You’re not out of the night.`}</h1>
      <p>The winner picks the next book — or you keep talking.</p>
      <div class="question-actions">
        <button class="button button--dark" data-act="never-reset">Another round</button>
        <a class="button" href="#/play">Shelf</a>
      </div></section>`);let n=t?`<button class="button" data-act="never-skip">Skip →</button>`:``;return z(`Never Have I`,`<div class="finger-row">${e.people.map(t=>`<span class="finger-chip">${w(t)} · ${`☝`.repeat(e.fingers[t]||0)||`out`}</span>`).join(``)}</div>
    <p class="hello">Never have I ever sat with this:</p>
    ${B(e.current,`<div class="question-actions">
      ${e.people.filter(t=>(e.fingers[t]||0)>0).map(e=>`<button class="button button--dark" data-act="never-has" data-value="${w(e)}">${w(e)} has</button>`).join(``)}
      <button class="button" data-act="never-safe">Nobody has</button>
      ${n}
    </div>`)}`)}function oi({session:e,skip:t,me:n,her:r}){if(e.phase===`plant1`||e.phase===`plant2`){let t=e.phase===`plant1`?n:r;return e.phase===`plant2`&&e.handoff!==!1?z(`The Bookmark`,ei(r,`bookmark-unlock`,`They pick a question they hope you’ll get.`)):z(`The Bookmark`,`<header class="section-heading"><p class="hello">${w(t)} plants a bookmark</p><h1>Which question do you hope they get?</h1></header>
      <div class="level-list">
        ${(e.choices||[]).map(e=>`<button class="level" data-act="bookmark-plant" data-value="${w(e.id)}"><h3>${w(e.question)}</h3></button>`).join(``)}
      </div>`)}if(e.phase===`done`)return z(`The Bookmark`,`<section class="question-card"><h1>The pile is empty.</h1>
      <div class="question-actions"><a class="button button--dark" href="#/play">Shelf</a></div></section>`);let i=e.current&&(e.current.id===e.plant1?.id||e.current.id===e.plant2?.id),a=e.current?.id===e.plant1?.id?n:r,o=t?`<button class="button" data-act="bookmark-skip">Skip →</button>`:``;return z(`The Bookmark`,`${i?`<p class="hello">That was the bookmark. ${w(a)} hoped you’d get this.</p>`:`<p class="hello">A page from the pile</p>`}
    ${B(e.current,`<div class="question-actions">
      <button class="button button--dark button--large" data-act="bookmark-answer">I answered</button>
      ${o}
    </div>`)}`)}function si({session:e,skip:t,me:n,her:r}){if(e.phase===`handoff`)return z(`Postcards`,ei(r,`postcard-go`,`Same prompt. Sixty seconds. Don’t peek.`));if(e.phase===`reveal`)return z(`Postcards`,`<header class="section-heading"><p class="hello">Flip</p><h1>${w(e.current?.question||``)}</h1></header>
      <div class="reveal-grid two">
        <article class="question-card"><p class="hello">${w(n)}</p><p>${w(e.a1)}</p></article>
        <article class="question-card"><p class="hello">${w(r)}</p><p>${w(e.a2)}</p></article>
      </div>
      <div class="question-actions">
        <button class="button button--dark" data-act="stamp-round">Stamp into album</button>
        <button class="button" data-act="postcard-again">Another postcard</button>
      </div>`);let i=e.phase===`p2`?r:n,a=t?`<button class="button" data-act="postcard-skip">Skip →</button>`:``;return z(`Postcards`,`<p class="hello">${w(i)} · sixty seconds</p>
    <div class="postcard-timer" data-ends="${e.endsAt||0}"></div>
    ${B(e.current,`${Ve(`postcard-text`)}
      <label class="field" style="display:block"><span class="muted">Your postcard</span>
      <textarea id="postcard-text" rows="4" maxlength="400"></textarea></label>
      <div class="question-actions">
        <button class="button button--dark button--large" data-act="postcard-lock">Seal it</button>
        ${a}
      </div>`)}`)}function ci({session:e}){return!e.quiz||e.phase===`empty`?z(`Who Said It`,`<section class="question-card"><p class="hello">Not enough keepsakes yet</p>
      <h1>Play Two of Us first.</h1>
      <p>Notes from the end of that game become this quiz.</p>
      <a class="button button--dark" href="#/duo">Two of Us →</a></section>`):e.phase===`reveal`?z(`Who Said It`,`<section class="question-card">
        <p class="hello">${e.correct?`That’s them.`:`Not quite.`}</p>
        <h1>${w(e.quiz.note.from)} wrote it.</h1>
        <p>${w(e.quiz.note.text)}</p>
        <p class="muted">${e.score}/${e.total}</p>
        <div class="question-actions"><button class="button button--dark" data-act="who-next">Another note</button></div>
      </section>`):z(`Who Said It`,`<header class="section-heading"><p class="hello">Guess</p><h1>Who left this?</h1></header>
    <article class="note-letter"><p>${w(e.quiz.note.text)}</p></article>
    <div class="question-actions">
      ${e.quiz.options.map(e=>`<button class="button button--dark button--large" data-act="who-guess" data-value="${w(e)}">${w(e)}</button>`).join(``)}
    </div>`)}function li({session:e,skip:t}){let n=t?`<button class="button" data-act="slow-skip">Skip →</button>`:``;return z(`Slow Dance`,`<header class="section-heading"><p class="hello">No timer</p><h1>Sit with this one.</h1></header>
    ${B(e.current,`<div class="question-actions">
      <button class="button button--dark button--large" data-act="slow-done">We’re done</button>
      <button class="button" data-act="slow-next">Another song</button>
      ${n}
    </div>`)}`)}function ui({session:e}){let t=e.morning||yn();return e.phase===`done`?z(`Morning Page`,`<section class="question-card"><p class="hello">Streak ${t.streak}</p>
      <h1>That’s your page.</h1>
      <p>${w(e.current?.question||t.lastCard?.question||``)}</p>
      <a class="button button--dark" href="#/play">Shelf</a></section>`):z(`Morning Page`,`<p class="hello">Streak ${t.streak} · surface only</p>
    ${B(e.current,`<div class="question-actions">
      <button class="button button--dark button--large" data-act="morning-done">That’s my page</button>
      <button class="button" data-act="morning-skip">Another sip</button>
    </div>`)}`)}function di({session:e}){return e.phase===`pick`?z(`Unopened Letter`,`<header class="section-heading"><p class="hello">Seal it for a week</p><h1>Which Deep question waits?</h1></header>
      <div class="level-list">${(e.choices||[]).map(e=>`<button class="level" data-act="letter-seal" data-value="${w(e.id)}"><h3>${w(e.question)}</h3></button>`).join(``)}</div>`):e.phase===`sealed`?z(`Unopened Letter`,`<section class="question-card wax">
        <p class="hello">Sealed</p>
        <h1>Don’t open until ${w(new Date(e.letter.openAt).toLocaleDateString())}.</h1>
        <p>GTK Y will offer it again. Skip is kind if you’re not ready then either.</p>
        <a class="button" href="#/play">Shelf</a>
      </section>`):z(`Unopened Letter`,`<p class="hello">A week later</p>
    ${B(e.current,`<div class="question-actions">
      <button class="button button--dark" data-act="letter-open">I sat with it</button>
      <button class="button" data-act="letter-reseal">Seal a new one</button>
    </div>`)}`)}function fi({session:e,skip:t}){let n=fn();if(e.phase===`show`&&e.current){let n=t?`<button class="button" data-act="later-skip">Skip →</button>`:``;return z(`For Later`,`${B(e.current,`<div class="question-actions">
        <button class="button button--dark" data-act="later-answer">I answered</button>
        ${n}
        <button class="button" data-act="later-list">Back to the pile</button>
      </div>`)}`)}return z(`For Later`,`<header class="section-heading"><p class="hello">The flinch pile</p><h1>${n.length?`Questions you weren’t ready for.`:`Nothing saved yet.`}</h1>
    <p>Pin from any card with For later.</p></header>
    ${n.length?`<div class="library-list">${n.map(e=>`<article class="library-item">
                <p>${w(e.question)}</p>
                <div class="question-actions">
                  <button class="button button--dark" data-act="later-draw" data-value="${w(e.id)}">Ask it</button>
                  <button class="button" data-act="later-drop" data-value="${w(e.id)}">Let it go</button>
                </div>
              </article>`).join(``)}</div>`:`<p class="muted">When a question stings, pin it. Come back when the night is softer.</p>`}`)}function pi({session:e,skip:t}){if(e.phase===`pick`||!e.category)return z(`Category Night`,`<header class="section-heading"><p class="hello">One shelf</p><h1>What is tonight about?</h1></header>
      <div class="cat-grid">${Pr().map(e=>`<button type="button" class="cat-chip" data-act="category-start" data-value="${w(e.id)}" data-level="${w(e.level)}">
            ${e.emoji} ${w(e.label)} <small>${ke[e.level].label}</small>
          </button>`).join(``)}</div>`);if(e.phase===`empty`)return z(`Category Night`,`<section class="question-card"><h1>That shelf is empty.</h1><button class="button" data-act="category-reset">Pick another</button></section>`);let n=t?`<button class="button" data-act="category-skip">Skip →</button>`:``;return z(`Category Night`,`<p class="hello">${e.remaining.length+ +!!e.current} left on this shelf</p>
    ${B(e.current,`<div class="question-actions">
      <button class="button button--dark button--large" data-act="category-answer">I answered</button>
      ${n}
    </div>`)}`)}function mi({session:e}){let t=Cn();return z(`Close the book`,`<header class="section-heading"><p class="hello">End of night</p><h1>One favorite each.</h1>
    <p>Then download albums if you want them tomorrow.</p></header>
    <form id="close-book" class="question-card">
      <div class="field"><label for="fav-q">Favorite question tonight</label>
      <textarea id="fav-q" name="q" rows="2" maxlength="280">${w(e.favoriteQ||``)}</textarea></div>
      <div class="field"><label for="fav-a">Favorite answer you heard</label>
      <textarea id="fav-a" name="a" rows="3" maxlength="400">${w(e.favoriteA||``)}</textarea></div>
      <div class="question-actions">
        <button class="button button--dark button--large" type="submit">Seal the night →</button>
        <button class="button" type="button" data-act="album-export">Download albums</button>
      </div>
    </form>
    ${t?.favoriteQ?`<p class="muted">Last time you kept: ${w(t.favoriteQ)}</p>`:``}`)}function hi(e){if(!e)return``;let t=e.label||`Last night`;return`<button type="button" class="book book--play book--last" style="background:#4a2c1c" data-act="last-night" aria-label="${w(t)}">
    <b>${w(t)}</b><small>resume the shelf</small>
  </button>`}function gi(){let e=ln();return e.length?`<p class="muted">${e.length} hidden. They won’t show up in new decks.</p>
    <div class="question-actions">${e.slice(0,12).map(e=>`<button class="chip" data-act="unveto-q" data-value="${w(e)}">Unhide ${w(e.slice(0,8))}</button>`).join(``)}</div>`:`<p class="muted">Nothing hidden. In the library or on a card, tap Hide this one.</p>`}function _i(e){let t=`alb-table-${e||`local`}`;return F(t)||I({id:t,title:e?`The table · ${e}`:`The table`,color:`#5a2c48`,favorite:!0,createdAt:Date.now(),updatedAt:Date.now(),pages:[In(),In()]})}function vi(e){if(e&&F(e))return e;let t=P().find(e=>e.id.startsWith(`alb-table-`));if(t)return t.id;let n=P()[0];return n?n.id:_i(`local`).id}function yi({albumId:e,title:t,body:n,page:r=0}){let i=vi(e),a=F(i);if(!a)return null;let o=Vn(`text`,{style:`tape`,text:`${t}\n${n}`.slice(0,280),x:8+Math.random()*36,y:10+Math.random()*50,w:46,h:22});return Rn(a,r,o),{albumId:i,item:o}}function bi(e){return e&&{...e,pages:e.pages.map(e=>({items:e.items.map(e=>e.type===`photo`&&e.src&&e.src.length>4e3?{...e,src:``,noteBelow:e.noteBelow||`(photo stays on that phone)`}:e.type===`voice`&&e.src&&e.src.length>4e3?{...e,src:``,text:`Voice memo stayed on that phone.`}:e)}))}}function xi(e){let t=e.querySelector(`.doodle-layer`);if(!t)return;let n=t.querySelector(`canvas`);if(!n)return;let r=n.getContext(`2d`);(()=>{let e=t.getBoundingClientRect(),i=window.devicePixelRatio||1;n.width=Math.max(1,Math.floor(e.width*i)),n.height=Math.max(1,Math.floor(e.height*i)),n.style.width=`${e.width}px`,n.style.height=`${e.height}px`,r.setTransform(i,0,0,i,0,0),r.strokeStyle=`#3d2418`,r.lineWidth=2.2,r.lineCap=`round`,r.lineJoin=`round`})();let i=!1,a=e=>{let t=n.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}};n.addEventListener(`pointerdown`,e=>{i=!0,n.setPointerCapture?.(e.pointerId);let t=a(e);r.beginPath(),r.moveTo(t.x,t.y)}),n.addEventListener(`pointermove`,e=>{if(!i)return;let t=a(e);r.lineTo(t.x,t.y),r.stroke()});let o=()=>{i=!1};n.addEventListener(`pointerup`,o),n.addEventListener(`pointercancel`,o),t.querySelector(`[data-act='doodle-clear']`)?.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),r.clearRect(0,0,n.width,n.height)})}var V=document.querySelector(`#app`),Si=``,H=`home`,U=null,Ci=``,wi=`surface`,Ti=``,Ei=``,Di=0,Oi=``,ki=null,Ai=!1,ji=`Pull a labeled game book to play.`,W=null,Mi=``,Ni=``,Pi=!1,Fi=`all`,G=null,K=0,Ii=null,q=null,Li=!1,Ri=null,zi=!1;function J(){return g().settings}function Bi(e){if(_e()){e();return}xe().then(()=>e()).catch(e=>{Ci=e.message||`Could not load questions.`,Z()})}function Vi(e,t){return!e||e.startsWith(`album`)||e.startsWith(`rule`)||e===`pull-book`&&[`deck`,`wheel`,`duo`,`evenodd`].includes(t)?!0:/^(theme|toggle|menu-tab|open-shelf|leave-party|copy-party|copy-link|rejoin|rehost|pup-woof|keepsake|pause|resume|discard-pause|remind-export|remind-skip|take-nav|close-book|scroll-modes|prefill|library-level)$/.test(e)}function Hi(e){Zt(zt(e)).then(t=>{W?.code===e&&(W.qr=t),U?.roomCode===e&&(U.qr=t),!document.activeElement?.matches?.(`input, textarea, select`)&&Z()}).catch(()=>{})}var Ui=new Set([``,`home`,`welcome`,`how`,`lobby`,`play`,`albums`,`settings`,`stats`,`deck`,`wheel`,`duo`,`evenodd`,`zine`]);function Wi(){let e=g(),t=e.settings.theme,n=t===`system`?window.matchMedia(`(prefers-color-scheme: dark)`).matches?`dark`:`light`:t,r=`${n}|${e.settings.animations}|${e.settings.music}`;if(r===Si)return;Si=r,document.documentElement.dataset.theme=n,document.documentElement.classList.toggle(`no-anim`,!e.settings.animations);let i=n===`dark`?`#2c1810`:`#f6e4c4`;document.querySelector(`meta[name="theme-color"]`)?.setAttribute(`content`,i),Re(e.settings.music)}function Y(e){Fe(e,J().sfx)}function Gi(){return W?.rules&&W.rules.skipAllowed===!1?!1:J().skipAllowed}function Ki(e){return sn(e)}function qi(){let e=Mn(W),t=y()||`You`,n=ne()||`them`;return e.length?e:[t,n].filter(Boolean)}function Ji(e,t={}){U=Nr(e,{me:y()||`You`,her:ne()||`them`,roster:qi(),...t}),k(),e===`slowdance`&&(v(e=>{e.settings.music=!0}),Wi()),W?.code&&Mr(e)&&(M({type:`nav`,route:e}),M({type:`night`,session:U}))}function X(){W?.code&&Mr(U?.mode)&&M({type:`night`,session:U})}function Yi(){W?.code&&M({type:`album-sync`,album:bi(F(_i(W.code).id))})}function Xi(e,t=``){let n=e?.question||e?.text||`Tonight`,r=qi().join(` & `),i=yi({albumId:G||(W?.code?_i(W.code).id:vi()),title:r,body:`${n}${t?`\n${t}`:``}`});return Y(`chime`),N(`stars`),Yi(),i}function Zi(e){let t=document.querySelector(`.walker-pup`);if(!t||!e)return;let n=t.getBoundingClientRect(),r=e.getBoundingClientRect(),i=r.left+r.width/2-(n.left+n.width/2),a=r.top+r.height/2-(n.top+n.height/2);t.classList.add(`is-fetching`),t.style.transform=`translate(${i}px, ${a}px)`,Fe(`bark`,!0),window.setTimeout(()=>{t.classList.remove(`is-fetching`),t.style.transform=``},1100)}async function Qi(){try{let e=await navigator.mediaDevices.getUserMedia({audio:!0}),t=new MediaRecorder(e),n=[];t.ondataavailable=e=>n.push(e.data),t.onstop=()=>{e.getTracks().forEach(e=>e.stop());let r=new Blob(n,{type:t.mimeType||`audio/webm`}),i=new FileReader;i.onload=()=>xa(`voice`,`memo`,{src:String(i.result||``)}),i.readAsDataURL(r)},t.start(),Y(`pop`),window.setTimeout(()=>{t.state===`recording`&&t.stop()},1e4)}catch{window.alert(`Could not use the microphone on this device.`)}}function $i(){let[e,t]=location.hash.replace(/^#\/?/,``).split(`?`),n=e||`home`,r=new URLSearchParams(t||``);Ti=(r.get(`join`)||``).toUpperCase(),Ei=r.get(`d`)||``,Ki(H)&&!Ki(n)&&U&&U.phase!==`lobby`&&(Dt(H,U),wn({route:H,albumId:G,label:`Last night`}),P().length&&(Pi=!0));let i=n;Ti&&(i===`home`||i===``||i===`duo`)&&(i=`lobby`),i===`play`&&!W?.code&&(i=`lobby`),H=i}function ea(){document.documentElement.classList.add(`is-booted`),Wi(),window.matchMedia(`(prefers-color-scheme: dark)`).addEventListener(`change`,()=>{Si=``,Wi()}),window.addEventListener(`hashchange`,()=>{$i(),Z()}),V.addEventListener(`click`,ra),V.addEventListener(`submit`,ia),V.addEventListener(`input`,aa),ba(),$i(),na(),window.addEventListener(`keydown`,Sa),Z(),xe().then(()=>{document.activeElement?.matches?.(`input, textarea, select`)||Z()}).catch(e=>{Ci=e.message||`Could not load questions.`,Z()})}function ta(e){let t=getComputedStyle(e).transform;if(!t||t===`none`)return!1;try{return new DOMMatrixReadOnly(t).a<0}catch{return t.includes(`scaleX(-1)`)}}function na(){let e=document.querySelector(`.walker-pup`);if(!e||e.dataset.bound)return;e.dataset.bound=`1`;let t;e.addEventListener(`click`,()=>{Pe(),Fe(`bark`,!0),window.clearTimeout(t),e.classList.remove(`is-barking`),e.classList.toggle(`is-left`,ta(e)),e.offsetWidth,e.classList.add(`is-barking`),t=window.setTimeout(()=>e.classList.remove(`is-barking`),1250)})}function ra(e){let t=e.target.closest(`a[href]`);t?.getAttribute(`href`)===`#/play`&&(Ai=!cn()&&(H===`lobby`||H===`home`||H===``),ji=`Pull a labeled game book to play.`),t?.getAttribute(`href`)===`#/lobby`&&Y(`whoosh`);let n=e.target.closest(`[data-act]`);if(!n)return;e.preventDefault(),Pe();let r=n.dataset.act,i=n.dataset.value;if(!Vi(r,i)&&!_e()){Bi(()=>ca(r,i,n));return}ca(r,i,n)}function ia(e){e.preventDefault();let t=e.target;if(t.id===`guest-form`){let e=new FormData(t).get(`name`);String(e).trim()&&(te(String(e)),H===`welcome`||H===`home`||H===``?location.hash=`#/lobby`:Z());return}if(t.id===`menu-start`){let e=String(new FormData(t).get(`name`)||``).trim();if(!e)return;te(e),Y(`party`),N(`party`),location.hash=`#/lobby`;return}if(t.id===`create-party`){let e=new FormData(t),n=y()||String(e.get(`name`)||`Host`).trim();te(n),ma({name:n,size:Number(e.get(`size`)||4)});return}if(t.id===`join-party`){let e=new FormData(t),n=y()||String(e.get(`name`)||`Guest`).trim();te(n);let r=String(e.get(`code`)||Ti).trim().toUpperCase();if(!r)return;zi=e.get(`watch`)===`on`,ha(r,n);return}if(t.id===`close-book`){let e=new FormData(t),n=String(e.get(`q`)||``).trim(),r=String(e.get(`a`)||``).trim();wn({route:`play`,albumId:G,label:`Last night`,favoriteQ:n,favoriteA:r}),Xi({question:n||`End of night`},r),Y(`chime`),N(`party`),location.hash=`#/`;return}if(t.id===`album-create`){let e=String(new FormData(t).get(`title`)||``).trim();if(!e)return;let n=Fn(e);Li=!1,G=n.id,K=0,Y(`chime`),Z();return}if(t.id===`duo-setup`){let e=new FormData(t),n=String(e.get(`player1`)||``).trim()||`Player 1`,r=String(e.get(`player2`)||``).trim()||`Player 2`,i=e.get(`together`)===`party`;if(te(n),i||re(r),i){va({player1:n,level:e.get(`level`)||`random`,style:e.get(`style`)||`mix`});return}Bi(()=>{U=ut({player1:n,player2:r,level:e.get(`level`)||`random`,style:e.get(`style`)||`mix`}),ft(U),Z()})}if(t.id===`duo-join`){let e=new FormData(t);ya(String(e.get(`code`)||Ti).trim().toUpperCase(),y()||`Guest`)}}function aa(e){if(e.target.id===`library-search`&&Ga(e.target.value),e.target.id===`album-import`&&e.target.files?.[0]){let t=e.target.files[0],n=new FileReader;n.onload=()=>{try{Wn(JSON.parse(String(n.result||`{}`))),Y(`chime`),N(`stars`),Z()}catch(e){window.alert(e.message||`Could not import that album.`)}},n.readAsText(t),e.target.value=``}if(e.target.id===`album-photo-file`&&e.target.files?.[0]&&Ri){let t=e.target.files[0];Kn(t).then(e=>{let t=F(G);t&&(zn(t,Ri.page,Ri.item,{src:e}),Ri=null,Y(`pop`),Z())}),e.target.value=``}}function oa(e){if(Pe(),nn.some(t=>t.id===e)&&W?.code&&M({type:`nav`,route:e}),e===`deck`||e===`wheel`||e===`duo`){U=null,location.hash=`#/${e}`;return}if(e===`evenodd`){U=dr(),k(),location.hash=`#/evenodd`;return}Bi(()=>{if(e===`coffee`){U=Ue(`surface`),k(),location.hash=`#/deck`;return}if(e===`midnight`){U=Ue(`deep`),k(),location.hash=`#/deck`;return}if(e===`sip`){U=xr(),k(),location.hash=`#/sip`;return}if(e===`nightstand`){U=wr(),k(),location.hash=`#/nightstand`;return}if(e===`mug`){U=Er(),k(),location.hash=`#/mug`;return}jr(e)&&(Ji(e),location.hash=`#/${e}`)})}function sa(e,t,n){let r=y()||`You`,i=ne()||`them`;if(e===`pup-woof`){document.querySelector(`.walker-pup`)?.click();let e=document.querySelector(`.waiting-pup`);return e&&(e.classList.remove(`is-barking`),e.offsetWidth,e.classList.add(`is-barking`),window.setTimeout(()=>e.classList.remove(`is-barking`),1250)),!0}if(e===`last-night`){let e=Cn();return Et()?.session?(ca(`resume`),!0):e?.albumId?(G=e.albumId,location.hash=`#/albums`,!0):(e?.route&&(location.hash=`#/${e.route}`),!0)}if(e===`close-book`)return Ji(`close`),location.hash=`#/close`,!0;if(e===`pin-later`){let e=U?.current||Se().find(e=>e.id===t);return e&&pn(e),Y(`pop`),N(`stars`),!0}if(e===`later-drop`)return mn(t),Z(),!0;if(e===`veto-q`)return un(t),Y(`skip`),Z(),!0;if(e===`unveto-q`)return dn(t),Z(),!0;if(e===`stamp-round`){let e=U?.a1?`\n${r}: ${U.a1}\n${i}: ${U.a2||``}`:``;return Xi(U?.current||U?.quiz?.note,e),!0}if(e===`album-print`)return window.print(),!0;if(e===`copy-link`)return navigator.clipboard?.writeText(zt(W?.code||``)).catch(()=>{}),Y(`pop`),!0;if(e===`rejoin`){let e=jn();return e&&ha(e,y()||`Guest`),!0}if(e===`rehost`)return ma({name:y()||`Host`,size:W?.size||4,code:jn()}),!0;if(e===`rule`)return!W||W.role!==`host`||(W.rules=En(W),W.rules[t]=!W.rules[t],ge(W.rules),M({type:`rules`,rules:W.rules}),Y(`tick`),Z(),!0);if(e===`dare-pick`){(!U||U.mode!==`dare`)&&Ji(`dare`);let e=t===`dare`&&W?.rules&&W.rules.dares===!1?`truth`:t;return Ir(U,e),Y(`draw`),X(),Z(),!0}if(e===`dare-done`||e===`dare-skip`)return e===`dare-done`&&U?.current?.level&&b(U.current.level),U.phase=`pick`,U.current=null,Y(e===`dare-skip`?`skip`:`match`),X(),Z(),!0;if(e===`hotseat-pick`)return U.seat=t,Lr(U),Y(`draw`),X(),Z(),!0;if(e===`hotseat-answer`||e===`hotseat-skip`)return Rr(U,e===`hotseat-answer`),Y(e===`hotseat-skip`?`skip`:`match`),X(),Z(),!0;if(e===`hotseat-pass`)return zr(U),Y(`whoosh`),X(),Z(),!0;if(e===`never-has`)return Vr(U,t,!0),Y(`tick`),X(),Z(),!0;if(e===`never-safe`||e===`never-skip`)return Vr(U,r,!1),Y(e===`never-skip`?`skip`:`draw`),X(),Z(),!0;if(e===`never-reset`)return Ji(`never`),Z(),!0;if(e===`bookmark-unlock`)return U.handoff=!1,U.phase=`plant2`,Z(),!0;if(e===`bookmark-plant`)return Hr(U,U.phase===`plant2`?2:1,t),Y(`pop`),X(),Z(),!0;if(e===`bookmark-answer`||e===`bookmark-skip`)return Ur(U,e===`bookmark-answer`),Y(e===`bookmark-skip`?`skip`:`match`),X(),Z(),!0;if(e===`postcard-lock`){let e=U.phase===`p2`?2:1;return!Wr(U,e,document.getElementById(`postcard-text`)?.value||``)||(Y(`draw`),X(),Z(),!0)}return e===`postcard-go`?(U.phase=`p2`,U.endsAt=Date.now()+6e4,Z(),!0):e===`postcard-again`?(Gr(U),Z(),!0):e===`postcard-skip`?(Gr(U),Y(`skip`),Z(),!0):e===`who-guess`?(qr(U,t),Y(U.correct?`match`:`skip`),Z(),!0):e===`who-next`?(Jr(U),Z(),!0):e===`slow-done`?(U.current&&b(`deep`),Y(`match`),location.hash=`#/play`,!0):e===`slow-next`||e===`slow-skip`?(Yr(U),Y(e===`slow-skip`?`skip`:`draw`),Z(),!0):e===`morning-done`?(Xr(U),Y(`chime`),Z(),!0):e===`morning-skip`?(U.current=x({level:`surface`})[Math.floor(Math.random()*8)]||U.current,Z(),!0):e===`letter-seal`?(Zr(U,t),Y(`chime`),Z(),!0):e===`letter-open`?(U.current&&b(`deep`),_n(),Y(`match`),U.phase=`pick`,U.choices=x({level:`deep`}).slice(0,3),Z(),!0):e===`letter-reseal`?(_n(),Ji(`letter`),Z(),!0):e===`later-draw`?(Qr(U,t),Z(),!0):e===`later-answer`?($r(U),Y(`match`),Z(),!0):e===`later-skip`||e===`later-list`?(U.current=null,U.phase=`list`,Z(),!0):e===`category-start`?(Fr(U,t,n?.dataset.level||`personal`),Y(`draw`),Z(),!0):e===`category-answer`||e===`category-skip`?(e===`category-answer`&&U.current&&b(U.current.level),U.current=U.remaining.shift()||null,U.phase=U.current?`show`:`empty`,Y(e===`category-skip`?`skip`:`match`),Z(),!0):e===`category-reset`&&(Ji(`category`),Z(),!0)}function ca(e,t,n){if(!sa(e,t,n)){if(e===`scroll-modes`){if(H!==`home`&&H!==``){location.hash=`#/`,requestAnimationFrame(()=>document.getElementById(`modes`)?.scrollIntoView({behavior:`smooth`}));return}document.getElementById(`modes`)?.scrollIntoView({behavior:`smooth`});return}if(e===`theme`){v(e=>{e.settings.theme=t}),Wi(),Z();return}if(e===`toggle`){v(e=>{e.settings[t]=!e.settings[t]}),Wi(),Z();return}if(e===`library-level`){wi=t,Z();return}if(e===`prefill`){let e=document.getElementById(n.dataset.target);if(e){let n=t||``;e.value=e.value.trim()?`${n} ${e.value}`:`${n} `,e.focus()}return}if(e===`start-deck`){U=Ue(t),k(),Y(`draw`),Z();return}if(e===`draw`){Ke(U,ae),U.flipped=!1,Y(`draw`),document.querySelector(`.deck-stack`)?.classList.add(`shuffling`),Z(),requestAnimationFrame(()=>{U.flipped=!0,document.querySelector(`.playing-card`)?.classList.add(`flipped`,`glow`),Y(`flip`)});return}if(e===`deck-answer`){Je(U,b),Y(`match`),N(`stars`),Z();return}if(e===`deck-skip`){qe(U),Y(`skip`),Z();return}if(e===`reshuffle`){We(U),Y(`draw`),Z();return}if(e===`reset-deck`){Ge(U),N(`stars`),Y(`draw`),Z();return}if(e===`pause`){Dt(H,U),U?.online&&Bt(),U=null,location.hash=`#/play`,P().length&&(Pi=!0);return}if(e===`resume`){let e=Et();if(!e?.session)return;U=e.session,U.online=!1,U.peerStatus=`idle`,k(),location.hash=`#/${e.route||`deck`}`;return}if(e===`discard-pause`){k(),P().length&&(Pi=!0),Z();return}if(e===`pull-book`){oa(t);return}if(e===`keepsake`){ji=t===`(I love you)`?`That’s not a game. That’s yours.`:`${t} lives on the keepsake shelf. Pull a game book to play.`,Y(`tick`),Z();return}if(e===`roulette-reset`){U=dr(),Y(`draw`),Z();return}if(e===`roulette-variant`){pr(U,t),Y(`draw`),Z();return}if(e===`roulette-side`){let e=document.getElementById(`her-name`);e?.value.trim()&&re(e.value.trim()),mr(U,t),Y(`match`),W?.code&&M({type:`roulette-state`,state:{...U}}),Z();return}if(e===`roulette-spin`){if(!U||U.spinning)return;let e=U.rotation;hr(U);let t=U.rotation;U.rotation=e,Y(`spin`),Z();let n=document.querySelector(`.roulette`),r=J().sfx?setInterval(()=>Y(`tick`),160):null;requestAnimationFrame(()=>{U.rotation=t,n&&(n.classList.add(`spinning`),n.style.transform=`rotate(${t}deg)`)});let i=J().animations?4200:50;setTimeout(()=>{r&&clearInterval(r),gr(U),Y(`flip`),W?.code&&M({type:`roulette-state`,state:{...U,spinning:!1}}),Z()},i),W?.code&&M({type:`roulette-spin`,rotation:t,number:U.number,variant:U.variant,herSide:U.herSide,mySide:U.mySide});return}if(e===`roulette-answer`){_r(U,!0),Y(`match`),N(`stars`),Z();return}if(e===`roulette-skip`){_r(U,!1),Y(`skip`),Z();return}if(e===`sip-next`){Sr(U),Y(`draw`),Z();return}if(e===`sip-skip`){Cr(U),Y(`skip`),Z();return}if(e===`nightstand-next`){Tr(U,!0),Y(`match`),N(`stars`),Z();return}if(e===`nightstand-skip`){Tr(U,!1),Y(`skip`),Z();return}if(e===`mug-go`){U.phase=`p2`,Y(`draw`),Z();return}if(e===`mug-submit`){let e=document.querySelector(`#mug-answer`);if(!Dr(U,e?.value||``))return;Y(U.phase===`done`?`match`:`draw`),U.phase===`done`&&N(`stars`),Z();return}if(e===`mug-again`){Or(U),Y(`draw`),Z();return}if(e===`menu-tab`){Mi=Mi===t?``:t,Y(`pop`),Z();return}if(e===`copy-party`){let e=W?.code||``;navigator.clipboard?.writeText(e).catch(()=>{}),Y(`pop`),N(`stars`);return}if(e===`open-shelf`){Ai=!cn(),location.hash=`#/play`;return}if(e===`leave-party`){Bt(),W=null,location.hash=`#/`;return}if(e===`take-nav`){let e=Ni;Ni=``,location.hash=`#/${e}`;return}if(e===`album-filter`){Fi=t,G=null,Li=!1,Y(`tick`),Z();return}if(e===`album-clear`){if(!P().length){Y(`skip`);return}if(!window.confirm(`Clear every album on this device? This wipes the books. Export first if you want them back.`))return;Pn(),G=null,K=0,q=null,Li=!1,Fi=`all`,Ri=null,Y(`skip`),Z();return}if(e===`album-new`){Li=!0,G=null,K=0,Y(`page`),H===`albums`?Z():location.hash=`#/albums`;return}if(e===`album-cancel`){Li=!1,G=null,Ii=null,q=null,Y(`skip`),H===`albums`?Z():location.hash=`#/play`;return}if(e===`album-open`){G=t,K=0,Li=!1,Y(`page`),Z();return}if(e===`album-star`){let e=F(G);e&&(e.favorite=!e.favorite,I(e),Y(`chime`),Z());return}if(e===`album-tray`){Ii=Ii===t?null:t,Y(`pop`),Z();return}if(e===`album-add`){if(n?.dataset.kind===`voice`){Qi();return}xa(n?.dataset.kind,t);return}if(e===`album-delete`){let e=F(G);if(!e||!q)return;let t=e.pages.findIndex(e=>e.items.some(e=>e.id===q));t>=0&&Bn(e,t,q),q=null,Y(`skip`),Z();return}if(e===`album-note`){let e=F(G);if(!e||!q)return;let n=window.prompt(`Sticky note`);if(n==null)return;zn(e,Number([...e.pages.entries()].find(([,e])=>e.items.some(e=>e.id===q))?.[0]??K*2),q,t===`above`?{noteAbove:n}:{noteBelow:n}),Y(`pop`),Z();return}if(e===`album-photo`){Ri={page:Number(n?.dataset.page||0),item:n?.dataset.item},document.getElementById(`album-photo-file`)?.click();return}if(e===`album-next`){let e=F(G);if(!e)return;K+=1,Ln(e,K),I(e),Y(`page`),Z();return}if(e===`album-prev`){K=Math.max(0,K-1),Y(`page`),Z();return}if(e===`album-export`){Gn(),Y(`chime`),N(`stars`);return}if(e===`album-import`){document.getElementById(`album-import`)?.click();return}if(e===`album-open-shelf`){Li=!1,G=t||null,K=0,location.hash=`#/albums`;return}if(e===`remind-export`){Gn(),Pi=!1,Y(`chime`),Z();return}if(e===`remind-skip`){Pi=!1,Z();return}if(e===`select-scrap`){q=t,Z();return}if(e===`start-wheel`){U=$e(t),k(),Z();return}if(e===`spin`){if(!U||U.spinning)return;let e=U.rotation;et(U);let t=U.rotation;U.rotation=e,Y(`spin`),Z();let n=document.querySelector(`.wheel`),r=J().sfx?setInterval(()=>Y(`tick`),180):null;requestAnimationFrame(()=>{U.rotation=t,n&&(n.classList.add(`spinning`),n.style.transform=`rotate(${t}deg)`)});let i=J().animations?4200:50;setTimeout(()=>{r&&clearInterval(r),tt(U),Y(`flip`),Z()},i);return}if(e===`wheel-answer`){nt(U,!0),Y(`match`),Z();return}if(e===`wheel-skip`){nt(U,!1),Y(`skip`),Z();return}if(e===`duo-begin`){U.phase=U.phase===`note-handoff`?`note-write`:`answer`,U.phase===`note-write`&&wt(U),Z();return}if(e===`duo-submit`){let e=document.querySelector(`#duo-answer`),t=document.querySelector(`.choice-btn.selected`),n=(U.online?O(U)===1?U.q1:U.q2:pt(U))?.choices?t?.dataset.value||``:e?.value||``;if(!String(n).trim())return;if(U.online){let e=O(U),t=_t(U,e,String(n).trim());M({type:`answer`,seat:e,text:String(n).trim()}),t===`reveal`?(U.scored=U.scored||bt(U,J()),(U.scored.same||U.scored.matched)&&N(),Y(`match`)):Y(`draw`),Z();return}ht(U,String(n).trim()),U.phase===`reveal`?(U.scored=bt(U,J()),U.scored.kind===`predict`&&U.scored.matched||U.scored.kind===`match`&&U.scored.same?(Y(`match`),N()):Y(`draw`)):Y(`draw`),Z();return}if(e===`choose`){document.querySelectorAll(`.choice-btn`).forEach(e=>e.classList.remove(`selected`)),n?.classList.add(`selected`);return}if(e===`duo-next`){if(U.online&&U.role===`guest`){M({type:`next`}),U.phase=`waiting`,Y(`draw`),Z();return}ft(U),U.online&&M({type:`deal`,bundle:la(U)}),Y(`draw`),Z();return}if(e===`duo-skip`){if(U.online&&U.role===`guest`){M({type:`skip`}),U.phase=`waiting`,Y(`skip`),Z();return}St(U),U.online&&U.role===`host`&&M({type:`deal`,bundle:la(U)}),Y(`skip`),Z();return}if(e===`duo-wrap`){U.online?(vt(U),M({type:`wrap`})):Ct(U),Y(`draw`),Z();return}if(e===`duo-note-submit`){let e=document.querySelector(`#duo-note`);if(U.online){let t=yt(U,O(U),e?.value||``);M({type:`note`,seat:O(U),text:e?.value||``}),t===`reveal`?ga():Y(`draw`),Z();return}Tt(U,e?.value||``),U.phase===`note-reveal`?ga():Y(`draw`),Z();return}if(e===`duo-note-skip`){if(U.online){let e=yt(U,O(U),``);M({type:`note`,seat:O(U),text:``}),e===`reveal`&&ga(),Z();return}Tt(U,``),U.phase===`note-reveal`&&ga(),Y(`skip`),Z();return}if(e===`host-party`){va();return}if(e===`copy-code`){let e=U?.roomCode||``;navigator.clipboard?.writeText(e).catch(()=>{});return}if(e===`open-zine`){ki=U?.journal||st()[0],Di=0,Oi=``,location.hash=`#/zine`;return}if(e===`download-zine`){let e=ki||U?.journal||st()[0];e&&Qt(e);return}if(e===`zine-next`){Di+=1,Z();return}if(e===`zine-prev`){Di=Math.max(0,Di-1),Z();return}e===`reveal-hidden`&&(n?.classList.remove(`answer--hidden`),n?.dataset.secret&&(n.textContent=n.dataset.secret),Y(`flip`))}}function la(e){return{round:e.round,currentStyle:e.currentStyle,q1:e.q1,q2:e.q2,player1:e.player1,player2:e.player2,level:e.level,style:e.style,phase:e.phase}}function ua(e){U.round=e.round,U.currentStyle=e.currentStyle,U.q1=e.q1,U.q2=e.q2,U.player1=e.player1||U.player1,U.player2=e.player2||U.player2,U.a1=``,U.a2=``,U.ready1=!1,U.ready2=!1,U.scored=null,U.phase=`answer`}function da(){W&&W.role===`host`&&M({type:`roster`,members:W.members,size:W.size,code:W.code})}function fa(e,t){W&&((e===`waiting`||e===`hosting`||e===`connecting`)&&(W.status=e),e===`peer-open`&&(W.status=`connected`,Y(`chime`),N(`party`),W.role===`host`&&da()),e===`peer-left`&&(kn(W,t),W.role===`host`&&da()),e===`error`&&(W.status=`error`,W.error=t||`Could not connect.`),U&&(U.peerStatus=e===`peer-open`?`connected`:e),(H===`lobby`||H===`play`||U?.online)&&Z())}function pa(e){if(e?.type){if(e.type===`hello`&&W?.role===`host`){let t=W.members.filter(e=>!e.spectator),n=!!e.spectator||t.length>=W.size;On(W,{id:e._from||`guest`,name:e.name||`Guest`,host:!1,spectator:n}),e.name&&!n&&re(e.name),da(),M({type:`rules`,rules:En(W)}),Yi(),Y(`pop`),N(`hearts`),Z();return}if(e.type===`roster`&&W){W.members=e.members||W.members,W.size=e.size||W.size;let t=W.members.find(e=>!e.host);t?.name&&re(t.name),Z();return}if(e.type===`rules`){W&&(W.rules=e.rules||W.rules),ge(e.rules||{}),Z();return}if(e.type===`night`){U=e.session,e.session?.mode&&H!==e.session.mode?location.hash=`#/${e.session.mode}`:Z();return}if(e.type===`album-sync`&&e.album){I(e.album),Z();return}if(e.type===`nav`){if(H===`albums`){Ni=e.route,Z();return}e.route&&e.route!==H&&(location.hash=`#/${e.route}`);return}if(e.type===`roulette-state`){U={...U||dr(),...e.state,mode:`evenodd`},H===`evenodd`?Z():location.hash=`#/evenodd`;return}if(e.type===`roulette-spin`){(!U||U.mode!==`evenodd`)&&(U=dr()),U.number=e.number,U.variant=e.variant||U.variant,U.herSide=e.herSide,U.mySide=e.mySide,U.spinning=!0,U.phase=`spinning`;let t=U.rotation,n=e.rotation;U.rotation=t,H===`evenodd`?Z():location.hash=`#/evenodd`,requestAnimationFrame(()=>{U.rotation=n;let e=document.querySelector(`.roulette`);e&&(e.classList.add(`spinning`),e.style.transform=`rotate(${n}deg)`)});return}U?.mode===`duo`&&_a(e)}}function ma({name:e,size:t,code:n}){let r=n||Rt();W=Dn({code:r,role:`host`,size:t,name:e}),An(r),ge(W.rules),_i(r),Gt(r,{onMessage:pa,onStatus:fa},{size:t}),Y(`party`),N(`party`),Z(),Hi(r)}function ha(e,t){W=Dn({code:e,role:`guest`,size:4,name:t}),An(e),Kt(e,{onMessage:pa,onStatus:(e,n)=>{fa(e,n),(e===`peer-open`||e===`connected`)&&M({type:`hello`,name:t,spectator:zi})}}),Y(`whoosh`),Z()}function ga(){at(U),de(U),ot(U.journal),Y(`match`),N(),M({type:`zine`,journal:U.journal})}function _a(e){if(U&&e?.type){if(e.type===`deal`){ua(e.bundle),Z();return}if(e.type===`answer`){_t(U,e.seat,e.text)===`reveal`&&(U.scored=U.scored||bt(U,J()),(U.scored.same||U.scored.matched)&&N()),Z();return}if(e.type===`skip`&&U.role===`host`){St(U),M({type:`deal`,bundle:la(U)}),Z();return}if(e.type===`next`&&U.role===`host`){ft(U),M({type:`deal`,bundle:la(U)}),Z();return}if(e.type===`wrap`){vt(U),Z();return}if(e.type===`note`){yt(U,e.seat,e.text)===`reveal`&&ga(),Z();return}e.type===`zine`&&(U.journal=e.journal,ot(e.journal))}}function va({player1:e,level:t,style:n}){if(W?.code){Bi(()=>{U=ut({player1:e,player2:Mn(W).find(t=>t!==e)||`Waiting…`,level:t,style:n,online:!0,role:W.role,roomCode:W.code}),U.phase=W.role===`host`?`answer`:`waiting`,W.role===`host`&&(ft(U),M({type:`deal`,bundle:la(U)})),M({type:`nav`,route:`duo`}),k(),Z()});return}let r=Rt();U=ut({player1:e,player2:`Waiting…`,level:t,style:n,online:!0,role:`host`,roomCode:r}),U.phase=`lobby`,W=Dn({code:r,role:`host`,size:2,name:e}),Gt(r,{onMessage:pa,onStatus:fa},{size:2}),k(),Z(),Hi(r)}async function ya(e,t){ha(e,t),U=ut({player1:`Host`,player2:t,level:`random`,style:`mix`,online:!0,role:`guest`,roomCode:e}),U.phase=`lobby`,location.hash=`#/duo`}function ba(){let e=null;V.addEventListener(`touchstart`,t=>{t.touches[0]&&(e=t.touches[0].clientY)},{passive:!0}),V.addEventListener(`touchend`,t=>{if(e==null||!t.changedTouches[0])return;let n=e-t.changedTouches[0].clientY;e=null,n>70&&U?.mode===`deck`&&U.phase===`show`&&ca(`deck-answer`)},{passive:!0})}function xa(e,t,n={}){let r=F(G);if(!r||!e)return;let i=n.page??K*2,a=Hn(e,t,n);a&&(Rn(r,i,a),q=a.id,Y(`pop`),Z(),W?.code&&Yi(),e===`photo`&&!a.src&&(Ri={page:i,item:a.id},document.getElementById(`album-photo-file`)?.click()))}function Sa(e){H===`albums`&&(e.target?.closest?.(`input, textarea, [contenteditable]`)||(e.key===`Delete`||e.key===`Backspace`)&&q&&(e.preventDefault(),ca(`album-delete`)))}function Z(){if(Wi(),Ci){V.innerHTML=`<main class="screen container"><div class="error"><h1>GTKY</h1><p>${w(Ci)}</p><button class="button button--dark" onclick="location.reload()">Try again</button></div></main>`;return}if(!_e()&&(!Ui.has(H)||U&&[`deck`,`wheel`,`duo`].includes(H))){V.innerHTML=`
      ${T({title:`GTKY`,actions:D()})}
      <main class="screen container">
        <header class="section-heading">
          <p class="hello">GTKY</p>
          <h1>Shuffling the deck…</h1>
          <p class="muted">Almost there.</p>
        </header>
      </main>`,xe().then(()=>Z()).catch(e=>{Ci=e.message||`Could not load questions.`,Z()});return}({welcome:Ca,home:Ca,"":Ca,how:wa,lobby:Ta,play:Da,albums:Oa,deck:Pa,wheel:Fa,duo:Ia,evenodd:Aa,sip:ja,nightstand:Ma,mug:Na,stats:Va,settings:Ha,library:Ua,zine:za,dare:$,hotseat:$,never:$,bookmark:$,postcards:$,whosaid:$,slowdance:$,morning:$,letter:$,later:$,category:$,close:$}[H]||Ca)(),(Ki(H)||H===`albums`)&&V.insertAdjacentHTML(`beforeend`,ze()),Pi&&V.insertAdjacentHTML(`beforeend`,`<div class="album-remind" role="dialog" aria-label="Save albums">
        <div class="sheet">
          <p class="hello">Before you go</p>
          <h2>Download your albums?</h2>
          <p>Export them now so you can import them the next time you play — or start a new book.</p>
          <div class="question-actions" style="justify-content:center">
            <button class="button button--dark" data-act="remind-export">Download albums</button>
            <button class="button" data-act="remind-skip">Not now</button>
          </div>
        </div>
      </div>`),Ni&&H===`albums`&&V.insertAdjacentHTML(`beforeend`,`<div class="album-remind"><div class="sheet">
        <p>Your party pulled a game.</p>
        <button class="button button--dark" data-act="take-nav">Join them →</button>
      </div></div>`),H===`albums`&&ur(V,{onSelect(e){q=e},onMove(e,t,n){let r=F(G);r&&(q=t,zn(r,Number(e),t,n))},onText(e,t,n){let r=F(G);r&&zn(r,Number(e),t,{text:n})},onDrop({kind:e,value:t,page:n,x:r,y:i}){xa(e,t,{page:n,x:r,y:i})},onPhotoFile(e,t,n){Kn(t).then(t=>{xa(`photo`,`polaroid`,{page:e,src:t,...n})})},onFetch(e){Zi(e)}}),xi(V)}function Ca(){let e=y(),t=J();V.innerHTML=`
    ${T({title:`Menu`})}
    <main class="menu-screen">
      <section class="menu-card enter">
        <p class="hello">GTKY</p>
        <h1>Get to know<br /><em>each other.</em></h1>
        <form id="menu-start">
          <div class="field" style="text-align:left">
            <label for="name">Name</label>
            <input id="name" name="name" maxlength="32" autocomplete="nickname" placeholder="Your name" value="${w(e)}" required />
          </div>
          <div class="menu-stack">
            <button class="button button--dark button--large" type="submit">Start</button>
            <button class="button" type="button" data-act="menu-tab" data-value="how">How to play</button>
            <button class="button" type="button" data-act="menu-tab" data-value="settings">Settings</button>
          </div>
        </form>
        <p class="muted" style="margin-top:1.1rem">
          <a href="./gtky-github-pages.zip" download>Download GTKY for GitHub Pages</a>
        </p>
        ${Wa()}
        ${Mi===`how`?`<div class="question-card" style="margin-top:1.2rem;text-align:left">
                <h3>How to play</h3>
                <p>Start a party. Share the code. Meet at the bookcase.</p>
                <p><strong>Singleplayer</strong> spines are for one phone. <strong>Together</strong> spines sync across the party.</p>
                <p>The skinny shelf is <strong>Albums!</strong> — photos, stickers, sticky notes. Export before you leave so next time you can import.</p>
              </div>`:``}
        ${Mi===`settings`?`<div class="question-card" style="margin-top:1.2rem;text-align:left">
                <p class="hello">Quick settings</p>
                ${Q(`sfx`,`Sound effects`,t.sfx)}
                ${Q(`music`,`Music`,t.music)}
                ${Q(`animations`,`Animations`,t.animations)}
                <a class="button" href="#/settings">All settings →</a>
              </div>`:``}
      </section>
    </main>
  `}function wa(){Mi=`how`,Ca()}function Ta(){let e=y(),t=jn();if(W?.code){V.innerHTML=`
      ${T({title:`Party`,actions:E()})}
      <main class="lobby-screen">
        <div class="spark-rain" aria-hidden="true">${Array.from({length:12},(e,t)=>`<span style="left:${8+t*7}%;animation-delay:${t*.2}s">✦</span>`).join(``)}</div>
        <div class="container" style="position:relative;z-index:1;text-align:center">
          <p class="hello">${W.role===`host`?`You made a room.`:`You’re in.`}</p>
          <p class="party-code">${w(W.code)}</p>
          ${W.status===`waiting`||W.status===`hosting`||W.status===`connecting`?He():``}
          <p class="muted">${W.status===`waiting`||W.status===`hosting`?`Waiting for friends…`:W.status===`error`?w(W.error):`Connected.`} · seats ${W.members.filter(e=>!e.spectator).length}/${W.size}</p>
          <div class="party-members">${W.members.map(e=>`<span class="party-chip">${w(e.name)}${e.host?` ★`:``}${e.spectator?` · watching`:``}</span>`).join(``)}</div>
          ${W.qr?`<img src="${W.qr}" alt="Join QR" width="160" height="160" style="border-radius:12px;background:#fff8ea;padding:8px" />`:``}
          <div class="lan-box">
            <p class="muted" style="margin:0 0 6px">Share this exact GTKY link — not localhost if they’re on another phone.</p>
            <code>${w(zt(W.code))}</code>
          </div>
          ${W.role===`host`?`<div class="host-rules">
                  <p class="hello">Host controls</p>
                  <button class="button ${En(W).lockDeep?`button--dark`:``}" data-act="rule" data-value="lockDeep">${En(W).lockDeep?`Deep is locked`:`Allow Deep`}</button>
                  <button class="button ${En(W).skipAllowed?`button--dark`:``}" data-act="rule" data-value="skipAllowed">${En(W).skipAllowed?`Skip is kind`:`Skip off`}</button>
                  <button class="button ${En(W).dares?`button--dark`:``}" data-act="rule" data-value="dares">${En(W).dares?`Dares on`:`Dares off`}</button>
                </div>`:``}
          <div class="question-actions" style="justify-content:center;margin-top:1.2rem">
            <button class="button button--dark button--large" data-act="open-shelf">Open the bookcase →</button>
            <button class="button" data-act="copy-party">Copy code</button>
            <button class="button" data-act="copy-link">Copy join link</button>
            <button class="button" data-act="leave-party">Leave party</button>
          </div>
        </div>
      </main>
    `;return}V.innerHTML=`
    ${T({title:`Join or create`,actions:E()})}
    <main class="lobby-screen">
      <div class="spark-rain" aria-hidden="true">${Array.from({length:14},(e,t)=>`<span style="left:${6+t*6.5}%;animation-delay:${t*.18}s">${t%2?`♡`:`✦`}</span>`).join(``)}</div>
      <div class="container" style="position:relative;z-index:1">
        <header class="section-heading enter" style="text-align:center">
          <p class="hello">Party time</p>
          <h1>Join or create.</h1>
          <p class="muted">One of you makes the room. Everyone else types the code.</p>
        </header>
        <div class="lobby-grid">
          <form id="create-party" class="lobby-card">
            <p class="hello">Create a party</p>
            <h2>Host the bookcase.</h2>
            <div class="field">
              <label for="size">Party size</label>
              <select id="size" name="size">
                ${[1,2,3,4,5,6,8].map(e=>`<option value="${e}" ${e===2?`selected`:``}>${e===1?`Just me (friends can still join later)`:e+` people`}</option>`).join(``)}
              </select>
            </div>
            <button class="button button--dark button--large button-wide" type="submit">Create party</button>
          </form>
          <form id="join-party" class="lobby-card">
            <p class="hello">Join a party</p>
            <h2>Got a code?</h2>
            <div class="field">
              <label for="code">Party code</label>
              <input id="code" name="code" value="${w(Ti||t)}" maxlength="8" placeholder="7X4K9" style="text-transform:uppercase;letter-spacing:.18em" required />
            </div>
            <button class="button button--dark button--large button-wide" type="submit">Join →</button>
            <label class="muted" style="display:flex;gap:8px;align-items:center;margin-top:10px">
              <input type="checkbox" name="watch" /> I’m just watching
            </label>
          </form>
        </div>
        ${t?`<div class="question-actions" style="justify-content:center;margin-top:1.2rem">
                <button class="button button--dark" data-act="rejoin">I’m still here · ${w(t)}</button>
                <button class="button" data-act="rehost">Host that code again</button>
              </div>`:``}
        <p class="muted center" style="margin-top:1.4rem">Playing as ${w(e||`…`)}. ${location.hostname===`localhost`||location.hostname===`127.0.0.1`?`This is a local address — phones on Wi‑Fi need your computer’s LAN URL.`:``}</p>
      </div>
    </main>
  `}function Ea(e=`level`){return[`surface`,`personal`,`deep`,`together`,`random`].map(t=>`
      <label class="level-chip">
        <input type="radio" name="${e}" value="${t}" ${t===`surface`?`checked`:``} hidden />
        ${Be(t)} ${ke[t].label}
        <small>${ke[t].blurb}</small>
      </label>`).join(``)}function Da(){let e=Ai;Ai=!1;let t=P(),n=rn.map(e=>`<button type="button" class="${[`book`,`book--star`,`book--keepsake`,e.wide?`book--wide`:``,e.set?`book--set`:``,e.love?`book--love`:``].filter(Boolean).join(` `)}" ${e.love?``:`style="background:${e.color}"`} data-act="keepsake" data-value="${w(e.title)}" aria-label="${w(e.title)} by ${w(e.author)}">
      <b>${w(e.title)}</b><small>${w(e.author)}</small>
    </button>`).join(``),r=(e,t)=>on(e,t).map(e=>`<span class="book book--blank" style="background:${e.color};height:${e.height}px"></span>`).join(``),i=(e,t,n)=>`
    <p class="shelf-label">${e}</p>
    <div class="shelf-row">
      ${t.map(e=>`<button type="button" class="${`book book--play${e.featured?` book--featured`:``}`}" style="background:${e.color}" data-act="pull-book" data-value="${e.id}" aria-label="${w(e.title)}. ${w(e.kicker)}">
            <b>${w(e.title)}</b><small>${w(e.kicker)}</small>
          </button>`).join(``)}
      ${r(14,n)}
    </div>`,a=Array.from({length:10},(e,n)=>{let r=t[n];if(r)return`<button type="button" class="book book--album book--play" style="background:${r.color}" data-act="album-open-shelf" data-value="${w(r.id)}" aria-label="${w(r.title)}"><b>${w(r.title)}</b></button>`;let i=on(1,n+9)[0];return`<button type="button" class="book book--album book--play" style="background:${i.color};height:${i.height}px" data-act="album-new" aria-label="Blank album"></button>`}).join(``),o=W?.code?`Party ${W.code} · ${W.members.map(e=>e.name).join(`, `)}`:`Start or join a party from the lobby.`;V.innerHTML=`
    ${T({title:`Bookshelf`,actions:E()})}
    <main class="play-room ${e?`is-entering`:``}">
      <div class="container">
        <header class="play-intro">
          <p class="hello">${w(o)}</p>
          <h1>Pick a spine.</h1>
          <p>Singleplayer on the big case. Together games for the party. Albums on the skinny shelf.</p>
          <div class="question-actions" style="justify-content:center;margin-top:12px">
            <button class="button" data-act="close-book">Close the book</button>
          </div>
        </header>
        <div class="bookshelf-stage shelf-hall">
          <div>
            <div class="bookshelf">
              <p class="shelf-label">Keepsakes</p>
              <div class="shelf-row">${hi(Cn())}${n}${r(8,1)}</div>
              ${i(`Singleplayer`,tn,2)}
              ${i(`Together`,nn,3)}
            </div>
            <p class="play-caption">${w(ji)}</p>
          </div>
          <div class="bookshelf bookshelf--skinny">
            <div class="album-head">
              <button type="button" class="shelf-label" data-act="album-open-shelf" style="background:none;border:0;color:#f3c56a;cursor:pointer">Albums!</button>
              <span>
                <button type="button" class="tape-btn" data-act="album-import">Import</button>
                <button type="button" class="tape-btn" data-act="album-export">Export</button>
                <button type="button" class="tape-btn tape-clear" data-act="album-clear">(clear albums)</button>
              </span>
            </div>
            <div class="shelf-row">${a}${r(8,4)}</div>
            <p class="play-caption" style="font-size:0.95rem">Tap a blank spine to title a new book.</p>
          </div>
        </div>
        <input id="album-import" class="file-hidden" type="file" accept="application/json" />
        <input id="album-photo-file" class="file-hidden" type="file" accept="image/*" />
      </div>
    </main>
  `}function Oa(){let e=P(),t=G?F(G):null;V.innerHTML=`
    ${T({title:`Albums!`,actions:D()})}
    <main class="screen container" style="padding-bottom:8rem">
      
      ${Xn({albums:e,filter:Fi,album:t,spread:K,tray:Ii,selected:q,creating:Li})}
      <input id="album-import" class="file-hidden" type="file" accept="application/json" />
      <input id="album-photo-file" class="file-hidden" type="file" accept="image/*" />
    </main>
  `}function ka(e,t){let n=e?Ae(e.level,e.category):null;return e?`
    <article class="question-card idle-wiggle">
      <span class="question-level ${e.level}">${n.emoji} ${n.label}</span>
      <h2>${w(e.question)}</h2>
      <p>Take your time. There isn’t a wrong answer.</p>
      ${ti(e)}
      <div class="question-actions">${t}</div>
    </article>`:`<p class="muted">No questions loaded.</p>`}function Aa(){(!U||U.mode!==`evenodd`)&&(U=dr());let e=ne()||`her`,t=y()||`you`,n=J().skipAllowed,r=L[U.variant],i=``;if(U.phase===`pick-variant`)i=`
      <header class="section-heading enter">
        <p class="hello">Even &amp; Odd</p>
        <h1>She picks a side.</h1>
        <p class="muted">You automatically get the other. Then a 1–32 wheel decides who answers.</p>
      </header>
      <div class="level-list">
        ${Object.values(L).map(e=>`
          <button class="level" data-act="roulette-variant" data-value="${e.id}">
            <div class="level-top"><strong>${e.label}</strong></div>
            <p>${e.blurb}</p>
            <span class="level-count">This one →</span>
          </button>`).join(``)}
      </div>`;else if(U.phase===`pick-side`)i=`
      <header class="section-heading enter">
        <p class="hello">${r.label}</p>
        <h1>What does she pick?</h1>
        <p class="muted">The moment she chooses, you take the other side. No take-backs, that’s the fun.</p>
      </header>
      <div class="field">
        <label for="her-name">Her name</label>
        <input id="her-name" name="her" maxlength="32" value="${w(ne())}" placeholder="her name" />
      </div>
      <div class="sides">
        ${r.sides.map(e=>`
          <button class="side-pick" type="button" data-act="roulette-side" data-value="${e.id}">
            <strong>${e.label}</strong>
            <small>${e.hint}</small>
          </button>`).join(``)}
      </div>`;else if(U.phase===`show`&&U.current){let a=U.answerer===`her`?e:t,o=yr(U.variant,r.matches(U.number,U.herSide)?U.herSide:U.mySide);i=`
      <p class="who-card">
        <span class="hello">The wheel landed on ${U.number} · ${o}</span>
        <strong>${w(a)} answers.</strong>
      </p>
      ${ka(U.current,`<button class="button button--dark button--large" data-act="roulette-answer">I answered</button>
         ${n?`<button class="button button--large" data-act="roulette-skip">Skip →</button>`:``}
         <button class="button" data-act="pause">Pause</button>`)}`}else{let t=Array.from({length:32},(e,t)=>{let n=t+1;return`<span class="pocket" style="transform:rotate(${360/32*t+360/64}deg);color:${r.ink(n)}">${n}</span>`}).join(``);i=`
      <div class="roulette-wrap">
        <div class="who-card">
          <span class="hello">${r.label}</span>
          <strong>${w(e)} has ${yr(U.variant,U.herSide)}.</strong>
          <p class="muted" style="margin:0.4rem 0 0">You have ${yr(U.variant,U.mySide)}. If it lands on her side, she answers. If it lands on yours, you do.</p>
        </div>
        <div class="roulette-scene">
          <div class="roulette-pointer" aria-hidden="true"></div>
          <div class="roulette ${U.spinning?`spinning`:``}" style="background:conic-gradient(${vr(U.variant)});transform:rotate(${U.rotation}deg)">
            ${t}
          </div>
          <div class="roulette-hub">${U.number||`1–32`}</div>
        </div>
        <button class="button button--dark button--large" data-act="roulette-spin" ${U.spinning?`disabled`:``}>${U.spinning?`Spinning…`:`Spin the wheel`}</button>
        <button class="button" data-act="roulette-reset">Change the bet</button>
        <button class="button" data-act="pause">Pause</button>
      </div>`}V.innerHTML=`
    ${T({title:`Even & Odd`,actions:D()})}
    <main class="screen container">${i}</main>
  `}function ja(){(!U||U.mode!==`sip`)&&(U=xr());let e=J().skipAllowed;V.innerHTML=`
    ${T({title:`One Page`,actions:D()})}
    <main class="screen container">
      <header class="section-heading">
        <p class="hello">One Page</p>
        <h1>Just this.</h1>
      </header>
      ${ka(U.current,`<button class="button button--dark button--large" data-act="sip-next">I answered · another page</button>
         ${e?`<button class="button button--large" data-act="sip-skip">Skip →</button>`:``}
         <a class="button" href="#/play">Back to the shelf</a>`)}
    </main>
  `}function Ma(){(!U||U.mode!==`nightstand`)&&(U=wr());let e=J().skipAllowed;if(U.phase===`done`){V.innerHTML=`
      ${T({title:`The Nightstand`,actions:D()})}
      <main class="screen container">
        <section class="question-card">
          <p class="hello">Lights out</p>
          <h1>That’s three.</h1>
          <p>The nightstand is cleared. Pull another book whenever you want.</p>
          <div class="question-actions">
            <a class="button button--dark button--large" href="#/play">Back to the shelf</a>
          </div>
        </section>
      </main>
    `;return}V.innerHTML=`
    ${T({title:`The Nightstand`,actions:D()})}
    <main class="screen container">
      <header class="section-heading">
        <p class="hello">The Nightstand · ${U.index+1} of ${U.queue.length}</p>
        <h1>Before the light goes out.</h1>
      </header>
      ${ka(U.current,`<button class="button button--dark button--large" data-act="nightstand-next">${U.index===U.queue.length-1?`I answered · lights out`:`I answered`}</button>
         ${e?`<button class="button button--large" data-act="nightstand-skip">Skip →</button>`:``}
         <button class="button" data-act="pause">Pause</button>`)}
    </main>
  `}function Na(){(!U||U.mode!==`mug`)&&(U=Er());let e=y()||`You`,t=ne()||`her`,n=U.current,r=n?Ae(n.level,n.category):null,i=``;i=U.phase===`p1`?`
      <p class="hello">${w(e)} drinks first</p>
      <h1>Same mug. Same question.</h1>
      <article class="question-card">
        <span class="question-level ${n.level}">${r.emoji} ${r.label}</span>
        <h2>${w(n.question)}</h2>
        ${Ve(`mug-answer`)}
        <label class="field" style="display:block">
          <span class="muted">Your answer</span>
          <textarea id="mug-answer" rows="4" required></textarea>
        </label>
        <div class="question-actions">
          <button class="button button--dark button--large" data-act="mug-submit">Pass the mug →</button>
        </div>
      </article>`:U.phase===`handoff`?ei(t,`mug-go`,`Don’t peek. Same mug, same question.`):U.phase===`p2`?`
      <p class="hello">${w(t)}’s sip</p>
      <h1>Same question.</h1>
      <article class="question-card">
        <span class="question-level ${n.level}">${r.emoji} ${r.label}</span>
        <h2>${w(n.question)}</h2>
        ${Ve(`mug-answer`)}
        <label class="field" style="display:block">
          <span class="muted">Her answer</span>
          <textarea id="mug-answer" rows="4" required></textarea>
        </label>
        <div class="question-actions">
          <button class="button button--dark button--large" data-act="mug-submit">Read both →</button>
        </div>
      </article>`:`
      <header class="section-heading">
        <p class="hello">Both cups</p>
        <h1>${w(n.question)}</h1>
      </header>
      <div class="reveal-grid two">
        <article class="question-card">
          <p class="hello">${w(e)}</p>
          <p>${w(U.a1)}</p>
        </article>
        <article class="question-card">
          <p class="hello">${w(t)}</p>
          <p>${w(U.a2)}</p>
        </article>
      </div>
      <div class="question-actions">
        <button class="button button--dark" data-act="stamp-round">Stamp into album</button>
        <button class="button button--dark button--large" data-act="mug-again">Another mug</button>
        <a class="button" href="#/play">Back to the shelf</a>
      </div>`,V.innerHTML=`
    ${T({title:`Pass the Mug`,actions:D()})}
    <main class="screen container">${i}</main>
  `}function Pa(){if(!U||U.mode!==`deck`){V.innerHTML=`
      ${T({title:`The Deck`,actions:D()})}
      <main class="screen container">
        <header class="section-heading enter">
          <p class="hello">01 — The Deck</p>
          <h1>Choose your deck.</h1>
          <p class="muted">Shuffle a stack, draw a card, and talk. Skip anything you don’t want to answer.</p>
        </header>
        <div class="level-list">
          ${[`surface`,`personal`,`deep`,`together`,`random`].map(e=>`
            <button class="level level--${e}" data-act="start-deck" data-value="${e}">
              <div class="level-top"><strong>${ke[e].label}</strong>${Be(e)}</div>
              <h3>${ke[e].blurb}</h3>
              <span class="level-count">Draw a card →</span>
            </button>`).join(``)}
        </div>
      </main>
    `;return}let e=U.current,t=e?Ae(e.level,e.category):null,n=J().skipAllowed,r=e?.level||`surface`;V.innerHTML=`
    ${T({title:`The Deck`,actions:D()})}
    <main class="screen container">
      <div class="play-layout">
        ${Ka(`Cards left`,U.remaining.length)}
        <article class="game-shell">
          <header class="game-toolbar">
            <span class="game-status"><span class="status-dot ${r}"></span>${e?ke[e.level].label:`Ready`}</span>
            <span>${U.discarded.length+ +!!e} answered · ${U.skipped?.length||0} saved for later</span>
          </header>
          <div class="game-body">
            ${J().timer&&e?qa():``}
            <div class="card-stage">
              <div class="deck-stack">
                <div class="stack-card"></div>
                <div class="stack-card"></div>
                <div class="stack-card"></div>
                <article class="playing-card ${e&&U.flipped?`flipped`:``}">
                  <div class="face face-front">
                    <p class="card-logo">GTKY</p>
                    <p>?</p>
                    <p class="muted">Tap draw</p>
                  </div>
                  <div class="face face-back">
                    <span class="question-level ${r}">${t?`${t.label}`:`GTKY`}</span>
                    <h2 class="card-q">${e?w(e.question):`Draw a card to begin.`}</h2>
                    <p class="muted">${e?`Take your time. There isn’t a wrong answer.`:`${U.remaining.length} waiting`}</p>
                    ${e?`<div class="doodle-layer"><canvas></canvas><button type="button" class="chip doodle-clear" data-act="doodle-clear">Erase</button></div>`:``}
                  </div>
                </article>
              </div>
            </div>
            <div class="question-actions">
              ${e?`                    <button class="button button--dark button--large" data-act="deck-answer">I answered</button>
                     ${n?`<button class="button button--large" data-act="deck-skip">Skip for later →</button>`:``}
                     <button class="button" data-act="pause">Pause</button>`:`<button class="button button--dark button--large" data-act="draw">Draw card</button>
                     <button class="button button--large" data-act="reshuffle">Shuffle leftovers</button>
                     <button class="button" data-act="reset-deck">Reset cards</button>
                     <button class="button" data-act="pause">Pause</button>`}
            </div>
          </div>
        </article>
      </div>
    </main>
  `}function Fa(){if(!U||U.mode!==`wheel`){V.innerHTML=`
      ${T({title:`The Wheel`,actions:D()})}
      <main class="screen container">
        <header class="section-heading enter">
          <p class="hello">02 — The Wheel</p>
          <h1>Spin the level.</h1>
          <p class="muted">You don’t choose the depth. The wheel does.</p>
        </header>
        <div class="level-list">
          ${Object.values(Ye).map(e=>`
            <button class="level" data-act="start-wheel" data-value="${e.id}">
              <div class="level-top"><strong>${e.label}</strong><span class="mode-icon" style="width:42px;height:42px;font-size:1.2rem;margin:0">🎡</span></div>
              <p>${e.blurb}</p>
              <span class="level-count">Spin →</span>
            </button>`).join(``)}
        </div>
      </main>
    `;return}let e=U.current,t=e?Ae(e.level,e.category):null,n=J().skipAllowed;V.innerHTML=`
    ${T({title:`The Wheel`,actions:D()})}
    <main class="screen container">
      <div class="play-layout">
        ${Ka(`Preset`,Ye[U.preset].label)}
        <article class="game-shell">
          <header class="game-toolbar">
            <span class="game-status"><span class="status-dot ${e?.level||`surface`}"></span>${e?ke[e.level].label:`Spin`}</span>
            <span>${Ye[U.preset].label}</span>
          </header>
          <div class="game-body">
            ${e?`${J().timer?qa():``}
                   <article class="question-card idle-wiggle">
                     <span class="question-level ${e.level}">${t.emoji} ${t.label}</span>
                     <h2>${w(e.question)}</h2>
                     <p>Take your time. There isn’t a wrong answer.</p>
                     <div class="question-actions">
                       <button class="button button--dark button--large" data-act="wheel-answer">I answered</button>
                       ${n?`<button class="button button--large" data-act="wheel-skip">Skip →</button>`:``}
                       <button class="button" data-act="pause">Pause</button>
                     </div>
                   </article>`:`<div class="wheel-wrap">
                     <div class="wheel-scene">
                       <div class="pointer"></div>
                       <div class="wheel ${U.spinning?`spinning`:``}" style="background:conic-gradient(${Qe(U.preset)});transform:rotate(${U.rotation}deg)"></div>
                       <div class="wheel-hub">SPIN</div>
                     </div>
                     <ul class="wheel-legend">
                       <li><span class="dot surface"></span> Surface</li>
                       <li><span class="dot personal"></span> Personal</li>
                       <li><span class="dot deep"></span> Deep</li>
                       <li><span class="dot together"></span> Together</li>
                     </ul>
                     <button class="button button--dark button--large" data-act="spin" ${U.spinning?`disabled`:``}>${U.spinning?`Spinning…`:`Spin`}</button>
                     <button class="button" data-act="pause">Pause</button>
                   </div>`}
          </div>
        </article>
      </div>
    </main>
  `}function Ia(){if(!U||U.mode!==`duo`){let e=y()||`Player 1`,t=ne(),n=location.hostname===`localhost`||location.hostname===`127.0.0.1`;V.innerHTML=`
      ${T({title:`Two of Us`,actions:D()})}
      <main class="screen container">
        <div class="duo-layout">
          <header class="section-heading enter">
            <p class="hello">03 — Two of Us</p>
            <h1>What if you had to guess their answer?</h1>
            <p class="muted">One phone, or two. Host a party, send her the code (or a QR), and you each answer on your own screen.</p>
          </header>
          <div class="lobby-grid">
            <form id="duo-join" class="duo-card">
              <div class="player">
                <h3>Join her party</h3>
                <p class="muted">She started a game. Type the five-letter code.</p>
                <div class="field">
                  <label for="code">Room code</label>
                  <input id="code" name="code" value="${w(Ti)}" maxlength="8" placeholder="7X4K9" style="text-transform:uppercase;letter-spacing:.2em" />
                </div>
                <button class="button button--dark button-wide" type="submit">Join →</button>
              </div>
            </form>
            <form id="duo-setup" class="duo-card">
              <div class="player">
                <div class="field" style="margin:0">
                  <label for="player1">Your name</label>
                  <input id="player1" name="player1" value="${w(e)}" required maxlength="32" />
                </div>
              </div>
              <div class="duo-heart">♡</div>
              <div class="player">
                <div class="field" style="margin:0">
                  <label for="player2">Her name (if sharing a phone)</label>
                  <input id="player2" name="player2" value="${w(t)}" placeholder="Anna" maxlength="32" />
                </div>
              </div>
              <div class="player">
                <h3>How are you playing?</h3>
                <div class="style-grid">
                  <label class="style-chip selected">
                    <input type="radio" name="together" value="local" checked hidden />
                    One phone
                    <small>Pass it back and forth.</small>
                  </label>
                  <label class="style-chip">
                    <input type="radio" name="together" value="party" hidden />
                    Two phones
                    <small>You host. She joins with a code.</small>
                  </label>
                </div>
                ${n?`<p class="muted">For two phones, both need the same GTKY link (not 127.0.0.1). Use your computer’s Wi‑Fi address or the GitHub Pages URL.</p>`:``}
              </div>
              <div class="player">
                <h3>Depth</h3>
                <div class="level-row">${Ea(`level`)}</div>
              </div>
              <div class="player">
                <h3>Question style</h3>
                <div class="style-grid">
                  ${Object.values(ct).map(e=>`
                    <label class="style-chip">
                      <input type="radio" name="style" value="${e.id}" ${e.id===`mix`?`checked`:``} hidden />
                      ${e.label}
                      <small>${e.blurb}</small>
                    </label>`).join(``)}
                </div>
              </div>
              <div class="player">
                <button class="button button--dark button--large button-wide" type="submit">Start →</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    `,Ja();return}if(U.phase===`lobby`){La();return}if(U.phase===`waiting`||U.phase===`note-waiting`){Ra();return}if(U.phase===`note-handoff`||U.phase===`note-write`||U.phase===`note-reveal`){Ba();return}let e=ct[U.currentStyle],t=J().skipAllowed;if(U.phase===`handoff`){let n=U.turn===1?U.player1:U.player2;V.innerHTML=`
      ${T({title:`Two of Us`,actions:D()})}
      <main class="screen container">
        ${ei(n,`duo-begin`,`Round ${U.round} · ${e.label}. Keep the screen to yourself.`)}
        ${t?`<div class="question-actions" style="justify-content:center;margin-top:1rem"><button class="button" data-act="duo-skip">Skip this round →</button></div>`:``}
      </main>
    `;return}if(U.phase===`answer`){let n=U.online?O(U):U.turn,r=U.online?n===1?U.q1:U.q2:pt(U),i=U.online?n===1?U.player1:U.player2:U.turn===1?U.player1:U.player2,a=U.online?gt(U,n):mt(U),o=r?Ae(r.level,r.category):{emoji:``,label:``};if(U.online&&(n===1&&U.ready1||n===2&&U.ready2)){Ra();return}V.innerHTML=`
      ${T({title:`Two of Us`,actions:D()})}
      <main class="screen container">
        <article class="game-shell">
          <header class="game-toolbar">
            <span class="game-status"><span class="status-dot ${r?.level||`personal`}"></span>${w(i)} · ${e.label} ${U.online?`<span class="online-pill">live</span>`:``}</span>
            <span>Round ${U.round}</span>
          </header>
          <div class="game-body">
            ${J().timer?qa():``}
            <article class="question-card">
              <span class="question-level ${r?.level||`personal`}">${o.label}</span>
              <h2 style="white-space:pre-wrap">${w(a)}</h2>
              ${r?.choices?`<div class="choice-grid">
                      ${r.choices.map(e=>`<button class="choice-btn button" type="button" data-act="choose" data-value="${w(e)}">${w(e)}</button>`).join(``)}
                     </div>`:`<div class="composer">
                      <textarea id="duo-answer" class="composer-input" placeholder="Your turn…" autocomplete="off"></textarea>
                      <button class="send" type="button" data-act="duo-submit" aria-label="Lock in">↑</button>
                    </div>
                    ${Ve(`duo-answer`)}`}
              <div class="question-actions">
                ${r?.choices?`<button class="button button--dark button--large" data-act="duo-submit">Lock in</button>`:``}
                ${t?`<button class="button" data-act="duo-skip">Skip →</button>`:``}
              </div>
            </article>
          </div>
        </article>
      </main>
    `;return}let n=U.scored||{kind:U.currentStyle},r=U.q1,i=U.q2,a=`Both answers, side by side.`;n.kind===`predict`&&(a=n.matched?`You matched.`:`Not quite — still a good conversation.`),n.kind===`match`&&(a=n.same?`You both chose the same.`:`You think differently.`),n.kind===`connect`&&(a=`Connected questions.`);let o=n.kind===`predict`&&n.matched||n.kind===`match`&&n.same;V.innerHTML=`
    ${T({title:`Two of Us`,actions:D()})}
    <main class="screen container">
      <header class="section-heading">
        <p class="hello">Reveal · ${e.label}</p>
        <h2 class="match-banner ${o?`is-match`:``}">${a}</h2>
      </header>
      <article class="duo-card">
        <div class="player">
          <div class="player-name"><span>${w(U.player1)}</span><span>${n.kind===`predict`?`Prediction`:`Answer`}</span></div>
          <p class="muted">${w(r?.question||``)}</p>
          <div class="answer">${w(U.a1)}</div>
        </div>
        <div class="player player--blue">
          <div class="player-name"><span>${w(U.player2)}</span><span>Answer</span></div>
          <p class="muted">${w(i?.question||``)}</p>
          <div class="answer">${w(U.a2)}</div>
        </div>
      </article>
      ${n.kind===`match`&&!n.same?`<p class="center" style="margin-top:1.2rem">Why?</p>`:``}
      <div class="question-actions" style="justify-content:center">
        <button class="button button--dark button--large" data-act="duo-next">Next round →</button>
        <button class="button button--deep button--large" data-act="duo-wrap">Notes + About Us zine</button>
        <button class="button" data-act="pause">Pause</button>
      </div>
    </main>
  `}function La(){let e=U.peerStatus===`waiting`||U.peerStatus===`hosting`||U.peerStatus===`connecting`;V.innerHTML=`
    ${T({title:`Party`,actions:D()})}
    <main class="screen container">
      <section class="handoff enter">
        <span class="pass-stamp">${U.role===`host`?`Host`:`Joining`}</span>
        <h2>${e?`Waiting for her…`:U.error?`Couldn’t connect`:`Connected`}</h2>
        ${He()}
        ${U.roomCode?`<p class="ticket">${w(U.roomCode)}</p>`:``}
        <p class="muted">${U.error||(U.role===`host`?`She opens GTKY, taps Two of Us, and types that code — or scans the QR.`:`Hold on while we find the room.`)}</p>
        ${U.qr?`<div class="qr-wrap"><img alt="Join QR code" src="${U.qr}"/><button class="button" data-act="copy-code">Copy code</button></div>`:`<button class="button" data-act="copy-code">Copy code</button>`}
        ${location.hostname===`localhost`||location.hostname===`127.0.0.1`?`<p class="muted">This QR uses ${w(location.host)}. Her phone needs the same site over Wi‑Fi, not localhost.</p>`:``}
      </section>
    </main>
  `}function Ra(){let e=O(U)===1?U.player2:U.player1;V.innerHTML=`
    ${T({title:`Two of Us`,actions:D()})}
    <main class="screen container">
      <section class="handoff enter">
        <span class="pass-stamp">live</span>
        <h2 class="waiting-dots">Waiting for ${w(e)}</h2>
        ${He()}
        <p class="muted">You locked yours in. They’re still writing.</p>
      </section>
    </main>
  `}function za(){let e=ki||Ei&&Yt(Ei)||U?.journal||st()[0];if(!e){V.innerHTML=`
      ${T({title:`About us`,actions:E()})}
      <main class="screen container"><div class="empty muted">No About Us zine yet. Play Two of Us and wrap up with notes.</div></main>
    `;return}ki=e;let t=[{title:`About us`,body:`<h2>${w(e.p1)} & ${w(e.p2)}</h2><p>A GTKY zine of answers you actually gave each other.</p>`},...(e.entries||[]).map((t,n)=>({title:`Page ${n+1}`,body:`<p class="hello">${w(e.p1)}</p><p class="q">${w(t.q1?.question||``)}</p><p>${w(t.a1||``)}</p><p class="hello" style="margin-top:1.2rem">${w(e.p2)}</p><p class="q">${w(t.q2?.question||``)}</p><p>${w(t.a2||``)}</p>`})),{title:`Notes`,body:`<p class="q">${w(e.notes?.n1||`—`)}</p><p class="hello">${w(e.p1)} → ${w(e.p2)}</p><p class="q" style="margin-top:1.4rem">${w(e.notes?.n2||`—`)}</p><p class="hello">${w(e.p2)} → ${w(e.p1)}</p>`}],n=t[Math.min(Di,t.length-1)];if(!Oi){let t=Xt(e);Zt(t.tooLong?window.location.href.split(`#`)[0]+`#/zine`:t.url).then(e=>{Oi=e,H===`zine`&&Z()})}V.innerHTML=`
    ${T({title:`About us`,actions:E()})}
    <main class="screen container">
      <div class="zine-stage">
        <article class="polaroid">
          <p class="hello">${w(n.title)}</p>
          ${n.body}
        </article>
      </div>
      <div class="question-actions" style="justify-content:center">
        <button class="button" data-act="zine-prev">←</button>
        <button class="button button--dark" data-act="zine-next">Flip page →</button>
      </div>
      <div class="qr-wrap">
        ${Oi?`<img alt="Download QR" src="${Oi}"/>`:`<p class="muted">Drawing a QR…</p>`}
        <p class="muted">Scan to open this zine, or download a cute HTML keepsake.</p>
        <button class="button button--dark" data-act="download-zine">Download About Us</button>
      </div>
    </main>
  `}function Ba(){if(U.phase===`note-handoff`){let e=U.turn===1?U.player1:U.player2,t=U.turn===1?U.player2:U.player1;V.innerHTML=`
      ${T({title:`A little note`,actions:E()})}
      <main class="screen container">
        <section class="handoff enter">
          <span class="pass-stamp">Private</span>
          <h2>Pass to ${w(e)}</h2>
          <p class="muted">Write something only ${w(t)} will see. They can skip if they’d rather not.</p>
          <button class="button button--dark button--large" data-act="duo-begin">I’m ${w(e)}</button>
        </section>
      </main>
    `;return}if(U.phase===`note-write`){let e=U.online?O(U):U.turn;if(U.online&&(e===1&&U.ready1||e===2&&U.ready2)){Ra();return}let t=e===1?U.player1:U.player2,n=e===1?U.player2:U.player1;V.innerHTML=`
      ${T({title:`A little note`,actions:E()})}
      <main class="screen container">
        <article class="question-card enter">
          <span class="question-level deep">For ${w(n)}</span>
          <h2>${w(t)}, leave a note.</h2>
          <p class="muted">A thank-you, a secret, a “I liked when you said…” — whatever you want them to keep.</p>
          <div class="field">
            <label for="duo-note">Your note</label>
            <textarea id="duo-note" maxlength="400" placeholder="Dear ${w(n)}…" autocomplete="off"></textarea>
          </div>
          <div class="question-actions">
            <button class="button button--dark button--large" data-act="duo-note-submit">Seal it</button>
            <button class="button" data-act="duo-note-skip">Skip →</button>
          </div>
        </article>
      </main>
    `;return}let e=U.note1||`(no note this time)`,t=U.note2||`(no note this time)`;V.innerHTML=`
    ${T({title:`Keepsakes`,actions:E()})}
    <main class="screen container">
      <div class="envelope" aria-hidden="true">
        <div class="envelope-flap"></div>
        <div class="hearts"><span>♡</span><span>♡</span><span>♡</span><span>♡</span></div>
      </div>
      <header class="section-heading center" style="margin-inline:auto">
        <h2>Notes for each other.</h2>
        <p>These stay on this device, in Statistics, if you want to read them again.</p>
      </header>
      <div class="reveal-grid two">
        <article class="note-letter">
          <p class="hello">From ${w(U.player1)} → ${w(U.player2)}</p>
          <p>${w(e)}</p>
        </article>
        <article class="note-letter">
          <p class="hello">From ${w(U.player2)} → ${w(U.player1)}</p>
          <p>${w(t)}</p>
        </article>
      </div>
      <div class="question-actions" style="justify-content:center">
        <button class="button button--dark button--large" data-act="open-zine">Open About Us zine</button>
        <a class="button button--large" href="#/">Back home</a>
      </div>
    </main>
  `}function Va(){let e=ie(),t=ue(e),n=fe();V.innerHTML=`
    ${T({title:`Statistics`,actions:E()})}
    <main class="screen container">
      <header class="section-heading">
        <p class="hello">Your GTKY</p>
        <h1>Questions answered</h1>
        <p class="display" style="font-size:3.4rem;margin:0 0 1rem">${t}</p>
      </header>
      <div class="stats-grid">
        <div class="stat"><b>${e.answered.surface}</b><span>Surface</span></div>
        <div class="stat"><b>${e.answered.personal}</b><span>Personal</span></div>
        <div class="stat"><b>${e.answered.deep}</b><span>Deep</span></div>
        <div class="stat"><b>${e.answered.together||0}</b><span>Together</span></div>
        <div class="stat"><b>${e.duoSessions}</b><span>Two of Us</span></div>
        <div class="stat"><b>${e.wheelSpins}</b><span>Wheel spins</span></div>
        <div class="stat"><b>${e.cardsDrawn}</b><span>Cards drawn</span></div>
        <div class="stat"><b>${e.predictTotal?Math.round(e.predictMatches/e.predictTotal*100):0}%</b><span>Predict matches</span></div>
        <div class="stat"><b>${st().length}</b><span>About Us zines</span></div>
      </div>
      ${st().length?`<h2 style="margin-top:2.4rem">About Us</h2>
             <div class="question-actions">
               <button class="button button--dark" data-act="open-zine">Open latest zine</button>
             </div>`:``}
      ${n.length?`<h2 style="margin-top:2.4rem">Keepsakes</h2>
             <div class="library-list" style="margin-top:1rem">
               ${n.slice(0,8).map(e=>`
                 <article class="note-letter">
                   <p class="hello">From ${w(e.from)} → ${w(e.to)}</p>
                   <p>${w(e.text)}</p>
                 </article>`).join(``)}
             </div>`:``}
    </main>
  `}function Ha(){let e=J(),t=y();V.innerHTML=`
    ${T({title:`Settings`,actions:E()})}
    <main class="screen container">
      <section class="panel enter">
        <h2>Player</h2>
        <form id="guest-form">
          <div class="field">
            <label for="name">Name</label>
            <input id="name" name="name" value="${w(t)}" maxlength="32" />
          </div>
          <button class="button" type="submit">Save name</button>
        </form>
        <h2 style="margin-top:28px">Appearance</h2>
        <div class="actions-row three">
          ${[`light`,`dark`,`system`].map(t=>`<button class="button ${e.theme===t?`button--dark`:``}" data-act="theme" data-value="${t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join(``)}
        </div>
        <h2 style="margin-top:28px">Audio</h2>
        ${Q(`music`,`Music`,e.music)}
        ${Q(`sfx`,`Sound effects`,e.sfx)}
        <h2 style="margin-top:28px">Gameplay</h2>
        ${Q(`timer`,`Timer`,e.timer)}
        ${Q(`skipAllowed`,`Skip allowed`,e.skipAllowed)}
        ${Q(`animations`,`Animations`,e.animations)}
        <h2 style="margin-top:28px">Two of Us</h2>
        ${Q(`predictionScoring`,`Prediction scoring`,e.predictionScoring)}
        ${Q(`revealAnimations`,`Reveal animations`,e.revealAnimations)}
        <h2 style="margin-top:28px">Hidden questions</h2>
        ${gi()}
      </section>
    </main>
  `}function Q(e,t,n){return`
    <div class="setting-row">
      <span>${w(t)}</span>
      <button class="toggle ${n?`on`:``}" data-act="toggle" data-value="${e}" aria-pressed="${n}" aria-label="${w(t)}"></button>
    </div>
  `}function Ua(){V.innerHTML=`
    ${T({title:`Library`,actions:E()})}
    <main class="screen container">
      <header class="section-heading">
        <h1>Question library</h1>
        <p class="muted">Browse before you play. Skip still exists in-game, always.</p>
      </header>
      <div class="library-filters">
        ${[`surface`,`personal`,`deep`,`together`].map(e=>`<button class="button ${wi===e?`button--dark`:``}" data-act="library-level" data-value="${e}">${ke[e].label}</button>`).join(``)}
      </div>
      <div class="field">
        <label for="library-search">Search</label>
        <input id="library-search" placeholder="proud, travel, love…" />
      </div>
      <div class="library-list" id="library-list"></div>
    </main>
  `,Ga(``)}function Wa(){let e=De();return e?`<div class="spark-card">
    <p class="hello">Daily spark</p>
    <p>${w(e.question)}</p>
    <button class="chip" data-act="pin-later" data-value="${w(e.id)}">Save for later</button>
  </div>`:``}function $(){(!U||U.mode!==H)&&Ji(H);let e=ni(H,{session:U,skip:Gi(),me:y()||`You`,her:ne()||`them`,roster:qi()});e&&(V.innerHTML=e);let t=V.querySelector(`.postcard-timer`);if(t){let e=Number(t.dataset.ends),n=()=>{let n=Math.max(0,Math.ceil((e-Date.now())/1e3));t.textContent=`${n}s`,n<=0&&(window.clearInterval(t._id),U?.mode===`postcards`&&(U.phase===`p1`||U.phase===`p2`)&&(Wr(U,U.phase===`p1`?1:2,document.getElementById(`postcard-text`)?.value||`(time)`),Z()))};n(),t._id=window.setInterval(n,250)}}function Ga(e){let t=e.trim().toLowerCase(),n=Se().filter(e=>e.level===wi).filter(e=>!t||e.question.toLowerCase().includes(t)||e.category.includes(t)),r=document.querySelector(`#library-list`);if(r){if(!n.length){r.innerHTML=`<div class="empty muted">No questions match that search.</div>`;return}r.innerHTML=n.map(e=>`<article class="library-item"><span class="category-chip">${Ae(e.level,e.category).label} · intensity ${e.intensity}</span><p>${w(e.question)}</p>
        <div class="night-tools">
          <button type="button" class="chip" data-act="pin-later" data-value="${w(e.id)}">For later</button>
          <button type="button" class="chip" data-act="veto-q" data-value="${w(e.id)}">Hide this one</button>
        </div></article>`).join(``)}}function Ka(e,t){let n=ie();return`
    <aside class="panel side-panel desktop-only">
      <p class="hello">Players</p>
      <p><strong>${w(y())}</strong></p>
      ${U?.player2?`<p><strong>${w(U.player2)}</strong></p>`:``}
      <p class="muted" style="margin-top:1rem">${w(e)}</p>
      <p class="display" style="font-size:2rem;margin:0">${w(String(t))}</p>
      <p class="muted" style="margin-top:1rem">${n.answered.surface} surface · ${n.answered.personal} personal · ${n.answered.deep} deep · ${n.answered.together||0} together</p>
    </aside>
  `}function qa(){return`<div class="timer on"><span style="animation-duration:60s"></span></div>`}function Ja(){V.querySelectorAll(`.level-chip, .style-chip`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.querySelector(`input`)?.name;V.querySelectorAll(`input[name="${t}"]`).forEach(e=>{e.closest(`label`)?.classList.remove(`selected`)}),e.classList.add(`selected`)}),e.querySelector(`input`)?.checked&&e.classList.add(`selected`)})}ea();export{s as n,l as r,o as t};