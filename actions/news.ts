import axios from "axios";

export async function getArticles(query: string) {
  const response = await axios.get(`https://news.google.com/search?q=${query}`);

  const articles = response.data.match(/<article.*?<\/article>/gs);

  const headlines = articles.map((article: string) => {
    const aTags = article.match(/<a.*?<\/a>/gs);
    if (!aTags) return "";

    const text = aTags.map((a) => a.replace(/<.*?>/g, "")).join("");
    return text;
  });

  return headlines;
}
