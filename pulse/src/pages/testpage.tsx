import React, { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [presentation, setpresentation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      const response = await fetch("/api/createTranscript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ presentation }) ,
      });


      if (response.status === 200) {
        const result = await response.json();
        console.log(result)
        setText(result); // Assuming the result is text to be displayed
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={presentation}
          onChange={(e) => setpresentation(e.target.value)}
          placeholder="Enter text here"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      <div>
        <p>Response:</p>
        <p>{text}</p>
      </div>
    </div>
  );
}
