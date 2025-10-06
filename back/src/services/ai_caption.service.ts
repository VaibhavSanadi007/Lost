import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});


async function generateCaption(base64ImageFile:string) {
  
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "Caption this image." },
  ];
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config:{
    systemInstruction:`you are an expert who generates very good and impressive captions for image send only short captions less than 20 words
      generate only one caption please make it more interactice use 3 or 4 unbelivable like words
    `
  },
  });

  return response.text;
}


export default generateCaption;