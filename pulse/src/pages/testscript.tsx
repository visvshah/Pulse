// @ts-nocheck
import React, { useState } from "react";
import { useEdgeStore } from '../lib/edgestore';
import { string } from "zod";

interface Summaries {
  topics: {
    topic_name: string,
    topic_summary: string
  }[]
}
export default function Home() {
  const [text, setText] = useState<Summaries>({topics:[]});
  const [presentation, setpresentation] = useState("");
  const [script, setScript] = useState<Summaries>([]);
  const [file, setFile] = React.useState<File>();
  const { edgestore } = useEdgeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior
    createScripts(presentation);
  };

  const createScripts = async(inp: string) => {
    try {
      console.log("Create Scripts Presentation: "+ inp)
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
      console.log("RES: " + res);
      setText(JSON.parse(res) as Summaries);
      const summaries = JSON.parse(res).topics;
      console.log(summaries.length);
      setScript([]);
      for (let i = 0; i < summaries.length; i++) {
        const topic_name = summaries[i]?.topic_name as string;
        const topic_summary = summaries[i]?.topic_summary as string;
        console.log(topic_name);
        console.log(topic_summary);

        const response2 = await fetch("/api/createScripts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic_name, topic_summary }) ,
        });
        const result2 = await response2.json();
        console.log(result2)
        const res2 = result2[0].message.content;
        console.log(i + ": " + res2)
        const params = new URLSearchParams({ text: res2 });
        const url = "http://localhost:5000/getvideo?" + params;
        const response3 = await fetch(url)
        console.log(response3);
        setScript((prevScripts) => [
          ...prevScripts,
          { topic_name, topic_script: res2 },
        ]);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const reallySetPresentation = async (p: string) => {
  setpresentation(p);
}




  const uploadSlides = async () => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          // you can use this to show a progress bar
          console.log(progress);
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


  const uploadAudio = async () => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          // you can use this to show a progress bar
          console.log(progress);
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

  return (
    <div>
      <form onSubmit={handleSubmit} >
        <textarea
          value={presentation}
          onChange={(e) => setpresentation(e.target.value)}
          placeholder="Enter text here"
          className="w-full m-10 h-32"
        />
        <br />
        <button className = "m-5" type="submit">Submit</button>
      </form>
      <div className="flex w-full h-32 items-center justify-center flex-row">
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files?.[0]);
          }}
        />
        <button
          onClick={uploadSlides}
        >
          Upload Slides
        </button>
      </div>


      <div className="flex w-full h-32 items-center justify-center flex-row">
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files?.[0]);
          }}
        />
        <button
          onClick={uploadAudio}
        >
          Upload Audio
        </button>
      </div>

      <div className="flex flex-col bg-slate-500 w-[100vw] h-[50vh] overflow-scroll">
        <h1 className="m-3">Summaries</h1>
        {text.topics.map((obj) => (
          <div className="flex flex-row">
            <p><b>{obj.topic_name}</b>: {obj.topic_summary}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-slate-200w-[100vw] h-[50vh] overflow-scroll">
      <h1 className="m-3">Scripts</h1>
        {script.map((obj) => (
          <div className="flex flex-row">
            <p><b>{obj.topic_name}</b>: {obj.topic_script}</p>
          </div>
        ))}
      </div>
    
      
  
    </div>
  );
}
