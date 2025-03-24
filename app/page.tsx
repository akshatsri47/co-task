"use client"

import FrameParallax from './components/FrameParallax';
import { ParallaxProvider } from "react-scroll-parallax"

 export default function App() {
  return (
    <div>
             <ParallaxProvider>
             <FrameParallax />
            </ParallaxProvider>
      
   </div>
  );
}