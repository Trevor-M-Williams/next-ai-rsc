"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function generateCompanyAnalysis(name: string) {
  console.time("2.1");
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

    console.timeEnd("2.1");
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function generateIndustryAnalysis(name: string) {
  console.time("2.2");
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

    console.timeEnd("2.2");
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
