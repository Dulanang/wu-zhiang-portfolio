import React,{useEffect,useRef} from 'react';
import lottie from 'lottie-web';
export default function IntroAnimation({onComplete}){
 const container=useRef(null),callback=useRef(onComplete);callback.current=onComplete;
 useEffect(()=>{const animation=lottie.loadAnimation({container:container.current,renderer:'svg',loop:false,autoplay:!matchMedia('(prefers-reduced-motion: reduce)').matches,path:'/assets/loader.json'});const complete=()=>callback.current();animation.addEventListener('complete',complete);animation.addEventListener('data_failed',complete);animation.addEventListener('DOMLoaded',()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches){animation.goToAndStop(66,true);complete();}});return()=>animation.destroy();},[]);
 return <div className="intro-lottie" ref={container} aria-hidden="true"/>;
}
