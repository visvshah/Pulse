import { OpenAIStream, OpenAIStreamPayload} from "../../utils/OpenAIStream";
import { env } from "~/env.js";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

interface ChatGPTMessage {
  sender: string;
  message: string;
}
const prompt = " "

const systemMessage = {
  role: "system",
  content: prompt,
};

const handler = async (req: Request): Promise<Response> => {
  const { messages } = (await req.json()) as {
    messages?: ChatGPTMessage[];
    itineraryToBeEdited?: string;
  };

  if (!messages) {
    return new Response("No prompt in the request", { status: 400 });
  }

  // Update the system message content with tripjson
  
  const apiMessages = messages.map((messageObject) => {
    let role = "";
    if (messageObject.sender === "ChatGPT") {
      role = "assistant";
    } else {
      role = "user";
    }
    return { role: role, content: messageObject.message };
  });

  

  // Get the request body set up with the model we plan to use
  // and the messages which we formatted above. We add a system message in the front to
  // determine how we want chatGPT to act.
  const payload = {
    model: "gpt-3.5-turbo",
    temperature: 0.05,
    stream: true,
    messages: [
      systemMessage, // The system message DEFINES the logic of our chatGPT
      ...apiMessages, // The messages from our chat with ChatGPT
    ],
  };

  const stream = await OpenAIStream(payload);

  // return stream response (SSE)
  return new Response(stream, {
    headers: new Headers({
      'Cache-Control': 'no-cache',
    }),
  });
};

export default handler;