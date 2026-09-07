'use strict';

const $ = id => document.getElementById(id);
const STORE = 'astrowindow.v2';
const DAY = 86400000;
const DEFAULT = {
  lang:'en', red:false, activeView:'dashboard', selectedDate:null, selectedTarget:'WR 134',
  activePlace:1, places:[
    {id:1,name:'Sderot, Israel',lat:31.5235,lon:34.5931,bortle:8,sqm:null,horizon:{n:25,e:25,s:22,w:30}},
    {id:2,name:'Shittim / Negev',lat:30.33,lon:34.95,bortle:3,sqm:null,horizon:{n:15,e:12,s:12,w:15}}
  ],
  activeRig:1, rigs:[
    {id:1,name:'FRA400 + reducer · 2600MC · L-Ultimate',focal:280,aperture:72,sensorW:23.5,sensorH:15.7,pixel:3.76,filter:'haoiii',mount:'medium',wind:20,minAlt:30},
    {id:2,name:'FRA400 native · 2600MC · L-Ultimate',focal:400,aperture:72,sensorW:23.5,sensorH:15.7,pixel:3.76,filter:'haoiii',mount:'medium',wind:20,minAlt:30},
    {id:3,name:'FRA400 native · 2600MC · Askar E2',focal:400,aperture:72,sensorW:23.5,sensorH:15.7,pixel:3.76,filter:'siioiii',mount:'medium',wind:20,minAlt:30}
  ],
  limits:{cloud:20,dew:2,window:1.5}, bookmarks:['WR 134','Crescent Nebula (NGC 6888)','Flying Bat (Sh2-129)'], plans:{}
};

const DSO = [
 ['Andromeda Galaxy (M31)','Galaxy',10.685,41.269,190,60,35,'broadband'],['Triangulum Galaxy (M33)','Galaxy',23.462,30.66,73,45,35,'broadband'],['Whirlpool Galaxy (M51)','Galaxy',202.47,47.195,11,7,40,'broadband'],['Pinwheel Galaxy (M101)','Galaxy',210.803,54.349,29,27,35,'broadband'],['Bode’s Galaxy (M81)','Galaxy',148.888,69.065,27,14,35,'broadband'],['Cigar Galaxy (M82)','Galaxy',148.969,69.68,11,5,35,'broadband'],['Leo Triplet','Galaxy',169.75,13.15,70,40,32,'broadband'],
 ['Orion Nebula (M42)','Emission',83.822,-5.391,85,60,20,'haoiii'],['Horsehead Nebula (B33)','Dark',85.25,-2.45,60,40,25,'broadband'],['Rosette Nebula (Sh2-275)','Emission',97.95,4.95,80,65,25,'haoiii'],['California Nebula (NGC 1499)','Emission',60.65,36.4,160,40,28,'haoiii'],['Heart Nebula (IC 1805)','Emission',38.3,61.45,150,150,28,'haoiii'],['Soul Nebula (IC 1848)','Emission',44.5,60.43,150,75,28,'haoiii'],['Heart & Soul Mosaic','Emission',41.5,60.9,310,180,25,'haoiii'],['Flaming Star (IC 405)','Emission',79.1,34.27,37,19,28,'haoiii'],['Tadpoles (IC 410)','Emission',82.42,33.41,40,30,28,'haoiii'],['NGC 1893','Emission',80.72,33.41,25,25,30,'haoiii'],
 ['North America (NGC 7000)','Emission',314.75,44.33,120,100,25,'haoiii'],['Pelican Nebula (IC 5070)','Emission',312.75,44.4,85,70,25,'haoiii'],['Sadr Region (IC 1318)','Emission',305.5,40.25,180,120,22,'haoiii'],['Veil Nebula Complex','SNR',312.5,30.7,180,150,25,'haoiii'],['Eastern Veil (NGC 6992)','SNR',313.0,31.72,70,10,25,'haoiii'],['Western Veil (NGC 6960)','SNR',311.4,30.72,70,10,25,'haoiii'],['Crescent Nebula (NGC 6888)','Emission',303.03,38.35,20,10,35,'haoiii'],['Flying Bat (Sh2-129)','Emission',319.75,59.9,140,140,25,'haoiii'],['Squid Nebula (Ou4)','Emission',319.9,59.6,75,25,38,'oiii'],['WR 134','Emission',302.1,36.0,40,40,35,'haoiii'],['Sh2-132 Lion Nebula','Emission',334.5,56.0,90,60,28,'haoiii'],['Elephant Trunk (IC 1396)','Emission',324.75,57.5,170,140,25,'haoiii'],['Wizard Nebula (NGC 7380)','Emission',342.1,58.13,25,20,32,'haoiii'],['Bubble Nebula (NGC 7635)','Emission',350.2,61.2,15,8,38,'haoiii'],
 ['Lagoon Nebula (M8)','Emission',270.93,-24.38,90,40,22,'haoiii'],['Trifid Nebula (M20)','Emission',270.63,-23.03,28,28,28,'haoiii'],['Eagle Nebula (M16)','Emission',274.7,-13.8,35,28,25,'haoiii'],['Omega Nebula (M17)','Emission',275.2,-16.18,46,37,25,'haoiii'],['Rho Ophiuchi','Reflection',246.65,-24.45,300,240,18,'broadband'],
 ['Pleiades (M45)','Reflection',56.75,24.12,110,110,22,'broadband'],['Iris Nebula (NGC 7023)','Reflection',315.4,68.17,18,18,35,'broadband'],['NGC 1333','Reflection',52.3,31.3,20,15,35,'broadband'],['Witch Head (IC 2118)','Reflection',75.0,-7.2,180,60,22,'broadband'],
 ['Dumbbell Nebula (M27)','Planetary',299.9,22.72,8,6,42,'oiii'],['Ring Nebula (M57)','Planetary',283.4,33.03,1.4,1.0,48,'oiii'],['Helix Nebula (NGC 7293)','Planetary',337.4,-20.84,25,20,28,'oiii'],['Pacu Man (NGC 281)','Emission',13.0,56.62,35,30,30,'haoiii'],['NGC 7822','Emission',0.75,67.15,60,40,30,'haoiii'],['Double Cluster','Cluster',35.0,57.13,60,30,25,'broadband']
].map((d,i)=>({id:i,name:d[0],type:d[1],ra:d[2],dec:d[3],w:d[4],h:d[5],minAlt:d[6],signal:d[7]}));

