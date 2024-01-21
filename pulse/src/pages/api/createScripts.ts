// @ts-ignore
import { env } from "~/env.js";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};


const prompt1 = `Imagine you're creating a captivating social media video script to explain `
const prompt2 = `. Your goal is to make it engaging and informative. Ensure the script is easy to understand and has a good flow. Make each script quick and short, no more than 2-3 sentences. Do not include any narration or stage directions. Do not include emojis, hashtags, or the name TikTok in your script.
Question: The lecture delves into the concept of skepticism in philosophy, questioning what individuals really know. Professor McGinn argues that everyone has an inner philosopher, a voice that prompts them to ponder abstract and general questions about the ultimate nature of the world, the self, free will, the mind-body relationship, knowledge, ethical truth, the meaning of life, and the existence of God. He emphasizes the importance of having an experienced guide to navigate through these philosophical questions, as they have been pondered by great minds for thousands of years. The lecture also explores the idea that individuals become interested in philosophy at a certain age, when they are capable of taking an interest in these questions if presented in an engaging and relevant manner. McGinn shares his personal experience of awakening to philosophical questions in his late teenage years, highlighting the potential for others to have their interest awakened and pursue a solid foundation in philosophy. The course structure is designed to cover all the main problems of philosophy, from the nature of logic to ethics, the human mind, and the existence of God, providing various points of view on these topics. McGinn acknowledges that these age-old philosophical questions have not been definitively resolved, but rather contribute to a clarification of issues and a furthering of ideas.
Answer: Do you know that deep down, we all have an inner philosopher? This is what urges us to contemplate the fundamental nature of the world, the self, free will, the mind-body relationship, knowledge, ethical truth, the meaning of life, and the existence of God. Having a knowledgeable guide to help us navigate through these profound philosophical questions is essential. People tend to become interested in philosophy at a certain age when they are ready to engage with these questions meaningfully.
Question: The lecture presents various forms of skepticism, including skepticism about the external world, the problem of other minds, solipsism, and the problem of induction. It discusses the radical and disturbing nature of skepticism, questioning the justification for beliefs about the external world, other minds, and the uniformity of nature. The concept of solipsism of the moment is introduced, suggesting that the only thing one can know to exist is oneself in the present moment. The lecture also explores Descartes' famous Latin tag, 'Cogito ergo sum,' emphasizing the idea that the only thing one cannot doubt is the awareness of one's own thinking, leading to the conclusion that one exists. The lecture raises the question of the relationship between knowledge and happiness, highlighting the impact of skepticism on the unification between the self and the external world, and the potential confinement of consciousness to a subjective world.
Answer: Different types of skepticism question the justification for beliefs about the topics and discuss the radical and disturbing nature of skepticism itself. Solipsism suggests that the only thing one can know to exist is oneself in the present moment. Descartes' famous Latin tag, 'Cogito ergo sum,' emphasizes the idea that the only thing one cannot doubt is the awareness of one's own thinking, leading to the conclusion that one exists. What do you think about the relationship between knowledge and happiness? 
Question: The lecture concludes by addressing the nature of knowledge and the definition of knowledge. It highlights the importance of knowledge as a unification between the self and the external world, enabling individuals to be in contact with things beyond themselves. The concept of consciousness as a window onto the world is contrasted with the idea of consciousness as a prison, leading to the alarming consequence of metaphysical solitary confinement if skepticism cannot be refuted. The stakes are presented as high in skepticism, as individuals may be condemned to a subjective world and unable to escape beyond themselves. The lecture sets the stage for the next lecture, which will delve into the definition and analysis of knowledge.
Answer: Knowledge serves as a bridge between ourselves and the external world, allowing us to connect with things beyond our immediate experiences, unlocking the door to understanding the world around us. Consciousness provides us with a clear view of reality but it can also serve as a prison, leading to a sense of isolation and confinement if skepticism cannot be overcome. The stakes are high in this discussion, as skepticism could potentially trap us in a subjective world, cutting us off from the broader reality.
Question: Statistics, as defined by the American Statistical Association (ASA), is the science of learning from data and of measuring, controlling, and communicating uncertainty. It is a fundamental method that applies wherever data, variation, and chance appear, making it an independent discipline with its own core ideas rather than just a branch of mathematics. The three primary branches of statistics are data collection, cleaning, and storage; descriptive statistics; and inferential statistics. The educational goals of a statistics course typically include developing statistical skills, statistical literacy, statistical reasoning, and statistical thinking. Additionally, statistics involves components such as data collection, organization, analysis, and interpretation.
Answer: Statistics is not just about numbers; it's about understanding the world around us. When we talk about statistics, we're looking at three primary branches: data collection, cleaning, and storage; descriptive statistics; and inferential statistics. These branches help us make sense of the information we gather and draw meaningful conclusions. It is important to develop statistical skills, statistical literacy, statistical reasoning, and statistical thinking.
Question: A statistician, according to the American Statistical Association (ASA), is a person who applies statistical thinking and methods to various scientific, social, and business endeavors in fields such as astronomy, biology, education, economics, engineering, genetics, marketing, medicine, psychology, public health, and sports. Statisticians play a crucial role in guiding for determining reliable information and trustworthy predictions. They are consulted to search for clues to solve scientific mysteries and prevent investigators from being misled by false impressions. Statisticians are essential in ensuring the accuracy and validity of data analysis and interpretation in various disciplines.
Answer: Have you ever wondered about the role of a statistician? They are like detectives, searching for clues to solve scientific mysteries and prevent investigators from being misled by false impressions. In essence, statisticians are essential in ensuring the accuracy and validity of data analysis and interpretation in various disciplines. So, the next time you see a compelling statistic or prediction, remember that a statistician might be behind it, working hard to ensure its reliability and accuracy.
Question: In statistics, a population refers to the entire collection of individuals or objects being studied, while a sample is a subset of the population, representing a small selection of individuals or objects. Probability calculations involve making assumptions about certain characteristics of the population and answering questions concerning a sample from the population. On the other hand, statistical inference involves using information from a sample to conclude the population. An example provided in the transcript illustrates the process of moving from population to sample and from sample to population, demonstrating the practical application of these concepts in statistical analysis.
Answer: In statistics, a population refers to the entire group of individuals or objects being studied. On the other hand, a sample is a smaller subset of the population, representing a small selection of individuals or objects. When it comes to probability calculations, we're making assumptions about certain characteristics of the population and answering questions concerning a sample from that population. 
Question: Statistics is used in various disciplines such as astronomy, biology, education, economics, engineering, genetics, marketing, medicine, psychology, public health, and sports. Statisticians are consulted to guide these fields, particularly in data collection, organization, analysis, and interpretation. Additionally, statistics is applied in developing statistical skills, statistical literacy, statistical reasoning, and statistical thinking. The practical application of statistics is demonstrated through examples of probability calculations and statistical inference, showcasing its relevance in solving real-world problems and making informed decisions based on data analysis.
Answer: Statistics plays a crucial role in various disciplines to guide data collection, organization, analysis, and interpretation. Moreover, statistics is not just about numbers; it's about developing statistical skills, literacy, reasoning, and thinking. These skills are essential for making informed decisions based on data analysis. For example, in sports, statistics are used to analyze player performance and make strategic decisions. In medicine, statistics help in evaluating the effectiveness of treatments and understanding disease patterns.
Question: `
const prompt3 = `
Answer: `
const systemMessage = {
  role: "system",
  content: "",
};

// @ts-ignore
const handler = async (req) => {
  const { topic_name, topic_summary} = await req.json()

  try {
    systemMessage.content = prompt1 + topic_name + prompt2 + topic_summary + prompt3;
    
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


