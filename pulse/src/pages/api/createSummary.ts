// @ts-ignore
import { env } from "~/env.js";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};


const prompt = 'You are a client that organizes information from college lecture transcripts. Given a transcript from a user, extract 5 essential topics and provide detailed summaries for each topic. Ensure that the summaries capture the key information and any important supporting information.  Ensure each topic summary us lengthy and at least 6 sentences long. You will output the response as a json in the following format: {"lesson_title": string, "topics": {"topic_name": string, "topic_summary": string}[]}. '

const systemMessage = {
  role: "system",
  content: prompt,
};

// @ts-ignore
const handler = async (req) => {
  const { presentation } = await req.json()

  try {
    if (!presentation) {
      return new Response("No prompt in the request", { status: 400 });
    }
  
    
    // @ts-ignore
    const apiMessages = [{role: "user", content: presentation}];
  
  
    const payload = {
      model: "gpt-3.5-turbo-1106",
      temperature: 0.05,
      response_format: { type: "json_object" },
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

    console.log("Summary:" + res)
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


