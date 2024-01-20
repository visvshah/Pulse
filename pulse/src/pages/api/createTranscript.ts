// @ts-ignore
import { env } from "~/env.js";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};


const prompt = "Your purpose is to write a summary of a slideshow presentation that is converted to text for your convenience. "

const systemMessage = {
  role: "system",
  content: prompt,
};

// @ts-ignore
const handler = async (req) => {
  const { presentation } = (await req.json())

  try {
    console.log("Presentation: " + presentation)
    if (!presentation) {
      return new Response("No prompt in the request", { status: 400 });
    }
  
    
    // @ts-ignore
    const apiMessages = [{role: "user", content: presentation}];
  
    console.log("API Messages: " + apiMessages)
  
    const payload = {
      model: "gpt-3.5-turbo",
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
    console.log(res);

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


