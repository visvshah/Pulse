// @ts-ignore
import { env } from "~/env.js";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};


const prompt1 = `Imagine you're creating a captivating social media video script to explain `
const prompt2 = `. Your goal is to make it engaging and informative. Ensure the script is easy to understand and has a good flow. Make each script lengthy, being around 6 sentences. Do not include any narration or stage directions. Do not include emojis, hashtags, or the name TikTok in your script. Use the following topic summary to guide the creation and content of the script: `

const systemMessage = {
  role: "system",
  content: "",
};

// @ts-ignore
const handler = async (req) => {
  const { topic_name, topic_summary} = await req.json()

  try {
    systemMessage.content = prompt1 + topic_name + prompt2 + topic_summary;
    
    // @ts-ignore
    const apiMessages = [{role: "user", content: systemMessage.content}];
  
  
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
    console.log(response)
    const res = await response.choices
    console.log("SCRIPTS:" + res)
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


