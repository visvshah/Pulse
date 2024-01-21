import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useEdgeStore } from '../lib/edgestore';

export default function Page() {

  return (
    <>
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0"> </div>

      <h1 className="flex items-center z-10 text-4xl hover:scale-110 text-transparent duration-1000 cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text bg-white p-5">
        Pulse
        {/* <Image alt='xyz' width={100} height={100} className="float-right rounded-full mx-4" /> */}
      </h1>

      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0"> </div>
      <div className="my-16 text-center animate-fade-in">
        <h2 className="text-lg text-zinc-500">
          <p>Hi, my name is Saarang!</p>
        </h2>
      </div>
    </div>
    </>
  );
}
