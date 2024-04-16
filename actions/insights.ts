"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function generateCompanyAnalysis(name: string) {
  const prompts = [
    "Give a brief overview of the company",
    "Give a brief overview of the company's financials",
  ];

  try {
    const promises = prompts.map((prompt) => {
      return openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: "You are an ai research analyst.",
          },
          {
            role: "user",
            content: `
              You are researching ${name}. ${prompt}
            `,
          },
        ],
      });
    });

    const responses = await Promise.all(promises);
    const data = responses.map(
      (response) => response.choices[0].message.content || ""
    );
    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function generateIndustryAnalysis(name: string) {
  const prompts = [
    "Give an overview of their industry including key players",
    "What are the key trends in their industry",
  ];

  try {
    const promises = prompts.map((prompt) => {
      return openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: "You are an ai research analyst.",
          },
          {
            role: "user",
            content: `
              You are researching ${name}. ${prompt}
            `,
          },
        ],
      });
    });

    const responses = await Promise.all(promises);
    const data = responses.map(
      (response) => response.choices[0].message.content || ""
    );
    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