let state = loadState(), weather=null, nights=[], evaluations=[], timelineChart=null, targetChart=null;
function loadState(){try{return merge(structuredClone(DEFAULT),JSON.parse(localStorage.getItem(STORE)||'{}'))}catch{return structuredClone(DEFAULT)}}
function merge(a,b){for(const k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])&&a[k]) merge(a[k],b[k]);else a[k]=b[k]}return a}
function save(){localStorage.setItem(STORE,JSON.stringify(state))}
const place=()=>state.places.find(x=>x.id===state.activePlace)||state.places[0];
const rig=()=>state.rigs.find(x=>x.id===state.activeRig)||state.rigs[0];
const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
const rad=x=>x*Math.PI/180, deg=x=>x*180/Math.PI;
const round=(x,n=0)=>Number(x).toFixed(n);
const fmtDate=d=>d.toISOString().slice(0,10);
function siteFmt(d,opts={hour:'2-digit',minute:'2-digit'}){return new Intl.DateTimeFormat(state.lang==='he'?'he-IL':'en-GB',{...opts,timeZone:weather?.timezone||'UTC',hour12:false}).format(d)}
function parseWeatherTime(s){return new Date(Date.parse(s+'Z')-(weather?.utc_offset_seconds||0)*1000)}
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2200)}

document.addEventListener('DOMContentLoaded',init);
async function init(){
  state.selectedDate ||= fmtDate(new Date());
  bind(); applyPrefs(); renderStatic(); await refresh();
  if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
function bind(){
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.onclick=()=>switchView(b.dataset.view));
  $('refreshButton').onclick=refresh;$('redButton').onclick=()=>{state.red=!state.red;save();applyPrefs()};$('langButton').onclick=()=>{state.lang=state.lang==='en'?'he':'en';save();applyPrefs();renderAll()};
  $('nightDate').onchange=e=>{state.selectedDate=e.target.value;save();renderAll()};$('prevDate').onclick=()=>shiftDate(-1);$('nextDate').onclick=()=>shiftDate(1);
  $('placeButton').onclick=()=>switchView('places');$('gpsButton').onclick=useGPS;$('placeForm').onsubmit=addPlace;
  $('rigSelect').onchange=e=>{state.activeRig=+e.target.value;save();fillRig();renderAll()};$('rigForm').onsubmit=saveRig;$('newRigButton').onclick=newRig;$('saveHorizon').onclick=saveHorizon;
  ['cloudLimit','dewLimit','windowLimit'].forEach(id=>$(id).onchange=()=>{state.limits.cloud=+$('cloudLimit').value;state.limits.dew=+$('dewLimit').value;state.limits.window=+$('windowLimit').value;save();renderAll()});
  $('targetSearch').oninput=renderTargets;$('targetType').onchange=renderTargets;$('bookmarksOnly').onchange=renderTargets;
  $('closeDialog').onclick=()=>$('targetDialog').close();$('planButton').onclick=()=>{buildPlan();switchView('plan')};$('savePlanButton').onclick=savePlan;$('exportButton').onclick=exportPlan;
}
function applyPrefs(){document.body.classList.toggle('red-mode',state.red);document.documentElement.dir=state.lang==='he'?'rtl':'ltr';$('langButton').textContent=state.lang==='en'?'HE':'EN'}
function switchView(id){state.activeView=id;save();document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===id));if(id==='targets')renderTargets();if(id==='plan')buildPlan();scrollTo(0,0)}
function shiftDate(n){const d=new Date(state.selectedDate+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);state.selectedDate=fmtDate(d);$('nightDate').value=state.selectedDate;save();renderAll()}

