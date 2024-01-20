// @ts-nocheck
import React, { useState } from "react";

export default function Home() {
  const [text, setText] = useState([{}]);
  const [presentation, setpresentation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      const response = await fetch("/api/createScripts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ presentation }) ,
      });


      if (response.status === 200) {
        const result = await response.json();
        console.log(result)
        const res = result[0].message.content
        console.log("RES: " + res);
        setText(JSON.parse(res).topics);
        console.log(res.topics);
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
      <div>
        {JSON.stringify(text)}
      </div>
      {text.map((obj) => {
        <div>
        <h1>{obj.topic_name}</h1>
        <h1>{obj.topic_summary}</h1>
        </div>
      })}
      
    </div>
  );
}
