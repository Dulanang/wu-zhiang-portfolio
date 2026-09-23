import React,{useEffect,useRef,useState} from 'react';

export function ListCursor({project}){
 const ref=useRef(null),current=useRef(project),[images,setImages]=useState([]);current.current=project;
 useEffect(()=>{if(project)setImages(old=>[...old.filter(p=>p.slug!==project.slug),project].slice(-5));},[project]);
 useEffect(()=>{let frame;const target={x:innerWidth/2,y:innerHeight/2},pos={...target};let scale=.5;
 const move=e=>{target.x=e.clientX;target.y=e.clientY;};window.addEventListener('pointermove',move,{passive:true});
 const tick=()=>{pos.x+=(target.x-pos.x)*.1;pos.y+=(target.y-pos.y)*.1;scale+=((current.current?1:.5)-scale)*.07;if(ref.current)ref.current.style.transform=`translate3d(${pos.x}px,${pos.y}px,0) translate(-25%,-75%) scale(${scale})`;frame=requestAnimationFrame(tick);};tick();return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);};},[]);
 return <div ref={ref} className={`list-preview ${project?'':'hide'}`} aria-hidden="true">{images.map(p=><img key={p.slug} src={p.image} alt=""/>)}</div>;
}

export function ProjectStory({project,onClose,onNext}){
 const ref=useRef(null),close=useRef(null);
 useEffect(()=>{const previous=document.activeElement;close.current.focus();ref.current.scrollTop=0;const key=e=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){const nodes=[...ref.current.querySelectorAll('button,a[href]')];if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus();}}};window.addEventListener('keydown',key);return()=>{window.removeEventListener('keydown',key);previous?.focus();};},[project]);
 return <article ref={ref} className="project-story" role="dialog" aria-modal="true" aria-label={project.title}>
  <button ref={close} className="pill player-close" onClick={onClose}>close ×</button>
  <div className="story-inner"><header className="story-heading"><span>Selected work / {project.year}</span><h1>{project.title}</h1><p>{project.description?.split(/(\*[^*]+\*)/g).map((part,i)=>part.startsWith('*')&&part.endsWith('*')?<em key={i}>{part.slice(1,-1)}</em>:part)}</p></header>
   <img className="story-cover" src={project.image} alt={project.title}/>
   {(project.blocks||[]).map((block,i)=>block.type==='image'?<figure key={i}><img loading="lazy" src={block.src} alt={block.alt||project.title}/>{block.caption&&<figcaption>{block.caption}</figcaption>}</figure>:block.type==='gallery'?<div className="story-gallery" key={i}>{block.images.map((im,j)=><img key={j} src={im.src} alt={im.alt||''} loading="lazy"/>)}</div>:<section className="story-text" key={i}>{block.heading&&<h2>{block.heading}</h2>}{block.body&&<p>{block.body}</p>}</section>)}
   <button className="next-project" onClick={onNext}>Next project ↗</button>
  </div>
 </article>;
}
