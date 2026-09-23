import React,{useEffect,useRef} from 'react';
import * as THREE from 'three';
import {fragmentShader,vertexShader,PPnoiseFragmentShader,PPnoiseVertexShader} from './shaders.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import data from './projects.json';
export default function Spiral(props){
 const ref=useRef(),state=useRef(props);state.current=props;
 useEffect(()=>{
  const canvas=ref.current;let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});}catch{state.current.onError();return;}
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,innerWidth/innerHeight,.1,100);camera.position.z=8;
  const geometry=new THREE.PlaneGeometry(1,1,8,8),ray=new THREE.Raycaster(),mouse=new THREE.Vector2(5,5),loader=new THREE.TextureLoader();
  let disposed=false,raf=0,hovered=null,last=performance.now(),speed=0,targetSpeed=.002,direction=1,offset=0,reveal=0,pointerStart=null,lastX=0,moved=false;
  const meshes=[],textures=[];
  renderer.setClearColor(0x0e0e0e,0);
  const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
  const noise=new ShaderPass({uniforms:{tDiffuse:{value:null},uFillColor:{value:new THREE.Color('#444')}},vertexShader:PPnoiseVertexShader,fragmentShader:PPnoiseFragmentShader});composer.addPass(noise);
  let capture=false;
  if(import.meta.env.DEV)window.__captureSpiral=(value)=>{offset=value;speed=0;targetSpeed=0;reveal=1;capture=true;};
  const resize=()=>{renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<900?45:35;camera.updateProjectionMatrix();};resize();
  Promise.all(data.projects.map(async p=>{const texture=await loader.loadAsync(p.image);textures.push(texture);return texture;})).then(ts=>{
   if(disposed){ts.forEach(t=>t.dispose());return;}
   [...data.projects,...data.projects].forEach((project,i)=>{const tex=ts[i%ts.length];const material=new THREE.ShaderMaterial({uniforms:{uTexture:{value:tex},uColorStrength:{value:0},uZoom:{value:1},uPlaneSizes:{value:new THREE.Vector2(1.7,1)},uImageSizes:{value:new THREE.Vector2(tex.image.width,tex.image.height)},uRevealProgress:{value:0},uScrollSpeed:{value:0}},vertexShader,fragmentShader,transparent:true,side:THREE.DoubleSide});const mesh=new THREE.Mesh(geometry,material);mesh.scale.set(1.7,1,1);mesh.userData={project,index:i,hover:0};scene.add(mesh);meshes.push(mesh);});state.current.onReady();
  }).catch(()=>state.current.onError());
  const updatePointer=e=>{mouse.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);};
  const wheel=e=>{if(!state.current.active)return;e.preventDefault();targetSpeed=THREE.MathUtils.clamp(targetSpeed+e.deltaY*.00015,-2,2);direction=e.deltaY>0?1:-1;};
  const move=e=>{updatePointer(e);if(pointerStart){const diff=e.clientX-lastX;if(Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>8)moved=true;if(moved){targetSpeed+=diff*.0015;direction=diff>0?1:-1;}lastX=e.clientX;}};
  const down=e=>{if(!state.current.active)return;pointerStart={x:e.clientX,y:e.clientY};lastX=e.clientX;moved=false;canvas.setPointerCapture(e.pointerId);updatePointer(e);};
  const up=e=>{if(!moved&&state.current.active){updatePointer(e);ray.setFromCamera(mouse,camera);const hit=ray.intersectObjects(meshes)[0];if(hit&&hit.face.normal.clone().transformDirection(hit.object.matrixWorld).dot(ray.ray.direction)<0)state.current.onSelect(hit.object.userData.project);}pointerStart=null;};
  const key=e=>{if(document.activeElement!==canvas||!state.current.active)return;if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(e.key)){e.preventDefault();targetSpeed+=['ArrowDown','ArrowRight'].includes(e.key)?.1:-.1;}if(e.key==='Enter'){ray.setFromCamera(new THREE.Vector2(0,0),camera);const hit=ray.intersectObjects(meshes)[0];if(hit)state.current.onSelect(hit.object.userData.project);}};
  const leave=()=>mouse.set(5,5);
  canvas.addEventListener('wheel',wheel,{passive:false});canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointerleave',leave);canvas.addEventListener('keydown',key);window.addEventListener('resize',resize);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function frame(now){const dt=Math.min(now-last,50);last=now;const active=state.current.active;reveal=THREE.MathUtils.lerp(reveal,active?1:0,1-Math.pow(.95,dt*.15));
   if(active&&!capture){speed+=(targetSpeed-speed)*.1;offset+=speed*dt/16.667;if(Math.abs(targetSpeed)<.002)targetSpeed=reduced?0:direction*.002;targetSpeed*=.9;}
   meshes.forEach(mesh=>{const u=mesh.material.uniforms;let position=((mesh.userData.index-offset)%meshes.length+meshes.length)%meshes.length-meshes.length/2;const angle=position*.85;const radius=2*(.5+reveal*.5);mesh.position.set(Math.cos(angle)*radius,position*.5-.8-(1-reveal)*1.5,Math.sin(angle)*radius);mesh.rotation.y=-angle+Math.PI/2;mesh.userData.hover=THREE.MathUtils.lerp(mesh.userData.hover,mesh===hovered?1:0,.16);const h=mesh.userData.hover;u.uColorStrength.value=.55*h;u.uZoom.value=1+.05*h;u.uRevealProgress.value=reveal*(1-h*.05);u.uScrollSpeed.value=speed;});
   ray.setFromCamera(mouse,camera);const hit=active?ray.intersectObjects(meshes)[0]:null;const next=hit&&hit.face.normal.clone().transformDirection(hit.object.matrixWorld).dot(ray.ray.direction)<0?hit.object:null;if(next!==hovered){hovered=next;canvas.style.cursor=next?'pointer':'grab';state.current.onHover(next?.userData.project||null);}
   if(composer._width!==innerWidth||composer._height!==innerHeight)composer.setSize(innerWidth,innerHeight);
   composer.render();raf=requestAnimationFrame(frame);
  }raf=requestAnimationFrame(frame);
  return()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);canvas.removeEventListener('wheel',wheel);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('keydown',key);geometry.dispose();meshes.forEach(m=>m.material.dispose());textures.forEach(t=>t.dispose());composer.dispose();renderer.dispose();};
 },[]);
 return <canvas ref={ref} className="webgl" data-web-clone-id="wc-body1-div1-canvas1" tabIndex={0} aria-label="3D portfolio. Scroll or drag to rotate. Use arrow keys and Enter to explore projects."/>;
}
