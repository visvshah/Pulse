// @ts-ignore
import { env } from "~/env.js";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};


const prompt = `You are a client that organizes information from college lecture transcripts. Given a transcript from a user, extract 5 essential topics and provide detailed summaries for each topic. You will also create a lecture title that descibes the overall idea covered throughout the topics. Ensure that the summaries capture the key information and any important supporting information.  Ensure each topic summary is lengthy and at least 3 sentences long. You will output the response as a json in the following format: {"lesson_title": string, "topics": {"topic_name": string, "topic_summary": string}[]}. Adhere by this JSON format exactly. Here are some examples:
{
  "lesson_title": "Introduction to Physics",
  "topics": [
    {
      "topic_name": "Kinematics",
      "topic_summary": "Kinematics explores the motion patterns of objects, emphasizing concepts such as position, velocity, and acceleration without delving into the forces causing the motion. It serves as the foundational framework for understanding how objects move in space and time."
    },
    {
      "topic_name": "Dynamics",
      "topic_summary": "Dynamics investigates the forces and torques causing motion, including the application of Newton's laws and the study of equilibrium in physical systems. This field is crucial for comprehending the underlying causes and behaviors of objects in motion."
    },
    {
      "topic_name": "Energy and Work",
      "topic_summary": "Energy and Work cover the various forms of energy in physical systems, including potential and kinetic energy, and delve into the concept of work done within these systems. This knowledge is fundamental to understanding the principles governing energy transformations in diverse physical phenomena."
    },
    {
      "topic_name": "Thermodynamics",
      "topic_summary": "Thermodynamics studies the principles governing heat, work, and energy transfer in systems, exploring concepts like entropy, temperature, and heat engines. It provides a comprehensive understanding of the macroscopic behavior of matter and energy, essential in fields ranging from engineering to chemistry."
    },
    {
      "topic_name": "Optics",
      "topic_summary": "Optics focuses on the behavior and properties of light, including reflection, refraction, and the formation of images, contributing to our understanding of vision and optical devices. This field plays a critical role in various applications, from designing lenses to developing technologies like lasers and cameras."
    }
  ]
}

{
  "lesson_title": "Basic Programming Concepts",
  "topics": [
    {
      "topic_name": "Variables and Data Types",
      "topic_summary": "Variables and Data Types introduce fundamental concepts in programming, teaching how to store and manipulate data through the use of variables and various data types. Understanding these concepts is essential for writing efficient and error-free code in any programming language."
    },
    {
      "topic_name": "Control Flow",
      "topic_summary": "Control Flow guides the flow of program execution through conditional statements and loops, providing the foundation for decision-making and iteration in programming. This control over the program's flow is crucial for implementing logic and creating dynamic, responsive software applications."
    },
    {
      "topic_name": "Functions",
      "topic_summary": "Functions play a crucial role in programming by allowing the definition and use of modular and reusable code, enhancing program structure and readability. They enable the abstraction of complex operations, promoting code organization and facilitating collaboration among developers."
    },
    {
      "topic_name": "Arrays and Lists",
      "topic_summary": "Arrays and Lists introduce the concept of storing multiple elements in a single variable, facilitating the efficient manipulation of collections of data in programming. These data structures are fundamental for handling and processing large datasets and organizing information in various applications."
    },
    {
      "topic_name": "Object-Oriented Programming (OOP)",
      "topic_summary": "Object-Oriented Programming (OOP) is a paradigm that structures code around objects, encapsulating data and behavior, providing a powerful and scalable approach to software development. OOP promotes code reuse, modularity, and the creation of robust, maintainable software systems."
    }
  ]
}

{
  "lesson_title": "World History: Ancient Civilizations",
  "topics": [
    {
      "topic_name": "Mesopotamia",
      "topic_summary": "Mesopotamia, the cradle of civilization, is explored, covering the emergence of early city-states, agricultural practices, and the development of complex social structures. This ancient region laid the foundation for human civilization and shaped the course of history through its innovative contributions."
    },
    {
      "topic_name": "Ancient Egypt",
      "topic_summary": "Ancient Egypt's rich history includes the reign of pharaohs, construction of pyramids, and the profound influence of the Nile River on shaping the society and culture of the time. The civilization's achievements in architecture, art, and governance continue to captivate scholars and enthusiasts alike."
    },
    {
      "topic_name": "Indus Valley Civilization",
      "topic_summary": "The Indus Valley Civilization is studied for its advanced urban culture and sophisticated technologies, providing insights into ancient Indian history and societal structures. With its intricate city planning and advanced drainage systems, this civilization represents a remarkable chapter in the ancient world."
    },
    {
      "topic_name": "Ancient China",
      "topic_summary": "Ancient China's history encompasses dynasties, philosophical contributions, and technological advancements, shaping the culture and governance of this ancient civilization. The enduring impact of Chinese civilization is evident in its philosophical traditions, art, and inventions such as paper and gunpowder."
    },
    {
      "topic_name": "Ancient Greece",
      "topic_summary": "Ancient Greece, known for its democracy, philosophy, and contributions to art and science, is explored to understand its lasting impact on Western civilization. The legacy of Greek philosophy, architecture, and democratic ideals continues to influence modern societies and intellectual thought."
    }
  ]
}

Use the above examples as both inspiration for what flavor to use and adhere to the format.
`

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


