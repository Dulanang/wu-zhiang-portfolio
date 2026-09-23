import React,{useEffect,useRef,useState} from 'react';
import Spiral from './Spiral.jsx';
import Player from './Player.jsx';
import IntroAnimation from './IntroAnimation.jsx';
import {ListCursor,ProjectStory} from './Details.jsx';
import data from './projects.json';
import audioConfig from './audio.json';
import './section_1.css';

export default function Section1(){
 const [entered,setEntered]=useState(()=>sessionStorage.getItem('pacome-entered')==='1');
 const [introDone,setIntroDone]=useState(false),[ready,setReady]=useState(false),[leaving,setLeaving]=useState(false),[sound,setSound]=useState(false),[mode,setMode]=useState('spiral'),[menu,setMenu]=useState(false),[about,setAbout]=useState(false),[project,setProject]=useState(null),[hover,setHover]=useState(null),[fallback,setFallback]=useState(false),[wechat,setWechat]=useState(false),[copied,setCopied]=useState(false);
 const audio=useRef({}),menuButton=useRef(null),menuPanel=useRef(null),soundRef=useRef(sound);soundRef.current=sound;
 const getAudio=n=>{if(!audio.current[n]){const cfg=audioConfig[n];const a=new Audio(cfg.src);a.volume=cfg.volume;a.loop=n==='ambient';audio.current[n]=a;}return audio.current[n];};
 const play=n=>{if(!soundRef.current)return;const a=getAudio(n);a.currentTime=0;a.play().catch(()=>{});};
 useEffect(()=>{const a=getAudio('ambient');if(!sound)Object.values(audio.current).forEach(item=>item.pause());if(sound&&entered&&!(project?.playbackId&&!project?.slug)&&!document.hidden)a.play().catch(()=>{});else a.pause();const visibility=()=>{if(document.hidden)a.pause();else if(sound&&entered&&!(project?.playbackId&&!project?.slug))a.play().catch(()=>{});};document.addEventListener('visibilitychange',visibility);return()=>document.removeEventListener('visibilitychange',visibility);},[sound,entered,project]);
 useEffect(()=>()=>Object.values(audio.current).forEach(a=>a.pause()),[]);
 useEffect(()=>{const esc=e=>{if(e.key==='Escape'){setMenu(false);setAbout(false);setWechat(false);if(!project)menuButton.current?.focus();}};window.addEventListener('keydown',esc);return()=>window.removeEventListener('keydown',esc);},[project]);
 useEffect(()=>{if(menu)menuPanel.current?.querySelector('button')?.focus();},[menu]);
 const enter=enabled=>{soundRef.current=enabled;setSound(enabled);if(enabled)getAudio('ambient').play().catch(()=>{});setLeaving(true);setTimeout(()=>{setEntered(true);sessionStorage.setItem('pacome-entered','1');},500);};
 const openProject=p=>{play('longclick');setHover(null);setProject(p);};
 const closeProject=()=>{play('close');setProject(null);};
 const switchMode=m=>{setMode(m);play(m);setHover(null);};
 const closeMenu=()=>{setMenu(false);play('close');menuButton.current?.focus();};
 return <main className="portfolio" data-source-url="https://pacomepertant.com/" data-web-clone-id="wc-body1-div1">
  <img className="grid" src="/assets/grid.svg" alt=""/>
  {!fallback&&<Spiral active={(entered||leaving)&&mode==='spiral'&&!menu&&!project&&!about} onReady={()=>setReady(true)} onSelect={openProject} onHover={p=>{if(p)play('hover');}} onError={()=>{setFallback(true);setReady(true);setMode('list');}}/>}
  <div className={`interface ${entered||leaving?'visible':''}`} inert={!entered}>
   <header className="header"><button className="logo-button" aria-label="Wu Zhiang, home" onMouseEnter={()=>play('smiley1')} onClick={()=>{setAbout(false);setMenu(false);setMode(fallback?'list':'spiral');play('menuhome');}}><img src="/assets/logo.svg" alt="Wu Zhiang"/><span className="logo-tag">hello!</span></button>
    <nav className="view-switch" aria-label="Gallery view"><button className={mode==='spiral'?'selected':''} aria-pressed={mode==='spiral'} disabled={fallback} onClick={()=>switchMode('spiral')}>spiral</button><span className="dot"/><button className={mode==='list'?'selected':''} aria-pressed={mode==='list'} onClick={()=>switchMode('list')}>list</button></nav>
    <button ref={menuButton} className={`pill menu-button ${menu?'opened':''}`} aria-label={menu?'Close menu':'menu'} aria-expanded={menu} aria-controls="main-menu" onClick={()=>{menu?closeMenu():(setMenu(true),play('click'));}}>{menu?'×':<>menu <span className="dot"/></>}</button>
   </header>
   {(mode==='list'||fallback)&&!about&&<><ListCursor project={menu||project?null:hover}/><section className="project-list" aria-label="Selected works" onMouseLeave={()=>setHover(null)}>{data.projects.map((p,i)=><button key={p.slug} style={{'--index':i}} onMouseEnter={()=>{setHover(p);play('hover');}} onFocus={()=>setHover(p)} onBlur={()=>setHover(null)} onClick={()=>openProject(p)}>{p.title}</button>)}</section></>}
   <footer><button className="showreel" aria-label="Play showreel 2026" onClick={()=>openProject({title:'Showreel 2026',year:2026,image:'/assets/image-cc37df5989400fbb.png',playbackId:data.showreel,description:'A selection of motion and sound design.'})}><span className="marquee-container" aria-hidden="true">{('showreel • 2026 • '.repeat(5)).split('').map((c,i)=><span key={i} className="marquee-text" style={{animationDelay:`${i*.12-12}s`}}>{c===' '?'\u00a0':c}</span>)}</span><img src="/assets/image-cc37df5989400fbb.png" alt="Showreel Thumbnail"/><span className="reel-play">▶</span></button><button className="sound-button" aria-label={sound?'Mute sound':'Enable sound'} aria-pressed={sound} onClick={()=>{soundRef.current=!sound;setSound(!sound);if(!sound){getAudio('ambient').play().catch(()=>{});play('switch');}}}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/>{sound?<path d="M16 8q5 4 0 8m3-11q8 7 0 14" stroke="currentColor" strokeWidth="1.6"/>:<path d="m17 9 5 6m0-6-5 6" stroke="currentColor" strokeWidth="1.8"/>}</svg></button></footer>
  </div>
  <button className={`menu-backdrop ${menu?'open':''}`} tabIndex={menu?0:-1} aria-hidden={!menu} aria-label="Dismiss menu" onClick={closeMenu}/>
  <aside id="main-menu" className={`menu-panel ${menu?'open':''}`} ref={menuPanel} aria-label="Main menu" inert={!menu} aria-hidden={!menu}>
   <div className="menu-inner"><nav><button onClick={()=>{setMenu(false);setAbout(false);play('menuhome');}}>works</button><button onClick={()=>{setMenu(false);setAbout(true);play('menuabout');}}>about</button><a href={`mailto:${data.email}`} onClick={()=>play('click')}>contact</a></nav>
    <div className="menu-bottom"><div className="social-links"><button onClick={()=>{setWechat(true);play('click');}}>微信 ↗</button><a href="tel:17756971591">手机 ↗</a><span>小红书</span><span>抖音</span></div><a className="menu-email" href={`mailto:${data.email}`}>{data.email}</a><p className="menu-credit">© Wu Zhiang 2026</p></div>
   </div>
  </aside>
  {wechat&&<div className="contact-overlay" role="dialog" aria-modal="true" aria-label="微信联系方式"><div><button className="contact-close" onClick={()=>setWechat(false)}>close ×</button><p>微信</p><h2>Dulanang</h2><button className="pill" onClick={async()=>{try{await navigator.clipboard.writeText('Dulanang');setCopied(true);}catch{setCopied(false);}}}>{copied?'已复制':'复制微信号'}</button></div></div>}
  {about&&<section className="about"><button className="pill" onClick={()=>setAbout(false)}>back to works ↗</button><h1>I'm Wu Zhiang,<br/>Brand & 3D Designer<br/>Based in Hefei.</h1><a href={`mailto:${data.email}`}>Let's talk ↗</a></section>}
  {!entered&&<section className={`intro ${leaving?'leaving':''} ${introDone?'animation-done':''}`} aria-label="Welcome"><h1 className="sr-only">I'm Wu Zhiang</h1><IntroAnimation onComplete={()=>setIntroDone(true)}/><p className="intro-description"><span className="intro-line"><span>Brand &amp; 3D Designer</span></span><span className="intro-line"><span>Based in Hefei</span></span></p><button className="pill enter" disabled={!ready||!introDone} onClick={()=>enter(true)}>{ready?'enter with sound ↗':'loading…'}</button><button className="no-sound" disabled={!ready||!introDone} onClick={()=>enter(false)}>enter without sound</button></section>}
  {project&&(project.playbackId&&!project.slug?<Player project={project} onClose={closeProject}/>:<ProjectStory project={project} onClose={closeProject} onNext={()=>openProject(data.projects[(data.projects.findIndex(p=>p.slug===project.slug)+1)%data.projects.length])}/>)}
 </main>;
}
