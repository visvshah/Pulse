// @ts-ignore
import { env } from "~/env.js";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};


const prompt = 'Your sole purpose is to take a transcript from a school lesson and simplify it into topics and summaries. You will output the response as {"topics": {"topic_name": string, "topic_summary": string}[]}. Find the 10 most prevelant topics and include a long, in-depth summary of each one. Ensure these summaries at at least 8 sentences long. Ensure The user will supply the transcript.'

const systemMessage = {
  role: "system",
  content: prompt,
};

// @ts-ignore
const handler = async (req) => {
  const { presentation } = (await req.json())

  try {
    if (!presentation) {
      return new Response("No prompt in the request", { status: 400 });
    }
  
    
    // @ts-ignore
    const apiMessages = [{role: "user", content: presentation}];
  
  
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