async function refresh(){
  $('refreshButton').disabled=true;$('decision').textContent='Updating forecast…';
  const p=place();
  const hourly='temperature_2m,relative_humidity_2m,dew_point_2m,precipitation_probability,precipitation,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,wind_speed_10m,wind_gusts_10m,wind_direction_10m';
  try{
    const u=`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&hourly=${hourly}&timezone=auto&forecast_days=8`;
    const response=await fetch(u);if(!response.ok)throw Error(response.status);weather=await response.json();weather.fetchedAt=new Date().toISOString();localStorage.setItem('astrowindow.weather.'+p.id,JSON.stringify(weather));
    try{weather.modelSpread=await fetchModelSpread(p)}catch{weather.modelSpread=null}
  }catch(e){const cached=localStorage.getItem('astrowindow.weather.'+p.id);if(cached){weather=JSON.parse(cached);$('offlineNotice').classList.remove('hidden')}else{$('decision').textContent='Forecast unavailable';$('decisionReason').textContent='Check your connection and refresh.';return}}
  finally{$('refreshButton').disabled=false}
  renderAll();
}
async function fetchModelSpread(p){
  const u=`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&hourly=cloud_cover,wind_speed_10m&models=icon_seamless,gfs_seamless,ecmwf_ifs025&timezone=auto&forecast_days=8`;
  const r=await fetch(u);if(!r.ok)throw Error();const j=await r.json();return j.hourly;
}

function makeNight(dateString){
  const p=place(), noon=new Date(dateString+'T12:00:00Z'), t=SunCalc.getTimes(noon,p.lat,p.lon), next=SunCalc.getTimes(new Date(noon.getTime()+DAY),p.lat,p.lon);
  const dusk=t.night, dawn=next.nightEnd, midpoint=new Date((dusk.getTime()+dawn.getTime())/2), illum=SunCalc.getMoonIllumination(midpoint);
  return {date:dateString,dusk,dawn,sunset:t.sunset,sunrise:next.sunrise,midpoint,illum};
}
function hoursForNight(n){
  if(!weather)return[];return weather.hourly.time.map((s,i)=>({
    time:parseWeatherTime(s),temp:weather.hourly.temperature_2m[i],humidity:weather.hourly.relative_humidity_2m[i],dew:weather.hourly.dew_point_2m[i],precipProb:weather.hourly.precipitation_probability[i],precip:weather.hourly.precipitation[i],cloud:weather.hourly.cloud_cover[i],low:weather.hourly.cloud_cover_low[i],mid:weather.hourly.cloud_cover_mid[i],high:weather.hourly.cloud_cover_high[i],visibility:weather.hourly.visibility[i],wind:weather.hourly.wind_speed_10m[i],gust:weather.hourly.wind_gusts_10m[i],windDir:weather.hourly.wind_direction_10m[i]
  })).filter(x=>x.time>=n.dusk&&x.time<=n.dawn)}
