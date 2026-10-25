"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import type { OpenAIChartJson } from "@/lib/astrology/natal-chart";
import { getStarDirection, PLANET_COLORS, PLANET_SYMBOLS, SIGN_SYMBOLS, type SkySnapshot } from "../lib/sky";
import { BRIGHT_STARS, CONSTELLATIONS } from "../data/stars";
import styles from "./stella.module.css";

export type SceneOptions = {
  stars: boolean; starNames: boolean; constellationLines: boolean; constellationNames: boolean;
  ecliptic: boolean; equator: boolean; natal: boolean; aspects: boolean; planets: boolean;
  glow: boolean; autoRotate: boolean; view: "orbital" | "ground";
};
export type SceneHandle = { reset: () => void; focusPlanet: (key: string) => void; download: () => void };
type Props = { sky: SkySnapshot; date: Date; chart: OpenAIChartJson | null; options: SceneOptions; language: "zh" | "en"; onStatus: (status: "ready" | "error") => void; onPlanet: (key: string) => void };
type SceneAPI = {
  sky: (sky: SkySnapshot) => void; chart: (chart: OpenAIChartJson | null) => void;
  options: (options: SceneOptions) => void; stars: (date: Date) => void;
  reset: () => void; focus: (key: string) => void; download: () => void;
};
const TAU = Math.PI * 2;
const zodiacColors = ["#ff6947", "#7cc563", "#e5d559", "#8a79cd", "#ff953e", "#79b976", "#68b3ed", "#a775ce", "#f48c42", "#86c55e", "#59c5e8", "#a788d0"];
const aspectColors: Record<string, string> = { conjunction: "#f6c548", opposition: "#f47c66", square: "#ee7264", trine: "#63bcbc", sextile: "#c5aa66" };
function spherical(longitude: number, radius: number, latitude = 0) {
  const lon = THREE.MathUtils.degToRad(longitude), lat = THREE.MathUtils.degToRad(latitude);
  return new THREE.Vector3(radius * Math.cos(lat) * Math.cos(lon), radius * Math.sin(lat), -radius * Math.cos(lat) * Math.sin(lon));
}
function line(points: THREE.Vector3[], color: string, opacity: number) {
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
}
function disposeObject(object: THREE.Object3D) {
  object.traverse(child => {
    const mesh = child as THREE.Mesh;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    materials.forEach(material => material.dispose());
  });
}

