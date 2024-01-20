// @ts-nocheck
import React, { useState } from "react";
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
  const [script, setScript] = useState<Summaries>([{topic_name: "Test", topic_script: "Test Script"}, ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      const response = await fetch("/api/createSummary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ presentation }) ,
      });


      if (response.status === 200) {
        const result = await response.json();
        const res = result[0].message.content
        console.log("RES: " + res);
        setText(JSON.parse(res) as Summaries);
        const summaries = JSON.parse(res).topics;
        console.log(summaries.length);

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
            body: JSON.stringify({topic_name, topic_summary}),
          });
          const result2 = await response2.json();
          const res2 = result2[0].message.content;
          console.log(i + ": " + res2)
          script.append({topic_name, res2});
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
      <div className="flex flex-col bg-slate-500 w-[100vw] h-[50vh] overflow-scroll">
        {text.topics.map((obj) => (
          <div className="flex flex-row">
            <p><b>{obj.topic_name}</b>: {obj.topic_summary}</p>
          </div>
        ))}
      </div>
      <div className="flex bg-slate-300 w-[100vw] h-[50vh]">
        {script.map((obj) => (
          <div className="">
          <h1>{obj.topic_name}</h1>
          <p>{obj.topic_script}</p>
          </div>
        ))}
      </div>
      
      
    </div>
  );
}
