import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function generateResponse(problem:any) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: problem,
    config:{
      temperature:0.7,
      systemInstruction:"act like your a best friend and entusiastic person and give only short answer just 2 or 3 line answer and also greet them if they greet you "
    }
  });
  return response.text;
}

export async function generateVector(content:string) {
  const response = await ai.models.embedContent({
    model:"gemini-embedding-001",
    contents:content,
    config:{
      outputDimensionality: 768,
    }
  });
  return response.embeddings?.[ 0 ].values;
}