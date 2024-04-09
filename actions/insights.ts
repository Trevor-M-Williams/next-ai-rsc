import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function generateCompanyData(name: string) {
  // call openai api
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a financial analyst researching a company.",
      },
      {
        role: "user",
        content: `
          You are researching company ${name}
          Give a brief overview and provide information on the company's recent financial performance.
          Return the data in JSON format as shown.

          {
            "overview": string,
            "financialOverview": string,
          }
        `,
      },
    ],
  });

  const data = response.choices[0].message.content;
  console.log(data);
  if (!data) {
    console.error("Failed to generate company data");
    return {
      overview: "",
      financialOverview: "",
    };
  }
  const parsedData = JSON.parse(data);
  return parsedData as CompanyData;
}
