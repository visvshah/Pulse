// @ts-ignore
import { env } from "~/env.js";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
    runtime: "edge",
  };


const prompt1 = `Imagine you're creating a captivating TikTok video script to explain`
const prompt2 = `. Your goal is to make it engaging, informative, and suitable for a short video format. Ensure the script is easy to understand and has a good flow. The script should be concise and suitable for a TikTok video duration. Use the following topic summary to guide the creation of the script: `

const systemMessage = {
  role: "system",
  content: "",
};

// @ts-ignore
const handler = async (req) => {
    console.log(req)
  const topic_name = await req.body.topic_name;
  const topic_summary = await req.body.topic_summary;

  try {
    if (!topic_name) {
      return new Response("No prompt in the request", { status: 400 });
    }
  
    const prompt = prompt1 + topic_name + prompt2 + topic_summary;
    systemMessage.content = prompt;
    // @ts-ignore
    const apiMessages = [{role: "user", content: prompt}];
  
  
    const payload = {
      model: "gpt-3.5-turbo-1106",
      temperature: 0.05,
      messages: [
        systemMessage, 
        ...apiMessages, 
      ],
    };
  
  
    const response = await fetch("https://api.openai.com/v1/chat/completions",
    {
        method: "POST",
        headers: {
        // @ts-ignore
        "Authorization": "Bearer " + (process.env.OPENAI_API_KEY as string),
        "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
    }).then((data) => {
        return data.json();
    });
    const res = await response.choices

    return new Response(JSON.stringify(res), {
      headers: new Headers({
        'Cache-Control': 'no-cache',
      }),
    });
  }
  catch (e: any) {
    console.log(e);
    return new Response(e.message || "Something went wrong", { status: 500 });
  }
 
};

export default handler;