function weatherQuality(h){
  const r=rig(), dewGap=h.temp-h.dew;
  let s=100-h.cloud*1.05-Math.max(0,h.gust-r.wind)*2.4-Math.max(0,h.wind-r.wind)*1.4-h.precipProb*.7;
  if(h.precip>0)s-=55;if(dewGap<state.limits.dew)s-=22;if(h.humidity>92)s-=12;if(h.visibility<10000)s-=10;
  return clamp(Math.round(s));
}
function getGMST(d){const jd=d.getTime()/DAY+2440587.5;return((280.46061837+360.98564736629*(jd-2451545))%360+360)%360}
function azAlt(d,obj){
  const p=place(),ha=rad((((getGMST(d)+p.lon-obj.ra+540)%360)-180)),dc=rad(obj.dec),ph=rad(p.lat),sa=Math.sin(dc)*Math.sin(ph)+Math.cos(dc)*Math.cos(ph)*Math.cos(ha),alt=Math.asin(sa),az=Math.atan2(-Math.sin(ha)*Math.cos(dc),Math.sin(dc)*Math.cos(ph)-Math.cos(dc)*Math.sin(ph)*Math.cos(ha));
  return{alt:deg(alt),az:(deg(az)+360)%360};
}
function horizonAt(az){const h=place().horizon||{n:rig().minAlt,e:rig().minAlt,s:rig().minAlt,w:rig().minAlt};if(az<90)return h.n+(h.e-h.n)*az/90;if(az<180)return h.e+(h.s-h.e)*(az-90)/90;if(az<270)return h.s+(h.w-h.s)*(az-180)/90;return h.w+(h.n-h.w)*(az-270)/90}
function moonAt(d){const m=SunCalc.getMoonPosition(d,place().lat,place().lon);return{alt:deg(m.altitude),az:(deg(m.azimuth)+180+360)%360}}
function separation(a,b){return deg(Math.acos(clamp(Math.sin(rad(a.alt))*Math.sin(rad(b.alt))+Math.cos(rad(a.alt))*Math.cos(rad(b.alt))*Math.cos(rad(a.az-b.az)),-1,1)))}
function optics(){const r=rig();return{fRatio:r.focal/r.aperture,scale:206.265*r.pixel/r.focal,fovW:deg(2*Math.atan(r.sensorW/(2*r.focal))),fovH:deg(2*Math.atan(r.sensorH/(2*r.focal)))}}
function filterFit(o,moonIll,sep){const f=rig().filter;let s=100;if(f==='broadband'&&o.signal!=='broadband')s-=12;if(f!=='broadband'&&['Galaxy','Reflection','Dark','Cluster'].includes(o.type))return 5;if(f==='siioiii'&&o.signal==='haoiii')s-=18;if(f==='haoiii'&&o.signal==='oiii')s-=5;if(moonIll>.55){if(f==='broadband')s-=Math.max(0,65-sep)*.9+moonIll*30;else s-=Math.max(0,35-sep)*.35}return clamp(s)}
function framing(o){const f=optics(),fit=Math.max(o.w/(f.fovW*60),o.h/(f.fovH*60));if(fit>1.8)return{score:45,label:`${Math.ceil(fit)}-panel mosaic`};if(fit>1.05)return{score:70,label:'Tight / mosaic'};if(fit<.04)return{score:35,label:'Very small'};if(fit<.12)return{score:62,label:'Small framing'};return{score:100,label:'Good framing'}}
function evaluateTarget(o,n){
  const hs=hoursForNight(n),fr=framing(o);let rows=hs.map(h=>{const pos=azAlt(h.time,o),moon=moonAt(h.time),sep=separation(pos,moon),min=Math.max(rig().minAlt,o.minAlt,horizonAt(pos.az)),altQ=clamp((pos.alt-min)*3.2+35),moonFit=filterFit(o,n.illum.fraction,sep),wq=weatherQuality(h),score=pos.alt<min?0:Math.round(wq*.46+altQ*.25+moonFit*.19+fr.score*.10);return{...h,...pos,moonAlt:moon.alt,moonSep:sep,score,minAlt:min}});
  const usable=rows.filter(x=>x.score>=60),max=rows.reduce((a,b)=>a.alt>b.alt?a:b,rows[0]||{alt:0}),avg=usable.length?usable.reduce((s,x)=>s+x.score,0)/usable.length:0;
  return{target:o,rows,score:Math.round(avg),hours:usable.length,maxAlt:max.alt||0,transit:max.time,framing:fr,best:bestWindow(usable)};
}
function bestWindow(rows){if(!rows.length)return null;const blocks=[];let b=[rows[0]];for(let i=1;i<rows.length;i++){if(rows[i].time-rows[i-1].time<=1.1*3600000)b.push(rows[i]);else{blocks.push(b);b=[rows[i]]}}blocks.push(b);return blocks.map(x=>({start:x[0].time,end:new Date(x.at(-1).time.getTime()+3600000),duration:(x.at(-1).time-x[0].time)/3600000+1,avg:Math.round(x.reduce((s,h)=>s+h.score,0)/x.length)})).sort((a,b)=>b.duration-a.duration||b.avg-a.avg)[0]}
function modelConfidence(n,hs){let base=94-Math.max(0,(n.midpoint-new Date())/DAY)*6;if(!weather.modelSpread)return clamp(Math.round(base-12));const keys=Object.keys(weather.modelSpread).filter(k=>k.startsWith('cloud_cover_'));if(keys.length<2)return clamp(Math.round(base-10));let devs=[];hs.forEach(h=>{const idx=weather.hourly.time.findIndex(s=>parseWeatherTime(s).getTime()===h.time.getTime());const vals=keys.map(k=>weather.modelSpread[k]?.[idx]).filter(Number.isFinite);if(vals.length>1)devs.push(Math.max(...vals)-Math.min(...vals))});const spread=devs.length?devs.reduce((a,b)=>a+b,0)/devs.length:20;return clamp(Math.round(base-spread*.7))}
function summarizeNight(n){const hs=hoursForNight(n),w=hs.map(weatherQuality),weatherScore=w.length?Math.round(w.reduce((a,b)=>a+b,0)/w.length):0;const evals=DSO.map(o=>evaluateTarget(o,n)).sort((a,b)=>b.score-a.score);const chosen=evals.find(e=>e.target.name===state.selectedTarget)||evals[0],confidence=modelConfidence(n,hs),overall=Math.round(weatherScore*.48+chosen.score*.42+confidence*.10);return{night:n,hours:hs,weatherScore,confidence,chosen,evals,overall,best:chosen.best}}

