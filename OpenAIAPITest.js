import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "Write a haiku about AI" },
  ],
});

completion.then((result) => console.log(result.choices[0].message));