const StellaScene = forwardRef<SceneHandle, Props>(function StellaScene(props, ref) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<SceneAPI | null>(null);
  const latest = useRef(props);
  useEffect(() => { latest.current = props; });
  useImperativeHandle(ref, () => ({
    reset: () => api.current?.reset(),
    focusPlanet: key => api.current?.focus(key),
    download: () => api.current?.download(),
  }), []);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    } catch {
      latest.current.onStatus("error");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-label", "Stella interactive 3D celestial sky");
    renderer.domElement.tabIndex = 0;
    const labels = document.createElement("div"); labels.className = styles.labels; element.appendChild(labels);
    const scene = new THREE.Scene(); scene.background = new THREE.Color("#010104");
    const camera = new THREE.PerspectiveCamera(48, 1, .1, 2200);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = .07; controls.minDistance = 45; controls.maxDistance = 420;
    controls.autoRotateSpeed = .35;
    controls.target.set(0, 0, 0);
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), .48, .55, .8);
    const outputPass = new OutputPass();
    composer.addPass(renderPass); composer.addPass(bloomPass); composer.addPass(outputPass);
    const textures = new Map<string, THREE.Texture>();
    function glowTexture() {
      const canvas = document.createElement("canvas"); canvas.width = canvas.height = 128;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createRadialGradient(64,64,0,64,64,64);
      gradient.addColorStop(0, "rgba(255,255,255,1)"); gradient.addColorStop(.08, "rgba(255,255,255,.85)");
      gradient.addColorStop(.3, "rgba(255,255,255,.12)"); gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient; ctx.fillRect(0,0,128,128);
      const texture = new THREE.CanvasTexture(canvas); textures.set("glow", texture); return texture;
    }
    const glowMap = glowTexture();
    function textSprite(text: string, color: string, scale: number, fontSize = 72) {
      const key = text + color + fontSize;
      let texture = textures.get(key);
      if (!texture) {
        const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 128;
        const ctx = canvas.getContext("2d")!;
        ctx.font = `bold ${fontSize}px Arial, "Segoe UI Symbol", sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = color; ctx.fillText(text, 256, 68);
        texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; textures.set(key, texture);
      }
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
      sprite.scale.set(scale * 4, scale, 1); return sprite;
    }
    const starLabels: { el: HTMLSpanElement; position: THREE.Vector3; type: "star" | "constellation" }[] = [];
    function addLabel(text: string, position: THREE.Vector3, type: "star" | "constellation") {
      const el = document.createElement("span"); el.className = styles.skyLabel; el.textContent = text;
      if (type === "constellation") el.style.opacity = ".5";
      labels.appendChild(el); starLabels.push({ el, position, type });
    }
    const starPositions: number[] = [], starColors: number[] = [], starSizes: number[] = [];
    const backgroundCount = starSizes.length;
    BRIGHT_STARS.forEach(star => {
      const position = new THREE.Vector3(...getStarDirection(star.ra, star.dec, latest.current.date)).multiplyScalar(800);
      starPositions.push(position.x,position.y,position.z); starColors.push(1,.9,.8); starSizes.push(Math.max(1, 9-star.magnitude*1.3));
      if (star.magnitude < 2.1) addLabel(star.name, position.clone(), "star");
    });
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions,3));
    starGeometry.setAttribute("color", new THREE.Float32BufferAttribute(starColors,3));
    starGeometry.setAttribute("size", new THREE.Float32BufferAttribute(starSizes,1));
    const starMaterial = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
      uniforms: { time: { value: 0 }, ratio: { value: renderer.getPixelRatio() }, reduced: { value: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1 } },
      vertexShader: `attribute float size; varying vec3 starColor; varying float shimmer; uniform float time; uniform float ratio; uniform float reduced; void main(){ starColor=color; shimmer=.82+.18*sin(time*.55+position.x*.1)*reduced; vec4 p=modelViewMatrix*vec4(position,1.); gl_PointSize=size*ratio; gl_Position=projectionMatrix*p; }`,
      fragmentShader: `varying vec3 starColor; varying float shimmer; void main(){ float d=length(gl_PointCoord-.5)*2.; float glow=exp(-d*d*5.); if(d>1.)discard; gl_FragColor=vec4(starColor*shimmer,glow); }`,
    });
    const starField = new THREE.Points(starGeometry,starMaterial); scene.add(starField);
    let constellationGroup = new THREE.Group(); scene.add(constellationGroup);
    function updateStars(date: Date) {
      const positions = starGeometry.getAttribute("position") as THREE.BufferAttribute;
      const named = new Map<string, THREE.Vector3>();
      BRIGHT_STARS.forEach((star,index) => {
        const p = new THREE.Vector3(...getStarDirection(star.ra,star.dec,date)).multiplyScalar(800);
        positions.setXYZ(backgroundCount+index,p.x,p.y,p.z); named.set(star.name,p);
        const label = starLabels.find(label => label.type==="star" && label.el.textContent===star.name);
        label?.position.copy(p);
      });
      positions.needsUpdate=true;
      scene.remove(constellationGroup); disposeObject(constellationGroup); constellationGroup=new THREE.Group();
      const old = starLabels.filter(label=>label.type==="constellation");
      old.forEach(label=>label.el.remove());
      for(let i=starLabels.length-1;i>=0;i--) if(starLabels[i].type==="constellation")starLabels.splice(i,1);
      CONSTELLATIONS.forEach(constellation => {
        const center = new THREE.Vector3(); let count=0;
        constellation.lines.forEach(([a,b]) => {
          const start=named.get(a),end=named.get(b); if(!start||!end)return;
          const points=Array.from({length:15},(_,i)=>start.clone().lerp(end,i/14).normalize().multiplyScalar(790));
          constellationGroup.add(line(points,"#567d71",.12));
          center.add(start).add(end);count+=2;
        });
        if(count) addLabel(constellation.name,center.divideScalar(count).normalize().multiplyScalar(800),"constellation");
      });
      scene.add(constellationGroup); constellationGroup.visible=latest.current.options.constellationLines;
    }
    const ecliptic = line(Array.from({length:361},(_,i)=>spherical(i,550)),"#8c743f",.36);
    const equator = line(Array.from({length:361},(_,i)=>spherical(i,550)),"#4d9bc2",.42);
    equator.rotation.x=THREE.MathUtils.degToRad(23.4393); scene.add(ecliptic,equator);
    const earth = new THREE.Group();
    earth.scale.setScalar(10 / 3);
    const earthMap = new THREE.TextureLoader().load("/stella/textures/earth-blue-marble.png");
    earthMap.colorSpace = THREE.SRGBColorSpace;
    earthMap.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    textures.set("earth", earthMap);
    const earthSurface = new THREE.Mesh(
      new THREE.SphereGeometry(2.1,64,48),
      new THREE.MeshPhongMaterial({map:earthMap,color:"#ffffff",emissiveMap:earthMap,emissive:"#ffffff",emissiveIntensity:.55,specular:"#253344",shininess:12}),
    );
    earthSurface.rotation.y = Math.PI;
    earth.add(earthSurface);
    const earthGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,color:"#489cff",transparent:true,opacity:.4,blending:THREE.AdditiveBlending,depthWrite:false}));earthGlow.scale.set(9.8,9.8,1);earth.add(earthGlow);scene.add(earth);
    scene.add(new THREE.AmbientLight("#a6b5cf",1.3));
    const sunLight=new THREE.DirectionalLight("#fff1cb",2.1);sunLight.position.set(60,40,30);scene.add(sunLight);
    let natalGroup = new THREE.Group(); scene.add(natalGroup);
    let natalAspectGroup = new THREE.Group();
    const liveGroup = new THREE.Group(); scene.add(liveGroup);
    const livePlanets=new Map<string,THREE.Group>();
    const pickables:THREE.Object3D[]=[];
    Object.entries(PLANET_COLORS).forEach(([key,color],index)=>{
      const group=new THREE.Group();
      const radius=key==="sun"?1.7:key==="moon"?1.15:key==="jupiter"?1.3:.9;
      const mesh=new THREE.Mesh(new THREE.SphereGeometry(radius,20,14),new THREE.MeshBasicMaterial({color}));
      mesh.userData.planet=key;group.add(mesh);pickables.push(mesh);
      const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,color,transparent:true,opacity:.65,blending:THREE.AdditiveBlending,depthWrite:false}));
      glow.scale.set(radius*7,radius*7,1);group.add(glow);
      const label=textSprite(PLANET_SYMBOLS[key]+"\uFE0E",color,3.8,90);label.position.set(0,4+(index%2)*2,0);group.add(label);
      liveGroup.add(group);livePlanets.set(key,group);
    });
    function updateSky(sky:SkySnapshot){
      sky.planets.forEach((planet,index)=>{
        const group=livePlanets.get(planet.key);if(!group)return;
        // Sky markers show geocentric angular positions; radius is intentionally schematic.
        group.position.copy(spherical(planet.longitude,57+(index%3)*1.5,planet.latitude));
      });
      const sun=sky.planets.find(p=>p.key==="sun");
      if(sun)sunLight.position.copy(spherical(sun.longitude,100,sun.latitude));
    }
    function updateChart(chart:OpenAIChartJson|null){
      scene.remove(natalGroup);disposeObject(natalGroup);natalGroup=new THREE.Group();natalAspectGroup=new THREE.Group();
      const r=53;
      zodiacColors.forEach((color,index)=>{
        const geometry=new THREE.TorusGeometry(r,1.7,20,40,TAU/12);
        geometry.rotateZ(index*TAU/12);
        geometry.rotateX(-Math.PI/2);
        natalGroup.add(new THREE.Mesh(geometry,new THREE.MeshPhysicalMaterial({color,roughness:.38,metalness:.18,clearcoat:.65,clearcoatRoughness:.25,emissive:color,emissiveIntensity:.04})));
        const sector=new THREE.CircleGeometry(r-2,28,index*TAU/12,TAU/12);sector.rotateX(-Math.PI/2);
        natalGroup.add(new THREE.Mesh(sector,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.008,side:THREE.DoubleSide,depthWrite:false})));
        const glyph=textSprite(SIGN_SYMBOLS[index]+"\uFE0E",color,7.2,96);glyph.position.copy(spherical(index*30+15,r+7));natalGroup.add(glyph);
        natalGroup.add(line([spherical(index*30,3),spherical(index*30,r-2)],color,.15));
      });
      if(chart){
        const map=new Map(chart.planets.map(p=>[p.key,p]));
        chart.houses.forEach((house,index)=>{
          natalGroup.add(line([spherical(house.cuspDegrees,2),spherical(house.cuspDegrees,r-3)],"#b6a48a",index===0||index===9?.5:.17));
          const next=chart.houses[(index+1)%chart.houses.length];
          const mid=house.cuspDegrees+((next.cuspDegrees-house.cuspDegrees+360)%360)/2;
          const number=textSprite(String(house.house),"#aaa7a2",2,52);number.position.copy(spherical(mid,r*.72));natalGroup.add(number);
        });
        chart.planets.forEach((p,index)=>{
          const color=PLANET_COLORS[p.key]||"#bda8de";
          const position=spherical(p.absoluteDegrees,r+(index%2)*.7);
          const dot=new THREE.Mesh(new THREE.SphereGeometry(.7,12,8),new THREE.MeshBasicMaterial({color}));
          dot.position.copy(position);natalGroup.add(dot);
          const glyph=textSprite(PLANET_SYMBOLS[p.key]?PLANET_SYMBOLS[p.key]+"\uFE0E":p.label,color,3.1,90);
          glyph.position.copy(spherical(p.absoluteDegrees,r-6-(index%3)*3));natalGroup.add(glyph);
        });
        chart.angles.forEach(p=>{
          const label=textSprite(p.key==="ascendant"?"ASC":"MC","#d8cdb5",2.4);
          label.position.copy(spherical(p.absoluteDegrees,r+6));natalGroup.add(label);
          const other=textSprite(p.key==="ascendant"?"DSC":"IC","#b8aa91",2.2);
          other.position.copy(spherical(p.absoluteDegrees+180,r+6));natalGroup.add(other);
        });
        chart.aspects.forEach(aspect=>{
          const a=map.get(aspect.point1Key),b=map.get(aspect.point2Key);if(!a||!b)return;
          natalAspectGroup.add(line([spherical(a.absoluteDegrees,r-13),spherical(b.absoluteDegrees,r-13)],aspectColors[aspect.label]||"#b49e77",.72));
        });
      }
      natalGroup.add(natalAspectGroup);scene.add(natalGroup);
      natalGroup.visible=latest.current.options.natal;natalAspectGroup.visible=latest.current.options.aspects;
    }
    let targetPosition:THREE.Vector3|null=null;
    function resetCamera(){
      targetPosition=null;controls.target.set(0,0,0);
      const mobile=element!.clientWidth<700;
      camera.position.set(mobile?72:91,mobile?112:94,mobile?135:124);
      if(mobile)camera.position.multiplyScalar(Math.max(1,element!.clientHeight/element!.clientWidth*.8));
      controls.minDistance=45;controls.maxDistance=420;controls.update();
    }
    let previousView:SceneOptions["view"]|undefined;
    function setOptions(options:SceneOptions){
      starField.visible=options.stars;constellationGroup.visible=options.constellationLines;
      ecliptic.visible=options.ecliptic;equator.visible=options.equator;natalGroup.visible=options.natal;
      natalAspectGroup.visible=options.aspects;liveGroup.visible=options.planets;
      bloomPass.enabled=options.glow;controls.autoRotate=options.autoRotate;
      if(options.view!==previousView){
        if(options.view==="ground"){camera.position.set(1,4,3);controls.target.set(-100,35,-50);controls.minDistance=30;controls.maxDistance=350;controls.update();}
        else resetCamera();
        previousView=options.view;
      }
    }
    const observer=new ResizeObserver(()=>{
      const width=element.clientWidth,height=element.clientHeight;if(!width||!height)return;
      camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height);composer.setSize(width,height);
    });observer.observe(element);
    const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
    let downX=0,downY=0;
    function pointerDown(event:PointerEvent){downX=event.clientX;downY=event.clientY;}
    function pointerUp(event:PointerEvent){
      if(Math.hypot(event.clientX-downX,event.clientY-downY)>5)return;
      const bounds=renderer.domElement.getBoundingClientRect();
      pointer.set((event.clientX-bounds.left)/bounds.width*2-1,-(event.clientY-bounds.top)/bounds.height*2+1);
      raycaster.setFromCamera(pointer,camera);
      const hit=raycaster.intersectObjects(pickables)[0];
      if(hit && latest.current.options.planets)latest.current.onPlanet(hit.object.userData.planet);
    }
    function contextLost(event:Event){event.preventDefault();latest.current.onStatus("error");}
    function restored(){latest.current.onStatus("ready");}
    renderer.domElement.addEventListener("pointerdown",pointerDown);renderer.domElement.addEventListener("pointerup",pointerUp);
    renderer.domElement.addEventListener("webglcontextlost",contextLost);renderer.domElement.addEventListener("webglcontextrestored",restored);
    const apiObject:SceneAPI={
      sky:updateSky,chart:updateChart,options:setOptions,stars:updateStars,reset:resetCamera,
      focus:key=>{const planet=livePlanets.get(key);if(planet)targetPosition=planet.position.clone().multiplyScalar(.4);},
      download:()=>{const a=document.createElement("a");a.href=renderer.domElement.toDataURL("image/png");a.download="stella-birth-chart.png";a.click();},
    };
    api.current=apiObject;
    updateStars(latest.current.date);updateSky(latest.current.sky);updateChart(latest.current.chart);setOptions(latest.current.options);
    const clock=new THREE.Clock(),projected=new THREE.Vector3(),forward=new THREE.Vector3();
    let frame=0,disposed=false;
    function animate(){
      if(disposed)return;
      frame=requestAnimationFrame(animate);
      const elapsed=clock.getElapsedTime();starMaterial.uniforms.time.value=elapsed;
      if(targetPosition){controls.target.lerp(targetPosition,.06);if(controls.target.distanceTo(targetPosition)<.05)targetPosition=null;}
      controls.update();camera.getWorldDirection(forward);
      starLabels.forEach(label=>{
        const option=label.type==="star"?latest.current.options.starNames:latest.current.options.constellationNames;
        const direction=label.position.clone().sub(camera.position);
        if(!option||direction.dot(forward)<0){label.el.style.display="none";return;}
        projected.copy(label.position).project(camera);
        const visible=Math.abs(projected.x)<1.03&&Math.abs(projected.y)<1.03&&projected.z<1;
        label.el.style.display=visible?"block":"none";
        if(visible)label.el.style.transform=`translate3d(${(projected.x*.5+.5)*element!.clientWidth}px,${(-projected.y*.5+.5)*element!.clientHeight}px,0)`;
      });
      composer.render();
    }
    animate();latest.current.onStatus("ready");
    return ()=>{
      disposed=true;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();
      renderer.domElement.removeEventListener("pointerdown",pointerDown);renderer.domElement.removeEventListener("pointerup",pointerUp);
      renderer.domElement.removeEventListener("webglcontextlost",contextLost);renderer.domElement.removeEventListener("webglcontextrestored",restored);
      disposeObject(scene);textures.forEach(texture=>texture.dispose());bloomPass.dispose();renderPass.dispose();outputPass.dispose();composer.dispose();renderer.dispose();
      renderer.domElement.remove();labels.remove();api.current=null;
    };
  }, []);
  useEffect(()=>{api.current?.sky(props.sky);},[props.sky]);
  useEffect(()=>{api.current?.chart(props.chart);},[props.chart]);
  useEffect(()=>{api.current?.options(props.options);},[props.options]);
  const day=Math.floor(props.date.getTime()/86400000);
  useEffect(()=>{api.current?.stars(new Date(day*86400000));},[day]);
  return <div ref={host} className={styles.scene} data-testid="stella-scene" />;
});
export default StellaScene;
