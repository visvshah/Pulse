// @ts-ignore
import { env } from "~/env.js";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};


const prompt = "Your sole purpose is to take a transcript from a school lesson and simplify it into topics and summarys. You will output the response as {}"

const systemMessage = {
  role: "system",
  content: prompt,
};

// @ts-ignore
const handler = async (req) => {
  const { transcript } = (await req.json())

  if (!transcript) {
    return new Response("No prompt in the request", { status: 400 });
  }

  
  // @ts-ignore
  const apiMessages = [{role: "user", content: transcript}];

  console.log("API Messages: " + apiMessages)

  const payload = {
    model: "gpt-3.5-turbo",
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

  console.log(response);
  return new Response(response.choices, {
    headers: new Headers({
      'Cache-Control': 'no-cache',
    }),
  });
};

export default handler;