function renderAll(){if(!weather)return;const base=new Date(state.selectedDate+'T12:00:00Z');nights=Array.from({length:7},(_,i)=>{const d=new Date(base.getTime()+i*DAY);return summarizeNight(makeNight(fmtDate(d)))});renderDashboard(nights[0]);renderTargets();fillPlaces();fillRig();renderPlan()}
function renderStatic(){$('nightDate').value=state.selectedDate;$('cloudLimit').value=state.limits.cloud;$('dewLimit').value=state.limits.dew;$('windowLimit').value=state.limits.window;switchView(state.activeView)}
function renderDashboard(s){
  const p=place(),r=rig(),e=s.chosen,b=s.best;$('placeButton').textContent=`📍 ${p.name} · B${p.bortle||'?'}${p.sqm?' · '+p.sqm+' SQM':''}`;
  const age=(Date.now()-new Date(weather.fetchedAt||Date.now()))/60000;$('freshness').textContent=age<2?'Updated now':`Updated ${Math.round(age)}m ago`;
  $('weatherScore').textContent=s.weatherScore;$('targetScore').textContent=e.score;$('confidenceScore').textContent=s.confidence;$('imagingScore').textContent=s.overall;document.querySelector('.score-ring').style.setProperty('--score',s.overall+'%');
  $('weatherWhy').textContent=weatherWhy(s.hours);$('targetWhy').textContent=e.target.name;$('confidenceWhy').textContent=s.confidence>75?'Models mostly agree':s.confidence>55?'Some uncertainty':'Low confidence';
  $('decision').textContent=s.overall>=75?`Shoot ${e.target.name}`:s.overall>=55?`${e.target.name} is possible`:'Consider skipping or monitor conditions';
  $('decisionReason').textContent=`${r.name} · ${e.framing.label} · Moon ${Math.round(s.night.illum.fraction*100)}% · max ${Math.round(e.maxAlt)}°`;
  $('bestWindow').textContent=b?`${siteFmt(b.start)} → ${siteFmt(b.end)}`:'No reliable window';$('bestDuration').textContent=b?`${round(b.duration,1)} h`:'0 h';$('timelineTitle').textContent=e.target.name;
  renderTimeline(e,s);renderNotes(s);renderNights();
}
function weatherWhy(hs){if(!hs.length)return'No forecast data';const c=Math.round(hs.reduce((s,h)=>s+h.cloud,0)/hs.length),g=Math.round(Math.max(...hs.map(h=>h.gust)));return`${c}% cloud avg · ${g} km/h max gust`}
function renderTimeline(e,s){
  if(timelineChart)timelineChart.destroy();const labels=e.rows.map(x=>siteFmt(x.time)),darkStart=0;
  timelineChart=new Chart($('timelineChart'),{type:'line',data:{labels,datasets:[{label:'Cloud %',data:e.rows.map(x=>x.cloud),borderColor:'#64748b',backgroundColor:'#64748b22',fill:true,yAxisID:'y',pointRadius:0,tension:.25},{label:'Target altitude',data:e.rows.map(x=>Math.max(0,x.alt)),borderColor:'#38bdf8',yAxisID:'y',pointRadius:0,borderWidth:3,tension:.25},{label:'Moon altitude',data:e.rows.map(x=>Math.max(0,x.moonAlt)),borderColor:'#e2e8f0',borderDash:[5,5],yAxisID:'y',pointRadius:0},{label:'Gust km/h',data:e.rows.map(x=>x.gust),borderColor:'#f59e0b',borderDash:[2,3],yAxisID:'y',pointRadius:0}]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:false},tooltip:{callbacks:{afterBody:items=>{const x=e.rows[items[0].dataIndex];return[`Score ${x.score}/100`,`Dew gap ${round(x.temp-x.dew,1)}°C`,`Moon separation ${Math.round(x.moonSep)}°`]}}}},scales:{x:{ticks:{color:'#8ca0b9',maxTicksLimit:10},grid:{color:'#ffffff0a'}},y:{min:0,max:100,ticks:{color:'#8ca0b9'},grid:{color:'#ffffff0a'}}}}})
}
function renderNotes(s){const hs=s.hours,notes=[];if(!hs.length)notes.push(['⚠','No hourly weather data for this night.']);else{const minGap=Math.min(...hs.map(h=>h.temp-h.dew)),dewAt=hs.find(h=>h.temp-h.dew===minGap);if(minGap<state.limits.dew+1)notes.push(['💧',`Dew gap reaches ${round(minGap,1)}°C near ${siteFmt(dewAt.time)}. Start heaters early.`]);const gust=Math.max(...hs.map(h=>h.gust));if(gust>rig().wind)notes.push(['🌬',`Gusts reach ${Math.round(gust)} km/h, above this rig’s ${rig().wind} km/h limit.`]);const rain=Math.max(...hs.map(h=>h.precipProb));if(rain>20)notes.push(['🌧',`Precipitation probability reaches ${Math.round(rain)}%.`]);if(s.night.illum.fraction>.55)notes.push(['☾',`${Math.round(s.night.illum.fraction*100)}% Moon; target-specific separation and filter are included.`]);if(s.confidence<65)notes.push(['≈','Forecast confidence is limited; recheck close to setup time.'])}if(!notes.length)notes.push(['✓','No major equipment-risk conditions detected.']);$('nightNotes').innerHTML=notes.map(n=>`<div class="note"><b>${n[0]}</b><span>${n[1]}</span></div>`).join('')}
function renderNights(){$('nightList').innerHTML=nights.map((s,i)=>`<button class="night card ${i===0?'selected':''}" data-i="${i}"><small>${siteFmt(s.night.midpoint,{weekday:'short'})}</small><strong>${s.overall}</strong><span>${Math.round(s.night.illum.fraction*100)}% ☾</span><small>${s.best?round(s.best.duration,1)+'h':'No window'}</small></button>`).join('');document.querySelectorAll('.night').forEach(b=>b.onclick=()=>{state.selectedDate=nights[+b.dataset.i].night.date;$('nightDate').value=state.selectedDate;save();renderAll()})}

