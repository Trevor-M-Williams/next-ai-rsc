"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function generateCompanyAnalysis(name: string) {
  const prompts = [
    "Give a detailed overview of the company including history, vision, products/services, and market position.",
  ];

  try {
    const promises = prompts.map((prompt) => {
      return openai.chat.completions.create({
        model: "gpt-3.5-turbo",
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

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function generateIndustryAnalysis(name: string) {
  const prompts = [
    "Give a detailed overview of their industry including key players and trends",
  ];

  try {
    const promises = prompts.map((prompt) => {
      return openai.chat.completions.create({
        model: "gpt-3.5-turbo",
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

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
