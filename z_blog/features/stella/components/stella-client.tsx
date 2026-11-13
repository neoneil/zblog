"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Download, Maximize2, Minus, Pause, Play, Plus, Rewind, RotateCcw, Search, Send, Settings2, X } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { calculateNatalChart, type BirthForm, type OpenAIChartJson } from "@/lib/astrology/natal-chart";
import { formatDegrees } from "@/lib/astrology/format-degrees";
import { getSkySnapshot, PLANET_SYMBOLS, SIGN_SYMBOLS } from "../lib/sky";
import StellaScene, { type SceneHandle, type SceneOptions } from "./stella-scene";
import styles from "./stella.module.css";
import { ZodiacConstellation } from "./zodiac-constellation";
import { enrichStellaChart, planetRays } from "../lib/app-analysis";
import { AnalysisProvider, BirthInsights, LifeMomentAndReflection, ReadingsPanel, SkyPanel, pointSymbols } from "./stella-analysis";
import StellaAsk from "./stella-ask";
import { STELLA_CONSULTATION_HREF } from "../lib/consultation";

type BirthFields = { name: string; date: string; time: string; place: string; latitude: string; longitude: string };
type Place = { display_name: string; lat: string; lon: string };
const defaults: BirthFields = { name: "", date: "1996-07-14", time: "15:30", place: "New York, NY", latitude: "40.7128", longitude: "-74.0060" };
const storageKey = "stella-birth-v1";
const initialOptions: SceneOptions = { stars: true, starNames: true, constellationLines: true, constellationNames: true, ecliptic: true, equator: true, natal: true, aspects: true, planets: true, glow: true, autoRotate: false, view: "orbital" };
const speeds = [1,60,3600,86400,604800];
const signCopy = {
  en: [
    "Let initiative become intention. Choose one direction worth your energy, then leave enough room to listen.",
    "Give your attention to what has lasting value. A steady rhythm can make room for change without losing your footing.",
    "Notice the conversation that opens a new perspective. Curiosity is useful when you give yourself time to follow it.",
    "Make space for what you feel without asking every feeling to become a decision. Care begins with honest attention.",
    "Bring warmth to something you want to create. Being visible can mean sharing generously, not performing perfectly.",
    "A small practical adjustment can restore your sense of possibility. Choose care over the pressure to get everything right.",
    "Look for a balance that includes your own needs. A clear, kind conversation can change the shape of a relationship.",
    "Stay curious about what is changing underneath the surface. Depth does not require certainty or control.",
    "Give a larger question some breathing room. A fresh experience can help you distinguish conviction from habit.",
    "Choose the structure that supports your life, not only your ambitions. Progress can be both deliberate and humane.",
    "An unfamiliar perspective may reveal a useful connection. Let your independence make room for collaboration.",
    "Protect a little quiet space for imagination. Intuition becomes more useful when it meets a grounded next step.",
  ],
  zh: [
    "让行动带着清晰的意图。选择值得投入的方向，也给倾听留一点空间。","把注意力放在真正有价值的事物上。稳定的节奏，也能为改变留下空间。","留意带来新视角的对话。好奇心值得被认真对待，也需要时间去深入。","允许情绪被看见，不必立即变成决定。关怀从诚实的觉察开始。","把温暖带入你想创造的事物。被看见，不代表必须表现完美。","一个小小的实际调整，就可能让生活重新变得轻盈。选择照顾，而不是苛求。","寻找也能照顾自己需要的平衡。清晰而温柔的对话，能改变关系的走向。","保持对内在变化的好奇。深入理解，不一定需要掌控一切。","给更大的问题一点空间。新体验能帮助你区分信念与习惯。","选择真正支持生活的结构，而不只是追赶目标。进步也可以温和而坚定。","不同的视角可能带来新的连接。让独立与合作同时存在。","为想象力保留一点安静。直觉与踏实的行动相遇，才更有力量。",
  ],
};
function parseBirth(fields: BirthFields, houseSystem: BirthForm["houseSystem"]): BirthForm {
  const [year,month,day] = fields.date.split("-").map(Number), [hour,minute] = fields.time.split(":").map(Number);
  const latitude = Number(fields.latitude), longitude = Number(fields.longitude);
  const actual = new Date(Date.UTC(year,month-1,day));
  if (!fields.date || !fields.time || !fields.latitude.trim() || !fields.longitude.trim() ||
    ![year,month,day,hour,minute,latitude,longitude].every(Number.isFinite) ||
    year<1900 || year>2100 || actual.getUTCFullYear()!==year || actual.getUTCMonth()!==month-1 || actual.getUTCDate()!==day ||
    hour<0 || hour>23 || minute<0 || minute>59 || latitude<=-89 || latitude>=89 || longitude<-180 || longitude>180) {
    throw new Error("请检查出生时间与经纬度 / Check the birth date, time and coordinates.");
  }
  return { name:fields.name.trim().slice(0,80),year,month,day,hour,minute,latitude,longitude,houseSystem,zodiac:"tropical" };
}
function IconButton({ label, children, onClick, pressed }: { label: string; children: React.ReactNode; onClick: () => void; pressed?: boolean }) {
  return <button type="button" title={label} aria-label={label} onClick={onClick} aria-pressed={pressed}>{children}</button>;
}

