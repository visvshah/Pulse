import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useEdgeStore } from '../lib/edgestore';
import Head from 'next/head';
import mangla from '../../public/mangla.jpeg';
import visiv from '../../public/visiv.jpeg';
import soam from '../../public/soam.jpeg';
import saarang from '../../public/saarang.jpeg';

export default function Page() {

  return (
    <>
      <Head>
        <title>About Us | Pulse</title>
        <meta name="description" content="Make short form video content from lectures." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #ff4d6e; /* Vibrant pink background */
          color: #fff; /* White text */
        }
      `}</style>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
      `}</style>
      <header className="h-[10vh] bg-[#ff4d6e] py-10">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-white text-4xl font-extrabold font-pacifico">PULSE</h1>
          <nav className="flex space-x-10 text-l">
            <a href="#" className="text-white hover:underline">Home</a>
            <a href="/aboutus" className="text-white hover:underline">About Us</a>
            <a href="/signup" className="text-white hover:underline">Sign In</a>
          </nav>
        </div>
      </header>
      <main className="h-[90vh] bg-gradient-to-b from-[#ff4d6e] to-[#2e026d]">
      </main>
    </>
  );
}
