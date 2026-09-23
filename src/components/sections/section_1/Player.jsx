import React,{useEffect,useRef,useState} from 'react';
function Player({project,onClose}){
 const video=useRef(null),close=useRef(null);const [failed,setFailed]=useState(false);
 useEffect(()=>{const previous=document.activeElement;close.current.focus();let hls,cancelled=false;const url=`https://stream.mux.com/${project.playbackId}.m3u8`;const el=video.current;const loadTimer=setTimeout(()=>{if(el.readyState<2)setFailed(true);},15000);
 if(el.canPlayType('application/vnd.apple.mpegurl'))el.src=url;else import('hls.js').then(({default:Hls})=>{if(cancelled)return;if(Hls.isSupported()){hls=new Hls();hls.loadSource(url);hls.attachMedia(el);hls.on(Hls.Events.ERROR,(_,e)=>{if(e.fatal)setFailed(true);});}else setFailed(true);});
 const key=e=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){const nodes=[...document.querySelectorAll('.player button,.player a,.player video')];if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus();}}};window.addEventListener('keydown',key);return()=>{cancelled=true;clearTimeout(loadTimer);hls?.destroy();window.removeEventListener('keydown',key);previous?.focus();};},[project]);
 return <div className="player" role="dialog" aria-modal="true" aria-label={project.title}><button className="pill player-close" ref={close} onClick={onClose}>close ×</button><div className="player-content"><video ref={video} controls playsInline preload="auto" poster={project.image} onError={()=>setFailed(true)}/><div className="project-caption"><h1>{project.title}</h1><span>{project.year||'2025'}</span></div>{failed&&<p className="video-error">The video is currently unavailable. <a href={project.url||'https://pacomepertant.com/'} target="_blank" rel="noreferrer">View the original project ↗</a></p>}<p>{project.description}</p></div></div>;
}


export default Player;
