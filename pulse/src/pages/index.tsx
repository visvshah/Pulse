// @ts-nocheck
import React, { useState } from "react";
import { useEdgeStore } from '../lib/edgestore';
import { string } from "zod";
import Head from 'next/head';
import { Spinner} from '@chakra-ui/react';
import { FaFileAudio } from "react-icons/fa";
import { BsFiletypePpt } from "react-icons/bs";

interface Summaries {
  topics: {
    topic_name: string,
    topic_summary: string
  }[]
}


const LandingPage = () => {
  const [text, setText] = useState<Summaries>({topics:[]});
  const [presentation, setpresentation] = useState("");
  const [script, setScript] = useState<Summaries>([]);
  // const [file, setFile] = React.useState<File>();
  const { edgestore } = useEdgeStore();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Test");
  const [selectedName, setSelectedName] = useState("")


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior
    createScripts(presentation);
  };

  const createScripts = async(inp: string) => {
    setLoadingMessage("File finished parsing! Loading key information...");
    try {
      console.log("Creating Summaries of: "+ inp)
    const response = await fetch("/api/createSummary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ presentation: inp }) ,
    });


    if (response.status === 200) {
      const result = await response.json();
      const res = result[0].message.content
    
      setText(JSON.parse(res) as Summaries);
      const summaries = JSON.parse(res).topics;
      // console.log(summaries.length);
      setScript([]);
      console.log(summaries.length + " Summaries/Topics Generated!");
      setLoadingMessage(summaries.length + " Summaries/Topics Generated!");
      for (let i = 0; i < summaries.length; i++) {
        console.log("Topic #" + (summaries.length + 1));
        
        const topic_name = summaries[i]?.topic_name as string;
        const topic_summary = summaries[i]?.topic_summary as string;
        console.log("Name: " + topic_name);
        console.log("Summary: " + topic_summary);
        

        const response2 = await fetch("/api/createScripts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic_name, topic_summary }) ,
        });
        const result2 = await response2.json();
        const res2 = result2[0].message.content;
        console.log("Script: " + res2)
        setLoadingMessage("Created Video Script for Topic #" + (i + 1) + ": " + topic_name);
        const params = new URLSearchParams({ text: res2 });
        const url = "http://localhost:5000/getvideo?" + params;
        const response3 = await fetch(url)
        console.log(response3);
        setScript((prevScripts) => [
          ...prevScripts,
          { topic_name, topic_script: res2 },
        ]);
        setScript((prevScripts) => [
          ...prevScripts,
          { topic_name, topic_script: res2 },
        ]);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
  setLoadingMessage("Finished creating scripts! Generating Videos Now...");
}

const reallySetPresentation = async (p: string) => {
  setpresentation(p);
}




  const uploadSlides = async (file) => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          // you can use this to show a progress bar
          console.log(progress);
          setLoadingMessage("Uploading: " + progress + "%");
        },
        options: {
          temporary: true,
        },
      });
      // you can run some server action or api here
      // to add the necessary data to your database
      console.log(res);
      //setUrl(res.url);
      let url = res.url;
      console.log(url)

      try {
        setLoadingMessage("Reading File...");
        const response = await fetch('/api/readFile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({url}),
        });
        console.log(response)
  
        if (response.ok) {
          const result = await response.json();
          console.log('API Response:', result.text);

          //setpresentation(result.text);
          await reallySetPresentation(result.text);
          //handleSubmit();
          await createScripts(result.text);
        } else {
          console.error('API Error:', response.statusText);
        }
      } catch (error: any) {
        console.error('API Request Error:', error!.message);
      } 
  
    }
  }


  const uploadAudio = async (file) => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          // you can use this to show a progress bar
          console.log(progress);
          setLoadingMessage("Uploading: " + progress + "%");
        },
        options: {
          temporary: true,
        },
      });
      // you can run some server action or api here
      // to add the necessary data to your database
      console.log(res);
      //setUrl(res.url);
      let url = res.url;
      console.log(url)
      let text = "";
      try {
        setLoadingMessage("Reading File...");
        const requestUrl = "http://localhost:5000/transcribe?link=" + url;
        const response = await fetch(requestUrl);

          if (response.ok) {
            const result = await response.json();
            text = result.text;
            console.log('Transcription result:', result.text);
            await createScripts(result.text);
          } else {
            console.error(`Error: ${response.status}, ${await response.text()}`);
          }
      } catch (error: any) {
        console.error('API Request Error:', error!.message);
      } 


  
    }
  }
  if (loading) {
    return (
      <>
           <div className = "flex flex-col h-screen bg-gradient-to-b from-[#ff4d6e] to-[#2e026d] text-white p-7 items-center justify-center">
           <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #ff4d6e; /* Vibrant pink background */
          color: #fff; /* White text */
        }
      `}</style>
              <div className="flex flex-col items-center justify-center w-48">
                <div className = "flex flex-row items-center justify-center gap-8">
                  <div className="relative h-4 w-4 animate-bounce">
                    <div className="h-6 w-6 animate-pulse rounded-full bg-white"></div>
                  </div>
                  <div className="relative h-4 w-4 animate-bounce">
                    <div className="h-6 w-6 animate-pulse rounded-full bg-white"></div>
                  </div>
                  <div className="relative h-4 w-4 animate-bounce">
                    <div className="h-6 w-6 animate-pulse rounded-full bg-white"></div>
                  </div>
                </div>
                <p className="m-5 w-48 text-center">{loadingMessage}</p>
              </div>
            </div>
        </>
    )
  }  
  return (
    <>
      <Head>
        <title>Home | Pulse</title>
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
        <div className="flex flex-col h-full items-center justify-center gap-32 mx-32">
          <p className="text-white text-2xl lg:text-6xl text-center font-semibold px-40">
            create short-form content from your lecture videos
          </p>
          <div className="flex gap-8 items-center">
            <div className="bg-white/20 p-8 h-80 rounded-xl h-full hover:scale-105 transition-all duration-300 ease-out">
              {/* Your audio upload component goes here */}
              <label htmlFor="audioInput" className="text-white block mb-2 w-full text-center">
                Upload Audio
              </label>
              <div className="flex flex-col items-center file-upload">
                <FaFileAudio className="w-1/2 h-1/2 mb-4"/>
                <h3> {selectedName || "Click icon to upload"}</h3>
                <p>.wav or .mp3</p>
                <input type="file" onChange={(e) => {
                  // setFile(e.target.files?.[0]);
                  uploadAudio(e.target.files?.[0]);
                  setLoading(true);
                }} />
              </div>
            </div>
            <div className="text-white font text-xl">OR</div>
            <div className="bg-white/20 p-8 rounded-xl h-full hover:scale-105 transition-all duration-300 ease-out">
              {/* Your PowerPoint upload component goes here */}

              <label htmlFor="audioInput" className="text-white block mb-2 w-full text-center">
                Upload PowerPoint
              </label>
              <div className="flex flex-col items-center file-upload">
                <BsFiletypePpt className="w-1/2 h-1/2 mb-4"/>
                <h3> {selectedName || "Click icon to upload"}</h3>
                <p>.pdf or .pptx</p>
                <input type="file" onChange={(e) => {
                  // setFile(e.target.files?.[0]);
                  uploadSlides(e.target.files?.[0]);
                  setLoading(true);
                }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LandingPage;