function renderTargets(){if(!nights.length)return;const q=$('targetSearch').value.toLowerCase(),type=$('targetType').value,bm=$('bookmarksOnly').checked;evaluations=nights[0].evals.filter(e=>(!q||e.target.name.toLowerCase().includes(q))&&(type==='all'||e.target.type===type)&&(!bm||state.bookmarks.includes(e.target.name)));$('targetList').innerHTML=evaluations.map(e=>`<article class="target-card card" data-id="${e.target.id}"><div><span class="pill">${e.target.type}</span><h3>${e.target.name}</h3><div class="target-meta">${e.framing.label} · ${e.hours}h usable · max ${Math.round(e.maxAlt)}° · ${e.best?siteFmt(e.best.start)+'–'+siteFmt(e.best.end):'no window'}</div></div><div><button class="bookmark" data-bookmark="${e.target.id}">${state.bookmarks.includes(e.target.name)?'★':'☆'}</button><div class="target-score">${e.score}</div></div></article>`).join('')||'<article class="card muted">No matching targets.</article>';document.querySelectorAll('.target-card').forEach(c=>c.onclick=e=>{if(e.target.closest('.bookmark'))return;showTarget(+c.dataset.id)});document.querySelectorAll('.bookmark').forEach(b=>b.onclick=()=>toggleBookmark(+b.dataset.bookmark))}
function toggleBookmark(id){const n=DSO[id].name;state.bookmarks=state.bookmarks.includes(n)?state.bookmarks.filter(x=>x!==n):[...state.bookmarks,n];save();renderTargets()}
function showTarget(id){const e=nights[0].evals.find(x=>x.target.id===id);state.selectedTarget=e.target.name;save();$('targetDetail').innerHTML=`<p class="eyebrow">${e.target.type}</p><h2>${e.target.name}</h2><p class="muted">Score ${e.score}/100 · ${e.framing.label} · ${round(e.hours,1)} usable hours · transit ${siteFmt(e.transit)} at ${Math.round(e.maxAlt)}°.</p><div class="data-grid"><div><span>Apparent size</span><strong>${e.target.w}' × ${e.target.h}'</strong></div><div><span>Your FOV</span><strong>${round(optics().fovW,2)}° × ${round(optics().fovH,2)}°</strong></div><div><span>Best window</span><strong>${e.best?siteFmt(e.best.start)+'–'+siteFmt(e.best.end):'None'}</strong></div><div><span>Filter</span><strong>${rig().filter}</strong></div></div><button class="primary wide" id="selectTarget">Use as selected target</button>`;$('targetDialog').showModal();setTimeout(()=>{$('selectTarget').onclick=()=>{$('targetDialog').close();renderAll();toast('Target selected')};if(targetChart)targetChart.destroy();targetChart=new Chart($('targetChart'),{type:'line',data:{labels:e.rows.map(x=>siteFmt(x.time)),datasets:[{label:'Target altitude',data:e.rows.map(x=>Math.max(0,x.alt)),borderColor:'#38bdf8',pointRadius:0},{label:'Custom horizon',data:e.rows.map(x=>x.minAlt),borderColor:'#fb7185',borderDash:[3,3],pointRadius:0},{label:'Moon altitude',data:e.rows.map(x=>Math.max(0,x.moonAlt)),borderColor:'#e2e8f0',borderDash:[5,5],pointRadius:0}]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{ticks:{color:'#8ca0b9'}},y:{min:0,max:90,ticks:{color:'#8ca0b9'}}},plugins:{legend:{labels:{color:'#8ca0b9'}}}}})},30)}