export default function StellaClient() {
  const { language, t, toggleLanguage } = usePreferences();
  const root = useRef<HTMLElement>(null), scene = useRef<SceneHandle>(null);
  const [epoch,setEpoch] = useState(()=>Date.now());
  const [paused,setPaused] = useState(false), [speedIndex,setSpeedIndex] = useState(0), [reverse,setReverse] = useState(false);
  const [fields,setFields] = useState<BirthFields>(defaults);
  const [submitted,setSubmitted] = useState<BirthFields|null>(null);
  const [chart,setChart] = useState<OpenAIChartJson|null>(null);
  const [birthUtc,setBirthUtc] = useState(""), [birthTimezone,setBirthTimezone] = useState("UTC");
  const [hasBirth,setHasBirth] = useState(false);
  const [houseSystem,setHouseSystem] = useState<BirthForm["houseSystem"]>("placidus");
  const [chartBusy,setChartBusy] = useState(false), [chartError,setChartError] = useState("");
  const [tab,setTab] = useState<"readings"|"ask"|"sky">("readings");
  const [period,setPeriod] = useState<"today"|"week"|"month">("today");
  const [sign,setSign] = useState(0), [birthOpen,setBirthOpen] = useState(()=>window.innerWidth>700);
  const [mobileOpen,setMobileOpen] = useState(false), [settingsOpen,setSettingsOpen] = useState(false);
  const [options,setOptions] = useState(initialOptions), [status,setStatus] = useState<"loading"|"ready"|"error">("loading");
  const [places,setPlaces] = useState<Place[]>([]), [lookupBusy,setLookupBusy] = useState(false), [geoError,setGeoError] = useState("");
  const settingsRef=useRef<HTMLDivElement>(null),settingsButton=useRef<HTMLButtonElement>(null);
  const calculating=useRef(false),alive=useRef(true),birthVersion=useRef(0);
  const tick = Math.floor(epoch/1000);
  const sky = useMemo(()=>getSkySnapshot(new Date(tick*1000)),[tick]);
  const date = useMemo(()=>new Date(epoch),[epoch]);
  const actualSpeed=speeds[speedIndex]*(reverse?-1:1);

  useEffect(()=>{
    alive.current=true;
    const header=document.querySelector("body header");
    const measure=()=>{if(root.current&&header)root.current.style.setProperty("--stella-navbar-height",header.getBoundingClientRect().height+"px");};
    const resize=new ResizeObserver(measure);if(header)resize.observe(header);measure();
    let cancelled=false;
    async function restore(){
      let initial=defaults,restored=false;
      try{const stored=JSON.parse(localStorage.getItem(storageKey)||"null");if(stored&&typeof stored.date==="string"&&typeof stored.time==="string"&&typeof stored.latitude==="string"&&typeof stored.longitude==="string"){parseBirth(stored,"placidus");initial=stored;restored=true;setFields(stored);}}catch{}
      try{const json=await calculateNatalChart(parseBirth(initial,"placidus"));const enriched=await enrichStellaChart(json);if(!cancelled&&birthVersion.current===0){setChart(enriched.chart);setBirthUtc(enriched.utc);setBirthTimezone(enriched.timezone);setSubmitted(initial);setHasBirth(restored);const sun=json.planets.find(p=>p.key==="sun");if(restored&&sun)setSign(Math.floor(sun.absoluteDegrees/30));}}catch{if(!cancelled&&birthVersion.current===0)setChartError("Unable to calculate the initial chart.");}
    }
    void restore();
    return()=>{cancelled=true;alive.current=false;resize.disconnect();};
  },[]);
  useEffect(()=>{
    if(paused)return;
    let previous=performance.now();
    const timer=window.setInterval(()=>{const now=performance.now();const delta=Math.min(now-previous,1000)*actualSpeed;previous=now;setEpoch(value=>Math.min(new Date("2100-12-31T23:59:59Z").getTime(),Math.max(new Date("1900-01-01T00:00:00Z").getTime(),value+delta)));},250);
    return()=>clearInterval(timer);
  },[paused,actualSpeed]);
  useEffect(()=>{
    function handleKey(event:KeyboardEvent){
      const el=event.target as HTMLElement;
      if((!root.current?.contains(el)&&el!==document.body)||el.closest("input,textarea,select,button,a,[contenteditable=true]")||event.ctrlKey||event.metaKey||event.altKey)return;
      if(event.code==="Space"){event.preventDefault();setPaused(value=>!value);}
      else if(event.key==="+"||event.key==="=")setSpeedIndex(value=>Math.min(speeds.length-1,value+1));
      else if(event.key==="-")setSpeedIndex(value=>Math.max(0,value-1));
      else if(event.key.toLowerCase()==="r")setReverse(value=>!value);
      else if(event.key.toLowerCase()==="n"){setEpoch(Date.now());setPaused(false);setReverse(false);setSpeedIndex(0);}
      else if(event.key==="1")setSpeedIndex(0);
      else if(event.key==="Escape"){setSettingsOpen(false);setMobileOpen(false);}
    }
    window.addEventListener("keydown",handleKey);return()=>window.removeEventListener("keydown",handleKey);
  },[]);
  useEffect(()=>{
    if(!settingsOpen)return;
    const close=(event:PointerEvent)=>{if(!settingsRef.current?.contains(event.target as Node)&&!settingsButton.current?.contains(event.target as Node))setSettingsOpen(false);};
    window.addEventListener("pointerdown",close);return()=>window.removeEventListener("pointerdown",close);
  },[settingsOpen]);

  async function calculate(event:FormEvent){
    event.preventDefault();if(calculating.current)return;
    setChartError("");
    try{
      const form=parseBirth(fields,houseSystem);birthVersion.current++;calculating.current=true;setChartBusy(true);
      const json=await calculateNatalChart(form);
      const enriched=await enrichStellaChart(json);
      if(!alive.current)return;
      setChart(enriched.chart);setBirthUtc(enriched.utc);setBirthTimezone(enriched.timezone);setHasBirth(true);setSubmitted({...fields});
      const sun=json.planets.find(p=>p.key==="sun");if(sun)setSign(Math.floor(sun.absoluteDegrees/30));
      setOptions(value=>({...value,natal:true,view:"orbital"}));scene.current?.reset();
    }catch(error){setChartError(error instanceof Error?error.message:"Unable to calculate chart.");}
    finally{calculating.current=false;if(alive.current)setChartBusy(false);}
  }
  async function lookup(){
    if(lookupBusy||!fields.place.trim())return;
    setLookupBusy(true);setPlaces([]);setGeoError("");
    try{
      const response=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(fields.place.trim())}&limit=5`);
      if(!response.ok)throw new Error();
      const data:unknown=await response.json();
      const valid=Array.isArray(data)?data.filter((p):p is Place=>!!p&&typeof p==="object"&&typeof p.display_name==="string"&&Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lon))):[];
      setPlaces(valid);if(!valid.length)setGeoError(t({zh:"未找到城市，请手动输入坐标。",en:"No city found. Enter coordinates manually."}));
    }catch{setGeoError(t({zh:"城市查询暂不可用，请手动输入坐标。",en:"City lookup is unavailable. Enter coordinates manually."}));}
    finally{setLookupBusy(false);}
  }
  function selectPlanet(key:string){setTab("sky");setMobileOpen(true);scene.current?.focusPlanet(key);}
  function selectTab(next:typeof tab){if(next===tab&&window.innerWidth<=700)setMobileOpen(value=>!value);else{setTab(next);setMobileOpen(true);}if(window.innerWidth<=700)setBirthOpen(false);}
  const anglePoints=chart?[...chart.planets.filter(p=>p.key==="sun"||p.key==="moon"),...chart.angles]:[];
  const birth=chart?{...chart.meta.birth,name:chart.meta.name,houseSystem:chart.meta.houseSystem,zodiac:chart.meta.zodiac} as BirthForm:null;

  return <AnalysisProvider chart={hasBirth?chart:null} birth={hasBirth?birth:null} utc={birthUtc} timezone={birthTimezone} sky={sky} date={date} period={period}><main ref={root} className={styles.experience} data-testid="stella-experience">
    <StellaScene ref={scene} sky={sky} date={date} chart={chart} options={options} language={language} onStatus={setStatus} onPlanet={selectPlanet} />
    <h1 className={styles.brand}>STELLARNESTS</h1>
    {status!=="ready"&&<div className={styles.sceneNotice} data-error={status==="error"} role="status">{status==="error"?<div><p>{t({zh:"3D 场景暂不可用，请确认浏览器已开启硬件加速。",en:"The 3D scene is unavailable. Check browser hardware acceleration."})}</p><button className={styles.secondary} type="button" onClick={()=>window.location.reload()}>{t({zh:"重试",en:"Retry"})}</button></div>:t({zh:"星空正在展开…",en:"Opening the sky…"})}</div>}
    <aside className={styles.panel+" "+styles.readingsPanel} data-mobile-open={mobileOpen}>
      <div className={styles.tabs} role="tablist" aria-label={t({zh:"Stella 面板",en:"Stella panels"})}>
        {([{key:"readings",zh:"解读",en:"Readings"},{key:"ask",zh:"提问",en:"Ask"},{key:"sky",zh:"星空",en:"Sky"}] as const).map(item=><button key={item.key} type="button" role="tab" id={"stella-tab-"+item.key} aria-selected={tab===item.key} aria-controls="stella-panel-content" className={styles.tab} onClick={()=>selectTab(item.key)}>{item[language]}</button>)}
      </div>
      <div className={styles.readingsBody} role="tabpanel" id="stella-panel-content" aria-labelledby={"stella-tab-"+tab}>
        {tab==="readings"&&<>
          <div className={styles.periods}>{(["today","week","month"] as const).map(key=><button type="button" key={key} aria-pressed={period===key} onClick={()=>setPeriod(key)}>{t({zh:{today:"今日",week:"一周",month:"一月"}[key],en:{today:"Today",week:"Week",month:"Month"}[key]})}</button>)}</div>
          <ReadingsPanel sign={sign} setSign={setSign} hasBirth={hasBirth} signText={signCopy[language][sign]} enterBirth={()=>{setBirthOpen(true);if(window.innerWidth<=700)setMobileOpen(false);}}/>
        </>}
        {tab==="ask"&&<StellaAsk hasBirth={hasBirth} enterBirth={()=>{setBirthOpen(true);if(window.innerWidth<=700)setMobileOpen(false);}}/>}
        {tab==="ask"&&<LifeMomentAndReflection/>}
        {tab==="sky"&&<SkyPanel selectPlanet={selectPlanet}/>}
      </div>
    </aside>
    <aside className={styles.panel+" "+styles.birthPanel} data-open={birthOpen}>
      <button className={styles.panelHeading} type="button" onClick={()=>{setBirthOpen(value=>!value);if(window.innerWidth<=700)setMobileOpen(false);}} aria-expanded={birthOpen} aria-controls="stella-birth-content"><span>{t({zh:"出生星盘",en:"Birth Chart"})}</span>{birthOpen?<ChevronDown size={14}/>:<ChevronUp size={14}/>}</button>
      {birthOpen&&<div className={styles.birthBody} id="stella-birth-content">
        <form onSubmit={calculate}>
          <div className={styles.field}><label htmlFor="stella-name">{t({zh:"姓名",en:"Name"})}</label><input id="stella-name" className={styles.input} value={fields.name} maxLength={80} placeholder={t({zh:"例如：自己、家人、朋友",en:"e.g. John, Mom, Friend"})} onChange={e=>setFields({...fields,name:e.target.value})}/></div>
          <div className={styles.twoColumns}><div className={styles.field}><label htmlFor="stella-date">{t({zh:"出生日期",en:"Birth Date"})}</label><input id="stella-date" className={styles.input} type="date" required min="1900-01-01" max="2100-12-31" value={fields.date} onChange={e=>setFields({...fields,date:e.target.value})}/></div><div className={styles.field}><label htmlFor="stella-time">{t({zh:"当地出生时间",en:"Birth Time"})}</label><input id="stella-time" className={styles.input} type="time" required value={fields.time} onChange={e=>setFields({...fields,time:e.target.value})}/></div></div>
          <div className={styles.field}><label htmlFor="stella-location">{t({zh:"出生地点",en:"Location"})}</label><div className={styles.cityRow}><input id="stella-location" className={styles.input} value={fields.place} onChange={e=>{setFields({...fields,place:e.target.value});setPlaces([]);}} placeholder="City, Country"/><button type="button" className={styles.secondary} onClick={lookup} disabled={lookupBusy||!fields.place.trim()} title={t({zh:"查询城市",en:"Find city"})} aria-label={t({zh:"查询城市",en:"Find city"})}><Search size={14}/></button></div>{places.length>0&&<ul className={styles.cityResults}>{places.map((place,index)=><li key={index}><button type="button" onClick={()=>{setFields({...fields,place:place.display_name,latitude:place.lat,longitude:place.lon});setPlaces([]);}}>{place.display_name}</button></li>)}</ul>}{geoError&&<p role="alert" className={styles.error}>{geoError}</p>}</div>
          <div className={styles.twoColumns}><div className={styles.field}><label htmlFor="stella-latitude">{t({zh:"纬度",en:"Latitude"})}</label><input id="stella-latitude" className={styles.input} type="number" step="any" required min="-88.99" max="88.99" value={fields.latitude} onChange={e=>setFields({...fields,latitude:e.target.value})}/></div><div className={styles.field}><label htmlFor="stella-longitude">{t({zh:"经度",en:"Longitude"})}</label><input id="stella-longitude" className={styles.input} type="number" step="any" required min="-180" max="180" value={fields.longitude} onChange={e=>setFields({...fields,longitude:e.target.value})}/></div></div>
          <button type="submit" className={styles.primary+" "+styles.calculate} disabled={chartBusy}>{chartBusy?t({zh:"计算中…",en:"Calculating…"}):t({zh:"计算星盘",en:"Calculate Chart"})}</button>
          {chartError&&<p role="alert" className={styles.error}>{chartError}</p>}
        </form>
        {chart&&hasBirth&&<section className={styles.chartResult}>
          <div className={styles.chartTitle}><h2>{submitted?.name||t({zh:"我的星盘",en:"My Chart"})}</h2><button className={styles.textButton} type="button" onClick={()=>scene.current?.download()} title={t({zh:"下载星盘图片",en:"Download chart image"})} aria-label={t({zh:"下载星盘图片",en:"Download chart image"})}><Download size={16}/></button></div>
          <p className={styles.status}>{submitted?.date} · {submitted?.time}<br/>{submitted?.place}</p>
          <div className={styles.bigThree}>{anglePoints.map(p=><div key={p.key} data-element={Math.floor(p.absoluteDegrees/30)%4}>
            <span>{PLANET_SYMBOLS[p.key]} {language==="zh"?p.labelZh:p.label}</span>
            <strong>{language==="zh"?p.signZh:p.sign}</strong>{" "}<ZodiacConstellation sign={p.sign} size="tiny"/>
            <span title={`${p.absoluteDegrees.toFixed(6)}°`}>{formatDegrees(p.signDegrees)}</span>
          </div>)}</div>
          <div className={styles.smallActions}><Link className={styles.secondary} href={STELLA_CONSULTATION_HREF}><Send size={13}/>{t({zh:"询问星盘",en:"Ask My Chart"})}</Link></div>
          <BirthInsights/>
          <Link className={styles.chartQuestion} href={STELLA_CONSULTATION_HREF}><strong>{t({en:"Ask Your Chart",zh:"问问你的星盘"})}</strong><span>{t({en:"Explore the questions that matter to you →",zh:"探索对你真正重要的问题 →"})}</span></Link>
          <section className={styles.section}>
            <h3>{t({zh:"行星位置",en:"PLANETARY POSITIONS"})}</h3>
            <ul className={styles.positionList}>{chart.planets.map(p=><li key={p.key}>
              <span>{pointSymbols[p.key]}</span><button type="button" onClick={()=>scene.current?.focusPlanet(p.key)}>{language==="zh"?p.labelZh:p.label} {planetRays[p.key]&&<small className={styles.rayTag} data-ray={planetRays[p.key]}>R{planetRays[p.key]}</small>}</button>
              <span title={`${p.absoluteDegrees.toFixed(6)}°`}>{SIGN_SYMBOLS[Math.floor(p.absoluteDegrees/30)]} {formatDegrees(p.signDegrees)} · H{p.house} {p.retrograde?"℞":""} <ZodiacConstellation sign={Math.floor(p.absoluteDegrees/30)} size="tiny"/></span>
            </li>)}</ul>
          </section>
          <details className={styles.section}>
            <summary className={styles.cuspHeading}>{t({zh:"十二宫宫头",en:"House Cusps"})} · {chart.meta.houseSystem}</summary>
            <ul className={styles.positionList}>{chart.houses.map(h=><li key={h.house}>
              <span>{h.house}</span><span>{language==="zh"?h.signZh:h.sign}</span>
              <span title={`${h.cuspDegrees.toFixed(6)}°`}>{formatDegrees(h.signDegrees)}</span>
            </li>)}</ul>
          </details>
        </section>}
      </div>}
    </aside>
    <button ref={settingsButton} type="button" className={styles.settingsTrigger} aria-label={t({zh:"显示设置",en:"Display settings"})} title={t({zh:"显示设置",en:"Display settings"})} aria-expanded={settingsOpen} aria-controls="stella-settings" onClick={()=>setSettingsOpen(value=>!value)}>{settingsOpen?<X size={19}/>:<Settings2 size={19}/>}</button>
    {settingsOpen&&<div ref={settingsRef} className={styles.settings} id="stella-settings"><h2>{t({zh:"视角",en:"VIEW MODE"})}</h2><div className={styles.viewModes}><button type="button" className={styles.secondary} aria-pressed={options.view==="orbital"} onClick={()=>setOptions({...options,view:"orbital"})}>{t({zh:"轨道",en:"Orbital"})}</button><button type="button" className={styles.secondary} aria-pressed={options.view==="ground"} onClick={()=>setOptions({...options,view:"ground"})}>{t({zh:"天球",en:"Sky"})}</button></div>{([
      ["stars","背景恒星","Stars"],["starNames","恒星名称","Star Labels"],["constellationLines","星座连线","Constellation Lines"],["constellationNames","星座名称","Constellation Names"],["ecliptic","黄道线","Ecliptic Line"],["equator","天球赤道","Celestial Equator"],["natal","本命盘","Natal Wheel"],["aspects","相位连线","Aspect Lines"],["planets","行星","Planets"],["glow","光晕","Glow"],["autoRotate","自动旋转","Auto Rotate"],
    ] as const).map(([key,zh,en])=><label key={key}>{t({zh,en})}<input type="checkbox" checked={options[key]} onChange={e=>setOptions({...options,[key]:e.target.checked})}/></label>)}<div className={styles.field} style={{marginTop:12}}><label htmlFor="stella-house-system">{t({zh:"宫位系统",en:"House System"})}</label><select id="stella-house-system" className={styles.input} value={houseSystem} onChange={e=>setHouseSystem(e.target.value as BirthForm["houseSystem"])}>{["placidus","whole-sign","equal-house","koch","campanus","regiomontanus","topocentric"].map(system=><option key={system} value={system}>{system}</option>)}</select></div><div className={styles.smallActions}><button type="button" className={styles.secondary} onClick={toggleLanguage}>{language==="zh"?"English":"简体中文"}</button><button type="button" className={styles.secondary} onClick={()=>scene.current?.reset()} title={t({zh:"重置视角",en:"Reset view"})}><Maximize2 size={14}/></button></div><p className={styles.status}>HYG · <a href="https://github.com/astronexus/HYG-Database" target="_blank" rel="noopener noreferrer">David Nash / Astronomy Nexus</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a><br/>Constellations · <a href="https://github.com/ofrohn/d3-celestial" target="_blank" rel="noopener noreferrer">Olaf Frohn / d3-celestial</a> · BSD-3-Clause</p></div>}
    <div className={styles.timeDock}><div className={styles.timestamp}>{date.toLocaleDateString("sv-SE")} &nbsp;{date.toLocaleTimeString("en-GB",{hour12:false})} &nbsp; {actualSpeed.toLocaleString()}×</div><div className={styles.timeButtons}>
      <IconButton label={t({zh:"时间倒流",en:"Reverse time"})} onClick={()=>setReverse(value=>!value)} pressed={reverse}><Rewind size={14}/></IconButton>
      <IconButton label={t({zh:"减速",en:"Slow down"})} onClick={()=>setSpeedIndex(value=>Math.max(0,value-1))}><Minus size={14}/></IconButton>
      <IconButton label={paused?t({zh:"继续",en:"Play"}):t({zh:"暂停",en:"Pause"})} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={14}/>:<Pause size={14}/>}</IconButton>
      <IconButton label={t({zh:"加速",en:"Speed up"})} onClick={()=>setSpeedIndex(value=>Math.min(speeds.length-1,value+1))}><Plus size={14}/></IconButton>
      <button type="button" title={t({zh:"恢复正常速度",en:"Reset speed"})} onClick={()=>{setSpeedIndex(0);setReverse(false);}}>1×</button>
      <IconButton label={t({zh:"回到现在",en:"Now"})} onClick={()=>{setEpoch(Date.now());setPaused(false);setSpeedIndex(0);setReverse(false);}}><RotateCcw size={14}/></IconButton>
      <input type="date" aria-label={t({zh:"跳转日期",en:"Jump to date"})} min="1900-01-01" max="2100-12-31" value={date.toLocaleDateString("sv-SE")} onChange={e=>{if(!e.target.value)return;const next=new Date(e.target.value+"T12:00:00");if(Number.isFinite(next.getTime())){setEpoch(next.getTime());setPaused(true);}}}/>
    </div></div>
  </main></AnalysisProvider>;
}