function buildPlan(){if(!nights.length)return;const s=nights[0],favorites=s.evals.filter(e=>state.bookmarks.includes(e.target.name)&&e.score>0);const pool=(favorites.length?favorites:s.evals.slice(0,8));const slots=s.hours.map(h=>{const options=pool.map(e=>e.rows.find(x=>x.time.getTime()===h.time.getTime())).map((x,i)=>({row:x,e:pool[i]})).filter(x=>x.row?.score>=60).sort((a,b)=>b.row.score-a.row.score);return options[0]?{time:h.time,e:options[0].e,row:options[0].row}:null});const groups=[];for(const slot of slots){const last=groups.at(-1);if(slot&&last&&last.target===slot.e.target.name&&slot.time-last.last<=1.1*3600000){last.last=slot.time;last.rows.push(slot.row)}else if(slot)groups.push({target:slot.e.target.name,filter:recommendFilter(slot.e.target),start:slot.time,last:slot.time,rows:[slot.row],transit:slot.e.transit})}state.currentPlan=groups.filter(g=>g.rows.length>=Math.ceil(state.limits.window)).map(g=>({...g,end:new Date(g.last.getTime()+3600000),score:Math.round(g.rows.reduce((s,x)=>s+x.score,0)/g.rows.length)}));renderPlan()}
function recommendFilter(o){if(o.signal==='broadband')return'Broadband';if(rig().filter==='siioiii')return'Askar E2 (SII+OIII)';if(rig().filter==='haoiii')return'L-Ultimate (Ha+OIII)';return o.signal==='oiii'?'OIII':'Narrowband'}
function renderPlan(){const plan=state.currentPlan||[];$('planTitle').textContent=`${place().name} · ${state.selectedDate}`;$('planList').innerHTML=plan.length?plan.map(g=>`<article class="plan-item"><time>${siteFmt(g.start)}–${siteFmt(g.end)}</time><div><strong>${g.target}</strong><p class="muted">${g.filter} · score ${g.score} · ${round((g.end-g.start)/3600000,1)} hours${g.transit>=g.start&&g.transit<=g.end?' · meridian crossing '+siteFmt(g.transit):''}</p></div></article>`).join(''):'<article class="card muted">No reliable automated sequence for the selected night. Try a different site, date or limit.</article>';const saved=state.plans[state.selectedDate];$('planNotes').value=saved?.notes||''}
function savePlan(){state.plans[state.selectedDate]={items:state.currentPlan||[],notes:$('planNotes').value,savedAt:new Date().toISOString()};save();toast('Plan saved on this device')}
function exportPlan(){const rows=[['Start','End','Target','Filter','Score'],...(state.currentPlan||[]).map(g=>[siteFmt(g.start),siteFmt(g.end),g.target,g.filter,g.score])];const blob=new Blob([rows.map(r=>r.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(',')).join('\n')],{type:'text/csv'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`astrowindow-${state.selectedDate}.csv`;a.click();URL.revokeObjectURL(a.href)}

function fillPlaces(){$('placeList').innerHTML=state.places.map(p=>`<div class="place-row ${p.id===state.activePlace?'active':''}"><button class="ghost" data-place="${p.id}"><strong>${p.name}</strong><br><small>${p.lat.toFixed(4)}, ${p.lon.toFixed(4)} · B${p.bortle||'?'}${p.sqm?' · '+p.sqm+' SQM':''}</small></button>${state.places.length>1?`<button class="ghost" data-remove-place="${p.id}">Delete</button>`:''}</div>`).join('');document.querySelectorAll('[data-place]').forEach(b=>b.onclick=()=>{state.activePlace=+b.dataset.place;save();refresh();switchView('dashboard')});document.querySelectorAll('[data-remove-place]').forEach(b=>b.onclick=()=>{state.places=state.places.filter(p=>p.id!==+b.dataset.removePlace);if(state.activePlace===+b.dataset.removePlace)state.activePlace=state.places[0].id;save();fillPlaces()})}
function addPlace(e){e.preventDefault();const p={id:Date.now(),name:$('placeName').value,lat:+$('placeLat').value,lon:+$('placeLon').value,bortle:+$('placeBortle').value||null,sqm:+$('placeSqm').value||null,horizon:{n:20,e:20,s:20,w:20}};state.places.push(p);state.activePlace=p.id;save();e.target.reset();fillPlaces();refresh()}
function useGPS(){navigator.geolocation?.getCurrentPosition(pos=>{const p={id:Date.now(),name:'GPS observing site',lat:pos.coords.latitude,lon:pos.coords.longitude,bortle:null,sqm:null,horizon:{n:20,e:20,s:20,w:20}};state.places.push(p);state.activePlace=p.id;save();fillPlaces();refresh();toast('GPS site added')},()=>toast('Location permission was not available'),{enableHighAccuracy:true,timeout:10000})}

function fillRig(){$('rigSelect').innerHTML=state.rigs.map(r=>`<option value="${r.id}" ${r.id===state.activeRig?'selected':''}>${r.name}</option>`).join('');const r=rig();$('rigName').value=r.name;$('focalLength').value=r.focal;$('aperture').value=r.aperture;$('sensorWidth').value=r.sensorW;$('sensorHeight').value=r.sensorH;$('pixelSize').value=r.pixel;$('filter').value=r.filter;$('mount').value=r.mount;$('windLimit').value=r.wind;$('minAlt').value=r.minAlt;const h=place().horizon||{n:r.minAlt,e:r.minAlt,s:r.minAlt,w:r.minAlt};['N','E','S','W'].forEach(x=>$('hz'+x).value=h[x.toLowerCase()]);const o=optics();$('opticsSummary').innerHTML=`<div><span>Focal ratio</span><strong>f/${round(o.fRatio,1)}</strong></div><div><span>Image scale</span><strong>${round(o.scale,2)}″/px</strong></div><div><span>Field of view</span><strong>${round(o.fovW,2)}° × ${round(o.fovH,2)}°</strong></div><div><span>Sampling</span><strong>${o.scale>2?'Wide / undersampled':o.scale<.6?'Fine / seeing-sensitive':'Balanced'}</strong></div>`}
function saveRig(e){e.preventDefault();Object.assign(rig(),{name:$('rigName').value,focal:+$('focalLength').value,aperture:+$('aperture').value,sensorW:+$('sensorWidth').value,sensorH:+$('sensorHeight').value,pixel:+$('pixelSize').value,filter:$('filter').value,mount:$('mount').value,wind:+$('windLimit').value,minAlt:+$('minAlt').value});save();fillRig();renderAll();toast('Rig profile saved')}
function newRig(){const r={...structuredClone(rig()),id:Date.now(),name:'New rig profile'};state.rigs.push(r);state.activeRig=r.id;save();fillRig()}
function saveHorizon(){place().horizon={n:+$('hzN').value,e:+$('hzE').value,s:+$('hzS').value,w:+$('hzW').value};save();renderAll();toast('Horizon saved for this site')}

